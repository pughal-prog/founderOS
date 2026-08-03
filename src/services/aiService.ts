import { 
  mockCustomers, 
  mockMeetings, 
  mockTasks, 
  mockInvoices, 
  mockEmails, 
  mockRevenueHistory 
} from '../data/mockData';
import { ChatMessage } from '../types';

export async function processFounderQuery(queryText: string): Promise<ChatMessage> {
  const query = queryText.toLowerCase().trim();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Query: "Which customers haven't replied?" / "Who hasn't replied?"
  if (query.includes('reply') || query.includes('replied') || query.includes('who hasnt') || query.includes("haven't replied")) {
    const unreplied = mockCustomers.filter(c => !c.replied || c.lastContactDaysAgo > 5);
    
    const formattedList = unreplied
      .map(c => `• **${c.company}** (${c.name}): No reply for **${c.lastContactDaysAgo} days**. (${c.notes})`)
      .join('\n');

    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `I analyzed your Gmail & HubSpot integration data. Here are the key customer accounts awaiting response:\n\n${formattedList}`,
      timestamp,
      suggestedAction: {
        label: 'Draft Follow-Up Email to Acme Inc.',
        actionType: 'email',
        targetId: 'c1'
      },
      dataPayload: {
        type: 'unreplied-customers',
        customers: unreplied
      }
    };
  }

  // 2. Query: "What meetings do I have tomorrow?" / "What meetings do I have today?"
  if (query.includes('meeting') || query.includes('calendar') || query.includes('schedule') || query.includes('tomorrow') || query.includes('today')) {
    const isTomorrow = query.includes('tomorrow');
    const targetDate = isTomorrow ? 'Tomorrow' : 'Today';
    const relevantMeetings = mockMeetings.filter(m => m.date === targetDate);

    const formattedList = relevantMeetings
      .map(m => `• **${m.time}**: ${m.title} with *${m.participant}* (${m.company})`)
      .join('\n');

    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Here is your Google Calendar breakdown for **${targetDate}** (${relevantMeetings.length} meetings scheduled):\n\n${formattedList}`,
      timestamp,
      suggestedAction: {
        label: isTomorrow ? 'View Tomorrow\'s Prep Notes' : 'Join Next Google Meet',
        actionType: 'meeting',
        targetId: relevantMeetings[0]?.id
      },
      dataPayload: {
        type: 'meetings',
        meetings: relevantMeetings
      }
    };
  }

  // 3. Query: "Which deals are at risk?" / "Deals at risk"
  if (query.includes('risk') || query.includes('deal') || query.includes('churn') || query.includes('stalled')) {
    const riskCustomers = mockCustomers.filter(c => c.status === 'at-risk');
    const totalRiskMrr = riskCustomers.reduce((acc, curr) => acc + curr.mrr, 0);

    const formattedList = riskCustomers
      .map(c => `• **${c.company}** ($${c.mrr.toLocaleString()}/mo MRR): ${c.notes}`)
      .join('\n');

    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Synthesizing Stripe & HubSpot CRM telemetry: You currently have **${riskCustomers.length} high-risk deals** representing **$${totalRiskMrr.toLocaleString()}/mo MRR** at churn risk:\n\n${formattedList}`,
      timestamp,
      suggestedAction: {
        label: 'Create Retention Task in Linear',
        actionType: 'meeting',
        targetId: 'risk-summary'
      },
      dataPayload: {
        type: 'risk-deals',
        customers: riskCustomers
      }
    };
  }

  // 4. Query: "Show overdue invoices" / "invoices" / "unpaid"
  if (query.includes('invoice') || query.includes('overdue') || query.includes('unpaid') || query.includes('payment')) {
    const overdue = mockInvoices.filter(i => i.status === 'overdue');
    const totalOverdue = overdue.reduce((acc, curr) => acc + curr.amount, 0);

    const formattedList = overdue
      .map(i => `• **${i.invoiceNumber}** - ${i.customerName}: **$${i.amount.toLocaleString()}** (${i.daysOverdue} days overdue)`)
      .join('\n');

    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Found **${overdue.length} overdue invoices** in Stripe totaling **$${totalOverdue.toLocaleString()}**:\n\n${formattedList}`,
      timestamp,
      suggestedAction: {
        label: 'Send Automated Invoice Reminder via Stripe',
        actionType: 'invoice',
        targetId: 'inv-101'
      },
      dataPayload: {
        type: 'overdue-invoices',
        invoices: overdue
      }
    };
  }

  // 5. Default General Intelligence Synthesis Query
  const currentMrr = mockRevenueHistory[mockRevenueHistory.length - 1].mrr;
  const activeCust = mockCustomers.filter(c => c.status === 'active').length;

  return {
    id: Date.now().toString(),
    sender: 'ai',
    text: `Synthesized answer across Gmail, Slack, Stripe, HubSpot, & Notion:\n\nYour current MRR is **$${currentMrr.toLocaleString()}** across **${activeCust} active enterprise accounts**. All systems are operating smoothly with 0 open API outages.`,
    timestamp,
    suggestedAction: {
      label: 'View Detailed Revenue Analytics in Dashboard',
      actionType: 'view'
    },
    dataPayload: {
      type: 'general-summary',
      mrr: currentMrr
    }
  };
}
