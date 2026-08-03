'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, User, Database, CheckCircle2, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between z-30 shrink-0 sticky top-0 bg-slate-950/80 backdrop-blur-md">
      
      {/* Search Input Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers, metrics, meetings, or ask AI..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right User & System Status Actions */}
      <div className="flex items-center gap-3">
        
        {/* Connected Apps Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium text-[11px]">8/9 Apps Synced</span>
        </div>

        {/* Notifications Icon Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 glass-panel p-4 rounded-2xl border border-slate-800 shadow-2xl z-50 bg-slate-900/95 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">FounderOS Intelligence Alerts</span>
                <span className="text-[10px] font-mono text-cyan-400">3 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold text-white">
                    <span>Acme Inc. Unreplied</span>
                    <span className="text-[9px] text-red-400 font-mono">9 Days</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Sarah Jenkins hasn't responded to security audit email.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold text-white">
                    <span>Apex Cloud Invoice Overdue</span>
                    <span className="text-[9px] text-amber-400 font-mono">$5,600</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Payment failed in Stripe. Retry scheduled.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <Link href="/settings" className="flex items-center gap-2.5 pl-2 border-l border-slate-800 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-xs text-white">
              AV
            </div>
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-none">Alex Vance</span>
            <span className="text-[10px] text-slate-400 leading-tight">Founder & CEO</span>
          </div>
        </Link>

      </div>

    </header>
  );
}
