import { mockCustomers, mockMeetings, mockInvoices } from '../models/mockData';

export async function processQuery(queryText: string) {
  const query = queryText.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (query.includes('reply') || query.includes('replied') || query.includes('who hasnt') || query.includes("haven't replied")) {
    const unreplied = mockCustomers.filter(c => !c.replied || c.lastContactDaysAgo > 5);
    const formatted = unreplied
      .map(c => `• **${c.company}** (${c.name}): No reply for **${c.lastContactDaysAgo} days**. (${c.notes})`)
      .join('\n');

    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Backend Intelligence Analysis across Gmail & HubSpot:\n\n${formatted}`,
      timestamp,
      suggestedAction: {
        label: 'Draft Follow-Up Email to Acme Inc.',
        actionType: 'email',
        targetId: 'c1'
      }
    };
  }

  if (query.includes('invoice') || query.includes('overdue') || query.includes('payment')) {
    const overdue = mockInvoices.filter(i => i.status === 'overdue');
    const total = overdue.reduce((acc, curr) => acc + curr.amount, 0);
    const formatted = overdue
      .map(i => `• **${i.invoiceNumber}** - ${i.customerName}: **$${i.amount.toLocaleString()}** (${i.daysOverdue} days overdue)`)
      .join('\n');

    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Backend Stripe Audit: **${overdue.length} overdue invoices** totaling **$${total.toLocaleString()}**:\n\n${formatted}`,
      timestamp,
      suggestedAction: {
        label: 'Trigger Stripe Automated Reminder',
        actionType: 'invoice'
      }
    };
  }

  return {
    id: Date.now().toString(),
    sender: 'ai',
    text: `Backend AI Engine: Synthesized answer across Gmail, Slack, Stripe, HubSpot, & Notion. System running at optimal operational performance ($89,000 MRR).`,
    timestamp,
    suggestedAction: {
      label: 'View Detailed Metrics in Dashboard',
      actionType: 'view'
    }
  };
}
