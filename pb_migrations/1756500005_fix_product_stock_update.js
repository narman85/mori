/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("products");

  // Allow stock updates without authentication - open rule for stock field
  collection.updateRule = "";

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("products");
  collection.updateRule = "@request.auth.role = 'admin'";
  return dao.saveCollection(collection);
})