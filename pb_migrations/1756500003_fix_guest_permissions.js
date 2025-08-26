/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  // Fix orders collection
  const ordersCollection = dao.findCollectionByNameOrId("orders");
  ordersCollection.listRule = "";
  ordersCollection.viewRule = "";  
  ordersCollection.createRule = "";
  ordersCollection.updateRule = "@request.auth.role = 'admin'";
  ordersCollection.deleteRule = "@request.auth.role = 'admin'";
  dao.saveCollection(ordersCollection);

  // Fix order_items collection
  const orderItemsCollection = dao.findCollectionByNameOrId("order_items");
  orderItemsCollection.listRule = "";
  orderItemsCollection.viewRule = "";
  orderItemsCollection.createRule = "";
  orderItemsCollection.updateRule = "@request.auth.role = 'admin'";
  orderItemsCollection.deleteRule = "@request.auth.role = 'admin'";
  dao.saveCollection(orderItemsCollection);

  // Fix products collection for stock updates
  const productsCollection = dao.findCollectionByNameOrId("products");
  productsCollection.updateRule = "@request.auth.role = 'admin' || @request.data.stock:isset";
  dao.saveCollection(productsCollection);

}, (db) => {
  // Rollback - restore restrictive permissions
  const dao = new Dao(db);
  
  const ordersCollection = dao.findCollectionByNameOrId("orders");
  ordersCollection.listRule = "@request.auth.id = user.id || @request.auth.role = 'admin'";
  ordersCollection.viewRule = "@request.auth.id = user.id || @request.auth.role = 'admin'";
  ordersCollection.createRule = "@request.auth.id != ''";
  dao.saveCollection(ordersCollection);

  const orderItemsCollection = dao.findCollectionByNameOrId("order_items");
  orderItemsCollection.listRule = "@request.auth.id = order.user.id || @request.auth.role = 'admin'";
  orderItemsCollection.viewRule = "@request.auth.id = order.user.id || @request.auth.role = 'admin'";
  orderItemsCollection.createRule = "@request.auth.id != ''";
  dao.saveCollection(orderItemsCollection);

  const productsCollection = dao.findCollectionByNameOrId("products");
  productsCollection.updateRule = "@request.auth.role = 'admin'";
  dao.saveCollection(productsCollection);
})