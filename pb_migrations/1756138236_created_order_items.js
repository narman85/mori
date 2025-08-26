/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "7woyagob5z34lt0",
    "created": "2025-08-25 16:10:36.138Z",
    "updated": "2025-08-25 16:10:36.138Z",
    "name": "order_items",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qaphena1",
        "name": "order",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "az4nvumk3bkkki5",
          "cascadeDelete": true,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fdz7m6te",
        "name": "product",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "az4zftchp7yppc0",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "mjmoucod",
        "name": "quantity",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "qzyazh21",
        "name": "price",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id = order.user.id || @request.auth.role = 'admin'",
    "viewRule": "@request.auth.id = order.user.id || @request.auth.role = 'admin'",
    "createRule": "@request.auth.id != ''",
    "updateRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7woyagob5z34lt0");

  return dao.deleteCollection(collection);
})
