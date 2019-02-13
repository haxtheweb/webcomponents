/**
 * Copyright 2019 PSU
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/lrn-vocab/lrn-vocab.js";
/**
 * `glossary-term`
 * `Glossary element that connects to the glossary service.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class GlossaryTerm extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          margin-bottom: -3px;
        }

        :host([hidden]) {
          display: none;
        }

        lrn-vocab {
          display: inline;
        }
      </style>
      <lrn-vocab term="[[display]]">
        <div>[[definition]]</div>
      </lrn-vocab>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Glossary term",
        description: "Glossary element that connects to the glossary service.",
        icon: "icons:android",
        color: "green",
        groups: ["Term"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "heyMP",
          owner: "PSU"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "name",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      display: {
        name: "display",
        type: "String",
        value: "",
        reflectToAttribute: false,
        observer: false
      },
      name: {
        name: "name",
        type: "String",
        value: "",
        reflectToAttribute: false,
        observer: false
      },
      definition: {
        name: "definition",
        type: "String",
        value: "",
        reflectToAttribute: false,
        observer: false
      }
    };
  }

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
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(GlossaryTerm.haxProperties, GlossaryTerm.tag, this);

    fetch("http://localhost:4000", {
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
          console.log(this.definition);
        } catch (error) {}
      });
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(GlossaryTerm.tag, GlossaryTerm);

export { GlossaryTerm };
