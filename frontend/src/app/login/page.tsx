'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Building, 
  User, 
  Database, 
  CheckCircle2, 
  Key,
  Check
} from 'lucide-react';
import { isDatabaseConnected } from '@/lib/supabase';
import { useFounderStore } from '@/hooks/useFounderStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, createWorkspace, integrations, authenticateConsumerApp } = useFounderStore();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentStep, setCurrentStep] = useState<'credentials' | 'consumer_apps'>('credentials');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Selected consumer apps to authenticate during workspace login
  const [selectedApps, setSelectedApps] = useState<string[]>(['app-gmail', 'app-slack', 'app-stripe', 'app-jira']);

  const dbConnected = isDatabaseConnected();

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (authMode === 'signup') {
        createWorkspace(fullName || 'Founder', company || 'New Startup Inc.', email);
      } else {
        login(email, password);
      }
      setIsLoading(false);
      // Move to Step 2: Consumer App Authentication
      setCurrentStep('consumer_apps');
    }, 500);
  };

  const toggleSelectApp = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const handleFinalizeLogin = () => {
    setIsLoading(true);
    // Auto-authenticate selected consumer apps
    selectedApps.forEach(appId => {
      authenticateConsumerApp(appId, {
        userEmail: email || 'alex@founderos.io',
        userName: fullName || 'Alex Vance'
      });
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('alex@founderos.io');
      setIsLoading(false);
      router.push('/dashboard');
    }, 500);
  };



  return (
    <div className="min-h-screen bg-white text-slate-900 bg-grid-pattern flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">FOUNDER OS</span>
        </Link>

        {/* Database Connection Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs shadow-sm">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-600 font-medium">DB Status:</span>
          {dbConnected ? (
            <span className="text-emerald-700 font-bold font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Supabase DB
            </span>
          ) : (
            <span className="text-blue-700 font-bold font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Mock Engine (Ready for Supabase)
            </span>
          )}
        </div>
      </header>

      {/* Main Dedicated Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 py-12">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6 bg-white relative">
          
          {/* Header & Auth Tabs */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Workspace & Consumer App Auth</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">
              {currentStep === 'consumer_apps'
                ? 'Authenticate Consumer Apps'
                : authMode === 'signin' 
                  ? 'Sign in to Workspace' 
                  : 'Create Founder Workspace'}
            </h1>

            {/* Step Progress Bar */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <span className={`px-2 py-0.5 rounded-full ${currentStep === 'credentials' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}>
                1. Account
              </span>
              <span>→</span>
              <span className={`px-2 py-0.5 rounded-full ${currentStep === 'consumer_apps' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}>
                2. Consumer OAuth
              </span>
            </div>

            {/* Auth Mode Tabs (only on Step 1) */}
            {currentStep === 'credentials' && (
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authMode === 'signin'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Workspace
                </button>
              </div>
            )}
          </div>

          {/* STEP 1: CREDENTIALS FORM */}
          {currentStep === 'credentials' && (
            <>
              {/* 1-Click Executive Demo Access Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 text-center space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-blue-900 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-blue-600 animate-pulse" />
                    Executive Demo Login
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">1-Click Launch</span>
                </div>
                <p className="text-[11px] text-slate-600 text-left font-medium">
                  Bypass credential setup and test FounderOS with pre-populated SaaS business data.
                </p>
                <button
                  onClick={handleDemoSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Loading Dashboard...</span>
                  ) : (
                    <>
                      <span>Launch Live Executive Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
                  Or {authMode === 'signin' ? 'Sign In' : 'Sign Up'} With Email
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleStep1Submit} className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Alex Vance"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Company Name</label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Acme Cloud Inc."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Founder Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@founderos.io"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-[11px] text-blue-600 font-bold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                {authMode === 'signin' && (
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-blue-600 rounded bg-slate-100 border-slate-300"
                      />
                      <span className="text-slate-600 font-medium">Remember Me</span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Authenticating...' : 'Continue to Consumer App Auth →'}
                </button>
              </form>
            </>
          )}

          {/* STEP 2: CONSUMER APPLICATION AUTHENTICATION STEP */}
          {currentStep === 'consumer_apps' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Consumer OAuth 2.0 Pre-Authentication</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Select which SaaS consumer apps to grant workspace OAuth authorization for right away (Jira, Gmail, Slack, Stripe).
                </p>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {integrations.slice(0, 6).map((app) => {
                  const isSelected = selectedApps.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      onClick={() => toggleSelectApp(app.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-blue-50/70 border-blue-400 text-blue-950 font-bold shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm p-1.5 shrink-0">
                          <AppLogo appId={app.id} appName={app.name} className="w-5 h-5 object-contain" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{app.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono">OAuth 2.0 • Scopes Ready</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('credentials')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalizeLogin}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  {isLoading ? 'Launching Workspace...' : 'Authorize & Launch Workspace →'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Reset Founder Password</h3>
            <p className="text-xs text-slate-600">Enter your work email to receive password reset instructions.</p>
            <input
              type="email"
              placeholder="alex@founderos.io"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Password reset link has been dispatched to your email.');
                  setShowForgotModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Security Badges */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Supabase Auth Enabled</span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-blue-600" /> 256-Bit SSL Encryption</span>
      </footer>

    </div>
  );
}
