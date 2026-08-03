'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  MessageSquareText, 
  PlusCircle, 
  Download, 
  Layers, 
  Zap, 
  Clock, 
  Bot,
  Filter
} from 'lucide-react';

export default function AIChatPage() {
  const [activeThread, setActiveThread] = useState('Unreplied Customers & Risk Audit');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedContext, setSelectedContext] = useState('All 9 Connected SaaS Tools');
  
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
    }, 700);
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;
    setModalTitle(action.label);
    setModalType(action.actionType || 'view');
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Chat Main Interface */}
        <main className="flex-1 flex flex-col justify-between bg-white relative overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between text-xs z-10 shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <Brain className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">{activeThread}</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">Cross-Tool Index Active</span>
              </div>
            </div>

            {/* Context Dropdown & New Session */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <select
                  value={selectedContext}
                  onChange={(e) => setSelectedContext(e.target.value)}
                  className="bg-transparent text-blue-700 font-bold focus:outline-none cursor-pointer text-xs"
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
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>New Session</span>
              </button>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                onActionClick={handleActionClick}
              />
            ))}

            {isStreaming && (
              <div className="flex items-center gap-3 max-w-4xl mx-auto text-blue-700 text-xs p-4 glass-panel rounded-2xl border-slate-200 bg-white animate-pulse shadow-sm font-semibold">
                <Brain className="w-5 h-5 animate-spin text-blue-600" />
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
