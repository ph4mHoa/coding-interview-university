'use client';

import { GeneratedIdea } from '../types';

interface IdeasDisplayProps {
  ideas: GeneratedIdea[];
  error: string | null;
  isLoading: boolean;
}

/**
 * Component to display generated ideas with loading and error states
 */
export default function IdeasDisplay({ ideas, error, isLoading }: IdeasDisplayProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="animate-spin h-12 w-12 text-primary-600 mb-4"
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Ideas...</h3>
          <p className="text-gray-600 text-center max-w-md">
            Our AI is crafting creative content ideas for you. This may take up to 30 seconds.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="bg-red-100 rounded-full p-3 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Occurred</h3>
          <p className="text-red-600 text-center max-w-md mb-4">{error}</p>
          <p className="text-sm text-gray-500 text-center">
            Please check your API keys in the backend .env file and try again.
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (ideas.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-primary-100 rounded-full p-4 mb-4">
            <svg
              className="h-12 w-12 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Generate Ideas</h3>
          <p className="text-gray-600 text-center max-w-md">
            Fill in the form above to generate creative content ideas using AI.
          </p>
        </div>
      </div>
    );
  }

  // Success state - display ideas
  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Generated Ideas ({ideas.length})
        </h3>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          Success!
        </div>
      </div>

      <div className="space-y-6">
        {ideas.map((idea, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200"
          >
            <div className="flex items-start">
              <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {idea.title}
                </h4>
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {idea.description}
                </p>
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-primary-400">
                  <p className="text-sm font-medium text-gray-600 mb-1">Why this works:</p>
                  <p className="text-sm text-gray-700">{idea.rationale}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
