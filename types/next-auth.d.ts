import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      token: string;
      user_data: {
        /** The user's name. */
        token: string;
        username: string;
        user_type: string;
        profile: any;
      };
    };
  }
}
