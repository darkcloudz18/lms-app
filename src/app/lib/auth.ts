// src/lib/auth.ts

import { NextRequest } from "next/server";

export async function authenticate(req: NextRequest) {
  return { id: "test-user" }; // stub user
}
