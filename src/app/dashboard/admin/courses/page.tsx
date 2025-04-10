"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CoursesPage() {
  type Course = {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    archived: boolean;
  };

  const [courses, setCourses] = useState<Course[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  // Fetch courses based on the archived toggle
  const fetchCourses = async () => {
    const res = await fetch(`/api/courses?archived=${showArchived}`);
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch(`/api/courses?archived=${showArchived}`);
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, [showArchived]); // Ensure proper dependencies are added

  const handleArchive = async (course: Course) => {
    const newStatus = course.archived ? false : true; // Toggle the status

    const response = await fetch(`/api/courses/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        archived: newStatus,
        title: course.title,
        description: course.description,
      }),
    });

    if (response.ok) {
      // Trigger re-fetch to update the list of courses or update the UI directly
      fetchCourses();
    }
  };

  const handleRestore = async (course: Course) => {
    const newStatus = false; // Restoring course to active (archived: false)

    const response = await fetch(`/api/courses/${course.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Ensure the correct content type
      },
      body: JSON.stringify({
        archived: newStatus,
        title: course.title,
        description: course.description,
      }), // Send title and description along with the archived status
    });

    if (response.ok) {
      // Trigger a re-fetch of the course list after restoring
      fetchCourses(); // Re-fetch the courses list
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>

      {/* Toggle for showing archived courses */}
      <div className="flex items-center mb-4">
        <label htmlFor="toggle" className="mr-2">
          Show Archived
        </label>
        <input
          id="toggle"
          type="checkbox"
          checked={showArchived}
          onChange={() => setShowArchived(!showArchived)}
        />
      </div>

      <Link href="/dashboard/admin/courses/new">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add Course
        </button>
      </Link>

      <ul className="mt-6 grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <li
            key={course.id}
            className="bg-white shadow-md rounded-lg flex flex-row justify-between border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-4 flex flex-col justify-between w-2/3">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>
              </div>

              <div className="flex gap-4 text-sm">
                <Link href={`/dashboard/admin/courses/${course.id}`}>
                  <span className="text-blue-600 hover:underline">Edit</span>
                </Link>

                <Link href={`/dashboard/admin/courses/${course.id}/lessons`}>
                  <span className="text-green-600 hover:underline">
                    Manage Lessons
                  </span>
                </Link>

                <Link href={`/dashboard/admin/courses/${course.id}/revisions`}>
                  <span className="text-gray-500 text-sm hover:underline">
                    Revisions
                  </span>
                </Link>

                {/* Conditional rendering of the Archive/Restore button */}
                {course.archived ? (
                  <button
                    className="text-green-500 hover:underline"
                    onClick={() => handleRestore(course)} // Call handleRestore if archived
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleArchive(course)} // Call handleArchive if not archived
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>

            <div className="w-1/3 h-full">
              <Image
                src={course.imageUrl || "/default-course.jpg"}
                alt={course.title}
                width={500} // Adjust the width as needed
                height={300} // Adjust the height as needed
                className="w-full h-full object-cover rounded-r-lg"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
