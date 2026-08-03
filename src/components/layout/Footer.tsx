'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ShieldCheck, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-cyan-400" />
        <span className="font-bold text-white">FOUNDER OS</span>
        <span>© 2026 FounderOS Inc. The AI Operating System for SaaS Founders.</span>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Dashboard</Link>
        <Link href="/chat" className="hover:text-cyan-300 transition-colors">AI Chat</Link>
        <Link href="/connect-apps" className="hover:text-cyan-300 transition-colors">Integrations</Link>
        <Link href="/login" className="hover:text-cyan-300 transition-colors">Sign In</Link>
      </div>
    </footer>
  );
}
