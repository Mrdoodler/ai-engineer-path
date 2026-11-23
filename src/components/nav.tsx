"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "motion/react";
import { overallProgress, useProgress } from "@/lib/progress";
import { GithubIcon, REPO_URL } from "./icons";

const links = [
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/#plan", label: "Plan" },
  { href: "/#projects", label: "Projects" },
  { href: "/#stack", label: "Stack" },
];

export function Nav() {
  const { state, ready } = useProgress();
  const pct = ready ? Math.round(overallProgress(state) * 100) : 0;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-line bg-bg/60 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative grid size-7 place-items-center rounded-lg bg-gradient-to-br from-violet-500 via-sky-500 to-emerald-400 shadow-[0_0_24px_-4px] shadow-violet-500/60">
              <span className="font-mono text-[11px] font-bold text-black">AI</span>
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Engineer<span className="text-muted">.path</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted transition hover:bg-white/5 hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-line bg-white/[0.03] py-1 pl-3 pr-1 text-xs">
              <span className="text-muted">Progress</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono tabular-nums">{pct}%</span>
            </div>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-white/5 hover:text-fg"
            >
              <GithubIcon className="size-4" />
            </a>
          </div>
        </nav>
      </div>
      {path !== "/" && (
        <motion.div
          style={{ scaleX }}
          className="h-px origin-left bg-gradient-to-r from-violet-500 via-sky-400 to-emerald-400"
        />
      )}
    </header>
  );
}
