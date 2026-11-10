/**
 * Pseudo-localization for layout testing (no dependencies; runs in Node and
 * in the browser).
 *
 * pseudoLocalize("Save changes") -> "⟦Šåṽé çĥåñĝéš ·····⟧"
 *
 * - letters become accented look-alikes, so text that was never translated
 *   (hard-coded in a template) is easy to tell apart from text that went
 *   through this.t
 * - every string grows by about 40% (EXPANSION) plus the two markers, the
 *   growth real translations bring (German, Finnish, Russian...)
 * - the ⟦ ⟧ markers show where a string starts and ends, so a clipped or
 *   truncated string is visible as a missing ⟧
 * - placeholders ({name}, {{name}}, %s, %1$s, ${name}) and markup (<b>,
 *   &amp;) are left as they are so interpolation still works
 *
 * The pseudo-locale only exists in memory while the i18n layout test runs
 * (scripts/test-setup/i18n-layout-runner.js). It is never written as a
 * locale file, so the locale guard and the nightly translation job never see
 * a new language.
 */

export const PSEUDO_LANG = "qps-ploc";
export const MARK_OPEN = "⟦";
export const MARK_CLOSE = "⟧";
export const EXPANSION = 0.4;

const ACCENTS = {
  a: "å",
  b: "ƀ",
  c: "ç",
  d: "ð",
  e: "é",
  f: "ƒ",
  g: "ĝ",
  h: "ĥ",
  i: "î",
  j: "ĵ",
  k: "ķ",
  l: "ļ",
  m: "ɱ",
  n: "ñ",
  o: "ö",
  p: "þ",
  q: "ǫ",
  r: "ŕ",
  s: "š",
  t: "ţ",
  u: "û",
  v: "ṽ",
  w: "ŵ",
  x: "ẋ",
  y: "ý",
  z: "ž",
  A: "Å",
  B: "Ɓ",
  C: "Ç",
  D: "Ð",
  E: "É",
  F: "Ƒ",
  G: "Ĝ",
  H: "Ĥ",
  I: "Î",
  J: "Ĵ",
  K: "Ķ",
  L: "Ļ",
  M: "Ṁ",
  N: "Ñ",
  O: "Ö",
  P: "Þ",
  Q: "Ǫ",
  R: "Ŕ",
  S: "Š",
  T: "Ţ",
  U: "Û",
  V: "Ṽ",
  W: "Ŵ",
  X: "Ẋ",
  Y: "Ý",
  Z: "Ž",
};

// placeholders and markup that must survive untouched; each alternative is
// a single bounded token (no nested quantifiers), so matching stays linear
const PROTECTED =
  /(\{\{[\w.-]{1,64}\}\}|\{[\w.-]{1,64}\}|\$\{[\w.-]{1,64}\}|%(?:\d{1,2}\$)?[sdif]|<[^<>]{0,256}>|&#?\w{1,16};)/g;

// filler words: accented and spaced like text, so padding wraps the way a
// longer translation would instead of making one unbreakable run
const PAD = " ļöŕéɱ îþšûɱ ðöļöŕ šîţ åɱéţ çöñšéçţéţûŕ åðîþîšçîñĝ éļîţ";

function accent(text) {
  let out = "";
  for (const ch of text) {
    out += ACCENTS[ch] || ch;
  }
  return out;
}

function letterCount(text) {
  const m = text.match(/[A-Za-z]/g);
  return m ? m.length : 0;
}

/**
 * @param {string} text English string
 * @returns {string} pseudo-localized string (unchanged when it has no letters)
 */
export function pseudoLocalize(text) {
  if (typeof text !== "string" || letterCount(text) === 0) {
    return text;
  }
  // already pseudo-localized; keep it idempotent
  if (text.startsWith(MARK_OPEN) && text.endsWith(MARK_CLOSE)) {
    return text;
  }
  let body = "";
  let visible = 0;
  let last = 0;
  text.replace(PROTECTED, (match, _p, offset) => {
    const plain = text.slice(last, offset);
    body += accent(plain);
    visible += plain.length;
    body += match;
    last = offset + match.length;
    return match;
  });
  const tail = text.slice(last);
  body += accent(tail);
  visible += tail.length;
  const padLength = Math.max(1, Math.ceil(visible * EXPANSION));
  let pad = "";
  while (pad.length < padLength) {
    pad += PAD;
  }
  pad = pad.slice(0, padLength);
  // a pad that would start with a space next to the text is fine (word
  // break); one that ends in a space would be trimmed by layout, so swap it
  if (pad.endsWith(" ")) {
    pad = pad.slice(0, -1) + "·";
  }
  return `${MARK_OPEN}${body}${pad}${MARK_CLOSE}`;
}

/**
 * Pseudo-localize every string in a this.t style object (nested objects and
 * arrays included). Returns a new object; the input is not changed.
 */
export function pseudoLocalizeObject(value) {
  if (typeof value === "string") {
    return pseudoLocalize(value);
  }
  if (Array.isArray(value)) {
    return value.map(pseudoLocalizeObject);
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = pseudoLocalizeObject(value[key]);
    }
    return out;
  }
  return value;
}

/** true when a piece of visible text came through pseudoLocalize */
export function hasPseudoMarker(text) {
  return (
    typeof text === "string" &&
    (text.includes(MARK_OPEN) || text.includes(MARK_CLOSE))
  );
}
