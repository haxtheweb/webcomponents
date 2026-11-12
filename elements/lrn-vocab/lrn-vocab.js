/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, render } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-modal/simple-modal.js";
/**
`lrn-vocab`
Vocabulary term with visual treatment and semantic meaning.

Reads like vocab-term inside a sentence: a dotted underline (solid on
hover, DDD focus ring) that opens the definition in a large modal headed
by the same Vocabulary chip and label. `--lrn-vocab-border` still works: its
width, style and colour become the underline's (for example
`--lrn-vocab-border: 2px dashed red`).

* @demo demo/index.html
*/
class LrnVocab extends SchemaBehaviors(I18NMixin(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline;
          color-scheme: light dark;
        }
        /* a real button for keyboard and screen readers, without the box:
           vocab-term's dotted underline is the cue */
        button {
          all: unset;
          display: inline;
          box-sizing: border-box;
          cursor: pointer;
          color: inherit;
          font: inherit;
          text-transform: none;
          border-radius: var(--ddd-radius-xs, 4px);
          text-decoration: underline
            var(
              --lrn-vocab-border,
              dotted var(--ddd-border-size-sm, 2px)
                light-dark(
                  var(--ddd-theme-default-beaverBlue, #1e407c),
                  var(--ddd-theme-default-pughBlue, #96bee6)
                )
            );
          text-underline-offset: 0.2em;
        }
        /* an author picked DDD primary colours the underline cue */
        :host([data-primary]) button {
          text-decoration-color: var(--ddd-theme-primary);
        }
        button:hover {
          text-decoration-style: solid;
        }
        button:focus-visible {
          outline: var(--ddd-focus-ring, 2px solid #005fa9);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
      `,
    ];
  }
  constructor() {
    super();
    this.t = {
      ...this.t,
      vocabulary: "Vocabulary",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.typeof = "oer:LearningComponent";
    this.description = "";
    setTimeout(() => {
      this.addEventListener("click", this.openDialog.bind(this));
    }, 0);
  }
  render() {
    return html`<meta
        property="oer:description"
        content="${this.description}"
      /><button property="oer:name">${this.term}</button>`;
  }

  static get tag() {
    return "lrn-vocab";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      term: {
        type: String,
        reflect: true,
      },
      description: {
        type: String,
      },
    };
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this._haxstate = val;
  }
  /**
   * Vocabulary chip and label for the top of the modal (matches vocab-term)
   */
  renderLabel() {
    return html`<div
      class="vocab-label"
      style="display: flex; align-items: center; gap: var(--ddd-spacing-2, 8px); margin: 0 0 var(--ddd-spacing-3, 12px); font-family: var(--ddd-font-navigation, sans-serif); font-size: var(--ddd-font-size-4xs, 16px); font-weight: var(--ddd-font-weight-bold, 700); letter-spacing: 0.06em; text-transform: uppercase; color: light-dark(var(--ddd-theme-default-nittanyNavy, #001e44), var(--ddd-theme-default-linkLight, #cfeceb));"
    >
      <span
        aria-hidden="true"
        style="display: inline-flex; align-items: center; justify-content: center; flex: none; width: var(--ddd-icon-xxs, 24px); height: var(--ddd-icon-xxs, 24px); border-radius: 50%; background-color: light-dark(var(--ddd-theme-default-beaverBlue, #1e407c), var(--ddd-theme-default-skyBlue, #009cde)); color: light-dark(white, var(--ddd-theme-default-potentialMidnight, #000321)); --simple-icon-width: 14px; --simple-icon-height: 14px;"
        ><simple-icon-lite icon="icons:book"></simple-icon-lite
      ></span>
      <span>${this.t.vocabulary}</span>
    </div>`;
  }
  /**
   * Request the singleton dialog open
   */
  openDialog(e) {
    if (this._haxstate) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    let c = globalThis.document.createElement("div");
    // the same Vocabulary chip and label vocab-term's modal opens with; the
    // modal content is light DOM, so it carries its own styles
    const label = globalThis.document.createElement("div");
    render(this.renderLabel(), label);
    c.appendChild(label);
    for (let id in this.children) {
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
          "--simple-modal-width": "80vw",
          "--simple-modal-max-width": "80vw",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-min-height": "80vh",
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
    if (!this.description) {
      this.description = (this.textContent || "").trim();
    }
    globalThis.SimpleModal.requestAvailability();
  }
  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: true,
      // like vocab-term: an author picked primary colours the underline
      designSystem: {
        primary: true,
      },
      gizmo: {
        title: "Vocab",
        description: "Vocabulary term",
        icon: "hax:vocab",
        color: "red",
        tags: ["Instructional", "vocab", "term", "definition", "glossary"],
        handles: [
          {
            type: "inline",
            text: "term",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
          inlineOnly: true,
        },
      },
      settings: {
        inline: [
          {
            property: "term",
            title: "Term",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true,
          },
        ],
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
            title: "Definition",
            description:
              "The definitition to display when the term is clicked.",
            inputMethod: "textarea",
            required: true,
          },
          {
            property: "description",
            title: "Description (OER Schema)",
            description:
              "OER Schema: a short description of the vocabulary term. Auto-populated from the definition text if left blank.",
            inputMethod: "textfield",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["t"],
      },
      demoSchema: [
        {
          tag: "lrn-vocab",
          properties: {},
          content: "",
        },
      ],
    };
  }
}
globalThis.customElements.define(LrnVocab.tag, LrnVocab);
export { LrnVocab };
