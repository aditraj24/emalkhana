import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      officerId: string;
      name: string;
    };
  }

  interface User {
    id: string;
    role: string;
    officerId: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    officerId: string;
  }
}
