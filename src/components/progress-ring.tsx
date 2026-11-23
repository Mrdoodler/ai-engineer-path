"use client";
import { motion } from "motion/react";

export function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  hue = 265,
  label = true,
}: {
  value: number;
  size?: number;
  stroke?: number;
  hue?: number;
  label?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `g${hue}${size}`;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue} 95% 72%)`} />
            <stop offset="100%" stopColor={`hsl(${(hue + 50) % 360} 95% 62%)`} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.min(1, value)) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {label && (
        <span className="absolute font-mono text-[11px] tabular-nums text-fg/90">{Math.round(value * 100)}%</span>
      )}
    </div>
  );
}
