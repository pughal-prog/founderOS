import { pgPool } from '../config/db';

export interface SearchResults {
  customers: Array<{ id: string; name: string; company: string; email: string; status: string; mrr: number; notes: string }>;
  emails: Array<{ id: string; sender: string; senderEmail: string; subject: string; snippet: string; unread: boolean; needsReply: boolean; daysUnreplied?: number }>;
  meetings: Array<{ id: string; title: string; participant: string; company: string; meetingTime: string; meetingDate: string; type: string; link: string }>;
  slackMessages: Array<{ id: string; channel: string; sender: string; message: string; hasMention: boolean; sentAt: string }>;
  tasks: Array<{ id: string; title: string; dueDate: string; priority: string; completed: boolean; sourceApp: string; assignee: string }>;
  invoices: Array<{ id: string; invoiceNumber: string; customerName: string; amount: number; dueDate: string; status: string; daysOverdue: number }>;
  metricsSnapshot?: {
    totalMrr: number;
    activeCustomers: number;
    atRiskCustomers: number;
    atRiskMrr: number;
    overdueInvoicesCount: number;
    overdueInvoicesTotal: number;
    unrepliedEmailsCount: number;
    pendingTasksCount: number;
  };
}

export async function searchDatabaseContext(queryText: string): Promise<SearchResults> {
  const queryLower = queryText.trim().toLowerCase();
  const searchTerm = `%${queryLower}%`;

  try {
    // 1. Fetch Executive Baseline Snapshot (high efficiency single-phase queries)
    const [mrrRes, riskRes, invSnapRes, unrepliedSnapRes, tasksSnapRes] = await Promise.all([
      pgPool.query(`SELECT COUNT(*) as cnt, COALESCE(SUM(mrr), 0) as total FROM customers WHERE status = 'active';`),
      pgPool.query(`SELECT COUNT(*) as cnt, COALESCE(SUM(mrr), 0) as total FROM customers WHERE status = 'at-risk';`),
      pgPool.query(`SELECT COUNT(*) as cnt, COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'overdue';`),
      pgPool.query(`SELECT COUNT(*) as cnt FROM emails WHERE needs_reply = true OR unread = true;`),
      pgPool.query(`SELECT COUNT(*) as cnt FROM tasks WHERE completed = false;`)
    ]);

    const metricsSnapshot = {
      totalMrr: parseFloat(mrrRes.rows[0]?.total || 0),
      activeCustomers: parseInt(mrrRes.rows[0]?.cnt || 0, 10),
      atRiskCustomers: parseInt(riskRes.rows[0]?.cnt || 0, 10),
      atRiskMrr: parseFloat(riskRes.rows[0]?.total || 0),
      overdueInvoicesCount: parseInt(invSnapRes.rows[0]?.cnt || 0, 10),
      overdueInvoicesTotal: parseFloat(invSnapRes.rows[0]?.total || 0),
      unrepliedEmailsCount: parseInt(unrepliedSnapRes.rows[0]?.cnt || 0, 10),
      pendingTasksCount: parseInt(tasksSnapRes.rows[0]?.cnt || 0, 10),
    };

    // Determine query intent triggers
    const isRiskIntent = queryLower.includes('risk') || queryLower.includes('churn') || queryLower.includes('stalled');
    const isInvoiceIntent = queryLower.includes('invoice') || queryLower.includes('overdue') || queryLower.includes('payment') || queryLower.includes('billing') || queryLower.includes('unpaid');
    const isEmailIntent = queryLower.includes('reply') || queryLower.includes('replied') || queryLower.includes('email') || queryLower.includes('inbox') || queryLower.includes('unread');
    const isTaskIntent = queryLower.includes('task') || queryLower.includes('todo') || queryLower.includes('priority') || queryLower.includes('linear') || queryLower.includes('notion');
    const isMeetingIntent = queryLower.includes('meeting') || queryLower.includes('calendar') || queryLower.includes('schedule') || queryLower.includes('today') || queryLower.includes('tomorrow');

    // 2. Execute Targeted Context Searches based on Intent + LIKE fallback
    const custQuery = isRiskIntent
      ? `SELECT * FROM customers WHERE status = 'at-risk' OR status = 'churned' ORDER BY mrr DESC LIMIT 5;`
      : `SELECT * FROM customers WHERE LOWER(name) LIKE $1 OR LOWER(company) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(COALESCE(notes, '')) LIKE $1 ORDER BY mrr DESC LIMIT 5;`;
    
    const invQuery = isInvoiceIntent
      ? `SELECT * FROM invoices WHERE status = 'overdue' OR status = 'pending' ORDER BY due_date ASC LIMIT 5;`
      : `SELECT * FROM invoices WHERE LOWER(invoice_number) LIKE $1 OR LOWER(customer_name) LIKE $1 ORDER BY due_date ASC LIMIT 5;`;

    const emailQuery = isEmailIntent
      ? `SELECT * FROM emails WHERE needs_reply = true OR unread = true ORDER BY received_at DESC LIMIT 5;`
      : `SELECT * FROM emails WHERE LOWER(subject) LIKE $1 OR LOWER(sender) LIKE $1 OR LOWER(sender_email) LIKE $1 OR LOWER(COALESCE(snippet, '')) LIKE $1 LIMIT 5;`;

    const meetQuery = isMeetingIntent
      ? `SELECT * FROM meetings ORDER BY meeting_date ASC, meeting_time ASC LIMIT 5;`
      : `SELECT * FROM meetings WHERE LOWER(title) LIKE $1 OR LOWER(participant) LIKE $1 OR LOWER(COALESCE(company, '')) LIKE $1 LIMIT 5;`;

    const taskQuery = isTaskIntent
      ? `SELECT * FROM tasks WHERE completed = false ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, due_date ASC LIMIT 5;`
      : `SELECT * FROM tasks WHERE LOWER(title) LIKE $1 OR LOWER(COALESCE(assignee, '')) LIKE $1 OR LOWER(COALESCE(source_app, '')) LIKE $1 LIMIT 5;`;

    const slackQuery = `SELECT * FROM slack_messages WHERE LOWER(message) LIKE $1 OR LOWER(channel) LIKE $1 OR LOWER(sender) LIKE $1 ORDER BY sent_at DESC LIMIT 5;`;

    const [custRes, emailRes, meetRes, slackRes, taskRes, invRes] = await Promise.all([
      pgPool.query(custQuery, isRiskIntent ? [] : [searchTerm]),
      pgPool.query(emailQuery, isEmailIntent ? [] : [searchTerm]),
      pgPool.query(meetQuery, isMeetingIntent ? [] : [searchTerm]),
      pgPool.query(slackQuery, [searchTerm]),
      pgPool.query(taskQuery, isTaskIntent ? [] : [searchTerm]),
      pgPool.query(invQuery, isInvoiceIntent ? [] : [searchTerm])
    ]);

    return {
      metricsSnapshot,
      customers: custRes.rows.map(c => ({
        id: c.id,
        name: c.name,
        company: c.company,
        email: c.email,
        status: c.status,
        mrr: parseFloat(c.mrr || 0),
        notes: c.notes
      })),
      emails: emailRes.rows.map(e => ({
        id: e.id,
        sender: e.sender,
        senderEmail: e.sender_email,
        subject: e.subject,
        snippet: e.snippet,
        unread: e.unread,
        needsReply: e.needs_reply,
        daysUnreplied: e.days_unreplied || 0
      })),
      meetings: meetRes.rows.map(m => ({
        id: m.id,
        title: m.title,
        participant: m.participant,
        company: m.company,
        meetingTime: m.meeting_time,
        meetingDate: m.meeting_date,
        type: m.type,
        link: m.link
      })),
      slackMessages: slackRes.rows.map(s => ({
        id: s.id,
        channel: s.channel,
        sender: s.sender,
        message: s.message,
        hasMention: s.has_mention,
        sentAt: s.sent_at
      })),
      tasks: taskRes.rows.map(t => ({
        id: t.id,
        title: t.title,
        dueDate: t.due_date,
        priority: t.priority,
        completed: t.completed,
        sourceApp: t.source_app,
        assignee: t.assignee
      })),
      invoices: invRes.rows.map(i => ({
        id: i.id,
        invoiceNumber: i.invoice_number,
        customerName: i.customer_name,
        amount: parseFloat(i.amount || 0),
        dueDate: i.due_date,
        status: i.status,
        daysOverdue: i.days_overdue || 0
      }))
    };
  } catch (err: any) {
    console.warn('⚠️ Search query warning:', err.message);
    return { customers: [], emails: [], meetings: [], slackMessages: [], tasks: [], invoices: [] };
  }
}

export async function buildSystemContextString(queryText: string): Promise<string> {
  const searchResults = await searchDatabaseContext(queryText);
  let contextBlocks: string[] = [];

  if (searchResults.metricsSnapshot) {
    const snap = searchResults.metricsSnapshot;
    contextBlocks.push(
      `### Executive Business Telemetry Snapshot:\n` +
      `- Active MRR: $${snap.totalMrr.toLocaleString()} across ${snap.activeCustomers} active customers\n` +
      `- At-Risk MRR: $${snap.atRiskMrr.toLocaleString()} (${snap.atRiskCustomers} accounts at churn risk)\n` +
      `- Overdue Invoices: ${snap.overdueInvoicesCount} invoices totaling $${snap.overdueInvoicesTotal.toLocaleString()}\n` +
      `- Action Needed: ${snap.unrepliedEmailsCount} unreplied emails, ${snap.pendingTasksCount} open tasks`
    );
  }

  if (searchResults.customers.length > 0) {
    const custLines = searchResults.customers.map(
      c => `- Customer: ${c.name} (${c.company}, Email: ${c.email}) | Status: ${c.status.toUpperCase()} | MRR: $${c.mrr.toLocaleString()} | Notes: ${c.notes || 'None'}`
    );
    contextBlocks.push(`### Relevant Customers (CRM / Stripe):\n${custLines.join('\n')}`);
  }

  if (searchResults.invoices.length > 0) {
    const invLines = searchResults.invoices.map(
      i => `- Invoice #${i.invoiceNumber}: ${i.customerName} | Amount: $${i.amount.toLocaleString()} | Status: ${i.status.toUpperCase()} (${i.daysOverdue} days overdue)`
    );
    contextBlocks.push(`### Relevant Invoices (Stripe Billing):\n${invLines.join('\n')}`);
  }

  if (searchResults.emails.length > 0) {
    const emailLines = searchResults.emails.map(
      e => `- Email from ${e.sender} (${e.senderEmail}): "${e.subject}" | Snippet: ${e.snippet} | Needs Reply: ${e.needsReply}`
    );
    contextBlocks.push(`### Relevant Email Messages (Gmail Inbox):\n${emailLines.join('\n')}`);
  }

  if (searchResults.meetings.length > 0) {
    const meetLines = searchResults.meetings.map(
      m => `- Meeting: "${m.title}" with ${m.participant} (${m.company || 'External'}) on ${m.meetingDate} at ${m.meetingTime} [${m.type}]`
    );
    contextBlocks.push(`### Relevant Meetings (Google Calendar):\n${meetLines.join('\n')}`);
  }

  if (searchResults.slackMessages.length > 0) {
    const slackLines = searchResults.slackMessages.map(
      s => `- Slack Message in #${s.channel} by ${s.sender}: "${s.message}"`
    );
    contextBlocks.push(`### Relevant Slack Messages:\n${slackLines.join('\n')}`);
  }

  if (searchResults.tasks.length > 0) {
    const taskLines = searchResults.tasks.map(
      t => `- Task: "${t.title}" | Priority: ${t.priority.toUpperCase()} | Due: ${t.dueDate} | Assignee: ${t.assignee || 'Unassigned'} | App: ${t.sourceApp} | Done: ${t.completed}`
    );
    contextBlocks.push(`### Relevant Tasks (Linear / Notion):\n${taskLines.join('\n')}`);
  }

  if (contextBlocks.length === 0) {
    return '';
  }

  return `\n\n[LIVE DATABASE CONTEXT RETRIEVED FROM SUPABASE FOR QUERY]:\n${contextBlocks.join('\n\n')}`;
}

