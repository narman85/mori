/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  // Fix users collection permissions for admin access
  const usersCollection = dao.findCollectionByNameOrId("users");
  
  // Allow admins to list all users, regular users can only see themselves
  usersCollection.listRule = "@request.auth.id != '' && (@request.auth.role = 'admin' || id = @request.auth.id)";
  // Allow admins to view all users, regular users can view themselves
  usersCollection.viewRule = "@request.auth.id != '' && (@request.auth.role = 'admin' || id = @request.auth.id)";
  // Keep create rule as is (public registration)
  // usersCollection.createRule unchanged
  // Only admins can update any user, users can update themselves
  usersCollection.updateRule = "@request.auth.id != '' && (@request.auth.role = 'admin' || id = @request.auth.id)";
  // Only admins can delete users
  usersCollection.deleteRule = "@request.auth.role = 'admin'";

  return dao.saveCollection(usersCollection);
}, (db) => {
  const dao = new Dao(db);
  const usersCollection = dao.findCollectionByNameOrId("users");
  
  // Restore default permissions
  usersCollection.listRule = "id = @request.auth.id";
  usersCollection.viewRule = "id = @request.auth.id";
  usersCollection.updateRule = "id = @request.auth.id";
  usersCollection.deleteRule = "id = @request.auth.id";
  
  return dao.saveCollection(usersCollection);
})