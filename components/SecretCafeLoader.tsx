"use client";

import { useEffect, useState } from "react";

interface SecretCafeLoaderProps {
  message?: string;
  submessage?: string;
}

export function SecretCafeLoader({
  message = "Brewing your secret",
  submessage = "Please wait while we unlock the café...",
}: SecretCafeLoaderProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #3a2418 0%, #1c1108 55%, #0a0604 100%)",
      }}
    >
      {/* Ambient candle glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,170,80,0.25) 0%, rgba(255,120,40,0.08) 40%, transparent 70%)",
          animation: "cafe-flicker 3.5s ease-in-out infinite",
        }}
      />

      {/* Subtle grain / film noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      {/* Cup + steam */}
      <div className="relative flex flex-col items-center">
        {/* Steam */}
        <div className="relative mb-3 flex h-20 w-24 items-end justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-16 w-1.5 rounded-full bg-gradient-to-t from-transparent via-amber-100/40 to-transparent blur-[2px]"
              style={{
                animation: `cafe-steam 2.6s ease-in-out ${i * 0.4}s infinite`,
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Coffee cup (SVG) */}
        <svg
          width="140"
          height="120"
          viewBox="0 0 140 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_10px_30px_rgba(255,140,60,0.35)]"
        >
          <defs>
            <linearGradient id="cup" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5e6d3" />
              <stop offset="100%" stopColor="#c9a37a" />
            </linearGradient>
            <radialGradient id="coffee" cx="0.5" cy="0.4" r="0.6">
              <stop offset="0%" stopColor="#6b3a1c" />
              <stop offset="100%" stopColor="#2a1408" />
            </radialGradient>
          </defs>
          {/* Saucer */}
          <ellipse cx="70" cy="108" rx="58" ry="6" fill="#1a0e06" opacity="0.6" />
          <ellipse cx="70" cy="104" rx="52" ry="6" fill="url(#cup)" opacity="0.9" />
          {/* Handle */}
          <path
            d="M108 50 Q132 55 128 75 Q124 92 104 90"
            stroke="url(#cup)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Cup body */}
          <path
            d="M22 42 H110 L104 96 Q102 104 92 104 H40 Q30 104 28 96 Z"
            fill="url(#cup)"
          />
          {/* Coffee surface */}
          <ellipse cx="66" cy="44" rx="44" ry="7" fill="url(#coffee)" />
          {/* Foam highlight */}
          <ellipse cx="60" cy="42" rx="14" ry="2" fill="#f5e6d3" opacity="0.45" />
        </svg>

        {/* Logo / lockup */}
        <div className="mt-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-amber-200/40" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-amber-200/70">
              Members Only
            </span>
            <span className="h-px w-10 bg-amber-200/40" />
          </div>
          <h1
            className="text-3xl font-light italic text-amber-50 sm:text-4xl"
            style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
          >
            The Secret Café
          </h1>
          <p className="mt-3 text-sm text-amber-200/70">
            {message}
            <span className="inline-block w-6 text-left">{dots}</span>
          </p>
          <p className="mt-1 text-xs text-amber-100/40">{submessage}</p>
        </div>

        {/* Progress shimmer bar */}
        <div className="mt-8 h-[2px] w-56 overflow-hidden rounded-full bg-amber-200/10">
          <div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-amber-300 to-transparent"
            style={{ animation: "cafe-shimmer 1.6s linear infinite" }}
          />
        </div>
      </div>

      <span className="sr-only">Loading, please wait</span>

      {/* Keyframes */}
      <style>{`
        @keyframes cafe-steam {
          0%   { transform: translateY(10px) scaleX(1);   opacity: 0; }
          30%  { opacity: 0.9; }
          100% { transform: translateY(-40px) scaleX(1.6); opacity: 0; }
        }
        @keyframes cafe-flicker {
          0%, 100% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 1;    transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes cafe-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

export default SecretCafeLoader;
