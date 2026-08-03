import { Request, Response } from 'express';
import { pgPool } from '../config/db';

// Get All Customers
export async function getCustomers(req: Request, res: Response) {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM customers';
    const values: any[] = [];

    if (status) {
      query += ' WHERE status = $1';
      values.push(status);
    }

    query += ' ORDER BY created_at DESC;';
    const result = await pgPool.query(query, values);

    const customers = result.rows.map(c => ({
      id: c.id,
      name: c.name,
      company: c.company,
      email: c.email,
      status: c.status,
      mrr: parseFloat(c.mrr),
      lastContactDaysAgo: c.last_contact_at ? Math.floor((Date.now() - new Date(c.last_contact_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      replied: c.replied,
      notes: c.notes
    }));

    return res.json(customers);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch customers', details: err.message });
  }
}

// Get Customer by ID
export async function getCustomerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pgPool.query('SELECT * FROM customers WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const c = result.rows[0];
    return res.json({
      id: c.id,
      name: c.name,
      company: c.company,
      email: c.email,
      status: c.status,
      mrr: parseFloat(c.mrr),
      lastContactDaysAgo: c.last_contact_at ? Math.floor((Date.now() - new Date(c.last_contact_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      replied: c.replied,
      notes: c.notes
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch customer', details: err.message });
  }
}

// Create Customer
export async function createCustomer(req: Request, res: Response) {
  try {
    const { name, company, email, status = 'active', mrr = 0, notes = '' } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({ error: 'Name, company, and email are required fields' });
    }

    // Get default org_id
    const orgRes = await pgPool.query('SELECT id FROM organizations LIMIT 1;');
    const orgId = orgRes.rows[0]?.id;

    const result = await pgPool.query(
      `INSERT INTO customers (organization_id, name, company, email, status, mrr, last_contact_at, replied, notes)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), false, $7)
       RETURNING *;`,
      [orgId, name, company, email, status, mrr, notes]
    );

    const c = result.rows[0];
    return res.status(201).json({
      id: c.id,
      name: c.name,
      company: c.company,
      email: c.email,
      status: c.status,
      mrr: parseFloat(c.mrr),
      lastContactDaysAgo: 0,
      replied: c.replied,
      notes: c.notes
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create customer', details: err.message });
  }
}

// Update Customer
export async function updateCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, company, email, status, mrr, replied, notes } = req.body;

    const existing = await pgPool.query('SELECT * FROM customers WHERE id = $1;', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const c = existing.rows[0];
    const updatedName = name ?? c.name;
    const updatedCompany = company ?? c.company;
    const updatedEmail = email ?? c.email;
    const updatedStatus = status ?? c.status;
    const updatedMrr = mrr ?? c.mrr;
    const updatedReplied = replied ?? c.replied;
    const updatedNotes = notes ?? c.notes;

    const result = await pgPool.query(
      `UPDATE customers
       SET name = $1, company = $2, email = $3, status = $4, mrr = $5, replied = $6, notes = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *;`,
      [updatedName, updatedCompany, updatedEmail, updatedStatus, updatedMrr, updatedReplied, updatedNotes, id]
    );

    const updated = result.rows[0];
    return res.json({
      id: updated.id,
      name: updated.name,
      company: updated.company,
      email: updated.email,
      status: updated.status,
      mrr: parseFloat(updated.mrr),
      lastContactDaysAgo: updated.last_contact_at ? Math.floor((Date.now() - new Date(updated.last_contact_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      replied: updated.replied,
      notes: updated.notes
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update customer', details: err.message });
  }
}

// Delete Customer
export async function deleteCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await pgPool.query('DELETE FROM customers WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.json({ message: 'Customer deleted successfully', id });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete customer', details: err.message });
  }
}
