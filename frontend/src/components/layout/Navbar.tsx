'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, User, Database, CheckCircle2, ChevronDown, X, LogOut, Settings, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchSuggestions = [
    { title: 'Sarah Jenkins (Acme Inc.)', type: 'Customer (Unreplied)', path: '/chat' },
    { title: 'Series A Investor Catchup', type: 'Meeting (10:00 AM)', path: '/dashboard' },
    { title: 'Invoice INV-2026-001 ($5,600)', type: 'Overdue Invoice', path: '/chat' },
    { title: 'Stripe MRR Run-Rate', type: 'Financial Metric', path: '/dashboard' }
  ];

  const filteredSuggestions = searchQuery.trim()
    ? searchSuggestions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : searchSuggestions;

  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between z-30 shrink-0 sticky top-0 bg-slate-950/80 backdrop-blur-md">
      
      {/* Search Input Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div 
          onClick={() => setShowSearchModal(true)}
          className="relative w-full cursor-pointer group"
        >
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-cyan-400 transition-colors" />
          <div className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-12 text-xs text-slate-400 group-hover:border-slate-700 transition-colors flex items-center justify-between">
            <span>Search metrics, customers, meetings, or ask AI...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-mono text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right User & System Status Actions */}
      <div className="flex items-center gap-3">
        
        {/* Connected Apps Status Pill */}
        <Link 
          href="/connect-apps"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium text-[11px]">8/9 Apps Synced</span>
        </Link>

        {/* Notifications Icon Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel p-4 rounded-2xl border border-slate-800 shadow-2xl z-50 bg-slate-900/95 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">FounderOS Intelligence Alerts</span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">3 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <Link
                  href="/chat"
                  onClick={() => setShowNotifications(false)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 block space-y-1 transition-colors"
                >
                  <div className="flex justify-between font-semibold text-white">
                    <span>Acme Inc. Unreplied</span>
                    <span className="text-[9px] text-red-400 font-mono">9 Days</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Sarah Jenkins hasn't responded to security audit email.</p>
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setShowNotifications(false)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 block space-y-1 transition-colors"
                >
                  <div className="flex justify-between font-semibold text-white">
                    <span>Apex Cloud Invoice Overdue</span>
                    <span className="text-[9px] text-amber-400 font-mono">$5,600</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Payment failed twice in Stripe. Retry scheduled.</p>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-xs text-white">
                AV
              </div>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-none">Alex Vance</span>
              <span className="text-[10px] text-slate-400 leading-tight">Founder & CEO</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* Profile Popover Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-panel p-2 rounded-2xl border border-slate-800 shadow-2xl z-50 bg-slate-900/95 space-y-1 animate-in fade-in zoom-in-95 duration-150 text-xs">
              <div className="p-2.5 pb-2 border-b border-slate-800">
                <span className="font-bold text-white block">Alex Vance</span>
                <span className="text-[10px] text-cyan-400 font-mono">alex@founderos.io</span>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>Workspace Settings</span>
              </Link>
              <Link
                href="/connect-apps"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors font-medium"
              >
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Connected Apps</span>
              </Link>
              <Link
                href="/login"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-xl glass-panel p-4 rounded-3xl border border-cyan-500/30 shadow-2xl bg-slate-900/95 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 px-3 py-2 bg-slate-950 rounded-2xl border border-slate-800">
              <Search className="w-4 h-4 text-cyan-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type customer name, meeting, invoice or query..."
                className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full"
              />
              <button onClick={() => setShowSearchModal(false)}>
                <X className="w-4 h-4 text-slate-500 hover:text-white" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1">
                Quick Results
              </span>
              {filteredSuggestions.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.path}
                  onClick={() => setShowSearchModal(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 text-xs transition-colors"
                >
                  <span className="font-semibold text-white">{item.title}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    {item.type}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
