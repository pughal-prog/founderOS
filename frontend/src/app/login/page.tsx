'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Check,
  Eye,
  EyeOff,
  Wand2,
  TrendingUp,
  Activity,
  AlertCircle,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { isDatabaseConnected } from '@/lib/supabase';
import { useFounderStore } from '@/hooks/useFounderStore';
import FounderOSLogo from '@/components/ui/FounderOSLogo';

export default function LoginPage() {
  const router = useRouter();
  const { login, createWorkspace, integrations, authenticateConsumerApp } = useFounderStore();
  
  // State
  const [userRoleTab, setUserRoleTab] = useState<'customer' | 'admin'>('customer');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentStep, setCurrentStep] = useState<'credentials' | 'consumer_apps'>('credentials');
  
  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI & Validation State
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; type: 'success' | 'error' } | null>(null);

  // Selected consumer apps to pre-authenticate during workspace login
  const [selectedApps, setSelectedApps] = useState<string[]>([]);

  const dbConnected = isDatabaseConnected();

  // Validate Email
  const validateEmail = (val: string) => {
    if (!val) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Please enter a valid email address';
    return null;
  };

  // Validate Password
  const validatePassword = (val: string) => {
    if (!val) return 'Password is required';
    if (val.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Live validation
    const errEmail = validateEmail(email || (userRoleTab === 'admin' ? 'admin@founderos.io' : 'alex@founderos.io'));
    const errPass = userRoleTab === 'customer' && authMode === 'signin' ? validatePassword(password || 'password123') : null;

    if (errEmail) {
      setEmailError(errEmail);
      return;
    }
    if (errPass) {
      setPasswordError(errPass);
      return;
    }

    setEmailError(null);
    setPasswordError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (userRoleTab === 'admin') {
        login(email || 'admin@founderos.io', password, 'admin');
        setIsLoading(false);
        setToastMessage({ title: 'System Admin Authenticated Successfully!', type: 'success' });
        setTimeout(() => router.push('/admin'), 600);
      } else {
        if (authMode === 'signup') {
          createWorkspace(fullName || 'Founder', company || 'New Startup Inc.', email);
          setIsLoading(false);
          setToastMessage({ title: 'New Workspace Created! 0 Apps Synced.', type: 'success' });
          setTimeout(() => router.push('/dashboard'), 600);
        } else {
          login(email || 'alex@founderos.io', password, 'customer');
          setIsLoading(false);
          // Move to Step 2 for existing workspace sign-in optional app authorization
          setCurrentStep('consumer_apps');
        }
      }
    }, 600);
  };

  const handleSocialAuth = (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    setTimeout(() => {
      login(
        provider === 'google' ? 'founder.google@founderos.io' : 'founder.github@founderos.io',
        'social_token',
        userRoleTab
      );
      setSocialLoading(null);
      setToastMessage({ title: `Authenticated with ${provider === 'google' ? 'Google' : 'GitHub'} OAuth!`, type: 'success' });
      setTimeout(() => router.push(userRoleTab === 'admin' ? '/admin' : '/dashboard'), 600);
    }, 800);
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
        userEmail: email || (userRoleTab === 'admin' ? 'admin@founderos.io' : 'alex@founderos.io'),
        userName: fullName || (userRoleTab === 'admin' ? 'Platform Administrator' : 'Alex Vance')
      });
    });

    setTimeout(() => {
      setIsLoading(false);
      setToastMessage({ title: 'Workspace Authorized! Launching Dashboard...', type: 'success' });
      setTimeout(() => router.push(userRoleTab === 'admin' ? '/admin' : '/dashboard'), 600);
    }, 600);
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      login(userRoleTab === 'admin' ? 'admin@founderos.io' : 'alex@founderos.io', undefined, userRoleTab);
      setIsLoading(false);
      setToastMessage({ title: 'Demo Workspace Authenticated!', type: 'success' });
      setTimeout(() => router.push(userRoleTab === 'admin' ? '/admin' : '/dashboard'), 600);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-grid-pattern selection:bg-blue-600 selection:text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-blue-500/50 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-xs font-bold text-white"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>{toastMessage.title}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Blue & Indigo Glow Spheres */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <FounderOSLogo size="lg" />
        </Link>

        {/* Database Status Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs shadow-sm">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium text-slate-600 hidden sm:inline">Storage Core:</span>
          <span className={`font-bold font-mono text-[11px] ${dbConnected ? 'text-emerald-700' : 'text-blue-700'}`}>
            {dbConnected ? 'Live Supabase SQL' : 'Local Storage Vault'}
          </span>
        </div>
      </header>

      {/* SPLIT SCREEN MAIN CONTAINER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto py-8 z-10">
        
        {/* LEFT SIDE (Branding & Floating AI Telemetry Mesh - Hidden on mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-6"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Next-Gen SaaS Founder Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              The AI Operating System for <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">SaaS Founders</span>
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-lg font-medium">
              Connect your business across Gmail, Slack, Stripe, Jira & Notion. Ask anything in natural language. Let AI handle the rest.
            </p>
          </div>

          {/* 4 FLOATING FEATURE CARDS (WHITE & BLUE THEME) */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md space-y-2 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-500" /> Gmail Connected
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs font-mono text-slate-900 font-bold">14 Unreplied Leads Indexed</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md space-y-2 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Business Insights
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">+12.1% MoM</span>
              </div>
              <p className="text-xs font-mono text-slate-900 font-bold">₹82,500 MRR Active</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md space-y-2 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-blue-600" /> AI Assistant Online
                </span>
                <span className="text-[10px] font-mono text-blue-700 font-bold">GPT-4o</span>
              </div>
              <p className="text-xs font-mono text-slate-900 font-bold">9 SaaS Feeds Unified</p>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -9, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 1.5 }}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md space-y-2 hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-600" /> Revenue Growth
                </span>
                <span className="text-[10px] font-mono text-purple-700 font-bold">+18%</span>
              </div>
              <p className="text-xs font-mono text-slate-900 font-bold">18 Enterprise Upgrades</p>
            </motion.div>
          </div>

          {/* TRUST BADGES SECTION */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Authentication</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-600" /> End-to-End Encryption</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600" /> SOC-2 Ready SaaS</span>
          </div>
        </motion.div>

        {/* RIGHT SIDE (CRISP WHITE & BLUE GLASSMORPHISM LOGIN CARD) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 w-full max-w-md mx-auto"
        >
          <div className="p-7 sm:p-9 rounded-3xl bg-white/95 border border-slate-200 shadow-2xl backdrop-blur-2xl space-y-6 relative selection:bg-blue-600 selection:text-white">
            
            {/* Role Switcher Bar (Company Founder vs SaaS Creator Admin) */}
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setUserRoleTab('customer');
                  setAuthMode('signin');
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  userRoleTab === 'customer'
                    ? 'bg-white text-blue-700 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Company Founder</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserRoleTab('admin');
                  setAuthMode('signin');
                }}
                className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  userRoleTab === 'admin'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SaaS Creator Admin</span>
              </button>
            </div>

            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentStep === 'consumer_apps' 
                  ? 'Authenticate Consumer Apps' 
                  : userRoleTab === 'admin'
                    ? 'SaaS Creator Access'
                    : authMode === 'signup' 
                      ? 'Create Founder Workspace' 
                      : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {userRoleTab === 'admin'
                  ? 'Sign in as the SaaS Platform Founder to manage client company accounts, monitor platform MRR, and access system control center.'
                  : 'Sign in to your company workspace to connect apps, track telemetry, and query AI.'}
              </p>
            </div>

            {/* STEP 1: CREDENTIALS & AUTH MODES */}
            {currentStep === 'credentials' && (
              <>
                {/* Auth Method Tabs (Sign In / Create Workspace) */}
                {userRoleTab === 'customer' && (
                  <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        authMode === 'signin' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-1.5 rounded-lg transition-all ${
                        authMode === 'signup' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600'
                      }`}
                    >
                      Create Workspace
                    </button>
                  </div>
                )}



                {/* SOCIAL OAUTH BUTTONS */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth('google')}
                    disabled={Boolean(socialLoading)}
                    className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm"
                  >
                    {socialLoading === 'google' ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                    )}
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth('github')}
                    disabled={Boolean(socialLoading)}
                    className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-sm"
                  >
                    {socialLoading === 'github' ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                    ) : (
                      <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    )}
                    <span>GitHub</span>
                  </button>
                </div>

                {/* FORM INPUTS */}
                <form onSubmit={handleStep1Submit} className="space-y-4 text-xs">
                  {authMode === 'signup' && (
                    <>
                      <div>
                        <label className="text-slate-700 font-semibold mb-1 block">Full Name</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Alex Vance"
                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold mb-1 block">Company Name</label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Acme Inc."
                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 font-medium"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-slate-700 font-semibold mb-1 block">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={userRoleTab === 'admin' ? "admin@founderos.io" : "alex@founderos.io"}
                        className={`w-full bg-slate-50 border ${emailError ? 'border-red-500' : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'} rounded-xl py-2.5 pl-10 pr-4 text-slate-900 font-mono placeholder-slate-400 font-medium`}
                      />
                    </div>
                    {emailError && (
                      <span className="text-[11px] text-red-600 flex items-center gap-1 mt-1 font-semibold">
                        <AlertCircle className="w-3 h-3" /> {emailError}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-700 font-semibold">Password</label>
                      {authMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setShowForgotModal(true)}
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••••••"
                        className={`w-full bg-slate-50 border ${passwordError ? 'border-red-500' : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20'} rounded-xl py-2.5 pl-10 pr-10 text-slate-900 font-mono placeholder-slate-400 font-medium`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <span className="text-[11px] text-red-600 flex items-center gap-1 mt-1 font-semibold">
                        <AlertCircle className="w-3 h-3" /> {passwordError}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 bg-slate-50 accent-blue-600"
                      />
                      <span className="font-semibold text-xs">Remember Me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...</span>
                    ) : (
                      <span>{userRoleTab === 'admin' ? 'Sign In to SaaS Creator Control Center →' : authMode === 'signup' ? 'Create Founder Workspace →' : 'Sign In to Workspace →'}</span>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: CONSUMER OAUTH PRE-AUTHENTICATION */}
            {currentStep === 'consumer_apps' && (
              <div className="space-y-4 text-xs animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900 block">Pre-Authenticate Consumer SaaS Apps</span>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Select consumer software tools to index during workspace initialization.
                  </p>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {integrations.map((app) => {
                    const isSelected = selectedApps.includes(app.id);
                    return (
                      <div
                        key={app.id}
                        onClick={() => toggleSelectApp(app.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-500/50 shadow-sm'
                            : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shrink-0">
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
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    {isLoading ? 'Launching Workspace...' : 'Authorize & Launch Workspace →'}
                  </button>
                </div>
              </div>
            )}



          </div>
        </motion.div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-slate-200 space-y-4 bg-white text-slate-900 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Reset Founder Password</h3>
            <p className="text-xs text-slate-600 font-medium">Enter your work email to receive a password reset link.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@founderos.io"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono"
            />
            <div className="flex gap-2 pt-2 text-xs">
              <button
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setToastMessage({ title: 'Password reset link sent to email!', type: 'success' });
                  setShowForgotModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Security & Copyright */}
      <footer className="p-6 text-center text-xs text-slate-500 z-20 flex items-center justify-center">
        <span>© 2026 FounderOS Inc. All rights reserved.</span>
      </footer>

    </div>
  );
}
