import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = Number(searchParams.get("courseId"));

    if (!courseId || isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching lessons" },
      { status: 500 }
    );
  }
}
