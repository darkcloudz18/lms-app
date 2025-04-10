import courses from "@/data/courses";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-sm text-gray-500">
              Instructor: {course.instructor}
            </p>
            <p className="text-sm text-gray-500">
              Difficulty: {course.difficulty}
            </p>
            <Link href={`/courses/${course.id}`} className="text-blue-500">
              View Course
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
