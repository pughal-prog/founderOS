'use client';

import React, { useState } from 'react';
import { 
  Brain, 
  ArrowUpRight, 
  Sparkles, 
  Mail, 
  Calendar, 
  CreditCard, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
  onActionClick?: (action: ChatMessage['suggestedAction']) => void;
}

// Helper function to render text with bold tags (**text**) and currency formatting ($XX,XXX)
function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-slate-800 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) return <div key={lineIdx} className="h-1" />;

        const isBullet = line.trim().startsWith('•');
        const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

        // Parse **bold** parts
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

        const renderedLine = (
          <span>
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                const boldContent = part.slice(2, -2);
                
                // Highlight MRR / Money specially
                if (boldContent.includes('$') || boldContent.includes('/mo MRR')) {
                  return (
                    <span 
                      key={partIdx} 
                      className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 shadow-2xs font-mono"
                    >
                      {boldContent}
                    </span>
                  );
                }

                return (
                  <span 
                    key={partIdx} 
                    className="font-bold text-slate-900 bg-slate-100/90 border border-slate-200/80 px-1.5 py-0.5 rounded-md shadow-2xs"
                  >
                    {boldContent}
                  </span>
                );
              }

              // Highlight currency tokens even without bolding
              return part;
            })}
          </span>
        );

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-1 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2 shadow-xs" />
              <div className="flex-1">{renderedLine}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{renderedLine}</p>;
      })}
    </div>
  );
}

export default function ChatBubble({ message, onActionClick }: ChatBubbleProps) {
  const isAi = message.sender === 'ai';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'invoice':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className={`flex gap-3 max-w-4xl mx-auto ${isAi ? 'justify-start' : 'justify-end'} group`}>
      
      {/* AI Avatar */}
      {isAi && (
        <div className="relative shrink-0 self-start">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20 ring-2 ring-white">
            <Brain className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Active Engine" />
        </div>
      )}

      <div className={`space-y-1.5 ${isAi ? 'max-w-[90%] sm:max-w-[82%]' : 'max-w-[85%] sm:max-w-[75%]'}`}>
        
        {/* Sender Header */}
        <div className={`flex items-center gap-2 text-[11px] font-medium text-slate-500 px-1 ${isAi ? 'justify-start' : 'justify-end'}`}>
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            {isAi ? (
              <>
                <span>FounderOS Intelligence Engine</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-blue-50 border border-blue-200/60 text-[9px] text-blue-700 font-semibold">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              </>
            ) : (
              'Alex Vance (Founder)'
            )}
          </span>
          <span>•</span>
          <span className="text-slate-400 font-mono text-[10px]">{message.timestamp}</span>
        </div>

        {/* Message Bubble Body */}
        <div
          className={`p-4 sm:p-5 rounded-2xl ${
            isAi
              ? 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs shadow-sm hover:shadow-md transition-all space-y-4'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-tr-xs shadow-md shadow-blue-600/15'
          }`}
        >
          {isAi ? (
            <FormattedText text={message.text} />
          ) : (
            <p className="whitespace-pre-line text-xs sm:text-sm font-medium leading-relaxed">{message.text}</p>
          )}

          {/* Actionable Response Card */}
          {isAi && message.suggestedAction && (
            <div className="pt-3 border-t border-slate-100">
              <div 
                onClick={() => onActionClick && onActionClick(message.suggestedAction)}
                className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/90 border border-blue-200/80 hover:border-blue-400 flex items-center justify-between gap-3 group/action cursor-pointer transition-all shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-blue-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover/action:scale-105 transition-transform">
                    {getActionIcon(message.suggestedAction.actionType)}
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-blue-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-600" /> Suggested Action
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {message.suggestedAction.label}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0 transition-all group-hover/action:translate-x-0.5"
                >
                  <span>Execute</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Action Toolbar (Copy, Like, Dislike, Regenerate) */}
        {isAi && (
          <div className="flex items-center gap-1 text-slate-400 px-1 pt-0.5 text-xs opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-700 transition-colors flex items-center gap-1 text-[11px]"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium text-[10px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>

            <span className="text-slate-300">•</span>

            <button
              onClick={() => setLiked(liked === true ? null : true)}
              className={`p-1 rounded-md hover:bg-slate-100 transition-colors ${
                liked === true ? 'text-blue-600' : 'hover:text-slate-700'
              }`}
              title="Good response"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setLiked(liked === false ? null : false)}
              className={`p-1 rounded-md hover:bg-slate-100 transition-colors ${
                liked === false ? 'text-red-600' : 'hover:text-slate-700'
              }`}
              title="Bad response"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* User Avatar */}
      {!isAi && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md ring-2 ring-white self-start">
          AV
        </div>
      )}

    </div>
  );
}
