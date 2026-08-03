'use client';

import React, { useState } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';

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
    <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
            placeholder="Ask FounderOS anything across Gmail, Slack, Notion, Stripe..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-4 pr-12 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
          />
          <button
            type="button"
            className="absolute right-3 p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Voice Input Simulation"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className="py-3 px-5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white font-bold text-xs disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 shrink-0"
        >
          <span>Ask AI</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
