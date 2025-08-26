/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("products");

  // Allow stock updates for orders - more permissive rule for stock field only
  collection.updateRule = "@request.auth.role = 'admin' || (@request.data.stock:isset && @request.data:length = 1)";

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("products");

  // Restore original rules
  collection.updateRule = "@request.auth.role = 'admin'";

  return dao.saveCollection(collection);
})