/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "../rich-text-editor-styles.js";
import { RichTextEditorButtonStyles } from "../buttons/rich-text-editor-button-styles.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
/**
 * `rich-text-editor-prompt`
 * `A utility that manages the state of multiple rich-text-prompts on one page.`
 *
 * @element rich-text-editor-prompt
 */
class RichTextEditorPrompt extends RichTextEditorButtonStyles(
  RichTextEditorStyles(LitElement)
) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --paper-input-container-focus-color: var(
            --rich-text-editor-focus-color,
            #000
          );
          --paper-input-container-invalid-color: var(
            --rich-text-editor-error-color,
            #800
          );
        }
        #prompt {
          display: block;
          width: 300px;
          max-width: 300px;
          --simple-popover-padding: 0px;
          z-index: 2;
        }
        #prompt[hidden] {
          display: none;
        }
        #prompt #form {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }
        #formfields {
          width: calc(100% - 20px);
          padding: 10px 10px 0;
          overflow: visible;
        }
        #prompt paper-input {
          padding: 0;
        }
        #confirm,
        #cancel {
          min-width: unset;
        }
        #cancel {
          color: var(--rich-text-editor-button-color);
          background-color: var(--rich-text-editor-button-bg);
        }
        #cancel:focus,
        #cancel:hover {
          color: var(--rich-text-editor-button-hover-color);
          background-color: var(--rich-text-editor-button-hover-bg);
        }
        #confirm {
          color: var(--rich-text-editor-button-color);
          background-color: var(--rich-text-editor-button-bg);
        }
        #confirm:focus,
        #confirm:hover {
          color: var(--rich-text-editor-button-hover-color);
          background-color: var(--rich-text-editor-button-hover-bg);
        }
        .actions {
          width: 100%;
          padding-bottom: 3px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .confirm-or-cancel {
          min-width: 40px;
        }
      `
    ];
  }
  render() {
    return html`
      <simple-popover id="prompt" auto for="${this.for}" ?hidden="${!this.for}">
        <form id="form">
          <simple-fields
            id="formfields"
            autofocus
            hide-line-numbers
            .fields="${this.fields}"
            .value="${this.value}"
          ></simple-fields>
          <div class="actions">
            <paper-button
              id="cancel"
              class="rtebutton"
              controls="${this.for}"
              @click="${this._cancel}"
              tabindex="0"
            >
              <iron-icon id="icon" aria-hidden="true" icon="clear"> </iron-icon>
              <span id="label" class="offscreen">Cancel</span>
            </paper-button>
            <simple-tooltip id="tooltip" for="cancel">Cancel</simple-tooltip>
            <paper-button
              id="confirm"
              class="rtebutton"
              controls="${this.for}"
              @click="${this._confirm}"
              tabindex="0"
            >
              <iron-icon id="icon" aria-hidden="true" icon="check"> </iron-icon>
              <span id="label" class="offscreen">OK</span>
            </paper-button>
            <simple-tooltip id="tooltip" for="confirm">OK</simple-tooltip>
          </div>
        </form>
      </simple-popover>
    `;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
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
        type: Object
      },
      /**
       * fields for the prompt popover.
       */
      fields: {
        type: Array
      },
      /**
       * The prefilled value of the prompt
       */
      value: {
        type: Object
      },
      /**
       * The prefilled value of the prompt
       */
      __button: {
        type: Object
      }
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();

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
    /*this.__a11yconfirm = this.shadowRoot.querySelector("#confirm");
    this.__a11ycancel = this.shadowRoot.querySelector("#cancel");
    
    TODO blur  doesnt work with select dropdowns
     this.addEventListener("blur", e => {
      console.log("blur", document.activeElement);
      this._cancel(e);
    });*/
  }

  /**
   * Associates a button and its selection data with the prompt
   * @param {object} button the button to associate with the prompt
   * @returns {void}
   */
  setTarget(button) {
    this.clearTarget();
    this.fields = button.__promptFields;
    this.value = button.value;
    this.__button = button;
    if (button.__selection) this.for = button.__selection.getAttribute("id");
  }

  /**
   * Disassociates the button and selection data from the prompt
   * @returns {void}
   */
  clearTarget() {
    console.log('clearTarget',this.value,this.fields);
    if (!this.__button) return;
    this.for = undefined;
    this.fields = undefined;
    this.value = undefined;
    this.__button = undefined;
  }
  /**
   * Handles cancel button
   * @param {event} e the event
   * @returns {void}
   */
  _cancel(e) {
    console.log('_confirm',e,this.__button);
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
    console.log('_confirm',e,this.value,this.__button);
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
