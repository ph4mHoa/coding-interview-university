import { FastifyInstance } from 'fastify';
import pool from '../db';
import { CreateIdeaBody, UpdateIdeaBody } from '../types';

export async function ideaRoutes(fastify: FastifyInstance) {
  // GET all ideas
  fastify.get('/ideas', async (request, reply) => {
    try {
      const result = await pool.query(
        'SELECT * FROM ideas ORDER BY created_at DESC'
      );
      return result.rows;
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch ideas' });
    }
  });

  // GET single idea by ID
  fastify.get<{ Params: { id: string } }>('/ideas/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query('SELECT * FROM ideas WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Idea not found' });
      }

      return result.rows[0];
    } catch (error) {
      reply.status(500).send({ error: 'Failed to fetch idea' });
    }
  });

  // POST create new idea
  fastify.post<{ Body: CreateIdeaBody }>('/ideas', async (request, reply) => {
    try {
      const { title, description, persona, industry, status = 'draft' } = request.body;

      if (!title) {
        return reply.status(400).send({ error: 'Title is required' });
      }

      const result = await pool.query(
        `INSERT INTO ideas (title, description, persona, industry, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, description, persona, industry, status]
      );

      reply.status(201).send(result.rows[0]);
    } catch (error) {
      reply.status(500).send({ error: 'Failed to create idea' });
    }
  });

  // PUT update idea
  fastify.put<{ Params: { id: string }; Body: UpdateIdeaBody }>(
    '/ideas/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { title, description, persona, industry, status } = request.body;

        const result = await pool.query(
          `UPDATE ideas
           SET title = COALESCE($1, title),
               description = COALESCE($2, description),
               persona = COALESCE($3, persona),
               industry = COALESCE($4, industry),
               status = COALESCE($5, status)
           WHERE id = $6
           RETURNING *`,
          [title, description, persona, industry, status, id]
        );

        if (result.rows.length === 0) {
          return reply.status(404).send({ error: 'Idea not found' });
        }

        return result.rows[0];
      } catch (error) {
        reply.status(500).send({ error: 'Failed to update idea' });
      }
    }
  );

  // DELETE idea
  fastify.delete<{ Params: { id: string } }>(
    '/ideas/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const result = await pool.query(
          'DELETE FROM ideas WHERE id = $1 RETURNING *',
          [id]
        );

        if (result.rows.length === 0) {
          return reply.status(404).send({ error: 'Idea not found' });
        }

        return { message: 'Idea deleted successfully' };
      } catch (error) {
        reply.status(500).send({ error: 'Failed to delete idea' });
      }
    }
  );
}
