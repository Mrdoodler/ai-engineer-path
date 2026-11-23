"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Clock, Download, Hammer, RotateCcw, Upload, Target, Ban } from "lucide-react";
import { months, PACES, phases, portfolio, rules, stack } from "@/lib/curriculum";
import { currentPhase, overallProgress, phaseProgress, scaledWeeks, useProgress } from "@/lib/progress";
import { phaseIcons } from "./icons";
import { ProgressRing } from "./progress-ring";
import { Reveal } from "./reveal";
import { Spotlight } from "./spotlight";

const totalResources = phases.reduce((a, p) => a + p.resources.length, 0);
const ease = [0.22, 1, 0.36, 1] as const;

export function SectionHead({ kicker, title, sub }: { kicker: string; title: React.ReactNode; sub?: string }) {
  return (
    <Reveal className="mb-10 max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">{kicker}</p>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-muted">{sub}</p>}
    </Reveal>
  );
}

/* ---------------- HERO ---------------- */
export function Hero() {
  const { state, ready } = useProgress();
  const started = ready && overallProgress(state) > 0;
  const cur = currentPhase(state);
  const words = ["LLMs", "RAG", "Agents", "Evals", "Production"];

  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-muted backdrop-blur"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        Applied AI engineering · 2026 edition
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease }}
        className="mx-auto max-w-4xl text-center text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl"
      >
        From full-stack dev
        <br />
        to <span className="font-serif text-[1.12em] font-normal italic text-shine">AI engineer.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease }}
        className="mx-auto mt-6 max-w-2xl text-center text-base text-muted sm:text-lg"
      >
        A nine-phase curriculum for building, evaluating and shipping production AI systems. Each phase has a
        hand-picked resource stack, a topic tracker and a portfolio project.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease }}
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          href={`/phase/${cur.slug}`}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black shadow-[0_0_40px_-8px] shadow-violet-400/70 transition hover:shadow-violet-400"
        >
          {started ? `Continue · Phase ${cur.num}: ${cur.short}` : "Start with Phase 0"}
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/#roadmap"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-5 py-2.5 text-sm text-fg backdrop-blur transition hover:bg-white/[0.07]"
        >
          See the roadmap
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-10 flex flex-wrap justify-center gap-2"
      >
        {words.map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.07, ease }}
            className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted"
          >
            {w}
          </motion.span>
        ))}
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
        {[
          ["9", "phases"],
          [String(totalResources), "curated resources"],
          ["9 + 4", "projects"],
          ["~6", "months @ 11h/wk"],
        ].map(([n, l], i) => (
          <Reveal key={l} delay={0.05 * i} y={10} className="bg-bg/80 px-5 py-5 text-center backdrop-blur">
            <div className="text-2xl font-semibold tracking-tight">{n}</div>
            <div className="mt-1 text-xs text-muted">{l}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- ROADMAP TIMELINE ---------------- */
export function Roadmap() {
  const { state, ready } = useProgress();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="roadmap" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHead
        kicker="The curriculum"
        title={
          <>
            Nine phases, <span className="font-serif font-normal italic">in order.</span>
          </>
        }
        sub="Go one phase at a time. Don't move on until you've shipped the phase project. Durations adjust to the weekly pace you set in the plan below."
      />
      <div ref={ref} className="relative">
        <div className="absolute bottom-0 left-[19px] top-0 w-px bg-line sm:left-[27px]" />
        <motion.div
          style={{ height: h }}
          className="absolute left-[19px] top-0 w-px bg-gradient-to-b from-violet-400 via-sky-400 to-emerald-400 shadow-[0_0_12px] shadow-sky-400 sm:left-[27px]"
        />
        <div className="space-y-5">
          {phases.map((p, i) => {
            const Icon = phaseIcons[p.icon];
            const prog = ready ? phaseProgress(p, state) : 0;
            const done = prog >= 0.999;
            return (
              <Reveal key={p.slug} delay={Math.min(i * 0.03, 0.15)} className="relative pl-14 sm:pl-20">
                  <div
                    className="absolute left-0 top-5 grid size-10 place-items-center rounded-xl border bg-bg sm:size-14 sm:rounded-2xl"
                    style={{
                      borderColor: `hsl(${p.hue} 80% 60% / ${done ? 0.9 : 0.35})`,
                      boxShadow: `0 0 30px -8px hsl(${p.hue} 90% 60% / 0.6)`,
                    }}
                  >
                    <Icon className="size-4 sm:size-6" style={{ color: `hsl(${p.hue} 90% 72%)` }} />
                  </div>
                  <Link href={`/phase/${p.slug}`} className="group block">
                    <Spotlight hue={p.hue} className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono text-muted">PHASE {p.num}</span>
                            <span
                              className="rounded-full px-2 py-0.5 font-medium"
                              style={{ background: `hsl(${p.hue} 80% 60% / 0.12)`, color: `hsl(${p.hue} 90% 75%)` }}
                            >
                              {p.priority}
                            </span>
                            <span className="inline-flex items-center gap-1 text-muted">
                              <Clock className="size-3" /> {scaledWeeks(p.weeks, state.hours)}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{p.title}</h3>
                          <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                            <span>{p.resources.length} resources</span>
                            <span>{p.topics.length} topics</span>
                            <span className="inline-flex items-center gap-1">
                              <Hammer className="size-3" /> {p.project.title}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-3">
                          <ProgressRing value={prog} hue={p.hue} size={52} />
                          <ArrowUpRight className="size-4 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                        </div>
                      </div>
                    </Spotlight>
                  </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PLAN ---------------- */
export function Plan() {
  const { state, setHours } = useProgress();
  const maxW = Math.max(...phases.map((p) => p.weeks[1]));
  const totalWeeks = phases.reduce((a, p) => a + (p.weeks[0] + p.weeks[1]) / 2, 0) * (11 / state.hours);

  return (
    <section id="plan" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHead
        kicker="Execution plan"
        title={
          <>
            Six months, <span className="font-serif font-normal italic">give or take.</span>
          </>
        }
        sub="Treat it as a working estimate, not a deadline. Pick your realistic weekly hours and every duration on the site updates."
      />

      <Reveal className="mb-8 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm text-muted">Weekly pace</span>
        {PACES.map((p) => {
          const active = state.hours === p.hours;
          return (
            <button
              key={p.hours}
              onClick={() => setHours(p.hours)}
              className={`relative rounded-full px-4 py-1.5 text-sm transition ${active ? "text-black" : "text-muted hover:text-fg"}`}
            >
              {active && (
                <motion.span layoutId="pace" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
              )}
              <span className="relative">{p.label}</span>
            </button>
          );
        })}
        <span className="ml-auto font-mono text-sm text-muted">
          ≈ <span className="text-fg">{Math.round(totalWeeks)}</span> weeks total
        </span>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <Spotlight className="h-full p-6">
            <h3 className="mb-5 text-sm font-medium text-muted">Time allocation (weeks, at your pace)</h3>
            <div className="space-y-3">
              {phases.map((p, i) => {
                const avg = ((p.weeks[0] + p.weeks[1]) / 2) * (11 / state.hours);
                return (
                  <div key={p.slug} className="grid grid-cols-[88px_1fr_36px] items-center gap-3 text-xs">
                    <span className="truncate text-muted">{p.short}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, hsl(${p.hue} 90% 60%), hsl(${p.hue + 30} 90% 70%))` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(avg / (maxW * (11 / 6))) * 100}%` }}
                        transition={{ duration: 0.9, delay: i * 0.05, ease }}
                      />
                    </div>
                    <span className="text-right font-mono tabular-nums">{avg.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </Spotlight>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {months.map((m, i) => (
            <Reveal key={m.m} delay={i * 0.05}>
              <Spotlight className="h-full p-5">
                <div className="font-serif text-4xl italic text-white/25">0{m.m}</div>
                <div className="mt-2 text-sm font-medium">{m.focus}</div>
                <div className="mt-2 flex items-start gap-1.5 text-xs text-muted">
                  <Target className="mt-0.5 size-3 shrink-0" />
                  {m.outcome}
                </div>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PORTFOLIO ---------------- */
export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <SectionHead
        kicker="Portfolio"
        title={
          <>
            Four serious systems. <span className="font-serif font-normal italic">Zero toy chatbots.</span>
          </>
        }
        sub="Each one gets a README, an architecture diagram, setup steps and eval results."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {portfolio.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <Link href={`/phase/${p.phase}`} className="group block h-full">
              <Spotlight hue={p.hue} className="h-full overflow-hidden p-6">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `hsl(${p.hue} 90% 55% / 0.25)`, opacity: 0.5 }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted">PROJECT 0{i + 1}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{ background: `hsl(${p.hue} 80% 60% / 0.12)`, color: `hsl(${p.hue} 90% 75%)` }}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{p.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="rounded-md border border-line bg-white/[0.03] px-2 py-1 text-xs text-muted">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Spotlight>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- STACK ---------------- */
export function Stack() {
  const all = stack.flatMap((s) => s.items);
  return (
    <section id="stack" className="scroll-mt-20 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          kicker="Tech stack"
          title={
            <>
              Learn one tool well, <span className="font-serif font-normal italic">not six badly.</span>
            </>
          }
          sub="Keep React/Next.js on the frontend and use Python/FastAPI for AI services. Your existing strengths carry straight over."
        />
      </div>
      <div className="marquee-mask relative overflow-hidden py-2">
        <div className="marquee flex w-max gap-3">
          {[...all, ...all].map((t, i) => (
            <span key={i} className="whitespace-nowrap rounded-full border border-line bg-white/[0.03] px-4 py-2 text-sm text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {stack.map((s, i) => (
          <Reveal key={s.group} delay={i * 0.04}>
            <Spotlight className="h-full p-5">
              <div className="text-xs font-mono uppercase tracking-wider text-muted">{s.group}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <span key={it} className="text-sm">
                    {it}
                    <span className="text-white/20 last:hidden"> · </span>
                  </span>
                ))}
              </div>
            </Spotlight>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- RULES ---------------- */
export function Rules() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHead
        kicker="Operating principles"
        title={
          <>
            The rules <span className="font-serif font-normal italic">of the road.</span>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rules.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.04}>
            <Spotlight className="h-full p-5">
              <div className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-3 font-medium">{r.title}</div>
              <p className="mt-1.5 text-sm text-muted">{r.body}</p>
            </Spotlight>
          </Reveal>
        ))}
        <Reveal delay={0.3}>
          <Spotlight hue={145} className="h-full p-5" conic>
            <div className="font-mono text-xs text-emerald-300">DEFINITION OF DONE</div>
            <p className="mt-3 text-sm text-muted">
              A topic is <span className="text-fg">Completed</span> only when you can explain it, implement it without
              copying a tutorial, and debug its common failures.
            </p>
          </Spotlight>
        </Reveal>
      </div>
      <Reveal className="mt-4">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5 text-sm">
          <Ban className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <p className="text-muted">
            <span className="text-fg">Not now:</span> fine-tuning, heavy ML maths, PyTorch and training models from
            scratch. They&apos;re valuable for ML-engineering roles, but they aren&apos;t prerequisites for your first applied AI
            engineering job. They live in Phase 8.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- DATA TOOLS ---------------- */
export function DataTools() {
  const { state, replace, reset } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ai-engineer-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-white/[0.02] p-5 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-medium">Your progress lives in this browser</div>
            <div className="text-xs text-muted">Export a backup, or import it on another device.</div>
          </div>
          <div className="flex gap-2">
            <button onClick={exportJson} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs hover:bg-white/5">
              <Download className="size-3.5" /> Export
            </button>
            <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs hover:bg-white/5">
              <Upload className="size-3.5" /> Import
            </button>
            <ResetButton onReset={reset} />
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  replace(JSON.parse(await f.text()));
                } catch {}
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  const armed = useRef(false);
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={btn}
      onClick={() => {
        if (armed.current) {
          onReset();
          armed.current = false;
          btn.current!.lastChild!.textContent = "Reset";
          return;
        }
        armed.current = true;
        btn.current!.lastChild!.textContent = "Click again to confirm";
        setTimeout(() => {
          armed.current = false;
          if (btn.current) btn.current.lastChild!.textContent = "Reset";
        }, 3000);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-red-400/40 hover:text-red-300"
    >
      <RotateCcw className="size-3.5" />
      <span>Reset</span>
    </button>
  );
}
