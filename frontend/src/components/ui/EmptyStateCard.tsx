'use client';

import React from 'react';
import Link from 'next/link';
import { Database, Plus, Search, Sparkles } from 'lucide-react';

interface EmptyStateCardProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  icon?: 'search' | 'database' | 'sparkles';
}

export default function EmptyStateCard({
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  icon = 'database'
}: EmptyStateCardProps) {
  return (
    <div className="p-8 rounded-3xl glass-panel border border-slate-200 bg-white text-center space-y-4 shadow-sm my-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
        {icon === 'search' && <Search className="w-6 h-6" />}
        {icon === 'database' && <Database className="w-6 h-6" />}
        {icon === 'sparkles' && <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />}
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>

      {actionText && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{actionText}</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
