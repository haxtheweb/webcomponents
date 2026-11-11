/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import {
  activityId,
  buildStatement,
  XAPI_ACTIVITY_TYPES,
  XAPI_EXTENSIONS,
  XAPI_VERBS,
} from "@haxtheweb/user-action/lib/xapi.js";

// free text verbs authors have typed, mapped onto the HAX verbs
const VERB_ALIASES = {
  viewed: "experienced",
  view: "experienced",
  seen: "experienced",
  read: "experienced",
  watched: "experienced",
  opened: "experienced",
  clicked: "interacted",
  click: "interacted",
  used: "interacted",
  pressed: "interacted",
  started: "attempted",
  responded: "answered",
  finished: "completed",
  done: "completed",
};

/**
 * The HAX verb (a key of XAPI_VERBS) for an authored verb: a HAX verb or its
 * IRI as is, a known alias mapped, anything else counted as interacted.
 * @param {string} verb
 * @returns {string}
 */
export function lrsEmitterVerb(verb) {
  const v = String(verb || "")
    .trim()
    .toLowerCase();
  const key = Object.keys(XAPI_VERBS).find(
    (k) => k === v || XAPI_VERBS[k] === v,
  );
  if (key) {
    return key;
  }
  return VERB_ALIASES[v] || "interacted";
}
/**
 * `lrs-emitter`
 * `Emit learning statements occuring in your app.`
 * @demo demo/index.html
 */
class LrsEmitter extends IntersectionObserverMixin(LitElement) {
  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "Lrs emitter",
        description: "Emit learning statements occuring in your app.",
        icon: "icons:android",
        color: "green",
        tags: ["Other", "lrs", "xapi", "statement", "emit", "send"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
          owner: "Penn State",
        },
      },
      settings: {
        configure: [
          {
            property: "verb",
            description:
              "experienced, interacted, answered, progressed, attempted or completed",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "lrs-emitter",
          properties: {},
          content: "",
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      verb: {
        type: String,
      },
      object: {
        type: String,
      },
      event: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.verb = "";
    this.event = "click";
    this.object = "";
  }
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (this.event == "click") {
      this.addEventListener("click", this._clickEventHandler);
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName == "elementVisible" &&
        this.elementVisible &&
        this.event == "view"
      ) {
        this._viewEventHandler();
      }
    });
    // keep exactly one click listener in sync with the event mode; adding
    // the same function reference twice is a no-op in the DOM, so repeated
    // updates can never stack duplicate listeners (one statement per click)
    if (this.event == "click") {
      this.addEventListener("click", this._clickEventHandler);
    } else {
      this.removeEventListener("click", this._clickEventHandler);
    }
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrs-emitter";
  }

  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "lrs-emitter",
      event: "user-engagement",
      verbs: [
        "experienced",
        "interacted",
        "answered",
        "progressed",
        "attempted",
        "completed",
      ],
      objectType: "http://adlnet.gov/expapi/activities/interaction",
      result: [],
      countsTowardCompletion: false,
      done: "never; records the authored verb when clicked or viewed",
    };
  }

  _clickEventHandler(_e) {
    this._emit();
  }

  _viewEventHandler() {
    this._emit();
  }

  /**
   * The xAPI statement for this emitter: the authored verb mapped onto a HAX
   * verb, and the authored object as the activity (an absolute IRI is used
   * as is, anything else names an activity on this page).
   */
  xapiStatement() {
    const name = String(this.object || "").trim();
    const isIri = /^[a-z][a-z0-9+.-]*:/i.test(name);
    return buildStatement({
      verb: lrsEmitterVerb(this.verb),
      object: {
        id: isIri ? name : activityId(this, `lrs-emitter\u0001${name}`),
        name: name || undefined,
        type: XAPI_ACTIVITY_TYPES.interactionGeneric,
      },
      context: {
        extensions: { [XAPI_EXTENSIONS.element]: LrsEmitter.tag },
      },
    });
  }

  /**
   * Announce the statement. The lrs-emitter event keeps its verb and object
   * detail for existing listeners; user-engagement carries the same data as
   * an xAPI statement so it reaches every learner data listener (the HAXcms
   * progress store, lrs-bridge) through the one HAX pipeline.
   */
  _emit() {
    const statement = this.xapiStatement();
    this.dispatchEvent(
      new CustomEvent("lrs-emitter", {
        bubbles: true,
        cancelable: true,
        detail: {
          verb: this.verb,
          object: this.object,
          statement,
        },
      }),
    );
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          activityDisplay: lrsEmitterVerb(this.verb),
          objectName: this.object,
          statement,
        },
      }),
    );
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.removeEventListener("click", this._clickEventHandler);
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}
globalThis.customElements.define(LrsEmitter.tag, LrsEmitter);
export { LrsEmitter };
