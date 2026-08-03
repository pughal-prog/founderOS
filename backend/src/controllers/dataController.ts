import { Request, Response } from 'express';
import { mockCustomers, mockMeetings, mockInvoices } from '../models/mockData';
import { getDatabaseStatus } from '../config/db';

export function getDashboardData(req: Request, res: Response) {
  const dbStatus = getDatabaseStatus();
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
    invoices: mockInvoices,
    dbStatus
  });
}
