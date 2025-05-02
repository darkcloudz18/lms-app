import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create an Admin User
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: "password123", // Hash this in a real app
      role: "ADMIN",
    },
  });

  // Create an Instructor
  const instructor = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "INSTRUCTOR",
    },
  });

  // Create a Course
  const course = await prisma.course.create({
    data: {
      title: "Next.js Fundamentals",
      description:
        "Learn the basics of Next.js in this beginner-friendly course.",
      instructorId: instructor.id,
    },
  });

  // Create Lessons for the Course
  await prisma.lesson.createMany({
    data: [
      {
        title: "Introduction to Next.js",
        content: "Welcome to Next.js!",
        courseId: course.id,
        type: "text", // ✅ Add this
        position: 1, // ✅ Add this
      },
      {
        title: "Advanced Concepts",
        content: "Let’s dive deeper...",
        courseId: course.id,
        type: "text",
        position: 2,
      },
    ],
  });

  console.log("Database seeded! ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
