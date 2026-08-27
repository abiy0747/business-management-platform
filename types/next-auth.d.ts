import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      businessId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    businessId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    businessId: string;
  }
}