import { ChatMessage } from '../types/chat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AILanguageModel {
  prompt: (messages: Message[]) => Promise<string>;
}

interface AISession {
  languageModel: {
    create: (config: { systemPrompt: string }) => Promise<AILanguageModel>;
  };
}

declare const ai: AISession;

export class AIChatService {
  private session: AILanguageModel | null = null;
  private messages: Message[] = [];
  private initializationPromise: Promise<void>;

  constructor(extractedText: string) {
    console.log('Initializing AI Chat Service with extracted text length:', extractedText.length);
    this.initializationPromise = this.initializeSession(extractedText);
  }

  async waitForInitialization() {
    await this.initializationPromise;
  }

  private async initializeSession(extractedText: string) {
    try {
      console.log('Creating AI language model session...');
      this.session = await ai.languageModel.create({
        systemPrompt: `You are a PDF AI chatbot. Your responses should only be based on the content provided. Here is the content to use for this chat:\n\n${extractedText}`
      });
      console.log('AI session created successfully');
    } catch (error) {
      console.error('Failed to initialize AI session:', error);
      throw error;
    }
  }

  async sendMessage(userMessage: string): Promise<string> {
    if (!this.session) {
      console.error('AI session not initialized');
      throw new Error('AI session not initialized');
    }

    try {
      console.log('Sending message to AI:', userMessage);
      console.log('Previous messages:', this.messages);

      // Add new user message to conversation history
      const currentMessages = [...this.messages, { role: 'user', content: userMessage }];
      
      console.log('Sending conversation to AI:', currentMessages);
      const result = await this.session.prompt(userMessage);
      console.log('AI response received:', result);

      // Update conversation history with both user message and AI response
      this.messages = [
        ...currentMessages,
        { role: 'assistant', content: result }
      ];

      return result;
    } catch (error) {
      console.error('Failed to get AI response:', error);
      throw error;
    }
  }
}