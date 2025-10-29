import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider } from '../types';

/**
 * LLMClient - Universal client for multiple AI providers
 * Supports: OpenAI, Anthropic (Claude), Google (Gemini), Deepseek
 */
export class LLMClient {
  private openaiClient?: OpenAI;
  private anthropicClient?: Anthropic;
  private geminiClient?: GoogleGenerativeAI;
  private deepseekClient?: OpenAI; // Deepseek uses OpenAI-compatible API

  constructor() {
    // Initialize clients based on available API keys
    if (process.env.OPENAI_API_KEY) {
      this.openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropicClient = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    if (process.env.GOOGLE_API_KEY) {
      this.geminiClient = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    }

    if (process.env.DEEPSEEK_API_KEY) {
      this.deepseekClient = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: 'https://api.deepseek.com/v1',
      });
    }
  }

  /**
   * Generate completion from specified AI provider
   * @param prompt - The prompt to send to the AI
   * @param provider - Which AI provider to use
   * @param temperature - Creativity level (0-1)
   * @returns The AI's response as a string
   */
  async generateCompletion(
    prompt: string,
    provider: LLMProvider = 'openai',
    temperature: number = 0.7
  ): Promise<string> {
    try {
      switch (provider) {
        case 'openai':
          return await this.generateWithOpenAI(prompt, temperature);

        case 'anthropic':
          return await this.generateWithAnthropic(prompt, temperature);

        case 'gemini':
          return await this.generateWithGemini(prompt, temperature);

        case 'deepseek':
          return await this.generateWithDeepseek(prompt, temperature);

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error generating completion with ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Generate completion using OpenAI (GPT-4/GPT-3.5)
   */
  private async generateWithOpenAI(
    prompt: string,
    temperature: number
  ): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a creative content strategist who generates innovative ideas. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Generate completion using Anthropic Claude
   */
  private async generateWithAnthropic(
    prompt: string,
    temperature: number
  ): Promise<string> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await this.anthropicClient.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return '';
  }

  /**
   * Generate completion using Google Gemini
   */
  private async generateWithGemini(
    prompt: string,
    temperature: number
  ): Promise<string> {
    if (!this.geminiClient) {
      throw new Error('Google API key not configured');
    }

    const model = this.geminiClient.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature,
        maxOutputTokens: 2000,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  /**
   * Generate completion using Deepseek
   */
  private async generateWithDeepseek(
    prompt: string,
    temperature: number
  ): Promise<string> {
    if (!this.deepseekClient) {
      throw new Error('Deepseek API key not configured');
    }

    const response = await this.deepseekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a creative content strategist who generates innovative ideas. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Check if a provider is available (API key configured)
   */
  isProviderAvailable(provider: LLMProvider): boolean {
    switch (provider) {
      case 'openai':
        return !!this.openaiClient;
      case 'anthropic':
        return !!this.anthropicClient;
      case 'gemini':
        return !!this.geminiClient;
      case 'deepseek':
        return !!this.deepseekClient;
      default:
        return false;
    }
  }
}
