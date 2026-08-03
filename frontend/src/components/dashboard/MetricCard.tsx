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
    <div className="glass-panel p-5 rounded-2xl border border-amber-900/15 space-y-3 hover:border-amber-700/40 transition-all hover:translate-y-[-2px] shadow-sm bg-white">
      <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
        <span>{title}</span>
        <div className={`p-2.5 rounded-xl border ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-amber-950 tracking-tight">{value}</span>
        {change && (
          <span className={`text-xs font-bold flex items-center ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      <p className="text-[11px] text-stone-500 font-mono font-medium">{subtitle}</p>
    </div>
  );
}
