import NextAuth, { DefaultSession } from "next-auth";
import "next-auth/jwt";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string; // ✅ Add role to session
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string; // ✅ Add role to user
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // ✅ Add role to JWT token
  }
}
