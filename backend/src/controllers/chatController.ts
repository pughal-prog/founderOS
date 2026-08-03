import { Request, Response } from 'express';
import { pgPool } from '../config/db';
import { streamOpenAIResponse, generateOpenAIResponse } from '../services/openaiService';

// Get Chat History from Supabase
export async function getChatHistory(req: Request, res: Response) {
  try {
    const result = await pgPool.query(
      `SELECT * FROM chat_history ORDER BY created_at ASC LIMIT 100;`
    );

    const history = result.rows.map(item => ({
      id: item.id,
      sender: item.sender,
      text: item.text,
      timestamp: item.created_at,
      suggestedAction: item.suggested_action,
      dataPayload: item.data_payload
    }));

    return res.json(history);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch chat history', details: err.message });
  }
}

// Standard JSON Chat Message (Non-Streaming)
export async function sendChatMessage(req: Request, res: Response) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const orgRes = await pgPool.query('SELECT id FROM organizations LIMIT 1;');
    const userRes = await pgPool.query('SELECT id FROM users LIMIT 1;');
    const orgId = orgRes.rows[0]?.id;
    const userId = userRes.rows[0]?.id;

    // 1. Fetch recent conversation history for context
    const historyRes = await pgPool.query(
      `SELECT sender, text FROM chat_history ORDER BY created_at DESC LIMIT 10;`
    );

    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = 
      historyRes.rows.reverse().map(row => ({
        role: row.sender === 'user' ? 'user' : 'assistant',
        content: row.text
      }));

    // 2. Persist user message turn in Supabase chat_history
    const userMsgResult = await pgPool.query(
      `INSERT INTO chat_history (organization_id, user_id, sender, text)
       VALUES ($1, $2, 'user', $3)
       RETURNING *;`,
      [orgId, userId, message]
    );

    // 3. Generate OpenAI response
    const { text: replyText, suggestedAction } = await generateOpenAIResponse(message, conversationHistory);

    // 4. Persist AI message turn in Supabase chat_history
    const aiMsgResult = await pgPool.query(
      `INSERT INTO chat_history (organization_id, user_id, sender, text, suggested_action)
       VALUES ($1, $2, 'ai', $3, $4)
       RETURNING *;`,
      [
        orgId,
        userId,
        replyText,
        suggestedAction ? JSON.stringify(suggestedAction) : null
      ]
    );

    const aiRow = aiMsgResult.rows[0];

    return res.json({
      userMessage: {
        id: userMsgResult.rows[0].id,
        sender: 'user',
        text: message,
        timestamp: userMsgResult.rows[0].created_at
      },
      aiResponse: {
        id: aiRow.id,
        sender: 'ai',
        text: aiRow.text,
        timestamp: aiRow.created_at,
        suggestedAction: aiRow.suggested_action
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process chat message', details: err.message });
  }
}

// Server-Sent Events (SSE) Streaming Chat Message
export async function streamChatMessage(req: Request, res: Response) {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message string is required' });
  }

  // Setup Server-Sent Events (SSE) Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const orgRes = await pgPool.query('SELECT id FROM organizations LIMIT 1;');
    const userRes = await pgPool.query('SELECT id FROM users LIMIT 1;');
    const orgId = orgRes.rows[0]?.id;
    const userId = userRes.rows[0]?.id;

    // 1. Save user prompt turn to Supabase chat_history table
    const userMsgResult = await pgPool.query(
      `INSERT INTO chat_history (organization_id, user_id, sender, text)
       VALUES ($1, $2, 'user', $3)
       RETURNING id;`,
      [orgId, userId, message]
    );

    const userMessageId = userMsgResult.rows[0]?.id;

    // Send initial SSE notification
    res.write(`data: ${JSON.stringify({ event: 'start', userMessageId })}\n\n`);

    // 2. Load context history
    const historyRes = await pgPool.query(
      `SELECT sender, text FROM chat_history ORDER BY created_at DESC LIMIT 10;`
    );

    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = 
      historyRes.rows.reverse().map(row => ({
        role: row.sender === 'user' ? 'user' : 'assistant',
        content: row.text
      }));

    // 3. Stream AI tokens & callback
    const { fullText, suggestedAction } = await streamOpenAIResponse(
      message,
      conversationHistory,
      (deltaText: string) => {
        res.write(`data: ${JSON.stringify({ event: 'chunk', deltaText })}\n\n`);
      }
    );

    // 4. Save completed AI response turn to Supabase chat_history table
    const aiMsgResult = await pgPool.query(
      `INSERT INTO chat_history (organization_id, user_id, sender, text, suggested_action)
       VALUES ($1, $2, 'ai', $3, $4)
       RETURNING id, created_at;`,
      [
        orgId,
        userId,
        fullText,
        suggestedAction ? JSON.stringify(suggestedAction) : null
      ]
    );

    const aiMessageId = aiMsgResult.rows[0]?.id;

    // Send final SSE completion event
    res.write(`data: ${JSON.stringify({ 
      event: 'done', 
      aiMessageId, 
      fullText, 
      suggestedAction 
    })}\n\n`);

    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ event: 'error', error: err.message || 'Stream processing failed' })}\n\n`);
    res.end();
  }
}

// Clear Chat History
export async function clearChatHistory(req: Request, res: Response) {
  try {
    await pgPool.query('DELETE FROM chat_history;');
    return res.json({ message: 'Chat history cleared successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to clear chat history', details: err.message });
  }
}
