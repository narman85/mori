/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4nvumk3bkkki5")

  collection.viewRule = null

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("az4nvumk3bkkki5")

  collection.viewRule = "@request.auth.id = user.id || @request.auth.role = 'admin'"

  return dao.saveCollection(collection)
})
