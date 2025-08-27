/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = db.getCollection('jxmgo7tyvq5qqjf') // orders collection
  
  // Add oauth_user_id field to store OAuth user references
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oauth_user_id",
    "name": "oauth_user_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const collection = db.getCollection('jxmgo7tyvq5qqjf')
  collection.schema.removeField("oauth_user_id")
  return dao.saveCollection(collection)
})