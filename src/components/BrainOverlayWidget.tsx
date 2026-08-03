'use client';

import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Zap, 
  Database, 
  TrendingUp, 
  ShieldAlert, 
  Layers,
  ArrowUpRight,
  BotMessageSquare,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

interface OverlayMessage {
  sender: string;
  text: string;
  time: string;
  appContext: string;
  dataInsight?: {
    title: string;
    metric: string;
    details: string;
    badge: string;
    actionText: string;
  };
}

export default function BrainOverlayWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Apps');
  const [messages, setMessages] = useState<OverlayMessage[]>([
    {
      sender: 'ai',
      text: 'AI Brain overlay ready. I am currently monitoring Salesforce, Stripe, HubSpot, & PostgreSQL. What analysis would you like to perform right now?',
      time: 'Just now',
      appContext: 'System Active',
      dataInsight: {
        title: 'Cross-App Anomaly Detected',
        metric: 'Stripe Churn + Hubspot Ticket Spike',
        details: '14 enterprise customers submitted churn-risk tickets in HubSpot following yesterday\'s API v2 rate limiting update.',
        badge: 'High Impact',
        actionText: 'View Resolution Workflow'
      }
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleQueries = [
    'What is our ARR vs target for Q3?',
    'Why did Stripe churn spike this week?',
    'Summarize top sales blockers in Salesforce',
    'Calculate current burn rate & runway'
  ];

  const handleSend = (userQueryText?: string) => {
    const textToSend = userQueryText || query;
    if (!textToSend.trim()) return;

    // Add User Message
    const newMessages = [
      ...messages,
      {
        sender: 'user',
        text: textToSend,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appContext: activeTab,
        dataInsight: undefined
      }
    ];

    setMessages(newMessages);
    if (!userQueryText) setQuery('');
    setIsAnalyzing(true);

    // Simulate AI Brain cross-app synthesis response
    setTimeout(() => {
      let aiText = '';
      let insightData = undefined;

      if (textToSend.toLowerCase().includes('arr') || textToSend.toLowerCase().includes('q3')) {
        aiText = 'According to real-time Stripe billing & Salesforce closed-won deals: Current Q3 ARR is $3.42M (+18.4% YoY). You are $180k ahead of your Q3 target.';
        insightData = {
          title: 'Q3 Financial Health',
          metric: '$3,420,000 ARR',
          details: 'New Expansion MRR from Enterprise tier (+ $42.5k) offset SMB churn.',
          badge: 'On Track',
          actionText: 'Export Exec Report'
        };
      } else if (textToSend.toLowerCase().includes('churn') || textToSend.toLowerCase().includes('stripe')) {
        aiText = 'Cross-referencing Stripe cancellations with HubSpot customer support logs: 68% of churned accounts cited the lack of SSO SAML integration.';
        insightData = {
          title: 'Churn Cause Correlation',
          metric: '-$14,200 MRR Lost',
          details: 'Root cause identified in HubSpot ticket tags: Missing Okta/SAML SSO feature.',
          badge: 'Action Needed',
          actionText: 'Notify Product Team'
        };
      } else if (textToSend.toLowerCase().includes('salesforce') || textToSend.toLowerCase().includes('blockers')) {
        aiText = 'Analyzing 42 active deal notes in Salesforce CRM: Top 2 sales blockers are: 1) Security Compliance Questionnaire turnarounds (avg 9 days) and 2) Custom SLA pricing approvals.';
        insightData = {
          title: 'Sales Pipeline Bottlenecks',
          metric: '8 Deals Stalled ($410k Pipeline)',
          details: 'Security review delays account for 65% of deal slip in enterprise segment.',
          badge: 'Pipeline Risk',
          actionText: 'Accelerate Security Audits'
        };
      } else {
        aiText = `Analyzing enterprise data across ${activeTab}: I synthesized 1,420 data points. Everything looks aligned with your overall growth trajectory (+14.2% MoM).`;
        insightData = {
          title: 'Cross-App Synthesis Complete',
          metric: '1,420 Events Indexed',
          details: 'Data synced across Stripe, Salesforce, Jira, and Slack with zero latency.',
          badge: 'Synced',
          actionText: 'Deep Dive in Chat'
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          appContext: activeTab,
          dataInsight: insightData
        }
      ]);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Trigger Trigger Button when closed */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-float">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-105 active:scale-95 transition-all border border-cyan-300/30"
          >
            <div className="relative flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            </div>
            <span className="tracking-wide">AI BRAIN OVERLAY</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-black/30 text-[10px] font-mono text-cyan-200 border border-white/10">
              Alt + B
            </span>
          </button>
        </div>
      )}

      {/* Floating Overlay Modal Window */}
      {isOpen && (
        <div 
          className={`fixed right-4 md:right-8 z-50 transition-all duration-300 ${
            isMinimized 
              ? 'bottom-6 w-80 h-16 glass-panel rounded-2xl p-3 border-cyan-500/40 shadow-2xl shadow-cyan-950/80 flex items-center justify-between'
              : 'bottom-6 w-[92vw] sm:w-[480px] h-[580px] max-h-[85vh] glass-panel rounded-2xl border-cyan-500/30 shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide">AI Brain Overlay Engine</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ALWAYS ON TOP
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Database className="w-3 h-3 text-cyan-400" />
                  Synced across 12 Business Apps
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isMinimized ? 'Expand Overlay' : 'Minimize Overlay'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Close Overlay"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Minimized Content Preview */}
          {isMinimized && (
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-xs text-slate-300 font-medium truncate max-w-[180px]">
                Active Overlay on Screen
              </span>
              <button
                onClick={() => setIsMinimized(false)}
                className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                Open <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Full Expanded Window Content */}
          {!isMinimized && (
            <>
              {/* Context Selector Tabs */}
              <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto text-[11px]">
                {['All Apps', 'Stripe', 'Salesforce', 'Hubspot', 'Notion'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Chat Stream Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                      {msg.sender === 'ai' ? (
                        <>
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span className="font-bold text-cyan-300">AI Brain Overlay</span>
                        </>
                      ) : (
                        <span className="font-bold text-purple-300">You (Executive)</span>
                      )}
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Embedded Data Card inside AI Response */}
                      {msg.dataInsight && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                              {msg.dataInsight.title}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {msg.dataInsight.badge}
                            </span>
                          </div>
                          <div className="text-sm font-extrabold text-white">
                            {msg.dataInsight.metric}
                          </div>
                          <p className="text-[11px] text-slate-300">
                            {msg.dataInsight.details}
                          </p>
                          <button className="w-full mt-1 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors">
                            {msg.dataInsight.actionText}
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-cyan-400 text-xs p-3 bg-slate-900/80 rounded-xl border border-slate-800 w-fit animate-pulse">
                    <Brain className="w-4 h-4 animate-spin" />
                    <span>Querying Stripe, Salesforce, & PostgreSQL live endpoints...</span>
                  </div>
                )}
              </div>

              {/* Sample Preset Queries */}
              <div className="px-3 py-2 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto flex items-center gap-1.5 text-[10px]">
                <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Presets:
                </span>
                {sampleQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 whitespace-nowrap transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-900 border-t border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Ask AI Brain about ${activeTab}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
