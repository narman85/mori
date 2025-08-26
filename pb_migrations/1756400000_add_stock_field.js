/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4zftchp7yppc0") // products collection

  // Add stock field
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "stock_field",
    "name": "stock",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4zftchp7yppc0")
  
  // Remove stock field
  for (let i = 0; i < collection.schema.length; i++) {
    if (collection.schema[i].name === "stock") {
      collection.schema.splice(i, 1)
      break
    }
  }

  return dao.saveCollection(collection)
})