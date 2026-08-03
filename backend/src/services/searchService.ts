import { pgPool } from '../config/db';

export interface SearchResults {
  customers: Array<{ id: string; name: string; company: string; email: string; status: string; mrr: number; notes: string }>;
  emails: Array<{ id: string; sender: string; senderEmail: string; subject: string; snippet: string; unread: boolean; needsReply: boolean }>;
  meetings: Array<{ id: string; title: string; participant: string; company: string; meetingTime: string; meetingDate: string; type: string; link: string }>;
  slackMessages: Array<{ id: string; channel: string; sender: string; message: string; hasMention: boolean; sentAt: string }>;
  tasks: Array<{ id: string; title: string; dueDate: string; priority: string; completed: boolean; sourceApp: string; assignee: string }>;
}

export async function searchDatabaseContext(queryText: string): Promise<SearchResults> {
  const searchTerm = `%${queryText.trim().toLowerCase()}%`;

  try {
    const [custRes, emailRes, meetRes, slackRes, taskRes] = await Promise.all([
      // 1. Search Customers
      pgPool.query(
        `SELECT * FROM customers 
         WHERE LOWER(name) LIKE $1 OR LOWER(company) LIKE $1 OR LOWER(email) LIKE $1 OR LOWER(COALESCE(notes, '')) LIKE $1
         LIMIT 5;`,
        [searchTerm]
      ),
      // 2. Search Emails
      pgPool.query(
        `SELECT * FROM emails 
         WHERE LOWER(subject) LIKE $1 OR LOWER(sender) LIKE $1 OR LOWER(sender_email) LIKE $1 OR LOWER(COALESCE(snippet, '')) LIKE $1 OR LOWER(COALESCE(body, '')) LIKE $1
         LIMIT 5;`,
        [searchTerm]
      ),
      // 3. Search Meetings
      pgPool.query(
        `SELECT * FROM meetings 
         WHERE LOWER(title) LIKE $1 OR LOWER(participant) LIKE $1 OR LOWER(COALESCE(company, '')) LIKE $1
         LIMIT 5;`,
        [searchTerm]
      ),
      // 4. Search Slack Messages
      pgPool.query(
        `SELECT * FROM slack_messages 
         WHERE LOWER(message) LIKE $1 OR LOWER(channel) LIKE $1 OR LOWER(sender) LIKE $1
         LIMIT 5;`,
        [searchTerm]
      ),
      // 5. Search Tasks
      pgPool.query(
        `SELECT * FROM tasks 
         WHERE LOWER(title) LIKE $1 OR LOWER(COALESCE(assignee, '')) LIKE $1 OR LOWER(COALESCE(source_app, '')) LIKE $1
         LIMIT 5;`,
        [searchTerm]
      )
    ]);

    return {
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
        needsReply: e.needs_reply
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
      }))
    };
  } catch (err: any) {
    console.warn('⚠️ Search query warning:', err.message);
    return { customers: [], emails: [], meetings: [], slackMessages: [], tasks: [] };
  }
}

export async function buildSystemContextString(queryText: string): Promise<string> {
  const searchResults = await searchDatabaseContext(queryText);
  let contextBlocks: string[] = [];

  if (searchResults.customers.length > 0) {
    const custLines = searchResults.customers.map(
      c => `- Customer: ${c.name} (${c.company}, Email: ${c.email}) - Status: ${c.status}, MRR: $${c.mrr}. Notes: ${c.notes}`
    );
    contextBlocks.push(`### Relevant Customers in Supabase DB:\n${custLines.join('\n')}`);
  }

  if (searchResults.emails.length > 0) {
    const emailLines = searchResults.emails.map(
      e => `- Email from ${e.sender} (${e.senderEmail}): "${e.subject}" - Snippet: ${e.snippet} (Needs Reply: ${e.needsReply})`
    );
    contextBlocks.push(`### Relevant Emails in Supabase DB:\n${emailLines.join('\n')}`);
  }

  if (searchResults.meetings.length > 0) {
    const meetLines = searchResults.meetings.map(
      m => `- Meeting: "${m.title}" with ${m.participant} (${m.company}) on ${m.meetingDate} at ${m.meetingTime} [${m.type}]`
    );
    contextBlocks.push(`### Relevant Meetings in Supabase DB:\n${meetLines.join('\n')}`);
  }

  if (searchResults.slackMessages.length > 0) {
    const slackLines = searchResults.slackMessages.map(
      s => `- Slack message in ${s.channel} by ${s.sender}: "${s.message}"`
    );
    contextBlocks.push(`### Relevant Slack Messages in Supabase DB:\n${slackLines.join('\n')}`);
  }

  if (searchResults.tasks.length > 0) {
    const taskLines = searchResults.tasks.map(
      t => `- Task: "${t.title}" (Priority: ${t.priority}, Due: ${t.dueDate}, Assignee: ${t.assignee}, App: ${t.sourceApp}, Done: ${t.completed})`
    );
    contextBlocks.push(`### Relevant Tasks in Supabase DB:\n${taskLines.join('\n')}`);
  }

  if (contextBlocks.length === 0) {
    return '';
  }

  return `\n\n[LIVE SUPABASE DATABASE CONTEXT RETRIEVED FOR USER QUERY]:\n${contextBlocks.join('\n\n')}`;
}
