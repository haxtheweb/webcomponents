/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * HAX Insights analyzer: pure functions, no network, no DOM globals beyond
 * DOMParser (and not even that inside a Web Worker; see insights-html.js).
 *
 *   pageFacts(html, item, spec)            -> facts for one page
 *   siteResults(factsList, manifest, spec) -> one results object
 *
 * Every threshold and word list comes from insights-spec.json. Given the same
 * inputs and options.now the output is identical, so a server-side insights
 * provider can run this module later and produce the same report.
 *
 * ---------------------------------------------------------------------------
 * Page facts (pageFacts) — plain, structured-clone safe:
 *   { id, slug, title, parent, order, location, description, published,
 *     hidden, created, updated (unix seconds or null), indexImages,
 *     indexVideos (lengths of item.metadata.images / videos),
 *     words, paragraphs, blocks, textStart (first 40 words),
 *     headings: [levels in order], headingIssues: { h1, skips: ["h1 → h3"] },
 *     readability: { sentences, syllables, grade|null },
 *     images: [{ tag, src, file, alt|null, inLink, hasCaption }],
 *     iframes: [{ src, host, hasTitle }],
 *     videos: [{ tag, source, host, youtube, hasTrack }],
 *     tables: { count, withoutHeaders },
 *     links: [{ href, name, hasName, viaImage }],
 *     tags: { tagName: count }, objectives: [text],
 *     termHits: [termMatch] (term words and dates in the body text) }
 *
 * A page ref is { id, slug, title }. Every row below that has a pageId also
 * has slug and title, so screens can open the page without a lookup.
 * A termMatch is { where: "title"|"text", reason, kind: "word"|"date",
 * match, snippet }.
 *
 * Results (siteResults):
 * {
 *   version, specVersion, generatedAt (ISO), now (ms),
 *   scope: { mode: "site"|"branch", rootId, pages },
 *   totals: { pages, words, paragraphs, readMinutes, videos, videoPages,
 *             embeds, embedPages, images, accessibilityErrors },
 *   thresholds: { wordsPerMinute, longPageParagraphs,
 *             paragraphsPerHeadingWarn, thinMaxBlocks, thinMaxWords,
 *             sectionNoHeadingsParagraphs, noHeadingsWarnPct,
 *             readabilityMinWords, altMinLength, altMaxLength,
 *             contrastMinRatio, editedRecentlyDays, ageBucketsYears,
 *             ageWarningYears, ageDangerYears, bulkSaveMinPages,
 *             bulkSaveWindowMinutes, wallsLimit, longestLimit, scoreDanger,
 *             scoreWarning, pageListLimit } (spec values screens put in words)
 *   nav: { <sectionId>: { badge: string|number|null, tone } } (badge is null
 *          when there is nothing worth flagging),
 *   overview: {
 *     stats: { pages, paragraphs, words, readMinutes, videos, videoPages,
 *              practicePages, accessibilityErrors, untitledIframes,
 *              daysSinceLastEdit, lastEdit },
 *     fixNext: [finding], findings: [finding],
 *     health: { score|null (average of measurable checks; null when none),
 *               checks: [{ id, label, passed, total, score|null, how,
 *                          howOne (how, when total is 1) }],
 *               outsideLinks: unavailable },
 *     folders: [{ name, pages, flagged }], unavailable: [unavailable] },
 *   accessibility: {
 *     kpis: { imagesToReview, imagesTotal, fix, check, ok, untitledIframes,
 *             untitledIframePages, videosWithoutTrack, youtubeVideos,
 *             headingErrorPages, extraH1Pages, skipPages, themeContrast },
 *     altRows: [{ pageId, pageTitle, slug, tag, src, file, alt|null, inLink,
 *                 hasCaption, status: "fix"|"check"|"ok", reason, reasonText }],
 *     altCounts: { all, fix, check, ok },
 *     criteria: [{ sc, name, state: "fails"|"check"|"passes", found, how,
 *                  params, unavailable? }],
 *     headingErrors: [{ pageId, title, slug, chips }],
 *     contrast: [{ id, fg, bg, ratio, passes }],
 *     errors, youtubeCaptions: unavailable, bulkAltSave: unavailable },
 *   content: { kpis, sections: [row], longest: [row], readTime: [bucket],
 *              thin: [{ pageId, slug, title, words, empty, what }],
 *              readability: { bands, median, scored }, pages: [row],
 *              trends: unavailable },
 *     (longest rows: { pageId, slug, title, paragraphs, headings, words,
 *                      perHeading|null, warn })
 *   links: { kpis, findings: [{ code, severity, label, href, pageId, page,
 *                               slug, fix }],
 *            counts: { all, errors, warnings, info },
 *            leanOnHosts: [{ pageId, slug, title, embeds, videos, worksheets,
 *                            hosts }],
 *            embedHosts: [{ host, count }],
 *            outsideLinks: { total, hosts }, outsideLinkStatus: unavailable },
 *   media: { kpis, videosPerPage: [bucket],
 *            noMedia: [{ pageId, slug, title }],
 *            bySection: [row], mediaIndex: { videos, images }, pages: [row],
 *            videoMinutes: unavailable, rebuildIndex: unavailable },
 *   instructional: { kpis, columns, activityMap: [row],
 *                    practice: [{ pageId, slug, title, section, embeds,
 *                                 videos, paragraphs, worksheets,
 *                                 nativeChecks, state, what }],
 *                    practicePerSection: [row], weeksWithoutPractice: [name],
 *                    bloom: [row],
 *                    objectives: [{ pageId, slug, title, text, verb, level }],
 *                    walls: [longest row], workingWell: [row],
 *                    thresholds: unavailable (editing them) },
 *   freshness: { kpis (… termSpecific, termInText),
 *                events: [event],
 *                ageBuckets: [{ label, minYears, maxYears|null,
 *                               tone: ""|"warning"|"danger", count }],
 *                termSpecific: [{ pageId, slug, title, reason, where, match,
 *                                 snippet, matches: [termMatch], updated }],
 *                bulkSaves: [row],
 *                pages: [{ pageId, slug, title, created, updated,
 *                          daysSinceUpdate, termReason, termWhere,
 *                          termMatch }],
 *                editHistory: unavailable, reminders: unavailable },
 *   metadata: { kpis (aiFiles: { found, total, optional, optionalFound }),
 *               checks: [check], noDescription: [row],
 *               sharedTitles: [{ title, count, pageIds, pageList: [ref] }],
 *               genericTitles: [row], pages: [row] },
 *   components: { kpis, hax: [row], html: [row],
 *                 flags: [{ code, state, count, pages, title, detail,
 *                           tags: [tagName], pageList: [ref] }],
 *                 suggestions: [row] },
 *   unavailable: { <key>: { available: false, needs } }
 * }
 * A finding is { code, severity: "error"|"warning"|"info", section, count,
 * pages, title, detail, params, pageList: [ref] }. pageList holds up to
 * thresholds.pageListLimit of the pages it is about; site-wide findings and
 * findings about folders have an empty pageList. Titles are English
 * defaults; UIs translate from code + params.
 * ---------------------------------------------------------------------------
 */
import { parseHtml } from "./insights-html.js";

export const INSIGHTS_SECTIONS = [
  "overview",
  "accessibility",
  "content",
  "links",
  "media",
  "instructional",
  "freshness",
  "metadata",
  "components",
];

const DAY = 86400;

// ---------------------------------------------------------------- helpers

function attr(node, name) {
  if (!node || !node.attrs) {
    return null;
  }
  return Object.prototype.hasOwnProperty.call(node.attrs, name)
    ? node.attrs[name]
    : null;
}

function walk(node, visit) {
  const kids = node.children || [];
  for (let i = 0; i < kids.length; i++) {
    const child = kids[i];
    if (child.tag === "#text") {
      continue;
    }
    if (visit(child) !== false) {
      walk(child, visit);
    }
  }
}

function closest(node, test) {
  let cur = node ? node.parent : null;
  while (cur && cur.tag !== "#root") {
    if (test(cur)) {
      return cur;
    }
    cur = cur.parent;
  }
  return null;
}

function hasDescendant(node, test) {
  let found = false;
  walk(node, (child) => {
    if (found) {
      return false;
    }
    if (test(child)) {
      found = true;
      return false;
    }
    return true;
  });
  return found;
}

function textOf(node, exclude) {
  const parts = [];
  const visit = (n) => {
    if (n.tag === "#text") {
      parts.push(n.text);
      return;
    }
    if (exclude && exclude.has(n.tag)) {
      return;
    }
    parts.push(" ");
    const kids = n.children || [];
    for (let i = 0; i < kids.length; i++) {
      visit(kids[i]);
    }
    parts.push(" ");
  };
  visit(node);
  return parts.join("");
}

function squash(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

const WORD_RE = /[\p{L}\p{N}]/u;

function wordList(text) {
  return squash(text)
    .split(" ")
    .filter((w) => WORD_RE.test(w));
}

function countSyllables(word) {
  let w = String(word || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  if (w === "") {
    return 0;
  }
  if (w.length <= 3) {
    return 1;
  }
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = w.match(/[aeiouy]{1,2}/g);
  return groups ? Math.max(groups.length, 1) : 1;
}

function fileName(src) {
  const clean = String(src || "")
    .split("#")[0]
    .split("?")[0];
  const segs = clean.split("/").filter((s) => s !== "");
  return segs.length ? segs[segs.length - 1] : "";
}

function hostOf(url) {
  const value = String(url || "").trim();
  const m = /^(?:[a-z][a-z0-9+.-]*:)?\/\/([^/?#:]+)/i.exec(value);
  return m ? m[1].toLowerCase() : "";
}

function toSeconds(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  let n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    const parsed = Date.parse(String(value));
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.floor(parsed / 1000);
  }
  if (n > 1e12) {
    n = n / 1000;
  }
  return n > 0 ? Math.floor(n) : null;
}

function isoDay(seconds) {
  if (seconds === null || seconds === undefined) {
    return null;
  }
  return new Date(seconds * 1000).toISOString().substring(0, 10);
}

function isTrue(value) {
  return (
    value === true ||
    value === 1 ||
    (typeof value === "string" &&
      ["1", "true", "yes", "on"].indexOf(value.trim().toLowerCase()) !== -1)
  );
}

function isFalse(value) {
  return (
    value === false ||
    value === 0 ||
    (typeof value === "string" &&
      ["0", "false", "no", "off"].indexOf(value.trim().toLowerCase()) !== -1)
  );
}

function median(values) {
  if (!values.length) {
    return 0;
  }
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function pct(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 100) : null;
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function plural(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}

function unavailable(spec, key) {
  const needs =
    spec && spec.unavailable && spec.unavailable[key]
      ? spec.unavailable[key]
      : "Needs a server-side insights provider";
  return { available: false, needs };
}

function getIn(obj, path) {
  let cur = obj;
  for (let i = 0; i < path.length; i++) {
    if (!cur || typeof cur !== "object") {
      return undefined;
    }
    cur = cur[path[i]];
  }
  return cur;
}

function tagSet(list) {
  return new Set((list || []).map((t) => String(t).toLowerCase()));
}

function countTags(tags, list) {
  let n = 0;
  (list || []).forEach((t) => {
    n += tags[t] || 0;
  });
  return n;
}

function num(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

// ------------------------------------------------------- term-specific text

/**
 * Term word and date rules from the spec, in order: words first, then dates.
 * Words scan page titles, and body text too when the rule says `text: true`;
 * dates always scan both.
 */
function termRules(spec) {
  const fr = spec.freshness || {};
  return (fr.termWords || [])
    .map((t) => ({
      re: new RegExp(t.pattern, "i"),
      reason: t.reason,
      kind: "word",
      text: !!t.text,
    }))
    .concat(
      (fr.termDates || []).map((t) => ({
        re: new RegExp(t.pattern, "i"),
        reason: t.reason,
        kind: "date",
        text: true,
      })),
    );
}

/** a short stretch of text around a match, cut at word boundaries */
function snippetAround(text, index, length, chars) {
  const pad = Math.max(0, Math.floor((chars - length) / 2));
  let start = Math.max(0, index - pad);
  let end = Math.min(text.length, index + length + pad);
  if (start > 0) {
    const sp = text.indexOf(" ", start);
    if (sp !== -1 && sp < index) {
      start = sp + 1;
    }
  }
  if (end < text.length) {
    const sp = text.lastIndexOf(" ", end);
    if (sp > index + length) {
      end = sp;
    }
  }
  return `${start > 0 ? "…" : ""}${text.substring(start, end)}${end < text.length ? "…" : ""}`;
}

/**
 * First match of each rule in one string, up to `limit` matches.
 * @returns {Array<{where, reason, kind, match, snippet}>}
 */
function termMatches(value, rules, where, limit, chars) {
  const text = squash(value);
  const out = [];
  if (text === "") {
    return out;
  }
  for (let i = 0; i < rules.length && out.length < limit; i++) {
    const m = rules[i].re.exec(text);
    if (m) {
      out.push({
        where,
        reason: rules[i].reason,
        kind: rules[i].kind,
        match: m[0],
        snippet:
          where === "title"
            ? text
            : snippetAround(text, m.index, m[0].length, chars),
      });
    }
  }
  return out;
}

// ------------------------------------------------------------ alt status

/**
 * Pattern-based, non-judgmental alt text status, used for every row of the
 * alt review table and for live status while a person types a new alt.
 * @param {string|null} alt alt text, or null when the attribute is missing
 * @param {{inLink?: boolean, file?: string}} ctx
 * @param {Object} spec insights spec
 * @returns {{status: "fix"|"check"|"ok", reason: string, text: string}}
 */
export function altStatus(alt, ctx, spec) {
  const rules = spec.accessibility.alt;
  const inLink = !!(ctx && ctx.inLink);
  const file = ctx && ctx.file ? String(ctx.file).toLowerCase() : "";
  if (alt === null || alt === undefined) {
    return inLink
      ? {
          status: "fix",
          reason: "noAltInLink",
          text: "No alt attribute on a linked image: the link has no name",
        }
      : { status: "fix", reason: "noAlt", text: "No alt attribute" };
  }
  const a = String(alt).trim();
  const low = a.toLowerCase();
  if (a === "") {
    return inLink
      ? {
          status: "fix",
          reason: "emptyAltInLink",
          text: "Linked image with empty alt: the link has no name",
        }
      : {
          status: "check",
          reason: "emptyAlt",
          text: "Empty alt: correct only if decorative",
        };
  }
  const extRe = new RegExp(`\\.(${rules.fileExtensions.join("|")})$`);
  if ((file !== "" && low === file) || extRe.test(low)) {
    return { status: "fix", reason: "fileName", text: "Alt is a file name" };
  }
  if (rules.placeholderWords.indexOf(low) !== -1) {
    return {
      status: "fix",
      reason: "placeholder",
      text: "Alt is a placeholder word",
    };
  }
  const mentionRe = new RegExp(`\\b(${rules.mentionWords.join("|")})\\b`);
  if (mentionRe.test(low)) {
    return {
      status: "check",
      reason: "mentionsImage",
      text: "Says “image”; screen readers already announce it",
    };
  }
  if (a.length < rules.minLength) {
    return { status: "check", reason: "tooShort", text: "Very short" };
  }
  if (a.length > rules.maxLength) {
    return {
      status: "check",
      reason: "tooLong",
      text: `Over ${rules.maxLength} characters; move detail to a caption`,
    };
  }
  return { status: "ok", reason: "none", text: "No pattern matched" };
}

// --------------------------------------------------------------- contrast

function hexToRgb(hex) {
  let h = String(hex || "")
    .trim()
    .replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-f]{6}$/i.test(h)) {
    return null;
  }
  return [0, 2, 4].map((i) => parseInt(h.substring(i, i + 2), 16));
}

function luminance(rgb) {
  const c = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/**
 * WCAG contrast ratio of two hex colours, rounded to one decimal, or null.
 */
export function contrastRatio(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) {
    return null;
  }
  const la = luminance(a);
  const lb = luminance(b);
  const ratio = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  return round1(ratio);
}

// ---------------------------------------------------------- item helpers

function itemInfo(item) {
  const it = item && typeof item === "object" ? item : {};
  const md = it.metadata && typeof it.metadata === "object" ? it.metadata : {};
  return {
    id: it.id ? String(it.id) : "",
    slug: it.slug ? String(it.slug) : "",
    title: it.title ? String(it.title) : "",
    parent: it.parent ? String(it.parent) : null,
    order: typeof it.order === "number" ? it.order : Number(it.order) || 0,
    location: it.location ? String(it.location) : "",
    description:
      typeof it.description === "string" ? it.description.trim() : "",
    published: !isFalse(md.published),
    hidden: isTrue(md.hideInMenu),
    created: toSeconds(md.created),
    updated: toSeconds(md.updated),
    indexImages: Array.isArray(md.images) ? md.images.length : 0,
    indexVideos: Array.isArray(md.videos) ? md.videos.length : 0,
  };
}

function regionItemIds(manifest) {
  const ids = {};
  const regions = getIn(manifest, ["metadata", "theme", "regions"]);
  if (!regions || typeof regions !== "object") {
    return ids;
  }
  Object.keys(regions).forEach((name) => {
    const value = regions[name];
    const list =
      typeof value === "string"
        ? [value]
        : value && typeof value === "object"
          ? Object.values(value)
          : [];
    list.forEach((id) => {
      if (typeof id === "string" && id !== "") {
        ids[id] = name;
      }
    });
  });
  return ids;
}

/**
 * Top-level URL folder a page belongs to: the first slug segment, the root
 * label for one-segment slugs, the raw-ID label for item-<uuid> slugs.
 */
export function groupKey(slug, spec) {
  const g = spec.grouping;
  const segs = String(slug || "")
    .split("/")
    .filter((s) => s !== "");
  if (segs.length && new RegExp(g.rawIdPattern, "i").test(segs[0])) {
    return g.rawIdLabel;
  }
  if (segs.length <= 1) {
    return g.rootLabel;
  }
  return segs[0];
}

// -------------------------------------------------------------- pageFacts

/**
 * Facts for one page: everything later sections need, nothing that depends
 * on other pages.
 * @param {string} html page body HTML as stored
 * @param {Object} item the page's site.json item
 * @param {Object} spec insights spec
 * @param {{parser?: "auto"|"dom"|"lite"}} [options]
 */
export function pageFacts(html, item, spec, options = {}) {
  const info = itemInfo(item);
  const root = parseHtml(String(html || ""), options.parser || "auto");
  const exclude = tagSet(spec.text.excludeTags);
  const imageTags = {};
  spec.accessibility.imageTags.forEach((t) => {
    imageTags[t.tag] = t.src;
  });
  const videoTags = tagSet(spec.media.videoTags);
  const embedTags = tagSet(spec.media.embedTags);
  const ytHosts = tagSet(spec.media.youtubeHosts);
  const trackKinds = tagSet(spec.media.captionTrackKinds);
  const containers = spec.instructional.objectiveContainers || [];

  const tags = {};
  const headings = [];
  const images = [];
  const iframes = [];
  const videos = [];
  const links = [];
  const objectives = [];
  const tables = { count: 0, withoutHeaders: 0 };
  let paragraphs = 0;

  walk(root, (el) => {
    const tag = el.tag;
    tags[tag] = (tags[tag] || 0) + 1;
    if (tag === "p") {
      // a paragraph has text, or holds something (an equation, an image)
      if (
        squash(textOf(el)) !== "" ||
        el.children.some((n) => n.tag !== "#text" && n.tag !== "br")
      ) {
        paragraphs++;
      }
    } else if (/^h[1-6]$/.test(tag)) {
      headings.push(Number(tag.charAt(1)));
    } else if (tag === "table") {
      tables.count++;
      if (!hasDescendant(el, (n) => n.tag === "th")) {
        tables.withoutHeaders++;
      }
    } else if (tag === "a") {
      const href = attr(el, "href");
      if (href !== null) {
        const aria = squash(attr(el, "aria-label"));
        const text = squash(textOf(el, exclude));
        let imgAlt = "";
        walk(el, (n) => {
          if (
            imgAlt === "" &&
            Object.prototype.hasOwnProperty.call(imageTags, n.tag)
          ) {
            imgAlt = squash(attr(n, "alt"));
          }
          return imgAlt === "";
        });
        const title = squash(attr(el, "title"));
        const labelledBy = squash(attr(el, "aria-labelledby"));
        const name = aria || text || imgAlt || title;
        links.push({
          href: String(href).trim(),
          name,
          hasName: name !== "" || labelledBy !== "",
          viaImage: !aria && !text && imgAlt !== "",
        });
      }
    }
    if (Object.prototype.hasOwnProperty.call(imageTags, tag)) {
      const src = attr(el, imageTags[tag]) || attr(el, "src") || "";
      const caption = squash(attr(el, "caption"));
      const fig = closest(el, (n) => n.tag === "figure");
      const figcap =
        fig &&
        hasDescendant(
          fig,
          (n) => n.tag === "figcaption" && squash(textOf(n)) !== "",
        );
      images.push({
        tag,
        src,
        file: fileName(src),
        alt: attr(el, "alt"),
        inLink: !!closest(el, (n) => n.tag === "a" && attr(n, "href") !== null),
        hasCaption: caption !== "" || !!figcap,
      });
    }
    if (embedTags.has(tag)) {
      const src = attr(el, "src") || attr(el, "data-src") || "";
      iframes.push({
        src,
        host: hostOf(src),
        hasTitle:
          squash(attr(el, "title")) !== "" ||
          squash(attr(el, "aria-label")) !== "",
      });
    }
    if (videoTags.has(tag)) {
      let source = attr(el, "source") || attr(el, "src") || "";
      if (source === "") {
        walk(el, (n) => {
          if (source === "" && n.tag === "source") {
            source = attr(n, "src") || "";
          }
          return source === "";
        });
      }
      let hasTrack = squash(attr(el, "track")) !== "";
      if (!hasTrack) {
        hasTrack = hasDescendant(el, (n) => {
          if (n.tag !== "track") {
            return false;
          }
          const kind = squash(attr(n, "kind")).toLowerCase() || "subtitles";
          return trackKinds.has(kind);
        });
      }
      const host = hostOf(source);
      videos.push({
        tag,
        source,
        host,
        youtube: ytHosts.has(host),
        hasTrack,
      });
    }
    const isContainer = containers.some(
      (c) =>
        c.tag === tag &&
        (!c.attr || squash(attr(el, c.attr)).toLowerCase() === c.value),
    );
    if (isContainer) {
      walk(el, (n) => {
        if (n.tag === "li") {
          const t = squash(textOf(n, exclude));
          if (t !== "") {
            objectives.push(t);
          }
          return false;
        }
        return true;
      });
    }
    return true;
  });

  const text = textOf(root, exclude);
  const words = wordList(text);
  let blocks = 0;
  root.children.forEach((n) => {
    if (n.tag === "#text") {
      if (squash(n.text) !== "") {
        blocks++;
      }
    } else if (["script", "style", "template"].indexOf(n.tag) === -1) {
      blocks++;
    }
  });

  // heading order: the theme renders the page title as the h1, so any h1 in
  // the body is extra and the first heading should be an h2.
  const skips = [];
  let prev = 1;
  headings.forEach((level) => {
    if (level > prev + 1) {
      skips.push(`h${prev} → h${level}`);
    }
    prev = level;
  });

  const sentences = Math.max(
    (squash(text).match(/[.!?]+(?=\s|$)/g) || []).length,
    words.length ? 1 : 0,
  );
  let syllables = 0;
  words.forEach((w) => {
    syllables += countSyllables(w);
  });
  const grade =
    words.length >= spec.content.readability.minWords && sentences > 0
      ? round1(
          0.39 * (words.length / sentences) +
            11.8 * (syllables / words.length) -
            15.59,
        )
      : null;

  const fr = spec.freshness || {};
  const termHits = termMatches(
    text,
    termRules(spec).filter((r) => r.text),
    "text",
    num(fr.termMatchesPerPage, 3),
    num(fr.termSnippetChars, 80),
  );

  delete tags["#root"];
  return Object.assign(info, {
    words: words.length,
    paragraphs,
    blocks,
    textStart: words.slice(0, 40).join(" "),
    headings,
    headingIssues: {
      h1: tags.h1 || 0,
      skips: skips.filter((s, i, a) => a.indexOf(s) === i),
    },
    readability: { sentences, syllables, grade },
    images,
    iframes,
    videos,
    tables,
    links,
    tags,
    objectives,
    termHits,
  });
}

// ------------------------------------------------- llms.txt / robots.txt

/**
 * Parse an llms.txt file (the HAXcms layout: Core resources, Pages,
 * Optional sections of markdown links).
 */
export function parseLlmsTxt(text) {
  const out = { sections: {}, pageLinks: 0, links: [] };
  let section = "";
  String(text || "")
    .split(/\r?\n/)
    .forEach((line) => {
      const h = /^##\s+(.+?)\s*$/.exec(line);
      if (h) {
        section = h[1].toLowerCase();
        out.sections[section] = [];
        return;
      }
      const m = /^\s*-\s*\[([^\]]*)\]\(([^)\s]+)\)/.exec(line);
      if (m) {
        const link = { section, text: m[1], url: m[2] };
        out.links.push(link);
        if (out.sections[section]) {
          out.sections[section].push(link);
        }
      }
    });
  const pages = out.sections.pages || [];
  out.pageLinks = pages.filter((l) => !/site\.json$/i.test(l.url)).length;
  return out;
}

function robotsPatternMatches(pattern, path) {
  if (pattern === "") {
    return false;
  }
  const anchored = pattern.endsWith("$");
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const re = new RegExp(
    "^" +
      body
        .split("*")
        .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
        .join(".*") +
      (anchored ? "$" : ""),
  );
  return re.test(path);
}

/**
 * Rules in robots.txt that apply to every crawler (User-agent: *), and
 * whether they block a given path.
 * @param {string} text robots.txt body
 * @param {string[]} paths paths to test, e.g. ["/sites/chem/pages/x"]
 */
export function parseRobotsTxt(text, paths = []) {
  const groups = [];
  let cur = null;
  let lastWasAgent = false;
  String(text || "")
    .split(/\r?\n/)
    .forEach((raw) => {
      const line = raw.replace(/#.*$/, "").trim();
      const m = /^([a-zA-Z-]+)\s*:\s*(.*)$/.exec(line);
      if (!m) {
        return;
      }
      const key = m[1].toLowerCase();
      const value = m[2].trim();
      if (key === "user-agent") {
        if (!lastWasAgent || !cur) {
          cur = { agents: [], allow: [], disallow: [] };
          groups.push(cur);
        }
        cur.agents.push(value.toLowerCase());
        lastWasAgent = true;
        return;
      }
      lastWasAgent = false;
      if (!cur) {
        return;
      }
      if (key === "disallow") {
        cur.disallow.push(value);
      } else if (key === "allow") {
        cur.allow.push(value);
      }
    });
  const star = groups.filter((g) => g.agents.indexOf("*") !== -1);
  const disallow = [];
  const allow = [];
  star.forEach((g) => {
    g.disallow.forEach((d) => disallow.push(d));
    g.allow.forEach((a) => allow.push(a));
  });
  const blocked = paths.filter((p) => {
    let best = -1;
    let blockedHere = false;
    disallow.forEach((d) => {
      if (robotsPatternMatches(d, p) && d.length > best) {
        best = d.length;
        blockedHere = true;
      }
    });
    allow.forEach((a) => {
      if (robotsPatternMatches(a, p) && a.length >= best) {
        best = a.length;
        blockedHere = false;
      }
    });
    return blockedHere;
  });
  return { disallow, allow, blocked };
}

// ------------------------------------------------------------ link checks

function linkTarget(href, ctx) {
  const value = String(href || "").trim();
  if (value === "" || value === "#") {
    return { kind: "empty" };
  }
  if (value.charAt(0) === "#") {
    return { kind: "anchor" };
  }
  if (/^javascript:/i.test(value)) {
    return { kind: "script" };
  }
  if (/^(mailto|tel|sms):/i.test(value)) {
    return { kind: "contact" };
  }
  let path = null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.indexOf("//") === 0) {
    if (!/^(https?:)?\/\//i.test(value)) {
      return { kind: "other" };
    }
    let url = null;
    try {
      url = new URL(value.indexOf("//") === 0 ? `https:${value}` : value);
    } catch {
      return { kind: "malformed" };
    }
    if (/\s/.test(value)) {
      return { kind: "malformed" };
    }
    const sameSite =
      ctx.siteOrigin !== "" &&
      url.origin === ctx.siteOrigin &&
      url.pathname.indexOf(ctx.basePath) === 0;
    if (!sameSite) {
      return { kind: "outside", url, host: url.hostname.toLowerCase() };
    }
    path = url.pathname;
  } else {
    path = value.split("#")[0].split("?")[0];
  }
  try {
    path = decodeURIComponent(path);
  } catch {
    // keep raw path
  }
  if (ctx.basePath !== "/" && path.indexOf(ctx.basePath) === 0) {
    path = path.substring(ctx.basePath.length);
  }
  // HAXcms pages resolve relative links against <base href>, the site root
  const segs = [];
  path.split("/").forEach((s) => {
    if (s === "" || s === ".") {
      return;
    }
    if (s === "..") {
      segs.pop();
      return;
    }
    segs.push(s);
  });
  if (segs.length && ctx.fileFolders.has(segs[0].toLowerCase())) {
    return { kind: "file" };
  }
  let slug = segs.join("/").replace(/\.(html?|md)$/i, "");
  if (slug === "index") {
    slug = "";
  }
  if (slug === "") {
    return { kind: "internal", resolved: ctx.homeItem, slug };
  }
  const hit =
    ctx.bySlug[slug.toLowerCase()] || ctx.byId[slug] || ctx.byLocation[slug];
  return { kind: "internal", resolved: hit || null, slug };
}

// ------------------------------------------------------------ siteResults

function severityRank(sev) {
  return sev === "error" ? 0 : sev === "warning" ? 1 : 2;
}

/**
 * One results object for the whole scan. See the shape at the top of file.
 * @param {Array} factsList pageFacts() for every scanned page
 * @param {Object} manifest site.json
 * @param {Object} spec insights spec
 * @param {Object} [options]
 * @param {number} [options.now] ms timestamp used for every age (default now)
 * @param {string} [options.siteOrigin] e.g. "https://hax.example.edu"
 * @param {string} [options.basePath] site base path, e.g. "/sites/chem/"
 * @param {{mode: string, rootId?: string}} [options.scope]
 * @param {Object} [options.extras] same-origin fetches from the loader:
 *   { robots: {found, text}, llms: {found, text},
 *     noJs: {found, html, pageId, url} }
 */
export function siteResults(factsList, manifest, spec, options = {}) {
  const facts = Array.isArray(factsList) ? factsList.filter((f) => f) : [];
  const site = manifest && typeof manifest === "object" ? manifest : {};
  const nowMs = typeof options.now === "number" ? options.now : Date.now();
  const now = Math.floor(nowMs / 1000);
  const extras = options.extras || {};
  const basePathRaw = String(
    options.basePath || getIn(site, ["metadata", "site", "basePath"]) || "/",
  );
  const basePath = basePathRaw.endsWith("/") ? basePathRaw : `${basePathRaw}/`;
  const wpm = spec.text.wordsPerMinute;

  const items = Array.isArray(site.items) ? site.items : [];
  const byId = {};
  const bySlug = {};
  const byLocation = {};
  items.forEach((it) => {
    if (!it) {
      return;
    }
    if (it.id) {
      byId[String(it.id)] = it;
    }
    if (it.slug) {
      bySlug[String(it.slug).toLowerCase()] = it;
    }
    if (it.location) {
      byLocation[String(it.location).replace(/\.html?$/i, "")] = it;
    }
  });
  const homeItem =
    bySlug.index ||
    items
      .filter((it) => it && !it.parent)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))[0] ||
    null;
  const regions = regionItemIds(site);

  const groupOf = {};
  const groupOrder = [];
  facts.forEach((f) => {
    const g = groupKey(f.slug, spec);
    groupOf[f.id] = g;
    if (groupOrder.indexOf(g) === -1) {
      groupOrder.push(g);
    }
  });
  const pageLabel = (f) => {
    if (regions[f.id]) {
      return `Theme ${regions[f.id]}, every page`;
    }
    return f.title || f.slug || f.id;
  };
  const factById = {};
  facts.forEach((f) => {
    factById[f.id] = f;
  });
  const listLimit = num(getIn(spec, ["overview", "pageListLimit"]), 50);
  /** [{ id, slug, title }] for the pages a finding or flag is about */
  const pageList = (list) =>
    list
      .filter((f) => f)
      .slice(0, listLimit)
      .map((f) => ({ id: f.id, slug: f.slug, title: pageLabel(f) }));

  const findings = [];
  const addFinding = (f) => {
    if (f.count > 0) {
      findings.push(f);
    }
  };

  // ------------------------------------------------------------ totals
  let words = 0;
  let paragraphs = 0;
  let videos = 0;
  let videoPages = 0;
  let embeds = 0;
  let embedPages = 0;
  let imagesTotal = 0;
  facts.forEach((f) => {
    words += f.words;
    paragraphs += f.paragraphs;
    videos += f.videos.length;
    videoPages += f.videos.length ? 1 : 0;
    embeds += f.iframes.length;
    embedPages += f.iframes.length ? 1 : 0;
    imagesTotal += f.images.length;
  });
  const readMinutes = Math.ceil(words / wpm);
  const tagTotals = {};
  const tagPages = {};
  facts.forEach((f) => {
    Object.keys(f.tags).forEach((t) => {
      tagTotals[t] = (tagTotals[t] || 0) + f.tags[t];
      tagPages[t] = (tagPages[t] || 0) + 1;
    });
  });

  // ------------------------------------------------------- titles (shared)
  const titleGroups = {};
  facts.forEach((f) => {
    const key = squash(f.title).toLowerCase();
    if (key === "") {
      return;
    }
    if (!titleGroups[key]) {
      titleGroups[key] = { title: squash(f.title), pages: [] };
    }
    titleGroups[key].pages.push(f.id);
  });
  const sharedTitles = Object.keys(titleGroups)
    .map((k) => titleGroups[k])
    .filter((g) => g.pages.length > 1)
    .sort(
      (a, b) => b.pages.length - a.pages.length || (a.title < b.title ? -1 : 1),
    )
    .map((g) => ({
      title: g.title,
      count: g.pages.length,
      pageIds: g.pages,
      pageList: pageList(g.pages.map((id) => factById[id])),
    }));
  const genericSet = tagSet(spec.metadata.genericTitles);
  const genericTitles = facts
    .filter((f) => genericSet.has(squash(f.title).toLowerCase()))
    .map((f) => ({ title: f.title, pageId: f.id, slug: f.slug }));
  const untitled = facts.filter((f) => squash(f.title) === "");
  const sharedTitlePages = sharedTitles.reduce((n, g) => n + g.count, 0);

  // ---------------------------------------------------------- headings
  const longPages = facts.filter(
    (f) => f.paragraphs >= spec.content.longPageParagraphs,
  );
  const longNoHeadings = longPages.filter((f) => f.headings.length === 0);
  const headingErrors = [];
  const headingErrorFacts = [];
  let extraH1Pages = 0;
  let skipPages = 0;
  facts.forEach((f) => {
    const chips = [];
    if (f.headingIssues.h1 > 0) {
      chips.push("h1 in body");
      extraH1Pages++;
    }
    if (f.headingIssues.skips.length) {
      skipPages++;
      f.headingIssues.skips.forEach((s) => chips.push(s));
    }
    if (chips.length) {
      headingErrorFacts.push(f);
      headingErrors.push({
        pageId: f.id,
        title: pageLabel(f),
        slug: f.slug,
        chips,
      });
    }
  });

  // ------------------------------------------------------------- links
  const ctx = {
    siteOrigin: String(options.siteOrigin || ""),
    basePath,
    bySlug,
    byId,
    byLocation,
    homeItem,
    fileFolders: tagSet(spec.links.fileFolders),
  };
  const vague = tagSet(spec.links.vagueText);
  const tracking = tagSet(spec.links.trackingParams);
  const linkRows = [];
  const outsideHosts = {};
  let outsideTotal = 0;
  let unnamedLinks = 0;
  let unnamedPages = 0;
  let urlAsText = 0;
  let vagueLinks = 0;
  let brokenInternal = 0;
  let brokenPages = 0;
  const unnamedFacts = [];
  const brokenFacts = [];
  const L = (code, severity, label, href, f, fix) => ({
    code,
    severity,
    label,
    href,
    pageId: f ? f.id : "",
    page: f ? pageLabel(f) : "",
    title: f ? pageLabel(f) : "",
    slug: f ? f.slug : "",
    fix,
  });
  facts.forEach((f) => {
    let pageUnnamed = 0;
    let pageBroken = 0;
    f.links.forEach((link) => {
      const target = linkTarget(link.href, ctx);
      if (!link.hasName) {
        pageUnnamed++;
        unnamedLinks++;
        linkRows.push(
          L(
            "noName",
            "error",
            "No link name",
            link.href,
            f,
            "Link has no text; add text, or alt text on the linked image, naming the link target",
          ),
        );
      } else if (/^(https?:\/\/|www\.)\S+$/i.test(link.name)) {
        urlAsText++;
        linkRows.push(
          L(
            "urlAsText",
            "warning",
            "URL as text",
            link.href,
            f,
            "Link text is the URL itself; use words that name the destination",
          ),
        );
      } else if (vague.has(link.name.toLowerCase().replace(/[.!:…]+$/, ""))) {
        vagueLinks++;
        linkRows.push(
          L(
            "vagueText",
            "warning",
            "Vague link text",
            link.href,
            f,
            `“${link.name}” does not say where the link goes`,
          ),
        );
      }
      if (target.kind === "outside") {
        outsideTotal++;
        outsideHosts[target.host] = (outsideHosts[target.host] || 0) + 1;
        const params = [];
        target.url.searchParams.forEach((v, k) => {
          if (tracking.has(k.toLowerCase())) {
            params.push(k);
          }
        });
        if (params.length) {
          linkRows.push(
            L(
              "tracking",
              "warning",
              "Tracking param",
              link.href,
              f,
              `Drop ${params.map((p) => `?${p}=…`).join(", ")}; it ties visits to whoever shared the link`,
            ),
          );
        }
        if (target.url.protocol === "http:") {
          linkRows.push(
            L(
              "insecure",
              "info",
              "Not https",
              link.href,
              f,
              "Use the https address if the site offers one",
            ),
          );
        }
      } else if (target.kind === "malformed") {
        linkRows.push(
          L(
            "malformed",
            "warning",
            "Malformed URL",
            link.href,
            f,
            "The address cannot be parsed; check for spaces or typos",
          ),
        );
      } else if (target.kind === "script") {
        linkRows.push(
          L(
            "script",
            "warning",
            "Script link",
            link.href,
            f,
            "javascript: links do nothing for keyboard and assistive tech users; use a button",
          ),
        );
      } else if (target.kind === "empty") {
        linkRows.push(
          L(
            "emptyHref",
            "warning",
            "Empty link",
            link.href,
            f,
            "The link goes nowhere; add an address or remove the link",
          ),
        );
      } else if (target.kind === "internal") {
        if (!target.resolved) {
          pageBroken++;
          brokenInternal++;
          linkRows.push(
            L(
              "brokenInternal",
              "error",
              "Page not found",
              link.href,
              f,
              "No page in site.json has this address; relink to the current page",
            ),
          );
        } else {
          const ti = itemInfo(target.resolved);
          if (!ti.published) {
            linkRows.push(
              L(
                "unpublishedTarget",
                "warning",
                "Links to unpublished page",
                link.href,
                f,
                `“${ti.title}” is unpublished, so visitors get a missing page`,
              ),
            );
          }
        }
      }
    });
    if (pageUnnamed) {
      unnamedPages++;
      unnamedFacts.push(f);
    }
    if (pageBroken) {
      brokenPages++;
      brokenFacts.push(f);
    }
  });
  // page-level URL shape checks against site.json
  const rawIdRe = new RegExp(spec.grouping.rawIdPattern, "i");
  const weekTitleRe = new RegExp(spec.links.weekTitlePattern, "i");
  const weekSlugRe = new RegExp(spec.links.weekSlugPattern, "i");
  const homeSlugs = tagSet(spec.links.homeSlugs);
  let rawIdPages = 0;
  let slugMismatch = 0;
  let folderMismatch = 0;
  const rawIdFacts = [];
  const slugMismatchFacts = [];
  facts.forEach((f) => {
    const segs = f.slug.split("/").filter((s) => s !== "");
    const last = segs.length ? segs[segs.length - 1] : "";
    if (segs.some((s) => rawIdRe.test(s))) {
      rawIdPages++;
      rawIdFacts.push(f);
      linkRows.push(
        L(
          "rawId",
          "warning",
          "Raw item ID",
          `/${f.slug}`,
          f,
          "Give the page a readable slug from its title",
        ),
      );
      return;
    }
    if (last !== "" && !homeSlugs.has(last.toLowerCase()) && f.title) {
      const titleWords = slugify(f.title)
        .split("-")
        .filter((w) => w.length >= spec.links.slugTitleMinWordLength);
      const slugWords = last
        .toLowerCase()
        .split(/[-_]+/)
        .filter((w) => w.length >= spec.links.slugTitleMinWordLength);
      const shares = slugWords.some((w) =>
        titleWords.some(
          (t) => t === w || t.indexOf(w) === 0 || w.indexOf(t) === 0,
        ),
      );
      if (titleWords.length && !shares) {
        slugMismatch++;
        slugMismatchFacts.push(f);
        const suggestion = segs
          .slice(0, -1)
          .concat([slugify(f.title)])
          .join("/");
        linkRows.push(
          L(
            "slugTitle",
            "warning",
            "Slug ≠ title",
            `/${f.slug}`,
            f,
            `…/${suggestion.split("/").pop()} + redirect`,
          ),
        );
      }
    }
    const tw = weekTitleRe.exec(f.title);
    const sw = weekSlugRe.exec(f.slug);
    if (tw && sw && tw[1] !== sw[1]) {
      folderMismatch++;
      linkRows.push(
        L(
          "folderWeek",
          "info",
          "Folder ≠ week",
          `/${f.slug}`,
          f,
          `Titled week ${tw[1]} but filed under week-${sw[1]}; align or ignore`,
        ),
      );
    }
  });
  linkRows.sort((a, b) => severityRank(a.severity) - severityRank(b.severity));
  const linkCounts = {
    all: linkRows.length,
    errors: linkRows.filter((r) => r.severity === "error").length,
    warnings: linkRows.filter((r) => r.severity === "warning").length,
    info: linkRows.filter((r) => r.severity === "info").length,
  };
  const textbookTags = spec.instructional.textbookTags;
  const textbookLinks = countTags(tagTotals, textbookTags);
  const textbookPages = facts.filter(
    (f) => countTags(f.tags, textbookTags) > 0,
  ).length;
  const pathauto = getIn(site, ["metadata", "site", "settings", "pathauto"]);
  const embedHostCounts = {};
  facts.forEach((f) =>
    f.iframes.forEach((i) => {
      if (i.host) {
        embedHostCounts[i.host] = (embedHostCounts[i.host] || 0) + 1;
      }
    }),
  );
  const embedHosts = Object.keys(embedHostCounts)
    .map((host) => ({ host, count: embedHostCounts[host] }))
    .sort((a, b) => b.count - a.count || (a.host < b.host ? -1 : 1));
  const leanOnHosts = facts
    .map((f) => {
      const hosts = {};
      f.iframes.forEach((i) => {
        if (i.host) {
          hosts[i.host] = 1;
        }
      });
      f.videos.forEach((v) => {
        if (v.host) {
          hosts[v.host] = 1;
        }
      });
      return {
        pageId: f.id,
        slug: f.slug,
        title: pageLabel(f),
        embeds: f.iframes.length,
        videos: f.videos.length,
        worksheets: countTags(f.tags, spec.instructional.worksheetTags),
        hosts: Object.keys(hosts).sort(),
      };
    })
    .filter((r) => r.embeds + r.videos > 0)
    .sort(
      (a, b) =>
        b.embeds + b.videos - (a.embeds + a.videos) ||
        b.hosts.length - a.hosts.length ||
        b.embeds - a.embeds,
    )
    .slice(0, spec.links.leanOnHostsLimit);

  // ----------------------------------------------------- accessibility
  const altRows = [];
  const altCounts = { all: 0, fix: 0, check: 0, ok: 0 };
  let altNoAttr = 0;
  let altNoAttrInLink = 0;
  let altEmpty = 0;
  const equationRe = new RegExp(spec.accessibility.alt.equationPattern, "i");
  let equationImages = 0;
  facts.forEach((f) => {
    f.images.forEach((img) => {
      const st = altStatus(
        img.alt,
        { inLink: img.inLink, file: img.file },
        spec,
      );
      altCounts.all++;
      altCounts[st.status]++;
      if (img.alt === null) {
        altNoAttr++;
        if (img.inLink) {
          altNoAttrInLink++;
        }
      } else if (squash(img.alt) === "") {
        altEmpty++;
      }
      if (equationRe.test(`${img.file} ${img.alt || ""}`)) {
        equationImages++;
      }
      altRows.push({
        pageId: f.id,
        pageTitle: pageLabel(f),
        title: pageLabel(f),
        slug: f.slug,
        tag: img.tag,
        src: img.src,
        file: img.file,
        alt: img.alt,
        inLink: img.inLink,
        hasCaption: img.hasCaption,
        status: st.status,
        reason: st.reason,
        reasonText: st.text,
      });
    });
  });
  let untitledIframes = 0;
  let untitledIframePages = 0;
  facts.forEach((f) => {
    const n = f.iframes.filter((i) => !i.hasTitle).length;
    untitledIframes += n;
    untitledIframePages += n ? 1 : 0;
  });
  let videosWithoutTrack = 0;
  let youtubeVideos = 0;
  facts.forEach((f) =>
    f.videos.forEach((v) => {
      if (!v.hasTrack) {
        videosWithoutTrack++;
      }
      if (v.youtube) {
        youtubeVideos++;
      }
    }),
  );
  let tablesTotal = 0;
  let tablesNoHeader = 0;
  facts.forEach((f) => {
    tablesTotal += f.tables.count;
    tablesNoHeader += f.tables.withoutHeaders;
  });
  const themeHexRaw =
    getIn(site, ["metadata", "theme", "variables", "hexCode"]) ||
    getIn(site, ["metadata", "theme", "hexCode"]) ||
    "";
  const ddd = spec.accessibility.contrast.dddDefault;
  const themeHex = hexToRgb(themeHexRaw)
    ? String(themeHexRaw).toLowerCase()
    : "";
  const minRatio = spec.accessibility.contrast.minRatio;
  const contrast = [];
  if (themeHex) {
    contrast.push({
      id: "themeWhite",
      fg: "#ffffff",
      bg: themeHex,
      ratio: contrastRatio("#ffffff", themeHex),
    });
    contrast.push({
      id: "themeBlack",
      fg: "#000000",
      bg: themeHex,
      ratio: contrastRatio("#000000", themeHex),
    });
  }
  contrast.push({
    id: "dddWhite",
    fg: "#ffffff",
    bg: ddd.hex,
    ratio: contrastRatio("#ffffff", ddd.hex),
    name: ddd.name,
  });
  contrast.forEach((c) => {
    c.passes = c.ratio !== null && c.ratio >= minRatio;
  });
  const themeContrast = contrast[0];
  const contrastFails = !!themeHex && !themeContrast.passes;
  const lang =
    getIn(site, ["metadata", "site", "settings", "lang"]) ||
    getIn(site, ["metadata", "site", "lang"]) ||
    getIn(site, ["metadata", "lang"]) ||
    "";
  const mathCount = countTags(tagTotals, spec.accessibility.mathTags);
  const headingErrorPages = headingErrors.length;
  const C = (sc, name, state, found, how, params, extra) =>
    Object.assign({ sc, name, state, found, how, params }, extra || {});
  const criteria = [
    C(
      "1.1.1",
      "Non-text content",
      altCounts.fix ? "fails" : altCounts.check ? "check" : "passes",
      altCounts.all
        ? `${plural(altNoAttr, "image has", "images have")} no alt attribute${altNoAttrInLink ? `, ${altNoAttrInLink} of them inside links` : ""}. ${altEmpty} have alt="" and need a decorative-or-not decision.`
        : "No images found.",
      "alt present; empty alt on linked images; review-table patterns",
      {
        noAlt: altNoAttr,
        noAltInLink: altNoAttrInLink,
        emptyAlt: altEmpty,
        fix: altCounts.fix,
        check: altCounts.check,
        total: altCounts.all,
      },
    ),
    C(
      "1.2.2",
      "Captions (prerecorded)",
      videos === 0 ? "passes" : videosWithoutTrack ? "check" : "passes",
      videos
        ? `${plural(videos, "video", "videos")} on ${plural(videoPages, "page", "pages")}, ${videosWithoutTrack} without a caption track in HAX. ${youtubeVideos} on YouTube.`
        : "No videos found.",
      "video-player track attribute or track element",
      {
        videos,
        videoPages,
        withoutTrack: videosWithoutTrack,
        youtube: youtubeVideos,
      },
      { unavailable: unavailable(spec, "youtubeCaptions") },
    ),
    C(
      "1.3.1",
      "Info and relationships",
      extraH1Pages || skipPages || tablesNoHeader ? "fails" : "passes",
      `h1 in the body on ${plural(extraH1Pages, "page", "pages")}; a skipped level on ${skipPages}; ${tablesNoHeader} of ${plural(tablesTotal, "table has", "tables have")} no header cells.`,
      "Heading levels in order; table has th",
      {
        extraH1Pages,
        skipPages,
        tables: tablesTotal,
        tablesWithoutHeaders: tablesNoHeader,
      },
    ),
    C(
      "1.4.3",
      "Contrast (minimum)",
      contrastFails ? "fails" : "passes",
      themeHex
        ? `Theme colour ${themeHex} with white text is ${themeContrast.ratio}:1.`
        : `No theme colour set; DDD default ${ddd.hex} with white text is ${themeContrast.ratio}:1.`,
      "Theme hexCode and DDD tokens against white and black",
      { hex: themeHex || ddd.hex, ratio: themeContrast.ratio },
    ),
    C(
      "2.4.2",
      "Page titled",
      sharedTitles.length || genericTitles.length || untitled.length
        ? "check"
        : "passes",
      sharedTitles.length || genericTitles.length || untitled.length
        ? `${sharedTitlePages} pages share ${plural(sharedTitles.length, "title", "titles")}; ${genericTitles.length} generic; ${untitled.length} untitled.`
        : "Every page has its own title.",
      "Duplicate, generic or empty titles in site.json",
      {
        sharedTitles: sharedTitles.length,
        sharedTitlePages,
        generic: genericTitles.length,
        untitled: untitled.length,
      },
    ),
    C(
      "2.4.4",
      "Link purpose",
      unnamedLinks ? "fails" : urlAsText || vagueLinks ? "check" : "passes",
      `${plural(unnamedLinks, "link has", "links have")} no name; ${urlAsText} use a bare URL as text; ${vagueLinks} use vague text.`,
      "Link has text, aria-label or image alt; text is not a URL or vague phrase",
      { unnamed: unnamedLinks, urlAsText, vague: vagueLinks },
    ),
    C(
      "2.4.6",
      "Headings and labels",
      longNoHeadings.length ? "check" : "passes",
      `${longNoHeadings.length} of ${plural(longPages.length, "page", "pages")} with ${spec.content.longPageParagraphs}+ paragraphs ${longNoHeadings.length === 1 ? "has" : "have"} no headings.`,
      `paragraphs ≥ ${spec.content.longPageParagraphs} and headings = 0`,
      { longPages: longPages.length, withoutHeadings: longNoHeadings.length },
    ),
    C(
      "3.1.1",
      "Language of page",
      lang ? "passes" : "fails",
      lang ? `Site language is ${lang}.` : "No site language set.",
      "site.json metadata.site.settings.lang",
      { lang },
    ),
    C(
      "4.1.2",
      "Name, role, value",
      untitledIframes ? "fails" : "passes",
      `${plural(embeds, "iframe", "iframes")} on ${plural(embedPages, "page", "pages")}; ${untitledIframes} without a title.`,
      "iframe[title] present and not empty",
      { iframes: embeds, pages: embedPages, untitled: untitledIframes },
    ),
    C(
      "Math",
      "Accessible equations",
      equationImages ? "check" : "passes",
      `${mathCount} lrn-math blocks render as math markup; ${plural(equationImages, "image looks", "images look")} like an equation.`,
      "lrn-math count vs images of equations",
      { math: mathCount, equationImages },
    ),
  ];
  const accessibilityErrors =
    altCounts.fix +
    headingErrorPages +
    tablesNoHeader +
    unnamedLinks +
    untitledIframes;

  // ----------------------------------------------------------- content
  const pagesRows = facts.map((f) => ({
    pageId: f.id,
    title: pageLabel(f),
    slug: f.slug,
    section: groupOf[f.id],
    words: f.words,
    paragraphs: f.paragraphs,
    headings: f.headings.length,
    readMinutes: Math.max(1, Math.ceil(f.words / wpm)),
    videos: f.videos.length,
    embeds: f.iframes.length,
    images: f.images.length,
    tables: f.tables.count,
    grade: f.readability.grade,
    thin: false,
  }));
  const isThin = (f) =>
    f.blocks <= spec.content.thinMaxBlocks &&
    f.words < spec.content.thinMaxWords;
  const thin = [];
  const thinFacts = [];
  facts.forEach((f, i) => {
    if (isThin(f) && !regions[f.id]) {
      pagesRows[i].thin = true;
      thinFacts.push(f);
      thin.push({
        pageId: f.id,
        slug: f.slug,
        title: pageLabel(f),
        words: f.words,
        empty: f.words === 0,
        what: f.words === 0 ? "empty" : plural(f.words, "word", "words"),
      });
    }
  });
  const sectionNoHeadings = num(spec.content.sectionNoHeadingsParagraphs, 10);
  const sectionRows = groupOrder.map((g) => {
    const rows = facts.filter((f) => groupOf[f.id] === g);
    const sum = (fn) => rows.reduce((n, f) => n + fn(f), 0);
    const p = sum((f) => f.paragraphs);
    const h = sum((f) => f.headings.length);
    return {
      name: g,
      pages: rows.length,
      words: sum((f) => f.words),
      paragraphs: p,
      headings: h,
      readMinutes: Math.ceil(sum((f) => f.words) / wpm),
      videos: sum((f) => f.videos.length),
      embeds: sum((f) => f.iframes.length),
      images: sum((f) => f.images.length),
      flagged: p > sectionNoHeadings && h === 0,
    };
  });
  const longest = facts
    .slice()
    .sort((a, b) => b.paragraphs - a.paragraphs || b.words - a.words)
    .slice(0, spec.content.longestLimit)
    .filter((f) => f.paragraphs > 0)
    .map((f) => {
      const h = f.headings.length;
      const per = h ? round1(f.paragraphs / h) : f.paragraphs;
      return {
        pageId: f.id,
        slug: f.slug,
        title: pageLabel(f),
        paragraphs: f.paragraphs,
        headings: h,
        words: f.words,
        perHeading: h ? per : null,
        warn: per > spec.content.paragraphsPerHeadingWarn,
      };
    });
  const rtBuckets = spec.content.readTimeBuckets;
  const readTime = rtBuckets.map((b, i) => ({
    label: i === rtBuckets.length - 1 ? `${b}+ min` : `${b} min`,
    min: b,
    count: 0,
  }));
  pagesRows.forEach((r) => {
    let idx = rtBuckets.length - 1;
    for (let i = 0; i < rtBuckets.length; i++) {
      if (r.readMinutes <= rtBuckets[i]) {
        idx = i;
        break;
      }
    }
    readTime[idx].count++;
  });
  const bands = spec.content.readability.bands.map((b) => ({
    label: b.label,
    max: b.max,
    count: 0,
  }));
  const grades = [];
  facts.forEach((f) => {
    const g = f.readability.grade;
    if (g === null) {
      return;
    }
    grades.push(g);
    const band = bands.find((b) => b.max === null || g <= b.max);
    if (band) {
      band.count++;
    }
  });
  const longestPage = longest[0] || null;
  const noHeadingPages = facts.filter((f) => f.headings.length === 0).length;

  // ------------------------------------------------------------- media
  const vppBuckets = spec.media.videosPerPageBuckets;
  const videosPerPage = vppBuckets.map((b, i) => ({
    label: i === vppBuckets.length - 1 ? `${b}+` : String(b),
    min: b,
    count: 0,
  }));
  facts.forEach((f) => {
    const n = f.videos.length;
    let idx = vppBuckets.length - 1;
    for (let i = 0; i < vppBuckets.length - 1; i++) {
      if (n === vppBuckets[i]) {
        idx = i;
        break;
      }
    }
    videosPerPage[idx].count++;
  });
  const noMedia = facts
    .filter((f) => !regions[f.id])
    .filter((f) => !f.videos.length && !f.iframes.length && !f.images.length)
    .map((f) => ({ pageId: f.id, slug: f.slug, title: pageLabel(f) }));
  const imagesByTag = {};
  facts.forEach((f) =>
    f.images.forEach((img) => {
      imagesByTag[img.tag] = (imagesByTag[img.tag] || 0) + 1;
    }),
  );
  let indexVideos = 0;
  let indexImages = 0;
  facts.forEach((f) => {
    indexVideos += f.indexVideos;
    indexImages += f.indexImages;
  });

  // ----------------------------------------------------- instructional
  const practiceRes = spec.instructional.practiceTitlePatterns.map(
    (p) => new RegExp(p, "i"),
  );
  const isPractice = (f) => practiceRes.some((re) => re.test(f.title));
  const nativeTags = spec.instructional.nativeCheckTags;
  const worksheetTags = spec.instructional.worksheetTags;
  const practice = facts.filter(isPractice).map((f) => {
    const native = countTags(f.tags, nativeTags);
    const worksheets = countTags(f.tags, worksheetTags);
    const state = native
      ? "native"
      : worksheets
        ? "worksheet"
        : f.iframes.length
          ? "embed"
          : "none";
    const parts = [];
    if (native) {
      parts.push(plural(native, "native check", "native checks"));
    }
    if (f.iframes.length) {
      parts.push(plural(f.iframes.length, "embed", "embeds"));
    }
    if (f.videos.length) {
      parts.push(plural(f.videos.length, "video", "videos"));
    }
    if (worksheets) {
      parts.push("worksheet");
    }
    if (f.paragraphs) {
      parts.push(`${f.paragraphs} ¶`);
    }
    return {
      pageId: f.id,
      slug: f.slug,
      title: pageLabel(f),
      section: groupOf[f.id],
      embeds: f.iframes.length,
      videos: f.videos.length,
      paragraphs: f.paragraphs,
      worksheets,
      nativeChecks: native,
      state,
      what: parts.join(", ") || "empty",
    };
  });
  const emptyPractice = practice.filter((p) => p.state === "none");
  const practiceIds = {};
  practice.forEach((p) => {
    practiceIds[p.pageId] = true;
  });
  const practicePerSection = groupOrder.map((g) => ({
    name: g,
    count: practice.filter((p) => p.section === g).length,
  }));
  const termRe = new RegExp(spec.instructional.termGroupPattern, "i");
  const weeksWithoutPractice = practicePerSection
    .filter((s) => termRe.test(s.name) && s.count === 0)
    .map((s) => s.name);
  const nativeTotal = countTags(tagTotals, nativeTags);
  const columns = spec.instructional.activityColumns;
  const levelOf = (n) => {
    let level = "0";
    spec.instructional.activityLevels.forEach((l) => {
      if (n >= l.min) {
        level = l.level;
      }
    });
    return level;
  };
  const columnValue = (col, f) => {
    if (col.source === "paragraphs") {
      return f.paragraphs;
    }
    if (col.source === "videos") {
      return f.videos.length;
    }
    if (col.source === "iframes") {
      return f.iframes.length;
    }
    if (col.source === "practicePages") {
      return practiceIds[f.id] ? 1 : 0;
    }
    return countTags(f.tags, spec.instructional[col.source] || []);
  };
  const activityMap = groupOrder.map((g) => {
    const rows = facts.filter((f) => groupOf[f.id] === g);
    return {
      name: g,
      pages: rows.length,
      cells: columns.map((col) => {
        const n = rows.reduce((sum, f) => sum + columnValue(col, f), 0);
        return { id: col.id, count: n, level: levelOf(n) };
      }),
    };
  });
  const leadIns = spec.instructional.objectiveLeadIns
    .slice()
    .sort((a, b) => b.length - a.length);
  const bloomLevels = spec.instructional.bloom;
  const objectiveRows = [];
  const bloomCounts = {};
  bloomLevels.forEach((b) => {
    bloomCounts[b.level] = 0;
  });
  bloomCounts.Unmatched = 0;
  const matchVerb = (word) => {
    const forms = [word];
    [/ies$/, /es$/, /s$/, /ed$/, /d$/, /ing$/].forEach((re, i) => {
      if (re.test(word)) {
        forms.push(word.replace(re, i === 0 ? "y" : ""));
      }
    });
    for (let b = 0; b < bloomLevels.length; b++) {
      for (let f = 0; f < forms.length; f++) {
        if (bloomLevels[b].verbs.indexOf(forms[f]) !== -1) {
          return bloomLevels[b].level;
        }
      }
    }
    return "Unmatched";
  };
  facts.forEach((f) =>
    f.objectives.forEach((text) => {
      let t = text.toLowerCase().replace(/^[^a-z]+/, "");
      leadIns.forEach((lead) => {
        if (t.indexOf(`${lead} `) === 0) {
          t = t.substring(lead.length + 1);
        }
      });
      const verb = (/^[a-z]+/.exec(t) || [""])[0];
      const level = matchVerb(verb);
      bloomCounts[level]++;
      objectiveRows.push({
        pageId: f.id,
        slug: f.slug,
        title: pageLabel(f),
        text,
        verb,
        level,
      });
    }),
  );
  const bloom = bloomLevels
    .map((b) => ({ level: b.level, count: bloomCounts[b.level] }))
    .concat([{ level: "Unmatched", count: bloomCounts.Unmatched }]);
  const lowerOrder =
    (bloomCounts.Remember || 0) + (bloomCounts.Understand || 0);
  const walls = longest.slice(0, spec.instructional.wallsLimit);
  const guideCount = countTags(tagTotals, spec.instructional.guideTags);
  const worksheetCount = countTags(tagTotals, worksheetTags);
  const worksheetPages = facts.filter(
    (f) => countTags(f.tags, worksheetTags) > 0,
  ).length;
  const workingWell = [
    {
      id: "guides",
      count: guideCount,
      title: "Instruction cards",
      detail: `${objectiveRows.length} learning objectives live in objectives cards.`,
    },
    {
      id: "textbook",
      count: textbookLinks,
      title: "Textbook tie-ins",
      detail: `ebook-button on ${plural(textbookPages, "page", "pages")}.`,
    },
    {
      id: "math",
      count: mathCount,
      title: "Equations as lrn-math",
      detail: "Math markup, not images.",
    },
    {
      id: "worksheets",
      count: worksheetCount,
      title: "Downloadable worksheets",
      detail: `worksheet-download on ${plural(worksheetPages, "page", "pages")}.`,
    },
  ].filter((w) => w.count > 0);

  // --------------------------------------------------------- freshness
  const updatedList = facts
    .map((f) => f.updated)
    .filter((t) => t !== null)
    .sort((a, b) => a - b);
  const createdList = facts
    .map((f) => f.created)
    .filter((t) => t !== null)
    .sort((a, b) => a - b);
  const lastEdit = updatedList.length
    ? updatedList[updatedList.length - 1]
    : null;
  const daysSinceLastEdit =
    lastEdit !== null ? Math.max(0, Math.floor((now - lastEdit) / DAY)) : null;
  const recentDays = spec.freshness.editedRecentlyDays;
  const editedRecently = updatedList.filter(
    (t) => now - t <= recentDays * DAY,
  ).length;
  const bulk = spec.freshness.bulkSave;
  const clusters = [];
  updatedList.forEach((t) => {
    const last = clusters[clusters.length - 1];
    if (last && t - last.end <= bulk.windowMinutes * 60) {
      last.end = t;
      last.count++;
    } else {
      clusters.push({ start: t, end: t, count: 1 });
    }
  });
  const bulkSaves = clusters
    .filter((c) => c.count >= bulk.minPages)
    .map((c) => ({
      date: isoDay(c.start),
      start: c.start,
      end: c.end,
      count: c.count,
    }));
  const bulkTotal = bulkSaves.reduce((n, b) => n + b.count, 0);
  const lastBulkEnd = bulkSaves.length
    ? bulkSaves[bulkSaves.length - 1].end
    : null;
  const dayGroups = {};
  updatedList
    .filter((t) => lastBulkEnd === null || t > lastBulkEnd)
    .forEach((t) => {
      const d = isoDay(t);
      dayGroups[d] = (dayGroups[d] || 0) + 1;
    });
  let biggestDay = null;
  Object.keys(dayGroups)
    .sort()
    .forEach((d) => {
      if (!biggestDay || dayGroups[d] > biggestDay.count) {
        biggestDay = { date: d, count: dayGroups[d] };
      }
    });
  const earliestCreated = createdList.length ? createdList[0] : null;
  const earliestDay = isoDay(earliestCreated);
  const earliestCount = createdList.filter(
    (t) => isoDay(t) === earliestDay,
  ).length;
  const siteCreated = toSeconds(getIn(site, ["metadata", "site", "created"]));
  const events = [];
  if (earliestCreated !== null) {
    events.push({
      code: "earliestCreated",
      date: earliestDay,
      at: earliestCreated,
      count: earliestCount,
      title: "Earliest page created date",
      detail: `${earliestCount} of ${plural(facts.length, "page", "pages")} ${earliestCount === 1 ? "carries" : "carry"} this created date.`,
      tone: "",
    });
  }
  if (siteCreated !== null) {
    events.push({
      code: "siteCreated",
      date: isoDay(siteCreated),
      at: siteCreated,
      title: "Site created",
      detail: "site.json metadata.site.created",
      tone: "accent",
    });
  }
  bulkSaves.forEach((b) => {
    events.push({
      code: "bulkSave",
      date: b.date,
      at: b.start,
      count: b.count,
      title: `Bulk save: ${b.count} pages`,
      detail: `${b.count} saves with no gap over ${bulk.windowMinutes} minutes; ${bulk.minPages}+ pages counts as a bulk save.`,
      tone: "warning",
    });
  });
  if (biggestDay && biggestDay.count > 1) {
    events.push({
      code: "largestEditDay",
      date: biggestDay.date,
      at: toSeconds(`${biggestDay.date}T00:00:00Z`),
      count: biggestDay.count,
      title: `${biggestDay.count} pages saved`,
      detail:
        lastBulkEnd !== null
          ? "Largest group of edits after the bulk save."
          : "Largest group of edits on one day.",
      tone: "accent",
    });
  }
  if (lastEdit !== null) {
    events.push({
      code: "lastEdit",
      date: isoDay(lastEdit),
      at: lastEdit,
      title: "Last content edit",
      detail: "Newest metadata.updated in site.json.",
      tone: "accent",
    });
    events.push({
      code: "now",
      date: isoDay(now),
      at: now,
      title: "Now",
      detail: `${plural(daysSinceLastEdit, "day", "days")} since any page was saved.`,
      tone: daysSinceLastEdit > recentDays ? "danger" : "",
    });
  }
  events.sort((a, b) => a.at - b.at);
  const ageYears = spec.freshness.ageBucketsYears;
  const ageBands = spec.freshness.ageBands || {};
  const ageWarningYears = num(ageBands.warningYears, recentDays / 365);
  const ageDangerYears = num(ageBands.dangerYears, ageWarningYears * 3);
  const ageTone = (minYears) =>
    minYears >= ageDangerYears
      ? "danger"
      : minYears >= ageWarningYears
        ? "warning"
        : "";
  const ageBuckets = [
    {
      label: `< ${ageYears[0]} yr`,
      minYears: 0,
      maxYears: ageYears[0],
      tone: ageTone(0),
      count: 0,
    },
  ];
  for (let i = 0; i < ageYears.length - 1; i++) {
    ageBuckets.push({
      label: `${ageYears[i]}–${ageYears[i + 1]} yr`,
      minYears: ageYears[i],
      maxYears: ageYears[i + 1],
      tone: ageTone(ageYears[i]),
      count: 0,
    });
  }
  const lastBucketYears = ageYears[ageYears.length - 1];
  ageBuckets.push({
    label: `${lastBucketYears}+ yr`,
    minYears: lastBucketYears,
    maxYears: null,
    tone: ageTone(lastBucketYears),
    count: 0,
  });
  let neverSaved = 0;
  facts.forEach((f) => {
    if (f.updated === null) {
      neverSaved++;
      return;
    }
    const years = (now - f.updated) / (365 * DAY);
    let idx = ageYears.length;
    for (let i = 0; i < ageYears.length; i++) {
      if (years < ageYears[i]) {
        idx = i;
        break;
      }
    }
    ageBuckets[idx].count++;
  });
  const rules = termRules(spec);
  const termLimit = num(spec.freshness.termMatchesPerPage, 3);
  const termChars = num(spec.freshness.termSnippetChars, 80);
  // title matches first, then matches in the page text (from pageFacts)
  const termHitsOf = {};
  facts.forEach((f) => {
    termHitsOf[f.id] = termMatches(
      f.title,
      rules,
      "title",
      termLimit,
      termChars,
    )
      .concat(f.termHits || [])
      .slice(0, termLimit);
  });
  const termSpecific = [];
  facts.forEach((f) => {
    const hits = termHitsOf[f.id];
    if (hits.length) {
      termSpecific.push({
        pageId: f.id,
        slug: f.slug,
        title: pageLabel(f),
        reason: hits[0].reason,
        where: hits[0].where,
        match: hits[0].match,
        snippet: hits[0].snippet,
        matches: hits,
        updated: f.updated,
      });
    }
  });
  const termInText = termSpecific.filter((t) =>
    t.matches.some((m) => m.where === "text"),
  ).length;
  const freshnessPages = facts.map((f) => {
    const hit = termHitsOf[f.id][0] || null;
    return {
      pageId: f.id,
      title: pageLabel(f),
      slug: f.slug,
      created: isoDay(f.created),
      updated: isoDay(f.updated),
      daysSinceUpdate:
        f.updated !== null ? Math.floor((now - f.updated) / DAY) : null,
      termReason: hit ? hit.reason : "",
      termWhere: hit ? hit.where : "",
      termMatch: hit ? hit.match : "",
    };
  });

  // ---------------------------------------------------------- metadata
  const noDescriptionFacts = facts
    .filter((f) => !regions[f.id])
    .filter((f) => f.description === "" || f.description === "null");
  const noDescription = noDescriptionFacts.map((f) => ({
    pageId: f.id,
    title: pageLabel(f),
    slug: f.slug,
  }));
  const checks = [];
  const K = (code, state, title, detail, params) =>
    checks.push({ code, state, title, detail, params: params || {} });
  const noJs = extras.noJs;
  let readableWithoutJs = null;
  if (noJs && noJs.found) {
    const page = facts.find((f) => f.id === noJs.pageId) || facts[0];
    const sample = page
      ? page.textStart
          .split(" ")
          .slice(0, spec.metadata.noJsMinWords)
          .join(" ")
          .toLowerCase()
      : "";
    const plain = squash(
      String(noJs.html || "")
        .replace(/<(script|style|template)[\s\S]*?<\/\1\s*>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " "),
    ).toLowerCase();
    readableWithoutJs = sample !== "" && plain.indexOf(sample) !== -1;
    if (readableWithoutJs) {
      K(
        "noJs",
        "passes",
        "Lesson text readable without JavaScript",
        "A plain fetch of a page returns its text.",
        { url: noJs.url },
      );
    } else {
      K(
        "noJs",
        "fails",
        "Lesson text needs JavaScript",
        "A plain fetch of a page does not include its text.",
        { url: noJs.url },
      );
    }
  } else {
    K(
      "noJs",
      "notChecked",
      "Readable without JavaScript",
      "The page could not be fetched for this check.",
      {},
    );
  }
  const robots = extras.robots;
  let robotsBlocks = null;
  if (robots && robots.found) {
    const pagesPath = `${basePath}pages/`;
    const parsed = parseRobotsTxt(robots.text, [pagesPath, basePath]);
    robotsBlocks = parsed.blocked;
    if (parsed.blocked.indexOf(basePath) !== -1) {
      K(
        "robots",
        "fails",
        "robots.txt blocks the whole site",
        `Crawlers may not read ${basePath}.`,
        { blocked: parsed.blocked, disallow: parsed.disallow },
      );
    } else if (parsed.blocked.length) {
      K(
        "robots",
        "fails",
        `robots.txt blocks ${pagesPath}`,
        "Raw page HTML is off-limits to crawlers.",
        { blocked: parsed.blocked, disallow: parsed.disallow },
      );
    } else {
      K(
        "robots",
        "passes",
        "robots.txt allows the site",
        "No rule for all crawlers blocks the site or its pages.",
        { disallow: parsed.disallow },
      );
    }
  } else {
    K(
      "robots",
      robots ? "info" : "notChecked",
      "No robots.txt",
      robots ? "Crawlers apply their defaults." : "robots.txt was not fetched.",
      {},
    );
  }
  const llms = extras.llms;
  let aiFiles = null;
  const optionalSpec = spec.metadata.llmsOptional;
  if (llms && llms.found) {
    const parsed = parseLlmsTxt(llms.text);
    const hasSiteJson = parsed.links.some((l) =>
      /(^|\/)site\.json$/i.test(l.url),
    );
    const optionalFound = optionalSpec.filter((o) =>
      parsed.links.some((l) => l.url.endsWith(o.file)),
    );
    aiFiles = {
      found: 1 + (hasSiteJson ? 1 : 0) + optionalFound.length,
      total: 2 + optionalSpec.length,
      optional: optionalSpec.length,
      optionalFound: optionalFound.length,
    };
    const listed = parsed.pageLinks;
    const visible = facts.filter(
      (f) => f.published && !f.hidden && !regions[f.id],
    ).length;
    K(
      "llms",
      listed >= visible ? "passes" : "warning",
      `llms.txt lists ${listed} ${listed === 1 ? "page" : "pages"}`,
      hasSiteJson
        ? "With site.json as a core resource."
        : "site.json is not listed as a core resource.",
      { listed, visible, hasSiteJson },
    );
    K(
      "optionalResources",
      optionalFound.length === optionalSpec.length ? "passes" : "info",
      optionalFound.map((o) => o.label).join(", ") || "No optional resources",
      `${optionalFound.length} of ${optionalSpec.length} optional resources published.`,
      { found: optionalFound.map((o) => o.id) },
    );
  } else {
    aiFiles = {
      found: 0,
      total: 2 + optionalSpec.length,
      optional: optionalSpec.length,
      optionalFound: 0,
    };
    K(
      "llms",
      llms ? "warning" : "notChecked",
      "No llms.txt",
      llms ? "AI tools get no map of the site." : "llms.txt was not fetched.",
      {},
    );
  }
  const licenseKey = String(site.license || "").toLowerCase();
  const licenseInfo = spec.metadata.licenses[licenseKey] || null;
  if (licenseInfo) {
    K(
      "license",
      "passes",
      licenseInfo.family === "Creative Commons"
        ? "Open license declared"
        : "License declared",
      `${licenseInfo.family} ${licenseInfo.short} in site.json.`,
      { license: licenseKey },
    );
  } else {
    K(
      "license",
      "info",
      "No license declared",
      "Set a license so reuse terms are clear.",
      { license: licenseKey },
    );
  }
  K(
    "descriptions",
    noDescription.length ? "warning" : "passes",
    noDescription.length
      ? `${plural(noDescription.length, "page description", "page descriptions")} empty`
      : "Every page has a description",
    "Empty or null description in site.json.",
    { count: noDescription.length },
  );
  K(
    "titles",
    sharedTitles.length || genericTitles.length ? "warning" : "passes",
    sharedTitles.length || genericTitles.length
      ? "Duplicate and generic titles"
      : "Titles are unique",
    `${sharedTitlePages} pages share ${plural(sharedTitles.length, "title", "titles")}; ${plural(genericTitles.length, "page has", "pages have")} a generic title.`,
    {
      sharedTitles: sharedTitles.length,
      sharedTitlePages,
      generic: genericTitles.length,
    },
  );
  const siteDescription = squash(
    site.description || getIn(site, ["metadata", "site", "description"]) || "",
  );
  const siteDescWords = wordList(siteDescription).length;
  if (siteDescWords < spec.metadata.minSiteDescriptionWords) {
    K(
      "siteDescription",
      "info",
      siteDescWords
        ? `Site description is ${plural(siteDescWords, "word", "words")}`
        : "No site description",
      siteDescription
        ? `“${siteDescription}”. Previews and llms.txt use it as the summary.`
        : "Previews and llms.txt use it as the summary.",
      { words: siteDescWords, text: siteDescription },
    );
  }
  const author = getIn(site, ["metadata", "author"]);
  const authorObj = author && typeof author === "object" ? author : {};
  const blankAuthor = spec.metadata.authorFields.filter(
    (k) => squash(authorObj[k]) === "",
  );
  if (blankAuthor.length) {
    K(
      "author",
      "info",
      "Author profile fields blank",
      `${squash(authorObj.name) || squash(site.author) ? "Author name set; " : ""}${blankAuthor.join(", ")} empty.`,
      { blank: blankAuthor },
    );
  }
  const gaId = squash(
    getIn(site, ["metadata", "site", "settings", "gaID"]) || "",
  );
  if (gaId) {
    K(
      "analytics",
      "info",
      "Google Analytics configured",
      "An analytics ID is set. Mention it in the site's privacy notice.",
      { gaID: gaId },
    );
  }
  const metadataPages = facts.map((f) => ({
    pageId: f.id,
    title: f.title,
    slug: f.slug,
    hasDescription: f.description !== "" && f.description !== "null",
    sharedTitle: sharedTitles.some((g) => g.pageIds.indexOf(f.id) !== -1),
    genericTitle: genericSet.has(squash(f.title).toLowerCase()),
    published: f.published,
  }));

  // -------------------------------------------------------- components
  const htmlTagSet = tagSet(spec.components.htmlTags);
  const groupsMap = spec.components.htmlTagGroups || {};
  const haxRows = Object.keys(tagTotals)
    .filter((t) => t.indexOf("-") !== -1)
    .map((t) => ({ tag: t, count: tagTotals[t], pages: tagPages[t] }))
    .sort((a, b) => b.count - a.count || (a.tag < b.tag ? -1 : 1));
  const htmlCounts = {};
  const htmlPages = {};
  Object.keys(tagTotals).forEach((t) => {
    if (!htmlTagSet.has(t)) {
      return;
    }
    const key = groupsMap[t] || t;
    htmlCounts[key] = (htmlCounts[key] || 0) + tagTotals[t];
  });
  facts.forEach((f) => {
    const seen = {};
    Object.keys(f.tags).forEach((t) => {
      if (htmlTagSet.has(t)) {
        seen[groupsMap[t] || t] = 1;
      }
    });
    Object.keys(seen).forEach((k) => {
      htmlPages[k] = (htmlPages[k] || 0) + 1;
    });
  });
  const htmlRows = Object.keys(htmlCounts)
    .map((t) => ({ tag: t, count: htmlCounts[t], pages: htmlPages[t] || 0 }))
    .sort((a, b) => b.count - a.count || (a.tag < b.tag ? -1 : 1));
  const haxTotal = haxRows.reduce((n, r) => n + r.count, 0);
  const htmlTotal = htmlRows.reduce((n, r) => n + r.count, 0);
  const elementsTotal = haxTotal + htmlTotal;
  const placeholderTags = spec.components.placeholderTags;
  const placeholderPages = facts.filter(
    (f) => countTags(f.tags, placeholderTags) > 0,
  );
  const compFlags = [];
  const pagesWith = (list) => facts.filter((f) => countTags(f.tags, list) > 0);
  const embedTagList = spec.media.embedTags || ["iframe"];
  if (embeds) {
    const iframeFacts = facts.filter((f) => f.iframes.length > 0);
    compFlags.push({
      code: "rawIframes",
      state: "review",
      count: embeds,
      pages: embedPages,
      title: `${plural(embeds, "raw iframe", "raw iframes")}`,
      detail: `On ${plural(embedPages, "page", "pages")}. Editors get no HAX fields for title or size; ${untitledIframes} without a title attribute.`,
      tags: embedTagList.slice(),
      pageList: pageList(iframeFacts),
    });
  }
  if (placeholderPages.length) {
    compFlags.push({
      code: "placeholder",
      state: "review",
      count: countTags(tagTotals, placeholderTags),
      pages: placeholderPages.length,
      title: "place-holder published",
      detail: `An empty authoring slot is live on ${placeholderPages.map((f) => pageLabel(f)).join(", ")}.`,
      tags: placeholderTags.slice(),
      pageList: pageList(placeholderPages),
    });
  }
  if (tagTotals.h1) {
    compFlags.push({
      code: "h1",
      state: "review",
      count: tagTotals.h1,
      pages: tagPages.h1,
      title: `${plural(tagTotals.h1, "h1 element", "h1 elements")} in page bodies`,
      detail: "Conflicts with the theme title; see Accessibility.",
      tags: ["h1"],
      pageList: pageList(pagesWith(["h1"])),
    });
  }
  if (tagTotals.div) {
    compFlags.push({
      code: "divs",
      state: "info",
      count: tagTotals.div,
      pages: tagPages.div,
      title: `${plural(tagTotals.div, "div wrapper", "div wrappers")}`,
      detail: "Plain div markup that DDD data attributes cannot style.",
      tags: ["div"],
      pageList: pageList(pagesWith(["div"])),
    });
  }
  const haxShare = pct(haxTotal, elementsTotal);
  const suggestionCtx = {
    videosWithoutNativeChecks: videos > 0 && nativeTotal === 0,
    practiceWithoutPractice: emptyPractice.length > 0,
    wallsOfText: !!(longestPage && longestPage.warn),
  };
  const fill = (tpl) =>
    String(tpl)
      .replace("{videos}", String(videos))
      .replace("{emptyPractice}", String(emptyPractice.length))
      .replace("{longestTitle}", longestPage ? longestPage.title : "");
  const suggestions = spec.components.suggestions
    .filter((s) => suggestionCtx[s.when] && !tagTotals[s.tag])
    .map((s) => ({ tag: s.tag, when: s.when, why: fill(s.why) }));

  // ----------------------------------------------------------- findings
  const F = (
    code,
    severity,
    section,
    count,
    pagesN,
    title,
    detail,
    list,
    params,
  ) =>
    addFinding({
      code,
      severity,
      section,
      count,
      pages: pagesN,
      title,
      detail,
      params: params || {},
      pageList: pageList(list || []),
    });
  const untitledIframeFacts = facts.filter((f) =>
    f.iframes.some((i) => !i.hasTitle),
  );
  const tableFacts = facts.filter((f) => f.tables.withoutHeaders > 0);
  const untrackedFacts = facts.filter((f) => f.videos.some((v) => !v.hasTrack));
  const altReviewIds = new Set(
    altRows.filter((r) => r.status !== "ok").map((r) => r.pageId),
  );
  const altReviewFacts = facts.filter((f) => altReviewIds.has(f.id));
  const sharedTitleFacts = facts.filter((f) =>
    sharedTitles.some((g) => g.pageIds.indexOf(f.id) !== -1),
  );
  const emptyPracticeFacts = emptyPractice.map((p) => factById[p.pageId]);
  F(
    "untitledIframes",
    "error",
    "accessibility",
    untitledIframes,
    untitledIframePages,
    `${plural(untitledIframes, "iframe has", "iframes have")} no title`,
    plural(untitledIframePages, "page", "pages"),
    untitledIframeFacts,
  );
  F(
    "unnamedLinks",
    "error",
    "links",
    unnamedLinks,
    unnamedPages,
    `${plural(unnamedLinks, "link has", "links have")} no name`,
    `${altNoAttrInLink} linked ${altNoAttrInLink === 1 ? "image" : "images"} without alt · ${plural(unnamedPages, "page", "pages")}`,
    unnamedFacts,
  );
  F(
    "headingErrors",
    "error",
    "accessibility",
    headingErrorPages,
    headingErrorPages,
    "Heading order errors",
    `${plural(headingErrorPages, "page", "pages")}: ${extraH1Pages} with an extra h1, ${skipPages} with skipped levels`,
    headingErrorFacts,
  );
  F(
    "tablesWithoutHeaders",
    "error",
    "accessibility",
    tablesNoHeader,
    tableFacts.length,
    `${plural(tablesNoHeader, "table has", "tables have")} no header cells`,
    `${tablesNoHeader} of ${plural(tablesTotal, "table", "tables")} · ${plural(tableFacts.length, "page", "pages")}`,
    tableFacts,
  );
  F(
    "brokenInternal",
    "error",
    "links",
    brokenInternal,
    brokenPages,
    `${plural(brokenInternal, "page link goes", "page links go")} nowhere`,
    plural(brokenPages, "page", "pages"),
    brokenFacts,
  );
  // site-wide findings refer to the site, not to pages: no pageList
  if (readableWithoutJs === false) {
    F(
      "needsJs",
      "error",
      "metadata",
      1,
      facts.length,
      "Lesson text needs JavaScript to read",
      robotsBlocks && robotsBlocks.length
        ? `robots.txt also blocks ${robotsBlocks.join(", ")}`
        : "A plain fetch returns no page text",
    );
  }
  if (contrastFails) {
    F(
      "themeContrast",
      "error",
      "accessibility",
      1,
      facts.length,
      `Theme colour ${themeHex} fails contrast with white text`,
      `${themeContrast.ratio}:1, needs ${minRatio}:1`,
    );
  }
  if (!lang) {
    F(
      "noLang",
      "error",
      "accessibility",
      1,
      facts.length,
      "No site language set",
      "Screen readers guess the language",
    );
  }
  F(
    "emptyPractice",
    "warning",
    "instructional",
    emptyPractice.length,
    emptyPractice.length,
    `${emptyPractice.length} “Try it” ${emptyPractice.length === 1 ? "page has" : "pages have"} no embed or worksheet`,
    emptyPractice
      .slice(0, 2)
      .map((p) => p.title)
      .join(", ") +
      (emptyPractice.length > 2 ? `, ${emptyPractice.length - 2} more` : ""),
    emptyPracticeFacts,
  );
  F(
    "imagesToReview",
    "warning",
    "accessibility",
    altCounts.fix + altCounts.check,
    altReviewFacts.length,
    `${altCounts.fix + altCounts.check} of ${plural(altCounts.all, "image", "images")} ${altCounts.fix + altCounts.check === 1 ? "needs" : "need"} an alt review`,
    `${altNoAttr} have no alt, ${altEmpty} have alt=""`,
    altReviewFacts,
  );
  F(
    "longNoHeadings",
    "warning",
    "content",
    longNoHeadings.length,
    longNoHeadings.length,
    `${plural(longNoHeadings.length, "long page has", "long pages have")} no headings`,
    `${spec.content.longPageParagraphs}+ paragraphs and no h2–h6`,
    longNoHeadings,
  );
  F(
    "noDescription",
    "warning",
    "metadata",
    noDescription.length,
    noDescription.length,
    `${plural(noDescription.length, "page has", "pages have")} no description`,
    "Used by search, previews and llms.txt",
    noDescriptionFacts,
  );
  // about URL folders, not pages: no pageList
  F(
    "weeksWithoutPractice",
    "warning",
    "instructional",
    weeksWithoutPractice.length,
    weeksWithoutPractice.length,
    `${plural(weeksWithoutPractice.length, "week has", "weeks have")} no practice page`,
    weeksWithoutPractice.join(", "),
  );
  F(
    "rawIds",
    "warning",
    "links",
    rawIdPages,
    rawIdPages,
    `${plural(rawIdPages, "page uses", "pages use")} a raw item ID as its URL`,
    "Readable slugs help people and search",
    rawIdFacts,
  );
  F(
    "slugTitle",
    "warning",
    "links",
    slugMismatch,
    slugMismatch,
    `${plural(slugMismatch, "URL does", "URLs do")} not match the page title`,
    "Rename with a redirect",
    slugMismatchFacts,
  );
  F(
    "sharedTitles",
    "info",
    "metadata",
    sharedTitles.length,
    sharedTitlePages,
    sharedTitles.length
      ? `${sharedTitles[0].count} pages are all titled “${sharedTitles[0].title}”`
      : "",
    sharedTitles.length > 1
      ? `plus ${plural(sharedTitles.length - 1, "other repeated title", "other repeated titles")}`
      : "",
    sharedTitleFacts,
  );
  F(
    "thinPages",
    "info",
    "content",
    thin.length,
    thin.length,
    `${plural(thin.length, "page is", "pages are")} thin or empty`,
    `${plural(spec.content.thinMaxBlocks, "block", "blocks")} or fewer and under ${spec.content.thinMaxWords} words`,
    thinFacts,
  );
  F(
    "videosWithoutTrack",
    "info",
    "accessibility",
    videosWithoutTrack,
    untrackedFacts.length,
    `${plural(videosWithoutTrack, "video has", "videos have")} no caption track in HAX`,
    `${youtubeVideos} on YouTube; caption status there needs a server lookup`,
    untrackedFacts,
  );
  findings.sort(
    (a, b) =>
      severityRank(a.severity) - severityRank(b.severity) ||
      b.pages - a.pages ||
      b.count - a.count,
  );
  const fixNext = findings.slice(0, spec.overview.fixNextLimit);

  // -------------------------------------------------------- site health
  const regionCount = facts.filter((f) => regions[f.id]).length;
  const healthChecks = [
    {
      id: "headingsOnLongPages",
      label: "Headings on long pages",
      passed: longPages.length - longNoHeadings.length,
      total: longPages.length,
      how: `pages with ${spec.content.longPageParagraphs}+ paragraphs`,
      howOne: `page with ${spec.content.longPageParagraphs}+ paragraphs`,
    },
    {
      id: "usableAlt",
      label: "Images with usable alt",
      passed: altCounts.ok,
      total: altCounts.all,
      how: "pass every pattern check",
      howOne: "passes every pattern check",
    },
    {
      id: "titledEmbeds",
      label: "Embeds with a title",
      passed: embeds - untitledIframes,
      total: embeds,
      how: "iframes",
      howOne: "iframe",
    },
    {
      id: "descriptions",
      label: "Page descriptions",
      passed: facts.length - regionCount - noDescription.length,
      total: facts.length - regionCount,
      how: "pages",
      howOne: "page",
    },
    {
      id: "practiceWithPractice",
      label: "Practice pages with practice",
      passed: practice.length - emptyPractice.length,
      total: practice.length,
      how: "“Try it” pages",
      howOne: "“Try it” page",
    },
  ].map((c) => Object.assign(c, { score: pct(c.passed, c.total) }));
  const scored = healthChecks.filter((c) => c.score !== null);
  const healthScore = scored.length
    ? Math.round(scored.reduce((n, c) => n + c.score, 0) / scored.length)
    : null;

  // ------------------------------------------------------------ folders
  const folderCounts = {};
  facts.forEach((f) => {
    const g = groupOf[f.id];
    folderCounts[g] = (folderCounts[g] || 0) + 1;
  });
  const folders = Object.keys(folderCounts)
    .map((name) => ({
      name,
      pages: folderCounts[name],
      flagged:
        name === spec.grouping.rootLabel || name === spec.grouping.rawIdLabel,
    }))
    .sort((a, b) => b.pages - a.pages || (a.name < b.name ? -1 : 1));

  const practicePages = practice.length;
  const unavailableAll = {};
  Object.keys(spec.unavailable).forEach((k) => {
    unavailableAll[k] = unavailable(spec, k);
  });

  const scoreBands = getIn(spec, ["overview", "scoreBands"]) || {};
  const thresholds = {
    wordsPerMinute: wpm,
    longPageParagraphs: spec.content.longPageParagraphs,
    paragraphsPerHeadingWarn: spec.content.paragraphsPerHeadingWarn,
    thinMaxBlocks: spec.content.thinMaxBlocks,
    thinMaxWords: spec.content.thinMaxWords,
    sectionNoHeadingsParagraphs: sectionNoHeadings,
    noHeadingsWarnPct: num(spec.content.noHeadingsWarnPct, 50),
    readabilityMinWords: spec.content.readability.minWords,
    altMinLength: spec.accessibility.alt.minLength,
    altMaxLength: spec.accessibility.alt.maxLength,
    contrastMinRatio: minRatio,
    editedRecentlyDays: recentDays,
    ageBucketsYears: ageYears.slice(),
    ageWarningYears,
    ageDangerYears,
    bulkSaveMinPages: bulk.minPages,
    bulkSaveWindowMinutes: bulk.windowMinutes,
    wallsLimit: spec.instructional.wallsLimit,
    longestLimit: spec.content.longestLimit,
    scoreDanger: num(scoreBands.danger, 50),
    scoreWarning: num(scoreBands.warning, 70),
    pageListLimit: listLimit,
  };
  // rail badges: null when there is nothing worth flagging
  const badge = (n) => (n ? n : null);
  const oldestUpdate = updatedList.length ? updatedList[0] : null;
  const oldestYears =
    oldestUpdate !== null ? (now - oldestUpdate) / (365 * DAY) : null;
  const freshnessFlag = oldestYears !== null && oldestYears > ageWarningYears;

  const results = {
    version: 1,
    specVersion: spec.version,
    generatedAt: new Date(nowMs).toISOString(),
    now: nowMs,
    scope: {
      mode: options.scope && options.scope.mode ? options.scope.mode : "site",
      rootId:
        options.scope && options.scope.rootId ? options.scope.rootId : null,
      pages: facts.length,
    },
    totals: {
      pages: facts.length,
      words,
      paragraphs,
      readMinutes,
      videos,
      videoPages,
      embeds,
      embedPages,
      images: imagesTotal,
      accessibilityErrors,
    },
    thresholds,
    nav: {
      overview: { badge: null, tone: "" },
      content: {
        badge: badge(longNoHeadings.length + thin.length),
        tone: "warning",
      },
      links: {
        badge: badge(linkCounts.errors + linkCounts.warnings),
        tone: linkCounts.errors ? "danger" : "warning",
      },
      accessibility: { badge: badge(accessibilityErrors), tone: "danger" },
      media: { badge: null, tone: "" },
      instructional: {
        badge: badge(emptyPractice.length + weeksWithoutPractice.length),
        tone: "accent",
      },
      freshness: {
        badge: freshnessFlag ? `${round1(oldestYears)} yr` : null,
        tone: daysSinceLastEdit > recentDays ? "warning" : "",
      },
      metadata: { badge: badge(noDescription.length), tone: "warning" },
      components: { badge: badge(compFlags.length), tone: "" },
    },
    overview: {
      stats: {
        pages: facts.length,
        paragraphs,
        words,
        readMinutes,
        videos,
        videoPages,
        practicePages,
        accessibilityErrors,
        untitledIframes,
        daysSinceLastEdit,
        lastEdit: isoDay(lastEdit),
      },
      fixNext,
      findings,
      health: {
        score: healthScore,
        checks: healthChecks,
        outsideLinks: unavailable(spec, "outsideLinkStatus"),
      },
      folders,
      brokenOutsideLinks: unavailable(spec, "outsideLinkStatus"),
      schedule: unavailable(spec, "schedules"),
      savedHistory: unavailable(spec, "savedHistory"),
      cli: unavailable(spec, "cli"),
    },
    accessibility: {
      kpis: {
        imagesToReview: altCounts.fix + altCounts.check,
        imagesTotal: altCounts.all,
        fix: altCounts.fix,
        check: altCounts.check,
        ok: altCounts.ok,
        untitledIframes,
        untitledIframePages,
        videosWithoutTrack,
        youtubeVideos,
        headingErrorPages,
        extraH1Pages,
        skipPages,
        themeContrast: {
          hex: themeContrast.bg,
          ratio: themeContrast.ratio,
          passes: themeContrast.passes,
        },
      },
      altRows,
      altCounts,
      criteria,
      headingErrors,
      contrast,
      errors: accessibilityErrors,
      youtubeCaptions: unavailable(spec, "youtubeCaptions"),
      bulkAltSave: unavailable(spec, "bulkAltSave"),
    },
    content: {
      kpis: {
        pages: facts.length,
        words,
        paragraphsPerPage: facts.length ? round1(paragraphs / facts.length) : 0,
        paragraphsMedian: median(facts.map((f) => f.paragraphs)),
        noHeadings: noHeadingPages,
        noHeadingsPct: pct(noHeadingPages, facts.length),
        thinPages: thin.length,
        longest: longestPage,
        longNoHeadings: longNoHeadings.length,
      },
      sections: sectionRows,
      longest,
      readTime,
      thin,
      readability: {
        bands,
        median: grades.length ? round1(median(grades)) : null,
        scored: grades.length,
      },
      pages: pagesRows,
      trends: unavailable(spec, "savedHistory"),
    },
    links: {
      kpis: {
        unnamedLinks,
        unnamedPages,
        rawIdPages,
        textbookLinks,
        textbookPages,
        embeds,
        embedPages,
        pathauto: pathauto === undefined ? null : isTrue(pathauto),
        brokenInternal,
        slugMismatch,
        folderMismatch,
        outsideLinks: outsideTotal,
      },
      findings: linkRows,
      counts: linkCounts,
      leanOnHosts,
      embedHosts,
      outsideLinks: {
        total: outsideTotal,
        hosts: Object.keys(outsideHosts)
          .map((host) => ({ host, count: outsideHosts[host] }))
          .sort((a, b) => b.count - a.count || (a.host < b.host ? -1 : 1)),
      },
      outsideLinkStatus: unavailable(spec, "outsideLinkStatus"),
    },
    media: {
      kpis: {
        videos,
        videoPages,
        embeds,
        embedPages,
        images: imagesTotal,
        imagesByTag,
        tables: tablesTotal,
        tablesWithoutHeaders: tablesNoHeader,
        noMedia: noMedia.length,
      },
      videosPerPage,
      noMedia,
      bySection: sectionRows.map((s) => ({
        name: s.name,
        videos: s.videos,
        embeds: s.embeds,
        images: s.images,
        total: s.videos + s.embeds + s.images,
      })),
      mediaIndex: {
        videos: {
          html: videos,
          index: indexVideos,
          missing: Math.max(0, videos - indexVideos),
        },
        images: {
          html: imagesTotal,
          index: indexImages,
          missing: Math.max(0, imagesTotal - indexImages),
        },
      },
      pages: pagesRows.map((r) => ({
        pageId: r.pageId,
        title: r.title,
        slug: r.slug,
        section: r.section,
        videos: r.videos,
        embeds: r.embeds,
        images: r.images,
        tables: r.tables,
      })),
      videoMinutes: unavailable(spec, "videoDuration"),
      rebuildIndex: unavailable(spec, "mediaIndexRebuild"),
    },
    instructional: {
      kpis: {
        practicePages,
        practicePct: pct(practicePages, facts.length),
        nativeChecks: nativeTotal,
        emptyPractice: emptyPractice.length,
        weeksWithoutPractice: weeksWithoutPractice.length,
        objectives: objectiveRows.length,
        lowerOrderPct: pct(lowerOrder, objectiveRows.length),
      },
      columns: columns.map((c) => ({ id: c.id, label: c.label })),
      activityMap,
      practice,
      practicePerSection,
      weeksWithoutPractice,
      bloom,
      objectives: objectiveRows,
      walls,
      workingWell,
      thresholds: unavailable(spec, "thresholdSettings"),
    },
    freshness: {
      kpis: {
        daysSinceLastEdit,
        lastEdit: isoDay(lastEdit),
        editedRecently,
        bulkSaved: bulkTotal,
        bulkSaveDate: bulkSaves.length
          ? bulkSaves[bulkSaves.length - 1].date
          : null,
        termSpecific: termSpecific.length,
        termInText,
        oldestCreatedYear:
          earliestCreated !== null ? Number(earliestDay.substring(0, 4)) : null,
        oldestCreatedCount: earliestCount,
        neverSaved,
      },
      events,
      ageBuckets,
      termSpecific,
      bulkSaves,
      pages: freshnessPages,
      editHistory: unavailable(spec, "editHistory"),
      reminders: unavailable(spec, "schedules"),
    },
    metadata: {
      kpis: {
        readableWithoutJs,
        aiFiles,
        noDescription: noDescription.length,
        sharedTitlePages,
        sharedTitles: sharedTitles.length,
        license: licenseInfo ? licenseInfo.short : null,
        licenseFamily: licenseInfo ? licenseInfo.family : null,
      },
      checks,
      noDescription,
      sharedTitles,
      genericTitles,
      pages: metadataPages,
    },
    components: {
      kpis: {
        elements: elementsTotal,
        distinctTags: haxRows.length + htmlRows.length,
        distinctHax: haxRows.length,
        distinctHtml: htmlRows.length,
        haxElements: haxTotal,
        haxShare,
        flags: compFlags.length,
        nativeChecks: nativeTotal,
      },
      hax: haxRows,
      html: htmlRows,
      flags: compFlags.concat(
        haxShare !== null
          ? [
              {
                code: "haxShare",
                state: "info",
                count: haxTotal,
                title: `HAX share is ${haxShare}%`,
                detail: `${haxTotal} of ${elementsTotal} counted elements are HAX elements.`,
                tags: [],
                pageList: [],
              },
            ]
          : [],
      ),
      suggestions,
    },
    unavailable: unavailableAll,
  };
  return results;
}

/**
 * Convenience: facts for many pages then one results object.
 * @param {Array<{html: string, item: Object}>} pages
 */
export function analyzeSite(pages, manifest, spec, options = {}) {
  const facts = (pages || []).map((p) =>
    pageFacts(p.html, p.item, spec, { parser: options.parser }),
  );
  return siteResults(facts, manifest, spec, options);
}
