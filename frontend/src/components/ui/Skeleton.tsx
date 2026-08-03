'use client';

import React from 'react';

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3 animate-pulse ${className}`}>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="w-8 h-8 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-8 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-200 rounded w-2/3" />
    </div>
  );
}

export default SkeletonCard;
