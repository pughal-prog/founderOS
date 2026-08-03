import { Request, Response } from 'express';
import { pgPool } from '../config/db';

// Get Integrations
export async function getIntegrations(req: Request, res: Response) {
  try {
    const result = await pgPool.query('SELECT * FROM integrations ORDER BY created_at DESC;');
    const integrations = result.rows.map(i => ({
      id: i.id,
      name: i.name,
      category: i.category,
      description: i.description,
      iconName: i.icon_name,
      connected: i.connected,
      status: i.status,
      lastSynced: i.last_synced
    }));

    return res.json(integrations);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch integrations', details: err.message });
  }
}

// Get Integration By ID
export async function getIntegrationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pgPool.query('SELECT * FROM integrations WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const i = result.rows[0];
    return res.json({
      id: i.id,
      name: i.name,
      category: i.category,
      description: i.description,
      iconName: i.icon_name,
      connected: i.connected,
      status: i.status,
      lastSynced: i.last_synced
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch integration', details: err.message });
  }
}

// Create/Add Integration
export async function createIntegration(req: Request, res: Response) {
  try {
    const { name, category = 'General', description = '', iconName = 'App', connected = true, status = 'connected' } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const orgRes = await pgPool.query('SELECT id FROM organizations LIMIT 1;');
    const orgId = orgRes.rows[0]?.id;

    const result = await pgPool.query(
      `INSERT INTO integrations (organization_id, name, category, description, icon_name, connected, status, last_synced)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (organization_id, name) DO UPDATE SET
         category = EXCLUDED.category,
         description = EXCLUDED.description,
         icon_name = EXCLUDED.icon_name,
         connected = EXCLUDED.connected,
         status = EXCLUDED.status,
         last_synced = NOW(),
         updated_at = NOW()
       RETURNING *;`,
      [orgId, name, category, description, iconName, connected, status]
    );

    const i = result.rows[0];
    return res.status(201).json({
      id: i.id,
      name: i.name,
      category: i.category,
      description: i.description,
      iconName: i.icon_name,
      connected: i.connected,
      status: i.status,
      lastSynced: i.last_synced
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create integration', details: err.message });
  }
}

// Update Integration Status
export async function updateIntegration(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { connected, status, description } = req.body;

    const existing = await pgPool.query('SELECT * FROM integrations WHERE id = $1;', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const i = existing.rows[0];
    const updatedConnected = connected !== undefined ? connected : i.connected;
    const updatedStatus = status ?? (updatedConnected ? 'connected' : 'disconnected');
    const updatedDescription = description ?? i.description;

    const result = await pgPool.query(
      `UPDATE integrations
       SET connected = $1, status = $2, description = $3, last_synced = NOW(), updated_at = NOW()
       WHERE id = $4
       RETURNING *;`,
      [updatedConnected, updatedStatus, updatedDescription, id]
    );

    const updated = result.rows[0];
    return res.json({
      id: updated.id,
      name: updated.name,
      category: updated.category,
      description: updated.description,
      iconName: updated.icon_name,
      connected: updated.connected,
      status: updated.status,
      lastSynced: updated.last_synced
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update integration', details: err.message });
  }
}

// Delete/Disconnect Integration
export async function deleteIntegration(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pgPool.query('DELETE FROM integrations WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    return res.json({ message: 'Integration deleted successfully', id });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete integration', details: err.message });
  }
}
