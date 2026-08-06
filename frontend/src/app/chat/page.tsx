'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ChatBubble from '@/components/chat/ChatBubble';
import MessageInput from '@/components/chat/MessageInput';
import SuggestedPrompts from '@/components/chat/SuggestedPrompts';
import ActionModal from '@/components/ui/ActionModal';
import BrainOverlayWidget from '@/components/BrainOverlayWidget';
import { processFounderQuery } from '@/services/aiService';
import { ChatMessage } from '@/types';
import { 
  Brain, 
  Sparkles, 
  PlusCircle, 
  Filter,
  Bot,
  Zap,
  CheckCircle2,
  Database
} from 'lucide-react';

export default function AIChatPage() {
  const router = useRouter();
  const [activeThread, setActiveThread] = useState('Unreplied Customers & Risk Audit');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedContext, setSelectedContext] = useState('All 9 Connected SaaS Tools');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Action Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'email' | 'meeting' | 'invoice' | 'view'>('email');

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

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

    // Simulate streaming delay for realistic experience
    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
      setIsStreaming(false);
    }, 600);
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    if (action.actionType === 'view') {
      router.push('/dashboard');
      return;
    }
    setModalTitle(action.label);
    setModalType(action.actionType || 'view');
    setModalOpen(true);
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Chat Main Interface */}
        <main className="flex-1 flex flex-col justify-between bg-slate-50/40 relative overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-4 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between text-xs z-10 shrink-0 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white">
                <Brain className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">{activeThread}</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cross-Tool Index Active
                </span>
              </div>
            </div>

            {/* Context Dropdown & New Session */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-semibold hover:border-blue-300 transition-colors">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <select
                  value={selectedContext}
                  onChange={(e) => setSelectedContext(e.target.value)}
                  className="bg-transparent text-blue-800 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="All 9 Connected SaaS Tools" className="bg-white text-slate-900">All 9 Connected SaaS Tools</option>
                  <option value="Stripe Billing Only" className="bg-white text-slate-900">Stripe Billing Only</option>
                  <option value="HubSpot CRM Only" className="bg-white text-slate-900">HubSpot CRM Only</option>
                  <option value="Gmail Inbox Feed" className="bg-white text-slate-900">Gmail Inbox Feed</option>
                </select>
              </div>

              <button
                onClick={() => setMessages([{
                  id: Date.now().toString(),
                  sender: 'ai',
                  text: 'New FounderOS session started. What business question would you like to ask?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }])}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200 shadow-2xs hover:shadow-xs active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>New Session</span>
              </button>
            </div>
          </div>

          {/* Chat Stream Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-grid-pattern/30">
            
            {messages.length === 0 ? (
              <div className="max-w-md mx-auto my-12 text-center p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Ask FounderOS Intelligence</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Query customer status, revenue telemetry, overdue invoices, or calendar meetings across all connected SaaS platforms.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  onActionClick={handleActionClick}
                />
              ))
            )}

            {/* AI Streaming Thinking Card */}
            {isStreaming && (
              <div className="flex items-center gap-3 max-w-4xl mx-auto text-blue-900 text-xs p-4 rounded-2xl border border-blue-200/80 bg-white/95 backdrop-blur-md shadow-sm font-semibold animate-pulse">
                <Brain className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-slate-700 text-xs font-bold mb-1">
                    <span>FounderOS Engine Synthesizing Answer...</span>
                    <span className="text-[10px] text-blue-600 font-mono">Index Querying</span>
                  </div>
                  <div className="w-full bg-blue-50 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-2/3 animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Bar */}
          <SuggestedPrompts onSelectPrompt={handleSendMessage} />

          {/* Input Form */}
          <MessageInput onSend={handleSendMessage} disabled={isStreaming} />

        </main>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        type={modalType}
      />

      {/* Floating AI Brain Overlay Widget */}
      <BrainOverlayWidget />

    </div>
  );
}
