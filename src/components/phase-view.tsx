"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock, Hammer, Lightbulb, Sparkles } from "lucide-react";
import { getPhase, phases, TOPIC_STATES, type Resource } from "@/lib/curriculum";
import { phaseProgress, scaledWeeks, useProgress } from "@/lib/progress";
import { phaseIcons, typeMeta } from "./icons";
import { ProgressRing } from "./progress-ring";
import { Reveal } from "./reveal";
import { Spotlight } from "./spotlight";

const ease = [0.22, 1, 0.36, 1] as const;
const STATE_COLORS = ["#6b7280", "#38bdf8", "#fbbf24", "#34d399"];

function ytId(url: string) {
  const m = url.match(/[?&]v=([\w-]{11})/);
  return m?.[1];
}

export function PhaseView({ slug }: { slug: string }) {
  const p = getPhase(slug)!;
  const { state, ready, setTopic, toggleResource, toggleDeliverable } = useProgress();
  const Icon = phaseIcons[p.icon];
  const prog = ready ? phaseProgress(p, state) : 0;
  const prev = phases[p.num - 1];
  const next = phases[p.num + 1];
  const h = p.hue;

  const tiers: { key: Resource["tier"]; title: string; sub: string }[] = [
    { key: "core", title: "Start here", sub: "Your main path. These count towards phase progress." },
    { key: "deep", title: "Go deeper", sub: "For when a concept hasn't clicked, or you want more depth." },
    { key: "ref", title: "Bookmark", sub: "Reference material to keep open while you build." },
  ];

  return (
    <div className="relative" style={{ ["--h" as string]: h }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-14 -z-10 h-[520px]"
        style={{ background: `radial-gradient(60% 60% at 50% 0%, hsl(${h} 90% 50% / 0.22), transparent 70%)` }}
      />
      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        <Link href="/#roadmap" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <ArrowLeft className="size-4" /> All phases
        </Link>

        {/* phase stepper */}
        <div className="mt-6 flex gap-1.5">
          {phases.map((q) => (
            <Link key={q.slug} href={`/phase/${q.slug}`} className="group flex-1 py-2" aria-label={q.title}>
              <div className="relative h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: `hsl(${q.hue} 90% 65%)` }}
                  initial={false}
                  animate={{ width: `${(ready ? phaseProgress(q, state) : 0) * 100}%` }}
                />
                {q.slug === p.slug && <div className="absolute inset-0 rounded-full ring-1 ring-white/70" />}
              </div>
            </Link>
          ))}
        </div>

        {/* header */}
        <header className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease }}
              className="mb-6 grid size-16 place-items-center rounded-2xl border bg-bg"
              style={{ borderColor: `hsl(${h} 80% 60% / 0.5)`, boxShadow: `0 0 60px -10px hsl(${h} 90% 60% / 0.8)` }}
            >
              <Icon className="size-7" style={{ color: `hsl(${h} 90% 72%)` }} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, ease }}>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono text-muted">PHASE {p.num} / {phases.length - 1}</span>
                <span className="rounded-full px-2 py-0.5" style={{ background: `hsl(${h} 80% 60% / 0.14)`, color: `hsl(${h} 90% 76%)` }}>
                  Priority: {p.priority}
                </span>
                <span className="inline-flex items-center gap-1 text-muted">
                  <Clock className="size-3" /> {scaledWeeks(p.weeks, state.hours)}
                </span>
              </div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{p.title}</h1>
              <p className="mt-3 max-w-2xl text-lg text-muted">{p.tagline}</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3">
            <ProgressRing value={prog} hue={h} size={84} stroke={6} />
            <div className="text-xs text-muted">
              phase
              <br />
              complete
            </div>
          </motion.div>
        </header>

        <Reveal className="mt-10 grid gap-4 md:grid-cols-5">
          <p className="leading-relaxed text-fg/85 md:col-span-3">{p.intro}</p>
          <div
            className="flex gap-3 rounded-2xl border p-4 text-sm md:col-span-2"
            style={{ borderColor: `hsl(${h} 80% 60% / 0.25)`, background: `hsl(${h} 80% 60% / 0.05)` }}
          >
            <Lightbulb className="mt-0.5 size-4 shrink-0" style={{ color: `hsl(${h} 90% 72%)` }} />
            <p className="text-fg/80">{p.heads}</p>
          </div>
        </Reveal>

        {/* resources */}
        {tiers.map((t) => {
          const list = p.resources.filter((r) => r.tier === t.key);
          if (!list.length) return null;
          return (
            <section key={t.key} className="mt-16">
              <Reveal className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{t.title}</h2>
                  <p className="mt-1 text-sm text-muted">{t.sub}</p>
                </div>
                <span className="font-mono text-xs text-muted">
                  {list.filter((r) => state.resources[r.id]).length}/{list.length}
                </span>
              </Reveal>
              {(t.key === "ref"
                ? [list]
                : [list.filter((r) => ytId(r.url)), list.filter((r) => !ytId(r.url))]
              )
                .filter((g) => g.length)
                .map((group, gi) => (
                  <div
                    key={gi}
                    className={`mb-4 grid gap-4 ${t.key === "ref" || gi === 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}
                  >
                    {group.map((r, i) => (
                      <Reveal key={r.id} delay={i * 0.05}>
                        <ResourceCard
                          r={r}
                          hue={h}
                          done={!!state.resources[r.id]}
                          onToggle={() => toggleResource(r.id)}
                          compact={t.key === "ref"}
                          first={t.key === "core" && r.id === list[0].id}
                        />
                      </Reveal>
                    ))}
                  </div>
                ))}
            </section>
          );
        })}

        {/* topics */}
        <section className="mt-20">
          <Reveal className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">Topics to master</h2>
            <p className="mt-1 text-sm text-muted">
              Move each one through Learning → Implementing → Completed. Only mark it complete when you can explain it,
              build it and debug it.
            </p>
          </Reveal>
          <div className="overflow-hidden rounded-2xl border border-line bg-white/[0.02]">
            {p.topics.map((t, i) => {
              const v = state.topics[t.id] ?? 0;
              return (
                <Reveal key={t.id} delay={i * 0.03} y={8} className="flex flex-col gap-3 border-b border-line p-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <motion.span
                      className="mt-1.5 size-2 shrink-0 rounded-full"
                      animate={{ backgroundColor: STATE_COLORS[v], boxShadow: `0 0 12px ${STATE_COLORS[v]}` }}
                    />
                    <div>
                      <div className={`font-medium ${v === 3 ? "text-fg/60 line-through decoration-emerald-400/60" : ""}`}>{t.name}</div>
                      <div className="text-sm text-muted">{t.detail}</div>
                    </div>
                  </div>
                  <div className="relative flex w-full shrink-0 rounded-full border border-line bg-black/30 p-0.5 text-[11px] sm:text-xs md:w-auto">
                    {TOPIC_STATES.map((label, si) => (
                      <button
                        key={label}
                        onClick={() => setTopic(t.id, si)}
                        className={`relative flex-1 whitespace-nowrap rounded-full px-1.5 py-1 transition sm:px-3 md:flex-none ${v === si ? "text-black" : "text-muted hover:text-fg"}`}
                      >
                        {v === si && (
                          <motion.span
                            layoutId={`seg-${t.id}`}
                            className="absolute inset-0 rounded-full"
                            style={{ background: si === 0 ? "#d4d4d8" : STATE_COLORS[si] }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                          />
                        )}
                        <span className="relative">{label}</span>
                      </button>
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* project */}
        <section className="mt-20">
          <Reveal>
            <Spotlight hue={h} conic className="overflow-hidden p-6 sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full blur-3xl"
                style={{ background: `hsl(${h} 90% 55% / 0.18)` }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 font-mono text-xs" style={{ color: `hsl(${h} 90% 75%)` }}>
                  <Hammer className="size-3.5" /> PHASE PROJECT · SHIP BEFORE YOU MOVE ON
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{p.project.title}</h2>
                <p className="mt-2 max-w-2xl text-muted">{p.project.summary}</p>
                <ul className="mt-6 space-y-2">
                  {p.project.deliverables.map((d) => {
                    const done = !!state.deliverables[d.id];
                    return (
                      <li key={d.id}>
                        <button
                          onClick={() => toggleDeliverable(d.id)}
                          className="group flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-white/[0.04]"
                        >
                          <Checkbox done={done} hue={h} />
                          <span className={`text-sm transition ${done ? "text-muted line-through" : ""}`}>{d.text}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.project.stack.map((s) => (
                    <span key={s} className="rounded-md border border-line bg-black/30 px-2 py-1 font-mono text-xs text-muted">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Spotlight>
          </Reveal>
        </section>

        {/* prev / next */}
        <nav className="mt-16 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link href={`/phase/${prev.slug}`} className="group rounded-2xl border border-line p-5 transition hover:bg-white/[0.03]">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" /> Phase {prev.num}
              </div>
              <div className="mt-1 font-medium">{prev.title}</div>
            </Link>
          ) : (
            <div />
          )}
          {next && (
            <Link href={`/phase/${next.slug}`} className="group rounded-2xl border border-line p-5 text-right transition hover:bg-white/[0.03]">
              <div className="flex items-center justify-end gap-1.5 text-xs text-muted">
                Phase {next.num} <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
              </div>
              <div className="mt-1 font-medium">{next.title}</div>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

function Checkbox({ done, hue }: { done: boolean; hue: number }) {
  return (
    <span
      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition"
      style={{
        borderColor: done ? `hsl(${hue} 90% 65%)` : "rgba(255,255,255,0.2)",
        background: done ? `hsl(${hue} 90% 65%)` : "transparent",
      }}
    >
      <AnimatePresence>
        {done && (
          <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}>
            <Check className="size-3.5 text-black" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function ResourceCard({
  r,
  hue,
  done,
  onToggle,
  compact,
  first,
}: {
  r: Resource;
  hue: number;
  done: boolean;
  onToggle: () => void;
  compact?: boolean;
  first?: boolean;
}) {
  const T = typeMeta[r.type];
  const vid = r.type === "video" ? ytId(r.url) : undefined;
  return (
    <Spotlight hue={hue} conic={first} className={`group flex h-full flex-col overflow-hidden ${done ? "opacity-70" : ""}`}>
      {vid && !compact && (
        <a href={r.url} target="_blank" rel="noreferrer" className="relative block aspect-video overflow-hidden rounded-t-2xl border-b border-line">
          <Image
            src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 640px) 480px, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          {r.duration && (
            <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-[11px] backdrop-blur">{r.duration}</span>
          )}
        </a>
      )}
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="flex items-center gap-2 text-xs text-muted">
          <T.icon className="size-3.5" style={{ color: `hsl(${hue} 90% 72%)` }} />
          <span>{T.label}</span>
          {r.duration && !vid && <span>· {r.duration}</span>}
          {first && (
            <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-black">PRIMARY</span>
          )}
          {r.upgraded && (
            <span className="inline-flex items-center gap-0.5 rounded-full border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5 text-[10px] text-violet-200" title="Added or upgraded in the curated version of this plan">
              <Sparkles className="size-2.5" /> Curated pick
            </span>
          )}
          {r.paid && <span className="rounded-full border border-amber-400/30 px-1.5 py-0.5 text-[10px] text-amber-200">Paid</span>}
        </div>
        <a href={r.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-start gap-1 font-medium leading-snug hover:underline hover:decoration-white/30 hover:underline-offset-4">
          {r.title}
          <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
        </a>
        <div className="mt-0.5 text-xs text-muted">{r.by}</div>
        {!compact && <p className="mt-3 text-sm text-fg/75">{r.note}</p>}
        {compact && <p className="mt-2 text-xs text-muted">{r.note}</p>}
        <div className="mt-auto pt-4">
          <button onClick={onToggle} className="inline-flex items-center gap-2 text-xs text-muted transition hover:text-fg">
            <Checkbox done={done} hue={hue} />
            {done ? "Done" : "Mark as done"}
          </button>
        </div>
      </div>
    </Spotlight>
  );
}
