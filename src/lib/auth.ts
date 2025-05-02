import { NextRequest } from "next/server";

// Temporary stub for development
export async function authenticate(req: NextRequest) {
  // Simulate a user session; replace with real logic later
  return {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
  };

  // Or if unauthenticated:
  // throw new Error("Unauthorized");
}
