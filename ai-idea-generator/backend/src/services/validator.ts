import Ajv, { JSONSchemaType } from 'ajv';
import { GeneratedIdea } from '../types';

const ajv = new Ajv();

/**
 * JSON Schema for validating a single idea
 */
const ideaSchema: JSONSchemaType<GeneratedIdea> = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1, maxLength: 500 },
    description: { type: 'string', minLength: 1 },
    rationale: { type: 'string', minLength: 1 },
  },
  required: ['title', 'description', 'rationale'],
  additionalProperties: false,
};

/**
 * JSON Schema for validating an array of ideas
 */
const ideasArraySchema = {
  type: 'array',
  items: ideaSchema,
  minItems: 1,
  maxItems: 20,
};

// Compile validators
const validateIdea = ajv.compile(ideaSchema);
const validateIdeasArray = ajv.compile(ideasArraySchema);

/**
 * Validator class for AI-generated ideas
 */
export class IdeaValidator {
  /**
   * Validate a single idea object
   */
  validateSingleIdea(idea: unknown): idea is GeneratedIdea {
    const isValid = validateIdea(idea);
    if (!isValid) {
      console.error('Validation errors:', validateIdea.errors);
    }
    return isValid;
  }

  /**
   * Validate an array of ideas
   */
  validateIdeasArray(ideas: unknown): ideas is GeneratedIdea[] {
    const isValid = validateIdeasArray(ideas);
    if (!isValid) {
      console.error('Validation errors:', validateIdeasArray.errors);
    }
    return isValid;
  }

  /**
   * Get validation errors as a readable string
   */
  getValidationErrors(): string {
    if (validateIdeasArray.errors) {
      return validateIdeasArray.errors
        .map((err) => `${err.instancePath} ${err.message}`)
        .join(', ');
    }
    return 'Unknown validation error';
  }

  /**
   * Try to parse and validate JSON response from LLM
   * Handles common JSON formatting issues
   */
  parseAndValidateJSON(response: string): GeneratedIdea[] | null {
    try {
      // Remove markdown code blocks if present
      let cleaned = response.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      // Parse JSON
      const parsed = JSON.parse(cleaned);

      // Validate
      if (this.validateIdeasArray(parsed)) {
        return parsed;
      }

      return null;
    } catch (error) {
      console.error('JSON parse error:', error);
      return null;
    }
  }
}
