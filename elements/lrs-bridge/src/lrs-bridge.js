/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

export { LrsBridge };
/**
 * `lrs-bridge`
 * `LRS element that captures lrn-emitter events and forwards them to the learnig record store.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LrsBridge extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrs-bridge";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    // listen for lrs-emitter events
    this.addEventListener("lrs-emitter", this._lrsEmitterHander.bind(this));
    // establish connection to the lrs
    const pingOptions = {
      method: "POST",
      cors: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ ping }" })
    };
    try {
      fetch(this.endpoint, pingOptions)
        .then(res => res.json())
        .then(({ data: { ping } }) => {
          this._endpointConnected = true;
        });
    } catch (error) {
      console.error("error:", error);
    }
  }

  disconnectedCallback() {
    // remove lrs-emitter events
    this.removeEventListener("lrs-emitter", this._lrsEmitterHander.bind(this));
  }

  _lrsEmitterHander(e) {
    if (this._enableProperties) {
      this.recordStatement(e);
    }
  }

  recordStatement(options) {
    const pingOptions = {
      method: "POST",
      cors: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation($data: Json!) {
            createStatement(data: $data) {
              id
            }
          }
        `,
        variables: {
          data: Object.assign(
            {},
            {
              actor: {
                name: this.getUserName()
              }
            },
            options
          )
        }
      })
    };
    try {
      fetch(this.endpoint, pingOptions)
        .then(res => res.json())
        .then(res => {});
    } catch (error) {}
  }

  /**
   * Get the user name from local storage
   */
  getUserName() {
    const currentName = window.localStorage.getItem("lrs-name");
    if (!currentName) {
      const newName = this.makeGUID();
      window.localStorage.setItem("lrs-name", newName);
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
window.customElements.define(LrsBridge.tag, LrsBridge);
