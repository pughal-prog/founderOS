import { useState, useEffect } from 'react';
import { mockIntegrations, mockClientTenants } from '../data/mockData';
import { IntegrationApp, Workspace, UserProfile, ClientCompanyTenant } from '../types';

const STORAGE_KEYS = {
  AUTH: 'founderos_auth',
  USER: 'founderos_user_profile',
  WORKSPACES: 'founderos_workspaces',
  CURRENT_WS_ID: 'founderos_current_ws_id',
  INTEGRATIONS: 'founderos_integrations',
  CLIENT_TENANTS: 'founderos_client_tenants'
};

const defaultWorkspaces: Workspace[] = [
  {
    id: 'ws-main',
    name: 'FounderOS Primary Workspace',
    companyName: 'FounderOS Tech Inc.',
    domain: 'founderos.io',
    role: 'Founder & CEO',
    createdAt: '2026-01-15',
    connectedAppsCount: 8
  }
];

const defaultUserProfile: UserProfile = {
  id: 'usr-1',
  name: 'Alex Vance',
  email: 'alex@founderos.io',
  role: 'Founder & CEO',
  company: 'FounderOS Tech Inc.',
  currentWorkspaceId: 'ws-main',
  openAiApiKey: 'sk-proj-••••••••••••••••',
  supabaseUrl: 'https://xyz-app.supabase.co'
};

export function useFounderStore() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(defaultWorkspaces);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('ws-main');
  const [integrations, setIntegrations] = useState<IntegrationApp[]>(mockIntegrations);
  const [clientTenants, setClientTenants] = useState<ClientCompanyTenant[]>(mockClientTenants);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Hydrate state from localStorage on client render
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (savedAuth !== null) {
        setIsAuthenticated(JSON.parse(savedAuth));
      }

      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        setUserProfile(JSON.parse(savedUser));
      }

      const savedWorkspaces = localStorage.getItem(STORAGE_KEYS.WORKSPACES);
      if (savedWorkspaces) {
        setWorkspaces(JSON.parse(savedWorkspaces));
      }

      const savedWsId = localStorage.getItem(STORAGE_KEYS.CURRENT_WS_ID);
      if (savedWsId) {
        setCurrentWorkspaceId(savedWsId);
      }

      const savedIntegrations = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
      if (savedIntegrations) {
        setIntegrations(JSON.parse(savedIntegrations));
      }

      const savedTenants = localStorage.getItem(STORAGE_KEYS.CLIENT_TENANTS);
      if (savedTenants) {
        setClientTenants(JSON.parse(savedTenants));
      }
    } catch (e) {
      console.error('Error hydrating FounderOS state from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync state changes back to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
      localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(workspaces));
      localStorage.setItem(STORAGE_KEYS.CURRENT_WS_ID, currentWorkspaceId);
      localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(integrations));
      localStorage.setItem(STORAGE_KEYS.CLIENT_TENANTS, JSON.stringify(clientTenants));
    } catch (e) {
      console.error('Error saving FounderOS state to localStorage:', e);
    }
  }, [isHydrated, isAuthenticated, userProfile, workspaces, currentWorkspaceId, integrations, clientTenants]);

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0] || defaultWorkspaces[0];

  // Tenant Actions for SaaS Super Admin
  const toggleTenantStatus = (tenantId: string) => {
    setClientTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          const newStatus = t.status === 'suspended' ? 'active' : 'suspended';
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const changeTenantPlan = (tenantId: string, newPlan: 'Starter' | 'Pro OS' | 'Scale Enterprise') => {
    const planPrices = {
      'Starter': 3499,
      'Pro OS': 8999,
      'Scale Enterprise': 19999
    };
    setClientTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          return { ...t, plan: newPlan, mrr: planPrices[newPlan] };
        }
        return t;
      })
    );
  };

  const onboardClientTenant = (newTenant: ClientCompanyTenant) => {
    setClientTenants(prev => [newTenant, ...prev]);
  };

  // Auth Action: Sign In (Admin or Customer)
  const login = (email: string, password?: string, userType: 'admin' | 'customer' = 'customer') => {
    const isAdmin = userType === 'admin' || (email && email.toLowerCase().includes('admin'));
    const existingUser: UserProfile = {
      ...userProfile,
      email: email || (isAdmin ? 'admin@founderos.io' : 'alex@founderos.io'),
      name: isAdmin ? 'Platform Administrator' : (email ? email.split('@')[0].replace('.', ' ').toUpperCase() : 'Alex Vance'),
      role: isAdmin ? 'System Admin & Security Manager' : 'Founder & CEO',
      company: isAdmin ? 'FounderOS Infrastructure' : 'Acme Inc.',
      userType: isAdmin ? 'admin' : 'customer'
    };
    setUserProfile(existingUser);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(true));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(existingUser));
    } catch (e) {
      console.error('Error saving login state synchronously:', e);
    }
  };

  // Auth Action: Create New Workspace
  const createWorkspace = (fullName: string, companyName: string, email: string) => {
    const newWsId = `ws-${Date.now()}`;
    const newWorkspace: Workspace = {
      id: newWsId,
      name: `${companyName} Workspace`,
      companyName: companyName,
      domain: email.split('@')[1] || 'founderos.io',
      role: 'Workspace Owner & Founder',
      createdAt: new Date().toISOString().split('T')[0],
      connectedAppsCount: 0
    };

    const updatedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: fullName || 'Founder',
      email: email,
      role: 'Founder & CEO',
      company: companyName,
      currentWorkspaceId: newWsId
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setCurrentWorkspaceId(newWsId);
    setUserProfile(updatedUser);
    setIsAuthenticated(true);
  };

  // Action: Switch Workspace
  const switchWorkspace = (workspaceId: string) => {
    const targetWs = workspaces.find(w => w.id === workspaceId);
    if (targetWs) {
      setCurrentWorkspaceId(workspaceId);
      setUserProfile(prev => ({ ...prev, currentWorkspaceId: workspaceId, company: targetWs.companyName }));
    }
  };

  // Auth Action: Sign Out
  const logout = () => {
    setIsAuthenticated(false);
  };

  // App Integration Actions
  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(app => {
        if (app.id === id) {
          const newConnected = !app.connected;
          return {
            ...app,
            connected: newConnected,
            status: newConnected ? 'connected' : 'disconnected',
            lastSynced: newConnected ? 'Just now' : 'Never',
            healthStatus: newConnected ? 'healthy' : undefined
          };
        }
        return app;
      })
    );
  };

  const connectAppWithToken = (id: string, token?: string, apiKey?: string) => {
    setIntegrations(prev =>
      prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            connected: true,
            status: 'connected',
            lastSynced: 'Just now',
            healthStatus: 'healthy',
            authToken: token || app.authToken || `oauth_tok_${Date.now()}`,
            apiKey: apiKey || app.apiKey
          };
        }
        return app;
      })
    );
  };

  const authenticateConsumerApp = (
    id: string, 
    authData: { 
      siteUrl?: string; 
      clientId?: string; 
      clientSecret?: string; 
      authToken?: string; 
      apiKey?: string; 
      userEmail?: string;
      userName?: string;
    }
  ) => {
    setIntegrations(prev =>
      prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            connected: true,
            status: 'connected',
            lastSynced: 'Just now',
            healthStatus: 'healthy',
            siteUrl: authData.siteUrl || app.siteUrl,
            clientId: authData.clientId || app.clientId,
            clientSecret: authData.clientSecret || app.clientSecret,
            authToken: authData.authToken || `oauth_live_tok_${Date.now()}`,
            apiKey: authData.apiKey || app.apiKey,
            connectedUser: {
              name: authData.userName || userProfile.name || 'Alex Vance',
              email: authData.userEmail || userProfile.email || 'alex@founderos.io',
              role: 'Authenticated Consumer Account'
            }
          };
        }
        return app;
      })
    );
  };

  const testIntegrationConnection = async (id: string): Promise<{ success: boolean; latencyMs: number; details: string }> => {
    const start = Date.now();
    const app = integrations.find(i => i.id === id);
    await new Promise(res => setTimeout(res, 400));
    const latencyMs = Date.now() - start;

    if (!app || !app.connected) {
      return {
        success: false,
        latencyMs,
        details: `App ${id} is not connected or credentials missing.`
      };
    }

    return {
      success: true,
      latencyMs,
      details: `Successfully connected to ${app.name} API endpoint. Response 200 OK.`
    };
  };

  const addIntegration = (newApp: IntegrationApp) => {
    setIntegrations(prev => {
      const exists = prev.some(a => a.id === newApp.id);
      if (exists) {
        return prev.map(a => a.id === newApp.id ? { ...a, ...newApp } : a);
      }
      return [newApp, ...prev];
    });
  };

  const disconnectApp = (id: string) => {
    setIntegrations(prev =>
      prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            connected: false,
            status: 'disconnected',
            lastSynced: 'Never',
            healthStatus: undefined,
            authToken: undefined,
            apiKey: undefined,
            clientSecret: undefined
          };
        }
        return app;
      })
    );
  };

  return {
    isHydrated,
    isAuthenticated,
    userProfile,
    setUserProfile,
    workspaces,
    currentWorkspaceId,
    currentWorkspace,
    login,
    createWorkspace,
    switchWorkspace,
    logout,
    integrations,
    toggleIntegration,
    connectAppWithToken,
    authenticateConsumerApp,
    testIntegrationConnection,
    addIntegration,
    disconnectApp,
    unreadNotifications,
    setUnreadNotifications,
    clientTenants,
    toggleTenantStatus,
    changeTenantPlan,
    onboardClientTenant
  };
}

