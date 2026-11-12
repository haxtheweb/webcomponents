/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement } from "lit";
import { localStorageSet, localStorageGet } from "@haxtheweb/utils/utils.js";
import { UABroker } from "@haxtheweb/user-action/lib/UserActionBroker.js";
import { deviceActor } from "@haxtheweb/user-action/lib/xapi.js";

/**
 * `lrs-bridge`
 * `Forwards HAX learner statements to a learning record store.`
 *
 * Every HAX element that reports learner data fires `user-engagement`; the
 * user-action broker turns each one into an xAPI statement. Once it has an
 * endpoint, the bridge subscribes to the broker and posts every statement on
 * the page (quizzes, media, games, checklists, lrs-emitter, HAXcms page
 * visits), so there is one pipeline instead of a separate lrs-emitter path.
 * A statement without an actor gets this device's pseudonymous account.
 * @demo demo/index.html
 */
class LrsBridge extends LitElement {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      endpoint: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.endpoint = "";
    this._enableProperties = false;
    this._unsubscribe = null;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    UABroker.listen();
    if (!this._unsubscribe) {
      this._unsubscribe = UABroker.subscribe((record) =>
        this._brokerStatement(record),
      );
    }
  }

  disconnectedCallback() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrs-bridge";
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // the bridge is only enabled to record statements once it has actually
    // been configured with an endpoint to send them to
    this._enableProperties = !!this.endpoint;
  }

  /**
   * Whether a statement from the broker is sent; subclasses can narrow it
   */
  shouldRecord(statement) {
    return !!(statement && statement.verb);
  }

  _brokerStatement({ statement } = {}) {
    if (this._enableProperties && this.shouldRecord(statement)) {
      this.recordStatement(statement);
    }
  }

  recordStatement(options) {
    const query = {
      method: "POST",
      cors: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          query: `
          mutation($data: StatementCreateInput!) {
            createStatement(data: $data) {
              id
            }
          }
        `,
          variables: {
            data: {
              data: Object.assign(
                {},
                {
                  actor: deviceActor(
                    this.getUserName(),
                    globalThis.location.origin,
                  ),
                },
                options,
              ),
            },
          },
        },
        "utf8",
      ),
    };
    try {
      fetch(this.endpoint, query)
        .then((res) => res.json())
        .then((_res) => {});
    } catch {
      // intentionally empty
    }
  }

  /**
   * Get the user name from local storage
   */
  getUserName() {
    let currentName = localStorageGet("lrs-name", "");
    if (!currentName) {
      const newName = this.makeGUID();
      localStorageSet("lrs-name", newName);
      // return the freshly generated name so the very first statement
      // records a real actor instead of the stale empty value
      return newName;
    }
    return currentName;
  }

  /**
   * Create a unique id
   */
  makeGUID() {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
}
globalThis.customElements.define(LrsBridge.tag, LrsBridge);
export { LrsBridge };
