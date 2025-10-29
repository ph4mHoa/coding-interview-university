import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { ideaRoutes } from './routes/ideas';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Register CORS
fastify.register(cors, {
  origin: 'http://localhost:3000',
});

// Register routes
fastify.register(ideaRoutes);

// Health check
fastify.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 4000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
