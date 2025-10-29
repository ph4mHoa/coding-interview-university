import Fastify from 'fastify';
import cors from '@fastify/cors';
import { CreateIdeaBody, UpdateIdeaBody, Idea } from './types';

const fastify = Fastify({
  logger: true,
});

// In-memory storage for demo
let ideas: Idea[] = [
  {
    id: 1,
    title: 'Top 10 Digital Marketing Trends 2024',
    description: 'Comprehensive guide to latest marketing trends including AI, personalization, and video content',
    persona: 'Marketing Manager',
    industry: 'Digital Marketing',
    status: 'published',
    created_at: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: 2,
    title: 'How to Build a REST API with Node.js',
    description: 'Step-by-step tutorial for beginners on creating RESTful APIs',
    persona: 'Junior Developer',
    industry: 'Technology',
    status: 'draft',
    created_at: new Date('2024-01-16T14:20:00Z'),
  },
  {
    id: 3,
    title: 'Healthcare Data Security Best Practices',
    description: 'Essential security measures for protecting patient data in healthcare systems',
    persona: 'CTO',
    industry: 'Healthcare',
    status: 'in-progress',
    created_at: new Date('2024-01-17T09:15:00Z'),
  },
];

let nextId = 4;

// Register CORS
fastify.register(cors, {
  origin: 'http://localhost:3000',
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', mode: 'demo' };
});

// GET all ideas
fastify.get('/ideas', async (request, reply) => {
  return ideas.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
});

// GET single idea by ID
fastify.get<{ Params: { id: string } }>('/ideas/:id', async (request, reply) => {
  const { id } = request.params;
  const idea = ideas.find(i => i.id === parseInt(id));

  if (!idea) {
    return reply.status(404).send({ error: 'Idea not found' });
  }

  return idea;
});

// POST create new idea
fastify.post<{ Body: CreateIdeaBody }>('/ideas', async (request, reply) => {
  const { title, description, persona, industry, status = 'draft' } = request.body;

  if (!title) {
    return reply.status(400).send({ error: 'Title is required' });
  }

  const newIdea: Idea = {
    id: nextId++,
    title,
    description,
    persona,
    industry,
    status,
    created_at: new Date(),
  };

  ideas.push(newIdea);
  reply.status(201).send(newIdea);
});

// PUT update idea
fastify.put<{ Params: { id: string }; Body: UpdateIdeaBody }>(
  '/ideas/:id',
  async (request, reply) => {
    const { id } = request.params;
    const { title, description, persona, industry, status } = request.body;

    const ideaIndex = ideas.findIndex(i => i.id === parseInt(id));

    if (ideaIndex === -1) {
      return reply.status(404).send({ error: 'Idea not found' });
    }

    ideas[ideaIndex] = {
      ...ideas[ideaIndex],
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(persona !== undefined && { persona }),
      ...(industry !== undefined && { industry }),
      ...(status && { status }),
    };

    return ideas[ideaIndex];
  }
);

// DELETE idea
fastify.delete<{ Params: { id: string } }>(
  '/ideas/:id',
  async (request, reply) => {
    const { id } = request.params;
    const ideaIndex = ideas.findIndex(i => i.id === parseInt(id));

    if (ideaIndex === -1) {
      return reply.status(404).send({ error: 'Idea not found' });
    }

    ideas.splice(ideaIndex, 1);
    return { message: 'Idea deleted successfully' };
  }
);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`\n🚀 Demo Server running on http://localhost:${port}`);
    console.log(`📝 In-memory storage mode - data will be lost on restart\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
