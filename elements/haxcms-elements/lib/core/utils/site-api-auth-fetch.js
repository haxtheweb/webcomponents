/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Authenticated fetch for direct HAXcms site API calls (x/api/v1/...).
 *
 * The site API only reads credentials from the Authorization header (bearer
 * JWT or basic). Cookies alone make a request anonymous, so a bare
 * `fetch(url, { credentials: "include" })` from a logged-in editor is
 * answered as if nobody were logged in: binary exports (pdf / docx / epub)
 * return 401 and html exports silently drop unpublished pages.
 *
 * siteApiFetch() attaches the editor's current JWT (the one the site API
 * registry already tracks and keeps fresh on login / refresh) and, when the
 * backend says the token is stale (403), asks jwt-login for a refresh and
 * retries once. With no JWT (published / static sites, logged-out visitors)
 * it behaves exactly like a plain fetch.
 *
 * Kept dependency-free on purpose: theme mixins (PDFPageMixin, print
 * buttons) load it on published sites, where pulling in the full registry
 * would be wasted weight.
 */

// Shared with haxcms-site-api-registry.js, which owns and writes this state.
export const SITE_API_STATE_KEY = "__HAXCMSSiteApiRegistryState";

// How long to wait on jwt-login before giving up on a refresh and returning
// the original 403 response.
const REFRESH_TIMEOUT_MS = 15000;

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Current editor JWT as tracked by the site API registry, or "".
 * @returns {string}
 */
export function getSiteApiJwt() {
  const state = globalThis[SITE_API_STATE_KEY];
  if (state && state.auth && typeof state.auth === "object") {
    return cleanString(state.auth.jwt);
  }
  return "";
}

/**
 * Authorization header for the site API, or {} when not logged in.
 * @param {string} [jwt] explicit token; defaults to getSiteApiJwt()
 * @returns {Object}
 */
export function getSiteApiAuthHeaders(jwt) {
  const token = typeof jwt === "string" ? cleanString(jwt) : getSiteApiJwt();
  return token === "" ? {} : { Authorization: `Bearer ${token}` };
}

function hasHeader(headers, name) {
  const lower = name.toLowerCase();
  return Object.keys(headers).some((key) => key.toLowerCase() === lower);
}

function buildInit(init, jwt) {
  const base = init && typeof init === "object" ? init : {};
  const headers = {};
  if (
    base.headers &&
    typeof Headers !== "undefined" &&
    base.headers instanceof Headers
  ) {
    base.headers.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (base.headers && typeof base.headers === "object") {
    Object.assign(headers, base.headers);
  }
  // an explicit Authorization from the caller always wins
  if (!hasHeader(headers, "Authorization")) {
    Object.assign(headers, getSiteApiAuthHeaders(jwt));
  }
  return Object.assign({ credentials: "include" }, base, { headers });
}

/**
 * Ask jwt-login for a fresh token. Resolves with the new JWT, or "" when the
 * refresh fails or nobody answers within REFRESH_TIMEOUT_MS.
 * @returns {Promise<string>}
 */
export function requestSiteApiJwtRefresh(timeoutMs = REFRESH_TIMEOUT_MS) {
  return new Promise((resolve) => {
    let done = false;
    let timer = null;
    const finish = (jwt) => {
      if (done) {
        return;
      }
      done = true;
      clearTimeout(timer);
      globalThis.removeEventListener("jwt-login-refresh-error", onError);
      resolve(cleanString(jwt));
    };
    const onError = () => finish("");
    globalThis.addEventListener("jwt-login-refresh-error", onError);
    timer = setTimeout(() => finish(""), timeoutMs);
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-refresh-token", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: {
          element: {
            obj: { refreshed: finish },
            callback: "refreshed",
            params: [],
          },
        },
      }),
    );
  });
}

/**
 * fetch() for HAXcms site API URLs that carries the editor's JWT.
 * Same signature and return value as fetch().
 * @param {string|URL} url
 * @param {RequestInit} [init]
 * @returns {Promise<Response>}
 */
export async function siteApiFetch(url, init = {}) {
  const jwt = getSiteApiJwt();
  const response = await globalThis.fetch(url, buildInit(init, jwt));
  // 403 with a token we sent = expired / invalid bearer; the backend reserves
  // 401 for "no credentials", which a refresh cannot fix.
  if (response.status !== 403 || jwt === "") {
    return response;
  }
  const fresh = await requestSiteApiJwtRefresh();
  if (fresh === "" || fresh === jwt) {
    return response;
  }
  return globalThis.fetch(url, buildInit(init, fresh));
}
