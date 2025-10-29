import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IdeaGeneratorService } from '../services/idea-generator';
import { GenerateIdeasRequest, GenerateIdeasResponse } from '../types';

/**
 * Register idea-related API routes
 */
export async function ideasRoutes(fastify: FastifyInstance) {
  const ideaService = new IdeaGeneratorService(3); // Max 3 retries

  /**
   * POST /api/ideas/generate
   * Generate new ideas using AI
   */
  fastify.post<{ Body: GenerateIdeasRequest }>(
    '/api/ideas/generate',
    {
      schema: {
        body: {
          type: 'object',
          required: ['persona', 'industry'],
          properties: {
            persona: { type: 'string', minLength: 1, maxLength: 255 },
            industry: { type: 'string', minLength: 1, maxLength: 255 },
            provider: {
              type: 'string',
              enum: ['openai', 'anthropic', 'gemini', 'deepseek'],
            },
            temperature: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: GenerateIdeasRequest }>,
      reply: FastifyReply
    ) => {
      const { persona, industry, provider = 'openai', temperature = 0.7 } = request.body;

      try {
        fastify.log.info(`Generating ideas for ${persona} in ${industry} using ${provider}`);

        // Generate ideas with AI
        const ideas = await ideaService.generateIdeas(
          persona,
          industry,
          provider,
          temperature
        );

        // Save to database
        await ideaService.saveIdeas(ideas, persona, industry);

        const response: GenerateIdeasResponse = {
          success: true,
          ideas,
        };

        return reply.code(200).send(response);
      } catch (error) {
        fastify.log.error('Error generating ideas:', error);

        const response: GenerateIdeasResponse = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        };

        return reply.code(500).send(response);
      }
    }
  );

  /**
   * GET /api/ideas
   * Retrieve existing ideas (with optional filters)
   */
  fastify.get<{
    Querystring: { persona?: string; industry?: string };
  }>(
    '/api/ideas',
    async (
      request: FastifyRequest<{ Querystring: { persona?: string; industry?: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const { persona, industry } = request.query;

        const ideas = await ideaService.getIdeas(persona, industry);

        return reply.code(200).send({
          success: true,
          ideas,
          count: ideas.length,
        });
      } catch (error) {
        fastify.log.error('Error fetching ideas:', error);

        return reply.code(500).send({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    }
  );

  /**
   * GET /api/health
   * Health check endpoint
   */
  fastify.get('/api/health', async (request, reply) => {
    return reply.code(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });
}
