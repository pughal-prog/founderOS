'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ConnectedAppsGrid from '@/components/ConnectedAppsGrid';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Database, 
  TrendingUp, 
  CheckCircle2, 
  AppWindow, 
  MessageSquareText, 
  LayoutDashboard,
  Users,
  ChevronRight,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const testimonials = [
    {
      quote: "FounderOS completely replaced my Sunday evening manual reporting routine. I just ask 'What deals slip this week?' and get instant cross-app answers.",
      name: "Marcus Vance",
      title: "CEO & Co-founder, CloudScale",
      mrr: "$140k MRR"
    },
    {
      quote: "Connecting Stripe, HubSpot, and Notion in 2 clicks allowed our board updates to run on autopilot.",
      name: "Sophia Martinez",
      title: "Founder, DataPulse AI",
      mrr: "$85k MRR"
    },
    {
      quote: "The unreplied email detector alone saved us from losing a $45k ARR deal with an enterprise prospect.",
      name: "David Sterling",
      title: "Head of Growth, DevSync",
      mrr: "$220k MRR"
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 bg-grid-pattern selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-8 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/50">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Introducing FounderOS v1.0</span>
            <span className="text-slate-500">•</span>
            <span className="text-white">Unified SaaS Founder Intelligence</span>
          </div>

          {/* Large Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            The AI Operating System <br className="hidden sm:inline" />
            <span className="gradient-text">for SaaS Founders</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Connect your business tools. Ask anything. <br className="hidden sm:inline" />
            Get instant business intelligence.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/chat"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-slate-200 hover:text-white font-bold text-sm border border-slate-700 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquareText className="w-5 h-5 text-indigo-400" />
              <span>Book Demo / Test AI Chat</span>
            </Link>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            Does NOT replace Gmail, Slack, Notion, or Stripe. Hooks directly into your existing tools.
          </p>

        </div>

        {/* Hero Dashboard Graphic Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto glass-panel rounded-3xl border border-cyan-500/30 p-4 sm:p-6 shadow-2xl shadow-cyan-950/80 overflow-hidden bg-slate-900/90 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold text-white">FounderOS AI Workspace</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Gmail + Slack + Notion + Stripe Synced
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Monthly Revenue</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">$89,000</span>
              <span className="text-[10px] text-emerald-400 font-mono">+18.4% MoM growth</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Unreplied Customer Emails</span>
              <span className="text-2xl font-extrabold text-amber-400 mt-1 block">3 Accounts</span>
              <span className="text-[10px] text-slate-400 font-mono">Sarah Jenkins (9 days)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block font-semibold">Today's Schedule</span>
              <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">3 Meetings</span>
              <span className="text-[10px] text-slate-400 font-mono">Sequoia Capital @ 10am</span>
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Designed specifically for SaaS founder workflows.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Natural Language OS</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask "Who hasn't replied?" or "Show overdue invoices" to instantly get answers across Gmail, Stripe, and HubSpot.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Unified Business Index</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect 9 business applications without migrating your workflows or replacing your existing CRM.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Automated Risk Signals</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Detect high-risk customers, payment retries, and deal slipping before revenue is lost.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
            9 One-Click Connectors
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Connect your entire stack in under 2 minutes.
          </h2>
        </div>
        <ConnectedAppsGrid />
      </section>

      {/* Testimonials (Dummy) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Loved by Fast-Growing SaaS Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{t.name}</span>
                  <span className="text-[10px] text-slate-400">{t.title}</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/30">
                  {t.mrr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Simple Pricing for SaaS Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Starter Founder</span>
              <div className="text-4xl font-extrabold text-white">$49 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <p className="text-xs text-slate-300">For early-stage founders up to $20k MRR.</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Up to 5 SaaS Connectors</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> 1,000 AI Queries / Mo</li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors">
              Start Free Trial
            </Link>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-2 border-cyan-500/80 flex flex-col justify-between space-y-6 relative bg-slate-900/90 shadow-xl shadow-cyan-950/50">
            <div className="space-y-4">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Pro OS</span>
              <div className="text-4xl font-extrabold text-white">$149 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <p className="text-xs text-slate-300">Full AI Operating System for scaling founders.</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> All 9 SaaS Connectors</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Unlimited AI Queries</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Real-time Anomaly Signals</li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs text-center transition-all shadow-md">
              Start Free Trial
            </Link>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Scale Enterprise</span>
              <div className="text-4xl font-extrabold text-white">$299 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <p className="text-xs text-slate-300">Custom data retention and multi-founder seats.</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Self-Hosted Supabase DB</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Custom OpenAI API Keys</li>
              </ul>
            </div>
            <Link href="/login" className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}
