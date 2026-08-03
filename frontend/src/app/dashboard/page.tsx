'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import { RevenueGrowthChart, CustomerGrowthChart } from '@/components/dashboard/ChartCard';
import ActivityCard from '@/components/dashboard/ActivityCard';
import ActionModal from '@/components/ui/ActionModal';
import EmptyStateCard from '@/components/ui/EmptyStateCard';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import { fetchDashboardTelemetry, DashboardResponse } from '@/services/dashboardService';
import Skeleton from '@/components/ui/Skeleton';
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
  Zap,
  BellRing
} from 'lucide-react';

export default function DashboardPage() {
  const [telemetry, setTelemetry] = useState<DashboardResponse | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '1Y'>('3M');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'at-risk' | 'active' | 'prospect'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Action Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'email' | 'meeting' | 'invoice' | 'view'>('email');
  const [modalData, setModalData] = useState<any>(null);

  const loadTelemetry = async () => {
    setIsLoadingData(true);
    const data = await fetchDashboardTelemetry();
    setTelemetry(data);
    setIsLoadingData(false);
  };

  useEffect(() => {
    loadTelemetry();
  }, []);

  const openModal = (title: string, type: 'email' | 'meeting' | 'invoice' | 'view', data?: any) => {
    setModalTitle(title);
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTelemetry();
    setIsRefreshing(false);
  };

  const customersList = telemetry?.customers || [];
  const filteredCustomers = customerFilter === 'all' 
    ? customersList 
    : customersList.filter(c => c.status === customerFilter);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Dashboard Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Executive Welcome & Control Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 bg-white relative overflow-hidden shadow-sm">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Founder OS Workspace</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {telemetry?.dbStatus.mode || 'Live API Connected'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Executive SaaS Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Real-time telemetry across Gmail, Slack, Notion, Stripe, & Google Calendar.
              </p>
            </div>

            {/* Interactive Time Range Filters */}
            <div className="flex items-center gap-3 z-10">
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                {(['1M', '3M', '1Y'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      timeRange === r 
                        ? 'bg-blue-600 text-white shadow-sm font-bold' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRefresh}
                className={`p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition-all shadow-sm ${
                  isRefreshing ? 'animate-spin text-blue-600' : ''
                }`}
                title="Refresh All Feeds"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>

              <Link
                href="/chat"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:scale-105 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4 text-blue-100 animate-pulse" />
                <span>Ask AI Assistant</span>
              </Link>
            </div>
          </div>

          {/* 6 Required Dashboard Metric Cards */}
          {isLoadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <MetricCard
                title="Monthly Revenue"
                value={timeRange === '1M' ? '$32,000' : timeRange === '1Y' ? '$374,000' : `$${(telemetry?.metrics.monthlyRevenue || 89000).toLocaleString()}`}
                change="+18.4%"
                isPositive={true}
                subtitle="Synced from Stripe"
                icon={DollarSign}
                iconColor="text-blue-700 bg-blue-50 border-blue-200"
              />
              <MetricCard
                title="MRR"
                value={`$${(telemetry?.metrics.mrr || 82500).toLocaleString()}`}
                change="+12.1%"
                isPositive={true}
                subtitle="Net recurring revenue"
                icon={TrendingUp}
                iconColor="text-indigo-700 bg-indigo-50 border-indigo-200"
              />
              <MetricCard
                title="Active Customers"
                value={`${telemetry?.metrics.activeCustomers || 215}`}
                change="+15 MoM"
                isPositive={true}
                subtitle="Enterprise accounts"
                icon={Users}
                iconColor="text-emerald-700 bg-emerald-50 border-emerald-200"
              />
              <MetricCard
                title="Meetings Today"
                value={`${telemetry?.metrics.meetingsToday || 3}`}
                subtitle="Sequoia investor call"
                icon={Calendar}
                iconColor="text-purple-700 bg-purple-50 border-purple-200"
              />
              <MetricCard
                title="Pending Tasks"
                value={`${telemetry?.metrics.pendingTasks || 4} Tasks`}
                subtitle="2 high priority"
                icon={CheckSquare}
                iconColor="text-amber-700 bg-amber-50 border-amber-200"
              />
              <MetricCard
                title="Unread Emails"
                value={`${telemetry?.metrics.unreadEmails || 3} Emails`}
                change="Action Needed"
                isPositive={false}
                subtitle="Acme Inc (9d ago)"
                icon={Mail}
                iconColor="text-red-700 bg-red-50 border-red-200"
              />
            </div>
          )}

          {/* AI Summary Widget & Quick Founder Actions */}
          <div className="p-5 rounded-2xl glass-panel bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>FounderOS Automated AI Summary</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Data Synthesis
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Q3 ARR trajectory is pacing +18.4% YoY ahead of investor benchmark targets. 14 enterprise expansion upgrades in Stripe offset 1 SMB churn event. 1 high-priority SOC-2 email from Acme Inc requires response.
            </p>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900">Quick Actions:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => openModal('Draft Follow-up Email to Acme Inc.', 'email', { email: 'sarah@acme.com', notes: 'Hi Sarah,\n\nFollowing up on our SOC-2 security compliance audit questionnaire sent 9 days ago. Let me know if you need any additional specs.\n\nBest,\nAlex Vance' })}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Draft Email to Acme Inc.</span>
                </button>
                <button
                  onClick={() => openModal('Trigger Stripe Invoice Reminder', 'invoice')}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Send Overdue Invoice Reminder</span>
                </button>
              </div>
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
            <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm" id="customers">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Customers & Risk Watchlist</h3>
                  <p className="text-xs text-slate-500">Synthesized from HubSpot CRM & Stripe</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-semibold">
                  {(['all', 'at-risk', 'active', 'prospect'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setCustomerFilter(f)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                        customerFilter === f
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {filteredCustomers.length === 0 ? (
                <EmptyStateCard
                  title="No Customers Match Filter"
                  description={`No customer records were found for the "${customerFilter}" category.`}
                  actionText="Clear Filter"
                  onActionClick={() => setCustomerFilter('all')}
                  icon="search"
                />
              ) : (
                <div className="space-y-3">
                  {filteredCustomers.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{c.company}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            c.status === 'at-risk' 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : c.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-200 text-slate-700 border-slate-300'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{c.notes}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-blue-700 font-bold">${c.mrr}/mo</span>
                        <button
                          onClick={() => openModal(`Contact ${c.company}`, 'email', c)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-[11px] font-semibold transition-colors shadow-sm"
                        >
                          Action
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meetings & Today Schedule */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm" id="meetings">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Google Calendar Schedule</h3>
                  <p className="text-xs text-slate-500">Founder meetings & investor catchups</p>
                </div>
                <span className="text-xs text-emerald-700 font-mono font-bold">Today</span>
              </div>

              <div className="space-y-3">
                {(telemetry?.meetings || []).map((m: any) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-colors">
                    <div>
                      <span className="text-[10px] font-mono text-blue-700 font-bold block">{m.time}</span>
                      <span className="text-xs font-bold text-slate-900">{m.title}</span>
                      <p className="text-[11px] text-slate-600">{m.participant}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(`AI Briefing: ${m.title}`, 'meeting', m)}
                        className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 shadow-sm transition-colors"
                      >
                        Prep
                      </button>
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
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
