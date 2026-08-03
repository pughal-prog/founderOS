'use client';

import React from 'react';
import { Brain, User, ArrowUpRight, Sparkles, CheckCircle2, Mail, Calendar, CreditCard } from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
  onActionClick?: (action: ChatMessage['suggestedAction']) => void;
}

export default function ChatBubble({ message, onActionClick }: ChatBubbleProps) {
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex gap-3 max-w-4xl mx-auto ${isAi ? 'justify-start' : 'justify-end'}`}>
      
      {isAi && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
          <Brain className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="space-y-2 max-w-[85%] sm:max-w-[75%]">
        
        {/* Sender Header */}
        <div className={`flex items-center gap-2 text-[10px] text-slate-400 ${isAi ? 'justify-start' : 'justify-end'}`}>
          <span className="font-bold text-slate-300">
            {isAi ? 'FounderOS Business Intelligence Engine' : 'Alex Vance (Founder)'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Message Bubble Body */}
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
            isAi
              ? 'glass-panel bg-slate-900/90 border-slate-800 text-slate-200 rounded-bl-none shadow-md space-y-3'
              : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none shadow-md'
          }`}
        >
          <div className="whitespace-pre-line">{message.text}</div>

          {/* Actionable Response Card */}
          {message.suggestedAction && (
            <div className="pt-3 border-t border-slate-800/80">
              <button
                onClick={() => onActionClick && onActionClick(message.suggestedAction)}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-between transition-colors shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Suggested Action: {message.suggestedAction.label}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          )}
        </div>

      </div>

      {!isAi && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
          AV
        </div>
      )}

    </div>
  );
}
