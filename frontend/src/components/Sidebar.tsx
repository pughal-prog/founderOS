'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Layers, 
  Zap, 
  Settings, 
  Database, 
  TrendingUp, 
  ShieldCheck, 
  Brain, 
  Sparkles,
  ChevronDown,
  Activity,
  AppWindow
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Executive Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      name: 'AI Chat Analyst',
      path: '/chat',
      icon: MessageSquareText,
      badge: 'GPT-4o + Claude',
      highlight: true,
    },
  ];

  const appIntegrations = [
    { name: 'Stripe MRR', status: 'Connected', color: 'bg-indigo-400' },
    { name: 'Salesforce CRM', status: 'Synced', color: 'bg-cyan-400' },
    { name: 'HubSpot Marketing', status: 'Live', color: 'bg-emerald-400' },
    { name: 'PostgreSQL DB', status: 'Indexed', color: 'bg-purple-400' },
    { name: 'Notion & Slack', status: 'Active', color: 'bg-pink-400' },
  ];

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 hidden md:flex">
      <div className="space-y-6">
        
        {/* Workspace Selector */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              HQ
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white tracking-tight">Acme Corp HQ</span>
              <span className="text-[10px] text-cyan-400 font-mono">12 Connected Apps</span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Main Navigation Menu */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-2">
            Navigation Workspace
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
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

        {/* Overlay Mode Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/30 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
            <AppWindow className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Overlay Floating Mode</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            AI Brain operates on top of Chrome, Notion, Salesforce, & Desktop apps with hotkey <kbd className="bg-slate-800 px-1 rounded text-cyan-300 text-[10px]">Alt + B</kbd>
          </p>
          <div className="flex items-center justify-between text-[10px] text-emerald-400 pt-1 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Overlay Hooked
            </span>
            <span className="text-slate-400">v2.4-stable</span>
          </div>
        </div>

        {/* Connected Business Data Streams */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Database className="w-3 h-3 text-cyan-400" />
              Brain Data Connectors
            </span>
            <span className="text-[10px] font-bold text-emerald-400">100% Synced</span>
          </div>
          <div className="space-y-1.5">
            {appIntegrations.map((app, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${app.color}`} />
                  <span className="text-slate-300 font-medium">{app.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{app.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* User Footer Profile */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 shadow-sm">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-xs text-white">
              JD
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">Jane Doe</span>
            <span className="text-[10px] text-slate-400">Head of Growth</span>
          </div>
        </div>
        <div className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
          <Settings className="w-4 h-4" />
        </div>
      </div>
    </aside>
  );
}
