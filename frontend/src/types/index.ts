export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'active' | 'at-risk' | 'churned' | 'prospect';
  mrr: number;
  lastContactDaysAgo: number;
  replied: boolean;
  notes: string;
}

export interface RevenueMetric {
  month: string;
  revenue: number;
  mrr: number;
  expenses: number;
  customers: number;
}

export interface Meeting {
  id: string;
  title: string;
  participant: string;
  company: string;
  time: string;
  date: string;
  type: 'demo' | 'investor' | 'customer' | 'team';
  link: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  sourceApp: 'Linear' | 'Jira' | 'Notion' | 'Gmail';
  assignee: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'overdue' | 'pending';
  daysOverdue?: number;
}

export interface SlackMessage {
  id: string;
  channel: string;
  sender: string;
  message: string;
  timestamp: string;
  hasMention: boolean;
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  date: string;
  unread: boolean;
  needsReply: boolean;
  daysUnreplied?: number;
}

export interface IntegrationApp {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  connected: boolean;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSynced: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'email' | 'meeting' | 'invoice' | 'view';
    targetId?: string;
  };
  dataPayload?: any;
}
