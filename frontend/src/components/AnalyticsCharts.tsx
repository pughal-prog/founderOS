'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const revenueData = [
  { month: 'Jan', arr: 2.1, expenses: 1.2, netGrowth: 0.9 },
  { month: 'Feb', arr: 2.3, expenses: 1.3, netGrowth: 1.0 },
  { month: 'Mar', arr: 2.6, expenses: 1.4, netGrowth: 1.2 },
  { month: 'Apr', arr: 2.8, expenses: 1.4, netGrowth: 1.4 },
  { month: 'May', arr: 3.1, expenses: 1.5, netGrowth: 1.6 },
  { month: 'Jun', arr: 3.42, expenses: 1.6, netGrowth: 1.82 },
];

const churnByApp = [
  { source: 'Stripe Billing', riskAccounts: 12, value: '$18.5k' },
  { source: 'HubSpot Tickets', riskAccounts: 28, value: '$42.0k' },
  { source: 'Salesforce Stalled', riskAccounts: 18, value: '$65.2k' },
  { source: 'Slack Sentiment', riskAccounts: 8, value: '$12.4k' },
];

export function RevenueAreaChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val}M`} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px'
            }}
          />
          <Area
            type="monotone"
            dataKey="arr"
            name="ARR ($ Millions)"
            stroke="#38bdf8"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorArr)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Operating Costs"
            stroke="#818cf8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExp)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChurnRiskBarChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={churnByApp} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="source" stroke="#64748b" tick={{ fontSize: 10 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="riskAccounts" name="Risk Accounts Count" fill="#a855f7" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
