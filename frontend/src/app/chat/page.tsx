'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ChatBubble from '@/components/chat/ChatBubble';
import MessageInput from '@/components/chat/MessageInput';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import { processFounderQuery } from '@/services/aiService';
import { ChatMessage } from '@/types';
import { 
  Brain, 
  Sparkles, 
  MessageSquareText, 
  PlusCircle, 
  Download, 
  Layers, 
  Zap, 
  Clock, 
  Bot 
} from 'lucide-react';

export default function AIChatPage() {
  const [activeThread, setActiveThread] = useState('Unreplied Customers & Risk Audit');
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Hello Founder. I am FounderOS, your SaaS business intelligence assistant. Ask me anything across Gmail, Slack, Notion, Stripe, HubSpot, & Google Calendar.',
      timestamp: '09:00 AM',
      suggestedAction: {
        label: 'Audit High-Risk Accounts',
        actionType: 'view'
      }
    }
  ]);

  const pastThreads = [
    'Unreplied Customers & Risk Audit',
    'Tomorrow\'s Calendar Prep',
    'Overdue Stripe Invoices',
    'MRR Breakdown by Segment'
  ];

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim()) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // 2. Query AI Intelligence Engine
    const aiResponse = await processFounderQuery(queryText);

    // Simulate streaming delay
    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
      setIsStreaming(false);
    }, 800);
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    if (action.actionType === 'email') {
      alert(`Drafting follow-up email to Acme Inc. (sarah@acme.com)...`);
    } else if (action.actionType === 'meeting') {
      window.open('https://meet.google.com', '_blank');
    } else if (action.actionType === 'invoice') {
      alert(`Sending automated invoice reminder via Stripe API...`);
    } else {
      alert(`Navigating to detailed dashboard breakdown.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Chat Main Interface */}
        <main className="flex-1 flex flex-col justify-between bg-slate-950/40 relative overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-sm">
                <Brain className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">{activeThread}</span>
                <span className="text-[10px] text-emerald-400 font-mono">Cross-Tool Index Active</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages([{
                  id: Date.now().toString(),
                  sender: 'ai',
                  text: 'New FounderOS session started. What business question would you like to ask?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }])}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Session</span>
              </button>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onActionClick={handleActionClick}
              />
            ))}

            {isStreaming && (
              <div className="flex items-center gap-3 max-w-4xl mx-auto text-cyan-400 text-xs p-4 glass-panel rounded-2xl border-cyan-500/30 bg-slate-900/90 animate-pulse">
                <Brain className="w-5 h-5 animate-spin text-cyan-400" />
                <span>FounderOS is indexing Gmail, Slack, Notion, Stripe, & Google Calendar data...</span>
              </div>
            )}
          </div>

          {/* Suggested Prompts Bar */}
          <SuggestedPrompts onSelectPrompt={handleSendMessage} />

          {/* Input Form */}
          <MessageInput onSend={handleSendMessage} disabled={isStreaming} />

        </main>
      </div>

      {/* Floating AI Brain Overlay Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
