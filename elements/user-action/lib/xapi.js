/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Shared xAPI helpers for HAX learner data.
 *
 * Every HAX element that reports what a learner did fires one event:
 * `user-engagement` (bubbles, composed). Its detail keeps the loose fields
 * elements always sent and adds `statement`, an xAPI 1.0.3 statement (or the
 * parts needed to finish one), so the same data can be kept on the learner's
 * device today and sent to a Learning Record Store (LRS) later without being
 * reshaped. Elements only announce; they never store anything. A listener
 * (the HAXcms progress store) finishes, de-duplicates and keeps statements.
 *
 * Educational record marker: every statement built here carries
 *   context.contextActivities.category = [{ id: XAPI_EDUCATIONAL_RECORD_CATEGORY,
 *     definition: { name: { "en-US": "Educational record" } } }]
 *   context.extensions[XAPI_EXTENSIONS.educationalRecord] = true
 * so any LRS or adapter that receives it can recognise learner data that
 * may be an education record (FERPA style handling: access limited to the
 * learner and the institution, no sale or secondary use, deletable on
 * request). Statements also carry context.platform "HAX", the page as
 * contextActivities.parent and the site / course as contextActivities.grouping.
 *
 * Actor: xAPI requires one. HAX never invents a real identity: by default the
 * progress store registers a pseudonymous device account per site
 * ({ objectType: "Agent", account: { homePage: <site url>, name: <random
 * uuid kept on this device> } }) through setActorProvider(). A signed-in
 * adapter (HAXcms server, LRS) can register a different provider later.
 * Without a provider the statement has no actor and the listener adds one.
 *
 * @typedef {Object} UserEngagementDetail
 * @property {string} activityDisplay verb the element performed: answered,
 *   attempted, completed, experienced, progressed or interacted
 * @property {boolean} [xapi] false when the event is not a learner record
 *   (no statement is built for it)
 * @property {string} [objectName] human name of the activity (quiz name,
 *   checklist title, game name)
 * @property {string} [objectId] author supplied id of the activity, when any
 * @property {string} [objectDetail] the part of the activity involved (an
 *   item label, a concept)
 * @property {boolean} [resultSuccess] whether the learner was right
 * @property {number} [resultScore] score, 0 to 1 unless documented otherwise
 * @property {boolean} [resultCompletion] whether the activity is now done
 * @property {XAPIStatement} [statement] the xAPI statement for this event
 *
 * @typedef {Object} XAPIStatement xAPI 1.0.3 statement
 * @property {string} id uuid
 * @property {Object} [actor] Agent; filled by the progress store when absent
 * @property {{id: string, display: Object}} verb
 * @property {{id: string, objectType: string, definition: Object}} object
 * @property {{success?: boolean, completion?: boolean, response?: string,
 *   score?: {raw: number, min: number, max: number, scaled: number},
 *   duration?: string, extensions?: Object}} [result]
 * @property {Object} context platform, language, contextActivities, extensions
 * @property {string} timestamp ISO 8601
 * @property {string} version "1.0.3"
 */

export const XAPI_VERSION = "1.0.3";

/**
 * ADL verb IRIs used by HAX elements. Each has one meaning:
 *   experienced  saw or opened something; no judgment, no progress
 *   interacted   manipulated something with no right answer
 *   answered     gave a response (judged or not, see result.success)
 *   progressed   finished one step of a multi-part activity
 *   attempted    began an attempt
 *   completed    finished the whole activity
 * Pass and fail are result.success on the answered / completed statement;
 * statements imported from elsewhere may still use other ADL verbs.
 */
export const XAPI_VERBS = {
  answered: "http://adlnet.gov/expapi/verbs/answered",
  attempted: "http://adlnet.gov/expapi/verbs/attempted",
  completed: "http://adlnet.gov/expapi/verbs/completed",
  experienced: "http://adlnet.gov/expapi/verbs/experienced",
  progressed: "http://adlnet.gov/expapi/verbs/progressed",
  interacted: "http://adlnet.gov/expapi/verbs/interacted",
};

/**
 * Activity types used by HAX elements
 */
export const XAPI_ACTIVITY_TYPES = {
  interaction: "http://adlnet.gov/expapi/activities/cmi.interaction",
  lesson: "http://adlnet.gov/expapi/activities/lesson",
  course: "http://adlnet.gov/expapi/activities/course",
  objective: "http://adlnet.gov/expapi/activities/objective",
  media: "http://adlnet.gov/expapi/activities/media",
  simulation: "http://adlnet.gov/expapi/activities/simulation",
  interactionGeneric: "http://adlnet.gov/expapi/activities/interaction",
};

export const XAPI_EDUCATIONAL_RECORD_CATEGORY =
  "https://haxtheweb.org/xapi/category/educational-record";

/**
 * HAX extension IRIs
 */
export const XAPI_EXTENSIONS = {
  educationalRecord: "https://haxtheweb.org/xapi/extensions/educational-record",
  attempts: "https://haxtheweb.org/xapi/extensions/attempts",
  maxAttempts: "https://haxtheweb.org/xapi/extensions/max-attempts",
  element: "https://haxtheweb.org/xapi/extensions/element",
  imported: "https://haxtheweb.org/xapi/extensions/imported",
  // how far through an activity the learner is, a number from 0 to 1 (page
  // reading: the share of the page content scrolled through). Media keep
  // the xAPI video profile IRI (XAPI_VIDEO_PROGRESS), which means "share of
  // the media consumed" and so is not used for anything else.
  progress: "https://haxtheweb.org/xapi/extensions/progress",
};

/**
 * xAPI video profile result extension: share of the media consumed, 0 to 1
 */
export const XAPI_VIDEO_PROGRESS =
  "https://w3id.org/xapi/video/extensions/progress";

/**
 * Result extensions a progress store reads as "how far through, 0 to 1".
 * Both IRIs end in "/progress", so a store can match on that one suffix.
 */
export const XAPI_PROGRESS_EXTENSIONS = [
  XAPI_EXTENSIONS.progress,
  XAPI_VIDEO_PROGRESS,
];

export const XAPI_PLATFORM = "HAX";

/**
 * xAPI 1.0.3 interaction types (cmi.interaction interactionType)
 */
export const XAPI_INTERACTION_TYPES = [
  "true-false",
  "choice",
  "fill-in",
  "long-fill-in",
  "matching",
  "performance",
  "sequencing",
  "likert",
  "numeric",
  "other",
];

/**
 * Interaction component lists an object definition can carry
 */
export const XAPI_COMPONENT_LISTS = [
  "choices",
  "scale",
  "source",
  "target",
  "steps",
];

// response / correctResponsesPattern delimiters (xAPI 1.0.3)
export const XAPI_ITEM_DELIMITER = "[,]";
export const XAPI_PAIR_DELIMITER = "[.]";

// FNV-1a 32 bit, hex. Deterministic and tiny; not a security feature.
export function xapiHash(str) {
  let h = 0x811c9dc5;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

/**
 * Random uuid (v4)
 */
export function xapiUuid() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === "function") {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

/**
 * Language map for display names, in the language of the page
 */
export function xapiLanguage() {
  try {
    const lang =
      globalThis.document &&
      globalThis.document.documentElement &&
      globalThis.document.documentElement.lang;
    return lang || "en-US";
  } catch {
    return "en-US";
  }
}

export function languageMap(text, lang) {
  return { [lang || xapiLanguage()]: String(text == null ? "" : text) };
}

/**
 * URL of the current page without query or fragment
 */
export function pageUrl() {
  try {
    const l = globalThis.location;
    return `${l.origin}${l.pathname}`;
  } catch {
    return "";
  }
}

/**
 * URL of the site: the document base (HAXcms sites set one) without file
 * or query, otherwise the origin.
 */
export function siteUrl() {
  try {
    const base = new URL(
      globalThis.document.baseURI || globalThis.location.href,
    );
    const path = base.pathname.replace(/[^/]*$/, "");
    return `${base.origin}${path}`;
  } catch {
    return pageUrl();
  }
}

/**
 * The `resource` attribute an element had in its markup when it connected
 * (authored, or saved by HAX), or "" when it had none. SchemaBehaviors
 * (@haxtheweb/schema-behaviors) records it as `_xapiAuthoredResource` before
 * its first update, which is when it generates a random `resource` for
 * elements without one; a generated value changes on every page load, so it
 * is never used here. Elements without SchemaBehaviors can set
 * `_xapiAuthoredResource` themselves (read the attribute in
 * connectedCallback before anything can write it).
 * @param {HTMLElement} element
 * @returns {string}
 */
export function authoredResource(element) {
  const r =
    element && typeof element._xapiAuthoredResource === "string"
      ? element._xapiAuthoredResource.trim()
      : "";
  return r && r !== "null" ? r : "";
}

/**
 * The element id when an author set it. Ids an element generated for itself
 * during this page load (marked with `_xapiGeneratedId`) change every visit,
 * so they never key learner data.
 * @param {HTMLElement} element
 * @returns {string}
 */
function authoredId(element) {
  return element && element.id && element.id !== element._xapiGeneratedId
    ? element.id
    : "";
}

/**
 * Stable activity id for an element: page URL + "#" + key. The key is, in
 * order:
 *   1. the element id, when the author set one;
 *   2. the `resource` the element had in its markup (see authoredResource;
 *      never one generated during this page load), without its leading "#";
 *   3. its tag plus a hash of what the author wrote (question, title or the
 *      fingerprint given).
 * 2 and 3 add the element's position among same-key elements ("-1", "-2")
 * when more than one on the page would collide (a block duplicated with its
 * resource, two identical questions).
 * @param {HTMLElement} element
 * @param {string} [fingerprint] author content that identifies it
 * @returns {string}
 */
export function activityKey(element, fingerprint) {
  if (!element) {
    return "";
  }
  if (authoredId(element)) {
    return String(element.id);
  }
  const resource = authoredResource(element);
  if (resource) {
    const base = resource.replace(/^#/, "");
    return withPosition(
      element,
      base,
      (peer) => !authoredId(peer) && authoredResource(peer) === resource,
      "[resource]",
    );
  }
  const base = baseKey(
    element,
    fingerprint != null ? fingerprint : fingerprintOf(element),
  );
  return withPosition(
    element,
    base,
    (peer) =>
      !authoredId(peer) &&
      !authoredResource(peer) &&
      baseKey(peer, fingerprintOf(peer)) === base,
  );
}

/**
 * The key activityKey gave before authored resources were used (element id,
 * else tag + fingerprint hash + position among same-fingerprint elements).
 * Lets a progress store find, once, what it saved under that key.
 * @param {HTMLElement} element
 * @param {string} [fingerprint]
 * @returns {string}
 */
export function legacyActivityKey(element, fingerprint) {
  if (!element) {
    return "";
  }
  if (element.id) {
    return String(element.id);
  }
  const base = baseKey(
    element,
    fingerprint != null ? fingerprint : fingerprintOf(element),
  );
  return withPosition(
    element,
    base,
    (peer) => !authoredId(peer) && baseKey(peer, fingerprintOf(peer)) === base,
  );
}

export function legacyActivityId(element, fingerprint) {
  const key = legacyActivityKey(element, fingerprint);
  return `${pageUrl()}#${encodeURIComponent(key)}`;
}

// base, or base-n when element is the n-th (0 based) of the peers on its
// page that share the base; selector defaults to the element's tag
function withPosition(element, base, isPeer, selector) {
  let n = 0;
  try {
    const root = element.getRootNode();
    const peers = Array.from(
      root.querySelectorAll(selector || element.tagName.toLowerCase()),
    ).filter((peer) => peer === element || isPeer(peer));
    n = peers.indexOf(element);
  } catch {
    n = 0;
  }
  return n > 0 ? `${base}-${n}` : base;
}

// tag plus a hash of the author content, before telling twins apart
function baseKey(element, text) {
  const tag = (element.tagName || "activity").toLowerCase();
  return `${tag}-${xapiHash(`${tag}\u0001${text || ""}`)}`;
}

// the fingerprint an element of the same tag would use for itself
function fingerprintOf(el) {
  if (el && typeof el.xapiFingerprint === "function") {
    return el.xapiFingerprint();
  }
  if (!el) {
    return "";
  }
  return (
    el.question ||
    el.title ||
    (typeof el.getAttribute === "function" ? el.getAttribute("title") : "") ||
    ""
  );
}

export function activityId(element, fingerprint) {
  const key = activityKey(element, fingerprint);
  return `${pageUrl()}#${encodeURIComponent(key)}`;
}

// actor registered by the progress store or a signed-in adapter
let _actorProvider = null;

/**
 * Register the function that returns the xAPI actor for new statements.
 * Pass null to remove it.
 */
export function setActorProvider(fn) {
  _actorProvider = typeof fn === "function" ? fn : null;
}

export function currentActor() {
  try {
    return _actorProvider ? _actorProvider() : null;
  } catch {
    return null;
  }
}

/**
 * Pseudonymous device account: never a name or email.
 */
export function deviceActor(name, homePage) {
  return {
    objectType: "Agent",
    account: {
      homePage: homePage || siteUrl(),
      name: String(name || xapiUuid()),
    },
  };
}

/**
 * The educational record context every HAX statement carries.
 */
export function educationalRecordContext(options = {}) {
  const lang = options.language || xapiLanguage();
  const page = options.pageId || pageUrl();
  const site = options.siteId || siteUrl();
  const parent = {
    id: page,
    objectType: "Activity",
    definition: { type: XAPI_ACTIVITY_TYPES.lesson },
  };
  if (options.pageName) {
    parent.definition.name = languageMap(options.pageName, lang);
  }
  const grouping = {
    id: site,
    objectType: "Activity",
    definition: { type: XAPI_ACTIVITY_TYPES.course },
  };
  if (options.siteName) {
    grouping.definition.name = languageMap(options.siteName, lang);
  }
  return {
    platform: XAPI_PLATFORM,
    language: lang,
    contextActivities: {
      parent: [parent],
      grouping: [grouping],
      category: [
        {
          id: XAPI_EDUCATIONAL_RECORD_CATEGORY,
          objectType: "Activity",
          definition: { name: { "en-US": "Educational record" } },
        },
      ],
    },
    extensions: {
      [XAPI_EXTENSIONS.educationalRecord]: true,
    },
  };
}

function cleanScore(score) {
  if (!score || typeof score !== "object") {
    return undefined;
  }
  const out = {};
  const raw = Number(score.raw);
  const max = score.max != null ? Number(score.max) : undefined;
  const min = score.min != null ? Number(score.min) : 0;
  if (!Number.isNaN(raw)) {
    out.raw = raw;
  }
  out.min = min;
  if (max != null && !Number.isNaN(max)) {
    out.max = max;
  }
  let scaled = score.scaled != null ? Number(score.scaled) : undefined;
  if (scaled == null && out.raw != null && out.max != null && out.max > min) {
    scaled = (out.raw - min) / (out.max - min);
  }
  if (scaled != null && !Number.isNaN(scaled)) {
    out.scaled = Math.max(-1, Math.min(1, Math.round(scaled * 10000) / 10000));
  }
  return out;
}

/**
 * Build an xAPI 1.0.3 statement.
 * @param {Object} parts
 * @param {string} parts.verb key of XAPI_VERBS or a full verb IRI
 * @param {Object} parts.object { id, name, description, type,
 *   interactionType, correctResponsesPattern, choices, scale, source, target,
 *   steps, extensions }; component lists are [{ id, description }] with the
 *   description as text (put in a language map here) or a language map
 * @param {Object} [parts.result] { success, completion, response, score:
 *   {raw, max, min, scaled}, duration, extensions }
 * @param {Object} [parts.context] { pageId, pageName, siteId, siteName,
 *   language, extensions } merged into the educational record context
 * @param {Object} [parts.actor] defaults to the registered actor provider
 * @returns {XAPIStatement}
 */
export function buildStatement({
  verb,
  object,
  result,
  context,
  actor,
  id,
  timestamp,
} = {}) {
  const verbKey = Object.keys(XAPI_VERBS).find(
    (k) => k === verb || XAPI_VERBS[k] === verb,
  );
  const verbId = verbKey ? XAPI_VERBS[verbKey] : String(verb || "");
  const verbName = verbKey || verbId.split("/").pop();
  const ctx = context || {};
  const lang = ctx.language || xapiLanguage();
  const obj = object || {};
  const definition = {};
  if (obj.name) {
    definition.name = languageMap(obj.name, lang);
  }
  if (obj.description) {
    definition.description = languageMap(obj.description, lang);
  }
  if (obj.type) {
    definition.type = obj.type;
  }
  if (obj.interactionType) {
    definition.type = XAPI_ACTIVITY_TYPES.interaction;
    definition.interactionType = obj.interactionType;
    if (
      Array.isArray(obj.correctResponsesPattern) &&
      obj.correctResponsesPattern.length
    ) {
      definition.correctResponsesPattern = obj.correctResponsesPattern.map(
        (p) => String(p),
      );
    }
    XAPI_COMPONENT_LISTS.forEach((list) => {
      if (Array.isArray(obj[list])) {
        definition[list] = obj[list].map((c) => ({
          id: String(c.id),
          description:
            c.description && typeof c.description === "object"
              ? { ...c.description }
              : languageMap(c.description, lang),
        }));
      }
    });
  }
  if (obj.extensions) {
    definition.extensions = { ...obj.extensions };
  }
  const statement = {
    id: id || xapiUuid(),
    verb: { id: verbId, display: { "en-US": verbName } },
    object: {
      id: obj.id || pageUrl(),
      objectType: "Activity",
      definition,
    },
    context: educationalRecordContext({ ...ctx, language: lang }),
    timestamp: timestamp || new Date().toISOString(),
    version: XAPI_VERSION,
  };
  if (ctx.extensions) {
    Object.assign(statement.context.extensions, ctx.extensions);
  }
  const who = actor || currentActor();
  if (who) {
    statement.actor = who;
  }
  if (result && typeof result === "object") {
    const r = {};
    if (typeof result.success === "boolean") {
      r.success = result.success;
    }
    if (typeof result.completion === "boolean") {
      r.completion = result.completion;
    }
    if (result.response != null && result.response !== "") {
      r.response = String(result.response);
    }
    const score = cleanScore(result.score);
    if (score) {
      r.score = score;
    }
    if (result.duration) {
      r.duration = result.duration;
    }
    if (result.extensions) {
      r.extensions = { ...result.extensions };
    }
    if (Object.keys(r).length) {
      statement.result = r;
    }
  }
  return statement;
}

/**
 * ISO 8601 duration from milliseconds
 */
export function xapiDuration(ms) {
  const s = Math.max(0, Number(ms) || 0) / 1000;
  return `PT${Math.round(s * 100) / 100}S`;
}

/**
 * Text form of a learner's answer for result.response. Arrays become the
 * xAPI multi value form (items joined by "[,]").
 */
export function responseText(value) {
  if (value == null) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value
      .map((v) =>
        v && typeof v === "object"
          ? v.label != null
            ? v.label
            : v.text != null
              ? v.text
              : JSON.stringify(v)
          : String(v),
      )
      .join("[,]");
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

/*
 * Interaction components (xAPI 1.0.3 "Interaction Activities"): for choice,
 * sequencing, matching (and likert, performance) result.response and
 * correctResponsesPattern hold component ids; what each id means lives in
 * object.definition (choices, source, target, ...).
 *
 * Component ids: "c-" + 8 hex characters of a hash of the component's text
 * (whitespace collapsed). They depend only on the text, so reordering or
 * shuffling options keeps every id and rewording an option gives it a new
 * one. Two options with the same id in one list (same text, or a hash
 * collision) are told apart deterministically: they are ordered by their
 * text and the second gets "-2", the third "-3", ... Ids only use
 * [a-z0-9-], so they never contain the "[,]" or "[.]" delimiters.
 */
function componentText(text) {
  let s = String(text == null ? "" : text);
  if (typeof s.normalize === "function") {
    s = s.normalize("NFC");
  }
  return s.replace(/\s+/g, " ").trim();
}

export function componentId(text) {
  return `c-${xapiHash(componentText(text)).padStart(8, "0")}`;
}

/**
 * Ids for a list of component texts, in the same order, unique in the list
 * @param {string[]} texts
 * @returns {string[]}
 */
export function componentIds(texts) {
  const list = Array.isArray(texts) ? texts.map(componentText) : [];
  const ids = list.map((t) => componentId(t));
  const byId = {};
  ids.forEach((id, i) => {
    (byId[id] = byId[id] || []).push(i);
  });
  Object.keys(byId).forEach((id) => {
    const group = byId[id];
    if (group.length < 2) {
      return;
    }
    group
      .slice()
      .sort((a, b) => (list[a] < list[b] ? -1 : list[a] > list[b] ? 1 : a - b))
      .forEach((index, n) => {
        ids[index] = n === 0 ? id : `${id}-${n + 1}`;
      });
  });
  return ids;
}

/**
 * Component list for an object definition: [{ id, description }]
 * (description stays text; buildStatement makes it a language map)
 * @param {string[]} texts
 */
export function interactionComponents(texts) {
  const list = Array.isArray(texts) ? texts : [];
  const ids = componentIds(list);
  return list.map((t, i) => ({ id: ids[i], description: componentText(t) }));
}

/**
 * result.response / pattern for choice and sequencing: ids joined by "[,]"
 */
export function choiceResponse(ids) {
  return (Array.isArray(ids) ? ids : [])
    .filter((id) => id != null && id !== "")
    .join(XAPI_ITEM_DELIMITER);
}

/**
 * result.response / pattern for matching: [[sourceId, targetId], ...] as
 * "s[.]t[,]s2[.]t2"
 */
export function matchingResponse(pairs) {
  return (Array.isArray(pairs) ? pairs : [])
    .filter((p) => Array.isArray(p) && p[0] && p[1])
    .map((p) => `${p[0]}${XAPI_PAIR_DELIMITER}${p[1]}`)
    .join(XAPI_ITEM_DELIMITER);
}

/**
 * One fill-in / long-fill-in item of free text. The spec has no escape for
 * the "[,]" delimiter, so it (and "[.]") is reduced to its middle character.
 * A characterstring parameter ({case_matters=...}, {lang=...}) is only
 * recognised at the start of an item, so text that itself starts with "{"
 * gets the item level {lang=<tag>} parameter the spec defines in front of
 * it; readers drop that prefix and read the text after it unchanged.
 * @param {string} text
 * @param {string} [lang]
 */
export function fillInItem(text, lang) {
  const s = String(text == null ? "" : text)
    .split(XAPI_ITEM_DELIMITER)
    .join(",")
    .split(XAPI_PAIR_DELIMITER)
    .join(".");
  return s.charAt(0) === "{" ? `{lang=${lang || xapiLanguage()}}${s}` : s;
}

/**
 * Learner text of a fill-in item (fillInItem undone)
 */
export function fillInText(item) {
  return String(item == null ? "" : item).replace(/^\{lang=[^}]*\}/, "");
}

/**
 * result.response for fill-in / long-fill-in: one item per blank, "[,]"
 */
export function fillInResponse(items, lang) {
  return (Array.isArray(items) ? items : [items])
    .map((t) => fillInItem(t, lang))
    .join(XAPI_ITEM_DELIMITER);
}

// first value of a language map
function mapText(map) {
  if (!map || typeof map !== "object") {
    return "";
  }
  const keys = Object.keys(map);
  return keys.length ? String(map[keys[0]]) : "";
}

/**
 * The learner's response of a statement in plain words, resolving component
 * ids through its object definition (for dashboards and "Recent activity";
 * never sent anywhere). Ids not in the definition are shown as they are.
 * @param {XAPIStatement} statement
 * @returns {string}
 */
export function describeResponse(statement) {
  const result = statement && statement.result ? statement.result : {};
  if (result.response == null) {
    return "";
  }
  const response = String(result.response);
  const def =
    statement.object && statement.object.definition
      ? statement.object.definition
      : {};
  const named = (list) => {
    const out = {};
    (Array.isArray(def[list]) ? def[list] : []).forEach((c) => {
      out[c.id] = mapText(c.description) || c.id;
    });
    return (id) =>
      Object.prototype.hasOwnProperty.call(out, id) ? out[id] : id;
  };
  const items = response === "" ? [] : response.split(XAPI_ITEM_DELIMITER);
  switch (def.interactionType) {
    case "true-false":
      return response === "true"
        ? "True"
        : response === "false"
          ? "False"
          : response;
    case "choice":
    case "sequencing": {
      const name = named("choices");
      return items.map(name).join(", ");
    }
    case "likert":
      return items.map(named("scale")).join(", ");
    case "matching": {
      const source = named("source");
      const target = named("target");
      return items
        .map((pair) => {
          const [s, t] = pair.split(XAPI_PAIR_DELIMITER);
          return `${source(s)} → ${target(t)}`;
        })
        .join("; ");
    }
    case "fill-in":
    case "long-fill-in":
      return items.map(fillInText).join(", ");
    default:
      return response;
  }
}

/**
 * Build a statement for an engagement detail that came without one (older
 * or third party emitters), from the loose fields.
 * @param {UserEngagementDetail} detail
 * @param {HTMLElement} [element] the element that fired it
 */
export function statementFromEngagement(detail, element) {
  const d = detail || {};
  const result = {};
  if (typeof d.resultSuccess === "boolean") {
    result.success = d.resultSuccess;
  }
  if (typeof d.resultCompletion === "boolean") {
    result.completion = d.resultCompletion;
  }
  if (typeof d.resultScore === "number") {
    result.score = { raw: d.resultScore, max: 1, min: 0 };
  }
  if (d.resultResponse != null) {
    result.response = responseText(d.resultResponse);
  }
  let objectId = "";
  if (d.objectId && /^[a-z][a-z0-9+.-]*:/i.test(String(d.objectId))) {
    objectId = String(d.objectId);
  } else if (d.objectId) {
    objectId = `${pageUrl()}#${encodeURIComponent(d.objectId)}`;
  } else if (element && element.tagName) {
    objectId = activityId(element);
  } else {
    objectId = `${pageUrl()}#${encodeURIComponent(
      `activity-${xapiHash(d.objectName || "")}`,
    )}`;
  }
  return buildStatement({
    verb: d.activityDisplay || "interacted",
    object: {
      id: objectId,
      name: d.objectName,
      description: d.objectDetail,
    },
    result,
    context: {
      extensions:
        element && element.tagName
          ? { [XAPI_EXTENSIONS.element]: element.tagName.toLowerCase() }
          : undefined,
    },
  });
}
