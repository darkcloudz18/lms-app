// /pages/api/courses/[id]/lessons/order.ts

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { courseId, orderedLessons } = req.body;

  if (req.method === "PUT") {
    try {
      const { lessonsOrder } = req.body; // Assume lessonsOrder is an array of lesson IDs in the new order

      // Update the lessons order in the database
      for (let i = 0; i < lessonsOrder.length; i++) {
        await prisma.lesson.update({
          where: { id: lessonsOrder[i] },
          data: { order: i + 1 }, // assuming the 'order' field determines the lesson order
        });
      }

      return res
        .status(200)
        .json({ message: "Lesson order updated successfully" });
    } catch (error) {
      console.error("Error updating lesson order:", error);
      return res.status(500).json({ error: "Failed to update lesson order" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (req.method === "POST") {
    try {
      // Update lessons order in the database
      await Promise.all(
        orderedLessons.map((lesson: { id: number; order: number }) => {
          return prisma.lesson.update({
            where: { id: lesson.id },
            data: { order: lesson.order }, // Assuming 'order' is the field used to store lesson order
          });
        })
      );
      res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update lesson order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
