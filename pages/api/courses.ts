// pages/api/courses/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { parseForm } from "@/lib/formidable";
import path from "path";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import fsp from "fs/promises";

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser so we can handle it manually
  },
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { archived } = req.query;

      // Adjust the logic to handle archived query param
      const courses = await prisma.course.findMany({
        where: {
          archived: archived === "true" ? true : false, // Ensure archived is properly checked
        },
      });

      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res.status(500).json({ error: "Failed to fetch courses" });
    }
  }

  if (req.method === "POST") {
    try {
      const { fields, files } = await parseForm(req);
      const { title, description, instructorId } = fields;

      let imageUrl: string | null = null;

      // Handle image upload
      if (files.image && Array.isArray(files.image)) {
        const tempPath = files.image[0].filepath;
        const filename = path.basename(tempPath);
        const uploadsDir = path.join(process.cwd(), "public/uploads");

        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const targetPath = path.join(uploadsDir, filename);
        await fsp.copyFile(tempPath, targetPath);
        imageUrl = `/uploads/${filename}`;
      }

      const newCourse = await prisma.course.create({
        data: {
          title: String(title),
          description: String(description),
          instructorId: Number(instructorId),
          imageUrl,
        },
      });

      return res.status(201).json(newCourse);
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
