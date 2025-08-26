/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("order_items");

  // Update rules to allow guest orders - more permissive
  collection.listRule = null; // Allow anyone
  collection.viewRule = null; // Allow anyone
  collection.createRule = null; // Allow anyone to create order items
  collection.updateRule = "@request.auth.role = 'admin'";
  collection.deleteRule = "@request.auth.role = 'admin'";

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("order_items");

  // Restore original rules
  collection.listRule = "@request.auth.id = order.user.id || @request.auth.role = 'admin'";
  collection.viewRule = "@request.auth.id = order.user.id || @request.auth.role = 'admin'";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "@request.auth.role = 'admin'";
  collection.deleteRule = "@request.auth.role = 'admin'";

  return dao.saveCollection(collection);
})