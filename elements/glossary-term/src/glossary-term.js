/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `glossary-term`
 * `Glossary term that shows a popup for the answer`
 * @demo demo/index.html
 * @customElement glossary-term
 */
class GlossaryTerm extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  constructor() {
    super();
    this.name = "";
    this.definition = "";
    this.display = "";
    this.serviceType = "file";
    this.endpoint = "";
    this._fallback = true;
    import("@lrnwebcomponents/lrn-vocab/lrn-vocab.js");
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["endpoint", "serviceType"].includes(propName)) {
        this.__endpointMethodChanged(this.endpoint, this.serviceType);
      }
    });
  }
  /**
   * convention
   */
  static get tag() {
    return "glossary-term";
  }
  /**
   * Ensure end point is correct based on method requested
   */
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
}
window.customElements.define(GlossaryTerm.tag, GlossaryTerm);

export { GlossaryTerm };
