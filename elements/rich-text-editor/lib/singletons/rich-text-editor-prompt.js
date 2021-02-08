/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextToolbarStyles } from "../buttons/rich-text-editor-button.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "./rich-text-editor-selection.js";
/**
 * `rich-text-editor-prompt`
 * `A utility that manages state of multiple rich-text-prompts on one page.`
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-prompt
 */
class RichTextEditorPrompt extends LitElement {
  static get styles() {
    return [
      ...RichTextToolbarStyles,
      css`
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
        #prompt simple-fields-field {
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
          width: calc(100% - 20px);
          padding: 0 10px 3px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .confirm-or-cancel {
          min-width: 40px;
        }
      `,
    ];
  }
  render() {
    return html`
      <simple-popover
        id="prompt"
        ?auto="${!this.hidden}"
        for="${this.selection ? this.selection.id : ""}"
        ?hidden="${this.hidden}"
        position="bottom"
        position-align="center"
        .target="${this.selection}"
      >
        <form
          id="form"
          @blur="${this._handleBlur}"
          @focus="${this._handleFocus}"
        >
          <simple-fields
            id="formfields"
            hide-line-numbers
            .fields="${this.fields}"
            @fields-ready="${this._handleReady}"
            .value="${this.value}"
          ></simple-fields>
          <div class="actions">
            <rich-text-editor-button
              id="cancel"
              controls="${this.selection ? this.selection.id : ""}"
              label="Cancel"
              icon="clear"
              @click="${this._cancel}"
              tabindex="0"
            >
            </rich-text-editor-button>
            <rich-text-editor-button
              id="confirm"
              controls="${this.selection ? this.selection.id : ""}"
              @click="${this._confirm}"
              icon="check"
              label="OK"
              tabindex="0"
            >
            </rich-text-editor-button>
          </div>
        </form>
      </simple-popover>
    `;
  }

  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-prompt";
  }

  // properties available to custom element for data binding
  static get properties() {
    return {
      /**
       * fields for prompt popover.
       */
      fields: {
        type: Array,
      },
      /**
       * selected text.
       */
      range: {
        type: Object,
      },
      /**
       * prefilled value of prompt
       */
      value: {
        type: Object,
      },
      /**
       * whether prompt has focus
       */
      __focused: {
        type: Boolean,
      },
      /**
       * whether prompt is hovered
       */
      __hovered: {
        type: Boolean,
      },
      /**
       * whether prompt isopen
       */
      __opened: {
        type: Boolean,
      },
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    window.addEventListener(
      "rich-text-editor-prompt-open",
      this.open.bind(this)
    );
    // sets instance to current instance
    if (!window.RichTextEditorPrompt.instance) {
      window.RichTextEditorPrompt.instance = this;
      return this;
    }
  }
  /**
   * hides prompt when not open
   *
   * @readonly
   * @memberof RichTextEditorPrompt
   */
  get hidden() {
    return !this.__opened;
  }
  /**
   * gets RichTextEditorSelection singleton for range management
   *
   * @readonly
   * @memberof RichTextEditorPrompt
   */
  get selection() {
    return window.RichTextEditorSelection.requestAvailability();
  }
  firstUpdated(changedProperties) {
    this.selection.addEventListener("change", (e) =>
      setTimeout(this._handleChange(e), 300)
    );
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (["__focused", "__hovered", "__opened"].includes(propName))
        setTimeout(this._handleChange.bind(this), 300);
    });
  }
  /**
   * sets focus when prompt is ready
   *
   * @param {event} e
   * @memberof RichTextEditorPrompt
   */
  _handleReady(e) {
    e.detail.focus();
  }
  /**
   * handles focus so that RichTextEditorSelection
   * can track whether prompt has focus
   *
   * @param {event} e
   * @memberof RichTextEditorPrompt
   */
  _handleFocus(e) {
    this.__focused = true;
  }
  /**
   * handles blur so that RichTextEditorSelection
   * can track whether prompt has focus
   *
   * @param {event} e
   * @memberof RichTextEditorPrompt
   */
  _handleBlur(e) {
    this.__focused = false;
  }
  /**
   * handles changes in open, focus, or hover status
   * to cancel prompt if needed
   *
   * @param {event} e
   * @memberof RichTextEditorPrompt
   */
  _handleChange(e) {
    if (this.__opened && !this.__focused && !this.__hovered) this._cancel();
  }
  /**
   * opens prompt and generates for fields
   *
   * @param {event} e event that opens the prompt
   * @memberof RichTextEditorPrompt
   */
  open(e) {
    if (e) {
      this.__opened = true;
      this.shadowRoot.querySelector("#cancel").focus();
      this.button = e.detail;
      this.fields = [...e.detail.fields];
      this.__selection = e.detail.__selection;
      this.selectedNode = e.detail.selectedNode;
      this.value = { ...e.detail.value };
    }
  }
  /**
   * closes prompt
   *
   * @memberof RichTextEditorPrompt
   */
  close() {
    this.__opened = false;
    this.__focused = false;
    this.button = undefined;
    this.fields = [];
    this.value = {};
  }

  /**
   * handles cancel button
   * @param {event} e event
   * @returns {void}
   */
  _cancel(e) {
    if (e) e.preventDefault();
    if (this.button) this.button.cancel();
    this.close();
  }
  /**
   * Handles confirm button
   * @param {event} e event
   * @returns {void}
   */
  _confirm(e) {
    e.preventDefault();
    this.button.confirm(this.value);
    this.close();
  }
}
window.customElements.define(RichTextEditorPrompt.tag, RichTextEditorPrompt);
export { RichTextEditorPrompt };

// register globally so we can make sure there is only one
window.RichTextEditorPrompt = window.RichTextEditorPrompt || {};
// request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal
window.RichTextEditorPrompt.requestAvailability = () => {
  if (!window.RichTextEditorPrompt.instance) {
    window.RichTextEditorPrompt.instance = document.createElement(
      "rich-text-editor-prompt"
    );
    document.body.appendChild(window.RichTextEditorPrompt.instance);
  }
  return window.RichTextEditorPrompt.instance;
};
