/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Pure analysis of UX study sessions recorded by UXStudyRecorder.js.
 * No DOM access, so it runs in the viewer page, in Node, or in an agent.
 *
 *   analyzeUXStudies([session, session, ...]) -> { participants, controls, findings, tasks }
 *   uxStudyReportMarkdown(analysis) -> written findings report
 *
 * Findings are heuristics, not verdicts: each one carries its evidence
 * (how many participants, how often, which control) so a human can judge it.
 */
export const UX_STUDY_ANALYZER_VERSION = 1;

const RAGE_WINDOW_MS = 1000;
const RAGE_RADIUS_PX = 32;
const RAGE_MIN_CLICKS = 3;
const DEAD_CLICK_EFFECT_MS = 1000;
const HESITATION_MS = 1500;
const LATE_DISCOVERY_MS = 30000;
const BACKTRACK_MS = 10000;
const ESCAPE_AFTER_CLICK_MS = 3000;
const SMALL_TARGET_PX = 24;
const NEAR_MISS_PX = 16;

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

const dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

// WCAG relative luminance contrast from computed rgb()/rgba() strings
const parseRGBA = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) {
    return null;
  }
  const parts = m[1].split(/[\s,/]+/).filter((p) => p !== "");
  if (parts.length < 3) {
    return null;
  }
  return {
    r: parseFloat(parts[0]),
    g: parseFloat(parts[1]),
    b: parseFloat(parts[2]),
    a: parts.length > 3 ? parseFloat(parts[3]) : 1,
  };
};
const luminance = (c) => {
  const ch = [c.r, c.g, c.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
};
export const contrastRatio = (fg, bg) => {
  const a = parseRGBA(fg);
  const b = parseRGBA(bg);
  // only judge when the control paints its own opaque background
  if (!a || !b || b.a < 1 || a.a < 1) {
    return null;
  }
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (
    Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) /
    100
  );
};

// clicks on bare page background have no path; group them under one key
const controlKey = (target) => {
  if (!target) {
    return "";
  }
  return target.path ? target.path : "(page background)";
};

const controlName = (c) => {
  if (!c) {
    return "(unknown)";
  }
  if (c.label) {
    return `"${c.label}" (${c.tag || "element"})`;
  }
  if (!c.path) {
    return "empty page background";
  }
  return `${c.tag || "element"} at ${c.path}`;
};

const sortedEvents = (session) =>
  (session.events || []).slice().sort((a, b) => a.t - b.t);

/**
 * Split a session into tasks by researcher marks
 */
const tasksFor = (session, events) => {
  const end =
    session.durationMs || (events.length ? events[events.length - 1].t : 0);
  const marks = events.filter((e) => e.type === "mark");
  const tasks = [];
  if (!marks.length || marks[0].t > 2000) {
    tasks.push({ label: "(before first mark)", start: 0 });
  }
  marks.forEach((m) => tasks.push({ label: m.label, start: m.t }));
  tasks.forEach((task, i) => {
    task.end = i + 1 < tasks.length ? tasks[i + 1].start : end;
  });
  return tasks;
};

/**
 * Per-session signals
 */
export const analyzeSession = (session) => {
  const events = sortedEvents(session);
  const clicks = events
    .filter((e) => e.type === "click" && e.target)
    .map((e) => Object.assign({}, e));
  const moves = events.filter((e) => e.type === "move");
  const hovers = events.filter((e) => e.type === "hover" && e.target);
  const signals = {
    rage: [],
    dead: [],
    hesitation: [],
    nearMiss: [],
    backtrack: [],
    escapeAfter: [],
  };

  // rage clicks: bursts of clicks in one spot
  for (let i = 0; i < clicks.length; i++) {
    const burst = [clicks[i]];
    for (let j = i + 1; j < clicks.length; j++) {
      if (clicks[j].t - clicks[i].t > RAGE_WINDOW_MS) {
        break;
      }
      if (dist(clicks[i], clicks[j]) <= RAGE_RADIUS_PX) {
        burst.push(clicks[j]);
      }
    }
    if (burst.length >= RAGE_MIN_CLICKS) {
      signals.rage.push({
        t: clicks[i].t,
        count: burst.length,
        target: clicks[i].target,
      });
      i += burst.length - 1;
    }
  }

  // dead clicks: non-interactive target and nothing (route, focus, key, snapshot) follows
  clicks.forEach((c) => {
    if (c.keyboard || c.target.interactive) {
      return;
    }
    const effect = events.find(
      (e) =>
        e.t > c.t &&
        e.t - c.t <= DEAD_CLICK_EFFECT_MS &&
        (e.type === "route" ||
          (e.type === "focus" && e.target && e.target.interactive)),
    );
    if (!effect) {
      signals.dead.push(c);
    }
  });

  // near misses: dead click just outside a small control in the latest snapshot
  const snapshots = (session.snapshots || []).slice().sort((a, b) => a.t - b.t);
  const snapshotAt = (t) => {
    let found = null;
    for (let i = 0; i < snapshots.length; i++) {
      if (snapshots[i].t <= t) {
        found = snapshots[i];
      }
    }
    return found;
  };
  signals.dead.forEach((c) => {
    const snap = snapshotAt(c.t);
    if (!snap) {
      return;
    }
    // snapshot rects are viewport coordinates; any scroll since makes them stale
    const scrolled = events.some(
      (e) => e.type === "scroll" && e.t > snap.t && e.t <= c.t,
    );
    if (scrolled) {
      return;
    }
    // blame only the closest control the click just missed
    let best = null;
    let bestDist = Infinity;
    snap.controls.forEach((ctl) => {
      const r = ctl.rect;
      const dx = Math.max(r.x - c.x, 0, c.x - (r.x + r.w));
      const dy = Math.max(r.y - c.y, 0, c.y - (r.y + r.h));
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 0 && d <= NEAR_MISS_PX && d < bestDist) {
        best = ctl;
        bestDist = d;
      }
    });
    if (best) {
      c.nearMiss = true;
      signals.nearMiss.push({ t: c.t, control: best, x: c.x, y: c.y });
    }
  });
  // a near miss is reported as a target-size problem, not also as a dead click
  signals.dead = signals.dead.filter((c) => !c.nearMiss);

  // hesitation: long hover on a control before acting (or never acting)
  hovers.forEach((h) => {
    if (h.ms >= HESITATION_MS) {
      const clicked = clicks.some(
        (c) =>
          controlKey(c.target) === controlKey(h.target) &&
          c.t >= h.t &&
          c.t <= h.t + h.ms + 500,
      );
      signals.hesitation.push({
        t: h.t,
        ms: h.ms,
        target: h.target,
        clicked: clicked,
      });
    }
  });

  // backtracking: A -> B -> A quickly
  const routes = events.filter((e) => e.type === "route" || e.type === "start");
  for (let i = 2; i < routes.length; i++) {
    if (
      routes[i].href === routes[i - 2].href &&
      routes[i].href !== routes[i - 1].href &&
      routes[i].t - routes[i - 1].t <= BACKTRACK_MS
    ) {
      signals.backtrack.push({
        t: routes[i - 1].t,
        from: routes[i - 2].href,
        to: routes[i - 1].href,
        ms: routes[i].t - routes[i - 1].t,
      });
    }
  }

  // escape shortly after clicking something: opened the wrong thing
  events
    .filter((e) => e.type === "key" && e.k === "Escape")
    .forEach((k) => {
      let last = null;
      for (let i = clicks.length - 1; i >= 0; i--) {
        if (clicks[i].t < k.t) {
          last = clicks[i];
          break;
        }
      }
      if (
        last &&
        k.t - last.t <= ESCAPE_AFTER_CLICK_MS &&
        last.target.interactive
      ) {
        signals.escapeAfter.push({
          t: k.t,
          target: last.target,
          ms: k.t - last.t,
        });
      }
    });

  // tasks: time on task, activity, pointer wandering before the first action
  const tasks = tasksFor(session, events).map((task) => {
    const inTask = (e) => e.t >= task.start && e.t < task.end;
    const taskClicks = clicks.filter(inTask);
    const taskMoves = moves.filter(inTask);
    let travel = 0;
    for (let i = 1; i < taskMoves.length; i++) {
      travel += dist(taskMoves[i], taskMoves[i - 1]);
    }
    const firstClick = taskClicks.length ? taskClicks[0].t - task.start : null;
    const count = (list) => list.filter(inTask).length;
    return {
      label: task.label,
      start: task.start,
      durationMs: task.end - task.start,
      clicks: taskClicks.length,
      timeToFirstClickMs: firstClick,
      pointerTravelPx: Math.round(travel),
      deadClicks: count(signals.dead),
      rageClicks: count(signals.rage),
      hesitations: count(signals.hesitation),
      backtracks: count(signals.backtrack),
    };
  });

  // controls: exposure (first seen) vs use
  const controls = {};
  const touch = (c) => {
    const key = controlKey(c);
    if (!key) {
      return null;
    }
    if (!controls[key]) {
      controls[key] = {
        path: key,
        label: c.label || "",
        tag: c.tag || "",
        role: c.role || "",
        firstSeen: null,
        firstClick: null,
        clicks: 0,
        hoverMs: 0,
        hovers: 0,
        rect: c.rect || null,
        opacity: typeof c.opacity === "number" ? c.opacity : null,
        contrast: null,
      };
    }
    if (!controls[key].label && c.label) {
      controls[key].label = c.label;
    }
    return controls[key];
  };
  snapshots.forEach((snap) => {
    snap.controls.forEach((ctl) => {
      const rec = touch(ctl);
      if (rec.firstSeen === null) {
        rec.firstSeen = snap.t;
      }
      rec.rect = ctl.rect;
      rec.opacity = ctl.opacity;
      rec.disabled = ctl.disabled;
      const ratio = contrastRatio(ctl.color, ctl.background);
      if (ratio !== null) {
        rec.contrast = ratio;
      }
    });
  });
  clicks.forEach((c) => {
    if (!c.target.interactive) {
      return;
    }
    const rec = touch(c.target);
    rec.clicks++;
    if (rec.firstClick === null) {
      rec.firstClick = c.t;
    }
  });
  hovers.forEach((h) => {
    const rec = touch(h.target);
    rec.hovers++;
    rec.hoverMs += h.ms;
  });

  const activeMs = (() => {
    let hidden = 0;
    let hiddenAt = null;
    events.forEach((e) => {
      if (e.type === "visibility") {
        if (e.hidden) {
          hiddenAt = e.t;
        } else if (hiddenAt !== null) {
          hidden += e.t - hiddenAt;
          hiddenAt = null;
        }
      }
    });
    return Math.max(0, (session.durationMs || 0) - hidden);
  })();

  return {
    id: session.id,
    participant: session.participant || session.id,
    env: session.env || {},
    durationMs: session.durationMs || 0,
    activeMs: activeMs,
    truncated: !!session.truncated,
    clicks: clicks.length,
    signals: signals,
    tasks: tasks,
    controls: controls,
  };
};

/**
 * Aggregate many sessions into ranked findings
 */
export const analyzeUXStudies = (sessions) => {
  const list = (Array.isArray(sessions) ? sessions : [sessions]).filter(
    (s) => s && Array.isArray(s.events),
  );
  const per = list.map(analyzeSession);
  const n = per.length;

  // merge controls across sessions
  const controls = {};
  per.forEach((p) => {
    Object.keys(p.controls).forEach((key) => {
      const c = p.controls[key];
      if (!controls[key]) {
        controls[key] = {
          path: key,
          label: c.label,
          tag: c.tag,
          role: c.role,
          rect: c.rect,
          opacity: c.opacity,
          contrast: c.contrast,
          seenBy: 0,
          usedBy: 0,
          clicks: 0,
          hovers: 0,
          hoverMs: 0,
          lateFinds: 0,
          discoveryMs: [],
        };
      }
      const m = controls[key];
      if (!m.label && c.label) {
        m.label = c.label;
      }
      if (c.firstSeen !== null) {
        m.seenBy++;
      }
      if (c.clicks > 0) {
        m.usedBy++;
      }
      m.clicks += c.clicks;
      m.hovers += c.hovers;
      m.hoverMs += c.hoverMs;
      if (
        c.contrast !== null &&
        (m.contrast === null || c.contrast < m.contrast)
      ) {
        m.contrast = c.contrast;
      }
      if (c.firstSeen !== null && c.firstClick !== null) {
        const wait = c.firstClick - c.firstSeen;
        m.discoveryMs.push(wait);
        if (wait >= LATE_DISCOVERY_MS) {
          m.lateFinds++;
        }
      }
    });
  });

  const findings = [];
  const add = (f) => findings.push(f);
  // group a signal list per control, counting distinct participants
  const groupSignals = (name, keyOf) => {
    const groups = {};
    per.forEach((p) => {
      p.signals[name].forEach((s) => {
        const key = keyOf(s);
        if (!key) {
          return;
        }
        if (!groups[key]) {
          groups[key] = { key: key, sample: s, count: 0, participants: {} };
        }
        groups[key].count++;
        groups[key].participants[p.participant] = true;
      });
    });
    return Object.keys(groups).map((k) => {
      const g = groups[k];
      g.people = Object.keys(g.participants).length;
      return g;
    });
  };

  groupSignals("rage", (s) => controlKey(s.target)).forEach((g) => {
    add({
      category: "frustration",
      severity: "high",
      title: `Repeated rapid clicking on ${controlName(g.sample.target)}`,
      control: g.sample.target,
      people: g.people,
      count: g.count,
      evidence: `${g.count} rage-click burst(s) from ${g.people} of ${n} participant(s). The control either responds too slowly, gives no visible feedback, or is not doing what people expect.`,
      recommendation:
        "Give immediate visible feedback on press (state change, progress, toast) and confirm the action does what its label promises.",
    });
  });

  groupSignals("dead", (s) => controlKey(s.target)).forEach((g) => {
    const t = g.sample.target;
    const looksClickable = t.cursor === "pointer";
    if (g.count < 2 && !looksClickable) {
      return;
    }
    add({
      category: "affordance",
      severity: looksClickable || g.people > 1 ? "medium" : "low",
      title: `People click ${controlName(t)}, which does nothing`,
      control: t,
      people: g.people,
      count: g.count,
      evidence: `${g.count} click(s) with no resulting navigation or focus change, from ${g.people} of ${n} participant(s)${looksClickable ? "; it also shows a pointer cursor" : ""}.`,
      recommendation: looksClickable
        ? "Remove the pointer cursor / clickable styling, or make it actually operable."
        : "This area reads as clickable. Either make it a real control for what people expect here, or reduce the visual cue.",
    });
  });

  groupSignals("nearMiss", (s) => controlKey(s.control)).forEach((g) => {
    const c = g.sample.control;
    const small =
      c.rect && (c.rect.w < SMALL_TARGET_PX || c.rect.h < SMALL_TARGET_PX);
    add({
      category: "target-size",
      severity: small ? "high" : "medium",
      title: `Clicks landing just outside ${controlName(c)}`,
      control: c,
      people: g.people,
      count: g.count,
      evidence: `${g.count} near-miss click(s) within ${NEAR_MISS_PX}px of the control${c.rect ? ` (${c.rect.w}x${c.rect.h}px)` : ""} from ${g.people} of ${n} participant(s).`,
      recommendation: `Grow the hit area to at least ${SMALL_TARGET_PX}x${SMALL_TARGET_PX}px (WCAG 2.2 target size) with padding, without changing the element's API.`,
    });
  });

  groupSignals("hesitation", (s) => controlKey(s.target)).forEach((g) => {
    const s = g.sample;
    add({
      category: "clarity",
      severity: g.people > 1 ? "medium" : "low",
      title: `Hesitation over ${controlName(s.target)}`,
      control: s.target,
      people: g.people,
      count: g.count,
      evidence: `${g.count} hover(s) of ${Math.round(HESITATION_MS / 100) / 10}s or more from ${g.people} of ${n} participant(s)${s.clicked ? ", usually followed by a click" : ", often without clicking"}. The pointer often sits where attention is while someone decides.`,
      recommendation:
        "Check the icon and label: add a visible text label or clearer tooltip so the purpose is known before committing.",
    });
  });

  groupSignals("escapeAfter", (s) => controlKey(s.target)).forEach((g) => {
    if (g.count < 2) {
      return;
    }
    add({
      category: "expectation",
      severity: "low",
      title: `People open ${controlName(g.sample.target)} and immediately back out`,
      control: g.sample.target,
      people: g.people,
      count: g.count,
      evidence: `${g.count} Escape press(es) within ${ESCAPE_AFTER_CLICK_MS / 1000}s of activating it, from ${g.people} of ${n} participant(s).`,
      recommendation:
        "What opens may not match what the label suggests. Compare the label to the destination and to what people were looking for.",
    });
  });

  groupSignals("backtrack", (s) => `${s.from} -> ${s.to}`).forEach((g) => {
    add({
      category: "navigation",
      severity: g.people > 1 ? "medium" : "low",
      title: `Quick back-out from ${g.sample.to} to ${g.sample.from}`,
      control: null,
      people: g.people,
      count: g.count,
      evidence: `${g.count} time(s) people navigated away and returned within ${BACKTRACK_MS / 1000}s, from ${g.people} of ${n} participant(s).`,
      recommendation:
        "The link or menu item that leads here likely doesn't describe the destination well.",
    });
  });

  Object.keys(controls).forEach((key) => {
    const c = controls[key];
    if (c.lateFinds > 0) {
      const sorted = c.discoveryMs.slice().sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      add({
        category: "discoverability",
        severity: c.lateFinds > 1 ? "medium" : "low",
        title: `${controlName(c)} is found late`,
        control: c,
        people: c.lateFinds,
        count: c.lateFinds,
        evidence: `On screen for ${Math.round(median / 1000)}s (median) before first use; ${c.lateFinds} of ${c.usedBy} participant(s) who used it took ${LATE_DISCOVERY_MS / 1000}s or more.`,
        recommendation:
          "Raise its visual weight or move it closer to where attention already is (see the heatmap for where people looked first).",
      });
    }
    if (c.seenBy > 0 && c.opacity !== null && c.opacity < 0.6) {
      add({
        category: "visibility",
        severity: c.usedBy > 0 ? "medium" : "low",
        title: `${controlName(c)} is faded (opacity ${c.opacity})`,
        control: c,
        people: c.seenBy,
        count: c.seenBy,
        evidence: `Visible to ${c.seenBy} participant(s) at ${Math.round(c.opacity * 100)}% opacity${c.usedBy ? `; ${c.usedBy} still used it` : ""}.`,
        recommendation:
          "If it is usable it should look usable: drop the reduced opacity or use a DDD state color instead.",
      });
    }
    if (c.contrast !== null && c.contrast < 3) {
      add({
        category: "visibility",
        severity: "medium",
        title: `Low contrast on ${controlName(c)} (${c.contrast}:1)`,
        control: c,
        people: c.seenBy,
        count: c.seenBy,
        evidence: `Text/background contrast measured at ${c.contrast}:1 on the control itself; WCAG asks 4.5:1 for text and 3:1 for UI components.`,
        recommendation:
          "Use DDD color tokens that meet contrast in both light and dark mode.",
      });
    }
    if (
      c.rect &&
      c.seenBy > 0 &&
      c.usedBy > 0 &&
      (c.rect.w < SMALL_TARGET_PX || c.rect.h < SMALL_TARGET_PX) &&
      !findings.some(
        (f) =>
          f.category === "target-size" &&
          f.control &&
          controlKey(f.control) === key,
      )
    ) {
      add({
        category: "target-size",
        severity: "low",
        title: `${controlName(c)} is a small target (${c.rect.w}x${c.rect.h}px)`,
        control: c,
        people: c.usedBy,
        count: c.clicks,
        evidence: `Used ${c.clicks} time(s) by ${c.usedBy} participant(s) at under ${SMALL_TARGET_PX}px in one dimension.`,
        recommendation: `Pad the hit area to ${SMALL_TARGET_PX}x${SMALL_TARGET_PX}px or more.`,
      });
    }
  });

  findings.sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      b.people - a.people ||
      b.count - a.count,
  );
  findings.forEach((f, i) => {
    f.id = `UX-${String(i + 1).padStart(2, "0")}`;
  });

  // tasks aggregated by label across participants
  const taskMap = {};
  per.forEach((p) => {
    p.tasks.forEach((t) => {
      if (!taskMap[t.label]) {
        taskMap[t.label] = { label: t.label, runs: [] };
      }
      taskMap[t.label].runs.push(
        Object.assign({ participant: p.participant }, t),
      );
    });
  });
  const median = (arr) => {
    const v = arr.filter((x) => x !== null).sort((a, b) => a - b);
    return v.length ? v[Math.floor(v.length / 2)] : null;
  };
  const tasks = Object.keys(taskMap).map((label) => {
    const runs = taskMap[label].runs;
    return {
      label: label,
      participants: runs.length,
      medianDurationMs: median(runs.map((r) => r.durationMs)),
      medianTimeToFirstClickMs: median(runs.map((r) => r.timeToFirstClickMs)),
      medianPointerTravelPx: median(runs.map((r) => r.pointerTravelPx)),
      deadClicks: runs.reduce((s, r) => s + r.deadClicks, 0),
      rageClicks: runs.reduce((s, r) => s + r.rageClicks, 0),
      hesitations: runs.reduce((s, r) => s + r.hesitations, 0),
      backtracks: runs.reduce((s, r) => s + r.backtracks, 0),
      runs: runs,
    };
  });

  const neverUsed = Object.keys(controls)
    .map((k) => controls[k])
    .filter((c) => c.seenBy === n && n > 0 && c.usedBy === 0 && c.label)
    .map((c) => ({ label: c.label, tag: c.tag, path: c.path }));

  return {
    analyzerVersion: UX_STUDY_ANALYZER_VERSION,
    participants: per.map((p) => ({
      id: p.id,
      participant: p.participant,
      durationMs: p.durationMs,
      activeMs: p.activeMs,
      clicks: p.clicks,
      pointer: p.env.pointer || "",
      viewport: p.env.viewport || null,
      truncated: p.truncated,
    })),
    findings: findings,
    tasks: tasks,
    controls: controls,
    neverUsed: neverUsed,
    sessions: per,
  };
};

const fmtMs = (ms) => {
  if (ms === null || ms === undefined) {
    return "–";
  }
  const s = Math.round(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
};

/**
 * Written findings report (markdown); also the body source for issues
 */
export const uxStudyReportMarkdown = (analysis, options = {}) => {
  const lines = [];
  const n = analysis.participants.length;
  lines.push(`# ${options.title || "UX study findings"}`);
  lines.push("");
  lines.push(
    `${n} participant session(s). Pointer position is used as an attention proxy; it is not eye tracking. Findings are heuristics with their evidence attached, for a person to confirm.`,
  );
  lines.push("");
  const bySev = (s) => analysis.findings.filter((f) => f.severity === s).length;
  lines.push(
    `**${analysis.findings.length} findings**: ${bySev("high")} high, ${bySev("medium")} medium, ${bySev("low")} low.`,
  );
  lines.push("");
  lines.push("## Findings");
  lines.push("");
  if (!analysis.findings.length) {
    lines.push("No issues crossed the thresholds in these sessions.");
    lines.push("");
  }
  analysis.findings.forEach((f) => {
    lines.push(`### ${f.id} · ${f.severity} · ${f.category}: ${f.title}`);
    lines.push("");
    lines.push(`- **Evidence:** ${f.evidence}`);
    if (f.control && f.control.path) {
      lines.push(`- **Where:** \`${f.control.path}\``);
    }
    lines.push(`- **Suggested direction:** ${f.recommendation}`);
    lines.push("");
  });
  if (analysis.tasks.length) {
    lines.push("## Tasks");
    lines.push("");
    lines.push(
      "| Task | People | Median time | Time to first click | Dead | Rage | Hesitations | Backtracks |",
    );
    lines.push("|---|---|---|---|---|---|---|---|");
    analysis.tasks.forEach((t) => {
      lines.push(
        `| ${t.label.replace(/\|/g, "/")} | ${t.participants} | ${fmtMs(t.medianDurationMs)} | ${fmtMs(t.medianTimeToFirstClickMs)} | ${t.deadClicks} | ${t.rageClicks} | ${t.hesitations} | ${t.backtracks} |`,
      );
    });
    lines.push("");
  }
  if (analysis.neverUsed.length) {
    lines.push("## On screen for everyone, used by no one");
    lines.push("");
    lines.push(
      "Not a problem by itself (not every task needs every control), but worth checking against what people were trying to do.",
    );
    lines.push("");
    analysis.neverUsed.slice(0, 25).forEach((c) => {
      lines.push(`- "${c.label}" (${c.tag})`);
    });
    lines.push("");
  }
  lines.push("## Sessions");
  lines.push("");
  analysis.participants.forEach((p) => {
    lines.push(
      `- ${p.participant}: ${fmtMs(p.durationMs)} (${fmtMs(p.activeMs)} active), ${p.clicks} clicks, ${p.pointer || "unknown"} pointer${p.viewport ? `, ${p.viewport.w}x${p.viewport.h}` : ""}${p.truncated ? ", pointer samples truncated" : ""}`,
    );
  });
  lines.push("");
  return `${lines.join("\n")}`;
};
