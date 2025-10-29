import { GenerateIdeasRequest, GenerateIdeasResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * API client for idea generation
 */
export class ApiClient {
  /**
   * Generate ideas using AI
   */
  static async generateIdeas(
    request: GenerateIdeasRequest
  ): Promise<GenerateIdeasResponse> {
    try {
      const response = await fetch(`${API_URL}/api/ideas/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: GenerateIdeasResponse = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  /**
   * Get existing ideas
   */
  static async getIdeas(persona?: string, industry?: string) {
    try {
      const params = new URLSearchParams();
      if (persona) params.append('persona', persona);
      if (industry) params.append('industry', industry);

      const url = `${API_URL}/api/ideas${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Failed to fetch ideas' };
    }
  }
}
