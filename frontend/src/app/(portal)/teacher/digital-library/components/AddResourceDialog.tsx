"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { addTeacherResource } from "@/services/teacher-library.service";
import { useAuth } from "@/contexts/AuthContext";
import type { ResourceType, ResourceCategory } from "@/types/digital-library.types";

const resourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  author: z.string().min(2, "Author name is required"),
  type: z.enum(["book", "paper", "video", "article", "presentation", "document"]),
  category: z.string().min(1, "Category is required"),
  fileUrl: z.string().url("Must be a valid URL").or(z.string().min(1, "File URL is required")),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  fileSize: z.string().min(1, "File size is required"),
  pages: z.number().optional(),
  duration: z.string().optional(),
});

type ResourceFormData = z.infer<typeof resourceSchema>;

interface AddResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddResourceDialog({ open, onOpenChange, onSuccess }: AddResourceDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      type: "book",
      author: user?.name || "",
    },
  });

  const resourceType = watch("type");

  const onSubmit = async (data: ResourceFormData) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await addTeacherResource(user.id, {
        ...data,
        category: data.category as ResourceCategory,
        thumbnailUrl: data.thumbnailUrl || undefined,
        pages: data.pages || undefined,
        duration: data.duration || undefined,
      });

      setSuccess(true);
      reset();
      onSuccess();

      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add resource");
    } finally {
      setLoading(false);
    }
  };

  const resourceTypes: { value: ResourceType; label: string }[] = [
    { value: "book", label: "Book" },
    { value: "paper", label: "Research Paper" },
    { value: "video", label: "Video" },
    { value: "article", label: "Article" },
    { value: "presentation", label: "Presentation" },
    { value: "document", label: "Document" },
  ];

  const categories: ResourceCategory[] = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Engineering",
    "Business",
    "Arts",
    "Other",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <Alert variant="destructive">{error}</Alert>}
          {success && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <p className="text-green-600 dark:text-green-400">
                Resource added successfully!
              </p>
            </Alert>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g., Introduction to Algorithms"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Provide a detailed description of the resource..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Type <span className="text-destructive">*</span>
              </label>
              <select
                {...register("type")}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              >
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Author and File Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Author <span className="text-destructive">*</span>
              </label>
              <input
                {...register("author")}
                type="text"
                placeholder="Author name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              />
              {errors.author && (
                <p className="text-sm text-destructive mt-1">{errors.author.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                File Size <span className="text-destructive">*</span>
              </label>
              <input
                {...register("fileSize")}
                type="text"
                placeholder="e.g., 12.5 MB"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              />
              {errors.fileSize && (
                <p className="text-sm text-destructive mt-1">{errors.fileSize.message}</p>
              )}
            </div>
          </div>

          {/* Conditional Fields */}
          {(resourceType === "book" || resourceType === "paper" || resourceType === "article") && (
            <div>
              <label className="block text-sm font-medium mb-1">Pages</label>
              <input
                {...register("pages", { valueAsNumber: true })}
                type="number"
                placeholder="Number of pages"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          )}

          {resourceType === "video" && (
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                {...register("duration")}
                type="text"
                placeholder="e.g., 3h 45min"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          )}

          {/* File URL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              File URL <span className="text-destructive">*</span>
            </label>
            <input
              {...register("fileUrl")}
              type="text"
              placeholder="https://example.com/resource.pdf"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
            />
            {errors.fileUrl && (
              <p className="text-sm text-destructive mt-1">{errors.fileUrl.message}</p>
            )}
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail URL (Optional)</label>
            <input
              {...register("thumbnailUrl")}
              type="text"
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Resource
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
