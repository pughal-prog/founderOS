'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import { RevenueGrowthChart, CustomerGrowthChart } from '@/components/dashboard/ChartCard';
import ActivityCard from '@/components/dashboard/ActivityCard';
import ActionModal from '@/components/ui/ActionModal';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckSquare, 
  Mail, 
  Brain, 
  Sparkles,
  MessageSquareText,
  ArrowUpRight,
  ShieldCheck,
  Filter,
  RefreshCcw,
  CheckCircle2,
  Clock,
  Send,
  Zap
} from 'lucide-react';
import { mockCustomers, mockMeetings } from '@/data/mockData';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '1Y'>('3M');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'at-risk' | 'active' | 'prospect'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Action Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'email' | 'meeting' | 'invoice' | 'view'>('email');
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (title: string, type: 'email' | 'meeting' | 'invoice' | 'view', data?: any) => {
    setModalTitle(title);
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredCustomers = customerFilter === 'all' 
    ? mockCustomers 
    : mockCustomers.filter(c => c.status === customerFilter);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Dashboard Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Executive Welcome & Control Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-slate-900/90 relative overflow-hidden">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Founder OS Workspace</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  8/9 Apps Synced
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Executive SaaS Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Real-time telemetry across Gmail, Slack, Notion, Stripe, & Google Calendar.
              </p>
            </div>

            {/* Interactive Time Range Filters */}
            <div className="flex items-center gap-3 z-10">
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
                {(['1M', '3M', '1Y'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      timeRange === r 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRefresh}
                className={`p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all ${
                  isRefreshing ? 'animate-spin text-cyan-400' : ''
                }`}
                title="Refresh All Feeds"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>

              <Link
                href="/chat"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:scale-105 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                <span>Ask AI Assistant</span>
              </Link>
            </div>
          </div>

          {/* 6 Required Dashboard Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <MetricCard
              title="Monthly Revenue"
              value={timeRange === '1M' ? '$32,000' : timeRange === '1Y' ? '$374,000' : '$89,000'}
              change="+18.4%"
              isPositive={true}
              subtitle="Synced from Stripe"
              icon={DollarSign}
              iconColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
            />
            <MetricCard
              title="MRR"
              value="$82,500"
              change="+12.1%"
              isPositive={true}
              subtitle="Net recurring revenue"
              icon={TrendingUp}
              iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/30"
            />
            <MetricCard
              title="Active Customers"
              value="215"
              change="+15 MoM"
              isPositive={true}
              subtitle="Enterprise accounts"
              icon={Users}
              iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
            />
            <MetricCard
              title="Meetings Today"
              value="3"
              subtitle="Sequoia investor call"
              icon={Calendar}
              iconColor="text-purple-400 bg-purple-500/10 border-purple-500/30"
            />
            <MetricCard
              title="Pending Tasks"
              value="4 Tasks"
              subtitle="2 high priority"
              icon={CheckSquare}
              iconColor="text-amber-400 bg-amber-500/10 border-amber-500/30"
            />
            <MetricCard
              title="Unread Emails"
              value="3 Emails"
              change="Action Needed"
              isPositive={false}
              subtitle="Acme Inc (9d ago)"
              icon={Mail}
              iconColor="text-red-400 bg-red-500/10 border-red-500/30"
            />
          </div>

          {/* Quick Interactive Founder Action Banner */}
          <div className="p-4 rounded-2xl glass-panel bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white">Interactive Actions Ready:</span>
              <span className="text-slate-400">Click to execute actions across your connected tools</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => openModal('Draft Follow-up Email to Acme Inc.', 'email', { email: 'sarah@acme.com', notes: 'Hi Sarah,\n\nFollowing up on our SOC-2 security compliance audit questionnaire sent 9 days ago. Let me know if you need any additional specs.\n\nBest,\nAlex Vance' })}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Draft Email to Acme Inc. (9d Unreplied)</span>
              </button>
              <button
                onClick={() => openModal('Trigger Stripe Invoice Reminder', 'invoice')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-red-300 border border-slate-700 hover:border-red-500/40 font-semibold transition-colors flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Send Overdue Invoice Reminder</span>
              </button>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RevenueGrowthChart />
            </div>
            <div className="lg:col-span-5">
              <CustomerGrowthChart />
            </div>
          </div>

          {/* Customer Risk & Activity Feed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Customer Risk Overview with Interactive Filter Tabs */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/90" id="customers">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Customers & Risk Watchlist</h3>
                  <p className="text-xs text-slate-400">Synthesized from HubSpot CRM & Stripe</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-semibold">
                  {(['all', 'at-risk', 'active', 'prospect'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setCustomerFilter(f)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                        customerFilter === f
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredCustomers.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{c.company}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          c.status === 'at-risk' 
                            ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                            : c.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{c.notes}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-cyan-400 font-bold">${c.mrr}/mo</span>
                      <button
                        onClick={() => openModal(`Contact ${c.company}`, 'email', c)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] font-semibold transition-colors"
                      >
                        Action
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meetings & Today Schedule */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/90" id="meetings">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Google Calendar Schedule</h3>
                  <p className="text-xs text-slate-400">Founder meetings & investor catchups</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono">Today</span>
              </div>

              <div className="space-y-3">
                {mockMeetings.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold block">{m.time}</span>
                      <span className="text-xs font-bold text-white">{m.title}</span>
                      <p className="text-[11px] text-slate-400">{m.participant}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(`AI Briefing: ${m.title}`, 'meeting', m)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
                      >
                        Prep
                      </button>
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-slate-700 hover:border-cyan-500/40 transition-colors"
                      >
                        Join Meet
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Activity Feed */}
          <ActivityCard />

        </main>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        type={modalType}
        initialData={modalData}
      />

      {/* Floating AI Brain Overlay Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
