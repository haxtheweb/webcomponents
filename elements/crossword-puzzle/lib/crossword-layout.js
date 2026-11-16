/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
// Deterministic crossword layout: the same words in the same order always
// give the same grid. No randomness, no DOM; safe to run on a server.

/** most words a puzzle lays out; the rest are reported as unplaced */
export const CROSSWORD_MAX_WORDS = 24;
/** most cells one word may take */
export const CROSSWORD_MAX_LENGTH = 16;
/** fewest cells a word needs to be an entry */
export const CROSSWORD_MIN_LENGTH = 2;

const LETTER = /^[\p{L}\p{N}]/u;
const MARK = /^\p{M}$/u;

// user-perceived characters of a string: Intl.Segmenter where there is one,
// otherwise code points with combining marks joined to their base
function graphemes(text) {
  if (
    typeof globalThis.Intl !== "undefined" &&
    typeof globalThis.Intl.Segmenter === "function"
  ) {
    const segmenter = new globalThis.Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  const out = [];
  Array.from(text).forEach((ch) => {
    if (out.length && MARK.test(ch)) {
      out[out.length - 1] += ch;
    } else {
      out.push(ch);
    }
  });
  return out;
}

/**
 * The cells a word takes: upper case, one user-perceived character per cell
 * (an accented or non-Latin letter is one cell), with spaces, hyphens and
 * other characters that are not letters or digits left out.
 * @param {string} text
 * @returns {string[]}
 */
export function crosswordCells(text) {
  const clean = String(text == null ? "" : text)
    .normalize("NFC")
    .toUpperCase()
    .normalize("NFC");
  return graphemes(clean).filter((g) => LETTER.test(g));
}

const key = (r, c) => `${r},${c}`;
const STEP = { across: [0, 1], down: [1, 0] };

// can `cells` go at (r, c) in direction dir? Returns how many letters it
// would share with words already there, or -1 when the placement is illegal
function fit(grid, cells, r, c, dir) {
  const [dr, dc] = STEP[dir];
  // the squares just before and after the word stay empty
  if (
    grid.has(key(r - dr, c - dc)) ||
    grid.has(key(r + dr * cells.length, c + dc * cells.length))
  ) {
    return -1;
  }
  let crossings = 0;
  for (let i = 0; i < cells.length; i++) {
    const rr = r + dr * i;
    const cc = c + dc * i;
    const cell = grid.get(key(rr, cc));
    if (cell) {
      // a shared square: same letter, and only across a word going the
      // other way (never on top of a word in the same direction)
      if (cell.ch !== cells[i] || cell[dir] !== -1) {
        return -1;
      }
      crossings++;
    } else if (
      // a new square never sits beside another word
      grid.has(key(rr + dc, cc + dr)) ||
      grid.has(key(rr - dc, cc - dr))
    ) {
      return -1;
    }
  }
  return crossings > 0 && crossings < cells.length ? crossings : -1;
}

function bounds(placed) {
  let top = 0;
  let left = 0;
  let bottom = 0;
  let right = 0;
  placed.forEach((w, i) => {
    const [dr, dc] = STEP[w.dir];
    const r2 = w.r + dr * (w.cells.length - 1);
    const c2 = w.c + dc * (w.cells.length - 1);
    if (i === 0) {
      top = w.r;
      left = w.c;
      bottom = r2;
      right = c2;
    } else {
      top = Math.min(top, w.r);
      left = Math.min(left, w.c);
      bottom = Math.max(bottom, r2);
      right = Math.max(right, c2);
    }
  });
  return { top, left, bottom, right };
}

// best legal place for a word: most shared letters, then the smallest
// grid, then the narrowest, then top-left first, across before down
function bestPlace(grid, placed, cells) {
  let best = null;
  const box = bounds(placed);
  const seen = new Set();
  grid.forEach((cell, at) => {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] !== cell.ch) {
        continue;
      }
      ["across", "down"].forEach((dir) => {
        const [dr, dc] = STEP[dir];
        const [gr, gc] = at.split(",").map(Number);
        const r = gr - dr * i;
        const c = gc - dc * i;
        const id = `${r},${c},${dir}`;
        if (seen.has(id)) {
          return;
        }
        seen.add(id);
        const crossings = fit(grid, cells, r, c, dir);
        if (crossings < 0) {
          return;
        }
        const height =
          Math.max(box.bottom, r + dr * (cells.length - 1)) -
          Math.min(box.top, r) +
          1;
        const width =
          Math.max(box.right, c + dc * (cells.length - 1)) -
          Math.min(box.left, c) +
          1;
        const rank = [
          -crossings,
          width * height,
          width,
          r,
          c,
          dir === "across" ? 0 : 1,
        ];
        if (!best || compare(rank, best.rank) < 0) {
          best = { r, c, dir, rank };
        }
      });
    }
  });
  return best;
}

function compare(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return 0;
}

function put(grid, placed, entry, r, c, dir) {
  const [dr, dc] = STEP[dir];
  const index = placed.length;
  entry.cells.forEach((ch, i) => {
    const at = key(r + dr * i, c + dc * i);
    const cell = grid.get(at) || { ch, across: -1, down: -1 };
    cell[dir] = index;
    grid.set(at, cell);
  });
  placed.push({ ...entry, r, c, dir });
}

/**
 * Lay words out as a crossword.
 *
 * The longest word goes first, across; every other word (longest first,
 * authored order between equals) is crossed on a letter it shares with the
 * grid, trying both directions. A placement is rejected when it would touch
 * or overlap another word anywhere but a legal crossing. Words that find no
 * place are tried again after the others, then reported.
 *
 * @param {Array<{word: string, clue?: string}|string>} list words in
 *   authored order
 * @returns {{
 *   rows: number, cols: number,
 *   cells: Array<{r: number, c: number, ch: string, number: number,
 *     across: number, down: number}>,
 *   words: Array<{index: number, word: string, clue: string, text: string,
 *     cells: string[], dir: string, r: number, c: number, number: number}>,
 *   unplaced: Array<{index: number, word: string, reason: string}>
 * }} cells in reading order (across / down: position of the word in
 *   `words`, or -1); words in clue order (across by number, then down);
 *   unplaced reasons: "empty", "short", "long", "duplicate", "limit",
 *   "nofit"
 */
export function crosswordLayout(list) {
  const unplaced = [];
  const entries = [];
  const texts = new Set();
  (Array.isArray(list) ? list : []).forEach((item, index) => {
    const word = String(
      item && typeof item === "object" ? item.word || "" : item || "",
    );
    const clue = String(
      item && typeof item === "object" && item.clue ? item.clue : "",
    );
    const cells = crosswordCells(word);
    const text = cells.join("");
    let reason = "";
    if (!cells.length) {
      reason = "empty";
    } else if (cells.length < CROSSWORD_MIN_LENGTH) {
      reason = "short";
    } else if (cells.length > CROSSWORD_MAX_LENGTH) {
      reason = "long";
    } else if (texts.has(text)) {
      reason = "duplicate";
    } else if (entries.length >= CROSSWORD_MAX_WORDS) {
      reason = "limit";
    }
    if (reason) {
      unplaced.push({ index, word, reason });
      return;
    }
    texts.add(text);
    entries.push({ index, word, clue, text, cells });
  });

  const grid = new Map();
  const placed = [];
  let queue = entries
    .slice()
    .sort((a, b) => b.cells.length - a.cells.length || a.index - b.index);
  if (queue.length) {
    put(grid, placed, queue.shift(), 0, 0, "across");
  }
  // words that do not fit yet may fit once others are down
  let progress = true;
  while (queue.length && progress) {
    progress = false;
    const waiting = [];
    queue.forEach((entry) => {
      const place = bestPlace(grid, placed, entry.cells);
      if (place) {
        put(grid, placed, entry, place.r, place.c, place.dir);
        progress = true;
      } else {
        waiting.push(entry);
      }
    });
    queue = waiting;
  }
  queue.forEach((entry) =>
    unplaced.push({ index: entry.index, word: entry.word, reason: "nofit" }),
  );
  unplaced.sort((a, b) => a.index - b.index);

  if (!placed.length) {
    return { rows: 0, cols: 0, cells: [], words: [], unplaced };
  }

  // move the grid so its top-left square is 0,0 and number it in reading
  // order: a square gets a number when a word starts there
  const box = bounds(placed);
  const starts = new Map();
  placed.forEach((w) => {
    w.r -= box.top;
    w.c -= box.left;
    starts.set(key(w.r, w.c), 0);
  });
  Array.from(starts.keys())
    .map((at) => at.split(",").map(Number))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .forEach(([r, c], i) => starts.set(key(r, c), i + 1));
  placed.forEach((w) => {
    w.number = starts.get(key(w.r, w.c));
  });
  // clue order: across by number, then down by number
  const order = placed
    .map((w, i) => i)
    .sort(
      (a, b) =>
        (placed[a].dir === "across" ? 0 : 1) -
          (placed[b].dir === "across" ? 0 : 1) ||
        placed[a].number - placed[b].number,
    );
  const position = new Map(order.map((from, to) => [from, to]));
  const cells = [];
  grid.forEach((cell, at) => {
    const [gr, gc] = at.split(",").map(Number);
    const r = gr - box.top;
    const c = gc - box.left;
    cells.push({
      r,
      c,
      ch: cell.ch,
      number: starts.get(key(r, c)) || 0,
      across: cell.across === -1 ? -1 : position.get(cell.across),
      down: cell.down === -1 ? -1 : position.get(cell.down),
    });
  });
  cells.sort((a, b) => a.r - b.r || a.c - b.c);
  return {
    rows: box.bottom - box.top + 1,
    cols: box.right - box.left + 1,
    cells,
    words: order.map((i) => placed[i]),
    unplaced,
  };
}
