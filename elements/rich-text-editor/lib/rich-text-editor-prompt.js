/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "./rich-text-editor-toolbar-styles.js";

// register globally so we can make sure there is only one
window.richTextEditorPrompt = window.richTextEditorPrompt || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.richTextEditorPrompt.requestAvailability = () => {
  if (!window.richTextEditorPrompt.instance) {
    window.richTextEditorPrompt.instance = document.createElement(
      "rich-text-editor-prompt"
    );
    document.body.appendChild(window.richTextEditorPrompt.instance);
  }
  return window.richTextEditorPrompt.instance;
};
/**
 * `rich-text-editor-prompt`
 * `A utility that manages the state of multiple rich-text-prompts on one page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class richTextEditorPrompt extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */ // render function
  static get template() {
    return html`
      <style include="rich-text-editor-toolbar-styles">
        :host {
          --simple-popover-padding: 0 10px;
          --paper-input-container-focus-color: var(
            --rich-text-editor-focus-color,
            #000
          );
          --paper-input-container-invalid-color: var(
            --rich-text-editor-error-color,
            #800
          );
        }
        :host .actions {
          text-align: right;
        }
        :host #cancel.rtebutton:focus,
        :host #cancel.rtebutton:hover {
          color: var(
            --rich-text-editor-cancel-color,
            var(--rich-text-editor-error-color)
          );
          background-color: var(
            --rich-text-editor-cancel-hover-color,
            var(--rich-text-editor-button-hover-bg)
          );
        }
        :host #confirm.rtebutton:focus,
        :host #confirm.rtebutton:hover {
          color: var(
            --rich-text-editor-confirm-color,
            var(--rich-text-editor-focus-color)
          );
          background-color: var(
            --rich-text-editor-confirm-hover-color,
            var(--rich-text-editor-button-hover-bg)
          );
        }
      </style>
      <simple-popover id="prompt" auto for$="[[for]]" hidden$="[[!for]]">
        <form id="form">
          <simple-fields
            id="formfields"
            autofocus
            fields="[[fields]]"
            value="{{value}}"
          ></simple-fields>
          <div class="actions">
            <iron-a11y-keys
              id="a11ycancel"
              target="[[__a11ycancel]]"
              keys="enter"
              on-keys-pressed="_cancel"
            >
            </iron-a11y-keys>
            <paper-button
              id="cancel"
              class="rtebutton"
              controls="[[__targetId]]"
              on-tap="_cancel"
              tabindex="0"
            >
              <iron-icon id="icon" aria-hidden icon="clear"> </iron-icon>
              <span id="label" class="offscreen">Cancel</span>
            </paper-button>
            <paper-tooltip id="tooltip" for="cancel">Cancel</paper-tooltip>
            <iron-a11y-keys
              id="a11yconfirm"
              target="[[__a11yconfirm]]"
              keys="enter"
              on-keys-pressed="_confirm"
            >
            </iron-a11y-keys>
            <paper-button
              id="confirm"
              class="rtebutton"
              controls="[[__targetId]]"
              on-tap="_confirm"
              tabindex="0"
            >
              <iron-icon id="icon" aria-hidden icon="check"> </iron-icon>
              <span id="label" class="offscreen">OK</span>
            </paper-button>
            <paper-tooltip id="tooltip" for="confirm">OK</paper-tooltip>
          </div>
        </form>
      </simple-popover>
    `;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-prompt";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Is the  target id.
       */
      for: {
        type: String,
        value: null
      },
      /**
       * The selected text.
       */
      selection: {
        type: Object,
        value: null
      },
      /**
       * fields for the prompt popover.
       */
      fields: {
        type: Array,
        value: null
      },
      /**
       * The prefilled value of the prompt
       */
      value: {
        type: Object,
        value: null
      }
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    let root = this;

    // sets the instance to the current instance
    if (!window.richTextEditorPrompt.instance) {
      window.richTextEditorPrompt.instance = this;
      return this;
    }
  }

  /**
   * life cycle, element is afixed to the DOM
   * Makes sure there is a utility ready and listening for elements.
   */
  connectedCallback() {
    super.connectedCallback();
    this.__a11yconfirm = this.$.confirm;
    this.__a11ycancel = this.$.cancel;
    this.addEventListener("blur", e => {
      //this._cancel(e);
    });
    this.addEventListener("mouseout", e => {
      //this._cancel(e);
    });
  }

  /**
   * Loads element into array
   */
  setTarget(el) {
    this.clearTarget();
    let fields = el.fields,
      vals = el.value;
    this.set("fields", fields);
    this.set("value", vals);
    this.__el = el;
    this.for = el.selectedText.getAttribute("id");
  }

  /**
   * Unloads element from array
   */
  clearTarget() {
    if (!this.for) return;
    this.for = null;
    this.set("fields", null);
    this.set("value", null);
    this.__selection = null;
    this.__el = null;
  }
  /**
   * Handles button tap;
   */
  _cancel(e) {
    e.preventDefault();
    this.__el.deselectText();
    this.clearTarget();
  }
  /**
   * Handles button tap;
   */
  _confirm(e) {
    e.preventDefault();
    this.__el.value = this.value;
    this.__el.updateSelection();
    this.clearTarget();
  }
}
window.customElements.define(richTextEditorPrompt.tag, richTextEditorPrompt);
export { richTextEditorPrompt };
