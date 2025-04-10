"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NewCoursePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("instructorId", "1");
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    const res = await fetch("/api/courses", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/dashboard/admin/courses");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Course</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Title Input */}
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          placeholder="Course Title"
          className="border p-2"
        />
        {errors.title && (
          <span className="text-red-500 text-sm">
            {(errors.title as any)?.message}
          </span>
        )}

        {/* Description Input */}
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Course Description"
          className="border p-2"
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {(errors.description as any)?.message}
          </span>
        )}

        {/* Image Input */}
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Image is required" })}
          className="border p-2"
        />
        {errors.image && (
          <span className="text-red-500 text-sm">
            {(errors.image as any)?.message}
          </span>
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          fullWidth
          pill
          variant="default"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
