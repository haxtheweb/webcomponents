/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * Merlin's spoken search, without AI: plain string math that turns what
 * the speech engine heard into a ranked list of commands, plus a small
 * grammar for moving through results ("second one", "next", "run").
 *
 * Every function here is pure, so the same words always give the same
 * answer and the behavior can be tested exhaustively.
 *
 * Words that change by language (fillers, numbers, grammar) are passed in
 * as a vocabulary built from super-daemon's translated strings; English is
 * the default.
 */

/** A pipe separated list (how translated vocab is stored) as an array. */
export function merlinWordList(value) {
  return String(value || "")
    .split("|")
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
}

/** The English defaults; super-daemon passes translated ones. */
export const MERLIN_VOICE_VOCAB_EN = {
  fillers:
    "please|can you|could you|would you|will you|i want to|i'd like to|i would like to|let's|let me|go ahead and|um|uh|hey|merlin|ok|okay",
  stopWords: "a|an|the|to|my|this|for|of|me",
  numbers: "zero|one|two|three|four|five|six|seven|eight|nine|ten",
  ordinals: "zeroth|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth",
  pickPrefixes: "number|option|item|result|pick|choose|select|the",
  pickSuffix: "one",
  // what speech engines often write for a spoken number after "option" or
  // "number": "option to", "number for"
  numberSoundalikes: "won=1|to=2|too=2|tu=2|tree=3|free=3|for=4|fore=4|ate=8",
  next: "next|down|next one",
  back: "back|previous|up|go back",
  run: "run|go|yes|do it|run it|open it|that one",
  clear: "clear|start over|reset",
  cancel: "cancel|never mind|nevermind",
  help: "help|what can i say|what can i do",
};

/**
 * Build a ready-to-use vocabulary from pipe separated strings.
 * @param {Object} strings keys like MERLIN_VOICE_VOCAB_EN
 */
export function merlinVoiceVocab(strings = {}) {
  const src = { ...MERLIN_VOICE_VOCAB_EN, ...strings };
  const vocab = {};
  Object.keys(MERLIN_VOICE_VOCAB_EN).forEach((key) => {
    if (key === "numberSoundalikes") {
      return;
    }
    vocab[key] = merlinWordList(src[key]);
    // a translation that came back empty falls back to English
    if (!vocab[key].length) {
      vocab[key] = merlinWordList(MERLIN_VOICE_VOCAB_EN[key]);
    }
  });
  // "word=number" pairs; a translation that came back empty uses English
  vocab.numberSoundalikes = {};
  const pairs = merlinWordList(src.numberSoundalikes).length
    ? merlinWordList(src.numberSoundalikes)
    : merlinWordList(MERLIN_VOICE_VOCAB_EN.numberSoundalikes);
  pairs.forEach((pair) => {
    const at = pair.indexOf("=");
    const n = at > 0 ? parseInt(pair.slice(at + 1), 10) : NaN;
    if (n >= 1) {
      vocab.numberSoundalikes[pair.slice(0, at).trim()] = n;
    }
  });
  // longest phrases first so "i would like to" wins over "i"
  vocab.fillers.sort((a, b) => b.length - a.length);
  return vocab;
}

const DEFAULT_VOCAB = merlinVoiceVocab();

/**
 * Lowercase, strip punctuation, collapse spaces. Keeps letters and digits
 * in every script.
 * @param {string} text
 * @returns {string}
 */
export function merlinCleanText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The words that carry meaning: cleaned, fillers and stop words removed,
 * number words turned into digits.
 * @param {string} text
 * @param {Object} [vocab]
 * @returns {Array<string>}
 */
export function merlinTokens(text, vocab = DEFAULT_VOCAB) {
  const words = merlinCleanText(text).split(" ").filter(Boolean);
  const fillers = vocab.fillers.map((f) => f.split(" "));
  const stop = {};
  vocab.stopWords.forEach((w) => {
    stop[w] = true;
  });
  const out = [];
  let i = 0;
  while (i < words.length) {
    // skip a filler phrase starting here (longest first)
    let skip = 0;
    for (let f = 0; f < fillers.length && !skip; f++) {
      const filler = fillers[f];
      let hit = filler.length > 0 && i + filler.length <= words.length;
      for (let k = 0; hit && k < filler.length; k++) {
        hit = words[i + k] === filler[k];
      }
      if (hit) {
        skip = filler.length;
      }
    }
    if (skip) {
      i += skip;
      continue;
    }
    const w = words[i];
    if (!stop[w]) {
      const n = vocab.numbers.indexOf(w);
      out.push(n === -1 ? w : String(n));
    }
    i++;
  }
  return out;
}

/**
 * Jaro-Winkler similarity, 0 (nothing alike) to 1 (identical).
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function merlinJaroWinkler(a, b) {
  if (a === b) {
    return 1;
  }
  const la = a.length;
  const lb = b.length;
  if (!la || !lb) {
    return 0;
  }
  const range = Math.max(0, Math.floor(Math.max(la, lb) / 2) - 1);
  const aHit = new Array(la).fill(false);
  const bHit = new Array(lb).fill(false);
  let matches = 0;
  for (let i = 0; i < la; i++) {
    const lo = Math.max(0, i - range);
    const hi = Math.min(i + range + 1, lb);
    for (let j = lo; j < hi; j++) {
      if (!bHit[j] && a.charAt(i) === b.charAt(j)) {
        aHit[i] = true;
        bHit[j] = true;
        matches++;
        break;
      }
    }
  }
  if (!matches) {
    return 0;
  }
  let k = 0;
  let transpositions = 0;
  for (let i = 0; i < la; i++) {
    if (aHit[i]) {
      while (!bHit[k]) {
        k++;
      }
      if (a.charAt(i) !== b.charAt(k)) {
        transpositions++;
      }
      k++;
    }
  }
  const m = matches;
  const jaro = (m / la + m / lb + (m - transpositions / 2) / m) / 3;
  let prefix = 0;
  while (prefix < 4 && prefix < la && prefix < lb) {
    if (a.charAt(prefix) !== b.charAt(prefix)) {
      break;
    }
    prefix++;
  }
  return jaro + prefix * 0.1 * (1 - jaro);
}

/**
 * A Metaphone-style sound key for a Latin-script word, so words that sound
 * alike match ("merlin" / "marilyn", "phone" / "fone"). Other scripts and
 * digits come back unchanged.
 * @param {string} word
 * @returns {string}
 */
export function merlinSoundKey(word) {
  let w = String(word || "").toLowerCase();
  if (!/^[a-z]+$/.test(w)) {
    return w;
  }
  if (/^(kn|gn|pn|wr|ps)/.test(w)) {
    w = w.slice(1);
  }
  if (w.charAt(0) === "x") {
    w = "s" + w.slice(1);
  }
  w = w
    .replace(/x/g, "ks")
    .replace(/^wh/, "w")
    .replace(/mb$/, "m")
    .replace(/ph/g, "f")
    .replace(/ck/g, "k")
    .replace(/sch/g, "sk")
    .replace(/tch/g, "ch")
    .replace(/gh(?=[^aeiou]|$)/g, "")
    .replace(/th/g, "0")
    .replace(/(sh|sio|tio|tia)/g, "x")
    .replace(/ch/g, "x")
    .replace(/c(?=[iey])/g, "s")
    .replace(/c/g, "k")
    .replace(/q/g, "k")
    .replace(/dg(?=[iey])/g, "j")
    .replace(/g(?=[iey])/g, "j")
    .replace(/z/g, "s")
    .replace(/v/g, "f")
    .replace(/w(?![aeiou])/g, "")
    .replace(/h(?![aeiou])/g, "")
    .replace(/y(?![aeiou])/g, "");
  const first = w.charAt(0);
  const key = first + w.slice(1).replace(/[aeiouy]/g, "");
  // collapse doubled sounds
  let out = "";
  for (let i = 0; i < key.length; i++) {
    if (key.charAt(i) !== key.charAt(i - 1)) {
      out += key.charAt(i);
    }
  }
  return out;
}

/**
 * How alike two words are, 0 to 1: spelling (Jaro-Winkler) or sound.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function merlinWordSimilarity(a, b) {
  if (a === b) {
    return 1;
  }
  // digits only match digits exactly ("2" is not "3")
  if (/^\d+$/.test(a) || /^\d+$/.test(b)) {
    return 0;
  }
  let score = merlinJaroWinkler(a, b);
  if (a.length > 2 && b.length > 2) {
    const ka = merlinSoundKey(a);
    if (ka.length > 1 && ka === merlinSoundKey(b)) {
      score = Math.max(score, 0.92);
    }
  }
  return score;
}

/** Word pairs below this similarity count as not matching at all. */
export const MERLIN_WORD_FLOOR = 0.8;

/**
 * Parse a command phrase into required and optional words, accepting the
 * voice phrase syntax: "(toggle) dark mode" has optional "toggle".
 * Named (:x) and splat (*x) params are dropped.
 * @param {string} phrase
 * @param {Object} [vocab]
 * @returns {{required: Array<string>, optional: Array<string>}}
 */
export function merlinPhraseWords(phrase, vocab = DEFAULT_VOCAB) {
  const text = String(phrase || "")
    .replace(/[:*]\w+/g, " ")
    .trim();
  const optional = [];
  const required = text.replace(/\(([^)]*)\)/g, (m, inner) => {
    optional.push(...merlinTokens(inner, vocab));
    return " ";
  });
  return {
    required: merlinTokens(required, vocab),
    optional: optional,
  };
}

/**
 * Score heard words against one phrase, 0 to 1: how much of the phrase was
 * said (recall) balanced with how much of what was said is the phrase
 * (precision).
 * @param {Array<string>} heard tokens from merlinTokens
 * @param {{required: Array<string>, optional: Array<string>}} words
 * @returns {number}
 */
export function merlinScoreWords(heard, words) {
  const required = words.required;
  if (!heard.length || !required.length) {
    return 0;
  }
  const all = required.concat(words.optional);
  const best = (word, pool) => {
    let top = 0;
    for (let i = 0; i < pool.length && top < 1; i++) {
      const s = merlinWordSimilarity(word, pool[i]);
      if (s > top) {
        top = s;
      }
    }
    return top >= MERLIN_WORD_FLOOR ? top : 0;
  };
  let recall = 0;
  required.forEach((w) => {
    recall += best(w, heard);
  });
  recall = recall / required.length;
  let precision = 0;
  heard.forEach((w) => {
    precision += best(w, all);
  });
  precision = precision / heard.length;
  if (!recall || !precision) {
    return 0;
  }
  return (2 * recall * precision) / (recall + precision);
}

/** How much a match on each kind of phrase counts. */
export const MERLIN_PHRASE_WEIGHTS = { title: 1, voice: 1, tag: 0.8 };

/**
 * Build the searchable entries for a list of Merlin items once, so each
 * utterance only does the scoring.
 * @param {Array<Object>} items super-daemon items (title, voice, tags)
 * @param {Object} [vocab]
 * @returns {Array<Object>} { item, phrases: [{ words, weight }] }
 */
export function merlinVoiceEntries(items = [], vocab = DEFAULT_VOCAB) {
  return items
    .filter((item) => item && item.title)
    .map((item) => {
      const phrases = [
        {
          words: merlinPhraseWords(item.title, vocab),
          weight: MERLIN_PHRASE_WEIGHTS.title,
        },
      ];
      if (item.voice) {
        phrases.push({
          words: merlinPhraseWords(item.voice, vocab),
          weight: MERLIN_PHRASE_WEIGHTS.voice,
        });
      }
      (item.tags || []).forEach((tag) => {
        if (typeof tag === "string" && tag) {
          phrases.push({
            words: merlinPhraseWords(tag, vocab),
            weight: MERLIN_PHRASE_WEIGHTS.tag,
          });
        }
      });
      return { item: item, phrases: phrases };
    });
}

/** Later alternatives are the engine's lesser guesses; trust them less. */
export const MERLIN_ALTERNATIVE_PENALTY = 0.03;

/**
 * Rank entries for everything the engine heard.
 * @param {Array<string>} alternatives best guess first
 * @param {Array<Object>} entries from merlinVoiceEntries
 * @param {Object} [vocab]
 * @returns {Array<{item: Object, score: number, transcript: string}>}
 */
export function merlinRankVoice(alternatives, entries, vocab = DEFAULT_VOCAB) {
  const byItem = new Map();
  (alternatives || []).forEach((transcript, a) => {
    const heard = merlinTokens(transcript, vocab);
    if (!heard.length) {
      return;
    }
    const penalty = a * MERLIN_ALTERNATIVE_PENALTY;
    entries.forEach((entry) => {
      let top = 0;
      entry.phrases.forEach((phrase) => {
        const s = merlinScoreWords(heard, phrase.words) * phrase.weight;
        if (s > top) {
          top = s;
        }
      });
      const score = Math.max(0, top - penalty);
      const prior = byItem.get(entry.item);
      if (score > 0 && (!prior || score > prior.score)) {
        byItem.set(entry.item, {
          item: entry.item,
          score: score,
          transcript: transcript,
        });
      }
    });
  });
  return Array.from(byItem.values()).sort((x, y) => y.score - x.score);
}

/** Score bands: at or above high runs, at or above medium asks. */
export const MERLIN_BANDS = { high: 0.9, medium: 0.65, margin: 0.08 };

/**
 * How sure to be about a ranking.
 * - high: one clear winner; run it
 * - medium: a likely answer, or several close ones; ask
 * - low: nothing close; just search with the words
 * @param {Array<{score: number}>} ranked from merlinRankVoice
 * @returns {"high"|"medium"|"low"}
 */
export function merlinVoiceBand(ranked) {
  if (!ranked || !ranked.length) {
    return "low";
  }
  const top = ranked[0].score;
  const next = ranked.length > 1 ? ranked[1].score : 0;
  if (top >= MERLIN_BANDS.high && top - next >= MERLIN_BANDS.margin) {
    return "high";
  }
  if (top >= MERLIN_BANDS.medium) {
    return "medium";
  }
  return "low";
}

/**
 * Read a navigation phrase: "second one", "number 3", "next", "run".
 * @param {string} text one alternative
 * @param {Object} [vocab]
 * @returns {null|{action: string, index?: number}} index is 0 based
 */
export function merlinParseVoiceGrammar(text, vocab = DEFAULT_VOCAB) {
  const clean = merlinCleanText(text);
  if (!clean) {
    return null;
  }
  const actions = ["help", "cancel", "clear", "next", "back", "run"];
  for (let i = 0; i < actions.length; i++) {
    if (vocab[actions[i]].indexOf(clean) !== -1) {
      return { action: actions[i] };
    }
  }
  // picking a row by number: strip lead words and a trailing "one"
  let words = clean.split(" ");
  let prefixed = false;
  while (words.length > 1 && vocab.pickPrefixes.indexOf(words[0]) !== -1) {
    words = words.slice(1);
    prefixed = true;
  }
  if (words.length === 2 && vocab.pickSuffix.indexOf(words[1]) !== -1) {
    words = words.slice(0, 1);
  }
  if (words.length !== 1) {
    return null;
  }
  const word = words[0];
  let n = -1;
  // "2", and "2nd" / "3rd" / "2º" / "2e" as engines write ordinals
  const digits = /^(\d+)[^\d\s]{0,3}$/u.exec(word);
  if (digits) {
    n = parseInt(digits[1], 10);
  } else if (prefixed && vocab.numberSoundalikes[word]) {
    // only after "option" / "number", so a lone "for" stays a word
    n = vocab.numberSoundalikes[word];
  } else if (vocab.ordinals.indexOf(word) !== -1) {
    n = vocab.ordinals.indexOf(word);
  } else if (vocab.numbers.indexOf(word) !== -1) {
    n = vocab.numbers.indexOf(word);
  }
  if (n >= 1) {
    return { action: "pick", index: n - 1 };
  }
  return null;
}
