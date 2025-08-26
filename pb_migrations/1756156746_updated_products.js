/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4zftchp7yppc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "preparation_1756156746830",
    "name": "preparation",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4zftchp7yppc0")

  // remove
  collection.schema.removeField("preparation_1756156746830")

  return dao.saveCollection(collection)
})
