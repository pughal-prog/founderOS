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
    <div className="glass-panel p-6 rounded-3xl border border-amber-900/15 space-y-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-amber-950">Monthly Revenue & MRR Growth</h3>
          <p className="text-xs text-stone-500 font-medium">Synthesized from Stripe Billing & QuickBooks</p>
        </div>
        <span className="text-xs font-bold text-amber-900 font-mono bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">$82,500 Current MRR</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockRevenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#78350f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#78350f" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMrrLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ece1" />
            <XAxis dataKey="month" stroke="#78716c" tick={{ fontSize: 11 }} />
            <YAxis stroke="#78716c" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e7e5e4',
                borderRadius: '12px',
                color: '#1c1917',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(69, 26, 3, 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Monthly Revenue ($)"
              stroke="#78350f"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevLight)"
            />
            <Area
              type="monotone"
              dataKey="mrr"
              name="MRR ($)"
              stroke="#d97706"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMrrLight)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CustomerGrowthChart() {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-amber-900/15 space-y-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-amber-950">Active Customers Growth</h3>
          <p className="text-xs text-stone-500 font-medium">Total paying enterprise accounts</p>
        </div>
        <span className="text-xs font-bold text-emerald-800 font-mono bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">215 Customers</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockRevenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ece1" />
            <XAxis dataKey="month" stroke="#78716c" tick={{ fontSize: 11 }} />
            <YAxis stroke="#78716c" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e7e5e4',
                borderRadius: '12px',
                color: '#1c1917',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(69, 26, 3, 0.1)'
              }}
            />
            <Bar dataKey="customers" name="Customers" fill="#78350f" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
