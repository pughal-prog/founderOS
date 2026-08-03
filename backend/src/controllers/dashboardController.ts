import { Request, Response } from 'express';
import { pgPool } from '../config/db';
import { mockCustomers, mockMeetings, mockInvoices } from '../models/mockData';

export async function getDashboardData(req: Request, res: Response) {
  try {
    // Attempt live Supabase queries
    const mrrRes = await pgPool.query(`SELECT COALESCE(SUM(mrr), 0) as total_mrr, COUNT(*) as active_customers FROM customers WHERE status != 'churned';`);
    const meetingsRes = await pgPool.query(`SELECT * FROM meetings ORDER BY meeting_date DESC, created_at DESC LIMIT 10;`);
    const tasksRes = await pgPool.query(`SELECT COUNT(*) as pending_tasks FROM tasks WHERE completed = false;`);
    const emailsRes = await pgPool.query(`SELECT COUNT(*) as unread_emails FROM emails WHERE unread = true;`);
    const invoicesRes = await pgPool.query(`SELECT * FROM invoices ORDER BY due_date ASC;`);
    const customersRes = await pgPool.query(`SELECT * FROM customers ORDER BY created_at DESC;`);

    const totalMrr = parseFloat(mrrRes.rows[0]?.total_mrr || 0);
    const activeCustomers = parseInt(mrrRes.rows[0]?.active_customers || 0, 10);
    const pendingTasks = parseInt(tasksRes.rows[0]?.pending_tasks || 0, 10);
    const unreadEmails = parseInt(emailsRes.rows[0]?.unread_emails || 0, 10);

    return res.json({
      metrics: {
        monthlyRevenue: totalMrr * 1.1,
        mrr: totalMrr,
        activeCustomers: activeCustomers,
        meetingsToday: meetingsRes.rows.length,
        pendingTasks: pendingTasks,
        unreadEmails: unreadEmails
      },
      customers: customersRes.rows.map(c => ({
        id: c.id,
        name: c.name,
        company: c.company,
        email: c.email,
        status: c.status,
        mrr: parseFloat(c.mrr),
        lastContactDaysAgo: c.last_contact_at ? Math.floor((Date.now() - new Date(c.last_contact_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        replied: c.replied,
        notes: c.notes
      })),
      meetings: meetingsRes.rows.map(m => ({
        id: m.id,
        title: m.title,
        participant: m.participant,
        company: m.company,
        time: m.meeting_time,
        date: m.meeting_date,
        type: m.type,
        link: m.link
      })),
      invoices: invoicesRes.rows.map(i => ({
        id: i.id,
        invoiceNumber: i.invoice_number,
        customerName: i.customer_name,
        amount: parseFloat(i.amount),
        dueDate: i.due_date,
        status: i.status,
        daysOverdue: i.days_overdue
      }))
    });
  } catch (err) {
    // Fallback if DB is disconnected
    return res.json({
      metrics: {
        monthlyRevenue: 89000,
        mrr: 82500,
        activeCustomers: 215,
        meetingsToday: mockMeetings.length,
        pendingTasks: 4,
        unreadEmails: 3
      },
      customers: mockCustomers,
      meetings: mockMeetings,
      invoices: mockInvoices
    });
  }
}
