'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
}

export default function MetricCard({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  iconColor
}: MetricCardProps) {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all hover:translate-y-[-2px] shadow-lg bg-slate-900/80">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>{title}</span>
        <div className={`p-2.5 rounded-xl border ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-white tracking-tight">{value}</span>
        {change && (
          <span className={`text-xs font-bold flex items-center ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400 font-mono">{subtitle}</p>
    </div>
  );
}
