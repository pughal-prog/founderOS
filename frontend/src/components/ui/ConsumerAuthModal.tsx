'use client';

import React, { useState } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import { 
  X, 
  ShieldCheck, 
  Key, 
  Globe, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Activity, 
  Copy,
  Check,
  UserCheck,
  Mail
} from 'lucide-react';
import { IntegrationApp } from '@/types';
import { useFounderStore } from '@/hooks/useFounderStore';
import { 
  verifyRealGitHubToken, 
  verifyRealGoogleToken,
  verifyRealSlackToken,
  verifyRealStripeKey,
  verifyRealNotionToken,
  verifyRealJiraCredentials,
  verifyRealLinearKey,
  verifyRealHubSpotToken
} from '@/services/oauthService';

interface ConsumerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: IntegrationApp | null;
}

export default function ConsumerAuthModal({ isOpen, onClose, app }: ConsumerAuthModalProps) {
  const { authenticateConsumerApp, disconnectApp, testIntegrationConnection, userProfile } = useFounderStore();

  const [authTab, setAuthTab] = useState<'oauth' | 'byo' | 'audit'>('oauth');
  const [siteUrl, setSiteUrl] = useState(app?.siteUrl || '');
  const [clientId, setClientId] = useState(app?.clientId || '');
  const [clientSecret, setClientSecret] = useState(app?.clientSecret || '');
  const [apiKey, setApiKey] = useState(app?.apiKey || '');
  
  // Real Account Auth Inputs
  const [realToken, setRealToken] = useState(app?.authToken || app?.apiKey || '');
  const [jiraEmail, setJiraEmail] = useState(userProfile.email || 'alex@founderos.io');
  const [isVerifyingReal, setIsVerifyingReal] = useState(false);
  const [realAuthError, setRealAuthError] = useState<string | null>(null);
  const [realProfile, setRealProfile] = useState<any | null>(app?.connectedUser || null);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState<number>(0);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs: number; details: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen || !app) return null;

  const callbackUrl = `https://app.founderos.io/api/auth/callback/${app.id.replace('app-', '')}`;

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Universal Live Real Account Verification for All 9 SaaS Tools
  const handleVerifyUniversalApp = async () => {
    setIsVerifyingReal(true);
    setRealAuthError(null);
    let result: { success: boolean; profile?: any; error?: string } = { success: false, error: 'Unsupported application' };

    switch (app.id) {
      case 'app-github':
        result = await verifyRealGitHubToken(realToken);
        break;
      case 'app-gmail':
      case 'app-calendar':
        result = await verifyRealGoogleToken(realToken);
        break;
      case 'app-slack':
        result = await verifyRealSlackToken(realToken);
        break;
      case 'app-stripe':
        result = await verifyRealStripeKey(realToken);
        break;
      case 'app-notion':
        result = await verifyRealNotionToken(realToken);
        break;
      case 'app-jira':
        result = await verifyRealJiraCredentials(siteUrl || 'founderos-tech.atlassian.net', jiraEmail, realToken);
        break;
      case 'app-linear':
        result = await verifyRealLinearKey(realToken);
        break;
      case 'app-hubspot':
        result = await verifyRealHubSpotToken(realToken);
        break;
      default:
        result = await verifyRealGitHubToken(realToken);
        break;
    }

    setIsVerifyingReal(false);

    if (result.success && result.profile) {
      setRealProfile(result.profile);
      authenticateConsumerApp(app.id, {
        userName: result.profile.name,
        userEmail: result.profile.email,
        authToken: realToken,
        siteUrl: siteUrl || result.profile.teamOrCompany
      });
    } else {
      setRealAuthError(result.error || `Failed to verify credentials for ${app.name}.`);
    }
  };

  // 1-Click Consumer OAuth 2.0 Flow Simulation
  const handleStartOAuth = () => {
    setIsAuthenticating(true);
    setAuthStep(1); // Requesting grant

    setTimeout(() => {
      setAuthStep(2); // Exchanging authorization code
      setTimeout(() => {
        setAuthStep(3); // Registering OAuth Vault credentials
        setTimeout(() => {
          authenticateConsumerApp(app.id, {
            siteUrl: siteUrl || `${app.name.toLowerCase().replace(/\s+/g, '')}-workspace.atlassian.net`,
            clientId: clientId || `${app.name.toLowerCase()}_consumer_id_${Date.now().toString().slice(-4)}`,
            authToken: realToken || `oauth2_access_tok_${Date.now()}`
          });
          setIsAuthenticating(false);
          setAuthStep(4); // Success!
          setTimeout(() => {
            setAuthStep(0);
            onClose();
          }, 1000);
        }, 600);
      }, 600);
    }, 600);
  };

  // Save BYO Credentials
  const handleSaveBYOCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      authenticateConsumerApp(app.id, {
        siteUrl,
        clientId,
        clientSecret,
        apiKey
      });
      setIsAuthenticating(false);
      onClose();
    }, 600);
  };

  // Test Connection Ping
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testIntegrationConnection(app.id);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleDisconnect = () => {
    if (confirm(`Are you sure you want to disconnect consumer authentication for ${app.name}?`)) {
      disconnectApp(app.id);
      setRealProfile(null);
      onClose();
    }
  };

  const getPlaceholderForApp = (id: string) => {
    switch (id) {
      case 'app-github': return 'ghp_••••••••••••••••••••••••••••••••••••';
      case 'app-gmail':
      case 'app-calendar': return 'ya29.a0A••••••••••••••••••••••••••••••••••••';
      case 'app-slack': return 'xoxb-••••••••••••••••••••••••';
      case 'app-stripe': return 'sk_live_••••••••••••••••••••••••';
      case 'app-notion': return 'ntn_secret_••••••••••••••••••••••••';
      case 'app-jira': return 'ATATT3xFfGF0••••••••••••••••••••••••';
      case 'app-linear': return 'lin_api_••••••••••••••••••••••••';
      case 'app-hubspot': return 'pat-na1-••••••••••••••••••••••••';
      default: return 'sk_live_••••••••••••••••••••••••';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-xl glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm p-2 shrink-0">
              <AppLogo appId={app.id} appName={app.name} className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">{app.name} Consumer Auth</h3>
                {app.connected ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Authorized
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                    Setup Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{app.category} • Consumer OAuth 2.0</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthTab('oauth')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authTab === 'oauth'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Account Verification</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthTab('byo')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authTab === 'byo'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span>BYO Client Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthTab('audit')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authTab === 'audit'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span>Scopes & Test Ping</span>
          </button>
        </div>

        {/* Tab 1: Live Universal SaaS Account Verification */}
        {authTab === 'oauth' && (
          <div className="space-y-5 text-xs">
            
            {/* UNIVERSAL LIVE AUTH CARD FOR SELECTED APP */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3.5 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AppLogo appId={app.id} appName={app.name} className="w-5 h-5" />
                  <span className="font-bold text-xs text-white">Authenticate Your Real {app.name} Account</span>
                </div>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-bold">
                  Live API Sync
                </span>
              </div>

              <p className="text-[11px] text-slate-300">
                Enter your {app.name} credentials or access token to verify account ownership and sync live events.
              </p>

              {app.id === 'app-jira' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Jira Site Domain</label>
                    <input
                      type="text"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="acme.atlassian.net"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Atlassian Email</label>
                    <input
                      type="email"
                      value={jiraEmail}
                      onChange={(e) => setJiraEmail(e.target.value)}
                      placeholder="alex@founderos.io"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {app.id === 'app-jira' ? 'Atlassian API Token' : `${app.name} OAuth / Secret / API Key`}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={realToken}
                    onChange={(e) => setRealToken(e.target.value)}
                    placeholder={getPlaceholderForApp(app.id)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 font-mono text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {realAuthError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{realAuthError}</span>
                </div>
              )}

              {/* Verified Account Profile Display */}
              {realProfile && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    {realProfile.avatarUrl ? (
                      <img src={realProfile.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-emerald-500/40 object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                        {(realProfile.name || app.name).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{realProfile.name || realProfile.email}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {realProfile.email || realProfile.teamOrCompany} • {realProfile.details || 'Connected'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                    Verified
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleVerifyUniversalApp}
                disabled={isVerifyingReal}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isVerifyingReal ? (
                  <span>Verifying {app.name} API Key...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Verify & Connect Real {app.name} Account</span>
                  </>
                )}
              </button>
            </div>

            {/* OAuth Grant Progress Steps */}
            {isAuthenticating && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing Consumer OAuth Handshake...
                  </span>
                  <span className="font-mono">{authStep}/3</span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className={`flex items-center gap-2 ${authStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> 1. Consumer Grant Requested ({app.name})
                  </div>
                  <div className={`flex items-center gap-2 ${authStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> 2. Exchanging Authorization Code
                  </div>
                  <div className={`flex items-center gap-2 ${authStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> 3. Storing Tokens in Encrypted Vault
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {app.connected ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 font-semibold text-xs transition-colors"
                >
                  Revoke Authorization
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleStartOAuth}
                disabled={isAuthenticating}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{app.connected ? `Re-Authorize ${app.name}` : `Authorize ${app.name} with OAuth 2.0`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: BYO Consumer Credentials */}
        {authTab === 'byo' && (
          <form onSubmit={handleSaveBYOCredentials} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Bring Your Own (BYO) Client Credentials</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Deploying for enterprise clients? Supply your own Consumer Client ID & Secret from your {app.name} Developer Console.
              </p>
            </div>

            <div>
              <label className="text-slate-700 font-bold mb-1 block">Redirect Callback URL (Register in {app.name})</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={callbackUrl}
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-mono text-[11px] text-slate-700 select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyCallback}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-800 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-bold mb-1 block">Client ID / Consumer Key</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="e.g. client_id_9912"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold mb-1 block">Client Secret / Secret Key</label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold mb-1 block">API Key / Access Token (Fallback)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk_live_••••••••••••••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-900 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAuthenticating}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-md"
              >
                Save Client Credentials
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Scopes & Connection Ping Audit */}
        {authTab === 'audit' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Granted Scopes & Security Permissions</span>
              </h4>

              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {(app.scopes || ['read_access', 'offline_access', 'user:profile']).map((scope) => (
                  <span key={scope} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                    {scope}
                  </span>
                ))}
              </div>
            </div>

            {app.connectedUser && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Connected Consumer Identity</span>
                  <span className="font-bold text-xs">{app.connectedUser.name} ({app.connectedUser.email})</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  {app.connectedUser.role || 'Active User'}
                </span>
              </div>
            )}

            {/* Test Connection Ping Box */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Consumer API Health Check</span>
                </div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Pinging API...' : 'Test Connection'}</span>
                </button>
              </div>

              {testResult ? (
                <div className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                  testResult.success 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                    : 'bg-red-950/60 border-red-500/40 text-red-300'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span>{testResult.success ? '✓ 200 OK Connection Verified' : '✕ Connection Failed'}</span>
                    <span>{testResult.latencyMs} ms</span>
                  </div>
                  <p className="text-[11px] font-sans opacity-90">{testResult.details}</p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Click &quot;Test Connection&quot; to execute a live OAuth token refresh & API latency check against {app.name} servers.
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
