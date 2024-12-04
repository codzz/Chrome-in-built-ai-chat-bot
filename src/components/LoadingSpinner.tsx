import React from 'react';
import { FileText } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-dark-700 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <FileText className="w-10 h-10 text-dark-200" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-dark-50 mb-2">Processing your PDF</h3>
        <p className="text-dark-300">This may take a moment...</p>
      </div>
    </div>
  );
}