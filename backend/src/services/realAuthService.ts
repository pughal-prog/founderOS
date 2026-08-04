import https from 'https';

export interface GitHubUserProfile {
  id: number;
  login: string;
  name: string;
  email: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  bio: string | null;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
}

export interface SlackUserProfile {
  ok: boolean;
  team: string;
  user: string;
  team_id: string;
  user_id: string;
  url?: string;
}

export interface StripeAccountProfile {
  id: string;
  business_name?: string;
  email?: string;
  country?: string;
  default_currency?: string;
}

export interface NotionUserProfile {
  id: string;
  name: string;
  type: string;
  avatar_url?: string;
  person?: { email: string };
}

// Verify real GitHub Personal Access Token or OAuth Access Token
export async function verifyGitHubToken(token: string): Promise<GitHubUserProfile> {
  return new Promise((resolve, reject) => {
    const cleanToken = token.trim();
    if (!cleanToken) return reject(new Error('GitHub token is required.'));

    const options = {
      hostname: 'api.github.com',
      path: '/user',
      method: 'GET',
      headers: {
        'User-Agent': 'FounderOS-App',
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve({
              id: parsed.id,
              login: parsed.login,
              name: parsed.name || parsed.login,
              email: parsed.email || `${parsed.login}@users.noreply.github.com`,
              avatar_url: parsed.avatar_url,
              html_url: parsed.html_url,
              public_repos: parsed.public_repos || 0,
              followers: parsed.followers || 0,
              bio: parsed.bio || null
            });
          } catch (e: any) {
            reject(new Error(`Failed to parse GitHub response: ${e.message}`));
          }
        } else {
          let errorMsg = `GitHub API Error (${res.statusCode})`;
          try {
            const errObj = JSON.parse(data);
            if (errObj.message) errorMsg += `: ${errObj.message}`;
          } catch (_) {}
          reject(new Error(errorMsg));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Network request to GitHub API failed: ${err.message}`)));
    req.end();
  });
}

// Verify real Google OAuth Access Token
export async function verifyGoogleToken(accessToken: string): Promise<GoogleUserProfile> {
  return new Promise((resolve, reject) => {
    const cleanToken = accessToken.trim();
    if (!cleanToken) return reject(new Error('Google OAuth access token is required.'));

    const options = {
      hostname: 'www.googleapis.com',
      path: '/oauth2/v2/userinfo',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve({
              id: parsed.id,
              email: parsed.email,
              verified_email: Boolean(parsed.verified_email),
              name: parsed.name || parsed.email.split('@')[0],
              given_name: parsed.given_name,
              family_name: parsed.family_name,
              picture: parsed.picture || ''
            });
          } catch (e: any) {
            reject(new Error(`Failed to parse Google response: ${e.message}`));
          }
        } else {
          let errorMsg = `Google API Error (${res.statusCode})`;
          try {
            const errObj = JSON.parse(data);
            if (errObj.error && errObj.error.message) errorMsg += `: ${errObj.error.message}`;
          } catch (_) {}
          reject(new Error(errorMsg));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Network request to Google API failed: ${err.message}`)));
    req.end();
  });
}

// Verify real Slack Token (xoxb-... or xoxp-...)
export async function verifySlackToken(token: string): Promise<SlackUserProfile> {
  return new Promise((resolve, reject) => {
    const cleanToken = token.trim();
    if (!cleanToken) return reject(new Error('Slack token is required.'));

    const options = {
      hostname: 'slack.com',
      path: '/api/auth.test',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json; charset=utf-8'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            resolve({
              ok: true,
              team: parsed.team || 'Slack Workspace',
              user: parsed.user || 'Authorized Bot',
              team_id: parsed.team_id,
              user_id: parsed.user_id,
              url: parsed.url
            });
          } else {
            reject(new Error(`Slack API error: ${parsed.error || 'invalid_auth'}`));
          }
        } catch (e: any) {
          reject(new Error(`Failed to parse Slack response: ${e.message}`));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Network request to Slack API failed: ${err.message}`)));
    req.end();
  });
}

// Verify real Stripe API Key (sk_live_... / rk_live_... / sk_test_...)
export async function verifyStripeKey(apiKey: string): Promise<StripeAccountProfile> {
  return new Promise((resolve, reject) => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) return reject(new Error('Stripe API Key is required.'));

    const options = {
      hostname: 'api.stripe.com',
      path: '/v1/account',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanKey}`,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve({
              id: parsed.id,
              business_name: parsed.business_profile?.name || parsed.settings?.dashboard?.display_name || 'Stripe Merchant Account',
              email: parsed.email || 'billing@merchant.com',
              country: parsed.country || 'US',
              default_currency: parsed.default_currency || 'usd'
            });
          } catch (e: any) {
            reject(new Error(`Failed to parse Stripe response: ${e.message}`));
          }
        } else {
          let errorMsg = `Stripe API Error (${res.statusCode})`;
          try {
            const errObj = JSON.parse(data);
            if (errObj.error?.message) errorMsg += `: ${errObj.error.message}`;
          } catch (_) {}
          reject(new Error(errorMsg));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Network request to Stripe API failed: ${err.message}`)));
    req.end();
  });
}

// Verify real Notion Secret Token (ntn_... or secret_...)
export async function verifyNotionToken(secret: string): Promise<NotionUserProfile> {
  return new Promise((resolve, reject) => {
    const cleanSecret = secret.trim();
    if (!cleanSecret) return reject(new Error('Notion integration secret is required.'));

    const options = {
      hostname: 'api.notion.com',
      path: '/v1/users/me',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanSecret}`,
        'Notion-Version': '2022-06-28',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve({
              id: parsed.id,
              name: parsed.name || 'Notion Integration',
              type: parsed.type || 'bot',
              avatar_url: parsed.avatar_url || undefined,
              person: parsed.person ? { email: parsed.person.email } : undefined
            });
          } catch (e: any) {
            reject(new Error(`Failed to parse Notion response: ${e.message}`));
          }
        } else {
          let errorMsg = `Notion API Error (${res.statusCode})`;
          try {
            const errObj = JSON.parse(data);
            if (errObj.message) errorMsg += `: ${errObj.message}`;
          } catch (_) {}
          reject(new Error(errorMsg));
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Network request to Notion API failed: ${err.message}`)));
    req.end();
  });
}
