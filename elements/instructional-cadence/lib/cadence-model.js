/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Instructional cadence model. Pure functions, no DOM, so the scoring can be
 * unit tested and reused by other surfaces (Reports, CLI, MCP).
 *
 * The idea (haxtheweb/issues#3045): a course reads like a piece of music.
 * Each lesson is a phrase, written as one bar with a beat per page. A well
 * paced phrase has a recognisable shape, named here with the music terms it
 * borrows:
 *
 *   anacrusis    the pickup: the lesson opens lightly
 *   development  the middle moves, varying its weight, with no blank pages
 *   climax       the heaviest page lands in the second half or so
 *   decrescendo  the page after the climax is lighter
 *   cadence      the lesson closes on a page with content that is not the
 *                climax (an authentic cadence); ending on a blank page or on
 *                the climax itself leaves the phrase open (a half cadence)
 *
 * A blank page is a rest. Light pages are never marked down for being light;
 * what is measured is the shape, not the intensity.
 */

// Effort weights, in minutes of learner effort. A video counts once as an
// activity to engage with, whatever its length or how many player tags wrap
// it: very long videos are not more helpful, and this view never changes
// media length.
export const CADENCE_WEIGHTS = {
  wordsPerMinute: 200,
  image: 0.4,
  video: 2,
  embed: 1,
  audio: 1,
  check: 0.6,
};

// a page with no media and fewer words than this is blank: a rest
export const REST_WORDS = 30;

// a lesson needs at least this many pages to have room for all five parts;
// used to find which outline level holds the lessons
export const MIN_PHRASE_PAGES = 5;

export const CADENCE_PARTS = [
  "anacrusis",
  "development",
  "climax",
  "decrescendo",
  "cadence",
];

// the climax is looked for nearest this point (the golden section), among
// pages within CLIMAX_TIE of the heaviest
const CLIMAX_TARGET = 0.618;
const CLIMAX_TIE = 0.1;

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
const TONIC = 5; // C5
const DOMINANT = 2; // G4

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function settings(weights) {
  return Object.assign({}, CADENCE_WEIGHTS, weights || {});
}

/**
 * Effort weight of a page, in minutes.
 * @param {Object} row {words, images, videos, embeds, audio, checks}
 * @param {Object} [weights] override CADENCE_WEIGHTS
 * @returns {Number}
 */
export function pageWeight(row, weights) {
  const w = settings(weights);
  const r = row || {};
  return (
    toNumber(r.words) / (w.wordsPerMinute || 200) +
    toNumber(r.images) * w.image +
    (toNumber(r.videos) > 0 ? w.video : 0) +
    toNumber(r.embeds) * w.embed +
    toNumber(r.audio) * w.audio +
    toNumber(r.checks) * w.check
  );
}

/**
 * A page is a rest when it is blank: no media and only a few words (a
 * title, or a short list of links to the pages below it).
 * @param {Object} row
 * @returns {Boolean}
 */
export function isRest(row) {
  const r = row || {};
  return (
    toNumber(r.images) === 0 &&
    toNumber(r.videos) === 0 &&
    toNumber(r.embeds) === 0 &&
    toNumber(r.audio) === 0 &&
    toNumber(r.checks) === 0 &&
    toNumber(r.words) < REST_WORDS
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
 * Turn a flat JSON Outline Schema item list into a tree in reading order.
 * Items whose parent is missing (a filtered subtree) become roots.
 */
function outlineTree(items) {
  const list = Array.isArray(items) ? items : [];
  const known = {};
  list.forEach((item) => {
    known[String(item.id)] = true;
  });
  const children = {};
  list.forEach((item, index) => {
    const key =
      item.parent == null || !known[String(item.parent)]
        ? ""
        : String(item.parent);
    if (!children[key]) {
      children[key] = [];
    }
    children[key].push({ item, index });
  });
  const kids = (key) =>
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
  const build = (item, depth) => {
    const node = { item, depth, children: [] };
    node.children = kids(String(item.id)).map((kid) => build(kid, depth + 1));
    node.size = 1 + node.children.reduce((sum, child) => sum + child.size, 0);
    return node;
  };
  return kids("").map((item) => build(item, 0));
}

function preorder(node, out) {
  out.push(node);
  node.children.forEach((child) => preorder(child, out));
  return out;
}

/**
 * Which outline depth holds the lessons: the deepest level whose pages with
 * children hold, on average, at least MIN_PHRASE_PAGES pages. Deeper levels
 * are parts of a lesson (a lecture segment and its pages).
 * @param {Array} roots outline tree
 * @returns {Number}
 */
function lessonDepth(roots) {
  const byDepth = {};
  roots.forEach((root) =>
    preorder(root, []).forEach((node) => {
      if (node.children.length > 0) {
        if (!byDepth[node.depth]) {
          byDepth[node.depth] = [];
        }
        byDepth[node.depth].push(node.size);
      }
    }),
  );
  const depths = Object.keys(byDepth)
    .map(Number)
    .sort((a, b) => a - b);
  let chosen = depths.length ? depths[0] : 0;
  depths.forEach((d) => {
    const sizes = byDepth[d];
    const avg = sizes.reduce((s, n) => s + n, 0) / sizes.length;
    if (avg >= MIN_PHRASE_PAGES) {
      chosen = d;
    }
  });
  return chosen;
}

/**
 * Group the outline into phrases in reading order.
 *
 * A lesson is a page at the lesson depth that has children, or a shallower
 * page whose children are all single pages (like an Orientation with its
 * pages). Its beats are the lesson page and everything below it, in reading
 * order. Pages outside any lesson (a module's own page, its review and quiz)
 * become interludes: they play in the score but are not scored.
 *
 * @param {Array} items manifest items ({id, parent, title, slug, order})
 * @param {Number} [depth] lesson depth; found from the outline when omitted
 * @returns {Object} {depth, phrases: [{kind, id, title, pages: [node]}]}
 */
export function buildPhrases(items, depth) {
  const roots = outlineTree(items);
  const level =
    Number.isInteger(depth) && depth >= 0 ? depth : lessonDepth(roots);
  const phrases = [];
  let interlude = null;
  const closeInterlude = () => {
    if (interlude) {
      phrases.push(interlude);
      interlude = null;
    }
  };
  const visit = (node, parentKey) => {
    const hasKids = node.children.length > 0;
    const allLeaves =
      hasKids && node.children.every((kid) => kid.children.length === 0);
    if (
      hasKids &&
      (node.depth === level || (node.depth < level && allLeaves))
    ) {
      closeInterlude();
      phrases.push({
        kind: "lesson",
        id: node.item.id,
        title: node.item.title,
        pages: preorder(node, []),
      });
      return;
    }
    if (!interlude || interlude.parentKey !== parentKey) {
      closeInterlude();
      interlude = {
        kind: "interlude",
        id: `interlude-${node.item.id}`,
        title: node.item.title,
        parentKey,
        pages: [],
      };
    }
    interlude.pages.push(node);
    if (hasKids) {
      node.children.forEach((kid) => visit(kid, String(node.item.id)));
    }
  };
  roots.forEach((root) => visit(root, ""));
  closeInterlude();
  // a flat outline (no pages with children) is one phrase
  if (!phrases.some((p) => p.kind === "lesson") && phrases.length === 1) {
    phrases[0].kind = "lesson";
  }
  phrases.forEach((p) => {
    delete p.parentKey;
  });
  return { depth: level, phrases };
}

/**
 * Check a lesson's beats for the five-part shape.
 * @param {Array} beats [{weight, rest, leaf}] in reading order
 * @returns {Object} {roles, climax, checks, score, cadence}
 */
export function lessonShape(beats) {
  const list = beats || [];
  const n = list.length;
  const roles = list.map((b) => (b.rest ? "rest" : "phrase"));
  const sounding = [];
  list.forEach((b, i) => {
    if (!b.rest) {
      sounding.push(i);
    }
  });
  const checks = {
    anacrusis: false,
    development: false,
    climax: false,
    decrescendo: false,
    cadence: false,
  };
  if (sounding.length === 0) {
    return { roles, climax: -1, checks, score: 0, cadence: "none" };
  }
  const weightOf = (i) => list[i].weight;
  const med = median(sounding.map(weightOf));
  const first = sounding[0];
  const last = n - 1;
  const position = (i) => (last > 0 ? i / last : 0);
  // climax: among the heaviest pages (within CLIMAX_TIE), the one nearest
  // the golden section; the opening page is not a candidate when there is
  // anything after it, and a lesson whose heaviest page is its last one
  // ends on its climax
  const pool = sounding.length > 1 ? sounding.slice(1) : sounding;
  const max = Math.max(...pool.map(weightOf));
  let climax = -1;
  pool
    .filter((i) => weightOf(i) >= max * (1 - CLIMAX_TIE))
    .forEach((i) => {
      if (
        climax === -1 ||
        Math.abs(position(i) - CLIMAX_TARGET) <
          Math.abs(position(climax) - CLIMAX_TARGET)
      ) {
        climax = i;
      }
    });
  roles[first] = "anacrusis";
  sounding.forEach((i) => {
    if (i > first && i < climax) {
      roles[i] = "development";
    }
  });
  roles[climax] = "climax";
  const after = sounding.filter((i) => i > climax);
  if (after.length) {
    roles[after[0]] = "decrescendo";
  }
  if (!list[last].rest && last !== climax) {
    roles[last] = "cadence";
  }

  const between = sounding.filter((i) => i > first && i < climax);
  // the path from the pickup to the climax should change direction at
  // least once rather than climb (or sink) in a straight line
  const path = [first].concat(between, [climax]);
  let turns = 0;
  for (let k = 1; k < path.length - 1; k++) {
    const a = weightOf(path[k - 1]);
    const b = weightOf(path[k]);
    const c = weightOf(path[k + 1]);
    if ((b - a) * (c - b) < 0) {
      turns++;
    }
  }
  // a blank leaf page inside the development stops the music; a blank page
  // that only leads to the pages below it is a breath and is fine
  const blankInside = list.some(
    (b, i) => i > first && i < climax && b.rest && b.leaf,
  );
  // the pickup is clearly lighter than the climax it leads to
  checks.anacrusis =
    first !== climax && weightOf(first) <= weightOf(climax) * 0.6;
  checks.development = between.length >= 2 && turns >= 1 && !blankInside;
  checks.climax =
    n >= 3 &&
    weightOf(climax) >= med * 1.25 &&
    position(climax) >= 0.35 &&
    position(climax) <= 0.9;
  checks.decrescendo =
    after.length > 0 && weightOf(after[0]) <= weightOf(climax) * 0.7;
  checks.cadence = !list[last].rest && last !== climax;
  const score = CADENCE_PARTS.filter((part) => checks[part]).length;
  return {
    roles,
    climax,
    checks,
    score,
    cadence: checks.cadence ? "authentic" : "half",
  };
}

function clampStep(step) {
  return Math.max(0, Math.min(NOTE_NAMES.length - 1, step));
}

/**
 * Notes for one beat. Density comes from the page's weight against the
 * course median; pitch comes from the page's role in the phrase.
 */
function beatPitches(role, ratio, index, walk) {
  let count = 4;
  if (ratio < 0.6) {
    count = 1;
  } else if (ratio < 1.5) {
    count = 2;
  }
  let pitches;
  let nextWalk = walk;
  switch (role) {
    case "rest":
      return { pitches: [], walk };
    case "anacrusis":
      // a pickup leading up to the tonic
      pitches = [DOMINANT, DOMINANT + 2, TONIC - 1, TONIC];
      break;
    case "climax":
      pitches = [7, 8, 9, 10];
      break;
    case "decrescendo":
      pitches = [7, 6, 5, 4];
      break;
    case "cadence":
      // authentic cadence: leading tone up to the tonic (V to I)
      pitches =
        count === 1
          ? [TONIC]
          : count === 2
            ? [TONIC - 1, TONIC]
            : [TONIC + 1, TONIC - 1, DOMINANT, TONIC];
      break;
    case "half":
      // half cadence: the phrase stops on the dominant, unresolved
      pitches =
        count === 1
          ? [DOMINANT]
          : count === 2
            ? [DOMINANT + 1, DOMINANT]
            : [TONIC, DOMINANT + 2, DOMINANT + 1, DOMINANT];
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
    pitches: pitches.slice(-count).map(clampStep),
    walk: nextWalk,
  };
}

/**
 * Score a whole course.
 * @param {Array} items manifest items
 * @param {Array} rows page rows {id, words, images, videos, embeds, ...}
 * @param {Object} [options] {weights, depth}
 * @returns {Object} {depth, phrases, lessons, median, flow, rests,
 *   blankPages, resolves}
 */
export function analyzeCadence(items, rows, options) {
  const opts = options || {};
  const byId = {};
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    if (row && row.id != null) {
      byId[String(row.id)] = row;
    }
  });
  const grouped = buildPhrases(items, opts.depth);
  const pageInfo = (node) => {
    const row = byId[String(node.item.id)] || {};
    return {
      weight: pageWeight(row, opts.weights),
      rest: isRest(row),
      leaf: node.children.length === 0,
    };
  };
  const allWeights = [];
  grouped.phrases.forEach((phrase) => {
    phrase.info = phrase.pages.map(pageInfo);
    phrase.info.forEach((info) => {
      if (!info.rest) {
        allWeights.push(info.weight);
      }
    });
  });
  const courseMedian = median(allWeights) || 1;
  const phrases = grouped.phrases.map((phrase) => {
    const isLesson = phrase.kind === "lesson";
    const shape = isLesson ? lessonShape(phrase.info) : null;
    let walk = TONIC;
    const beats = phrase.pages.map((node, i) => {
      const info = phrase.info[i];
      let role = info.rest ? "rest" : "phrase";
      if (shape) {
        role = shape.roles[i];
        if (
          i === phrase.pages.length - 1 &&
          !info.rest &&
          shape.cadence === "half"
        ) {
          role = "half";
        }
      }
      const ratio = info.weight / courseMedian;
      const result = beatPitches(role, ratio, i, walk);
      walk = result.walk;
      return {
        id: node.item.id,
        title: node.item.title,
        slug: node.item.slug,
        depth: node.depth,
        weight: info.weight,
        ratio,
        rest: info.rest,
        leaf: info.leaf,
        role: shape ? shape.roles[i] : role,
        pitches: result.pitches,
      };
    });
    return {
      kind: phrase.kind,
      id: phrase.id,
      title: phrase.title,
      beats,
      climax: shape ? shape.climax : -1,
      checks: shape ? shape.checks : null,
      score: shape ? shape.score : 0,
      cadence: shape ? shape.cadence : "",
    };
  });
  const lessons = phrases.filter((p) => p.kind === "lesson");
  const totalParts = lessons.length * CADENCE_PARTS.length;
  const allBeats = phrases.reduce((list, p) => list.concat(p.beats), []);
  const lessonBeats = lessons.reduce((list, p) => list.concat(p.beats), []);
  return {
    depth: grouped.depth,
    phrases,
    lessons,
    median: courseMedian,
    flow:
      totalParts === 0
        ? 0
        : Math.round(
            (100 * lessons.reduce((sum, l) => sum + l.score, 0)) / totalParts,
          ),
    rests: allBeats.filter((b) => b.rest).length,
    // blank content pages inside lessons (a module's own short page or a
    // stray page between lessons is not a lesson page)
    blankPages: lessonBeats.filter((b) => b.rest && b.leaf),
    resolves: lessons.filter((l) => l.checks.cadence).length,
  };
}

function texString(value) {
  return String(value == null ? "" : value).replace(/["\\\r\n]/g, " ");
}

/**
 * alphaTex for <sheet-music>: one bar per phrase in N/4, where N is the
 * number of pages in it, each lesson's bar marked with its title.
 * @param {Object} analysis result of analyzeCadence
 * @param {String} [title]
 * @returns {String}
 */
export function cadenceToAlphaTex(analysis, title) {
  const durations = { 1: ":4", 2: ":8", 4: ":16" };
  const phrases = analysis && analysis.phrases ? analysis.phrases : [];
  const bars = phrases
    .filter((phrase) => phrase.beats.length > 0)
    .map((phrase) => {
      // lessons carry their title over the bar; interludes (often a single
      // module page) stay unlabelled so titles do not collide
      const out = [`\\ts ${phrase.beats.length} 4`];
      if (phrase.kind === "lesson") {
        out.push(`\\section "${texString(phrase.title)}"`);
      }
      let current = "";
      phrase.beats.forEach((beat) => {
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
