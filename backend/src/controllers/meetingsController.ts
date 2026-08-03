import { Request, Response } from 'express';
import { pgPool } from '../config/db';

// Get Meetings
export async function getMeetings(req: Request, res: Response) {
  try {
    const result = await pgPool.query('SELECT * FROM meetings ORDER BY meeting_date ASC, created_at DESC;');
    const meetings = result.rows.map(m => ({
      id: m.id,
      title: m.title,
      participant: m.participant,
      company: m.company,
      time: m.meeting_time,
      date: m.meeting_date,
      type: m.type,
      link: m.link
    }));

    return res.json(meetings);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch meetings', details: err.message });
  }
}

// Get Meeting By ID
export async function getMeetingById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pgPool.query('SELECT * FROM meetings WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const m = result.rows[0];
    return res.json({
      id: m.id,
      title: m.title,
      participant: m.participant,
      company: m.company,
      time: m.meeting_time,
      date: m.meeting_date,
      type: m.type,
      link: m.link
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch meeting', details: err.message });
  }
}

// Create Meeting
export async function createMeeting(req: Request, res: Response) {
  try {
    const { title, participant, company = '', time = '10:00 AM - 10:30 AM', date, type = 'customer', link = '' } = req.body;

    if (!title || !participant) {
      return res.status(400).json({ error: 'Title and participant are required' });
    }

    const orgRes = await pgPool.query('SELECT id FROM organizations LIMIT 1;');
    const orgId = orgRes.rows[0]?.id;

    const result = await pgPool.query(
      `INSERT INTO meetings (organization_id, title, participant, company, meeting_time, meeting_date, type, link)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *;`,
      [orgId, title, participant, company, time, date || new Date().toISOString().split('T')[0], type, link]
    );

    const m = result.rows[0];
    return res.status(201).json({
      id: m.id,
      title: m.title,
      participant: m.participant,
      company: m.company,
      time: m.meeting_time,
      date: m.meeting_date,
      type: m.type,
      link: m.link
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create meeting', details: err.message });
  }
}

// Update Meeting
export async function updateMeeting(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, participant, company, time, date, type, link } = req.body;

    const existing = await pgPool.query('SELECT * FROM meetings WHERE id = $1;', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    const m = existing.rows[0];
    const updatedTitle = title ?? m.title;
    const updatedParticipant = participant ?? m.participant;
    const updatedCompany = company ?? m.company;
    const updatedTime = time ?? m.meeting_time;
    const updatedDate = date ?? m.meeting_date;
    const updatedType = type ?? m.type;
    const updatedLink = link ?? m.link;

    const result = await pgPool.query(
      `UPDATE meetings
       SET title = $1, participant = $2, company = $3, meeting_time = $4, meeting_date = $5, type = $6, link = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *;`,
      [updatedTitle, updatedParticipant, updatedCompany, updatedTime, updatedDate, updatedType, updatedLink, id]
    );

    const updated = result.rows[0];
    return res.json({
      id: updated.id,
      title: updated.title,
      participant: updated.participant,
      company: updated.company,
      time: updated.meeting_time,
      date: updated.meeting_date,
      type: updated.type,
      link: updated.link
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update meeting', details: err.message });
  }
}

// Delete Meeting
export async function deleteMeeting(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pgPool.query('DELETE FROM meetings WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    return res.json({ message: 'Meeting deleted successfully', id });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete meeting', details: err.message });
  }
}
