'use client';

import { useState } from 'react';
import IdeaGeneratorForm from '../components/IdeaGeneratorForm';
import IdeasDisplay from '../components/IdeasDisplay';
import { ApiClient } from '../lib/api';
import { GeneratedIdea, LLMProvider } from '../types';

/**
 * Main page component
 */
export default function Home() {
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle idea generation
   */
  const handleGenerate = async (
    persona: string,
    industry: string,
    provider: LLMProvider
  ) => {
    setIsLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const response = await ApiClient.generateIdeas({
        persona,
        industry,
        provider,
        temperature: 0.7,
      });

      if (response.success && response.ideas) {
        setIdeas(response.ideas);
      } else {
        setError(response.error || 'Failed to generate ideas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Idea Generator
          </h1>
          <p className="text-xl text-gray-600">
            Generate creative content ideas powered by multiple AI providers
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">OpenAI</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">Claude</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">Gemini</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">Deepseek</span>
          </div>
        </div>

        {/* Form */}
        <IdeaGeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />

        {/* Results */}
        <IdeasDisplay ideas={ideas} error={error} isLoading={isLoading} />

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with Next.js, TypeScript, Fastify, and PostgreSQL</p>
        </div>
      </div>
    </main>
  );
}
