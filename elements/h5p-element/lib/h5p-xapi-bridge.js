/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Bridge from H5P's own xAPI events to HAX learner data.
 *
 * H5P content reports through H5P.externalDispatcher inside its iframe, and
 * it reports a lot: an interacted statement for nearly every click, one
 * statement per sub-question of a question set or interactive video, and
 * progressed / passed / failed alongside the final result. Forwarding all
 * of that would flood a learning record store, so only a few statements per
 * activity pass:
 *   - the top level content only (sub-content statements are dropped; the
 *     top level result already sums them up)
 *   - attempted (once per visit), answered and completed; every other verb
 *     is dropped (pass and fail are already result.success)
 *   - the same verb with the same result is not repeated within a second
 *   - at most H5P_XAPI_MAX_PER_MINUTE statements per activity per minute
 * Each one is rebuilt as a HAX statement about the h5p-element itself (HAX
 * activity id, educational record context, actor provider) and announced on
 * user-engagement like every other HAX element.
 */
import {
  activityId,
  buildStatement,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "@haxtheweb/user-action/lib/xapi.js";

/** H5P verbs that are forwarded; everything else is dropped */
export const H5P_XAPI_VERBS = ["attempted", "answered", "completed"];
/** safety cap per activity, whatever the content sends */
export const H5P_XAPI_MAX_PER_MINUTE = 10;
// the same verb and result inside this window is a repeat
const REPEAT_MS = 1000;

const textOf = (map) => {
  if (!map || typeof map !== "object") {
    return map == null ? "" : String(map);
  }
  const lang = (globalThis.document && globalThis.document.documentElement
    ? globalThis.document.documentElement.lang
    : "") || "";
  if (lang && map[lang]) {
    return String(map[lang]);
  }
  const first = Object.keys(map)[0];
  return first ? String(map[first]) : "";
};

/**
 * The HAX verb of an H5P statement (the last part of its verb IRI)
 * @param {Object} statement
 * @returns {string}
 */
export function h5pVerb(statement) {
  const id = String((statement && statement.verb && statement.verb.id) || "");
  return id.split("/").pop().toLowerCase();
}

/**
 * Whether an H5P statement is about a part of the content (a question in a
 * question set, an interaction in an interactive video)
 * @param {Object} statement
 * @returns {boolean}
 */
export function isH5PSubContent(statement) {
  const obj = (statement && statement.object) || {};
  if (/[?&]subContentId=/.test(String(obj.id || ""))) {
    return true;
  }
  const ctx = (statement && statement.context) || {};
  const ca = ctx.contextActivities || {};
  return Array.isArray(ca.parent) && ca.parent.length > 0;
}

/**
 * Rebuild an H5P statement as a HAX statement about an h5p-element, or null
 * when it is not one HAX forwards.
 * @param {HTMLElement} element the h5p-element
 * @param {Object} statement the statement H5P sent
 * @returns {Object|null}
 */
export function h5pStatement(element, statement) {
  if (!statement || typeof statement !== "object") {
    return null;
  }
  const verb = h5pVerb(statement);
  if (!H5P_XAPI_VERBS.includes(verb) || isH5PSubContent(statement)) {
    return null;
  }
  const def = (statement.object && statement.object.definition) || {};
  const name =
    textOf(def.name) ||
    (element.getAttribute && element.getAttribute("title")) ||
    "H5P";
  const object = {
    id: activityId(element, element.source || element.contentId || ""),
    name: name.slice(0, 120),
    type: XAPI_ACTIVITY_TYPES.interactionGeneric,
  };
  if (def.interactionType) {
    object.interactionType = def.interactionType;
    [
      "correctResponsesPattern",
      "choices",
      "scale",
      "source",
      "target",
      "steps",
    ].forEach((k) => {
      if (Array.isArray(def[k])) {
        object[k] = def[k];
      }
    });
  }
  const r = statement.result || {};
  const result = {};
  ["success", "completion"].forEach((k) => {
    if (typeof r[k] === "boolean") {
      result[k] = r[k];
    }
  });
  if (r.response != null) {
    result.response = r.response;
  }
  if (r.score && typeof r.score === "object") {
    result.score = { ...r.score };
  }
  if (typeof r.duration === "string") {
    result.duration = r.duration;
  }
  if (verb === "completed") {
    result.completion = true;
  }
  return buildStatement({
    verb,
    object,
    result: Object.keys(result).length ? result : undefined,
    context: {
      extensions: { [XAPI_EXTENSIONS.element]: "h5p-element" },
    },
  });
}

/**
 * Listens to one h5p-element's H5P content and announces the statements
 * that pass the filter.
 */
export class H5PXapiBridge {
  /**
   * @param {HTMLElement} element the h5p-element that announces statements
   */
  constructor(element) {
    this.element = element;
    this._attempted = false;
    this._recent = [];
    this._last = null;
    this._detach = null;
    this._handler = (event) => {
      const data = event && event.data;
      this.receive(data && data.statement);
    };
  }

  /**
   * Start listening to the H5P dispatcher in a content frame (or a window
   * that has H5P on it). Listens to one dispatcher at a time.
   * @param {Window} win
   * @returns {boolean} whether a dispatcher was found
   */
  attach(win) {
    this.detach();
    let dispatcher = null;
    try {
      dispatcher =
        win && win.H5P && win.H5P.externalDispatcher
          ? win.H5P.externalDispatcher
          : null;
    } catch {
      // a cross origin frame: nothing to listen to
      dispatcher = null;
    }
    if (!dispatcher || typeof dispatcher.on !== "function") {
      return false;
    }
    // one listener per attach; detaching turns it off. H5P's off() checks
    // "instanceof Function", which is false for a function from this page
    // inside the content frame, so it cannot always remove it.
    const listener = { active: true };
    const fn = (event) => {
      if (listener.active) {
        this._handler(event);
      }
    };
    dispatcher.on("xAPI", fn);
    this._detach = () => {
      listener.active = false;
      try {
        dispatcher.off("xAPI", fn);
      } catch {
        // the inactive listener goes away with the frame
      }
    };
    return true;
  }

  /**
   * Find the content frame inside a container and listen to it, retrying
   * while H5P is still starting.
   * @param {HTMLElement} container
   * @param {Object} [opts] tries (default 25), every (ms, default 200)
   * @returns {Promise<boolean>}
   */
  attachTo(container, { tries = 25, every = 200 } = {}) {
    const token = (this._token = (this._token || 0) + 1);
    return new Promise((resolve) => {
      const attempt = (left) => {
        if (token !== this._token) {
          resolve(false);
          return;
        }
        const frame = container && container.querySelector("iframe");
        if (frame && this.attach(frame.contentWindow)) {
          resolve(true);
          return;
        }
        if (left <= 0) {
          resolve(false);
          return;
        }
        setTimeout(() => attempt(left - 1), every);
      };
      attempt(tries);
    });
  }

  detach() {
    this._token = (this._token || 0) + 1;
    if (this._detach) {
      this._detach();
      this._detach = null;
    }
  }

  /**
   * One statement from H5P: filter it and, when it passes, announce it.
   * @param {Object} statement
   * @returns {Object|null} the HAX statement announced, or null
   */
  receive(statement) {
    const built = h5pStatement(this.element, statement);
    if (!built) {
      return null;
    }
    const verb = h5pVerb(built);
    if (verb === "attempted") {
      if (this._attempted) {
        return null;
      }
      this._attempted = true;
    }
    const now = Date.now();
    const key = `${verb}\u0001${JSON.stringify(built.result || {})}`;
    if (this._last && this._last.key === key && now - this._last.at < REPEAT_MS) {
      return null;
    }
    this._recent = this._recent.filter((t) => now - t < 60000);
    if (this._recent.length >= H5P_XAPI_MAX_PER_MINUTE) {
      return null;
    }
    this._recent.push(now);
    this._last = { key, at: now };
    const result = built.result || {};
    const detail = {
      activityDisplay: verb,
      objectName: textOf(built.object.definition.name),
      statement: built,
    };
    if (typeof result.success === "boolean") {
      detail.resultSuccess = result.success;
    }
    if (typeof result.completion === "boolean") {
      detail.resultCompletion = result.completion;
    }
    this.element.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail,
      }),
    );
    return built;
  }
}
