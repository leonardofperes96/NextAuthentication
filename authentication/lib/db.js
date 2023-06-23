import clientPromise from "./mongodb";
export const connectDatabase = async () => {
  let client;
  try {
    client = await clientPromise;
  } catch (err) {
    throw new Error("Cannot connect to the database.");
  }

  return client;
};

export const getUser = async (client, database, collection, email) => {
  const db = await client.db(database);
  const existingUser = await db.collection(collection).findOne({
    email: email,
  });
  return existingUser;
};
