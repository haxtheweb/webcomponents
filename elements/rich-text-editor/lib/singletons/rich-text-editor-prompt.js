/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextToolbarStyles } from "@haxtheweb/rich-text-editor/lib/buttons/rich-text-editor-button.js";
import "@haxtheweb/simple-popover/simple-popover.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "./rich-text-editor-highlight.js";
import { RichTextEditorRangeBehaviors } from "./rich-text-editor-range-behaviors.js";
/**
 * `rich-text-editor-prompt`
 * `A utility that manages state of multiple rich-text-prompts on one page.`
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-prompt
 */
class RichTextEditorPrompt extends RichTextEditorRangeBehaviors(LitElement) {
  static get styles() {
    return [
      ...RichTextToolbarStyles,
      css`
        #prompt {
          display: block;
          width: 300px;
          max-width: 300px;
          --simple-popover-padding: 0px;
          --simple-popover-max-height: auto;
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
          background-color: var(--rich-text-editor-button-bg);
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
        ?auto="${!this.hidden || !this.__highlight.hidden}"
        for="${this.__highlight ? this.__highlight.id : ""}"
        ?hidden="${this.hidden || this.__highlight.hidden}"
        position="bottom"
        sticky
        fit-to-visible-bounds
        position-align="center"
        .target="${this.__highlight}"
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
            <simple-toolbar-button
              id="cancel"
              controls="${this.__highlight ? this.__highlight.id : ""}"
              label="Cancel"
              icon="clear"
              @click="${this._cancel}"
            >
            </simple-toolbar-button>
            <simple-toolbar-button
              id="confirm"
              controls="${this.__highlight ? this.__highlight.id : ""}"
              @click="${this._confirm}"
              icon="check"
              label="OK"
            >
            </simple-toolbar-button>
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
    this.haxUIElement = true;
    globalThis.addEventListener(
      "rich-text-editor-prompt-open",
      this.open.bind(this),
    );
    // sets instance to current instance
    if (!globalThis.RichTextEditorPrompt.instance) {
      globalThis.RichTextEditorPrompt.instance = this;
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
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.__highlight.addEventListener("change", (e) =>
      setTimeout(this._handleChange(e), 300),
    );
    this.addEventListener("mousedown", (e) => (this.__retainFocus = true));
    this.addEventListener("mouseup", (e) => (this.__retainFocus = false));
    this.addEventListener("focusin", (e) => (this.__retainFocusIn = true));
    this.addEventListener("focusout", (e) => (this.__retainFocusIn = false));
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
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
    if (this.__retainFocus || this.__retainFocusIn) return;
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
    setTimeout(() => {
      if (this.__opened && !this.__focused && !this.__hovered) this._cancel();
    }, 500);
  }
  /**
   * opens prompt and generates for fields
   *
   * @param {event} e event that opens the prompt
   * @memberof RichTextEditorPrompt
   */
  open(e) {
    if (e && e.detail) {
      this.__opened = true;
      this.__focused = true;
      this.button = e.detail;
      this.fields = [...e.detail.fields];
      this.value = { ...e.detail.value };
      // see if we only have 1 field and 1 value coming in
      // if so, try and align them
      if (
        e.detail.fields.length === 1 &&
        Object.keys(e.detail.value).length === 1
      ) {
        if (e.detail.fields[0].attribute) {
          this.value[e.detail.fields[0].attribute] =
            e.detail.value[Object.keys(e.detail.value).pop()];
          this.value = { ...this.value };
        } else if (e.detail.fields[0].property) {
          this.value[e.detail.fields[0].property] =
            e.detail.value[Object.keys(e.detail.value).pop()];
          this.value = { ...this.value };
        }
      }
      // no fields, just apply it automatically
      if (this.fields.length === 0) {
        this._confirm(e);
      }
      if (
        this.shadowRoot.querySelector("#formfields") &&
        this.shadowRoot.querySelector("#formfields").rebuildForm
      )
        this.shadowRoot.querySelector("#formfields").rebuildForm();
      if (this.shadowRoot.querySelector("#cancel"))
        this.shadowRoot.querySelector("#cancel").focus();
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
    this.value = this.shadowRoot.querySelector("#formfields").value;
    this.button.confirm(this.value);
    setTimeout(() => {
      this.close();
    }, 10);
  }
}
customElements.define(RichTextEditorPrompt.tag, RichTextEditorPrompt);
export { RichTextEditorPrompt };

// register globally so we can make sure there is only one
globalThis.RichTextEditorPrompt = globalThis.RichTextEditorPrompt || {};
// request if this exists. This helps invoke element existing in dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through same modal
globalThis.RichTextEditorPrompt.requestAvailability = () => {
  if (!globalThis.RichTextEditorPrompt.instance) {
    globalThis.RichTextEditorPrompt.instance =
      globalThis.document.createElement("rich-text-editor-prompt");
    globalThis.document.body.appendChild(
      globalThis.RichTextEditorPrompt.instance,
    );
  }
  return globalThis.RichTextEditorPrompt.instance;
};
