import React from 'react';
import { Copy, Check, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface MessageActionsProps {
  content: string;
  id: string;
  copiedId: string | null;
  onCopy: (content: string, id: string) => void;
  onFeedback: (id: string, type: 'like' | 'dislike') => void;
}

export default function MessageActions({ content, id, copiedId, onCopy, onFeedback }: MessageActionsProps) {
  return (
    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={() => onFeedback(id, 'like')}
        className="p-1.5 rounded-lg bg-dark-800/80 text-dark-200 hover:text-dark-50 transition-colors duration-200"
        title="Helpful response"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => onFeedback(id, 'dislike')}
        className="p-1.5 rounded-lg bg-dark-800/80 text-dark-200 hover:text-dark-50 transition-colors duration-200"
        title="Not helpful"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
      <button
        onClick={() => onCopy(content, id)}
        className={`p-1.5 rounded-lg bg-dark-800/80 transition-colors duration-200 ${
          copiedId === id ? 'text-green-400' : 'text-dark-200 hover:text-dark-50'
        }`}
        title={copiedId === id ? "Copied!" : "Copy message"}
      >
        {copiedId === id ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}