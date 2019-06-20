/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "../buttons/rich-text-editor-button-styles.js";
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
class RichTextEditorPrompt extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */ // render function
  static get template() {
    return html`
      <style include="rich-text-editor-button-styles">
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
        :host #prompt {
          display: none;
        }
        :host #prompt[for]{
          display: block;
          z-index: 2;
        }
        :host #prompt[for] #form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }
        :host #prompt paper-input {
          padding: 0;
        }
        :host #confirm, 
        :host #cancel {
          min-width: unset;
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
        :host .actions {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        :host .confirm-or-cancel {
          min-width: 40px;
        }
      </style>
      <simple-popover
        id="prompt"
        auto
        for$="[[for]]"
        style$="width: [[width]]"
      >
        <form id="form">
          <simple-fields
            id="formfields"
            autofocus
            fields="[[fields]]"
            value="{{value}}"
          ></simple-fields>
          <div class="actions">
            </iron-a11y-keys>
            <paper-button
              id="cancel"
              class="rtebutton"
              controls$="[[for]]"
              on-click="_cancel"
              tabindex="0"
            >
              <iron-icon id="icon" aria-hidden icon="clear"> </iron-icon>
              <span id="label" class="offscreen">Cancel</span>
            </paper-button>
            <paper-tooltip id="tooltip" for="cancel">Cancel</paper-tooltip>
            <paper-button
              id="confirm"
              class="rtebutton"
              controls$="[[for]]"
              on-click="_confirm"
              tabindex="0"
            >
              <iron-icon id="icon" aria-hidden icon="check"> </iron-icon>
              <span id="label" class="offscreen">OK</span>
            </paper-button>
            <paper-tooltip id="tooltip" for="confirm">OK</paper-tooltip>
          </div>
          <iron-a11y-keys
            id="a11ycancel"
            target="[[__a11ycancel]]"
            keys="enter"
            on-keys-pressed="_cancel"
          >
          <iron-a11y-keys
            id="a11yconfirm"
            target="[[__a11yconfirm]]"
            keys="enter"
            on-keys-pressed="_confirm"
          >
          </iron-a11y-keys>
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
        type: String
      },
      /**
       * The selected text.
       */
      range: {
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
      },
      /**
       * The width of the prompt
       */
      width: {
        type: String,
        value: "200px"
      },
      /**
       * The prefilled value of the prompt
       */
      __button: {
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
    if (!window.RichTextEditorPrompt.instance) {
      window.RichTextEditorPrompt.instance = this;
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
      console.log("blur", document.activeElement);
      this._cancel(e);
    });
  }

  /**
   * Loads element into array
   */
  setTarget(button) {
    this.clearTarget();
    this.set("fields", button.fields);
    this.set("value", button.value);
    this.__button = button;
    if (button.__selection) this.for = button.__selection.getAttribute("id");
  }

  /**
   * Unloads element from array
   */
  clearTarget() {
    if (!this.__button) return;
    this.for = null;
    this.set("fields", null);
    this.set("value", null);
    this.__button = null;
  }
  /**
   * Handles button tap;
   */
  _cancel(e) {
    e.preventDefault();
    if (!this.__button) return;
    this.__button.cancel();
    this.clearTarget();
  }
  /**
   * Handles button tap;
   */
  _confirm(e) {
    e.preventDefault();
    this.__button.value = this.value;
    this.__button.confirm();
    this.clearTarget();
  }
}
window.customElements.define(RichTextEditorPrompt.tag, RichTextEditorPrompt);
export { RichTextEditorPrompt };

// register globally so we can make sure there is only one
window.RichTextEditorPrompt = window.RichTextEditorPrompt || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.RichTextEditorPrompt.requestAvailability = () => {
  if (!window.RichTextEditorPrompt.instance) {
    window.RichTextEditorPrompt.instance = document.createElement(
      "rich-text-editor-prompt"
    );
    document.body.appendChild(window.RichTextEditorPrompt.instance);
  }
  return window.RichTextEditorPrompt.instance;
};
