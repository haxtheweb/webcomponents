/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Word search grid generator. Pure functions, no DOM and no Math.random:
 * the same word list and options always give the same grid, so every
 * learner (and every reload) sees the same puzzle.
 */

export const WORD_SEARCH_MIN_SIZE = 4;
export const WORD_SEARCH_MAX_SIZE = 16;
// the largest grid picked automatically: 12 cells of 24px fit a 360px phone
export const WORD_SEARCH_AUTO_MAX = 12;
const AUTO_MIN = 6;
// a grapheme counts as a grid letter when it starts with a letter or digit
const LETTER = /^[\p{L}\p{N}]/u;

/**
 * FNV-1a, 32 bit. Deterministic and tiny; not a security feature.
 * @param {String} str
 * @returns {Number} unsigned 32 bit integer
 */
export function wordSearchHash(str) {
  const s = String(str == null ? "" : str);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Seeded generator (mulberry32): a function returning numbers in [0, 1).
 * @param {Number} seed
 * @returns {Function}
 */
export function wordSearchRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The grid letters of a word: upper case by the rules of the locale, split
 * into user perceived characters (so an accented letter or a letter with a
 * combining mark is one cell), with spaces and punctuation dropped.
 * @param {String} text the authored word
 * @param {String} [locale] BCP 47 tag, e.g. "tr"
 * @returns {String[]}
 */
export function wordSearchLetters(text, locale) {
  let s = String(text == null ? "" : text).normalize("NFC");
  try {
    s = locale ? s.toLocaleUpperCase(locale) : s.toLocaleUpperCase();
  } catch {
    s = s.toUpperCase();
  }
  let parts = null;
  if (globalThis.Intl && typeof globalThis.Intl.Segmenter === "function") {
    try {
      const segmenter = new globalThis.Intl.Segmenter(locale || undefined, {
        granularity: "grapheme",
      });
      parts = Array.from(segmenter.segment(s), (part) => part.segment);
    } catch {
      parts = null;
    }
  }
  if (!parts) {
    parts = Array.from(s);
  }
  return parts.filter((part) => LETTER.test(part));
}

function clampSize(n) {
  return Math.min(WORD_SEARCH_MAX_SIZE, Math.max(WORD_SEARCH_MIN_SIZE, n));
}

function cellsFor(row, col, dir, length) {
  const cells = [];
  for (let i = 0; i < length; i++) {
    cells.push([row + dir[0] * i, col + dir[1] * i]);
  }
  return cells;
}

/**
 * Build the puzzle.
 * @param {String[]} words authored words, in authored order
 * @param {Object} [options]
 * @param {Number} [options.size] cells per side; 0 or empty picks one that
 *   fits the longest word (at most WORD_SEARCH_AUTO_MAX)
 * @param {Boolean} [options.diagonal] also place words diagonally
 * @param {Boolean} [options.backwards] also place words reversed
 * @param {String} [options.locale] locale for upper casing and splitting
 * @returns {{size: Number, grid: String[][], placed: Object[],
 *   unplaced: String[]}} placed entries are { label, word, letters, cells }
 *   in authored order; unplaced holds the authored text of words left out
 */
export function generateWordSearch(words, options) {
  const opts = options || {};
  const list = Array.isArray(words) ? words : [];
  const entries = [];
  const unplaced = [];
  const seen = {};
  list.forEach((label, order) => {
    const text = String(label == null ? "" : label).trim();
    if (!text) {
      return;
    }
    const letters = wordSearchLetters(text, opts.locale);
    const word = letters.join("");
    if (seen[word]) {
      return;
    }
    if (letters.length < 2) {
      unplaced.push(text);
      return;
    }
    seen[word] = true;
    entries.push({ label: text, word, letters, order, cells: null });
  });

  const requested = Math.floor(Number(opts.size)) || 0;
  let size = 0;
  if (requested > 0) {
    size = clampSize(requested);
  } else if (entries.length) {
    const longest = Math.max(...entries.map((e) => e.letters.length));
    const total = entries.reduce((sum, e) => sum + e.letters.length, 0);
    size = Math.min(
      WORD_SEARCH_AUTO_MAX,
      Math.max(
        AUTO_MIN,
        Math.max(longest, Math.ceil(Math.sqrt(total * 2))) + 1,
      ),
    );
  }

  const dirs = [
    [0, 1],
    [1, 0],
  ];
  if (opts.diagonal) {
    dirs.push([1, 1], [-1, 1]);
  }
  if (opts.backwards) {
    dirs.slice().forEach((d) => dirs.push([-d[0], -d[1]]));
  }

  const random = wordSearchRandom(
    wordSearchHash(
      [
        entries.map((e) => e.word).join("\u0001"),
        size,
        opts.diagonal ? "d" : "",
        opts.backwards ? "b" : "",
      ].join("\u0002"),
    ),
  );
  const grid = [];
  for (let r = 0; r < size; r++) {
    grid.push(new Array(size).fill(""));
  }

  // longest first: they have the fewest places to go
  const byLength = entries
    .slice()
    .sort((a, b) => b.letters.length - a.letters.length || a.order - b.order);
  byLength.forEach((entry) => {
    const length = entry.letters.length;
    const spots = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        for (let d = 0; d < dirs.length; d++) {
          const endRow = r + dirs[d][0] * (length - 1);
          const endCol = c + dirs[d][1] * (length - 1);
          if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
            spots.push([r, c, d]);
          }
        }
      }
    }
    // seeded Fisher-Yates
    for (let i = spots.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const swap = spots[i];
      spots[i] = spots[j];
      spots[j] = swap;
    }
    for (let i = 0; i < spots.length; i++) {
      const cells = cellsFor(
        spots[i][0],
        spots[i][1],
        dirs[spots[i][2]],
        length,
      );
      const fits = cells.every(
        (cell, k) =>
          grid[cell[0]][cell[1]] === "" ||
          grid[cell[0]][cell[1]] === entry.letters[k],
      );
      if (fits) {
        cells.forEach((cell, k) => {
          grid[cell[0]][cell[1]] = entry.letters[k];
        });
        entry.cells = cells;
        break;
      }
    }
  });

  const placed = entries.filter((e) => e.cells);
  entries.filter((e) => !e.cells).forEach((e) => unplaced.push(e.label));

  // filler from the letters the words use, so the grid stays in the
  // alphabet of the content
  const alphabet = [];
  placed.forEach((entry) => {
    entry.letters.forEach((letter) => {
      if (!alphabet.includes(letter)) {
        alphabet.push(letter);
      }
    });
  });
  if (alphabet.length) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === "") {
          grid[r][c] = alphabet[Math.floor(random() * alphabet.length)];
        }
      }
    }
  }

  return {
    size: placed.length ? size : 0,
    grid: placed.length ? grid : [],
    placed: placed.map((e) => ({
      label: e.label,
      word: e.word,
      letters: e.letters,
      cells: e.cells,
    })),
    unplaced,
  };
}
