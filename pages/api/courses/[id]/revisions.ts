// pages/api/courses/[id]/revisions.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid course ID" });
  }

  const courseId = parseInt(id);

  if (isNaN(courseId)) {
    return res.status(400).json({ error: "Course ID must be a valid number" });
  }

  try {
    const revisions = await prisma.courseRevision.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(revisions);
  } catch (error) {
    console.error("Error fetching revisions:", error);
    return res.status(500).json({ error: "Failed to fetch revisions" });
  }
}
