'use client';

import React, { useState } from 'react';
import { IntegrationApp } from '@/types';
import AppLogo from '@/components/ui/AppLogo';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Key, 
  AlertTriangle,
  Lock
} from 'lucide-react';

interface IntegrationCardProps {
  app: IntegrationApp;
  onOpenAuthModal: (app: IntegrationApp) => void;
  onToggle: (id: string) => void;
}

export default function IntegrationCard({ app, onOpenAuthModal, onToggle }: IntegrationCardProps) {
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleConfirmDisconnect = () => {
    onToggle(app.id);
    setShowDisconnectConfirm(false);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all shadow-sm hover:shadow-md relative overflow-hidden">
      
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm p-2 shrink-0">
              <AppLogo appId={app.id} appName={app.name} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{app.name}</h3>
              <span className="text-[10px] font-medium text-slate-500">{app.category}</span>
            </div>
          </div>

          {/* Connection Status Pill */}
          <button
            type="button"
            onClick={() => onOpenAuthModal(app)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 transition-all ${
              app.connected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${app.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {app.connected ? 'OAuth Authorized' : 'Connect Consumer'}
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {app.description}
        </p>

        {/* Connected Consumer User Account Identity */}
        {app.connected && app.connectedUser && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span className="font-semibold truncate">Connected: <strong className="text-slate-900">{app.connectedUser.email}</strong></span>
            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
              OAuth 2.0
            </span>
          </div>
        )}
      </div>

      {/* Sync Status & Action Control */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => onOpenAuthModal(app)}
          className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 text-[11px] font-bold"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Config & Scopes</span>
        </button>

        <div className="flex items-center gap-2">
          {app.connected ? (
            <button
              type="button"
              onClick={() => setShowDisconnectConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition-colors text-xs"
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuthModal(app)}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all shadow-md flex items-center gap-1 text-xs"
            >
              <Key className="w-3 h-3" />
              <span>Authenticate</span>
            </button>
          )}
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-2xl">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-extrabold text-slate-900">Disconnect {app.name}?</h4>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              FounderOS will stop indexing live telemetry events from {app.name}. You can reconnect at any time.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDisconnectConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisconnect}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
              >
                Confirm Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
