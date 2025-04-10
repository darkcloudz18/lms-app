// /src/components/LessonCard.tsx
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

type Lesson = {
  id: number;
  title: string;
};

type Props = {
  lesson: Lesson;
  index: number;
  lessons: Lesson[];
  moveLesson: (draggedIndex: number, targetIndex: number) => void;
};

const LessonCard = ({ lesson, index, lessons, moveLesson }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "lesson",
    hover: (item: { id: number }) => {
      const dragIndex = lessons.findIndex((l) => l.id === item.id);
      if (dragIndex !== index) {
        moveLesson(dragIndex, index);
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "lesson",
    item: { id: lesson.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref)); // combine refs

  return (
    <div
      ref={ref}
      className="lesson-card"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab", // Change cursor on drag
        boxShadow: isDragging ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none", // Add shadow when dragging
      }}
    >
      {lesson.title}
    </div>
  );
};

export default LessonCard;
