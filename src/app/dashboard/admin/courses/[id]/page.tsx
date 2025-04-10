"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ImageCropper from "@/components/ImageCropper"; // Ensure this import path is correct

export default function EditCoursePage() {
  const [lessons, setLessons] = useState<any[]>([]); // State to store lessons
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // To track loading state
  const params = useRouter();
  const router = useRouter();
  const { id } = router.query; // Access id from router.query

  // Fetch course data and lessons when the page loads
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/courses/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
        setCurrentImage(data.imageUrl); // Load current image URL

        // Fetch lessons associated with this course
        const lessonsRes = await fetch(`/api/courses/${id}/lessons`);
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData); // Set lessons in state
      } catch (error) {
        console.error("Failed to fetch course or lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Handle form submission for course update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        // Redirect to courses page after successful update
        router.push("/dashboard/admin/courses");
      } else {
        alert("Failed to update course. Please try again.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>

      {loading && <div className="text-center">Loading...</div>}

      {/* Course Form */}
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course Title"
          className="border p-2"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course Description"
          className="border p-2"
          required
        />

        {/* Render lessons */}
        <div>
          <h3 className="text-xl font-semibold">Lessons</h3>
          <ul>
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <h4>{lesson.title}</h4>
                <p>{lesson.description}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              setShowCropper(true);
            }
          }}
        />
        {showCropper && imageFile && (
          <ImageCropper
            file={imageFile}
            onCropDone={(cropped) => {
              setImageFile(cropped);
              setPreviewUrl(URL.createObjectURL(cropped));
              setShowCropper(false);
            }}
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
