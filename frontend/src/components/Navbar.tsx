'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Sparkles, LayoutDashboard, MessageSquareText, LogIn, Layers, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [overlayActive, setOverlayActive] = useState(true);

  // Do not render top public navbar on app layout pages like /dashboard and /chat if we want full workspace view
  const isAppView = pathname === '/dashboard' || pathname === '/chat';

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              AI BRAIN <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Overlay OS</span>
            </span>
            <span className="text-[11px] text-slate-400 tracking-wide font-medium">Universal Business Analyst</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              pathname === '/' 
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Product Overview
          </Link>
          <Link
            href="/dashboard"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              pathname === '/dashboard'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Executive Dashboard
          </Link>
          <Link
            href="/chat"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              pathname === '/chat'
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5 text-purple-400" />
            AI Chat Analyst
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Overlay Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 text-[11px] font-medium">Overlay Engine: <strong className="text-emerald-400">Active</strong></span>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </Link>

          <Link
            href="/chat"
            className="relative group overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-200" />
            <span>Launch Brain</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </header>
  );
}
