import { LLMClient } from './llm-client';
import { IdeaValidator } from './validator';
import { GeneratedIdea, LLMProvider } from '../types';
import { pool } from '../config/database';

/**
 * Service for generating and storing AI-powered content ideas
 */
export class IdeaGeneratorService {
  private llmClient: LLMClient;
  private validator: IdeaValidator;
  private maxRetries: number;

  constructor(maxRetries: number = 3) {
    this.llmClient = new LLMClient();
    this.validator = new IdeaValidator();
    this.maxRetries = maxRetries;
  }

  /**
   * Build prompt for AI to generate ideas
   */
  private buildPrompt(persona: string, industry: string): string {
    return `Generate 10 content ideas for a ${persona} in ${industry}.

Requirements:
- Each idea must be practical, specific, and actionable
- Ideas should be relevant to ${industry} industry
- Target audience: ${persona}

Return ONLY a JSON array with exactly 10 objects, each having:
- title: A compelling title (max 100 characters)
- description: Detailed description of the content idea (2-3 sentences)
- rationale: Why this idea would resonate with ${persona} (1-2 sentences)

Example format:
[
  {
    "title": "How to Scale Your Business in 2024",
    "description": "A comprehensive guide covering the latest strategies for business growth...",
    "rationale": "Entrepreneurs need actionable scaling advice in today's fast-paced market."
  }
]

Return ONLY the JSON array, no additional text.`;
  }

  /**
   * Generate ideas with retry logic and exponential backoff
   */
  async generateIdeas(
    persona: string,
    industry: string,
    provider: LLMProvider = 'openai',
    temperature: number = 0.7
  ): Promise<GeneratedIdea[]> {
    // Check if provider is available
    if (!this.llmClient.isProviderAvailable(provider)) {
      throw new Error(`Provider ${provider} is not configured. Please add API key to .env file.`);
    }

    const prompt = this.buildPrompt(persona, industry);
    let lastError: Error | null = null;

    // Retry loop with exponential backoff
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🤖 Generating ideas (attempt ${attempt}/${this.maxRetries})...`);

        // Call LLM
        const response = await this.llmClient.generateCompletion(
          prompt,
          provider,
          temperature
        );

        console.log('📥 Received response from AI');

        // Parse and validate JSON
        const ideas = this.validator.parseAndValidateJSON(response);

        if (ideas && ideas.length > 0) {
          console.log(`✅ Successfully generated and validated ${ideas.length} ideas`);
          return ideas;
        }

        // Validation failed
        console.warn(`⚠️  Validation failed on attempt ${attempt}`);
        lastError = new Error(this.validator.getValidationErrors());

        // Exponential backoff: wait before retrying
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
        }

      } catch (error) {
        console.error(`❌ Error on attempt ${attempt}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));

        // Wait before retrying
        if (attempt < this.maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await this.sleep(delay);
        }
      }
    }

    // All retries exhausted
    throw new Error(
      `Failed to generate valid ideas after ${this.maxRetries} attempts. Last error: ${lastError?.message}`
    );
  }

  /**
   * Save generated ideas to database
   */
  async saveIdeas(
    ideas: GeneratedIdea[],
    persona: string,
    industry: string
  ): Promise<number[]> {
    const client = await pool.connect();
    const insertedIds: number[] = [];

    try {
      await client.query('BEGIN');

      for (const idea of ideas) {
        const result = await client.query(
          `INSERT INTO ideas (persona, industry, title, description, rationale)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id`,
          [persona, industry, idea.title, idea.description, idea.rationale]
        );
        insertedIds.push(result.rows[0].id);
      }

      await client.query('COMMIT');
      console.log(`💾 Saved ${insertedIds.length} ideas to database`);

      return insertedIds;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error saving ideas to database:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get all ideas for a specific persona and industry
   */
  async getIdeas(persona?: string, industry?: string): Promise<GeneratedIdea[]> {
    let query = 'SELECT * FROM ideas WHERE 1=1';
    const params: string[] = [];

    if (persona) {
      params.push(persona);
      query += ` AND persona = $${params.length}`;
    }

    if (industry) {
      params.push(industry);
      query += ` AND industry = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Sleep helper for exponential backoff
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
