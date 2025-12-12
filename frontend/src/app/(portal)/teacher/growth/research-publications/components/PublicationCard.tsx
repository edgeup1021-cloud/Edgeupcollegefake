import React from "react";
import {
  BookOpen,
  Users,
  CalendarBlank,
  Quotes,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";
import { Publication } from "@/types/publication.types";
import { Button } from "@/components/ui/button";

interface PublicationCardProps {
  publication: Publication;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PublicationCard({
  publication,
  onEdit,
  onDelete,
}: PublicationCardProps) {
  const statusColors = {
    Published: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    "Under Review": "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
    "In Progress": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    Rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };

  // Format date
  const formattedDate = new Date(publication.publicationDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  // Parse co-authors (handle both string and null)
  const coAuthors = publication.coAuthors
    ? publication.coAuthors.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  // Display first 3 authors + "et al." if more
  const displayAuthors =
    coAuthors.length > 3
      ? `${coAuthors.slice(0, 3).join(", ")} et al.`
      : coAuthors.join(", ");

  // Parse numeric ID (MySQL bigint serializes as string)
  const numericId = typeof publication.id === 'string' ? parseInt(publication.id, 10) : publication.id;

  // Parse impact factor (MySQL DECIMAL serializes as string)
  const impactFactorValue = publication.impactFactor
    ? (typeof publication.impactFactor === 'number'
        ? publication.impactFactor
        : parseFloat(publication.impactFactor))
    : null;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-lg hover:border-brand-primary/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1 pr-4">
          {publication.publicationTitle}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            statusColors[publication.status]
          }`}
        >
          {publication.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {/* Journal/Conference */}
        <div className="flex items-start gap-2 text-sm">
          <BookOpen
            className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
            weight="duotone"
          />
          <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
            {publication.journalConferenceName}
          </span>
        </div>

        {/* Co-Authors */}
        {coAuthors.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Users
              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
              weight="duotone"
            />
            <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
              {displayAuthors}
            </span>
          </div>
        )}

        {/* Publication Date */}
        <div className="flex items-center gap-2 text-sm">
          <CalendarBlank
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            weight="duotone"
          />
          <span className="text-gray-600 dark:text-gray-300">{formattedDate}</span>
        </div>

        {/* Citations */}
        <div className="flex items-center gap-2 text-sm">
          <Quotes
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            weight="duotone"
          />
          <span className="text-gray-600 dark:text-gray-300">
            {publication.citationsCount} citation{publication.citationsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Impact Factor Badge */}
      {impactFactorValue && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
            IF: {impactFactorValue.toFixed(2)}
          </span>
        </div>
      )}

      {/* Publication URL */}
      {publication.publicationUrl && (
        <a
          href={publication.publicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brand-primary hover:text-brand-primary/80 hover:underline mb-4 block truncate"
        >
          View Publication →
        </a>
      )}

      {/* Personal Notes */}
      {publication.personalNotes && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Personal Notes:
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {publication.personalNotes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            onEdit(numericId);
          }}
          className="flex-1 gap-2"
        >
          <PencilSimple className="w-4 h-4" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            onDelete(numericId);
          }}
          className="flex-1 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
