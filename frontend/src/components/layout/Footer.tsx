'use client';

import React from 'react';
import Link from 'next/link';
import FounderOSLogo from '@/components/ui/FounderOSLogo';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-slate-200 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <FounderOSLogo size="sm" />
        <span>© 2026 FounderOS Inc. All rights reserved.</span>
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
