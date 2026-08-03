'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  AppWindow, 
  Settings, 
  Users, 
  Calendar, 
  Brain, 
  ChevronRight, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat', path: '/chat', icon: MessageSquareText, badge: 'Core AI' },
    { name: 'Connect Apps', path: '/connect-apps', icon: AppWindow, badge: '9 Integrated' },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const subNav = [
    { name: 'Customers & Deals', path: '/dashboard', icon: Users },
    { name: 'Meetings & Schedule', path: '/dashboard', icon: Calendar },
    { name: 'Landing Page', path: '/', icon: Globe },
  ];

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-64px)] flex flex-col justify-between p-4 hidden md:flex bg-slate-950/60 backdrop-blur-xl">
      <div className="space-y-6">
        
        {/* Workspace Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
              FOUNDER OS <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">v1.0</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">SaaS AI Operating System</span>
          </div>
        </Link>

        {/* Main Navigation */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-2">
            Main OS Navigation
          </span>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-transparent text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sub Sections */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-2">
            Founder Views
          </span>
          <nav className="space-y-1">
            {subNav.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.path}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {/* AI OS Engine Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/30 space-y-2">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Unified Data Layer</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Gmail, Slack, Notion, Stripe, & HubSpot indexed in 1 query engine.
        </p>
      </div>

    </aside>
  );
}
