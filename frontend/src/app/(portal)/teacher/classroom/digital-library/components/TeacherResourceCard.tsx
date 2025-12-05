import { useState } from "react";
import { BookOpen, FileText, Video, File, Presentation, FileImage, Trash2, Calendar, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteTeacherResource } from "@/services/teacher-library.service";
import { useAuth } from "@/contexts/AuthContext";
import type { Resource } from "@/types/digital-library.types";

interface TeacherResourceCardProps {
  resource: Resource;
  onRefresh?: () => void;
}

export function TeacherResourceCard({ resource, onRefresh }: TeacherResourceCardProps) {
  const { user } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getTypeIcon = (type?: string) => {
    if (!type) return <FileImage className="w-5 h-5" />;

    switch (type) {
      case "book":
        return <BookOpen className="w-5 h-5" />;
      case "paper":
      case "article":
        return <FileText className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      case "presentation":
        return <Presentation className="w-5 h-5" />;
      case "document":
        return <File className="w-5 h-5" />;
      default:
        return <FileImage className="w-5 h-5" />;
    }
  };

  const getTypeBadge = (type?: string) => {
    if (!type) return null;

    const colors: Record<string, string> = {
      book: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      paper: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      video: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      article: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      presentation: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
      document: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[type] || colors.document}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const handleDelete = async () => {
    if (!user || deleteLoading) return;

    if (!confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteTeacherResource(user.id, resource.id);
      onRefresh?.();
    } catch (error) {
      console.error("Failed to delete resource:", error);
      alert("Failed to delete resource. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardContent className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(resource.type)}
            {getTypeBadge(resource.type)}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{resource.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {resource.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3" />
            <span>{resource.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Added {formatDate(resource.addedDate)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t dark:border-gray-700">
          <div className="text-xs text-muted-foreground">
            {resource.fileSize}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleteLoading}
          className="w-full"
        >
          {deleteLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2" />
          )}
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
