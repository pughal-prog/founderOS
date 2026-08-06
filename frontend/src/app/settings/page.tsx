'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import { useFounderStore } from '@/hooks/useFounderStore';
import { 
  Settings, 
  Key, 
  User, 
  Bell, 
  ShieldCheck, 
  Save, 
  Database, 
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Users,
  Lock,
  Mail,
  MessageSquare
} from 'lucide-react';

export default function SettingsPage() {
  const { userProfile, setUserProfile } = useFounderStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'team' | 'notifications' | 'security'>('profile');
  const [openAiKey, setOpenAiKey] = useState(userProfile.openAiApiKey);
  const [supabaseUrl, setSupabaseUrl] = useState(userProfile.supabaseUrl);
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Notification Settings State (Phase 6)
  const [emailDigest, setEmailDigest] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [invoiceWebhooks, setInvoiceWebhooks] = useState(true);
  const [anomalySignals, setAnomalySignals] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      ...userProfile,
      openAiApiKey: openAiKey,
      supabaseUrl: supabaseUrl
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const teamMembers = [
    { name: 'Alex Vance', role: 'Founder & CEO', email: 'alex@founderos.io', status: 'Owner' },
    { name: 'Sarah Miller', role: 'Head of Engineering', email: 'sarah.m@founderos.io', status: 'Admin' },
    { name: 'David Chen', role: 'Lead Growth Analyst', email: 'david@founderos.io', status: 'Member' }
  ];

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">System Preferences</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                FounderOS Workspace Settings
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Manage OpenAI API keys, Supabase DB connection, team seats, and notification alerts.
              </p>
            </div>
            {savedSuccess && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-bounce shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings Saved Successfully</span>
              </div>
            )}
          </div>

          {/* Interactive Settings Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'profile', label: 'Founder Profile', icon: User },
              { id: 'api', label: 'API Keys & Database', icon: Key },
              { id: 'team', label: 'Team Members (3)', icon: Users },
              { id: 'notifications', label: 'Notification Settings', icon: Bell },
              { id: 'security', label: 'Security & Compliance', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Form */}
          <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
            
            {activeTab === 'profile' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm animate-in fade-in duration-150">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Founder Profile Settings</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      defaultValue={userProfile.name}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Role / Title</label>
                    <input
                      type="text"
                      defaultValue={userProfile.role}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Work Email</label>
                    <input
                      type="email"
                      defaultValue={userProfile.email}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm animate-in fade-in duration-150">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">OpenAI & Supabase Credentials</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>OpenAI API Key</span>
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-blue-600 hover:underline text-[11px] flex items-center gap-1 font-bold"
                      >
                        {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showApiKey ? 'Hide Key' : 'Show Key'}</span>
                      </button>
                    </label>
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={openAiKey}
                      onChange={(e) => setOpenAiKey(e.target.value)}
                      placeholder="sk-proj-••••••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 font-semibold"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Used for natural language query generation. Local fallback engine active.</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Supabase PostgreSQL URL</label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyz-app.supabase.co"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">Team Workspace Members</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Invitation link generated!')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-bold border border-slate-200"
                  >
                    + Invite Member
                  </button>
                </div>

                <div className="space-y-3">
                  {teamMembers.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{m.name}</span>
                        <span className="text-[11px] text-slate-500">{m.role} • {m.email}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] border border-blue-200 font-bold">
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm animate-in fade-in duration-150 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Notification Alerts & Webhooks</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 block">Daily Executive Email Digest</span>
                      <span className="text-[11px] text-slate-500">Receive morning summary of unreplied emails and MRR shifts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailDigest}
                      onChange={(e) => setEmailDigest(e.target.checked)}
                      className="accent-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 block">Slack Instant Alert Channel</span>
                      <span className="text-[11px] text-slate-500">Dispatch alerts to #founder-os channel for at-risk accounts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={slackAlerts}
                      onChange={(e) => setSlackAlerts(e.target.checked)}
                      className="accent-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 block">Stripe Overdue Invoice Webhook</span>
                      <span className="text-[11px] text-slate-500">Automatically attempt payment retries on failed billing events</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={invoiceWebhooks}
                      onChange={(e) => setInvoiceWebhooks(e.target.checked)}
                      className="accent-blue-600 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-sm animate-in fade-in duration-150 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Security & Compliance Log</h3>
                </div>

                <div className="space-y-2 text-slate-700">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                    <span className="font-medium">SOC-2 Type II Compliance Status</span>
                    <span className="text-emerald-700 font-mono font-bold">Verified</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                    <span className="font-medium">Zero Data Retention Policy</span>
                    <span className="text-emerald-700 font-mono font-bold">Active</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                    <span className="font-medium">API Request Rate Limit Threshold</span>
                    <span className="text-blue-700 font-mono font-bold">1,000 req / min</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>

          </form>

        </main>
      </div>

      {/* Floating AI Brain Overlay Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
