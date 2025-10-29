export type LLMProvider = 'openai' | 'anthropic' | 'gemini' | 'deepseek';

export interface GeneratedIdea {
  title: string;
  description: string;
  rationale: string;
}

export interface GenerateIdeasRequest {
  persona: string;
  industry: string;
  provider?: LLMProvider;
  temperature?: number;
}

export interface GenerateIdeasResponse {
  success: boolean;
  ideas?: GeneratedIdea[];
  error?: string;
}
