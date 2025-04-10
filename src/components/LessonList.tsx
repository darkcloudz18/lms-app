import { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import LessonCard from "./LessonCard";

// Define the type for a lesson
type Lesson = {
  id: number;
  title: string;
};

type LessonListProps = {
  lessons: Lesson[]; // Define lessons as an array of Lesson
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>; // Define setLessons as the state setter function
  courseId: number; // Pass courseId as a prop
};

const LessonList = ({ lessons, setLessons, courseId }: LessonListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Move the lesson to a new position in the array
  const moveLesson = async (draggedIndex: number, targetIndex: number) => {
    const updated = [...lessons];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, removed);
    setLessons(updated); // Update the lessons state

    // Send the updated order to the backend
    const orderedLessons = updated.map((lesson, index) => ({
      id: lesson.id,
      order: index + 1, // Assuming 'order' is the field that holds the lesson position
    }));

    const res = await fetch(`/api/courses/${courseId}/lessons/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId, orderedLessons }),
    });

    if (!res.ok) {
      console.error("Failed to update order on backend");
    }
  };

  // Use useDrop to handle drop event for reordering lessons
  const [, dropRef] = useDrop({
    accept: "lesson",
    drop: () => {}, // You can handle additional logic on drop if needed
  });

  const handleLessonReorder = async (newOrder: number[]) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonOrder: newOrder }),
      });

      if (response.ok) {
        console.log("Lesson order updated successfully");
      } else {
        console.error("Failed to update lesson order");
      }
    } catch (error) {
      console.error("Error updating lesson order:", error);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      dropRef(containerRef.current);
    }
  }, [dropRef]);

  return (
    <div ref={containerRef}>
      {lessons.map((lesson, index) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          index={index}
          moveLesson={moveLesson}
          lessons={lessons}
        />
      ))}
    </div>
  );
};

export default LessonList;
