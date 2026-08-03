export interface OAuthProvider {
  id: string;
  name: string;
  authUrl: string;
  scopes: string[];
}

export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  gmail: {
    id: 'gmail',
    name: 'Gmail & Google Workspace',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/userinfo.email']
  },
  gcalendar: {
    id: 'gcalendar',
    name: 'Google Calendar',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly']
  },
  slack: {
    id: 'slack',
    name: 'Slack Workspace',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    scopes: ['channels:history', 'team:read', 'users:read']
  },
  notion: {
    id: 'notion',
    name: 'Notion Workspace',
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    scopes: ['read_content', 'read_user']
  },
  github: {
    id: 'github',
    name: 'GitHub Organization',
    authUrl: 'https://github.com/login/oauth/authorize',
    scopes: ['repo', 'read:user', 'read:org']
  }
};

export function triggerOAuthFlow(providerId: string): Promise<{ success: boolean; token: string; provider: string }> {
  return new Promise((resolve) => {
    // Simulate OAuth Popup Window
    const provider = OAUTH_PROVIDERS[providerId] || { name: providerId };
    console.log(`[OAuth Simulator] Launching OAuth consent window for ${provider.name}...`);

    setTimeout(() => {
      resolve({
        success: true,
        token: `oauth_token_${providerId}_${Date.now()}`,
        provider: providerId
      });
    }, 1200);
  });
}
