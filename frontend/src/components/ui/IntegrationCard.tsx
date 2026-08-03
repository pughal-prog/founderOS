'use client';

import React, { useState } from 'react';
import { IntegrationApp } from '@/types';
import { triggerOAuthFlow } from '@/services/oauthService';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  AlertTriangle,
  Lock
} from 'lucide-react';

interface IntegrationCardProps {
  app: IntegrationApp;
  onToggle: (id: string) => void;
}

export default function IntegrationCard({ app, onToggle }: IntegrationCardProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleConnectOAuth = async () => {
    setIsAuthenticating(true);
    await triggerOAuthFlow(app.id);
    setIsAuthenticating(false);
    onToggle(app.id);
  };

  const handleConfirmDisconnect = () => {
    onToggle(app.id);
    setShowDisconnectConfirm(false);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all shadow-sm hover:shadow-md">
      
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-lg text-slate-800 shadow-inner">
              {app.iconName || app.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{app.name}</h3>
              <span className="text-[10px] font-medium text-slate-500">{app.category}</span>
            </div>
          </div>

          {/* Connection Status Pill */}
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
            app.connected 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${app.connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {app.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {app.description}
        </p>
      </div>

      {/* Sync Status & Action Control */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>OAuth 2.0 • Scopes Active</span>
        </div>

        {app.connected ? (
          <button
            type="button"
            onClick={() => setShowDisconnectConfirm(true)}
            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnectOAuth}
            disabled={isAuthenticating}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            {isAuthenticating ? (
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <span>Connect OAuth</span>
            )}
          </button>
        )}
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
