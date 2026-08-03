'use client';

import React from 'react';
import { 
  CheckCircle2, 
  RefreshCcw, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Activity,
  Layers,
  Database,
  Cloud,
  Lock
} from 'lucide-react';

export default function ConnectedAppsGrid() {
  const apps = [
    {
      name: 'Stripe Billing',
      category: 'Revenue & Subscriptions',
      status: 'Synced',
      latency: '12ms',
      records: '142,500 transactions',
      iconBg: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
      description: 'MRR calculations, refund tracking, and customer lifetime value metrics.'
    },
    {
      name: 'Salesforce CRM',
      category: 'Pipeline & Deals',
      status: 'Live',
      latency: '24ms',
      records: '8,400 accounts',
      iconBg: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
      description: 'Opportunity stages, win rates, sales representative activity streams.'
    },
    {
      name: 'HubSpot',
      category: 'Marketing & Support',
      status: 'Synced',
      latency: '18ms',
      records: '32,100 contacts',
      iconBg: 'bg-orange-600/20 text-orange-400 border-orange-500/30',
      description: 'Inbound lead attribution, support ticket response times, & NPS scores.'
    },
    {
      name: 'PostgreSQL DB',
      category: 'Core Data Warehouse',
      status: 'Active Index',
      latency: '4ms',
      records: '1.2M rows',
      iconBg: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
      description: 'Custom SQL query engine & transactional event logs.'
    },
    {
      name: 'Slack Workspaces',
      category: 'Internal Communications',
      status: 'Live Stream',
      latency: '8ms',
      records: '240 channels',
      iconBg: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
      description: 'Executive sentiment analysis & real-time anomaly notification channel.'
    },
    {
      name: 'Notion Workspace',
      category: 'Documentation & Wiki',
      status: 'Indexed',
      latency: '35ms',
      records: '450 documents',
      iconBg: 'bg-pink-600/20 text-pink-400 border-pink-500/30',
      description: 'Standard Operating Procedures, product specs, and OKR roadmaps.'
    },
    {
      name: 'Jira Software',
      category: 'Engineering & Delivery',
      status: 'Synced',
      latency: '15ms',
      records: '1,200 tickets',
      iconBg: 'bg-sky-600/20 text-sky-400 border-sky-500/30',
      description: 'Sprint velocity, bug fix cycle times, and roadmap delivery tracking.'
    },
    {
      name: 'Snowflake Analytics',
      category: 'Big Data Pipeline',
      status: 'Active Index',
      latency: '42ms',
      records: '45.8M events',
      iconBg: 'bg-purple-600/20 text-purple-400 border-purple-500/30',
      description: 'Long-term historical trends and predictive forecasting models.'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {apps.map((app, idx) => (
        <div
          key={idx}
          className="glass-panel-interactive p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3 group"
        >
          <div className="flex items-start justify-between">
            <div className={`p-2.5 rounded-xl border font-bold text-xs ${app.iconBg}`}>
              <Database className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {app.status}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {app.category}
            </span>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              {app.name}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
              {app.description}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Latency: <strong className="text-cyan-400 font-semibold">{app.latency}</strong></span>
            <span>{app.records}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
