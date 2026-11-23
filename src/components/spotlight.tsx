"use client";
import { useRef } from "react";

export function Spotlight({
  hue = 265,
  className = "",
  children,
  conic = false,
}: {
  hue?: number;
  className?: string;
  children: React.ReactNode;
  conic?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      style={{ ["--h" as string]: hue }}
      className={`spot ${conic ? "ring-conic" : ""} rounded-2xl border border-line bg-white/[0.025] backdrop-blur-sm transition-colors hover:border-white/15 ${className}`}
    >
      {children}
    </div>
  );
}
