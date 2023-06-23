import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDatabase, getUser } from "../../../lib/db";
import { checkPassword } from "../../../lib/password-helper";
export const authOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        const client = await connectDatabase();
        const user = await getUser(client, "auth", "users", credentials.email);

        if (!user) {
          throw new Error("User not found.");
        }

        const isValid = await checkPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid Credentials.");
        }

        return { email: user.email };
      },
    }),
  ],
};

export default NextAuth(authOptions);
