"use client";

import { X } from "lucide-react";

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export default function TagSelector({
  availableTags,
  selectedTags,
  onChange,
  maxTags = 5,
}: TagSelectorProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < maxTags) {
        onChange([...selectedTags, tag]);
      }
    }
  };

  const isSelected = (tag: string) => selectedTags.includes(tag);
  const isDisabled = (tag: string) =>
    !isSelected(tag) && selectedTags.length >= maxTags;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            disabled={isDisabled(tag)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all
              ${
                isSelected(tag)
                  ? "bg-brand-primary text-white"
                  : isDisabled(tag)
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
          >
            {tag}
            {isSelected(tag) && <X className="inline-block w-3 h-3 ml-1" />}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {selectedTags.length}/{maxTags} tags selected
      </p>
    </div>
  );
}
