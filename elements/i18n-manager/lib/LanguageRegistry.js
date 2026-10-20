/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Helpers for the canonical language registry (`languages.json`).
 *
 * The registry is the one list of languages HAX knows about. Anything that
 * lets a person pick, store or resolve a language (installer, system
 * settings, site settings, the CLI, the backends) should go through it
 * instead of keeping its own list.
 *
 * Shape of `languages.json`:
 * - `languages` is keyed by the canonical code that gets stored (`en`, `sw`,
 *   `pt-BR`, `zh-CN`).
 * - An entry without `parent` is a language. An entry with `parent` is a
 *   regional variant (`en-GB`) that resolves to its parent's translations.
 * - `locale` is the translation file suffix (`<namespace>.<locale>.json`),
 *   so `zh-CN` stores as `zh-CN` but loads `zh` files.
 * - `aliases` are other codes that resolve to the entry (legacy codes like
 *   `iw`, script tags like `zh-Hans`).
 * - `popular` is an optional rank used to put the most common languages
 *   first in short lists.
 *
 * This module has no DOM or DDD dependency so the same code can run in a
 * browser, in Node (inject the parsed JSON with `setLanguageRegistry`) and
 * in tests.
 */

export const LANGUAGE_REGISTRY_URL = new URL(
  "./languages.json",
  import.meta.url,
).href;

// prepared registry, set by loadLanguageRegistry / setLanguageRegistry
let current = null;
let loading = null;
// raw registry object -> prepared lookup (so passing raw JSON stays cheap)
const prepared = new WeakMap();

function stripDiacritics(value) {
  return String(value).normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * @description Build the lookup tables for a raw registry object
 * @param {Object} data parsed languages.json
 * @returns {Object} { languages, lookup } where lookup maps a lower-case
 * code or alias to its canonical code
 */
function prepare(data) {
  if (!data || typeof data !== "object" || !data.languages) {
    throw new Error("language registry: missing `languages`");
  }
  if (prepared.has(data)) {
    return prepared.get(data);
  }
  const lookup = {};
  Object.keys(data.languages).forEach((code) => {
    lookup[code.toLowerCase()] = code;
  });
  // aliases never override a real code
  Object.keys(data.languages).forEach((code) => {
    (data.languages[code].aliases || []).forEach((alias) => {
      const key = String(alias).toLowerCase();
      if (!lookup[key]) {
        lookup[key] = code;
      }
    });
  });
  const result = { languages: data.languages, lookup };
  prepared.set(data, result);
  return result;
}

function resolveSource(source) {
  if (source) {
    return prepare(source);
  }
  if (!current) {
    throw new Error(
      "language registry not loaded: call loadLanguageRegistry() or setLanguageRegistry() first",
    );
  }
  return current;
}

/**
 * @description Provide the registry directly (Node, tests, SSR)
 * @param {Object} data parsed languages.json
 */
export function setLanguageRegistry(data) {
  current = prepare(data);
  return data;
}

/**
 * @description The registry that was loaded or set, or null
 */
export function getLanguageRegistry() {
  return current ? { languages: current.languages } : null;
}

/**
 * @description Fetch the registry once and cache it
 * @param {String} url override for where languages.json lives
 * @returns {Promise<Object>} the parsed registry
 */
export async function loadLanguageRegistry(url = LANGUAGE_REGISTRY_URL) {
  if (current) {
    return getLanguageRegistry();
  }
  if (!loading) {
    loading = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`language registry: ${response.status} for ${url}`);
        }
        return response.json();
      })
      .then((data) => {
        setLanguageRegistry(data);
        return data;
      })
      .finally(() => {
        loading = null;
      });
  }
  return loading;
}

/**
 * @description Normalize any language code or OS locale to the canonical
 * registry code. Handles `pt_BR.UTF-8`, `zh_CN`, `zh-Hans-CN`, legacy codes
 * (`iw`) and unknown regions (`fr-CA` resolves to `fr`).
 * @param {String} value a language code or locale
 * @param {Object} source optional raw registry (defaults to the loaded one)
 * @returns {String|null} canonical code, or null when it is not a language
 * the registry knows
 */
export function normalizeLanguageCode(value, source) {
  if (!value || typeof value !== "string") {
    return null;
  }
  const { lookup } = resolveSource(source);
  const cleaned = value.split(".")[0].split("@")[0].replace(/_/g, "-").trim();
  if (!cleaned || /^(c|posix)$/i.test(cleaned)) {
    return null;
  }
  const parts = cleaned.split("-").filter(Boolean);
  if (!/^[a-z]{2,3}$/i.test(parts[0] || "")) {
    return null;
  }
  const primary = parts[0].toLowerCase();
  const script = parts.slice(1).find((p) => /^[a-z]{4}$/i.test(p));
  const region = parts.slice(1).find((p) => /^([a-z]{2}|\d{3})$/i.test(p));
  // most specific first, then drop subtags until something is known
  const candidates = [];
  if (script && region) {
    candidates.push(`${primary}-${script}-${region}`);
  }
  if (script) {
    candidates.push(`${primary}-${script}`);
  }
  if (region) {
    candidates.push(`${primary}-${region}`);
  }
  candidates.push(primary);
  for (const candidate of candidates) {
    const match = lookup[candidate.toLowerCase()];
    if (match) {
      return match;
    }
  }
  return null;
}

/**
 * @description Whether the registry knows this language
 */
export function isSupportedLanguageCode(value, source) {
  return normalizeLanguageCode(value, source) !== null;
}

/**
 * @description The registry entry for a code, with its canonical `code`
 * @returns {Object|null}
 */
export function getLanguageByCode(value, source) {
  const code = normalizeLanguageCode(value, source);
  if (!code) {
    return null;
  }
  const { languages } = resolveSource(source);
  return { code, ...languages[code] };
}

/**
 * @description The translation file suffix for a code (`zh-CN` -> `zh`)
 * @returns {String|null}
 */
export function getLanguageLocale(value, source) {
  const entry = getLanguageByCode(value, source);
  return entry ? entry.locale : null;
}

/**
 * @description Text direction for a code; `ltr` when unknown
 * @returns {"ltr"|"rtl"}
 */
export function getLanguageDirection(value, source) {
  const entry = getLanguageByCode(value, source);
  return entry && entry.dir === "rtl" ? "rtl" : "ltr";
}

/**
 * @description The label pickers show, e.g. "Swahili - sw"
 */
export function getLanguageLabel(entry) {
  return `${entry.name} - ${entry.code}`;
}

function toOption(code, entry) {
  const aliases = entry.aliases || [];
  const full = { code, ...entry };
  return {
    value: code,
    label: getLanguageLabel(full),
    code,
    name: entry.name,
    nativeName: entry.nativeName,
    locale: entry.locale,
    dir: entry.dir === "rtl" ? "rtl" : "ltr",
    parent: entry.parent || null,
    popular: typeof entry.popular === "number" ? entry.popular : null,
    aliases,
    // lower-case, accent-free text the search matches against
    search: stripDiacritics(
      [entry.name, entry.nativeName, code, entry.locale, ...aliases].join(" "),
    ).toLowerCase(),
  };
}

/**
 * @description Options for a language picker, sorted by English name
 * @param {Object} config
 * @param {Boolean|"featured"} config.includeRegions regional variants to
 * include: `"featured"` (default) only the ones worth choosing separately
 * (en-GB, pt-BR...), `true` all of them, `false` none
 * @param {Boolean} config.popularFirst put ranked languages first, in rank
 * order, then the rest by name
 * @param {Object} config.registry optional raw registry
 * @returns {Array} [{ value, label, code, name, nativeName, locale, dir,
 * parent, popular, aliases, search }]
 */
export function getLanguageOptions({
  includeRegions = "featured",
  popularFirst = false,
  registry,
} = {}) {
  const { languages } = resolveSource(registry);
  const options = Object.keys(languages)
    .filter((code) => {
      const entry = languages[code];
      if (!entry.parent) {
        return true;
      }
      return (
        includeRegions === true ||
        (includeRegions === "featured" && entry.featured)
      );
    })
    .map((code) => toOption(code, languages[code]));
  options.sort((a, b) => {
    if (popularFirst) {
      const ap = a.popular === null ? Infinity : a.popular;
      const bp = b.popular === null ? Infinity : b.popular;
      if (ap !== bp) {
        return ap - bp;
      }
    }
    return a.name.localeCompare(b.name, "en");
  });
  return options;
}

/**
 * @description The most common languages, in rank order, for short pick
 * lists (like the CLI prompt)
 * @param {Number} limit how many to return
 */
export function getPopularLanguageOptions(limit = 10, registry) {
  return getLanguageOptions({ includeRegions: false, registry })
    .filter((option) => option.popular !== null)
    .sort((a, b) => a.popular - b.popular)
    .slice(0, limit);
}

/**
 * @description Filter options by what someone typed. Matches the English
 * name, native name, code, locale and aliases, ignoring case and accents,
 * so "swa", "Swahili", "Kiswahili" and "sw" all find Swahili. Every word
 * typed must match; better matches (exact code, name starts with) sort first.
 * @param {String} query what was typed
 * @param {Array} options from getLanguageOptions (defaults to all languages)
 * @returns {Array} matching options, best first
 */
export function searchLanguageOptions(query, options) {
  const list = options || getLanguageOptions();
  const text = stripDiacritics(query || "")
    .toLowerCase()
    .trim();
  if (!text) {
    return list;
  }
  const tokens = text.split(/\s+/);
  const scored = [];
  list.forEach((option) => {
    if (!tokens.every((token) => option.search.includes(token))) {
      return;
    }
    const name = stripDiacritics(option.name).toLowerCase();
    const native = stripDiacritics(option.nativeName).toLowerCase();
    let score = 10;
    if (option.code.toLowerCase() === text) {
      score = 100;
    } else if (name === text) {
      score = 90;
    } else if (option.code.toLowerCase().startsWith(text)) {
      score = 80;
    } else if (name.startsWith(text)) {
      score = 70;
    } else if (native.startsWith(text)) {
      score = 60;
    }
    scored.push({ option, score });
  });
  scored.sort(
    (a, b) =>
      b.score - a.score || a.option.name.localeCompare(b.option.name, "en"),
  );
  return scored.map((item) => item.option);
}
