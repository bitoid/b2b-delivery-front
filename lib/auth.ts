import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `https://b2bapi-73c651c12de9.herokuapp.com/api/login/`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const user = await res.json();

        if (res.ok && user) {
          return user; // Wrap the user object in another object
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Add the entire user object to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any; // Add the user object from the token to the session
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default authOptions;
