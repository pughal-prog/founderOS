import { Request, Response } from 'express';
import { pgPool } from '../config/db';

// Get Tasks
export async function getTasks(req: Request, res: Response) {
  try {
    const { completed, priority } = req.query;
    let query = 'SELECT * FROM tasks';
    const values: any[] = [];
    const conditions: string[] = [];

    if (completed !== undefined) {
      values.push(completed === 'true');
      conditions.push(`completed = $${values.length}`);
    }

    if (priority) {
      values.push(priority);
      conditions.push(`priority = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY due_date ASC, created_at DESC;';
    const result = await pgPool.query(query, values);

    const tasks = result.rows.map(t => ({
      id: t.id,
      title: t.title,
      dueDate: t.due_date,
      priority: t.priority,
      completed: t.completed,
      sourceApp: t.source_app,
      assignee: t.assignee
    }));

    return res.json(tasks);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
}

// Get Task By ID
export async function getTaskById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pgPool.query('SELECT * FROM tasks WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const t = result.rows[0];
    return res.json({
      id: t.id,
      title: t.title,
      dueDate: t.due_date,
      priority: t.priority,
      completed: t.completed,
      sourceApp: t.source_app,
      assignee: t.assignee
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch task', details: err.message });
  }
}

// Create Task
export async function createTask(req: Request, res: Response) {
  try {
    const { title, dueDate, priority = 'medium', sourceApp = 'Notion', assignee = 'Alex Mercer' } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const orgRes = await pgPool.query('SELECT id FROM organizations LIMIT 1;');
    const orgId = orgRes.rows[0]?.id;

    const result = await pgPool.query(
      `INSERT INTO tasks (organization_id, title, due_date, priority, completed, source_app, assignee)
       VALUES ($1, $2, $3, $4, false, $5, $6)
       RETURNING *;`,
      [orgId, title, dueDate || new Date().toISOString().split('T')[0], priority, sourceApp, assignee]
    );

    const t = result.rows[0];
    return res.status(201).json({
      id: t.id,
      title: t.title,
      dueDate: t.due_date,
      priority: t.priority,
      completed: t.completed,
      sourceApp: t.source_app,
      assignee: t.assignee
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
}

// Update Task
export async function updateTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, dueDate, priority, completed, sourceApp, assignee } = req.body;

    const existing = await pgPool.query('SELECT * FROM tasks WHERE id = $1;', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const t = existing.rows[0];
    const updatedTitle = title ?? t.title;
    const updatedDueDate = dueDate ?? t.due_date;
    const updatedPriority = priority ?? t.priority;
    const updatedCompleted = completed !== undefined ? completed : t.completed;
    const updatedSourceApp = sourceApp ?? t.source_app;
    const updatedAssignee = assignee ?? t.assignee;

    const result = await pgPool.query(
      `UPDATE tasks
       SET title = $1, due_date = $2, priority = $3, completed = $4, source_app = $5, assignee = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *;`,
      [updatedTitle, updatedDueDate, updatedPriority, updatedCompleted, updatedSourceApp, updatedAssignee, id]
    );

    const updated = result.rows[0];
    return res.json({
      id: updated.id,
      title: updated.title,
      dueDate: updated.due_date,
      priority: updated.priority,
      completed: updated.completed,
      sourceApp: updated.source_app,
      assignee: updated.assignee
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update task', details: err.message });
  }
}

// Delete Task
export async function deleteTask(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pgPool.query('DELETE FROM tasks WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json({ message: 'Task deleted successfully', id });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete task', details: err.message });
  }
}
