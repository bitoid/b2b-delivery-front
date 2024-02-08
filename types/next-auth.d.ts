// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      token: string;
      user_data: {
        id: number;
        username: string;
        is_staff: boolean;
        profile: {
          id: number;
          name: string;
          representative_full_name?: string; //client
          email: string;
          phone_number: string;
          addresses?: string; //cleint
        };
        user_type: string;
      };
    };
  }
}
