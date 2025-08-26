/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("orders");

  // Update existing user field to make it optional
  collection.schema.getFieldById("yxquqj9q").required = false;

  // Add guest_email field
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "guest_email_field",
    "name": "guest_email",
    "type": "email",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }));

  // Add guest_name field
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "guest_name_field",
    "name": "guest_name",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }));

  // Add guest_phone field
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "guest_phone_field",
    "name": "guest_phone",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }));

  // Update rules to allow guest orders - more permissive rules
  collection.listRule = null; // Allow anyone to list their own orders
  collection.viewRule = null; // Allow anyone to view their own orders  
  collection.createRule = null; // Allow anyone to create orders
  collection.updateRule = "@request.auth.role = 'admin'";
  collection.deleteRule = "@request.auth.role = 'admin'";

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("orders");

  // Remove the new fields
  collection.schema.removeField("guest_email");
  collection.schema.removeField("guest_name");
  collection.schema.removeField("guest_phone");

  // Restore user field as required
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yxquqj9q",
    "name": "user",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": 1,
      "maxSelect": 1,
      "displayFields": null
    }
  }));

  // Restore original rules
  collection.listRule = "@request.auth.id = user.id || @request.auth.role = 'admin'";
  collection.viewRule = "@request.auth.id = user.id || @request.auth.role = 'admin'";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "@request.auth.role = 'admin'";
  collection.deleteRule = "@request.auth.role = 'admin'";

  return dao.saveCollection(collection);
})