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
  Globe,
  RefreshCw
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
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-grid-pattern flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Ambient Blue Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-slate-900 tracking-tight">FOUNDER OS</span>
            <span className="text-[10px] font-mono text-purple-700 font-bold uppercase tracking-widest">SaaS Creator Portal</span>
          </div>
        </Link>

        {/* System Database Status Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs shadow-sm">
          <Database className="w-3.5 h-3.5 text-purple-600" />
          <span className="font-medium text-slate-600 hidden sm:inline">Storage Core:</span>
          <span className={`font-bold font-mono text-[11px] ${dbConnected ? 'text-emerald-700' : 'text-purple-700'}`}>
            {dbConnected ? 'Live Supabase SQL' : 'Local Admin Vault'}
          </span>
        </div>
      </header>

      {/* Main SaaS Creator Login Card (White & Blue Glassmorphism Theme) */}
      <div className="w-full max-w-md mx-auto p-4 z-10 my-auto">
        <div className="p-7 sm:p-8 rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-2xl space-y-6 relative selection:bg-purple-600 selection:text-white">
          
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-800 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>SaaS Platform Founder Portal</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              SaaS Creator Access
            </h1>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Sign in as the Founder & Creator of FounderOS to manage client company accounts, monitor platform MRR/ARR, and inspect system health.
            </p>
          </div>

          {/* 1-Click SaaS Creator Portal Access */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-slate-50 to-indigo-50 border border-purple-200 text-center space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-purple-900 font-semibold">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-600" />
                SaaS Creator Access
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">1-Click Launch</span>
            </div>
            <p className="text-[11px] text-slate-600 text-left font-medium">
              Bypass login credentials to launch the **SaaS Super Admin Control Center** (`/admin`).
            </p>
            <button
              type="button"
              onClick={handleDemoAdminSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Launching SaaS Admin Portal...</span>
              ) : (
                <>
                  <span>Launch SaaS Creator Control Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
              Or Sign In With Admin Credentials
            </span>
          </div>

          {/* Admin Sign In Form */}
          <form onSubmit={handleAdminSignIn} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-700 font-semibold mb-1 block">Creator Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@founderos.io"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 font-mono focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">Master Password</label>
                <button
                  type="button"
                  onClick={() => setShowSecretKeyInput(!showSecretKeyInput)}
                  className="text-[10px] text-purple-700 hover:underline font-mono font-bold"
                >
                  {showSecretKeyInput ? 'Use Password' : 'Use Admin Secret Key'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={showSecretKeyInput ? adminSecretKey : password}
                  onChange={(e) => showSecretKeyInput ? setAdminSecretKey(e.target.value) : setPassword(e.target.value)}
                  placeholder={showSecretKeyInput ? "sk_admin_••••••••••••" : "••••••••••••••••"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 font-mono focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating SaaS Creator...' : 'Sign In to SaaS Admin Portal'}</span>
            </button>
          </form>

          {/* Link to Customer Login Route */}
          <div className="pt-3 border-t border-slate-100 text-center font-medium">
            <Link
              href="/login"
              className="text-xs text-slate-600 hover:text-purple-700 font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <span>Are you a Customer / Company Owner?</span>
              <span className="text-purple-700 font-bold underline">Go to Customer Login →</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Footer Security Badges */}
      <footer className="p-6 text-center text-xs text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> SaaS Creator Security Vault</span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-blue-600" /> Multi-Tenant Isolation</span>
      </footer>

    </div>
  );
}
