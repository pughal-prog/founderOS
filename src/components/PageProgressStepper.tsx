'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Globe, 
  LogIn, 
  LayoutDashboard, 
  MessageSquareText, 
  ChevronRight, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function PageProgressStepper() {
  const pathname = usePathname();

  const steps = [
    { step: 1, name: '1. Landing Page', path: '/', icon: Globe, desc: 'Startup Concept & Value' },
    { step: 2, name: '2. Login Page', path: '/login', icon: LogIn, desc: 'Executive SSO & Auth' },
    { step: 3, name: '3. Dashboard', path: '/dashboard', icon: LayoutDashboard, desc: 'Real-time KPIs & Signals' },
    { step: 4, name: '4. AI Chat', path: '/chat', icon: MessageSquareText, desc: 'Cross-App AI Analyst' },
  ];

  const currentIndex = steps.findIndex(s => s.path === pathname);
  const nextStep = currentIndex >= 0 && currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;

  return (
    <div className="w-full bg-slate-950/90 border-b border-cyan-500/30 px-4 py-2.5 shadow-lg z-40 sticky top-0 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Step Indicator Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto w-full sm:w-auto py-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
            Page Flow:
          </span>
          
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = pathname === s.path;
            const isCompleted = currentIndex > idx;

            return (
              <React.Fragment key={s.path}>
                <Link
                  href={s.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 scale-105'
                      : isCompleted
                      ? 'bg-slate-900 text-cyan-300 border border-cyan-500/40 hover:bg-slate-800'
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                  <span>{s.name}</span>
                </Link>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 shrink-0 hidden md:inline-block" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Quick Next Page CTA Button */}
        {nextStep && (
          <Link
            href={nextStep.path}
            className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Proceed to {nextStep.name}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        )}

      </div>
    </div>
  );
}
