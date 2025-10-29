'use client';

import { useState } from 'react';
import { LLMProvider } from '../types';

interface IdeaGeneratorFormProps {
  onGenerate: (persona: string, industry: string, provider: LLMProvider) => void;
  isLoading: boolean;
}

/**
 * Form component for generating ideas
 * Allows user to input persona, industry, and select AI provider
 */
export default function IdeaGeneratorForm({ onGenerate, isLoading }: IdeaGeneratorFormProps) {
  const [persona, setPersona] = useState('');
  const [industry, setIndustry] = useState('');
  const [provider, setProvider] = useState<LLMProvider>('openai');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (persona.trim() && industry.trim()) {
      onGenerate(persona.trim(), industry.trim(), provider);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Generate Content Ideas with AI
      </h2>

      {/* Persona Input */}
      <div className="mb-6">
        <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-2">
          Target Persona *
        </label>
        <input
          type="text"
          id="persona"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          placeholder="e.g., Tech Entrepreneur, Marketing Manager, Software Developer"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
          required
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-gray-500">
          Who is your target audience?
        </p>
      </div>

      {/* Industry Input */}
      <div className="mb-6">
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
          Industry *
        </label>
        <input
          type="text"
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="e.g., SaaS, E-commerce, Healthcare, Finance"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
          required
          disabled={isLoading}
        />
        <p className="mt-1 text-sm text-gray-500">
          What industry are you targeting?
        </p>
      </div>

      {/* AI Provider Selection */}
      <div className="mb-6">
        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">
          AI Provider
        </label>
        <select
          id="provider"
          value={provider}
          onChange={(e) => setProvider(e.target.value as LLMProvider)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-200"
          disabled={isLoading}
        >
          <option value="openai">OpenAI (GPT-4)</option>
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="gemini">Google (Gemini)</option>
          <option value="deepseek">Deepseek</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          Choose which AI model to use for generation
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !persona.trim() || !industry.trim()}
        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition duration-200 ${
          isLoading || !persona.trim() || !industry.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating Ideas...
          </span>
        ) : (
          'Generate Ideas'
        )}
      </button>
    </form>
  );
}
