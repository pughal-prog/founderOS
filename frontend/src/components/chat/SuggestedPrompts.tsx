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
    <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-200/80 overflow-x-auto flex items-center gap-2 text-xs shrink-0 backdrop-blur-sm">
      <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Presets:
      </span>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p.query)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50/80 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-semibold whitespace-nowrap transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{p.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
