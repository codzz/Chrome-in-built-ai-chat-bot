import React from 'react';
import { FileUp, AlertCircle, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export default function FileUpload({ onFileSelect, error }: FileUploadProps) {
  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Please upload a PDF file only';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        handleFileSelect(file);
      } catch (err: any) {
        throw err;
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-block p-3 bg-dark-700 rounded-xl mb-4">
          <FileText className="w-8 h-8 text-dark-200" />
        </div>
        <h2 className="text-2xl font-semibold text-dark-50 mb-2">Upload your PDF</h2>
        <p className="text-dark-300">Drag and drop your file here or click to browse</p>
      </div>
      
      <label
        className="relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-dark-600 rounded-xl cursor-pointer bg-dark-800/50 hover:bg-dark-700/50 transition-colors duration-200"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="p-4 bg-dark-700 rounded-xl mb-4">
            <FileUp className="w-10 h-10 text-dark-200" />
          </div>
          <p className="mb-2 text-sm text-dark-300">
            <span className="font-semibold text-dark-200">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-dark-400">PDF files only (max 2MB)</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                handleFileSelect(file);
              } catch (err: any) {
                throw err;
              }
            }
          }}
        />
      </label>
      
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}