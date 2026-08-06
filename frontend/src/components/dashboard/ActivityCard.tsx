'use client';

import React from 'react';
import { Activity, Mail, MessageSquare, CreditCard, Calendar, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function ActivityCard() {
  const activities = [
    {
      id: 1,
      source: 'Gmail',
      icon: Mail,
      iconColor: 'text-red-700 bg-red-50 border-red-200',
      title: 'Unreplied Email Alert: Acme Inc.',
      time: '10m ago',
      desc: 'Sarah Jenkins sent security audit question 9 days ago with no reply.'
    },
    {
      id: 2,
      source: 'Stripe',
      icon: CreditCard,
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      title: 'Payment Upgrade: Starlight Labs',
      time: '35m ago',
      desc: 'Michael Chen upgraded to Enterprise Tier (+$4,500 MRR).'
    },
    {
      id: 3,
      source: 'Google Calendar',
      icon: Calendar,
      iconColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      title: 'Upcoming Meeting: Series A Investor Catchup',
      time: '1h ago',
      desc: 'Meeting scheduled with Alex Vance (Sequoia Capital) at 10:00 AM.'
    },
    {
      id: 4,
      source: 'HubSpot',
      icon: Users,
      iconColor: 'text-amber-700 bg-amber-50 border-amber-200',
      title: 'Deal Risk: Apex Cloud Payment Failure',
      time: '2h ago',
      desc: 'Failed payment twice in Stripe. High churn risk flagged.'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Cross-Tool Real-time Activity Feed</h3>
        </div>
        <span className="text-xs text-emerald-700 font-mono font-bold">Live Sync</span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border shrink-0 ${act.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{act.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">• {act.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{act.desc}</p>
                </div>
              </div>

              <Link
                href="/chat"
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors shrink-0 shadow-sm"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
