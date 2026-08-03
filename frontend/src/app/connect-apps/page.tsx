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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-8">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm relative overflow-hidden">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Integrations Ecosystem</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {connectedCount} of 9 Connected
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Connect SaaS Business Tools
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                FounderOS indexes all your tool data without replacing Gmail, Slack, Notion, or Stripe.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold z-10">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Read-Only API Sync • SOC-2 Compliant</span>
            </div>
          </div>

          {/* Interactive Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SaaS tool by name or capability..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0 hidden sm:inline-block" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900'
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
