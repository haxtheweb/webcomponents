/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/lrn-vocab/lrn-vocab.js";

/**
 * `glossary-term`
 * ``
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
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

  /**
   * life cycle, element is afixed to the DOM
   */
  constructor() {
    super();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(GlossaryTerm.haxProperties, GlossaryTerm.tag, this);
    // fetch definition
    if (this.serviceType === "file") {
      fetch(this.endpoint, {
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
    } else if (this.serviceType === "graphql") {
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
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(GlossaryTerm.tag, GlossaryTerm);

export { GlossaryTerm };
