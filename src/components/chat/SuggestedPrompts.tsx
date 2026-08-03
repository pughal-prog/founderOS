'use client';

import React from 'react';
import { Zap, ChevronRight } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function SuggestedPrompts({ onSelectPrompt }: SuggestedPromptsProps) {
  const prompts = [
    { title: 'Unreplied Customers', query: "Which customers haven't replied?" },
    { title: "Tomorrow's Schedule", query: 'What meetings do I have tomorrow?' },
    { title: 'Deals at Risk', query: 'Which deals are at risk?' },
    { title: 'Overdue Invoices', query: 'Show overdue invoices.' },
  ];

  return (
    <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs shrink-0">
      <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1 text-[11px]">
        <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
      </span>
      {prompts.map((p, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(p.query)}
          className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          <span>{p.title}</span>
          <ChevronRight className="w-3 h-3 text-cyan-400" />
        </button>
      ))}
    </div>
  );
}
