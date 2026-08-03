'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ConnectedAppsGrid from '@/components/ConnectedAppsGrid';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import ActionModal from '@/components/ui/ActionModal';
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
  Star,
  Terminal,
  Sliders,
  Send
} from 'lucide-react';

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [teamSize, setTeamSize] = useState(25);
  const [appsCount, setAppsCount] = useState(8);
  
  // Terminal Sandbox State
  const [sandboxQuery, setSandboxQuery] = useState('Which customers haven\'t replied?');
  const [sandboxResult, setSandboxResult] = useState('Acme Inc. (Sarah Jenkins): No reply for 9 days after security audit doc sent. Suggested Action: Send follow-up email.');
  const [isSandboxRunning, setIsSandboxRunning] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);

  // ROI calculations
  const hoursSavedPerWeek = Math.round(teamSize * 3.5);
  const dollarsSavedPerMonth = Math.round(hoursSavedPerWeek * 4 * 75);

  const handleTestQuery = (queryText?: string) => {
    const q = queryText || sandboxQuery;
    setIsSandboxRunning(true);
    setTimeout(() => {
      if (q.toLowerCase().includes('reply')) {
        setSandboxResult('Acme Inc. (Sarah Jenkins): No reply for 9 days after security audit doc sent. Suggested Action: Draft follow-up email.');
      } else if (q.toLowerCase().includes('arr') || q.toLowerCase().includes('revenue')) {
        setSandboxResult('Real-time Stripe MRR is $82,500 (+12.1% MoM). 18 enterprise upgrades contributed $42k in expansion ARR.');
      } else if (q.toLowerCase().includes('meeting') || q.toLowerCase().includes('calendar')) {
        setSandboxResult('3 Meetings Today: Sequoia Capital Investor Call @ 10:00 AM, Acme Security Review @ 2:00 PM.');
      } else {
        setSandboxResult('Synthesized 14,250 events across Stripe, HubSpot, Notion, & Gmail. All systems operating with 0 latency.');
      }
      setIsSandboxRunning(false);
    }, 600);
  };

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
        
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-8 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-semibold text-cyan-300 shadow-lg shadow-cyan-950/50 hover:border-cyan-400 transition-colors">
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
              <span>Start Free Trial</span>
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

        </div>

        {/* Hero Interactive Terminal Sandbox */}
        <div className="mt-16 relative max-w-5xl mx-auto glass-panel rounded-3xl border border-cyan-500/30 p-4 sm:p-6 shadow-2xl shadow-cyan-950/80 overflow-hidden bg-slate-900/90 text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Interactive FounderOS Sandbox Terminal</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Try Live Queries Below
            </div>
          </div>

          {/* Preset Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
            {[
              "Which customers haven't replied?",
              "What is our projected Q3 ARR?",
              "What meetings do I have today?"
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSandboxQuery(p);
                  handleTestQuery(p);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 font-semibold whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Sandbox Query Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={sandboxQuery}
              onChange={(e) => setSandboxQuery(e.target.value)}
              placeholder="Ask a question across Gmail, Stripe, Notion..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => handleTestQuery()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs hover:bg-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <span>Run</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sandbox Result Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
            <div className="text-slate-500 text-[10px] flex justify-between">
              <span>OUTPUT SYNTHESIS:</span>
              <span className="text-cyan-400 font-bold">14,250 Events Indexed</span>
            </div>
            {isSandboxRunning ? (
              <p className="text-cyan-400 animate-pulse">Processing query across Stripe, HubSpot, & Gmail endpoints...</p>
            ) : (
              <p className="text-slate-200 leading-relaxed">{sandboxResult}</p>
            )}
          </div>
        </div>

      </section>

      {/* Connected Apps Matrix */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            Universal Connectivity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Connects 9 SaaS tools in under 2 minutes.
          </h2>
        </div>
        <ConnectedAppsGrid />
      </section>

      {/* Interactive ROI Calculator Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/90">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Interactive ROI Estimator
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Calculate how much time & money FounderOS saves your startup.
            </h2>

            {/* Slider Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                  <span>Team Size (Executives & Analysts):</span>
                  <span className="text-cyan-400">{teamSize} members</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                  <span>Connected Business Apps:</span>
                  <span className="text-indigo-400">{appsCount} SaaS tools</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={appsCount}
                  onChange={(e) => setAppsCount(Number(e.target.value))}
                  className="w-full accent-indigo-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block">Hours Saved / Week</span>
                <span className="text-3xl font-extrabold text-cyan-400 mt-1 block">{hoursSavedPerWeek} hrs</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block">Est. Value Saved / Month</span>
                <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">${dollarsSavedPerMonth.toLocaleString()}</span>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs hover:scale-105 transition-all"
            >
              Start 14-Day Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Pricing Section with Interactive Billing Toggle */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Simple Pricing for SaaS Founders
          </h2>
          
          {/* Interactive Billing Period Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                billingPeriod === 'monthly' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                billingPeriod === 'annual' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[9px] bg-emerald-500 text-black font-extrabold px-1.5 py-0.2 rounded-full uppercase">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Starter Founder</span>
              <div className="text-4xl font-extrabold text-white">
                ${billingPeriod === 'annual' ? '39' : '49'} <span className="text-xs text-slate-400 font-normal">/ mo</span>
              </div>
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
              <div className="text-4xl font-extrabold text-white">
                ${billingPeriod === 'annual' ? '119' : '149'} <span className="text-xs text-slate-400 font-normal">/ mo</span>
              </div>
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
              <div className="text-4xl font-extrabold text-white">$249 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
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

      {/* Persistent Brain Overlay Demo Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
