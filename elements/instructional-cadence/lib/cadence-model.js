/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Instructional cadence model. Pure functions, no DOM, so the scoring can be
 * unit tested and reused by other surfaces (CLI, MCP, reports).
 *
 * The idea (haxtheweb/issues#3045): a lesson is one measure of music and each
 * page in it is one beat. A well paced lesson has a shape: a short setup, a
 * meandering middle, an intense peak, a softer follow-up and a recap that
 * resolves. The model checks for those five parts, it does not reward or
 * punish a page for simply being light or heavy.
 */

// Effort weights, in minutes of learner effort per item on a page. Video is
// counted as an activity to engage with, not by its duration: very long
// videos are not more helpful, and this view never changes media length.
export const CADENCE_WEIGHTS = {
  readMinute: 1,
  image: 0.4,
  video: 2,
  audio: 1,
  selfCheck: 0.6,
  h5p: 1,
};

export const CADENCE_PARTS = ["setup", "dance", "peak", "follow", "recap"];

// staff positions from E4 (bottom line) up to A5 (first ledger above)
const NOTE_NAMES = [
  "E4",
  "F4",
  "G4",
  "A4",
  "B4",
  "C5",
  "D5",
  "E5",
  "F5",
  "G5",
  "A5",
];
const TONIC = 5;
// below this fraction of the course median a page counts as an empty beat
const EMPTY_RATIO = 0.12;

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Effort weight of a page from a Site Insights content report row.
 * @param {Object} row content report row (readTime, images, videos, ...)
 * @param {Object} [weights] override CADENCE_WEIGHTS
 * @returns {Number}
 */
export function pageWeight(row, weights) {
  const w = Object.assign({}, CADENCE_WEIGHTS, weights || {});
  const r = row || {};
  return (
    toNumber(r.readTime) * w.readMinute +
    toNumber(r.images) * w.image +
    toNumber(r.videos) * w.video +
    toNumber(r.audio) * w.audio +
    toNumber(r.selfChecks) * w.selfCheck +
    toNumber(r.h5p) * w.h5p
  );
}

export function median(values) {
  const list = (values || [])
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => a - b);
  if (list.length === 0) {
    return 0;
  }
  const mid = Math.floor(list.length / 2);
  return list.length % 2 ? list[mid] : (list[mid - 1] + list[mid]) / 2;
}

/**
 * Group a flat JSON Outline Schema item list into lessons. A lesson is any
 * item whose children are all leaf pages; the parent page is the first beat
 * (the setup) followed by its children in order.
 * @param {Array} items manifest items ({id, parent, title, order})
 * @returns {Array} [{id, title, pages: [item, ...]}]
 */
export function buildLessons(items) {
  const list = Array.isArray(items) ? items : [];
  const known = {};
  list.forEach((item) => {
    known[String(item.id)] = true;
  });
  const children = {};
  list.forEach((item, index) => {
    // an item whose parent is not in the list (a filtered subtree) is a root
    const key =
      item.parent == null || !known[String(item.parent)]
        ? ""
        : String(item.parent);
    if (!children[key]) {
      children[key] = [];
    }
    children[key].push({ item, index });
  });
  const ordered = (key) =>
    (children[key] || [])
      .slice()
      .sort((a, b) => {
        const ao = Number(a.item.order);
        const bo = Number(b.item.order);
        if (Number.isFinite(ao) && Number.isFinite(bo) && ao !== bo) {
          return ao - bo;
        }
        return a.index - b.index;
      })
      .map((entry) => entry.item);
  const lessons = [];
  const walk = (key) => {
    ordered(key).forEach((item) => {
      const kids = ordered(String(item.id));
      if (kids.length === 0) {
        return;
      }
      const allLeaves = kids.every(
        (kid) => (children[String(kid.id)] || []).length === 0,
      );
      if (allLeaves) {
        lessons.push({
          id: item.id,
          title: item.title,
          pages: [item].concat(kids),
        });
      } else {
        walk(String(item.id));
      }
    });
  };
  walk("");
  return lessons;
}

/**
 * Check a lesson's sequence of page weights for the five-part shape.
 * @param {Array<Number>} weights page weights in outline order
 * @returns {Object} {roles, peak, checks, score}
 */
export function lessonShape(weights) {
  const ws = weights || [];
  const n = ws.length;
  const last = n - 1;
  const med = median(ws);
  let peak = n > 2 ? 1 : 0;
  for (let i = 1; i < last; i++) {
    if (ws[i] > ws[peak]) {
      peak = i;
    }
  }
  const roles = ws.map((w, i) => {
    if (i === 0) {
      return "setup";
    }
    if (i === last) {
      return "recap";
    }
    if (i === peak) {
      return "peak";
    }
    if (i === peak + 1) {
      return "follow";
    }
    return i < peak ? "dance" : "soft";
  });
  const middle = ws.slice(1, peak);
  const rising = ws.slice(1, peak + 1);
  let turns = 0;
  for (let i = 1; i < rising.length - 1; i++) {
    if ((rising[i] - rising[i - 1]) * (rising[i + 1] - rising[i]) < 0) {
      turns++;
    }
  }
  const floor = med * EMPTY_RATIO;
  const position = last > 0 ? peak / last : 0;
  const checks = {
    setup: n > 0 && ws[0] > floor && ws[0] <= med * 1.05,
    dance: middle.length >= 2 && middle.every((w) => w > floor) && turns >= 1,
    peak:
      n >= 3 && ws[peak] >= med * 1.25 && position >= 0.35 && position <= 0.9,
    follow:
      peak + 1 < last && ws[peak + 1] <= ws[peak] * 0.7 && ws[peak + 1] > floor,
    recap: n > 1 && ws[last] >= med * 0.6 && ws[last] <= med * 1.6,
  };
  const score = CADENCE_PARTS.filter((part) => checks[part]).length;
  return { roles, peak, checks, score };
}

function clampStep(step) {
  return Math.max(0, Math.min(NOTE_NAMES.length - 1, step));
}

/**
 * Notes for one beat. Density comes from the page's weight against the
 * course median; pitch comes from the page's role in the lesson's shape.
 */
function beatPitches(role, ratio, index, walk, recapResolves) {
  if (ratio < EMPTY_RATIO) {
    return { pitches: [], walk };
  }
  let count = 4;
  if (ratio < 0.6) {
    count = 1;
  } else if (ratio < 1.3) {
    count = 2;
  }
  let pitches;
  let nextWalk = walk;
  switch (role) {
    case "setup":
      pitches = [TONIC, TONIC + 1, TONIC + 2, TONIC + 1];
      break;
    case "peak":
      pitches = [7, 8, 9, 10];
      break;
    case "follow":
      pitches = [6, 5, 4, 3];
      break;
    case "recap":
      if (recapResolves) {
        pitches =
          count === 1
            ? [TONIC]
            : count === 2
              ? [TONIC + 1, TONIC]
              : [TONIC + 2, TONIC + 1, TONIC - 1, TONIC];
      } else {
        pitches = [TONIC + 1, TONIC + 2, TONIC + 3, TONIC + 4];
      }
      break;
    default: {
      const steps = [2, -1, 3, -2, 1];
      nextWalk = Math.max(2, Math.min(8, walk + steps[index % steps.length]));
      pitches =
        count === 2
          ? [nextWalk, nextWalk - 1]
          : [nextWalk, nextWalk + 1, nextWalk + 2, nextWalk + 1];
      break;
    }
  }
  return {
    pitches: pitches.slice(0, count).map(clampStep),
    walk: nextWalk,
  };
}

/**
 * Score a whole course.
 * @param {Array} items manifest items
 * @param {Array} rows Site Insights content report rows (contentData)
 * @param {Object} [weights] override CADENCE_WEIGHTS
 * @returns {Object} {lessons, median, flow, emptyBeats, resolves}
 */
export function analyzeCadence(items, rows, weights) {
  const byId = {};
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (row && row.id != null) {
      byId[String(row.id)] = row;
    }
  });
  const lessonList = buildLessons(items);
  const allWeights = [];
  lessonList.forEach((lesson) => {
    lesson.weights = lesson.pages.map((page) =>
      pageWeight(byId[String(page.id)], weights),
    );
    lesson.weights.forEach((w) => allWeights.push(w));
  });
  const courseMedian = median(allWeights.filter((w) => w > 0)) || 1;
  const lessons = lessonList.map((lesson) => {
    const shape = lessonShape(lesson.weights);
    let walk = TONIC;
    const beats = lesson.pages.map((page, i) => {
      const ratio = lesson.weights[i] / courseMedian;
      const role = shape.roles[i];
      const result = beatPitches(role, ratio, i, walk, shape.checks.recap);
      walk = result.walk;
      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        weight: lesson.weights[i],
        ratio,
        role,
        empty: ratio < EMPTY_RATIO,
        pitches: result.pitches,
      };
    });
    return {
      id: lesson.id,
      title: lesson.title,
      beats,
      roles: shape.roles,
      checks: shape.checks,
      score: shape.score,
    };
  });
  const totalParts = lessons.length * CADENCE_PARTS.length;
  const flow =
    totalParts === 0
      ? 0
      : Math.round(
          (100 * lessons.reduce((sum, l) => sum + l.score, 0)) / totalParts,
        );
  return {
    lessons,
    median: courseMedian,
    flow,
    emptyBeats: lessons.reduce(
      (sum, l) => sum + l.beats.filter((b) => b.empty).length,
      0,
    ),
    resolves: lessons.filter((l) => l.checks.recap).length,
  };
}

function texString(value) {
  return String(value == null ? "" : value).replace(/["\\\r\n]/g, " ");
}

/**
 * alphaTex for <sheet-music>: one bar per lesson in N/4, where N is the
 * number of pages in that lesson.
 * @param {Object} analysis result of analyzeCadence
 * @param {String} [title]
 * @returns {String}
 */
export function cadenceToAlphaTex(analysis, title) {
  const durations = { 1: ":4", 2: ":8", 4: ":16" };
  const lessons = analysis && analysis.lessons ? analysis.lessons : [];
  const bars = lessons
    .filter((lesson) => lesson.beats.length > 0)
    .map((lesson) => {
      const out = [`\\ts ${lesson.beats.length} 4`];
      let current = "";
      lesson.beats.forEach((beat) => {
        const duration = durations[beat.pitches.length || 1];
        if (duration !== current) {
          out.push(duration);
          current = duration;
        }
        out.push(
          beat.pitches.length > 0
            ? beat.pitches.map((step) => NOTE_NAMES[step]).join(" ")
            : "r",
        );
      });
      return out.join(" ") + " |";
    });
  if (bars.length === 0) {
    return "";
  }
  return [
    `\\title "${texString(title || "Instructional cadence")}"`,
    `\\subtitle "Flow ${analysis.flow}%"`,
    "\\tempo 100",
    ".",
    '\\track "Cadence"',
    // piano: without it alphaTab defaults to guitar, written an octave up
    "\\instrument piano",
    "\\staff {score}",
    "\\tuning piano",
  ]
    .concat(bars)
    .join("\n");
}
