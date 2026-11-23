"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BASE_HOURS, phases, type Phase } from "./curriculum";

type State = {
  topics: Record<string, number>; // 0..3
  resources: Record<string, boolean>;
  deliverables: Record<string, boolean>;
  hours: number;
  startedAt?: string;
};

const EMPTY: State = { topics: {}, resources: {}, deliverables: {}, hours: BASE_HOURS };
const KEY = "ai-eng-path:v1";

type Ctx = {
  state: State;
  ready: boolean;
  setTopic: (id: string, v: number) => void;
  toggleResource: (id: string) => void;
  toggleDeliverable: (id: string) => void;
  setHours: (h: number) => void;
  replace: (s: State) => void;
  reset: () => void;
};

const ProgressCtx = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  const stamp = (s: State): State => (s.startedAt ? s : { ...s, startedAt: new Date().toISOString() });

  const setTopic = useCallback(
    (id: string, v: number) => setState((s) => stamp({ ...s, topics: { ...s.topics, [id]: v } })),
    [],
  );
  const toggleResource = useCallback(
    (id: string) => setState((s) => stamp({ ...s, resources: { ...s.resources, [id]: !s.resources[id] } })),
    [],
  );
  const toggleDeliverable = useCallback(
    (id: string) =>
      setState((s) => stamp({ ...s, deliverables: { ...s.deliverables, [id]: !s.deliverables[id] } })),
    [],
  );
  const setHours = useCallback((h: number) => setState((s) => ({ ...s, hours: h })), []);
  const replace = useCallback((s: State) => setState({ ...EMPTY, ...s }), []);
  const reset = useCallback(() => setState(EMPTY), []);

  const value = useMemo(
    () => ({ state, ready, setTopic, toggleResource, toggleDeliverable, setHours, replace, reset }),
    [state, ready, setTopic, toggleResource, toggleDeliverable, setHours, replace, reset],
  );
  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error("useProgress outside provider");
  return ctx;
}

/** Topics weigh by state (0..3)/3; resources only count "core" tier; deliverables count 1 each. */
export function phaseProgress(p: Phase, s: State) {
  const core = p.resources.filter((r) => r.tier === "core");
  const total = p.topics.length + core.length + p.project.deliverables.length;
  const done =
    p.topics.reduce((a, t) => a + (s.topics[t.id] ?? 0) / 3, 0) +
    core.filter((r) => s.resources[r.id]).length +
    p.project.deliverables.filter((d) => s.deliverables[d.id]).length;
  return total ? done / total : 0;
}

export function overallProgress(s: State) {
  const vals = phases.map((p) => phaseProgress(p, s));
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function currentPhase(s: State) {
  return phases.find((p) => phaseProgress(p, s) < 0.999) ?? phases[phases.length - 1];
}

export function scaledWeeks(weeks: [number, number], hours: number): string {
  const f = BASE_HOURS / hours;
  const a = Math.max(0.5, Math.round(weeks[0] * f * 2) / 2);
  const b = Math.max(0.5, Math.round(weeks[1] * f * 2) / 2);
  const fmt = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));
  return a === b ? `${fmt(a)} wk${a === 1 ? "" : "s"}` : `${fmt(a)}–${fmt(b)} wks`;
}

export type { State as ProgressState };
