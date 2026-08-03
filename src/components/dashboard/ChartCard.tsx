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
import { mockRevenueHistory } from '../../data/mockData';

export function RevenueGrowthChart() {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/90">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Monthly Revenue & MRR Growth</h3>
          <p className="text-xs text-slate-400">Synthesized from Stripe Billing & QuickBooks</p>
        </div>
        <span className="text-xs font-bold text-cyan-400 font-mono">$82,500 Current MRR</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockRevenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
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
              dataKey="revenue"
              name="Monthly Revenue ($)"
              stroke="#38bdf8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRev)"
            />
            <Area
              type="monotone"
              dataKey="mrr"
              name="MRR ($)"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMrr)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CustomerGrowthChart() {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/90">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Active Customers Growth</h3>
          <p className="text-xs text-slate-400">Total paying enterprise accounts</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 font-mono">215 Customers</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockRevenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
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
            <Bar dataKey="customers" name="Customers" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
