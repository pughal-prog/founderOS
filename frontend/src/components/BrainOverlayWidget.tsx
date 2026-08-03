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

    const newMessages: OverlayMessage[] = [
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
      } else {
        aiText = `Analyzing enterprise data across ${activeTab}: Everything looks aligned with overall growth trajectory (+14.2% MoM).`;
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
    }, 800);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-float">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white font-extrabold text-xs shadow-2xl shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all border border-amber-500/30"
          >
            <div className="relative flex items-center justify-center">
              <Brain className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            </div>
            <span className="tracking-wide">FOUNDER OS OVERLAY</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono text-amber-200 border border-white/10">
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
              ? 'bottom-6 w-80 h-16 glass-panel rounded-2xl p-3 border-amber-900/30 shadow-2xl flex items-center justify-between bg-white'
              : 'bottom-6 w-[92vw] sm:w-[480px] h-[580px] max-h-[85vh] glass-panel rounded-2xl border-amber-900/20 shadow-2xl flex flex-col overflow-hidden bg-white'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 border-b border-amber-900/15 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-900 to-amber-700 flex items-center justify-center shadow-sm">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-950 tracking-wide">FounderOS Overlay Engine</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                    ALWAYS ON TOP
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-medium">Synced across 9 Business Apps</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-amber-950 hover:bg-amber-100/60 transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context Selector Tabs */}
              <div className="flex items-center gap-1 p-2 bg-stone-100/70 border-b border-stone-200 overflow-x-auto text-[11px]">
                {['All Apps', 'Stripe', 'Salesforce', 'Hubspot', 'Notion'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'bg-amber-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-amber-950 hover:bg-stone-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Chat Stream Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-stone-50/50">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-stone-500">
                      {msg.sender === 'ai' ? (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-700" />
                          <span className="font-bold text-amber-950">FounderOS</span>
                        </>
                      ) : (
                        <span className="font-bold text-amber-900">You (Executive)</span>
                      )}
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-amber-900 to-amber-800 text-white rounded-br-none shadow-md font-medium'
                          : 'bg-white border border-stone-200 text-stone-900 rounded-bl-none shadow-sm font-medium'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.dataInsight && (
                        <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-900/20 text-left space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-950 uppercase tracking-wider">
                              {msg.dataInsight.title}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 border border-amber-400 font-bold">
                              {msg.dataInsight.badge}
                            </span>
                          </div>
                          <div className="text-sm font-extrabold text-amber-950">
                            {msg.dataInsight.metric}
                          </div>
                          <p className="text-[11px] text-stone-600">
                            {msg.dataInsight.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-stone-200">
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
                    className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className="p-2 rounded-xl bg-gradient-to-tr from-amber-900 to-amber-800 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md"
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
