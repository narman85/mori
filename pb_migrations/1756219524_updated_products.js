/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4zftchp7yppc0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hidden_field",
    "name": "hidden",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4zftchp7yppc0")

  // remove
  collection.schema.removeField("hidden_field")

  return dao.saveCollection(collection)
})
