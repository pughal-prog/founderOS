export const mockCustomers = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    company: 'Acme Inc.',
    email: 'sarah@acme.com',
    status: 'at-risk',
    mrr: 4500,
    lastContactDaysAgo: 9,
    replied: false,
    notes: 'No reply for 9 days after security questionnaire sent.'
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    company: 'Starlight Labs',
    email: 'mchen@starlight.io',
    status: 'active',
    mrr: 12000,
    lastContactDaysAgo: 1,
    replied: true,
    notes: 'Upgraded to Enterprise tier last week.'
  },
  {
    id: 'c3',
    name: 'Elena Rostova',
    company: 'Apex Cloud',
    email: 'elena@apexcloud.net',
    status: 'at-risk',
    mrr: 2800,
    lastContactDaysAgo: 14,
    replied: false,
    notes: 'Payment failed twice in Stripe. High churn risk.'
  }
];

export const mockMeetings = [
  {
    id: 'm1',
    title: 'Series A Investor Catchup',
    participant: 'Alex Vance (Sequoia Capital)',
    company: 'Sequoia Capital',
    time: '10:00 AM - 10:45 AM',
    date: 'Today',
    type: 'investor'
  },
  {
    id: 'm2',
    title: 'Acme Enterprise Demo & Security Review',
    participant: 'Sarah Jenkins (VP Tech)',
    company: 'Acme Inc.',
    time: '02:00 PM - 03:00 PM',
    date: 'Today',
    type: 'customer'
  }
];

export const mockInvoices = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-001',
    customerName: 'Apex Cloud',
    amount: 5600,
    dueDate: '2026-07-20',
    status: 'overdue',
    daysOverdue: 14
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-002',
    customerName: 'Nexus Dynamics',
    amount: 12000,
    dueDate: '2026-07-28',
    status: 'overdue',
    daysOverdue: 6
  }
];
