export interface ChatSession {
  systemPrompt: string;
}

export interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
  id: string;
  timestamp: string;
}