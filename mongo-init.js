db.createUser({
  user: "root",
  pwd: "password123",
  roles: [
    {
      role: "readWrite",
      db: "chifoumi",
    },
  ],
});

db = db.getSiblingDB("chifoumi");

db.createCollection("users");

db.users.createIndex({ username: 1 }, { unique: true });
