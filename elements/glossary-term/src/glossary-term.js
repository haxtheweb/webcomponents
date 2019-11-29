/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/lrn-vocab/lrn-vocab.js";

/**
 * `glossary-term`
 * @customElement glossary-term
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class GlossaryTerm extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "glossary-term";
  }

  static get observers() {
    return [
      // Observer method name, followed by a list of dependencies, in parenthesis
      "__endpointMethodChanged(endpoint, serviceType)"
    ];
  }

  __endpointMethodChanged(endpoint, serviceType) {
    // fetch definition
    if (endpoint) {
      if (serviceType === "file") {
        fetch(endpoint, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
          .then(r => r.json())
          .then(r => {
            const foundterm = r.terms.find(i => i.name === this.name);
            if (foundterm) {
              this.definition = foundterm.definition;
              this._fallback = false;
            } else {
              this._fallback = true;
            }
          });
      } else if (serviceType === "graphql") {
        fetch(this.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `{ term(name: "${this.name}") { name definition } }`
          })
        })
          .then(r => r.json())
          .then(r => {
            try {
              this.definition = r.data.term.definition;
              this._fallback = false;
            } catch (error) {}
          });
      }
    }
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(GlossaryTerm.tag, GlossaryTerm);

export { GlossaryTerm };
