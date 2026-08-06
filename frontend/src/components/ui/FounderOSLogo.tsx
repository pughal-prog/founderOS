'use client';

import React from 'react';

interface FounderOSLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  useVector?: boolean;
}

export default function FounderOSLogo({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-slate-900',
  useVector = false
}: FounderOSLogoProps) {
  const sizeMap = {
    sm: { height: 'h-7', text: 'text-sm sm:text-base', gap: 'gap-2', px: 28 },
    md: { height: 'h-9 sm:h-10', text: 'text-lg sm:text-xl', gap: 'gap-2.5', px: 36 },
    lg: { height: 'h-11 sm:h-12', text: 'text-2xl sm:text-3xl', gap: 'gap-3', px: 44 },
    xl: { height: 'h-14 sm:h-16', text: 'text-3xl sm:text-4xl', gap: 'gap-4', px: 56 }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} ${className} group cursor-pointer select-none`}>
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Glow ambient background aura */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-md opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {useVector ? (
          /* High-Precision SVG Geometric F Growth Vector Icon */
          <svg
            className={`${currentSize.height} w-auto drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-200`}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="logo-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Geometric F Spine & Growth Arrow */}
            <path
              d="M 22 18 L 68 18 C 74 18 78 22 78 28 L 78 30 C 78 36 74 40 68 40 L 42 40 L 42 50 L 60 50 C 64 50 67 53 67 57 L 67 58 C 67 62 64 65 60 65 L 42 65 L 42 82 C 42 85 39 88 35 88 L 29 88 C 25 88 22 85 22 82 Z"
              fill="url(#logo-grad-1)"
            />

            {/* AI Network Nodes Overlay */}
            <circle cx="28" cy="28" r="4.5" fill="#ffffff" />
            <circle cx="55" cy="28" r="4.5" fill="#ffffff" />
            <circle cx="28" cy="57.5" r="4.5" fill="#ffffff" />
            <circle cx="52" cy="57.5" r="4.5" fill="#ffffff" />
            <circle cx="28" cy="80" r="4.5" fill="#ffffff" />

            {/* Upward Growth Arrow Cap */}
            <path
              d="M 62 16 L 84 16 L 84 38 L 76 30 L 62 44 L 54 36 L 68 22 Z"
              fill="url(#logo-grad-2)"
            />
          </svg>
        ) : (
          /* Processed High-Res Transparent Logo Mark */
          <img
            src="/founderos-icon-v2.png"
            alt="FounderOS Logo Mark"
            className={`${currentSize.height} w-auto object-contain filter drop-shadow-[0_0_10px_rgba(6,182,212,0.45)] group-hover:scale-105 transition-transform duration-200`}
          />
        )}
      </div>

      {showText && (
        <span className={`font-black tracking-tight ${currentSize.text} ${textColor}`}>
          Founder<span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">OS</span>
        </span>
      )}
    </div>
  );
}
