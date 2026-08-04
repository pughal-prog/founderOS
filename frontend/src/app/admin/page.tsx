'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import { mockClientTenants } from '@/data/mockData';
import { ClientCompanyTenant } from '@/types';
import { 
  ShieldCheck, 
  Building, 
  Users, 
  DollarSign, 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Power, 
  Layers, 
  ChevronRight,
  TrendingUp,
  X,
  Lock,
  Globe
} from 'lucide-react';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFounderStore } from '@/hooks/useFounderStore';

export default function AdminSuperPortalPage() {
  const router = useRouter();
  const { userProfile } = useFounderStore();

  useEffect(() => {
    if (userProfile?.userType !== 'admin') {
      router.push('/dashboard');
    }
  }, [userProfile, router]);

  const [tenants, setTenants] = useState<ClientCompanyTenant[]>(mockClientTenants);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'trial'>('all');
  
  // Onboard New Company Modal State
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyDomain, setNewCompanyDomain] = useState('');
  const [newFounderName, setNewFounderName] = useState('');
  const [newFounderEmail, setNewFounderEmail] = useState('');
  const [newPlan, setNewPlan] = useState<'Starter' | 'Pro OS' | 'Scale Enterprise'>('Pro OS');

  const totalSaaSMrr = tenants.reduce((acc, t) => acc + (t.status !== 'suspended' ? t.mrr : 0), 0);
  const totalSaaSArr = totalSaaSMrr * 12;
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length;
  const totalUsersCount = tenants.reduce((acc, t) => acc + t.userCount, 0);

  const filteredTenants = tenants.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.founderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const toggleTenantStatus = (tenantId: string) => {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          const newStatus = t.status === 'suspended' ? 'active' : 'suspended';
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const changeTenantPlan = (tenantId: string, newPlan: 'Starter' | 'Pro OS' | 'Scale Enterprise') => {
    const planPrices = {
      'Starter': 3499,
      'Pro OS': 8999,
      'Scale Enterprise': 19999
    };
    setTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          return { ...t, plan: newPlan, mrr: planPrices[newPlan] };
        }
        return t;
      })
    );
  };

  const handleOnboardNewCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newFounderEmail.trim()) return;

    const planPrices = {
      'Starter': 3499,
      'Pro OS': 8999,
      'Scale Enterprise': 19999
    };

    const newTenant: ClientCompanyTenant = {
      id: `tenant-${Date.now()}`,
      name: newCompanyName,
      domain: newCompanyDomain || `${newCompanyName.toLowerCase().replace(/\s+/g, '')}.com`,
      founderName: newFounderName || 'Founder',
      founderEmail: newFounderEmail,
      plan: newPlan,
      status: 'active',
      mrr: planPrices[newPlan],
      userCount: 1,
      connectedAppsCount: 0,
      apiUsagePercent: 5,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTenants(prev => [newTenant, ...prev]);
    setShowOnboardModal(false);

    // Reset Form
    setNewCompanyName('');
    setNewCompanyDomain('');
    setNewFounderName('');
    setNewFounderEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col selection:bg-purple-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        <Sidebar />

        {/* Super Admin Control Center Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-950 to-purple-900 border border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  SaaS Platform Super Admin Portal
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  SaaS Creator Control Center
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Client Companies & Tenant Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Manage, monitor, activate, and suspend client startup companies using your FounderOS SaaS application.
              </p>
            </div>

            <button
              onClick={() => setShowOnboardModal(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 z-10"
            >
              <Plus className="w-4 h-4" />
              <span>Onboard New Client Company</span>
            </button>
          </div>

          {/* Platform Performance Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total SaaS Platform MRR</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">₹{totalSaaSMrr.toLocaleString()}/mo</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +24% MoM
                </span>
              </div>
              <p className="text-[11px] text-slate-400">ARR: ₹{totalSaaSArr.toLocaleString()}/yr</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Client Companies</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white font-mono">{activeTenantsCount} Active</span>
                <span className="text-xs text-slate-400 font-mono">of {tenants.length} Total</span>
              </div>
              <p className="text-[11px] text-slate-400">Companies onboarded on SaaS platform</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Founder Seats</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-blue-400 font-mono">{totalUsersCount} Users</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-[11px] text-slate-400">Across all client organization workspaces</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Platform Uptime & SLA</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-purple-400 font-mono">99.98%</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-[11px] text-slate-400">Supabase SQL & Redis Cache Healthy</p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client company by name, domain, or founder email..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              {(['all', 'active', 'suspended', 'trial'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Client Company Tenants Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 relative overflow-hidden ${
                  tenant.status === 'suspended'
                    ? 'bg-slate-950/40 border-red-900/40 opacity-75'
                    : 'bg-slate-950/80 border-slate-800 hover:border-purple-500/50 shadow-xl'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                      <Building className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-base">{tenant.name}</h3>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border capitalize ${
                          tenant.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : tenant.status === 'suspended'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}>
                          {tenant.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{tenant.domain} • Founder: {tenant.founderName}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-400 font-mono block">₹{tenant.mrr.toLocaleString()}/mo</span>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950 border border-purple-500/30 px-2 py-0.5 rounded">
                      {tenant.plan}
                    </span>
                  </div>
                </div>

                {/* Tenant Stats Row */}
                <div className="grid grid-cols-3 gap-2 py-2 text-xs font-mono bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Active Users</span>
                    <span className="font-bold text-white">{tenant.userCount} Seats</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Apps Synced</span>
                    <span className="font-bold text-blue-400">{tenant.connectedAppsCount} Connectors</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">API Rate Limit</span>
                    <span className="font-bold text-purple-400">{tenant.apiUsagePercent}% Quota</span>
                  </div>
                </div>

                {/* API Quota Usage Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 font-sans">Monthly API Capacity</span>
                    <span className="text-slate-300">{tenant.apiUsagePercent}% Used</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        tenant.apiUsagePercent > 80 ? 'bg-red-500' : tenant.apiUsagePercent > 50 ? 'bg-purple-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${tenant.apiUsagePercent}%` }}
                    />
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-400 font-medium">Plan:</label>
                    <select
                      value={tenant.plan}
                      onChange={(e: any) => changeTenantPlan(tenant.id, e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-purple-300 rounded-lg py-1 px-2 text-[11px] font-mono font-bold focus:outline-none focus:border-purple-500"
                    >
                      <option value="Starter">Starter (₹3,499)</option>
                      <option value="Pro OS">Pro OS (₹8,999)</option>
                      <option value="Scale Enterprise">Scale Enterprise (₹19,999)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => toggleTenantStatus(tenant.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                      tenant.status === 'suspended'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900/60'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{tenant.status === 'suspended' ? 'Reactivate Company Access' : 'Suspend Access'}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>

      {/* Onboard New Client Company Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/30 bg-slate-950 text-white shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold">Onboard New Client Company</h3>
              </div>
              <button onClick={() => setShowOnboardModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOnboardNewCompany} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="e.g. NextGen Software Corp"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Company Domain</label>
                  <input
                    type="text"
                    value={newCompanyDomain}
                    onChange={(e) => setNewCompanyDomain(e.target.value)}
                    placeholder="nextgen.io"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subscription Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e: any) => setNewPlan(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-purple-300 font-mono font-bold focus:outline-none focus:border-purple-500"
                  >
                    <option value="Starter">Starter (₹3,499)</option>
                    <option value="Pro OS">Pro OS (₹8,999)</option>
                    <option value="Scale Enterprise">Scale Enterprise (₹19,999)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Founder / Owner Name</label>
                  <input
                    type="text"
                    value={newFounderName}
                    onChange={(e) => setNewFounderName(e.target.value)}
                    placeholder="e.g. David Vance"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Founder Work Email</label>
                  <input
                    type="email"
                    required
                    value={newFounderEmail}
                    onChange={(e) => setNewFounderEmail(e.target.value)}
                    placeholder="founder@nextgen.io"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-md"
                >
                  Provision Client Company
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Floating AI Overlay */}
      <BrainOverlayWidget />

    </div>
  );
}
