'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Send, CheckCircle2, Calendar, Mail, CreditCard, Sparkles, Key, ShieldCheck } from 'lucide-react';
import { useFounderStore } from '@/hooks/useFounderStore';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'email' | 'meeting' | 'invoice' | 'view' | 'connect';
  initialData?: any;
}

export default function ActionModal({ isOpen, onClose, title, type, initialData }: ActionModalProps) {
  const router = useRouter();
  const { connectAppWithToken } = useFounderStore();
  const [emailText, setEmailText] = useState(
    initialData?.notes || 'Hi Sarah,\n\nFollowing up on our recent security questionnaire. Please let me know if you need any additional compliance docs.\n\nBest,\nAlex Vance'
  );
  const [apiKey, setApiKey] = useState(initialData?.apiKey || '');
  const [authToken, setAuthToken] = useState(initialData?.authToken || '');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExecute = () => {
    setIsSending(true);
    setTimeout(() => {
      if (type === 'connect' && initialData?.appId) {
        connectAppWithToken(initialData.appId, authToken || `oauth_token_${Date.now()}`, apiKey);
      }
      setIsSending(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (type === 'view') {
          router.push('/dashboard');
        }
      }, 1000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/80 space-y-5 bg-slate-900/95 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body depending on Type */}
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Action Completed Successfully!</h4>
            <p className="text-xs text-slate-400">Synced across Gmail, Stripe, & HubSpot endpoints.</p>
          </div>
        ) : (
          <>
            {type === 'connect' && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>OAuth 2.0 & API Token Setup</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Configure read-only API sync credentials for {initialData?.appName || 'this integration'}.
                  </p>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">API Key / Access Secret</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk_live_••••••••••••••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold mb-1 block">OAuth Token (Optional / Auto-Generated)</label>
                  <input
                    type="text"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    placeholder="bearer_token_••••••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            )}

            {type === 'email' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">To:</label>
                  <input
                    type="text"
                    defaultValue={initialData?.email || 'sarah@acme.com'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Subject:</label>
                  <input
                    type="text"
                    defaultValue="Follow-up: Security Questionnaire & Enterprise Plan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Message Body:</label>
                  <textarea
                    rows={5}
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {type === 'invoice' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between font-bold text-white">
                    <span>Invoice INV-2026-001 (Apex Cloud)</span>
                    <span className="text-red-400">₹5,600 Overdue</span>
                  </div>
                  <p className="text-slate-400">14 days past due date. Payment failed twice in Stripe billing portal.</p>
                </div>
                <p className="text-slate-300">
                  Trigger automated Stripe dunning workflow to re-verify customer credit card and dispatch SMS/email payment link.
                </p>
              </div>
            )}

            {type === 'meeting' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-cyan-400 font-mono font-bold block">10:00 AM - Today</span>
                  <h4 className="text-sm font-bold text-white">Series A Investor Catchup</h4>
                  <p className="text-slate-400">Alex Vance (Sequoia Capital)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
                  <span className="font-bold text-white block">AI Prep Briefing:</span>
                  <p>Q3 ARR is +18.4% ahead of targets. Enterprise expansion MRR generated ₹42k in new recurring revenue.</p>
                </div>
              </div>
            )}

            {type === 'view' && (
              <div className="space-y-3 text-xs text-slate-300">
                <p>FounderOS has synthesized 14,250 real-time events across your 9 connected SaaS tools.</p>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Stripe ARR</span>
                    <span className="text-cyan-400 font-bold text-sm">₹34,20,000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Net Churn</span>
                    <span className="text-emerald-400 font-bold text-sm">1.2%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleExecute}
                disabled={isSending}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                {isSending ? (
                  <span>Executing Action...</span>
                ) : (
                  <>
                    <span>Confirm Action</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

