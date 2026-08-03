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
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-200 min-h-[calc(100vh-64px)] flex flex-col justify-between p-4 hidden md:flex bg-white/80 backdrop-blur-xl selection:bg-blue-600 selection:text-white">
      <div className="space-y-6">
        
        {/* Workspace Selector Dropdown */}
        <div className="relative">
          <div
            onClick={() => setShowWorkspaceModal(!showWorkspaceModal)}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-colors flex items-center justify-between cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-sm group-hover:scale-105 transition-transform">
                {activeWorkspace.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-slate-900 tracking-tight">{activeWorkspace}</span>
                <span className="text-[10px] text-blue-600 font-mono font-bold">12 Connected Feeds</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>

          {/* Workspace Switcher Modal Popover */}
          {showWorkspaceModal && (
            <div className="absolute top-full left-0 mt-2 w-full glass-panel p-2 rounded-2xl border border-slate-200 shadow-2xl z-50 bg-white space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block my-1">
                Select Workspace
              </span>
              {workspaces.map((ws, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveWorkspace(ws.name);
                    setShowWorkspaceModal(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 cursor-pointer text-xs transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{ws.name}</span>
                    <span className="text-[10px] text-slate-500">{ws.apps}</span>
                  </div>
                  {activeWorkspace === ws.name && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
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
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive 
                        ? 'bg-blue-900/40 text-blue-100 border border-blue-400/30' 
                        : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
            Founder Views
          </span>
          <nav className="space-y-1">
            {subNav.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.path}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors font-semibold"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {/* AI OS Engine Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 border border-blue-100 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          <span>Unified Data Layer</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
          Gmail, Slack, Notion, Stripe, & HubSpot indexed in 1 query engine.
        </p>
      </div>

    </aside>
  );
}
