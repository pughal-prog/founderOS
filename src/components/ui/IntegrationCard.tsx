'use client';

import React from 'react';
import { 
  Mail, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Users, 
  CreditCard, 
  Code, 
  CheckSquare, 
  Layers, 
  CheckCircle2, 
  RefreshCcw, 
  Link2Off,
  Database
} from 'lucide-react';
import { IntegrationApp } from '../../types';

interface IntegrationCardProps {
  app: IntegrationApp;
  onToggle: (id: string) => void;
}

export default function IntegrationCard({ app, onToggle }: IntegrationCardProps) {
  // Map icon names to Lucide components
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail': return <Mail className="w-5 h-5 text-red-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-purple-400" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-cyan-400" />;
      case 'Users': return <Users className="w-5 h-5 text-orange-400" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-indigo-400" />;
      case 'Code': return <Code className="w-5 h-5 text-pink-400" />;
      case 'CheckSquare': return <CheckSquare className="w-5 h-5 text-sky-400" />;
      default: return <Layers className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all bg-slate-900/80 shadow-md group">
      
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
          {renderIcon(app.iconName)}
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1.5 border ${
          app.connected 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          {app.connected ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span>Disconnected</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
          {app.category}
        </span>
        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
          {app.name}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
          {app.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-500">
          Last Synced: <strong className="text-slate-300">{app.lastSynced}</strong>
        </span>

        <button
          onClick={() => onToggle(app.id)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            app.connected
              ? 'bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/40'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20 hover:scale-105'
          }`}
        >
          {app.connected ? 'Disconnect' : 'Connect Tool'}
        </button>
      </div>

    </div>
  );
}
