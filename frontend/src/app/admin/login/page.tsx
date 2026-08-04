'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  Database, 
  Building, 
  UserCheck, 
  Key,
  ChevronRight,
  Globe
} from 'lucide-react';
import { isDatabaseConnected } from '@/lib/supabase';
import { useFounderStore } from '@/hooks/useFounderStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useFounderStore();
  
  const [email, setEmail] = useState('admin@founderos.io');
  const [password, setPassword] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKeyInput, setShowSecretKeyInput] = useState(false);

  const dbConnected = isDatabaseConnected();

  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email || 'admin@founderos.io', password, 'admin');
      setIsLoading(false);
      router.push('/admin');
    }, 600);
  };

  const handleDemoAdminSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('admin@founderos.io', undefined, 'admin');
      setIsLoading(false);
      router.push('/admin');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-purple-600 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-white tracking-tight">FOUNDER OS</span>
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">SaaS Creator Portal</span>
          </div>
        </Link>

        {/* System Database Status Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs shadow-sm">
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-medium text-slate-400 hidden sm:inline">Storage Core:</span>
          <span className={`font-bold font-mono text-[11px] ${dbConnected ? 'text-emerald-400' : 'text-purple-300'}`}>
            {dbConnected ? 'Live Supabase SQL' : 'Local Admin Vault'}
          </span>
        </div>
      </header>

      {/* Main SaaS Creator Login Card */}
      <div className="w-full max-w-md mx-auto p-4 z-10 my-auto">
        <div className="glass-panel p-7 sm:p-8 rounded-3xl border border-purple-500/30 bg-slate-900/90 shadow-2xl space-y-6 relative selection:bg-purple-600 selection:text-white">
          
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-[11px] font-bold text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>SaaS Platform Founder Portal</span>
            </div>

            <h1 className="text-2xl font-extrabold text-white">
              SaaS Creator Access
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign in as the **Founder & Creator** of FounderOS to manage client company accounts, monitor platform MRR/ARR, and inspect system health.
            </p>
          </div>

          {/* 1-Click SaaS Creator Portal Access */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/40 text-center space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-400" />
                SaaS Creator Access
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">1-Click Launch</span>
            </div>
            <p className="text-[11px] text-slate-300 text-left font-medium">
              Bypass login credentials to launch the **SaaS Super Admin Control Center** (`/admin`).
            </p>
            <button
              type="button"
              onClick={handleDemoAdminSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Launching SaaS Admin Portal...</span>
              ) : (
                <>
                  <span>Launch SaaS Creator Control Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 absolute">
              Or Sign In With Admin Credentials
            </span>
          </div>

          {/* Admin Sign In Form */}
          <form onSubmit={handleAdminSignIn} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Creator Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@founderos.io"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Master Password</label>
                <button
                  type="button"
                  onClick={() => setShowSecretKeyInput(!showSecretKeyInput)}
                  className="text-[10px] text-purple-400 hover:underline font-mono"
                >
                  {showSecretKeyInput ? 'Use Password' : 'Use Admin Secret Key'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={showSecretKeyInput ? adminSecretKey : password}
                  onChange={(e) => showSecretKeyInput ? setAdminSecretKey(e.target.value) : setPassword(e.target.value)}
                  placeholder={showSecretKeyInput ? "sk_admin_••••••••••••" : "••••••••••••••••"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating SaaS Creator...' : 'Sign In to SaaS Admin Portal'}</span>
            </button>
          </form>

          {/* Link to Customer Login Route */}
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-purple-300 font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <span>Are you a Customer / Company Owner?</span>
              <span className="text-purple-400 font-bold underline">Go to Customer Login →</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Footer Security Badges */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> SaaS Creator Security Vault</span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-indigo-400" /> Multi-Tenant Isolation</span>
      </footer>

    </div>
  );
}
