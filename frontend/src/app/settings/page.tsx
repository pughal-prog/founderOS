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
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const { userProfile, setUserProfile } = useFounderStore();
  const [openAiKey, setOpenAiKey] = useState(userProfile.openAiApiKey);
  const [supabaseUrl, setSupabaseUrl] = useState(userProfile.supabaseUrl);
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
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings Saved Successfully</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
            
            {/* Account Profile Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/80">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <User className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Founder Profile</h3>
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

            {/* AI & DB Integrations Configuration Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 bg-slate-900/80">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Key className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">OpenAI & Supabase Integration Credentials</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">OpenAI API Key</label>
                  <input
                    type="password"
                    value={openAiKey}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    placeholder="sk-proj-••••••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Used for custom LLM query processing. Fallback mock engine active.</span>
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

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Workspace Configuration</span>
            </button>

          </form>

        </main>
      </div>

      {/* Floating AI Brain Overlay Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
