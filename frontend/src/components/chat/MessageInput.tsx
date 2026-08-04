'use client';

import React, { useState } from 'react';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-lg shadow-slate-200/50">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="flex-1 relative flex items-center">
          
          {/* Paperclip / Context attachment icon */}
          <button
            type="button"
            className="absolute left-3 p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title="Attach file or context"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
            placeholder="Ask FounderOS anything across Gmail, Slack, Notion, Stripe, HubSpot..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-10 pr-12 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-inner"
          />

          {/* Mic Simulation Button */}
          <button
            type="button"
            className="absolute right-3 p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            title="Voice Input Simulation"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm disabled:opacity-40 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Ask AI</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
