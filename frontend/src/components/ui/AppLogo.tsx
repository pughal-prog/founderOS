'use client';

import React from 'react';

interface AppLogoProps {
  appId?: string;
  appName?: string;
  className?: string;
  size?: number;
}

export default function AppLogo({ appId, appName = '', className = 'w-6 h-6', size = 24 }: AppLogoProps) {
  const normalizedId = (appId || appName).toLowerCase();

  // Jira Logo
  if (normalizedId.includes('jira')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.57 11.5L0 23.07C2.7 23.97 5.76 23.47 8.01 21.22L16.27 12.96L11.57 11.5Z" fill="url(#jira_grad_1)"/>
        <path d="M12.43 11.5L24 0C21.3 0 18.24 0.5 15.99 2.75L7.73 11.01L12.43 11.5Z" fill="url(#jira_grad_2)"/>
        <path d="M12 5.51L6.49 11.02L12 16.53L17.51 11.02L12 5.51Z" fill="#0052CC"/>
        <defs>
          <linearGradient id="jira_grad_1" x1="16.27" y1="12.96" x2="0" y2="23.07" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0052CC"/>
            <stop offset="1" stopColor="#2684FF"/>
          </linearGradient>
          <linearGradient id="jira_grad_2" x1="7.73" y1="11.01" x2="24" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0052CC"/>
            <stop offset="1" stopColor="#2684FF"/>
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Gmail Logo
  if (normalizedId.includes('gmail') || normalizedId.includes('email')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6Z" fill="#F44336" fillOpacity="0.1"/>
        <path d="M20 4H4C2.9 4 2 4.9 2 6V7.5L12 13.75L22 7.5V6C22 4.9 21.1 4 20 4Z" fill="#EA4335"/>
        <path d="M2 7.5V18C2 19.1 2.9 20 4 20H7V10.6667L2 7.5Z" fill="#4285F4"/>
        <path d="M22 7.5V18C22 19.1 21.1 20 20 20H17V10.6667L22 7.5Z" fill="#34A853"/>
        <path d="M7 20H17V13.75L12 16.875L7 13.75V20Z" fill="#FBBC04"/>
      </svg>
    );
  }

  // Slack Logo
  if (normalizedId.includes('slack')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165c0-1.393 1.13-2.522 2.522-2.522h2.52v2.522zM6.313 15.165c0-1.393 1.13-2.522 2.522-2.522s2.522 1.13 2.522 2.522v6.313A2.528 2.528 0 0 1 8.835 24a2.528 2.528 0 0 1-2.522-2.522v-6.313z" fill="#E01E5A"/>
        <path d="M8.835 5.042a2.528 2.528 0 0 1-2.522-2.52A2.528 2.528 0 0 1 8.835 0c1.393 0 2.522 1.13 2.522 2.522v2.52H8.835zM8.835 6.313c1.393 0 2.522 1.13 2.522 2.522s-1.13 2.522-2.522 2.522H2.522A2.528 2.528 0 0 1 0 8.835c0-1.393 1.13-2.522 2.522-2.522h6.313z" fill="#36C5F0"/>
        <path d="M18.956 8.835a2.528 2.528 0 0 1 2.522-2.522A2.528 2.528 0 0 1 24 8.835c0 1.393-1.13 2.522-2.522 2.522h-2.522V8.835zM17.687 8.835c0 1.393-1.13 2.522-2.522 2.522s-2.522-1.13-2.522-2.522V2.522A2.528 2.528 0 0 1 15.165 0c1.393 0 2.522 1.13 2.522 2.522v6.313z" fill="#2EB67D"/>
        <path d="M15.165 18.956a2.528 2.528 0 0 1 2.522 2.522A2.528 2.528 0 0 1 15.165 24c-1.393 0-2.522-1.13-2.522-2.522v-2.522h2.522zM15.165 17.687c-1.393 0-2.522-1.13-2.522-2.522s1.13-2.522 2.522-2.522h6.313A2.528 2.528 0 0 1 24 15.165c0 1.393-1.13 2.522-2.522 2.522h-6.313z" fill="#ECB22E"/>
      </svg>
    );
  }

  // Stripe Logo
  if (normalizedId.includes('stripe')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#635BFF"/>
        <path d="M10.74 8.79C10.74 8.21 11.23 7.84 12.06 7.84C13.25 7.84 14.73 8.27 15.65 8.79V5.72C14.61 5.25 13.37 5.04 12.06 5.04C8.61 5.04 6.27 6.83 6.27 9.87C6.27 14.53 12.67 13.97 12.67 16.03C12.67 16.74 12.02 17.06 11.08 17.06C9.69 17.06 8.01 16.48 6.94 15.86V19C8.11 19.53 9.53 19.8 11.08 19.8C14.67 19.8 17.18 18 17.18 14.89C17.18 9.94 10.74 10.66 10.74 8.79Z" fill="white"/>
      </svg>
    );
  }

  // GitHub Logo
  if (normalizedId.includes('github')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="#24292E"/>
      </svg>
    );
  }

  // Notion Logo
  if (normalizedId.includes('notion')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.459 4.208c.746.606 1.026.56 2.424.466l11.607-.746c.326 0 .093-.326-.046-.42L16.486 2.06c-.513-.373-1.26-.653-2.33-.56L2.64 2.387c-.42.046-.56.28-.373.513l2.192 1.308zm.933 3.636v13.613c0 .653.42.98.98.933l13.613-.886c.653-.046.886-.606.886-1.213V6.678c0-.606-.373-.933-.933-.886L5.392 7.844zm11.98.746c.14 0 .28.093.28.326v10.957c0 .28-.186.42-.42.42l-2.005.14c-.28 0-.373-.093-.373-.326V13.86L10.06 18.99l-2.844.186c-.28 0-.42-.14-.42-.373V8.87c0-.233.14-.373.373-.373l2.1.14c.233 0 .326.093.326.326v5.828l4.475-5.222 3.288-.233z" fill="#000000"/>
      </svg>
    );
  }

  // Google Calendar Logo
  if (normalizedId.includes('calendar')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="17" rx="3" fill="#4285F4"/>
        <path d="M3 8H21V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V8Z" fill="white"/>
        <rect x="7" y="2" width="2" height="4" rx="1" fill="#EA4335"/>
        <rect x="15" y="2" width="2" height="4" rx="1" fill="#EA4335"/>
        <path d="M8 12H11V18H8V12Z" fill="#34A853"/>
        <path d="M13 12H16V18H13V12Z" fill="#FBBC04"/>
      </svg>
    );
  }

  // HubSpot Logo
  if (normalizedId.includes('hubspot')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.17 8.35v-2.3a2.38 2.38 0 1 0-2.38 0v2.3a8.2 8.2 0 1 0 4.7 6.13h2.3a1.71 1.71 0 1 0 0-3.42h-2.3a8.13 8.13 0 0 0-2.32-2.71zm-2.38-4.2a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9zm-1.1 11.23a3.83 3.83 0 1 1 3.83-3.83 3.83 3.83 0 0 1-3.83 3.83z" fill="#FF7A59"/>
      </svg>
    );
  }

  // Linear Logo
  if (normalizedId.includes('linear')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12Z" stroke="#5E6AD2" strokeWidth="2.5"/>
        <path d="M6 16.5L16.5 6" stroke="#5E6AD2" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    );
  }

  // Salesforce Logo
  if (normalizedId.includes('salesforce')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11.5c.3-.8.4-1.6.4-2.5 0-3.3-2.7-6-6-6-2.6 0-4.8 1.6-5.6 3.9C4.2 7 3.6 7 3 7c-2.2 0-4 1.8-4 4s1.8 4 4 4c.3 0 .7 0 1-.1 1 2.3 3.3 3.9 6 3.9 2.5 0 4.6-1.4 5.6-3.5.7.4 1.5.6 2.4.6 2.8 0 5-2.2 5-5 0-2.3-1.6-4.3-3.9-4.8z" fill="#00A1E0"/>
      </svg>
    );
  }

  // Zendesk Logo
  if (normalizedId.includes('zendesk')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 8v8l10 6 10-6V8L12 2zm-8 7.33l7-4.2v8.4l-7 4.2V9.33zm16 5.34l-7 4.2v-8.4l7-4.2v8.4z" fill="#03363D"/>
      </svg>
    );
  }

  // Asana Logo
  if (normalizedId.includes('asana')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" fill="#F95738"/>
        <circle cx="6" cy="17" r="4" fill="#F95738"/>
        <circle cx="18" cy="17" r="4" fill="#F95738"/>
      </svg>
    );
  }

  // GitLab Logo
  if (normalizedId.includes('gitlab')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l2.42-7.44a.84.84 0 0 1 1.58-.04l2.19 6.72h9.52l2.19-6.72a.84.84 0 0 1 1.58.04l2.42 7.44a.84.84 0 0 1-.3.94z" fill="#FC6D26"/>
      </svg>
    );
  }

  // Figma Logo
  if (normalizedId.includes('figma')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4z" fill="#0ACF83"/>
        <path d="M4 12c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4z" fill="#A259FF"/>
        <path d="M4 4c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4z" fill="#F24E1E"/>
        <path d="M12 0h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4V0z" fill="#FF7262"/>
        <circle cx="16" cy="12" r="4" fill="#1ABCFE"/>
      </svg>
    );
  }

  // Intercom Logo
  if (normalizedId.includes('intercom')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#1F8CEB"/>
        <path d="M7 8h10M7 12h10M7 16h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }

  // Mixpanel Logo
  if (normalizedId.includes('mixpanel')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="16" r="3" fill="#7856FF"/>
        <circle cx="12" cy="10" r="4" fill="#7856FF"/>
        <circle cx="19" cy="6" r="2" fill="#7856FF"/>
      </svg>
    );
  }

  // Datadog Logo
  if (normalizedId.includes('datadog')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#632CA6"/>
        <path d="M6 16V8l6 4 6-4v8l-6-4-6 4z" fill="white"/>
      </svg>
    );
  }

  // Vercel Logo
  if (normalizedId.includes('vercel')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L24 22H0L12 2Z" fill="#000000"/>
      </svg>
    );
  }

  // Sentry Logo
  if (normalizedId.includes('sentry')) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 22h20L12 2zm0 4.5L18.5 20H5.5L12 6.5z" fill="#FB4226"/>
      </svg>
    );
  }

  // Fallback icon
  return (
    <div className={`rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs ${className}`}>
      {appName.charAt(0).toUpperCase() || 'A'}
    </div>
  );
}
