'use client';

import React, { useState } from 'react';
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
  Globe,
  ChevronDown,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('FounderOS HQ');

  const workspaces = [
    { name: 'FounderOS HQ', apps: '9 Apps Synced', mrr: '$89,000' },
    { name: 'Starlight Labs', apps: '4 Apps Synced', mrr: '$42,500' },
    { name: 'CloudScale Inc.', apps: '6 Apps Synced', mrr: '$120,000' },
  ];

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat', path: '/chat', icon: MessageSquareText, badge: 'Core AI' },
    { name: 'Connect Apps', path: '/connect-apps', icon: AppWindow, badge: '8 Synced' },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const subNav = [
    { name: 'Customers & Deals', path: '/dashboard#customers', icon: Users },
    { name: 'Meetings & Schedule', path: '/dashboard#meetings', icon: Calendar },
    { name: 'Landing Page', path: '/', icon: Globe },
  ];

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-amber-900/10 min-h-[calc(100vh-64px)] flex flex-col justify-between p-4 hidden md:flex bg-white/70 backdrop-blur-xl selection:bg-amber-800 selection:text-white">
      <div className="space-y-6">
        
        {/* Workspace Selector Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowWorkspaceModal(!showWorkspaceModal)}
            className="p-3 rounded-2xl bg-white border border-amber-900/15 hover:border-amber-700/50 transition-colors flex items-center justify-between cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-900 to-amber-700 flex items-center justify-center font-bold text-xs text-white shadow-sm group-hover:scale-105 transition-transform">
                {activeWorkspace.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-amber-950 tracking-tight">{activeWorkspace}</span>
                <span className="text-[10px] text-amber-800 font-mono font-bold">12 Connected Feeds</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-800 transition-colors" />
          </div>

          {/* Workspace Switcher Modal Popover */}
          {showWorkspaceModal && (
            <div className="absolute top-full left-0 mt-2 w-full glass-panel p-2 rounded-2xl border border-amber-900/15 shadow-2xl z-50 bg-white space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 px-2 block my-1">
                Select Workspace
              </span>
              {workspaces.map((ws, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveWorkspace(ws.name);
                    setShowWorkspaceModal(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50 cursor-pointer text-xs transition-colors"
                >
                  <div>
                    <span className="font-bold text-amber-950 block">{ws.name}</span>
                    <span className="text-[10px] text-stone-500">{ws.apps}</span>
                  </div>
                  {activeWorkspace === ws.name && (
                    <CheckCircle2 className="w-4 h-4 text-amber-800" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 block mb-2">
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-md shadow-amber-950/20 scale-[1.02]'
                      : 'text-stone-700 hover:text-amber-950 hover:bg-amber-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-amber-900/60'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive 
                        ? 'bg-amber-950/40 text-amber-100 border border-amber-700/50' 
                        : 'bg-amber-100 text-amber-900 font-semibold'
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 block mb-2">
            Founder Views
          </span>
          <nav className="space-y-1">
            {subNav.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.path}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-stone-600 hover:text-amber-950 hover:bg-amber-100/60 transition-colors font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-stone-400" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {/* AI OS Engine Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-100 via-amber-50 to-stone-100 border border-amber-900/15 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
          <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
          <span>Unified Data Layer</span>
        </div>
        <p className="text-[11px] text-stone-700 leading-relaxed font-medium">
          Gmail, Slack, Notion, Stripe, & HubSpot indexed in 1 query engine.
        </p>
      </div>

    </aside>
  );
}
