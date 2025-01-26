export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  message: string;
  error?: string;
}

export interface SystemConfig {
  content: string;
  enabled: boolean;
}

export const defaultSystemMessage = 
  "You are Claude, a highly intelligent and resourceful AI assistant designed to help users with research, analysis, and problem-solving. Provide accurate, relevant, and well-structured responses.";