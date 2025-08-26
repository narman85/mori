/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4nvumk3bkkki5")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gkzhx2zz",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4nvumk3bkkki5")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gkzhx2zz",
    "name": "status",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
