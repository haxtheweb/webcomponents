/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "../buttons/extensible-toolbar-button-styles.js";
/**
 * `extensible-toolbar-prompt`
 * `A utility that manages the state of multiple rich-text-prompts on one page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class ExtensibleToolbarPrompt extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */ // render function
  static get template() {
    return html`
      <style include="extensible-toolbar-styles extensible-toolbar-button-styles">
        :host {
          --paper-input-container-focus-color: var(
            --extensible-toolbar-focus-color,
            #000
          );
          --paper-input-container-invalid-color: var(
            --extensible-toolbar-error-color,
            #800
          );
        }
        :host #prompt {
          display: none;
          width: 300px;
          max-width: 300px;
          --simple-popover-padding: 0px;
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
        :host #formfields {
          width: calc(100% - 20px);
          padding: 10px 10px 0;
        }
        :host #prompt paper-input {
          padding: 0;
        }
        :host #confirm, 
        :host #cancel {
          min-width: unset;
        }
        :host #formfields {
          overflow: visible;
        }
        :host #cancel {
          color: var(--extensible-toolbar-button-color);
          background-color: var(--extensible-toolbar-button-bg);

        }
        :host #cancel:focus,
        :host #cancel:hover {
          color: var(--extensible-toolbar-button-hover-color);
          background-color: var(--extensible-toolbar-button-hover-bg);
        }
        :host #confirm {
          color: var(--extensible-toolbar-button-color);
          background-color: var(--extensible-toolbar-button-bg);

        }
        :host #confirm:focus,
        :host #confirm:hover {
          color: var(--extensible-toolbar-button-hover-color);
          background-color: var(--extensible-toolbar-button-hover-bg);
        }
        :host .actions {
          width: 100%;
          padding-bottom: 3px;
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
      >
        <form id="form">
          <simple-fields
            id="formfields"
            autofocus
            hide-line-numbers
            fields="[[fields]]"
            value="{{value}}"
          ></simple-fields>
          <div class="actions">
            </iron-a11y-keys>
            <paper-button
              id="cancel"
              class="toolbar-button"
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
              class="toolbar-button"
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
            keys="enter space"
            on-keys-pressed="_cancel"
          >
          <iron-a11y-keys
            id="a11yconfirm"
            target="[[__a11yconfirm]]"
            keys="enter space"
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
    return "extensible-toolbar-prompt";
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
    // sets the instance to the current instance
    if (!window.ExtensibleToolbarPrompt.instance) {
      window.ExtensibleToolbarPrompt.instance = this;
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
  }

  /**
   * Associates a button and its selection data with the prompt
   * @param {object} button the button to associate with the prompt
   * @returns {void}
   */
  setTarget(button) {
    this.clearTarget();
    this.set("fields", button.__fields);
    this.set("value", button.value);
    this.__button = button;
    if (button.__selection) this.for = button.__selection.getAttribute("id");
  }

  /**
   * Disassociates the button and selection data from the prompt
   * @returns {void}
   */
  clearTarget() {
    if (!this.__button) return;
    this.for = null;
    this.set("fields", null);
    this.set("value", null);
    this.__button = null;
  }
  /**
   * Handles cancel button
   * @param {event} e the event
   * @returns {void}
   */
  _cancel(e) {
    e.preventDefault();
    if (!this.__button) return;
    this.__button.cancel();
    this.clearTarget();
  }
  /**
   * Handles the confirm button
   * @param {event} e the event
   * @returns {void}
   */
  _confirm(e) {
    e.preventDefault();
    this.__button.value = this.value;
    this.__button.confirm();
    this.clearTarget();
  }
}
window.customElements.define(
  ExtensibleToolbarPrompt.tag,
  ExtensibleToolbarPrompt
);
export { ExtensibleToolbarPrompt };

// register globally so we can make sure there is only one
window.ExtensibleToolbarPrompt = window.ExtensibleToolbarPrompt || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.ExtensibleToolbarPrompt.requestAvailability = () => {
  if (!window.ExtensibleToolbarPrompt.instance) {
    window.ExtensibleToolbarPrompt.instance = document.createElement(
      "extensible-toolbar-prompt"
    );
    document.body.appendChild(window.ExtensibleToolbarPrompt.instance);
  }
  return window.ExtensibleToolbarPrompt.instance;
};
