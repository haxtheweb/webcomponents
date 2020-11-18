/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
/**
`lrn-vocab`
Vocabulary term with visual treatment and semantic meaning.

* @demo demo/index.html
*/
class LrnVocab extends SchemaBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline;
          --lrn-vocab-border: 1px dashed #ccc;
        }
        button {
          text-transform: none;
          min-width: unset;
          margin: 0;
          position: relative;
          top: 0px;
          border-radius: 0;
          border-bottom: var(--lrn-vocab-border);
          background: #f5f5f5;
          font-size: 1.1em;
          padding: 2px;
        }
        button:hover {
          background: #bbdefb;
          border-bottom: 1px dashed #2196f3;
        }
      `,
    ];
  }
  constructor() {
    super();
    setTimeout(() => {
      this.addEventListener("click", this.openDialog.bind(this));
    }, 0);
  }
  render() {
    return html` <button>${this.term}</button> `;
  }

  static get tag() {
    return "lrn-vocab";
  }
  static get properties() {
    return {
      ...super.properties,
      term: {
        type: String,
        reflect: true,
      },
    };
  }
  /**
   * Request the singleton dialog open
   */
  openDialog(e) {
    if (
      window.HaxStore &&
      window.HaxStore.instance &&
      window.HaxStore.instance.ready &&
      window.HaxStore.instance.editMode
    ) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    let c = document.createElement("div");
    for (var id in this.children) {
      if (this.children[id].cloneNode) {
        c.appendChild(this.children[id].cloneNode(true));
      }
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        title: this.term,
        elements: {
          content: c,
        },
        styles: {
          "--simple-modal-width": "50vw",
          "--simple-modal-max-width": "50vw",
          "--simple-modal-min-height": "50vh",
        },
        invokedBy: this,
      },
    });
    this.dispatchEvent(evt);
  }
  /**
   * Attached life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    window.SimpleModal.requestAvailability();
  }
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Vocab",
        description: "Vocabulary term",
        icon: "hax:vocab",
        color: "red",
        groups: ["Vocab"],
        handles: [
          {
            type: "inline",
            text: "term",
          },
        ],
        meta: {
          author: "ELMS:LN",
          inlineOnly: true,
        },
      },
      settings: {
        configure: [
          {
            property: "term",
            title: "Term",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true,
          },
          {
            slot: "",
            title: "Contents",
            description:
              "The definitition to display when the term is clicked.",
            inputMethod: "code-editor",
            required: true,
          },
        ],
        advanced: [],
      },
    };
  }
}
window.customElements.define(LrnVocab.tag, LrnVocab);
export { LrnVocab };
