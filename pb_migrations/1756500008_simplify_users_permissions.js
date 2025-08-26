/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");

  // Simplify permissions - any authenticated user can list/view users
  collection.listRule = "@request.auth.id != ''";
  collection.viewRule = "@request.auth.id != ''";
  collection.updateRule = "id = @request.auth.id";
  collection.deleteRule = "@request.auth.role = 'admin'";

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("users");
  
  // Restore previous permissions
  collection.listRule = "@request.auth.id != '' && (@request.auth.role = 'admin' || id = @request.auth.id)";
  collection.viewRule = "@request.auth.id != '' && (@request.auth.role = 'admin' || id = @request.auth.id)";
  collection.updateRule = "@request.auth.id != '' && (@request.auth.role = 'admin' || id = @request.auth.id)";
  collection.deleteRule = "@request.auth.role = 'admin'";
  
  return dao.saveCollection(collection);
})