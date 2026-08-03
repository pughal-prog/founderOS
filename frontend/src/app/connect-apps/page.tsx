'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import IntegrationCard from '@/components/ui/IntegrationCard';
import ActionModal from '@/components/ui/ActionModal';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import { useFounderStore } from '@/hooks/useFounderStore';
import { AppWindow, Database, Sparkles, CheckCircle2, ShieldCheck, Search, Filter } from 'lucide-react';

export default function ConnectAppsPage() {
  const { integrations, toggleIntegration } = useFounderStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const connectedCount = integrations.filter(i => i.connected).length;

  const categories = ['All', 'Communication & Email', 'Revenue & Subscriptions', 'CRM & Pipeline', 'Engineering & Delivery', 'Knowledge & Specs'];

  const filteredIntegrations = integrations.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                Connect SaaS Business Tools
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

          {/* Interactive Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SaaS tool by name or capability..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0 hidden sm:inline-block" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'All Tools' : cat.split('&')[0]}
                </button>
              ))}
            </div>

          </div>

          {/* 9 Integration Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((app) => (
              <IntegrationCard
                key={app.id}
                app={app}
                onToggle={(id) => {
                  toggleIntegration(id);
                  if (!app.connected) {
                    setModalTitle(`Configure API Sync for ${app.name}`);
                    setModalOpen(true);
                  }
                }}
              />
            ))}
          </div>

        </main>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        type="view"
      />

      {/* Floating AI Brain Overlay Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
