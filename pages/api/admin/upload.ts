import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/app/lib/supabase/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename, base64 } = req.body;

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(filename, Buffer.from(base64, "base64"), {
      contentType: "image/png", // or your file type
      upsert: true,
    });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ data });
}
