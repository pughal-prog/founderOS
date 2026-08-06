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
import { useFounderStore } from '@/hooks/useFounderStore';
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
  BellRing,
  Plus,
  AlertTriangle,
  Building,
  X,
  ShieldAlert
} from 'lucide-react';

export default function DashboardPage() {
  const { integrations, clientTenants, onboardClientTenant, currentWorkspace } = useFounderStore();
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

  // Add Company Modal State
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    company: '',
    domain: '',
    contact: '',
    email: '',
    plan: 'Pro OS' as 'Starter' | 'Pro OS' | 'Scale Enterprise',
    mrr: 8999,
    status: 'active' as 'active' | 'at-risk' | 'prospect',
    notes: 'New enterprise client onboarded to workspace.'
  });

  const connectedCount = integrations.filter(i => i.connected).length;
  const isStripeConnected = integrations.some(i => i.id === 'app-stripe' && i.connected);
  const isGmailConnected = integrations.some(i => i.id === 'app-gmail' && i.connected);
  const isHubspotConnected = integrations.some(i => i.id === 'app-hubspot' && i.connected);
  const isCalendarConnected = integrations.some(i => i.id === 'app-google-calendar' && i.connected);
  const isTasksConnected = integrations.some(i => (i.id === 'app-jira' || i.id === 'app-linear') && i.connected);

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

  const handleAddCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.company.trim()) return;

    onboardClientTenant({
      id: `t-${Date.now()}`,
      name: newCompany.company,
      domain: newCompany.domain || `${newCompany.company.toLowerCase().replace(/\s+/g, '')}.com`,
      founderName: newCompany.contact || 'Company Executive',
      founderEmail: newCompany.email || `founder@${newCompany.domain || 'startup.com'}`,
      plan: newCompany.plan,
      mrr: Number(newCompany.mrr) || 8999,
      status: newCompany.status === 'at-risk' ? 'suspended' : 'active',
      userCount: 12,
      connectedAppsCount: 3,
      apiUsagePercent: 35,
      createdAt: new Date().toISOString().split('T')[0]
    });

    setShowAddCompanyModal(false);
    setNewCompany({
      company: '',
      domain: '',
      contact: '',
      email: '',
      plan: 'Pro OS',
      mrr: 8999,
      status: 'active',
      notes: 'New enterprise client onboarded to workspace.'
    });
  };

  // Combine backend demo customers with workspace-specific client tenants
  const effectiveCustomers = clientTenants.length > 0 ? clientTenants : (isHubspotConnected || isStripeConnected ? (telemetry?.customers || []) : []);
  const filteredCustomers = customerFilter === 'all' 
    ? effectiveCustomers 
    : effectiveCustomers.filter(c => c.status === customerFilter);

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden selection:bg-blue-600 selection:text-white">
      
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
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">{currentWorkspace?.name || 'Founder OS Workspace'}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  connectedCount > 0 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {connectedCount > 0 ? `${connectedCount}/9 Apps Synced` : '0 Apps Connected'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Executive SaaS Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Real-time telemetry across Gmail, Slack, Notion, Stripe, & Google Calendar.
              </p>
            </div>

            {/* Interactive Time Range Filters & Quick Buttons */}
            <div className="flex items-center gap-3 z-10 flex-wrap">
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

              <button
                onClick={() => setShowAddCompanyModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Client Company</span>
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

          {/* DISCONNECTED INTEGRATION WARNING BANNER */}
          {connectedCount === 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-amber-950">Workspace Inactive (0 Apps Connected)</h4>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    No SaaS tools are connected yet. Connect Stripe, Gmail, or HubSpot to unlock live revenue telemetry & automated AI analysis.
                  </p>
                </div>
              </div>
              <Link
                href="/connect-apps"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Connect Integrations Now</span>
              </Link>
            </div>
          )}

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
                value={isStripeConnected ? `$${(telemetry?.metrics.monthlyRevenue || 89000).toLocaleString()}` : '$0'}
                change={isStripeConnected ? '+18.4%' : 'Disconnected'}
                isPositive={isStripeConnected}
                subtitle={isStripeConnected ? 'Synced from Stripe' : 'Connect Stripe'}
                icon={DollarSign}
                iconColor="text-blue-700 bg-blue-50 border-blue-200"
              />
              <MetricCard
                title="MRR"
                value={isStripeConnected ? `$${(telemetry?.metrics.mrr || 82500).toLocaleString()}` : '$0'}
                change={isStripeConnected ? '+12.1%' : 'Disconnected'}
                isPositive={isStripeConnected}
                subtitle={isStripeConnected ? 'Net recurring revenue' : 'Stripe Inactive'}
                icon={TrendingUp}
                iconColor="text-indigo-700 bg-indigo-50 border-indigo-200"
              />
              <MetricCard
                title="Active Customers"
                value={`${effectiveCustomers.length}`}
                change={effectiveCustomers.length > 0 ? `+${effectiveCustomers.length} Accounts` : '0 Companies'}
                isPositive={effectiveCustomers.length > 0}
                subtitle={effectiveCustomers.length > 0 ? 'Enterprise accounts' : 'Add Client Company'}
                icon={Users}
                iconColor="text-emerald-700 bg-emerald-50 border-emerald-200"
              />
              <MetricCard
                title="Meetings Today"
                value={isCalendarConnected ? `${telemetry?.metrics.meetingsToday || 3}` : '0'}
                subtitle={isCalendarConnected ? 'Google Calendar' : 'Calendar Inactive'}
                icon={Calendar}
                iconColor="text-purple-700 bg-purple-50 border-purple-200"
              />
              <MetricCard
                title="Pending Tasks"
                value={isTasksConnected ? `${telemetry?.metrics.pendingTasks || 4} Tasks` : '0 Tasks'}
                subtitle={isTasksConnected ? 'Jira / Linear Feed' : 'Tasks Inactive'}
                icon={CheckSquare}
                iconColor="text-amber-700 bg-amber-50 border-amber-200"
              />
              <MetricCard
                title="Unread Emails"
                value={isGmailConnected ? `${telemetry?.metrics.unreadEmails || 3} Emails` : '0 Emails'}
                change={isGmailConnected ? 'Action Needed' : 'Inactive'}
                isPositive={!isGmailConnected}
                subtitle={isGmailConnected ? 'Acme Inc (9d ago)' : 'Gmail Disconnected'}
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
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                connectedCount > 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {connectedCount > 0 ? 'Live Data Synthesis' : 'Standby Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {connectedCount > 0 ? (
                'Q3 ARR trajectory is pacing +18.4% YoY ahead of investor benchmark targets. 14 enterprise expansion upgrades in Stripe offset 1 SMB churn event. 1 high-priority SOC-2 email from Acme Inc requires response.'
              ) : (
                'Your workspace has 0 connected integrations. Connect Stripe, Gmail, or HubSpot in "Connect Apps" to start ingesting live ARR trajectory, active accounts, and automated email risk audits.'
              )}
            </p>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900">Quick Actions:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowAddCompanyModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Add Client Company</span>
                </button>
                {isGmailConnected && (
                  <button
                    onClick={() => openModal('Draft Follow-up Email to Acme Inc.', 'email', { email: 'sarah@acme.com', notes: 'Hi Sarah,\n\nFollowing up on our SOC-2 security compliance audit questionnaire sent 9 days ago. Let me know if you need any additional specs.\n\nBest,\nAlex Vance' })}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Draft Email to Acme Inc.</span>
                  </button>
                )}
                {isStripeConnected && (
                  <button
                    onClick={() => openModal('Trigger Stripe Invoice Reminder', 'invoice')}
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Send Overdue Invoice Reminder</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RevenueGrowthChart isStripeConnected={isStripeConnected} />
            </div>
            <div className="lg:col-span-5">
              <CustomerGrowthChart isStripeConnected={isStripeConnected} />
            </div>
          </div>

          {/* Customer Risk & Activity Feed Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Customer Risk Overview with Interactive Filter Tabs */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm" id="customers">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Workspace Companies & Clients</h3>
                  <p className="text-xs text-slate-500">
                    {effectiveCustomers.length} registered companies in {currentWorkspace?.name || 'this workspace'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddCompanyModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Company</span>
                  </button>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-semibold">
                    {(['all', 'at-risk', 'active', 'prospect'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setCustomerFilter(f)}
                        className={`px-2 py-0.5 rounded-lg capitalize transition-all ${
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
              </div>

              {filteredCustomers.length === 0 ? (
                <EmptyStateCard
                  title={clientTenants.length === 0 ? 'No Companies Added to Workspace' : 'No Customers Match Filter'}
                  description={clientTenants.length === 0 ? 'Add client companies manually to track MRR and deal health in this workspace.' : `No customer records match the "${customerFilter}" filter.`}
                  actionText={clientTenants.length === 0 ? '+ Add First Client Company' : 'Clear Filter'}
                  onActionClick={() => clientTenants.length === 0 ? setShowAddCompanyModal(true) : setCustomerFilter('all')}
                  icon="database"
                />
              ) : (
                <div className="space-y-3">
                  {filteredCustomers.map((c: any) => (
                    <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-blue-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{c.company || c.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            c.status === 'at-risk' || c.status === 'suspended'
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : c.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-200 text-slate-700 border-slate-300'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{c.notes || `${c.plan || 'Pro'} Plan Subscription • ${c.founderEmail || c.email || ''}`}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-blue-700 font-bold">₹{c.mrr}/mo</span>
                        <button
                          onClick={() => openModal(`Contact ${c.company || c.name}`, 'email', c)}
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
                  <p className="text-xs text-slate-500">
                    {isCalendarConnected ? 'Founder meetings & investor catchups' : 'Google Calendar Disconnected'}
                  </p>
                </div>
                <span className="text-xs text-emerald-700 font-mono font-bold">Today</span>
              </div>

              {!isCalendarConnected ? (
                <EmptyStateCard
                  title="Calendar Feed Standby"
                  description="Connect Google Calendar to sync daily founder meetings & investor briefs."
                  actionText="Connect Google Calendar"
                  onActionClick={() => window.location.href = '/connect-apps'}
                  icon="database"
                />
              ) : (
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
              )}
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

      {/* MANUALLY ADD CLIENT COMPANY MODAL */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-200 shadow-2xl bg-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Client Company</h3>
              </div>
              <button
                onClick={() => setShowAddCompanyModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompanySubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">Company / Client Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany.company}
                  onChange={(e) => setNewCompany({ ...newCompany, company: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Domain Name</label>
                  <input
                    type="text"
                    value={newCompany.domain}
                    onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })}
                    placeholder="acme.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">MRR (₹ / Month)</label>
                  <input
                    type="number"
                    value={newCompany.mrr}
                    onChange={(e) => setNewCompany({ ...newCompany, mrr: Number(e.target.value) })}
                    placeholder="8999"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Plan Tier</label>
                  <select
                    value={newCompany.plan}
                    onChange={(e) => setNewCompany({ ...newCompany, plan: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Starter">Starter (₹3,499)</option>
                    <option value="Pro OS">Pro OS (₹8,999)</option>
                    <option value="Scale Enterprise">Scale Enterprise (₹19,999)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">Account Status</label>
                  <select
                    value={newCompany.status}
                    onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="at-risk">At-Risk</option>
                    <option value="prospect">Prospect</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Notes / Deal Context</label>
                <textarea
                  rows={2}
                  value={newCompany.notes}
                  onChange={(e) => setNewCompany({ ...newCompany, notes: e.target.value })}
                  placeholder="Key account notes or onboarding requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-colors"
                >
                  Save & Onboard Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Brain Overlay Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
