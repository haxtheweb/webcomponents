/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";
import { localStorageSet, localStorageGet } from "@haxtheweb/utils/utils.js";

/**
 * `lrs-bridge`
 * `LRS element that captures lrn-emitter events and forwards them to the learnig record store.`
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
    this.addEventListener("lrs-emitter", this._lrsEmitterHander.bind(this));
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

  _lrsEmitterHander(e) {
    if (this._enableProperties && e.detail) {
      // read the detail fields explicitly; passing the raw CustomEvent into
      // recordStatement would drop verb/object since those live on the
      // event prototype as getters, not own enumerable properties
      this.recordStatement(e.detail);
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
                  actor: {
                    name: this.getUserName(),
                  },
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
        .then((res) => {});
    } catch (error) {}
  }

  /**
   * Get the user name from local storage
   */
  getUserName() {
    var currentName = localStorageGet("lrs-name", "");
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
