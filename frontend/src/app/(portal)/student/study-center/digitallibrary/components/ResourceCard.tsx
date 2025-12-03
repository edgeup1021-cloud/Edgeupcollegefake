import { useState } from "react";
import { BookOpen, FileText, Video, File, Presentation, FileImage, Bookmark, Download, Eye, Calendar, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addBookmark, removeBookmark, downloadResource, markResourceAccessed } from "@/services/digital-library.service";
import { useAuth } from "@/contexts/AuthContext";
import type { Resource } from "@/types/digital-library.types";

interface ResourceCardProps {
  resource: Resource;
  onRefresh?: () => void;
  showAccessDate?: boolean;
  accessDate?: string;
}

export function ResourceCard({ resource, onRefresh, showAccessDate, accessDate }: ResourceCardProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(resource.isBookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const getTypeIcon = (type: string) => {
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

  const getTypeBadge = (type: string) => {
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

  const handleBookmark = async () => {
    if (!user || bookmarkLoading) return;

    setBookmarkLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(user.id, resource.id);
        setIsBookmarked(false);
      } else {
        await addBookmark(user.id, resource.id);
        setIsBookmarked(true);
      }
      onRefresh?.();
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!user || downloadLoading) return;

    setDownloadLoading(true);
    try {
      await downloadResource(user.id, resource.id);
      await markResourceAccessed(user.id, resource.id);
      onRefresh?.();
      // In a real app, trigger actual file download here
      window.open(resource.fileUrl, "_blank");
    } catch (error) {
      console.error("Failed to download resource:", error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleView = async () => {
    if (!user) return;

    try {
      await markResourceAccessed(user.id, resource.id);
      onRefresh?.();
      // In a real app, open resource viewer
      window.open(resource.fileUrl, "_blank");
    } catch (error) {
      console.error("Failed to mark resource as accessed:", error);
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
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className="flex-shrink-0"
          >
            {bookmarkLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? "fill-current text-yellow-500" : ""
                }`}
              />
            )}
          </Button>
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
          {showAccessDate && accessDate && (
            <div className="flex items-center gap-2">
              <Eye className="w-3 h-3" />
              <span>Accessed {formatDate(accessDate)}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span>{resource.views}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="w-3 h-3" />
            <span>{resource.downloads}</span>
          </div>
          <div className="text-xs text-muted-foreground ml-auto">
            {resource.fileSize}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          size="sm"
          onClick={handleDownload}
          disabled={downloadLoading}
          className="w-full"
        >
          {downloadLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
