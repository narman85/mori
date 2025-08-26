/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7woyagob5z34lt0") // order_items collection
  
  // Update the collection schema to make product field optional
  for (let i = 0; i < collection.schema.length; i++) {
    if (collection.schema[i].name === "product") {
      // Make product field optional (not required)
      collection.schema[i].required = false
      
      // Update options to allow null/empty values
      if (collection.schema[i].options) {
        collection.schema[i].options.minSelect = null
        collection.schema[i].options.cascadeDelete = false
      }
      
      console.log("✅ Updated product field to be optional in order_items")
      break
    }
  }

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7woyagob5z34lt0")
  
  // Revert changes
  for (let i = 0; i < collection.schema.length; i++) {
    if (collection.schema[i].name === "product") {
      collection.schema[i].required = true
      if (collection.schema[i].options) {
        collection.schema[i].options.minSelect = 1
      }
      break
    }
  }

  return dao.saveCollection(collection)
})