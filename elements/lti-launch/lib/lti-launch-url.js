/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * URL and parameter rules for `lti-launch`. Plain functions with no DOM so
 * they can be tested on their own.
 *
 * Rule: the element only ever navigates to, posts to or frames an absolute
 * http: or https: address without credentials in it. Everything else
 * (javascript:, data:, blob:, file:, relative paths, addresses that do not
 * parse) is treated as if no address was given.
 */

const MAX_URL_LENGTH = 2048;
const MAX_VALUE_LENGTH = 4096;

/**
 * The normalized address when value is an absolute http(s) URL, otherwise
 * "". Use what this returns, never the value that was passed in.
 * @param {*} value
 * @returns {String}
 */
export function safeHttpUrl(value) {
  if (typeof value !== "string") {
    return "";
  }
  const text = value.trim();
  if (!text || text.length > MAX_URL_LENGTH) {
    return "";
  }
  let url;
  try {
    url = new URL(text);
  } catch {
    return "";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "";
  }
  if (!url.hostname || url.username || url.password) {
    return "";
  }
  return url.href;
}

/**
 * The origin of an address safeHttpUrl accepts, otherwise "".
 * @param {*} value
 * @returns {String}
 */
export function httpOrigin(value) {
  const href = safeHttpUrl(value);
  return href ? new URL(href).origin : "";
}

/**
 * An opaque value (a hint, an identifier) as text of a sane length.
 * @param {*} value
 * @returns {String}
 */
export function opaqueValue(value) {
  if (value == null) {
    return "";
  }
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }
  return String(value).trim().slice(0, MAX_VALUE_LENGTH);
}

/**
 * What the element can do with its settings.
 *   mode "none": no usable launch address, nothing to open
 *   mode "link": open launchUrl as a plain link
 *   mode "lti":  LTI 1.3 third-party-initiated login to loginUrl
 * LTI needs a usable login address, a client id and a deployment id; with
 * any of them missing the block is a plain link.
 * @param {Object} settings { launchUrl, loginUrl, clientId, deploymentId }
 * @returns {Object} { mode, launchUrl, loginUrl, clientId, deploymentId }
 */
export function launchPlan(settings) {
  const s = settings || {};
  const launchUrl = safeHttpUrl(s.launchUrl);
  const loginUrl = safeHttpUrl(s.loginUrl);
  const clientId = opaqueValue(s.clientId);
  const deploymentId = opaqueValue(s.deploymentId);
  let mode = "none";
  if (launchUrl) {
    mode = loginUrl && clientId && deploymentId ? "lti" : "link";
  }
  return { mode, launchUrl, loginUrl, clientId, deploymentId };
}

/**
 * The fields of the LTI 1.3 third-party-initiated login request, in the
 * order they are posted.
 * @param {Object} plan from launchPlan (mode "lti")
 * @param {Object} values { issuer, pageOrigin, loginHint, messageHint }
 * @returns {Object} { iss, target_link_uri, client_id, lti_deployment_id,
 *   login_hint, lti_message_hint }
 */
export function loginRequestFields(plan, values) {
  const v = values || {};
  // an issuer is an identifier the tool compares character for character,
  // so a usable one is sent as written (it is a form value, never opened)
  const issuer = safeHttpUrl(v.issuer) ? String(v.issuer).trim() : "";
  return {
    iss: issuer || httpOrigin(v.pageOrigin),
    target_link_uri: plan.launchUrl,
    client_id: plan.clientId,
    lti_deployment_id: plan.deploymentId,
    login_hint: opaqueValue(v.loginHint),
    lti_message_hint: opaqueValue(v.messageHint),
  };
}

/**
 * Sandbox for the embedded tool. A tool on another origin needs its own
 * cookies and storage (allow-same-origin); a frame on this page's own
 * origin never gets scripts and same-origin together, which would let it
 * remove the sandbox.
 * @param {String[]} urls addresses the frame will load
 * @param {String} pageOrigin origin of the page, "" when unknown
 * @returns {String}
 */
export function frameSandbox(urls, pageOrigin) {
  const base = [
    "allow-scripts",
    "allow-forms",
    "allow-popups",
    "allow-popups-to-escape-sandbox",
    "allow-downloads",
  ];
  const origins = (Array.isArray(urls) ? urls : [])
    .map((u) => httpOrigin(u))
    .filter((o) => o);
  const own = !pageOrigin || origins.some((o) => o === pageOrigin);
  return own ? base.join(" ") : ["allow-same-origin", ...base].join(" ");
}
