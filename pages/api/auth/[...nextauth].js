import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "../../../Models/UserModel";
import dbConnect from "../../../config/dbConnect";

export default NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const payload = {
          email: credentials.email,
          password: credentials.password,
        };

        dbConnect();

        const { email, password } = payload;

        if (!email || !password) {
          throw new Error("Please Enter Email or Password");
        }

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
          throw new Error("User not exists");
        }

        if (!(await user.comparePasswords(password))) {
          throw new Error("Invalid Email or Password");
        }
        user.password = undefined;

        return user;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // if (account && user) {
      //   token.accessToken = account.access_token;
      // }
      // if (user) {
      //   token.user = user;
      // }
      if (user) {
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      // console.log("session", session, token);
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});
