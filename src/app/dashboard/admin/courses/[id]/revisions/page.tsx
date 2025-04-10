"use client"; // This marks the file as a client component

import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CourseRevisionsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const [revisions, setRevisions] = useState<any[]>([]);
  const [selectedRevision, setSelectedRevision] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRevisions = async () => {
      const res = await fetch(`/api/courses/${courseId}/revisions`);
      const data = await res.json();
      setRevisions(data);
    };

    fetchRevisions();
  }, [courseId]);

  const handleRevert = async () => {
    if (!selectedRevision) return;

    const res = await fetch(`/api/courses/${courseId}/revert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revisionId: selectedRevision.id }),
    });

    if (res.ok) {
      setOpen(false);
      // After revert, navigate to the edit page
      router.push(`/dashboard/admin/courses/${courseId}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Course Revisions</h1>

      <ul className="space-y-4">
        {revisions.map((rev) => (
          <li
            key={rev.id}
            className="bg-white rounded shadow flex justify-between items-center p-4"
          >
            <div>
              <p className="text-gray-400 font-bold">{rev.title}</p>
              <p className="text-gray-600 text-sm">{rev.description}</p>
              <p className="text-gray-500 text-xs">
                {new Date(rev.createdAt).toLocaleString()}
              </p>
            </div>

            <Button
              variant="default"
              onClick={() => {
                setSelectedRevision(rev);
                setOpen(true);
              }}
            >
              Revert
            </Button>
          </li>
        ))}
      </ul>

      {/* Modal placed once */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
          <Dialog.Content className="bg-white p-6 rounded shadow-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 z-50">
            <Dialog.Title className="text-lg font-semibold mb-2">
              Confirm Revert
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-4">
              Are you sure you want to revert this course to the selected
              revision?
            </Dialog.Description>

            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="ghost">Cancel</Button>
              </Dialog.Close>
              <Button onClick={handleRevert}>Yes, Revert</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
