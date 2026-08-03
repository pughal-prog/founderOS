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
      iconColor: 'text-red-400 bg-red-500/10 border-red-500/30',
      title: 'Unreplied Email Alert: Acme Inc.',
      time: '10m ago',
      desc: 'Sarah Jenkins sent security audit question 9 days ago with no reply.'
    },
    {
      id: 2,
      source: 'Stripe',
      icon: CreditCard,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      title: 'Payment Upgrade: Starlight Labs',
      time: '35m ago',
      desc: 'Michael Chen upgraded to Enterprise Tier (+$4,500 MRR).'
    },
    {
      id: 3,
      source: 'Google Calendar',
      icon: Calendar,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      title: 'Upcoming Meeting: Series A Investor Catchup',
      time: '1h ago',
      desc: 'Meeting scheduled with Alex Vance (Sequoia Capital) at 10:00 AM.'
    },
    {
      id: 4,
      source: 'HubSpot',
      icon: Users,
      iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      title: 'Deal Risk: Apex Cloud Payment Failure',
      time: '2h ago',
      desc: 'Failed payment twice in Stripe. High churn risk flagged.'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/90">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Cross-Tool Real-time Activity Feed</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Live Sync</span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border shrink-0 ${act.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{act.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">• {act.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{act.desc}</p>
                </div>
              </div>

              <Link
                href="/chat"
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors shrink-0"
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
