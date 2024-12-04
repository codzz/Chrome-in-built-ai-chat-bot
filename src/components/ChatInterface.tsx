import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, UploadCloud, Copy, Check, Download, Trash2, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AIChatService } from '../services/aiService';
import { ChatMessage } from '../types/chat';

interface ChatInterfaceProps {
  extractedText: string;
  onRestart: () => void;
}

export default function ChatInterface({ extractedText, onRestart }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    type: 'bot',
    content: 'Hi! I\'m ready to answer questions about your PDF. What would you like to know?',
    id: 'welcome',
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [aiService] = useState(() => new AIChatService(extractedText));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleCopyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const exportChat = () => {
    const chatContent = messages
      .map(m => `${m.type.toUpperCase()} (${new Date(m.timestamp).toLocaleString()})\n${m.content}\n`)
      .join('\n---\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setMessages([{
      type: 'bot',
      content: 'Chat history cleared. How can I help you?',
      id: 'reset',
      timestamp: new Date().toISOString()
    }]);
  };

  const shareChat = async () => {
    const shareText = messages.map(m => `${m.type}: ${m.content}`).join('\n\n');
    try {
      await navigator.share({
        title: 'PDF Chat Conversation',
        text: shareText
      });
    } catch (err) {
      console.error('Share failed:', err);
      handleCopyMessage(shareText, 'share');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: input.trim(),
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiService.sendMessage(userMessage.content);
      
      const botMessage: ChatMessage = {
        type: 'bot',
        content: response,
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: ChatMessage = {
        type: 'bot',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${newHeight}px`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] max-w-4xl mx-auto bg-dark-800/95 rounded-xl border border-dark-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 border-b border-dark-700/50 bg-gradient-to-r from-dark-800 to-dark-800/95 backdrop-blur supports-[backdrop-filter]:bg-dark-800/80">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl shadow-lg">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-dark-50">PDF Chat Assistant</h2>
              <p className="text-sm text-dark-400">Ask questions about your document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportChat}
              className="p-2.5 text-dark-200 hover:text-blue-400 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/10"
              title="Export chat"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={shareChat}
              className="p-2.5 text-dark-200 hover:text-purple-400 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/10"
              title="Share chat"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={clearChat}
              className="p-2.5 text-dark-200 hover:text-pink-400 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-pink-500/10"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRestart}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-200 hover:text-dark-50 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all duration-200 ml-2 shadow-lg"
            >
              <UploadCloud className="w-4 h-4" />
              <span>New PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative bg-gradient-to-b from-dark-900/50 to-dark-800/50"
        onScroll={handleScroll}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 chat-message ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex-shrink-0 p-2.5 rounded-xl shadow-lg ${
                message.type === 'user' 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                  : 'bg-gradient-to-br from-dark-700 to-dark-600'
              }`}
            >
              {message.type === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 max-w-[80%] group">
              <div
                className={`p-4 rounded-2xl message-hover relative shadow-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 ml-auto border border-blue-500/10'
                    : 'bg-gradient-to-r from-dark-700/50 to-dark-600/50 border border-dark-600/10'
                }`}
              >
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
                <button
                  onClick={() => handleCopyMessage(message.content, message.id)}
                  className={`absolute top-2 right-2 p-1.5 rounded-lg bg-dark-800/90 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                    copiedId === message.id ? 'text-green-400' : 'text-dark-200 hover:text-blue-400'
                  }`}
                  aria-label={copiedId === message.id ? "Copied!" : "Copy message"}
                >
                  {copiedId === message.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div
                className={`text-xs text-dark-400 mt-2 ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl shadow-lg">
              <Bot className="w-5 h-5 text-purple-400" />
            </div>
            <div className="p-4 bg-gradient-to-r from-dark-700/50 to-dark-600/50 rounded-2xl shadow-lg border border-dark-600/10">
              <div className="typing-indicator flex gap-1.5">
                <span className="bg-dark-400"></span>
                <span className="bg-dark-400"></span>
                <span className="bg-dark-400"></span>
              </div>
            </div>
          </div>
        )}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-8 p-3 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl shadow-lg text-dark-200 hover:text-blue-400 transition-all duration-200 hover:shadow-blue-500/10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none p-4 border-t border-dark-700/50 bg-gradient-to-r from-dark-800 to-dark-800/95 backdrop-blur supports-[backdrop-filter]:bg-dark-800/80">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight(e);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your PDF..."
            className="w-full p-4 pr-12 bg-dark-700 border border-dark-600/50 rounded-xl text-dark-50 placeholder-dark-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 resize-none max-h-[200px] overflow-y-hidden transition-all duration-200"
            maxLength={2000}
            style={{ minHeight: '52px' }}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-dark-200 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={!input.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="mt-2 text-xs text-dark-400 flex justify-between px-1">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <span>{input.length} / 2000</span>
        </div>
      </div>
    </div>
  );
}