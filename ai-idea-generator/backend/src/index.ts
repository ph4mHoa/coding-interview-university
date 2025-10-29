import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { ideasRoutes } from './routes/ideas';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);

/**
 * Main application server
 */
async function startServer() {
  // Create Fastify instance
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  try {
    // Register CORS
    await fastify.register(cors, {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    });

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      fastify.log.error('Failed to connect to database. Please check DATABASE_URL in .env');
      process.exit(1);
    }

    // Register routes
    await fastify.register(ideasRoutes);

    // Start server
    await fastify.listen({ port: PORT, host: '0.0.0.0' });

    fastify.log.info(`🚀 Server running at http://localhost:${PORT}`);
    fastify.log.info(`📚 API Documentation:`);
    fastify.log.info(`   POST /api/ideas/generate - Generate new ideas`);
    fastify.log.info(`   GET  /api/ideas          - Get existing ideas`);
    fastify.log.info(`   GET  /api/health         - Health check`);
  } catch (error) {
    fastify.log.error('Error starting server:', error);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    fastify.log.info(`${signal} received, shutting down gracefully...`);
    await fastify.close();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Start the server
startServer();
