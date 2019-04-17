/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import "./rich-text-editor-styles.js";

// register globally so we can make sure there is only one
window.RichTextPromptStateManager = window.RichTextPromptStateManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.RichTextPromptStateManager.requestAvailability = () => {
  if (!window.RichTextPromptStateManager.instance) {
    window.RichTextPromptStateManager.instance = document.createElement(
      "rich-text-prompt-state-manager"
    );
    document.body.appendChild(window.RichTextPromptStateManager.instance);
  }
  return window.RichTextPromptStateManager.instance;
};
/**
 * `rich-text-prompt-state-manager`
 * `A utility that manages the state of multiple rich-text-prompts on one page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextPromptStateManager extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */ // render function
  static get template() {
    return html`
      <style include="rich-text-editor-styles">
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
      <simple-popover id="prompt" hidden$="[[!target]]" for$="[[for]]" auto>
        <form id="form">
          <simple-fields
            id="formfields"
            fields="[[fields]]"
            initial-value="{{value}}"
          ></simple-fields>
          <div class="actions">
            <iron-a11y-keys
              id="a11ycancel"
              target="[[__a11ycancel]]"
              keys="enter"
              on-keys-pressed="_buttonTap"
            >
            </iron-a11y-keys>
            <paper-button
              id="cancel"
              class="rtebutton"
              controls="[[__targetId]]"
              on-tap="_buttonTap"
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
              on-keys-pressed="_buttonTap"
            >
            </iron-a11y-keys>
            <paper-button
              id="confirm"
              class="rtebutton"
              controls="[[__targetId]]"
              on-tap="_buttonTap"
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
    return "rich-text-prompt-state-manager";
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
       * Is the  target selection for the prompt.
       */
      target: {
        type: Object,
        value: null
      },
      /**
       * fields for the prompt popover.
       */
      fields: {
        type: Array,
        value: []
      },
      /**
       * The prefilled value of the prompt
       */
      value: {
        type: Object,
        value: {}
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
    if (!window.RichTextPromptStateManager.instance) {
      window.RichTextPromptStateManager.instance = this;
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
   * Loads element into array
   */
  setTarget(el) {
    let sel = el.selection,
      fields = el.fields.slice();
    //this.clearTarget();
    this.__targetId = "prompt" + Date.now();
    this.target = document.createElement("span");
    this.target.setAttribute("id", this.__targetId);
    this.target.appendChild(sel.extractContents());
    el.selection.insertNode(this.target);
    console.log("set target", this.target.innerHTML);
    this.set("value", el.value);
    if (el.selectionField !== null) {
      fields.unshift(el.selectionField);
      this.value[el.selectionField.property] = this.target.innerHTML;
    }
    this.set("fields", fields);
    console.log("set target done", this.fields, fields, el.fields);
    this.for = this.__targetId;
  }

  /**
   * Unloads element from array
   */
  clearTarget() {
    if (!this.target) return;
    this.for = null;
    let parent = this.target.parentNode;
    parent.insertBefore(this.target.firstChild, this.target);
    parent.removeChild(this.target);
    this.set("fields", []);
    this.target = null;
  }
  /**
   * Handles button tap;
   */
  _buttonTap(e) {
    e.preventDefault();
    console.log("button tap", e);
  }
}
window.customElements.define(
  RichTextPromptStateManager.tag,
  RichTextPromptStateManager
);
export { RichTextPromptStateManager };
