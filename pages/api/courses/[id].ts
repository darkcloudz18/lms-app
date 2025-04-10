import { NextApiRequest, NextApiResponse } from "next";
import { parseForm } from "@/lib/formidable"; // For handling file uploads
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { PrismaClient } from "@prisma/client";

const uploadsDir = path.join(process.cwd(), "public/uploads");

export const config = {
  api: {
    bodyParser: false, // Disable body parser so we can handle the file uploads manually
  },
};

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      let body: any = {};
      let files: any = {};

      // Manually parse form data (application/json and multipart/form-data)
      if (req.headers["content-type"]?.includes("application/json")) {
        body = await new Promise((resolve, reject) => {
          let data = "";
          req.on("data", (chunk) => {
            data += chunk;
          });
          req.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        });
      } else if (req.headers["content-type"]?.includes("multipart/form-data")) {
        // Use formidable to parse the form if it contains files
        const { fields, files: parsedFiles } = await parseForm(req);
        body = fields;
        files = parsedFiles;
      }

      console.log("Received body:", body); // Log to verify the body structure
      console.log("Received files:", files); // Log to verify file data

      const { archived, title, description } = body; // Extract fields

      if (typeof archived === "undefined") {
        return res.status(400).json({ error: "Archived status is required" });
      }

      const courseId = Number(id);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }

      // Find the existing course
      const existingCourse = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!existingCourse) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Handle image if any
      let imageUrl: string | null = existingCourse.imageUrl ?? null;
      if (files.image && Array.isArray(files.image)) {
        const filename = path.basename(files.image[0].filepath);
        const targetPath = path.join(uploadsDir, filename);
        await fsp.copyFile(files.image[0].filepath, targetPath);
        imageUrl = `/uploads/${filename}`;
      }

      // Update the course with new data
      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: {
          title: String(title),
          description: String(description),
          archived: archived === true, // Ensure archived is a boolean value
          imageUrl, // Include imageUrl if a new image is uploaded
        },
      });

      return res.status(200).json(updatedCourse); // Respond with the updated course
    } catch (error) {
      console.error("Error updating course:", error);
      return res.status(500).json({ error: "Failed to update course" });
    }
  }

  // Handle GET request for course data
  if (req.method === "GET") {
    try {
      const course = await prisma.course.findUnique({
        where: { id: Number(id) },
      });
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      return res.status(200).json(course); // Send the course data as response
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch course" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
