import { useState, useEffect } from 'react';
import { mockIntegrations } from '../data/mockData';
import { IntegrationApp } from '../types';

export function useFounderStore() {
  const [integrations, setIntegrations] = useState<IntegrationApp[]>(mockIntegrations);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Vance',
    role: 'Founder & CEO',
    email: 'alex@founderos.io',
    company: 'FounderOS Tech Inc.',
    openAiApiKey: 'sk-proj-••••••••••••••••',
    supabaseUrl: 'https://xyz-app.supabase.co'
  });

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(app => {
        if (app.id === id) {
          const newConnected = !app.connected;
          return {
            ...app,
            connected: newConnected,
            status: newConnected ? 'connected' : 'disconnected',
            lastSynced: newConnected ? 'Just now' : 'Never'
          };
        }
        return app;
      })
    );
  };

  return {
    integrations,
    toggleIntegration,
    unreadNotifications,
    setUnreadNotifications,
    userProfile,
    setUserProfile
  };
}
