'use client';

import React from 'react';
import Link from 'next/link';
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
import { PlusCircle, ShieldAlert } from 'lucide-react';

interface ChartProps {
  isStripeConnected?: boolean;
}

export function RevenueGrowthChart({ isStripeConnected = true }: ChartProps) {
  const chartData = isStripeConnected 
    ? mockRevenueHistory 
    : mockRevenueHistory.map(d => ({ ...d, revenue: 0, mrr: 0 }));

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Monthly Revenue & MRR Growth</h3>
          <p className="text-xs text-slate-500 font-medium">
            {isStripeConnected ? 'Synthesized from Stripe Billing & QuickBooks' : 'Stripe Billing Disconnected'}
          </p>
        </div>
        <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border ${
          isStripeConnected 
            ? 'text-blue-700 bg-blue-50 border-blue-200' 
            : 'text-slate-500 bg-slate-100 border-slate-200'
        }`}>
          {isStripeConnected ? '$82,500 Current MRR' : '$0 MRR'}
        </span>
      </div>

      <div className="w-full h-64 relative">
        {!isStripeConnected && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-6 text-center space-y-3 border border-dashed border-slate-300 rounded-2xl">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="max-w-xs space-y-1">
              <h4 className="text-xs font-bold text-slate-900">Stripe Billing Feed Standby</h4>
              <p className="text-[11px] text-slate-500">Connect your Stripe account to sync live MRR telemetry & revenue projections.</p>
            </div>
            <Link
              href="/connect-apps"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Connect Stripe Integration</span>
            </Link>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevStripe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorMrrStripe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4338ca" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4338ca" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)'
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Monthly Revenue ($)"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevStripe)"
            />
            <Area
              type="monotone"
              dataKey="mrr"
              name="MRR ($)"
              stroke="#4338ca"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMrrStripe)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CustomerGrowthChart({ isStripeConnected = true }: ChartProps) {
  const chartData = isStripeConnected 
    ? mockRevenueHistory 
    : mockRevenueHistory.map(d => ({ ...d, customers: 0 }));

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Active Customers Growth</h3>
          <p className="text-xs text-slate-500 font-medium">
            {isStripeConnected ? 'Total paying enterprise accounts' : 'HubSpot / Stripe Disconnected'}
          </p>
        </div>
        <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border ${
          isStripeConnected 
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
            : 'text-slate-500 bg-slate-100 border-slate-200'
        }`}>
          {isStripeConnected ? '215 Customers' : '0 Customers'}
        </span>
      </div>

      <div className="w-full h-64 relative">
        {!isStripeConnected && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-10 flex flex-col items-center justify-center p-6 text-center space-y-3 border border-dashed border-slate-300 rounded-2xl">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="max-w-xs space-y-1">
              <h4 className="text-xs font-bold text-slate-900">Customer Metrics Standby</h4>
              <p className="text-[11px] text-slate-500">Connect HubSpot CRM or Stripe to visualize customer acquisition trajectory.</p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '12px',
                color: '#0f172a',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)'
              }}
            />
            <Bar dataKey="customers" name="Customers" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
