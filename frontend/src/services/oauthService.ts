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

export interface UniversalAccountProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  teamOrCompany?: string;
  role?: string;
  details?: string;
  verified: boolean;
}

// 1. GitHub Token Verification
export async function verifyRealGitHubToken(token: string): Promise<{ success: boolean; profile?: UniversalAccountProfile; error?: string }> {
  try {
    const cleanToken = token.trim();
    if (!cleanToken) return { success: false, error: 'Token is required.' };

    const res = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `Bearer ${cleanToken}`, 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: `GitHub API returned ${res.status}: ${errData.message || 'Invalid or expired Personal Access Token'}` };
    }

    const data = await res.json();
    return {
      success: true,
      profile: {
        name: data.name || data.login,
        email: data.email || `${data.login}@users.noreply.github.com`,
        avatarUrl: data.avatar_url,
        teamOrCompany: `@${data.login}`,
        role: 'GitHub Contributor',
        details: `${data.public_repos || 0} public repositories`,
        verified: true
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error verifying GitHub token.' };
  }
}

// 2. Google / Gmail Token Verification
export async function verifyRealGoogleToken(accessToken: string): Promise<{ success: boolean; profile?: UniversalAccountProfile; error?: string }> {
  try {
    const cleanToken = accessToken.trim();
    if (!cleanToken) return { success: false, error: 'Access token is required.' };

    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${cleanToken}` }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: `Google API returned ${res.status}: ${errData.error?.message || 'Invalid or expired Google OAuth Token'}` };
    }

    const data = await res.json();
    return {
      success: true,
      profile: {
        name: data.name || data.email.split('@')[0],
        email: data.email,
        avatarUrl: data.picture || '',
        teamOrCompany: 'Google Workspace Account',
        role: 'Verified Google Identity',
        details: 'Gmail & Inbox Sync Authorized',
        verified: true
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error verifying Google token.' };
  }
}

// 3. Slack Token Verification (xoxb-... or xoxp-...)
export async function verifyRealSlackToken(token: string): Promise<{ success: boolean; profile?: UniversalAccountProfile; error?: string }> {
  try {
    const cleanToken = token.trim();
    if (!cleanToken) return { success: false, error: 'Slack Bot or OAuth Token is required.' };

    const res = await fetch('https://slack.com/api/auth.test', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${cleanToken}`, 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (!data.ok) {
      return { success: false, error: `Slack API error: ${data.error || 'invalid_auth'}` };
    }

    return {
      success: true,
      profile: {
        name: data.user || 'Slack Bot',
        email: `${data.user.toLowerCase()}@${data.team.toLowerCase().replace(/\s+/g, '')}.slack.com`,
        teamOrCompany: data.team || 'Slack Workspace',
        role: 'Authenticated Slack Member',
        details: `Team ID: ${data.team_id}`,
        verified: true
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error verifying Slack token.' };
  }
}

// 4. Stripe Key Verification (sk_live_... / rk_live_...)
export async function verifyRealStripeKey(apiKey: string): Promise<{ success: boolean; profile?: UniversalAccountProfile; error?: string }> {
  try {
    const cleanKey = apiKey.trim();
    if (!cleanKey) return { success: false, error: 'Stripe API key is required.' };

    const res = await fetch('https://api.stripe.com/v1/account', {
      headers: { 'Authorization': `Bearer ${cleanKey}` }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: `Stripe API error (${res.status}): ${errData.error?.message || 'Invalid API key'}` };
    }

    const data = await res.json();
    return {
      success: true,
      profile: {
        name: data.business_profile?.name || data.settings?.dashboard?.display_name || 'Stripe Account',
        email: data.email || 'billing@merchant-stripe.com',
        teamOrCompany: `Stripe Merchant (${(data.country || 'US').toUpperCase()})`,
        role: 'Account Owner',
        details: `Default Currency: ${(data.default_currency || 'usd').toUpperCase()}`,
        verified: true
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error verifying Stripe API Key.' };
  }
}

// 5. Notion Integration Secret Verification (ntn_... or secret_...)
export async function verifyRealNotionToken(secret: string): Promise<{ success: boolean; profile?: UniversalAccountProfile; error?: string }> {
  try {
    const cleanSecret = secret.trim();
    if (!cleanSecret) return { success: false, error: 'Notion Integration Secret is required.' };

    const res = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${cleanSecret}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: `Notion API error (${res.status}): ${errData.message || 'Invalid Notion Integration Token'}` };
    }

    const data = await res.json();
    return {
      success: true,
      profile: {
        name: data.name || 'Notion Integration',
        email: data.person?.email || 'notion-bot@workspace.notion.so',
        avatarUrl: data.avatar_url || undefined,
        teamOrCompany: 'Notion Workspace',
        role: 'Internal Integration Bot',
        details: `Bot Type: ${data.type || 'internal'}`,
        verified: true
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error verifying Notion token.' };
  }
}

// 6. Jira Credentials Verification (Site Domain + Email + API Token)
export async function verifyRealJiraCredentials(siteUrl: string, email: string, apiToken: string): Promise<{ success: boolean; profile?: UniversalAccountProfile; error?: string }> {
  try {
    const domain = siteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    const cleanEmail = email.trim();
    const cleanToken = apiToken.trim();

    if (!domain || !cleanEmail || !cleanToken) {
      return { success: false, error: 'Site domain, email, and Atlassian API token are all required.' };
    }

    const authHeader = 'Basic ' + btoa(`${cleanEmail}:${cleanToken}`);
    const res = await fetch(`https://${domain}/rest/api/3/myself`, {
      headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
    });

    if (!res.ok) {
      return { success: false, error: `Jira API returned HTTP ${res.status}. Check domain, email, and API token.` };
    }

    const data = await res.json();
    return {
      success: true,
      profile: {
        name: data.displayName || cleanEmail.split('@')[0],
        email: data.emailAddress || cleanEmail,
        avatarUrl: data.avatarUrls?.['48x48'] || undefined,
        teamOrCompany: domain,
        role: 'Atlassian User',
        details: `Account Type: ${data.accountType || 'atlassian'}`,
        verified: true
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to Jira site domain.' };
  }
}

// 7. Linear API Key Verification
export async function verifyRealLinearKey(apiKey: string): Promise<{ success: boolean; profile?: UniversalAccountProfile; error?: string }> {
  try {
    const cleanKey = apiKey.trim();
    if (!cleanKey) return { success: false, error: 'Linear API Key is required.' };

    const res = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: { 'Authorization': cleanKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ viewer { id name email avatarUrl } }' })
    });

    if (!res.ok) {
      return { success: false, error: `Linear API error HTTP ${res.status}.` };
    }

    const result = await res.json();
    if (result.errors && result.errors.length > 0) {
      return { success: false, error: result.errors[0].message || 'Invalid Linear key' };
    }

    const user = result.data?.viewer;
    return {
      success: true,
      profile: {
        name: user?.name || 'Linear Developer',
        email: user?.email || 'developer@linear.app',
        avatarUrl: user?.avatarUrl || undefined,
        teamOrCompany: 'Linear Organization',
        role: 'Engineering Member',
        details: 'Linear GraphQL Sync Active',
        verified: true
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error verifying Linear key.' };
  }
}

// 8. HubSpot Private App Token Verification
export async function verifyRealHubSpotToken(token: string): Promise<{ success: boolean; profile?: UniversalAccountProfile; error?: string }> {
  try {
    const cleanToken = token.trim();
    if (!cleanToken) return { success: false, error: 'HubSpot Private App Token is required.' };

    const res = await fetch('https://api.hubapi.com/crm/v3/owners/', {
      headers: { 'Authorization': `Bearer ${cleanToken}` }
    });

    if (!res.ok) {
      return { success: false, error: `HubSpot API returned HTTP ${res.status}. Invalid token.` };
    }

    const data = await res.json();
    const owner = data.results?.[0];
    return {
      success: true,
      profile: {
        name: owner ? `${owner.firstName} ${owner.lastName}`.trim() : 'HubSpot Account Owner',
        email: owner?.email || 'sales@hubspot-crm.com',
        teamOrCompany: 'HubSpot CRM Portal',
        role: 'CRM Account Owner',
        details: 'Pipeline & Contact Sync Active',
        verified: true
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error verifying HubSpot token.' };
  }
}
