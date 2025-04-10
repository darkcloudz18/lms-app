"use client";

import { useEffect, useState } from "react";
import LessonList from "@/components/LessonList";
import { useRouter } from "next/navigation";

type Lesson = {
  id: number;
  title: string;
};

const LessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const courseId = 1; // Replace with dynamic course ID

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}/lessons`);
      const data = await response.json();
      setLessons(data); // Set the lessons data from the API
      setLoading(false);
    };

    fetchLessons();
  }, [courseId]);

  if (loading) return <div>Loading lessons...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Lessons</h1>
      <LessonList
        lessons={lessons}
        setLessons={setLessons}
        courseId={courseId}
      />
      <button
        onClick={() => router.push(`/dashboard/admin/courses/${courseId}`)} // Redirect to course details page
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Back to Course
      </button>
    </div>
  );
};

export default LessonsPage;
