import { 
  Customer, 
  RevenueMetric, 
  Meeting, 
  Task, 
  Invoice, 
  SlackMessage, 
  Email, 
  IntegrationApp 
} from '../types';

export const mockCustomers: Customer[] = [
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
  },
  {
    id: 'c4',
    name: 'David Vance',
    company: 'Nexus Dynamics',
    email: 'dvance@nexus.com',
    status: 'prospect',
    mrr: 0,
    lastContactDaysAgo: 3,
    replied: false,
    notes: 'Evaluating $24k ARR proposal.'
  },
  {
    id: 'c5',
    name: 'Jessica Taylor',
    company: 'HyperScale AI',
    email: 'jtaylor@hyperscale.ai',
    status: 'active',
    mrr: 8500,
    lastContactDaysAgo: 2,
    replied: true,
    notes: 'Requested custom SLA agreement.'
  }
];

export const mockRevenueHistory: RevenueMetric[] = [
  { month: 'Jan', revenue: 42000, mrr: 38000, expenses: 24000, customers: 110 },
  { month: 'Feb', revenue: 48000, mrr: 44000, expenses: 25000, customers: 124 },
  { month: 'Mar', revenue: 56000, mrr: 51000, expenses: 26500, customers: 142 },
  { month: 'Apr', revenue: 64000, mrr: 59000, expenses: 28000, customers: 160 },
  { month: 'May', revenue: 75000, mrr: 68000, expenses: 29500, customers: 185 },
  { month: 'Jun', revenue: 89000, mrr: 82500, expenses: 31000, customers: 215 },
];

export const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Series A Investor Catchup',
    participant: 'Alex Vance (Sequoia Capital)',
    company: 'Sequoia Capital',
    time: '10:00 AM - 10:45 AM',
    date: 'Today',
    type: 'investor',
    link: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'm2',
    title: 'Acme Enterprise Demo & Security Review',
    participant: 'Sarah Jenkins (VP Tech)',
    company: 'Acme Inc.',
    time: '02:00 PM - 03:00 PM',
    date: 'Today',
    type: 'customer',
    link: 'https://meet.google.com/xyz-1234-uvw'
  },
  {
    id: 'm3',
    title: 'Weekly Engineering Sprint Sync',
    participant: 'Dev Core Team',
    company: 'Internal FounderOS',
    time: '04:30 PM - 05:00 PM',
    date: 'Today',
    type: 'team',
    link: 'https://meet.google.com/eng-sync-room'
  },
  {
    id: 'm4',
    title: 'HyperScale AI Contract Negotiation',
    participant: 'Jessica Taylor (CEO)',
    company: 'HyperScale AI',
    time: '11:00 AM - 11:45 AM',
    date: 'Tomorrow',
    type: 'customer',
    link: 'https://meet.google.com/hyperscale-deal'
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Send follow-up email to Acme Inc. regarding contract redlines',
    dueDate: 'Today',
    priority: 'high',
    completed: false,
    sourceApp: 'Gmail',
    assignee: 'Founder'
  },
  {
    id: 't2',
    title: 'Resolve Stripe webhook failure for Apex Cloud payment retry',
    dueDate: 'Today',
    priority: 'high',
    completed: false,
    sourceApp: 'Linear',
    assignee: 'Engineering'
  },
  {
    id: 't3',
    title: 'Review Q3 Financial Forecast deck for Sequoia meeting',
    dueDate: 'Today',
    priority: 'medium',
    completed: true,
    sourceApp: 'Notion',
    assignee: 'Founder'
  },
  {
    id: 't4',
    title: 'Update HubSpot CRM lifecycle stage for HyperScale AI',
    dueDate: 'Tomorrow',
    priority: 'medium',
    completed: false,
    sourceApp: 'Jira',
    assignee: 'Sales Ops'
  }
];

export const mockInvoices: Invoice[] = [
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
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-003',
    customerName: 'Starlight Labs',
    amount: 14400,
    dueDate: '2026-08-01',
    status: 'paid'
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-004',
    customerName: 'HyperScale AI',
    amount: 8500,
    dueDate: '2026-08-15',
    status: 'pending'
  }
];

export const mockEmails: Email[] = [
  {
    id: 'e1',
    sender: 'sarah@acme.com',
    subject: 'Question on SOC-2 Compliance Audit',
    snippet: 'Hi, we are reviewing your security documentation before signing the enterprise plan...',
    date: '9 days ago',
    unread: true,
    needsReply: true,
    daysUnreplied: 9
  },
  {
    id: 'e2',
    sender: 'elena@apexcloud.net',
    subject: 'Failed Payment Notification Response',
    snippet: 'Hey team, our corporate card was re-issued last week. Can you send a updated Stripe billing link?',
    date: '14 days ago',
    unread: true,
    needsReply: true,
    daysUnreplied: 14
  },
  {
    id: 'e3',
    sender: 'dvance@nexus.com',
    subject: 'Proposal Feedback & Terms',
    snippet: 'We reviewed your proposal. We are ready to move forward if you can match 30-day terms...',
    date: '3 days ago',
    unread: false,
    needsReply: true,
    daysUnreplied: 3
  }
];

export const mockIntegrations: IntegrationApp[] = [
  {
    id: 'app-gmail',
    name: 'Gmail',
    category: 'Communication & Email',
    description: 'Sync email threads, unreplied customer messages, and founder inbox intelligence.',
    iconName: 'Mail',
    connected: true,
    status: 'connected',
    lastSynced: '2 mins ago',
    authType: 'oauth2',
    scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send', 'offline_access'],
    connectedUser: {
      name: 'Alex Vance',
      email: 'alex@founderos.io',
      role: 'Workspace Administrator'
    },
    healthStatus: 'healthy',
    clientId: '782910482931-google-oauth.apps.googleusercontent.com',
    redirectUri: 'https://app.founderos.io/api/auth/callback/gmail'
  },
  {
    id: 'app-jira',
    name: 'Jira Software',
    category: 'Project Management',
    description: 'Sync enterprise customer feature tickets, Atlassian projects, and security compliance epics.',
    iconName: 'Layers',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'oauth2',
    siteUrl: 'founderos-tech.atlassian.net',
    scopes: ['read:jira-work', 'write:jira-work', 'read:jira-user', 'offline_access'],
    clientId: 'atlassian_consumer_client_9942',
    healthStatus: 'warning',
    redirectUri: 'https://app.founderos.io/api/auth/callback/jira'
  },
  {
    id: 'app-slack',
    name: 'Slack',
    category: 'Team Communication',
    description: 'Index team channels, customer escalation pings, and internal founder sentiment.',
    iconName: 'MessageSquare',
    connected: true,
    status: 'connected',
    lastSynced: 'Just now',
    authType: 'oauth2',
    scopes: ['channels:read', 'chat:write', 'users:read', 'team:read'],
    connectedUser: {
      name: 'Alex Vance',
      email: 'alex@founderos.io',
      role: 'Workspace Owner'
    },
    healthStatus: 'healthy',
    clientId: '184920491.4920104-slack-client',
    redirectUri: 'https://app.founderos.io/api/auth/callback/slack'
  },
  {
    id: 'app-stripe',
    name: 'Stripe',
    category: 'Payments & Revenue',
    description: 'Real-time MRR, net churn rate, failed invoice retries, and customer LTV.',
    iconName: 'CreditCard',
    connected: true,
    status: 'connected',
    lastSynced: 'Just now',
    authType: 'api_token',
    apiKey: 'rk_live_51Nx92••••••••••••••••••••',
    scopes: ['read_only', 'invoices:write', 'customers:read'],
    connectedUser: {
      name: 'FounderOS Primary Account',
      email: 'billing@founderos.io',
      role: 'Finance Admin'
    },
    healthStatus: 'healthy'
  },
  {
    id: 'app-github',
    name: 'GitHub',
    category: 'Code & Releases',
    description: 'Monitor pull requests, deployment status, bug commits, and release velocity.',
    iconName: 'Code',
    connected: true,
    status: 'connected',
    lastSynced: '30 mins ago',
    authType: 'oauth2',
    scopes: ['repo', 'read:org', 'user:email', 'read:user'],
    connectedUser: {
      name: 'alexvance-dev',
      email: 'alex.vance@github.org',
      role: 'Org Owner'
    },
    healthStatus: 'healthy',
    clientId: 'Iv1.82910482901abcf',
    redirectUri: 'https://app.founderos.io/api/auth/callback/github'
  },
  {
    id: 'app-notion',
    name: 'Notion',
    category: 'Knowledge & Specs',
    description: 'Index product specs, company wikis, meeting notes, and founder OKRs.',
    iconName: 'FileText',
    connected: true,
    status: 'connected',
    lastSynced: '15 mins ago',
    authType: 'api_token',
    apiKey: 'ntn_secret_8291048921048912',
    scopes: ['read_content', 'update_content', 'insert_content'],
    connectedUser: {
      name: 'FounderOS Workspace',
      email: 'docs@founderos.io'
    },
    healthStatus: 'healthy'
  },
  {
    id: 'app-calendar',
    name: 'Google Calendar',
    category: 'Meetings & Schedule',
    description: 'Sync founder calendar events, investor demos, and customer calls.',
    iconName: 'Calendar',
    connected: true,
    status: 'connected',
    lastSynced: 'Just now',
    authType: 'oauth2',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'],
    connectedUser: {
      name: 'Alex Vance',
      email: 'alex@founderos.io'
    },
    healthStatus: 'healthy',
    clientId: '782910482931-google-oauth.apps.googleusercontent.com'
  },
  {
    id: 'app-hubspot',
    name: 'HubSpot',
    category: 'CRM & Pipeline',
    description: 'Track deal stages, contact timeline history, and lead scoring.',
    iconName: 'Users',
    connected: true,
    status: 'connected',
    lastSynced: '5 mins ago',
    authType: 'oauth2',
    scopes: ['crm.objects.contacts.read', 'crm.objects.deals.read', 'crm.schemas.contacts.read'],
    connectedUser: {
      name: 'FounderOS Sales Hub',
      email: 'sales@founderos.io'
    },
    healthStatus: 'healthy',
    clientId: 'hubspot-consumer-app-1849'
  },
  {
    id: 'app-linear',
    name: 'Linear',
    category: 'Issue Tracking',
    description: 'Track engineering roadmap issues, bug priorities, and sprint progress.',
    iconName: 'CheckSquare',
    connected: true,
    status: 'connected',
    lastSynced: '10 mins ago',
    authType: 'oauth2',
    scopes: ['read', 'write', 'issues:create'],
    connectedUser: {
      name: 'Alex Vance',
      email: 'alex@founderos.io'
    },
    healthStatus: 'healthy',
    clientId: 'linear_app_id_9921'
  }
];
