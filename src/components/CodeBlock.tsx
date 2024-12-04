import React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface CodeBlockProps {
  language: string;
  value: string;
}

export default function CodeBlock({ language, value }: CodeBlockProps) {
  const highlighted = hljs.highlight(value, { language }).value;

  return (
    <div className="relative group">
      <pre className="!bg-dark-800 !p-4 rounded-lg overflow-x-auto">
        <code 
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      <button
        onClick={() => navigator.clipboard.writeText(value)}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-dark-700 text-dark-200 hover:text-dark-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
        title="Copy code"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
}