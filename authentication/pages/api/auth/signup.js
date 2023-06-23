import { connectDatabase, getUser } from "../../../lib/db";
import { hashedPassword } from "../../../lib/password-helper";
export default async (req, res) => {
  if (req.method !== "POST") return;

  try {
    const client = await connectDatabase();
    const { email, password } = req.body;

    if (!email || !email.includes("@") || !password || password.length < 6) {
      res.status(422).json({
        message:
          "Invalid input. Your password needs to have atleast 7 characters.",
      });
      return;
    }

    const existingUser = await getUser(client, "auth", "users", email);

    if (existingUser) {
      res.status(422).json({ message: "This user already exists." });
      return;
    }

    const passwordHashed = await hashedPassword(password);
    const db = client.db("auth")

    const createdUser = await db.collection("users").insertOne({
      password: passwordHashed,
      email: email,
    });

    res.status(201).json({ message: "User created with success." });
  } catch (err) {
    res.status(422).json({ message: err.message || "Cannot create the user." });
  }
};
