/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4zftchp7yppc0")

  // add short_description field
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "short_desc_field",
    "name": "short_description",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": 70,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4zftchp7yppc0")

  // remove short_description field
  collection.schema.removeField("short_desc_field")

  return dao.saveCollection(collection)
})