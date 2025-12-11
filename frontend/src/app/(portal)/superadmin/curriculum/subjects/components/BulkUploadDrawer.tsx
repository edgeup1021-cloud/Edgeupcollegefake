"use client";

import { useState, useRef } from "react";
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";

interface BulkUploadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  onSuccess: () => void;
}

interface UploadResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ row: number; error: string }>;
  created: {
    subjects: number;
    topics: number;
    subtopics: number;
  };
}

export default function BulkUploadDrawer({
  isOpen,
  onClose,
  courseId,
  onSuccess,
}: BulkUploadDrawerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `http://localhost:3001/api/curriculum/subjects/bulk-upload/${courseId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result: UploadResult = await response.json();
      setUploadResult(result);

      if (result.success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create sample data
    const templateData = [
      {
        "Subject Name": "Mathematics",
        "Subject Code": "MATH101",
        "Subject Description": "Introduction to Mathematics",
        "Topic Name": "Algebra",
        "Topic Code": "ALG01",
        "Topic Description": "Basic Algebraic Concepts",
        "Subtopic Name": "Linear Equations",
        "Subtopic Code": "LE01",
        "Subtopic Description": "Solving Linear Equations",
      },
      {
        "Subject Name": "Mathematics",
        "Subject Code": "MATH101",
        "Subject Description": "Introduction to Mathematics",
        "Topic Name": "Algebra",
        "Topic Code": "ALG01",
        "Topic Description": "Basic Algebraic Concepts",
        "Subtopic Name": "Quadratic Equations",
        "Subtopic Code": "QE01",
        "Subtopic Description": "Solving Quadratic Equations",
      },
      {
        "Subject Name": "Physics",
        "Subject Code": "PHY101",
        "Subject Description": "Introduction to Physics",
        "Topic Name": "Mechanics",
        "Topic Code": "MECH01",
        "Topic Description": "Classical Mechanics",
        "Subtopic Name": "Newton's Laws",
        "Subtopic Code": "NL01",
        "Subtopic Description": "Three Laws of Motion",
      },
    ];

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curriculum");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 }, // Subject Name
      { wch: 15 }, // Subject Code
      { wch: 30 }, // Subject Description
      { wch: 20 }, // Topic Name
      { wch: 15 }, // Topic Code
      { wch: 30 }, // Topic Description
      { wch: 20 }, // Subtopic Name
      { wch: 15 }, // Subtopic Code
      { wch: 30 }, // Subtopic Description
    ];

    // Download file
    XLSX.writeFile(workbook, "curriculum_template.xlsx");
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Bulk Upload Curriculum
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload an Excel file with subjects, topics, and subtopics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Instructions:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Download the Excel template below</li>
              <li>Fill in your curriculum data following the template format</li>
              <li>Upload the completed Excel file</li>
              <li>Review the results and fix any errors if needed</li>
            </ol>
          </div>

          {/* Download Template Button */}
          <button
            onClick={handleDownloadTemplate}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Excel Template
          </button>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />

            {!selectedFile ? (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Click to upload Excel file
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  .xlsx or .xls files only
                </p>
              </label>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-10 h-10 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
          </div>

          {/* Upload Button */}
          {selectedFile && !uploadResult && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload and Process
                </>
              )}
            </button>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-4">
              <div
                className={`border rounded-lg p-4 ${
                  uploadResult.success
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {uploadResult.success ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4
                      className={`font-medium mb-2 ${
                        uploadResult.success
                          ? "text-green-900 dark:text-green-100"
                          : "text-yellow-900 dark:text-yellow-100"
                      }`}
                    >
                      {uploadResult.success
                        ? "Upload Successful!"
                        : "Upload Completed with Errors"}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Total Rows:
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {uploadResult.totalRows}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Success:
                        </p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {uploadResult.successCount}
                        </p>
                      </div>
                      {uploadResult.errorCount > 0 && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">
                            Errors:
                          </p>
                          <p className="font-semibold text-red-600 dark:text-red-400">
                            {uploadResult.errorCount}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm bg-white/50 dark:bg-gray-800/50 rounded p-3">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Subjects:
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {uploadResult.created.subjects}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Topics:
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {uploadResult.created.topics}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Subtopics:
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {uploadResult.created.subtopics}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {uploadResult.errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 dark:text-red-100 mb-3">
                    Errors Found:
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {uploadResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-sm bg-white/50 dark:bg-gray-800/50 rounded p-2"
                      >
                        <span className="font-medium text-red-700 dark:text-red-300">
                          Row {error.row}:
                        </span>{" "}
                        <span className="text-red-600 dark:text-red-400">
                          {error.error}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Upload Another File
                </button>
                {uploadResult.success && (
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
