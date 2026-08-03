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
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const { userProfile, setUserProfile } = useFounderStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'api' | 'team' | 'security'>('profile');
  const [openAiKey, setOpenAiKey] = useState(userProfile.openAiApiKey);
  const [supabaseUrl, setSupabaseUrl] = useState(userProfile.supabaseUrl);
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-slate-900/90">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">System Preferences</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                FounderOS Workspace Settings
              </h1>
              <p className="text-xs text-slate-300">
                Manage OpenAI API keys, Supabase DB connection, and team permissions.
              </p>
            </div>
            {savedSuccess && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings Saved Successfully</span>
              </div>
            )}
          </div>

          {/* Interactive Settings Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'profile', label: 'Founder Profile', icon: User },
              { id: 'api', label: 'API Keys & Database', icon: Key },
              { id: 'team', label: 'Team Members (3)', icon: Users },
              { id: 'security', label: 'Security & Compliance', icon: ShieldCheck }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
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
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/80 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <User className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Founder Profile Settings</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      defaultValue={userProfile.name}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Role / Title</label>
                    <input
                      type="text"
                      defaultValue={userProfile.role}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Work Email</label>
                    <input
                      type="email"
                      defaultValue={userProfile.email}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/80 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Key className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">OpenAI & Supabase Credentials</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>OpenAI API Key</span>
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Used for natural language query generation. Local fallback engine active.</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Supabase PostgreSQL URL</label>
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://xyz-app.supabase.co"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/80 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Team Workspace Members</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Invitation link generated!')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold"
                  >
                    + Invite Member
                  </button>
                </div>

                <div className="space-y-3">
                  {teamMembers.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{m.name}</span>
                        <span className="text-[11px] text-slate-400">{m.role} • {m.email}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-slate-900 text-cyan-400 font-mono text-[10px] border border-slate-800 font-semibold">
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/80 animate-in fade-in duration-150 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Security & Compliance Log</h3>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span>SOC-2 Type II Compliance Status</span>
                    <span className="text-emerald-400 font-mono font-bold">Verified</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span>Zero Data Retention Policy</span>
                    <span className="text-emerald-400 font-mono font-bold">Active</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                    <span>API Request Rate Limit Threshold</span>
                    <span className="text-cyan-400 font-mono font-bold">1,000 req / min</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-2"
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
