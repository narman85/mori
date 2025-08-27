/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = db.getCollection('az4zftchp7yppc0') // products collection
  
  // Add images field as JSON to store array of URLs
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "images_urls",
    "name": "images",
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
  const collection = db.getCollection('az4zftchp7yppc0')
  collection.schema.removeField("images_urls")
  return dao.saveCollection(collection)
})