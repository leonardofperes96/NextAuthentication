import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDatabase, getUser } from "../../../lib/db";
import { checkPassword, hashedPassword } from "../../../lib/password-helper";
export default async (req, res) => {
  if (req.method !== "PATCH") return;

  //check if have a user session
  const session = await getServerSession(req, res, authOptions);

  //if it doenst have. throw an json status with error
  if (!session) {
    res.status(401).json({ message: "User not authenticated." });
    return;
  }

  // get the user Email
  const userEmail = session.user.email;

  // get both old and new password from inputs
  const { oldPassword, newPassword } = req.body;

  // connect to the db
  const client = await connectDatabase();
  const db = client.db("auth");

  // get the user credentials
  const user = await getUser(client, "auth", "users", userEmail);

  // check if doesnt have user
  if (!user) {
    res.status(422).json({ message: "User not found." });
    return;
  }

  // get the curr password and compare with the old to see if it is true
  const currPassword = user.password;

  const passwordEqual = await checkPassword(oldPassword, currPassword);

  // if password are not equal, throw an json message with err status
  if (!passwordEqual) {
    res.status(403).json({ message: "You dont have permission." });
    return;
  }

  const passwordHashed = await hashedPassword(newPassword);

  const result = await db.collection("users").updateOne(
    { email: userEmail },
    {
      $set: {
        password: passwordHashed,
      },
    }
  );

  res.status(200).json({ message: "Password updated!" });
};
