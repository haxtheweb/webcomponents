/**
 * Copyright 2018 Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "../rich-text-editor-styles.js";
import { RichTextEditorButtonStyles } from "../buttons/rich-text-editor-button-styles.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "./rich-text-editor-selection.js";
/**
 * `rich-text-editor-prompt`
 * `A utility that manages state of multiple rich-text-prompts on one page.`
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
          --simple-fields-color: var(--rich-text-editor-focus-color, #000);
          --simple-fields-invalid-color: var(
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
          width: 100%;
          padding-bottom: 3px;
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
        for="${this.for}"
        ?hidden="${this.hidden}"
        @focus="${(e) => (this.__focused = true)}"
        @blur="${(e) => (this.__focused = false)}"
        @mouseover="${(e) => (this.__hovered = true)}"
        @mouseout="${(e) => (this.__hovered = false)}"
        position="bottom"
        position-align="center"
      >
        <form id="form">
          <simple-fields
            id="formfields"
            autofocus
            hide-line-numbers
            .fields="${this.fields}"
            @fields-ready="${(e) => e.detail.focus()}"
            .value="${this.value}"
          ></simple-fields>
          <div class="actions">
            <button
              id="cancel"
              class="rtebutton"
              controls="${this.for}"
              @click="${this._cancel}"
              tabindex="0"
            >
              <simple-icon-lite id="icon" aria-hidden="true" icon="clear">
              </simple-icon-lite>
              <span id="label" class="offscreen">Cancel</span>
            </button>
            <simple-tooltip id="tooltip" for="cancel">Cancel</simple-tooltip>
            <button
              id="confirm"
              class="rtebutton"
              controls="${this.for}"
              @click="${this._confirm}"
              tabindex="0"
            >
              <simple-icon-lite id="icon" aria-hidden="true" icon="check">
              </simple-icon-lite>
              <span id="label" class="offscreen">OK</span>
            </button>
            <simple-tooltip id="tooltip" for="confirm">OK</simple-tooltip>
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
       * selected node withing range
       * /
      selectedNode: {
        type: Object
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

  get for() {
    return this.__selection && this.__opened ? this.__selection.id : "";
  }

  get hidden() {
    return !this.__opened || !this.__selection;
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.__selection = window.RichTextEditorSelection.requestAvailability();
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
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (["__focused", "__hovered", "__opened"].includes(propName))
        setTimeout(this._handleBlur.bind(this), 300);
    });
  }
  _handleBlur(e) {
    console.log(
      "handle blur",
      this.__focused,
      this.__hovered,
      !this.__focused && !this.__hovered
    );
    if (this.__opened && !this.__focused && !this.__hovered) this._cancel(e);
  }
  open(e) {
    if (e) {
      this.__selection.parentNode.insertBefore(this, this.__selection);
      this.__focused = true;
      this.__opened = true;
      this.button = e.detail;
      this.editor = this.button.editor;
      this.fields = [...e.detail.fields];
      this.value = { ...e.detail.value };
      this.shadowRoot.querySelector("#formfields").focus();
    }
  }
  close() {
    this.__opened = false;
    this.__focused = false;
    this.button = undefined;
    this.editor = undefined;
    this.fields = [];
    this.value = {};
    document.body.append(this);
  }

  /**
   * Handles cancel button
   * @param {event} e event
   * @returns {void}
   */
  _cancel(e) {
    e.preventDefault();
    this.button.cancel();
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
