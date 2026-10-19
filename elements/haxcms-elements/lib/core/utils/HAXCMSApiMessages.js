/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Translatable HAXcms API messages (haxtheweb/issues#3157).
 *
 * Both backends send their English `message` (or `error`) plus a stable
 * `code` and `params` from the shared list in ../../haxcms-api-codes.json.
 * haxcmsApiMessage() turns a response into text in the user's language
 * using locales/haxcms-api.<lang>.json, and falls back to the English
 * message the server sent.
 */
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// English text for every code; keep in sync with locales/haxcms-api.en.json
export const HAXCMS_API_MESSAGES_EN = Object.freeze({
  AUTH_RATE_LIMITED: "Too many failed sign-in attempts. Please try again later.",
  AUTH_INVALID_CREDENTIALS: "Invalid username or password.",
  AUTH_TOKEN_INVALID: "Your sign-in has expired or is invalid. Please sign in again.",
  AUTH_REQUIRED_EXPORT: "Sign in to export as {format}.",
  AUTH_REQUIRED: "You need to sign in to do this.",
  AUTH_FAILED: "Sign-in failed.",
  SESSION_NONE: "No active session.",
  SESSION_STORE_UNAVAILABLE: "The session store is unavailable.",
  LOGGED_OUT: "You have been signed out.",
  USER_TOKEN_REQUIRED: "A user token is required for this request.",
  USER_TOKEN_INVALID: "Your request token is invalid. Reload the page and try again.",
  SITE_TOKEN_REQUIRED: "A site token is required for this request.",
  SITE_TOKEN_INVALID: "The site token is invalid. Reload the page and try again.",
  INSTALL_TOKEN_INVALID: "The install token is invalid or missing.",
  NOT_INSTALLED: "HAXcms is not installed.",
  INSTALL_STEP_INVALID: "Invalid install step.",
  SITE_ACCESS_DENIED: "You don't have access to this site.",
  ACCESS_DENIED: "Access denied.",
  HAXIAM_DISABLED: "HAXIAM mode is not enabled.",
  USER_NOT_SET_UP: "That user hasn't set up HAXIAM yet. They need to sign in first.",
  USER_ALREADY_HAS_ACCESS: "That user already has access to this site.",
  ACCESS_SELF_GRANT: "You can't grant access to yourself.",
  ACCESS_GRANTED: "Access granted.",
  ACCESS_GRANT_FAILED: "Unable to grant access.",
  FEATURE_DISABLED_OUTLINE: "Changing the outline is disabled for this site.",
  FEATURE_DISABLED_ADD_PAGE: "Adding pages is disabled for this site.",
  FEATURE_DISABLED_PAGE_DETAILS: "Editing page details is disabled for this site.",
  FEATURE_DISABLED_DELETE: "Deleting is disabled for this site.",
  FEATURE_DISABLED_FILES: "File operations are disabled for this site.",
  FEATURE_DISABLED_UPLOAD: "Uploading media is disabled for this site.",
  FEATURE_DISABLED_SETTINGS: "These settings are disabled for this site.",
  FEATURE_DISABLED: "This operation is disabled for this site.",
  METHOD_NOT_ALLOWED: "This request method is not allowed.",
  FORM_NOT_FOUND: "Form not found.",
  ROUTE_NOT_FOUND: "This API route doesn't exist.",
  API_HANDLER_MISSING: "The server can't handle this request.",
  OPENAPI_UNAVAILABLE: "Unable to load the API description.",
  SERVER_ERROR: "Something went wrong on the server.",
  REQUEST_TOO_LARGE: "The request is too large.",
  INPUT_TOO_LARGE: "The input is too large (maximum {maxBytes} bytes).",
  FILE_RATE_LIMITED: "Too many file operations on this site. Try again in {retryAfter}.",
  SITE_NAME_INVALID: "Site names can only use letters, numbers, hyphens and underscores.",
  USER_NAME_INVALID: "User names can only use letters, numbers, hyphens and underscores.",
  SITE_NAME_REQUIRED: "A site name is required.",
  SITE_NOT_FOUND: "Site not found.",
  SITE_CONTEXT_UNRESOLVED: "Unable to find the site for this request.",
  SITE_CREATE_FAILED: "Unable to create the site.",
  SITE_THEME_INVALID: "That theme can't be used for a new site.",
  SITE_CLONE_FAILED: "Unable to copy the site.",
  SITE_ARCHIVED: "Site archived.",
  SITE_ARCHIVE_FAILED: "Unable to archive the site.",
  TEMPLATE_SAVE_FAILED: "Unable to save the site as a template.",
  TEMPLATE_NOT_FOUND: "Template not found.",
  ITEM_COUNT_MISMATCH: "The number of pages changed unexpectedly, so nothing was saved.",
  ITEM_NOT_FOUND: "Page not found.",
  ITEM_UPDATE_FAILED: "Unable to update the page.",
  OUTLINE_INVALID: "The outline is invalid.",
  PAGE_BREAK_REQUIRED: "The content must include a page break. Only content after it is saved.",
  CONTENT_INVALID: "The page content is invalid.",
  REVISION_NOT_FOUND: "Revision not found.",
  REVISION_LOAD_FAILED: "Unable to load the page history.",
  REVISION_RESTORE_FAILED: "Unable to restore that version of the page.",
  ALT_FORMATS_FAILED: "Unable to update alternative formats for this site.",
  BLOCK_NOT_FOUND: "Block not found.",
  CUSTOM_ELEMENT_NOT_FOUND: "Custom element not found.",
  VIEW_NOT_FOUND: "View not found.",
  REGION_NOT_FOUND: "Region not found.",
  THEME_NOT_FOUND: "Theme not found.",
  REPORT_UNKNOWN: "Unknown report.",
  FILE_UUID_INVALID: "A valid file ID is required.",
  FILE_NOT_FOUND: "File not found.",
  FILE_EXISTS: "A file with this name already exists.",
  FILE_NAME_INVALID: "That file name can't be used.",
  FILE_PATH_INVALID: "Invalid file path.",
  FILE_OP_UNSUPPORTED: "Unsupported file operation.",
  FILE_OP_FAILED: "The file operation failed.",
  UPLOAD_MISSING: "No file was uploaded.",
  UPLOAD_READ_FAILED: "Unable to read the uploaded file.",
  UPLOAD_WRONG_TYPE: "Wrong file type. Expected {expected}.",
  UPLOAD_NOT_VALID: "The uploaded file isn't a valid {expected} file.",
  UPLOAD_XLS_UNSUPPORTED: "Legacy .xls files aren't supported. Save the file as .xlsx and try again.",
  UPLOAD_TYPE_NOT_ALLOWED: "This file type isn't allowed.",
  UPLOAD_TOO_LARGE: "The file is larger than the {maxMb} MB upload limit.",
  DOWNLOAD_TOO_LARGE: "The downloaded file is too large.",
  DOWNLOAD_FAILED: "Unable to download the remote file.",
  URL_NOT_ALLOWED: "That URL isn't allowed.",
  DECK_NAME_FAILED: "Unable to work out a deck name from the file name.",
  IMAGE_RASTER_ONLY: "Only raster images (such as JPG or PNG) can be edited this way.",
  IMAGE_FORMAT_UNSUPPORTED: "This image format can't be edited in place.",
  IMAGE_SUPPORT_UNAVAILABLE: "Image editing isn't available on this server.",
  IMAGE_OP_FAILED: "Unable to edit the image.",
  SEARCH_QUERY_TOO_LONG: "The search is too long (maximum {max} characters).",
  SELECTOR_INVALID: "Invalid selector.",
  SEARCH_TEXT_TOO_SHORT: "Search text must be longer than one character to replace it.",
  REPLACE_TEXT_TOO_SHORT: "Replacement text must be empty or longer than one character.",
  REPLACE_CONFIRM_REQUIRED: "Confirm the replacement to continue.",
  REMOVE_CONFIRM_REQUIRED: "Removing the matched text needs a second confirmation.",
  SEARCH_NO_MATCHES: "The search term wasn't found in the site content.",
  STYLE_GUIDE_EXTERNAL: "The style guide comes from an external source and can't be edited in HAXcms.",
  STYLE_GUIDE_SAVED: "Style guide saved.",
  STYLE_GUIDE_SAVE_FAILED: "Unable to save the style guide.",
  SETTINGS_LOAD_FAILED: "Unable to load settings.",
  SETTINGS_SAVE_FAILED: "Unable to save settings.",
  PLATFORM_SETTINGS_MISSING: "Platform settings are missing.",
  API_KEY_MISSING: "An API key for {provider} is required.",
  PROVIDER_UNSUPPORTED: "Unsupported app store provider.",
  UPSTREAM_UNREACHABLE: "Unable to reach the provider.",
  IMPORT_EMPTY: "The import didn't find any pages.",
  IMPORT_SOURCE_INVALID: "The import source couldn't be found or read.",
  IMPORT_FETCH_FAILED: "Unable to fetch the import source.",
  IMPORT_FAILED: "The import failed.",
  EXPORT_FORMAT_UNSUPPORTED: "Export format \"{format}\" isn't supported.",
  EXPORT_FAILED: "The export failed.",
  CONVERSION_FAILED: "The conversion failed.",
  PARAM_REQUIRED: "A required value is missing: {param}.",
  INVALID_REQUEST: "Invalid request.",
  PARAM_INVALID: "Invalid value: {param}.",
});

// translations land in `t` when the language changes (i18n-manager)
export const HAXCMSApiMessages = {
  t: { ...HAXCMS_API_MESSAGES_EN },
  _i18nUpdated() {},
};

let registered = false;
function ensureRegistered() {
  if (registered || !I18NManagerStore) {
    return;
  }
  registered = true;
  I18NManagerStore.registerLocalization({
    context: HAXCMSApiMessages,
    namespace: "haxcms-api",
    localesPath: new URL("../../../locales", import.meta.url).href,
    updateCallback: "_i18nUpdated",
  });
}
ensureRegistered();
// lets packages that can't import haxcms-elements (hax-body) use it
if (typeof globalThis.haxcmsApiMessage !== "function") {
  globalThis.haxcmsApiMessage = (response, fallback) =>
    haxcmsApiMessage(response, fallback);
}

function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function textOf(holder) {
  if (typeof holder.message === "string" && holder.message.trim() !== "") {
    return holder.message.trim();
  }
  if (typeof holder.error === "string" && holder.error.trim() !== "") {
    return holder.error.trim();
  }
  return "";
}

/**
 * Find the message, code and params in a response, wherever the backend or
 * a client wrapper put them: the response itself, `data`, `__failed`, or a
 * MicroFrontendRegistry error result's `body` / `body.data`.
 * @param {*} response
 * @returns {{code: string, params: object, message: string}}
 */
export function apiMessageParts(response) {
  const found = { code: "", params: {}, message: "" };
  if (typeof response === "string") {
    found.message = response.trim();
    return found;
  }
  if (!isObject(response)) {
    return found;
  }
  const holders = [response, response.data, response.__failed];
  if (isObject(response.body)) {
    holders.push(response.body, response.body.data, response.body.__failed);
  }
  for (const holder of holders) {
    if (!isObject(holder)) {
      continue;
    }
    const message = textOf(holder);
    const code = typeof holder.code === "string" ? holder.code : "";
    if (!found.code && code) {
      found.code = code;
      found.params = isObject(holder.params) ? holder.params : {};
      if (message) {
        found.message = message;
      }
    }
    if (!found.message && message) {
      found.message = message;
    }
    if (found.code && found.message) {
      break;
    }
  }
  return found;
}

function fill(template, params) {
  let missing = false;
  const text = template.replace(/\{(\w+)\}/g, (placeholder, name) => {
    if (Object.prototype.hasOwnProperty.call(params, name)) {
      return String(params[name]);
    }
    missing = true;
    return placeholder;
  });
  return missing ? null : text;
}

/**
 * Text in the user's language for a code, or null when there is no
 * translation for it (English in use, unknown code, or a param is missing).
 * @param {string} code
 * @param {object} params
 */
export function translateApiCode(code, params = {}) {
  if (!code || !Object.prototype.hasOwnProperty.call(HAXCMSApiMessages.t, code)) {
    return null;
  }
  const template = HAXCMSApiMessages.t[code];
  if (typeof template !== "string" || template === "") {
    return null;
  }
  return fill(template, isObject(params) ? params : {});
}

/**
 * Text to show people for an API response.
 * - a translated message when the user's language has one for the code
 * - otherwise the English message the server sent (it can be more specific)
 * - otherwise the English text for the code
 * - otherwise `fallback`
 * @param {*} response API response, error envelope or message string
 * @param {string} fallback text when the response has no message
 */
export function haxcmsApiMessage(response, fallback = "") {
  const parts = apiMessageParts(response);
  if (parts.code && HAXCMS_API_MESSAGES_EN[parts.code]) {
    const translated = translateApiCode(parts.code, parts.params);
    if (translated && HAXCMSApiMessages.t[parts.code] !== HAXCMS_API_MESSAGES_EN[parts.code]) {
      return translated;
    }
    if (parts.message) {
      return parts.message;
    }
    if (translated) {
      return translated;
    }
  }
  if (parts.message) {
    return parts.message;
  }
  return fallback;
}
