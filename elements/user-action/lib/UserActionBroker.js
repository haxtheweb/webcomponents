import {
  activityId,
  buildStatement,
  responseText,
  statementFromEngagement,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
} from "./xapi.js";

// user-action tracks whose user-engagement events are learner records:
// seeing something (visibility) or deliberately using it (click, keypress).
// Hover, focus, mouse and key up/down events still fire for the page but
// carry no statement, so they never flood a learning record store.
export const XAPI_RECORDED_TRACKS = ["visibility", "click", "keypress"];
// how long after a user-engagement statement from an element a
// question-element-state from the same element is treated as the same check
const SAME_CHECK_MS = 2000;

/**
 * Broker user actions in a normalized way which is abstracted from xAPI
 * but yet mirrors much of that structure and data needs.
 *
 * Normalization: listen() (once per page) turns every `user-engagement`,
 * `question-element-state` and `learner-progress-import` event that reaches
 * the window into one xAPI statement (see ./xapi.js) and hands it to every
 * subscriber registered with subscribe(fn). Events that already carry
 * `detail.statement` keep it; older or third party events are converted from
 * their loose fields. A question-element-state that follows a statement from
 * the same element (the same answer check) is not sent twice.
 * Subscribers get ({ statement, element, eventName, detail, imported }).
 */
export class UserActionBroker {
  constructor() {
    this._subscribers = new Set();
    this._listening = null;
    this._lastFromElement = new WeakMap();
  }
  /**
   * Register a function called with each normalized statement. Returns a
   * function that removes it.
   */
  subscribe(fn) {
    if (typeof fn === "function") {
      this._subscribers.add(fn);
    }
    return () => this._subscribers.delete(fn);
  }
  /**
   * Start normalizing learner events that reach target (default window).
   * Safe to call more than once.
   */
  listen(target = globalThis) {
    if (this._listening || !target || !target.addEventListener) {
      return;
    }
    const controller = new AbortController();
    const opts = { signal: controller.signal };
    target.addEventListener(
      "user-engagement",
      (e) => this._handle("user-engagement", e),
      opts,
    );
    target.addEventListener(
      "question-element-state",
      (e) => this._handle("question-element-state", e),
      opts,
    );
    target.addEventListener(
      "learner-progress-import",
      (e) => this._handle("learner-progress-import", e),
      opts,
    );
    this._listening = controller;
  }
  /**
   * Stop listening (tests, teardown)
   */
  unlisten() {
    if (this._listening) {
      this._listening.abort();
      this._listening = null;
    }
  }
  _origin(e) {
    const path =
      e && typeof e.composedPath === "function" ? e.composedPath() : [];
    return path.length && path[0] && path[0].tagName ? path[0] : e && e.target;
  }
  _handle(eventName, e) {
    const element = this._origin(e);
    const statement = this.normalize(eventName, e ? e.detail : null, element);
    if (!statement) {
      return;
    }
    this._subscribers.forEach((fn) => {
      try {
        fn({
          statement,
          element,
          eventName,
          detail: e ? e.detail : null,
          imported: eventName === "learner-progress-import",
        });
      } catch (err) {
        console.warn(err);
      }
    });
  }
  /**
   * One xAPI statement for an event detail, or null when it duplicates one
   * already sent (a question-element-state for the same answer check).
   * @param {string} eventName
   * @param {Object} detail
   * @param {HTMLElement} [element]
   */
  normalize(eventName, detail, element) {
    const d = detail && typeof detail === "object" ? detail : {};
    const now = Date.now();
    if (eventName === "question-element-state") {
      const last = element ? this._lastFromElement.get(element) : null;
      if (last && now - last < SAME_CHECK_MS) {
        return null;
      }
      const max = Number(d.maxAttempts) || 0;
      const attempts = Number(d.attempts) || 0;
      return buildStatement({
        verb: "answered",
        object: {
          id: element ? activityId(element) : undefined,
          name: d.question || d.quizName,
          interactionType: "other",
        },
        result: {
          success: !!d.correct,
          completion: !!d.correct || (max > 0 && attempts >= max),
          response: responseText(d.guess),
          score: { raw: d.correct ? 1 : 0, max: 1, min: 0 },
          extensions: {
            [XAPI_EXTENSIONS.attempts]: attempts,
            [XAPI_EXTENSIONS.maxAttempts]: max,
          },
        },
        context: {
          extensions: d.tag ? { [XAPI_EXTENSIONS.element]: d.tag } : undefined,
        },
      });
    }
    if (element) {
      this._lastFromElement.set(element, now);
    }
    if (d.statement && typeof d.statement === "object" && d.statement.verb) {
      return d.statement;
    }
    // the emitter said this event is not a learner record
    if (d.xapi === false) {
      return null;
    }
    return statementFromEngagement(d, element);
  }
  /**
  /**
   * See if this is a valid event
   */
  valid(event) {
    return [
      "click",
      "hover",
      "mousedown",
      "mouseup",
      "visibility",
      "keypress",
      "keydown",
      "keyup",
      "focusin",
      "focusout",
    ].includes(event);
  }
  /**
   * Fire the action for the user engagement broker.
   */
  fire(eventName, eventType, details, context, demo = false) {
    // issues#3102 #53: copy the details into a fresh, normalized object
    // instead of mutating the incoming event/object (eventType used to be
    // written directly onto the caller's DOM event).
    const normalized = Object.assign({}, details, { eventType: eventType });
    // learner data events also carry an xAPI statement (additive); only
    // seeing or deliberately using something is recorded
    if (
      eventName === "user-engagement" &&
      context &&
      context.tagName &&
      !XAPI_RECORDED_TRACKS.includes(eventType)
    ) {
      normalized.xapi = false;
    } else if (eventName === "user-engagement" && context && context.tagName) {
      normalized.statement = buildStatement({
        verb: eventType === "visibility" ? "experienced" : "interacted",
        object: {
          id: activityId(context),
          name: context.getAttribute("title") || eventType,
          type: XAPI_ACTIVITY_TYPES.interactionGeneric,
        },
        context: {
          extensions: {
            [XAPI_EXTENSIONS.element]: context.tagName.toLowerCase(),
          },
        },
      });
    }
    context.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: normalized,
      }),
    );
    if (demo) {
      // render as text: details can carry author-controlled strings
      const pre = globalThis.document.createElement("pre");
      pre.textContent = JSON.stringify(normalized, null, 2);
      context.replaceChildren(pre);
    }
  }
}
export const UABroker = new UserActionBroker();
