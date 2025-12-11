"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPublicationSchema, PUBLICATION_STATUSES, CreatePublicationFormData } from "@/lib/validations/publication";
import * as publicationService from "@/services/publications.service";
import type { Publication } from "@/types/publication.types";

interface AddPublicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacherId: number;
  publicationId?: number | null;
  existingPublication?: Publication | null;
}

export function AddPublicationDialog({
  isOpen,
  onClose,
  onSuccess,
  teacherId,
  publicationId,
  existingPublication,
}: AddPublicationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!publicationId && !!existingPublication;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePublicationFormData>({
    resolver: zodResolver(createPublicationSchema),
    defaultValues: isEditing
      ? {
          publicationTitle: existingPublication.publicationTitle,
          journalConferenceName: existingPublication.journalConferenceName,
          publicationDate: existingPublication.publicationDate,
          status: existingPublication.status,
          coAuthors: existingPublication.coAuthors || "",
          publicationUrl: existingPublication.publicationUrl || "",
          citationsCount: existingPublication.citationsCount || 0,
          impactFactor: existingPublication.impactFactor || undefined,
          doi: existingPublication.doi || "",
          isbnIssn: existingPublication.isbnIssn || "",
          volumeNumber: existingPublication.volumeNumber || "",
          issueNumber: existingPublication.issueNumber || "",
          pageNumbers: existingPublication.pageNumbers || "",
          personalNotes: existingPublication.personalNotes || "",
        }
      : {
          status: "In Progress",
          citationsCount: 0,
        },
  });

  useEffect(() => {
    if (isOpen && isEditing && existingPublication) {
      reset({
        publicationTitle: existingPublication.publicationTitle,
        journalConferenceName: existingPublication.journalConferenceName,
        publicationDate: existingPublication.publicationDate,
        status: existingPublication.status,
        coAuthors: existingPublication.coAuthors || "",
        publicationUrl: existingPublication.publicationUrl || "",
        citationsCount: existingPublication.citationsCount || 0,
        impactFactor: existingPublication.impactFactor || undefined,
        doi: existingPublication.doi || "",
        isbnIssn: existingPublication.isbnIssn || "",
        volumeNumber: existingPublication.volumeNumber || "",
        issueNumber: existingPublication.issueNumber || "",
        pageNumbers: existingPublication.pageNumbers || "",
        personalNotes: existingPublication.personalNotes || "",
      });
    } else if (isOpen && !isEditing) {
      reset({
        publicationTitle: "",
        journalConferenceName: "",
        publicationDate: "",
        status: "In Progress",
        coAuthors: "",
        publicationUrl: "",
        citationsCount: 0,
        impactFactor: undefined,
        doi: "",
        isbnIssn: "",
        volumeNumber: "",
        issueNumber: "",
        pageNumbers: "",
        personalNotes: "",
      });
    }
  }, [isOpen, isEditing, existingPublication, reset]);

  const onSubmit = async (data: CreatePublicationFormData) => {
    console.log("=== Publication Form Submission ===");
    console.log("Form data:", data);
    console.log("Teacher ID:", teacherId);
    console.log("Is editing:", isEditing);

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        publicationTitle: data.publicationTitle,
        journalConferenceName: data.journalConferenceName,
        publicationDate: data.publicationDate,
        status: data.status,
        coAuthors: data.coAuthors || undefined,
        publicationUrl: data.publicationUrl || undefined,
        citationsCount: data.citationsCount || 0,
        impactFactor: data.impactFactor || undefined,
        doi: data.doi || undefined,
        isbnIssn: data.isbnIssn || undefined,
        volumeNumber: data.volumeNumber || undefined,
        issueNumber: data.issueNumber || undefined,
        pageNumbers: data.pageNumbers || undefined,
        personalNotes: data.personalNotes || undefined,
      };

      console.log("Payload to send:", payload);

      if (isEditing && publicationId) {
        console.log("Updating publication ID:", publicationId);
        const result = await publicationService.updatePublication(publicationId, payload, teacherId);
        console.log("Update result:", result);
      } else {
        console.log("Creating new publication");
        const result = await publicationService.createPublication(payload, teacherId);
        console.log("Create result:", result);
      }

      console.log("Publication saved successfully!");
      onSuccess();
      onClose();
      reset();
    } catch (err: any) {
      console.error("Failed to save publication:", err);
      console.error("Error details:", err.response?.data);
      setError(err.response?.data?.message || err.message || "Failed to save publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
      setError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Publication" : "Add New Publication"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Publication Title */}
            <div>
              <Label htmlFor="publicationTitle">
                Publication Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="publicationTitle"
                {...register("publicationTitle")}
                placeholder="Enter publication title"
                className={errors.publicationTitle ? "border-red-500" : ""}
              />
              {errors.publicationTitle && (
                <p className="text-sm text-red-500 mt-1">{errors.publicationTitle.message}</p>
              )}
            </div>

            {/* Journal/Conference Name */}
            <div>
              <Label htmlFor="journalConferenceName">
                Journal/Conference Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="journalConferenceName"
                {...register("journalConferenceName")}
                placeholder="Enter journal or conference name"
                className={errors.journalConferenceName ? "border-red-500" : ""}
              />
              {errors.journalConferenceName && (
                <p className="text-sm text-red-500 mt-1">{errors.journalConferenceName.message}</p>
              )}
            </div>

            {/* Publication Date and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publicationDate">
                  Publication Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="publicationDate"
                  type="date"
                  {...register("publicationDate")}
                  className={errors.publicationDate ? "border-red-500" : ""}
                />
                {errors.publicationDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.publicationDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">
                  Status <span className="text-red-500">*</span>
                </Label>
                <select
                  id="status"
                  {...register("status")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PUBLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Co-Authors */}
            <div>
              <Label htmlFor="coAuthors">Co-Authors (comma-separated)</Label>
              <Input
                id="coAuthors"
                {...register("coAuthors")}
                placeholder="e.g., Dr. John Smith, Prof. Jane Doe"
              />
              {errors.coAuthors && (
                <p className="text-sm text-red-500 mt-1">{errors.coAuthors.message}</p>
              )}
            </div>

            {/* Publication URL */}
            <div>
              <Label htmlFor="publicationUrl">Publication URL</Label>
              <Input
                id="publicationUrl"
                {...register("publicationUrl")}
                placeholder="https://"
                className={errors.publicationUrl ? "border-red-500" : ""}
              />
              {errors.publicationUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.publicationUrl.message}</p>
              )}
            </div>

            {/* Citations and Impact Factor */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="citationsCount">Citations Count</Label>
                <Input
                  id="citationsCount"
                  type="number"
                  min="0"
                  {...register("citationsCount")}
                  placeholder="0"
                />
                {errors.citationsCount && (
                  <p className="text-sm text-red-500 mt-1">{errors.citationsCount.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="impactFactor">Impact Factor</Label>
                <Input
                  id="impactFactor"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register("impactFactor")}
                  placeholder="0.00"
                />
                {errors.impactFactor && (
                  <p className="text-sm text-red-500 mt-1">{errors.impactFactor.message}</p>
                )}
              </div>
            </div>

            {/* DOI and ISBN/ISSN */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doi">DOI</Label>
                <Input id="doi" {...register("doi")} placeholder="10.1234/example" />
                {errors.doi && <p className="text-sm text-red-500 mt-1">{errors.doi.message}</p>}
              </div>

              <div>
                <Label htmlFor="isbnIssn">ISBN/ISSN</Label>
                <Input id="isbnIssn" {...register("isbnIssn")} placeholder="ISBN or ISSN number" />
                {errors.isbnIssn && (
                  <p className="text-sm text-red-500 mt-1">{errors.isbnIssn.message}</p>
                )}
              </div>
            </div>

            {/* Volume, Issue, and Page Numbers */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="volumeNumber">Volume Number</Label>
                <Input id="volumeNumber" {...register("volumeNumber")} placeholder="e.g., 12" />
                {errors.volumeNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.volumeNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="issueNumber">Issue Number</Label>
                <Input id="issueNumber" {...register("issueNumber")} placeholder="e.g., 3" />
                {errors.issueNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.issueNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="pageNumbers">Page Numbers</Label>
                <Input id="pageNumbers" {...register("pageNumbers")} placeholder="e.g., 123-145" />
                {errors.pageNumbers && (
                  <p className="text-sm text-red-500 mt-1">{errors.pageNumbers.message}</p>
                )}
              </div>
            </div>

            {/* Personal Notes */}
            <div>
              <Label htmlFor="personalNotes">
                Personal Notes
                <span className="text-xs text-gray-500 ml-1">(Private)</span>
              </Label>
              <textarea
                id="personalNotes"
                {...register("personalNotes")}
                placeholder="Add personal reflections, context, or notes about this publication..."
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                maxLength={500}
              />
              {errors.personalNotes && (
                <p className="text-sm text-red-500 mt-1">{errors.personalNotes.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1 text-right">
                Maximum 500 characters
              </p>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Publication" : "Save Publication"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
