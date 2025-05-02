// src/app/api/users/[id]/route.ts

import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  // You can now fetch the user from DB or return a mock response
  return new Response(JSON.stringify({ id: userId, name: "John Doe" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
