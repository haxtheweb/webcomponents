/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * Pure citation formatting helpers for `site-citation`.
 *
 * No DOM, no store, no imports: everything here takes plain data and returns
 * plain data so it can be unit tested without a browser.
 *
 * Fields read from the HAXcms manifest (site.json, JSON Outline Schema) and
 * the active item (page). Anything that is missing is OMITTED from the output,
 * never invented:
 *
 *   page title   item.title
 *   site title   manifest.title
 *   author       item.metadata.author | item.author   (page scope only)
 *                manifest.metadata.author | manifest.author |
 *                manifest.metadata.site.author        (string or { name })
 *   date         page scope: item.metadata.updated, else item.metadata.created
 *                site scope: manifest.metadata.site.updated, else .created
 *                (unix seconds as HAXcms writes them; ms and ISO strings
 *                are also accepted)
 *   url          manifest.metadata.site.domain (+ item.slug for a page),
 *                else the caller supplied fallbackUrl (the current location)
 *   license      manifest.license | manifest.metadata.author.license
 *
 * Author names are used exactly as authored unless the site supplies the name
 * as two separate pieces. A free-text name is never guessed at or split:
 * organisations, single names, particles ("van der Berg") and non-Western
 * names cannot be inverted reliably, and a wrong inversion is worse than the
 * name as written. So "Jane Q. Public" is printed as written in every style.
 *
 * When the author value is an object with explicit `given` and `family` (or
 * schema.org `givenName` and `familyName`) fields, each style uses the form it
 * calls for:
 *
 *   APA       Public, J. Q.
 *   MLA       Public, Jane Q.
 *   Chicago   Public, Jane Q.
 *   BibTeX    Public, Jane Q.
 */

export const CITATION_STYLES = ["apa", "mla", "chicago", "bibtex"];
export const CITATION_SCOPES = ["page", "site"];
// Style names are proper nouns, not translatable UI text, so they live here
// rather than in the locale files.
export const CITATION_STYLE_LABELS = {
  apa: "APA",
  mla: "MLA",
  chicago: "Chicago",
  bibtex: "BibTeX",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// MLA 9 abbreviations (May, June and July are spelled out)
const MLA_MONTHS = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "June",
  "July",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];

/**
 * trimmed non-empty string, or "" for anything else
 */
const clean = (v) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";

/**
 * Normalise a timestamp (unix seconds, ms, ISO string, Date) to a valid Date
 * or null. 0, negative numbers and unparseable values are treated as absent.
 */
export function toDate(value) {
  if (value === null || typeof value === "undefined" || value === "") {
    return null;
  }
  let d = null;
  if (value instanceof Date) {
    d = value;
  } else if (typeof value === "number" || /^\d+(\.\d+)?$/.test(String(value))) {
    const n = Number(value);
    if (!(n > 0)) return null;
    // HAXcms writes seconds; anything past ~year 5138 in seconds is ms
    d = new Date(n < 1e11 ? n * 1000 : n);
  } else if (typeof value === "string") {
    d = new Date(value);
  }
  return d && !isNaN(d.getTime()) ? d : null;
}

/**
 * Explicit { given, family } pieces from an author value, or null. Only
 * explicit fields count; a free-text name is never split.
 */
function authorParts(a) {
  if (!a || typeof a !== "object") return null;
  const given = clean(a.given) || clean(a.givenName);
  const family = clean(a.family) || clean(a.familyName);
  return given && family ? { given, family } : null;
}

/**
 * Pull a display name out of a string or { name } author value. An object with
 * explicit given / family pieces and no `name` reads as "given family".
 */
function authorName(a) {
  if (typeof a === "string") return clean(a);
  if (a && typeof a === "object") {
    const parts = authorParts(a);
    return clean(a.name) || (parts ? `${parts.given} ${parts.family}` : "");
  }
  return "";
}

/**
 * First author value (in priority order) that yields a name, as
 * { name, parts }. parts is null unless that same value has explicit pieces.
 */
function pickAuthor(values) {
  for (const v of values) {
    const name = authorName(v);
    if (name) return { name, parts: authorParts(v) };
  }
  return { name: "", parts: null };
}

/**
 * Author as one style wants it. Without explicit pieces this is the name
 * exactly as authored, for every style.
 */
function authorFor(style, s) {
  const p = s.authorParts;
  if (!p) return s.author;
  if (style === "apa") {
    const initials = p.given
      .split(/\s+/)
      .filter(Boolean)
      .map((word) =>
        word
          .split("-")
          .filter(Boolean)
          .map((piece) => `${Array.from(piece)[0].toUpperCase()}.`)
          .join("-"),
      )
      .join(" ");
    return `${p.family}, ${initials}`;
  }
  return `${p.family}, ${p.given}`;
}

function firstNonEmpty(list) {
  for (const v of list) {
    if (v) return v;
  }
  return "";
}

/**
 * Build the normalised citation source from a manifest and (optionally) a page.
 * @param {object} manifest site.json / store.manifest
 * @param {object} item active page item (required for scope "page")
 * @param {object} options { scope: "page" | "site", fallbackUrl: string }
 * @returns {{scope, author, authorParts, title, siteTitle, date, url, license}}
 */
export function buildCitationSource(manifest, item, options = {}) {
  const scope = options.scope === "site" ? "site" : "page";
  const m = manifest && typeof manifest === "object" ? manifest : {};
  const meta = m.metadata && typeof m.metadata === "object" ? m.metadata : {};
  const site = meta.site && typeof meta.site === "object" ? meta.site : {};
  const it = scope === "page" && item && typeof item === "object" ? item : {};
  const itMeta =
    it.metadata && typeof it.metadata === "object" ? it.metadata : {};

  // page author wins over the site author; each value keeps its own pieces
  const { name: author, parts: authorPieces } = pickAuthor([
    itMeta.author,
    it.author,
    meta.author,
    m.author,
    site.author,
  ]);

  const siteTitle = clean(m.title);
  const pageTitle = scope === "page" ? clean(it.title) : "";

  const date =
    scope === "page"
      ? toDate(itMeta.updated) || toDate(itMeta.created)
      : toDate(site.updated) || toDate(site.created);

  let domain = clean(site.domain);
  if (domain && !/^[a-z][a-z0-9+.-]*:\/\//i.test(domain)) {
    domain = "https://" + domain;
  }
  domain = domain.replace(/\/+$/, "");
  let url = "";
  if (domain) {
    const slug = scope === "page" ? clean(it.slug).replace(/^\/+/, "") : "";
    url = slug ? `${domain}/${slug}` : domain;
  }
  if (!url) url = clean(options.fallbackUrl);

  const license = firstNonEmpty([
    clean(m.license),
    clean(meta.author && meta.author.license),
  ]);

  return {
    scope,
    author,
    // { given, family } only when the site supplied both explicitly, else null
    authorParts: authorPieces,
    // for a page: the page title; for a site: the site title
    title: pageTitle || siteTitle,
    // container; only present when it adds information beyond the title
    siteTitle:
      pageTitle && siteTitle && pageTitle !== siteTitle ? siteTitle : "",
    date,
    url,
    license,
  };
}

/* ---------- tiny segment helpers: [{ text, italic }] ---------- */

const T = (text) => ({ text, italic: false });
const I = (text) => ({ text, italic: true });
const flat = (segs) => segs.map((s) => s.text).join("");

/** append a terminal period unless the text already ends in . ? or ! */
const dot = (s) => (/[.?!]$/.test(s) ? s : s + ".");
const dotSegs = (segs) => {
  if (!segs.length) return segs;
  const last = segs[segs.length - 1];
  return /[.?!]$/.test(last.text)
    ? segs
    : [...segs.slice(0, -1), { ...last, text: last.text + "." }];
};

/** join non-empty segment groups with a single space */
function join(groups) {
  const out = [];
  groups
    .filter((g) => g && g.length)
    .forEach((g, i) => {
      if (i > 0) out.push(T(" "));
      out.push(...g);
    });
  return out;
}

const dY = (d) => d.getUTCFullYear();
const dM = (d) => d.getUTCMonth();
const dD = (d) => d.getUTCDate();

function apa(s) {
  const date = s.date
    ? `(${dY(s.date)}, ${MONTHS[dM(s.date)]} ${dD(s.date)}).`
    : "(n.d.).";
  const authorG = s.author ? [T(dot(authorFor("apa", s)))] : [];
  // page: title is plain text, site is the italic container.
  // site: the site title is itself the italic work.
  const pageScope = s.scope === "page" && s.siteTitle;
  const titleG = s.title
    ? pageScope
      ? [T(dot(s.title))]
      : dotSegs([I(s.title)])
    : [];
  const siteG = pageScope ? dotSegs([I(s.siteTitle)]) : [];
  const urlG = s.url ? [T(s.url)] : [];
  // no author: the title takes the author position, date follows it
  return authorG.length
    ? join([authorG, [T(date)], titleG, siteG, urlG])
    : join([titleG, [T(date)], siteG, urlG]);
}

function mlaDate(d) {
  return `${dD(d)} ${MLA_MONTHS[dM(d)]} ${dY(d)}`;
}

function mla(s, accessed) {
  const authorG = s.author ? [T(dot(authorFor("mla", s)))] : [];
  const pageScope = s.scope === "page" && s.siteTitle;
  let head;
  let tail = [];
  if (pageScope) {
    head = s.title ? [T(`“${dot(s.title)}”`)] : [];
    tail = [I(s.siteTitle)];
  } else {
    head = s.title ? dotSegs([I(s.title)]) : [];
  }
  // MLA drops the protocol from web addresses
  const url = s.url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").replace(/\/$/, "");
  const parts = [];
  if (s.date) parts.push([T(mlaDate(s.date))]);
  if (url) parts.push([T(url)]);
  // container, date, location are comma separated and end with a period
  const chain = [];
  if (tail.length) chain.push(tail);
  parts.forEach((p) => chain.push(p));
  let chainSegs = [];
  chain.forEach((g, i) => {
    if (i > 0) chainSegs.push(T(", "));
    chainSegs.push(...g);
  });
  // a site with no container: date, URL follow the italic title after a period
  chainSegs = dotSegs(chainSegs);
  const acc = accessed ? [T(`Accessed ${mlaDate(accessed)}.`)] : [];
  return join([authorG, head, chainSegs, acc]);
}

function chicagoDate(d) {
  return `${MONTHS[dM(d)]} ${dD(d)}, ${dY(d)}`;
}

function chicago(s, accessed) {
  const authorG = s.author ? [T(dot(authorFor("chicago", s)))] : [];
  const pageScope = s.scope === "page" && s.siteTitle;
  const titleG = s.title
    ? pageScope
      ? [T(`“${dot(s.title)}”`)]
      : [T(dot(s.title))]
    : [];
  const siteG = pageScope ? [T(dot(s.siteTitle))] : [];
  let dateG = [];
  if (s.date) dateG = [T(dot(chicagoDate(s.date)))];
  else if (accessed) dateG = [T(`Accessed ${dot(chicagoDate(accessed))}`)];
  const urlG = s.url ? [T(dot(s.url))] : [];
  return join([authorG, titleG, siteG, dateG, urlG]);
}

/** escape the characters BibTeX / LaTeX treat specially in a field value */
export function escapeBibtex(str) {
  // single pass: replacing in stages would re-escape the braces and
  // backslashes that earlier replacements insert
  return String(str).replace(/[\\{}&%$#_~^]/g, (c) => BIBTEX_ESCAPES[c]);
}

const BIBTEX_ESCAPES = {
  "\\": "\\textbackslash{}",
  "{": "\\{",
  "}": "\\}",
  "&": "\\&",
  "%": "\\%",
  $: "\\$",
  "#": "\\#",
  _: "\\_",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
};

const iso = (d) =>
  `${dY(d)}-${String(dM(d) + 1).padStart(2, "0")}-${String(dD(d)).padStart(2, "0")}`;

/** deterministic cite key: firstword + year + firstTitleWord, ascii only */
export function bibtexKey(s) {
  const word = (str) =>
    (String(str)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .match(/[A-Za-z0-9]+/) || [""])[0].toLowerCase();
  // with explicit pieces the key starts from the family name
  const lead = s.authorParts ? s.authorParts.family : s.author;
  const key =
    word(lead || s.siteTitle || s.title) +
    (s.date ? String(dY(s.date)) : "") +
    word(s.title && s.author ? s.title : "");
  return key || "citation";
}

function bibtex(s, accessed) {
  const fields = [];
  const add = (k, v) => v && fields.push([k, escapeBibtex(v)]);
  add("author", s.author && authorFor("bibtex", s));
  add("title", s.title);
  if (s.scope === "page") add("organization", s.siteTitle);
  if (s.date) fields.push(["date", iso(s.date)]);
  // url is not escaped: biblatex reads it verbatim
  if (s.url) fields.push(["url", s.url]);
  if (accessed) fields.push(["urldate", iso(accessed)]);
  if (s.license) add("note", `License: ${s.license}`);
  const body = fields.map(([k, v]) => `  ${k} = {${v}}`).join(",\n");
  return body
    ? `@online{${bibtexKey(s)},\n${body}\n}`
    : `@online{${bibtexKey(s)}}`;
}

/**
 * Format a normalised source.
 * @param {object} source from buildCitationSource
 * @param {string} style apa | mla | chicago | bibtex (unknown falls back to apa)
 * @param {object} options { accessed: Date|number } optional access date;
 *   used by MLA (always), Chicago (only when the source has no date) and
 *   BibTeX (urldate). Omit it and no access date is printed.
 * @returns {{style, text, segments, missing}} segments are [{text, italic}]
 *   so a renderer can show italics without injecting HTML; text is the
 *   plain string that gets copied. missing lists absent fields.
 */
export function formatCitation(source, style, options = {}) {
  const s = source || {};
  const parts = authorParts(s.authorParts);
  const norm = {
    scope: s.scope === "site" ? "site" : "page",
    author: clean(s.author) || (parts ? `${parts.given} ${parts.family}` : ""),
    authorParts: parts,
    title: clean(s.title),
    siteTitle: clean(s.siteTitle),
    date: toDate(s.date),
    url: clean(s.url),
    license: clean(s.license),
  };
  const accessed = toDate(options.accessed);
  const st = CITATION_STYLES.includes(style) ? style : "apa";
  let segments;
  if (st === "bibtex") segments = [T(bibtex(norm, accessed))];
  else if (st === "mla") segments = mla(norm, accessed);
  else if (st === "chicago") segments = chicago(norm, accessed);
  else segments = apa(norm);
  const missing = ["author", "title", "date", "url"].filter((k) => !norm[k]);
  return { style: st, text: flat(segments), segments, missing };
}
