/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Session request tokens (SEC-SESSION, haxcms-nodejs#71 / haxcms-php#655).
 *
 * HAXcms backends guard mutations with two request tokens on top of the
 * bearer JWT: `userToken` (X-HAXCMS-User-Token) and `siteToken`
 * (X-HAXCMS-Site-Token). They used to arrive only via connection-settings,
 * which the page loads once, before login. Backends can now omit them for
 * anonymous callers (`security.requireSessionForRequestTokens`) and instead
 * return them on successful login, refresh and connection-test responses.
 *
 * These helpers pull the tokens out of those responses and write them into an
 * appSettings object in every shape the editor reads them from:
 *   - appSettings.userToken / appSettings.siteToken (API registries)
 *   - appSettings.getUserDataHeaders[userTokenHeader] (user data calls)
 *   - appSettings.appStore.headers['X-HAXCMS-Site-Token'] (app store)
 * Nested objects are replaced, never mutated, so observable / frozen copies
 * are safe to pass in.
 */

export const USER_TOKEN_HEADER = "X-HAXCMS-User-Token";
export const SITE_TOKEN_HEADER = "X-HAXCMS-Site-Token";

function cleanToken(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Read userToken / siteToken from a login, refresh or connection-test
 * response body. Accepts the top-level shape ({ jwt, userToken, siteToken })
 * and the enveloped shape ({ data: { ... } }). Only non-empty strings count.
 * @param {Object} payload parsed JSON response
 * @returns {{userToken?: string, siteToken?: string}}
 */
export function extractSessionRequestTokens(payload) {
  const tokens = {};
  if (!isPlainObject(payload)) {
    return tokens;
  }
  const sources = [payload];
  if (isPlainObject(payload.data)) {
    sources.push(payload.data);
  }
  ["userToken", "siteToken"].forEach((key) => {
    for (let i = 0; i < sources.length; i++) {
      const value = cleanToken(sources[i][key]);
      if (value !== "") {
        tokens[key] = value;
        return;
      }
    }
  });
  return tokens;
}

/**
 * True when extractSessionRequestTokens found anything worth applying.
 * @param {Object} tokens
 */
export function hasSessionRequestTokens(tokens) {
  return (
    isPlainObject(tokens) &&
    (cleanToken(tokens.userToken) !== "" || cleanToken(tokens.siteToken) !== "")
  );
}

/**
 * Write tokens into an appSettings object (in place). Empty / missing tokens
 * leave the existing values alone, so a refresh response without a siteToken
 * (no resolvable site) never clears one that connection-settings provided.
 * @param {Object} appSettings settings object to update
 * @param {{userToken?: string, siteToken?: string}} tokens
 * @returns {boolean} true when any value changed
 */
export function applySessionRequestTokens(appSettings, tokens) {
  if (!isPlainObject(appSettings) || !isPlainObject(tokens)) {
    return false;
  }
  let changed = false;
  const userToken = cleanToken(tokens.userToken);
  const siteToken = cleanToken(tokens.siteToken);
  if (userToken !== "") {
    if (appSettings.userToken !== userToken) {
      appSettings.userToken = userToken;
      changed = true;
    }
    const headerName =
      cleanToken(appSettings.userTokenHeader) || USER_TOKEN_HEADER;
    const userHeaders = isPlainObject(appSettings.getUserDataHeaders)
      ? appSettings.getUserDataHeaders
      : {};
    if (userHeaders[headerName] !== userToken) {
      appSettings.getUserDataHeaders = Object.assign({}, userHeaders, {
        [headerName]: userToken,
      });
      changed = true;
    }
  }
  if (siteToken !== "") {
    if (appSettings.siteToken !== siteToken) {
      appSettings.siteToken = siteToken;
      changed = true;
    }
    // only touch the app store connection when the backend configured one
    if (isPlainObject(appSettings.appStore)) {
      const storeHeaders = isPlainObject(appSettings.appStore.headers)
        ? appSettings.appStore.headers
        : {};
      if (storeHeaders[SITE_TOKEN_HEADER] !== siteToken) {
        appSettings.appStore = Object.assign({}, appSettings.appStore, {
          headers: Object.assign({}, storeHeaders, {
            [SITE_TOKEN_HEADER]: siteToken,
          }),
        });
        changed = true;
      }
    }
  }
  return changed;
}

/**
 * Non-mutating variant: returns a shallow copy of appSettings with the tokens
 * applied (or the same object when nothing changed).
 * @param {Object} appSettings
 * @param {{userToken?: string, siteToken?: string}} tokens
 * @returns {Object}
 */
export function withSessionRequestTokens(appSettings, tokens) {
  const base = isPlainObject(appSettings) ? appSettings : {};
  const next = Object.assign({}, base);
  return applySessionRequestTokens(next, tokens) ? next : base;
}
