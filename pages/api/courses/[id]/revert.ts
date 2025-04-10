// pages/api/courses/[id]/revert.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { revisionId } = req.body;

    try {
      // Find the selected revision
      const revision = await prisma.courseRevision.findUnique({
        where: { id: revisionId },
      });

      if (!revision) {
        return res.status(404).json({ error: "Revision not found" });
      }

      // Update course with the revision data
      await prisma.course.update({
        where: { id: revision.courseId },
        data: {
          title: revision.title,
          description: revision.description,
          imageUrl: revision.imageUrl ?? null,
        },
      });

      return res.status(200).json({ message: "Course reverted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to revert course" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
