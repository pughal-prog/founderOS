'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import IntegrationCard from '@/components/ui/IntegrationCard';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import { useFounderStore } from '@/hooks/useFounderStore';
import { AppWindow, Database, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ConnectAppsPage() {
  const { integrations, toggleIntegration } = useFounderStore();

  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-cyan-500/30 bg-slate-900/90 relative overflow-hidden">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Integrations Ecosystem</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {connectedCount} of 9 Connected
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Connect Business Tools
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                FounderOS indexes all your tool data without replacing Gmail, Slack, Notion, or Stripe.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium z-10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Read-Only API Sync • SOC-2 Compliant</span>
            </div>
          </div>

          {/* 9 Integration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((app) => (
              <IntegrationCard
                key={app.id}
                app={app}
                onToggle={toggleIntegration}
              />
            ))}
          </div>

        </main>
      </div>

      {/* Floating AI Brain Overlay Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
