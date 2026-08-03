import { Request, Response } from 'express';
import { processQuery } from '../services/aiEngine';

export async function handleAiQuery(req: Request, res: Response) {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query prompt parameter is required' });
    }

    const response = await processQuery(query);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error processing AI query' });
  }
}
