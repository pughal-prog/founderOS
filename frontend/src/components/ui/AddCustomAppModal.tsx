'use client';

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Globe, 
  Key, 
  Check, 
  ArrowRight,
  Code,
  Building,
  CheckSquare
} from 'lucide-react';
import { IntegrationApp } from '@/types';
import AppLogo from '@/components/ui/AppLogo';
import { useFounderStore } from '@/hooks/useFounderStore';

interface AddCustomAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppAdded?: (app: IntegrationApp) => void;
}

export const PRESET_SAAS_CATALOG: IntegrationApp[] = [
  {
    id: 'app-salesforce',
    name: 'Salesforce',
    category: 'CRM & Pipeline',
    description: 'Sync enterprise pipeline opportunities, deal accounts, and customer lifecycles.',
    iconName: 'Building',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'oauth2',
    scopes: ['api', 'refresh_token', 'offline_access']
  },
  {
    id: 'app-zendesk',
    name: 'Zendesk',
    category: 'Customer Support',
    description: 'Track customer support tickets, escalation SLAs, and satisfaction CSAT scores.',
    iconName: 'MessageSquare',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'api_token',
    scopes: ['tickets:read', 'users:read']
  },
  {
    id: 'app-asana',
    name: 'Asana',
    category: 'Project Management',
    description: 'Sync cross-functional project milestones, team tasks, and sprint goals.',
    iconName: 'CheckSquare',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'oauth2',
    scopes: ['default']
  },
  {
    id: 'app-gitlab',
    name: 'GitLab',
    category: 'Engineering & CI/CD',
    description: 'Index merge requests, CI/CD pipeline builds, and codebase security audits.',
    iconName: 'Code',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'personal_token',
    scopes: ['api', 'read_repository']
  },
  {
    id: 'app-figma',
    name: 'Figma',
    category: 'Design & Specs',
    description: 'Sync UI/UX design components, wireframe specs, and design system comments.',
    iconName: 'Layers',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'personal_token',
    scopes: ['files:read']
  },
  {
    id: 'app-intercom',
    name: 'Intercom',
    category: 'Customer Support',
    description: 'Sync live customer chat conversations, lead qualification, and inbox messages.',
    iconName: 'MessageSquare',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'oauth2',
    scopes: ['read_conversations', 'read_contacts']
  },
  {
    id: 'app-mixpanel',
    name: 'Mixpanel',
    category: 'Analytics & Telemetry',
    description: 'Track product usage metrics, feature funnel conversion, and user cohort retention.',
    iconName: 'Activity',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'api_token',
    scopes: ['analytics:read']
  },
  {
    id: 'app-datadog',
    name: 'Datadog',
    category: 'DevOps & Monitoring',
    description: 'Monitor cloud Infrastructure APM metrics, latency spikes, and system alerts.',
    iconName: 'ShieldCheck',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'api_token',
    scopes: ['metrics_read', 'events_read']
  },
  {
    id: 'app-vercel',
    name: 'Vercel',
    category: 'Engineering & CI/CD',
    description: 'Sync web deployments, edge function logs, and production environment builds.',
    iconName: 'Code',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'oauth2',
    scopes: ['deployments:read']
  },
  {
    id: 'app-sentry',
    name: 'Sentry',
    category: 'DevOps & Monitoring',
    description: 'Track production exception stack traces, crash reports, and issue regressions.',
    iconName: 'AlertCircle',
    connected: false,
    status: 'disconnected',
    lastSynced: 'Never',
    authType: 'api_token',
    scopes: ['event:read', 'project:read']
  }
];

export default function AddCustomAppModal({ isOpen, onClose, onAppAdded }: AddCustomAppModalProps) {
  const { addIntegration } = useFounderStore();
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');

  // Custom App Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Engineering & Delivery');
  const [description, setDescription] = useState('');
  const [authType, setAuthType] = useState<'oauth2' | 'api_token' | 'personal_token'>('oauth2');
  const [siteUrl, setSiteUrl] = useState('');
  const [clientId, setClientId] = useState('');

  if (!isOpen) return null;

  const handleAddPreset = (preset: IntegrationApp) => {
    addIntegration(preset);
    if (onAppAdded) onAppAdded(preset);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newApp: IntegrationApp = {
      id: `app-custom-${Date.now()}`,
      name,
      category,
      description: description || `Custom integration for ${name}`,
      iconName: 'CheckSquare',
      connected: false,
      status: 'disconnected',
      lastSynced: 'Never',
      authType,
      siteUrl,
      clientId,
      scopes: ['read_access', 'api_sync']
    };

    addIntegration(newApp);
    if (onAppAdded) onAppAdded(newApp);
    onClose();

    // Reset form
    setName('');
    setDescription('');
    setSiteUrl('');
    setClientId('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-2xl glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200 text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Add Application to Workspace</h3>
              <p className="text-xs text-slate-500 font-medium">Select from Enterprise SaaS Catalog or build a Custom Integration</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Catalog vs Custom Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>SaaS Application Catalog (10 Presets)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-white text-blue-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Build Custom Integration</span>
          </button>
        </div>

        {/* TAB 1: PRESET CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              Click any SaaS application below to add it directly to your workspace integrations dashboard:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-80 overflow-y-auto pr-1">
              {PRESET_SAAS_CATALOG.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleAddPreset(preset)}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm p-1.5 shrink-0">
                      <AppLogo appId={preset.id} appName={preset.name} className="w-5 h-5 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">{preset.name}</h4>
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{preset.description}</p>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM BUILDER */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCreateCustom} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Custom Internal SaaS Integration</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Register a custom in-house software tool or third-party web service for your workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-bold mb-1 block">Application Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Internal ERP"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option>Communication & Email</option>
                  <option>Engineering & Delivery</option>
                  <option>Revenue & Subscriptions</option>
                  <option>CRM & Pipeline</option>
                  <option>Knowledge & Specs</option>
                  <option>Analytics & Telemetry</option>
                  <option>DevOps & Monitoring</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-bold mb-1 block">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what telemetry data this application syncs with FounderOS..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-700 font-bold mb-1 block">Authentication Protocol</label>
                <select
                  value={authType}
                  onChange={(e: any) => setAuthType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="oauth2">OAuth 2.0 Authorization</option>
                  <option value="api_token">API Key / Secret Token</option>
                  <option value="personal_token">Personal Access Token (PAT)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold mb-1 block">API Base Endpoint / Domain</label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://api.internal-tool.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
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
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create & Add App</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
