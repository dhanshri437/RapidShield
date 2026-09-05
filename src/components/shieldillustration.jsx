import React from 'react';

export default function ShieldIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Shield with fingerprint and checkmark illustration representing local evidence protection"
    >
      <defs>
        <linearGradient id="rs-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <linearGradient id="rs-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.25)" />
          <stop offset="100%" stopColor="hsl(var(--accent) / 0.15)" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="160" r="150" fill="url(#rs-glow)" />

      {/* Shield */}
      <path
        d="M160 48 L252 84 V160 C252 214 212 252 160 272 C108 252 68 214 68 160 V84 Z"
        fill="hsl(var(--card))"
        stroke="url(#rs-shield)"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Fingerprint arcs */}
      <g stroke="url(#rs-shield)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M160 120 C130 120 110 140 110 168 C110 188 118 204 130 216" />
        <path d="M160 132 C138 132 122 150 122 170 C122 186 128 200 138 210" />
        <path d="M160 144 C146 144 134 156 134 172 C134 184 138 196 146 206" />
        <path d="M160 120 C190 120 210 140 210 168 C210 188 202 204 190 216" />
        <path d="M160 132 C182 132 198 150 198 170 C198 186 192 200 182 210" />
        <path d="M160 144 C174 144 186 156 186 172 C186 184 182 196 174 206" />
        <path d="M160 156 C168 156 174 162 174 170 C174 180 170 190 164 198" />
      </g>

      {/* Checkmark badge */}
      <circle cx="216" cy="216" r="30" fill="hsl(var(--card))" stroke="hsl(var(--success))" strokeWidth="4" />
      <path
        d="M202 216 L212 226 L232 204"
        stroke="hsl(var(--success))"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}