/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  // Fix orders collection - allow public access
  const ordersCollection = dao.findCollectionByNameOrId("orders");
  ordersCollection.createRule = "";
  return dao.saveCollection(ordersCollection);
  
}, (db) => {
  const dao = new Dao(db);
  const ordersCollection = dao.findCollectionByNameOrId("orders");
  ordersCollection.createRule = "@request.auth.id != ''";
  return dao.saveCollection(ordersCollection);
})