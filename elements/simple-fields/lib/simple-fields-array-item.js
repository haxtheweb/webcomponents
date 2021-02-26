import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset.js";
import {
  SimpleFieldsButtonStyles,
  SimpleFieldsTooltipStyles,
} from "./simple-fields-ui.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js";
/**
 * `simple-fields-array-item`
 * an accessible expand collapse
 * 
### Styling

`<simple-fields-array-item>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-fields-array-item-margin` | margin around simple-fields-array-item | 15px 0
`--simple-fields-array-item-border` | border around simple-fields-array-item | 1px solid
`--simple-fields-array-item-horizontal-padding` | horizontal padding inside simple-fields-array-item | 16px
`--simple-fields-array-item-horizontal-padding-left` | left padding inside simple-fields-array-item | `--simple-fields-array-item-horizontal-padding`
`--simple-fields-array-item-horizontal-padding-right` | right padding inside simple-fields-array-item | `--simple-fields-array-item-horizontal-padding`
`--simple-fields-array-item-vertical-padding` | vertical padding inside simple-fields-array-item | 16px
`--simple-fields-array-item-horizontal-padding-top` | top padding inside simple-fields-array-item | `--simple-fields-array-item-vertical-padding`
`--simple-fields-array-item-horizontal-padding-bottom` | bottom padding inside simple-fields-array-item | --simple-fields-array-item-vertical-padding
`--simple-fields-array-item-border-between` | border between simple-fields-array-item heading and content | --simple-fields-array-item-border
`--simple-fields-array-item-heading-font-weight` | font-weight for simple-fields-array-item heading | bold
`--simple-fields-array-item-heading-color` | text color for simple-fields-array-item heading | unset
`--simple-fields-array-item-heading-background-color` | background-color for simple-fields-array-item heading | unset
 *
 * @group simple-fields
 * @element simple-fields-array-item
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
 */
class SimpleFieldsArrayItem extends SimpleFieldsFieldset {
  static get styles() {
    return [
      ...super.styles,
      ...SimpleFieldsButtonStyles,
      css`
        :host {
          padding: 0;
          border-radius: var(--simple-fields-border-radius, 2px);
          display: block;
          border: none;
          transform: rotate(0deg);
          transition: all 0.5s ease;
        }
        :host([disabled]) {
          opacity: 0.5;
        }
        :host([aria-expanded="true"]) {
          padding: var(--simple-fields-margin, 16px)
            var(--simple-fields-margin-small, 8px);
          outline: 1px solid var(--simple-fields-border-color-light, #ccc);
          transition: all 0.5s ease;
        }
        :host([error]) {
          outline: 1px solid var(--simple-fields-error-color, #dd2c00);
          transition: border 0.5s ease;
        }
        :host(:focus-within) {
          z-index: 2;
        }
        *[aria-controls="content"][disabled] {
          cursor: not-allowed;
        }
        #drag-handle {
          flex: 0 1 auto;
        }
        #preview {
          flex: 1 0 auto;
          margin: 0;
        }
        #heading,
        .heading-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #content {
          overflow: hidden;
          max-height: 0;
        }
        :host #content-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.75s ease 0.1s;
        }
        :host([aria-expanded="true"]) #content {
          max-height: 20000vh;
          transition: max-height 0.75s ease 0.1s;
        }
        :host([aria-expanded="true"]) #content-inner {
          max-height: 20000vh;
        }
        #content-inner > * {
          flex: 1 1 auto;
        }
        #remove {
          flex: 0 0 auto;
          color: var(--simple-fields-error-color, #ac0000);
        }
        #heading {
          margin-right: calc(0 - var(--simple-fields-margin-small, 8px) / 2);
        }
        #expand {
          margin-left: calc(var(--simple-fields-margin-small, 8px) / 2);
        }
        #drag-handle {
          margin-right: calc(var(--simple-fields-margin-small, 8px) / 2);
        }
        :host(.dragging) #heading {
          border: 1px solid var(--simple-fields-border-color, #999);
          background-color: var(--simple-fields-background-color, white);
          padding: 2px;
          opacity: 0.5;
        }
        #dropzone {
          height: 0px;
          transition: heigh 0.3s 0s ease-in-out;
        }
        :host(.dropzone) #dropzone {
          background-color: var(--simple-fields-accent-color-light, #9de1ff);
          height: 80px;
          transition: heigh 0.3s 0s ease-in-out;
        }
        :host(.dragging) #content,
        :host(.dragging) #expand {
          display: none;
        }

        :host([aria-expanded="true"]) #expand::part(icon) {
          transform: rotate(90deg);
          transition: all 0.5s ease;
        }
        ::slotted(*:first-child) {
          margin-top: 0;
        }
        ::slotted(*:last-child) {
          margin-bottom: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="dropzone"></div>
      <div
        id="heading"
        part="heading"
        .item="${this}"
        draggable="${this.draggable ? "true" : "false"}"
        @dragstart="${this._dragStart}"
        @dragend="${this._dragEnd}"
      >
        <simple-toolbar-button
          id="drag-handle"
          controls="${this.id}"
          icon="icons:reorder"
          label="Reorder this item"
          ?disabled="${this.disabled}"
          part="drag"
          @mousedown="${(e) => (this.draggable = true)}"
          @mouseup="${(e) => (this.draggable = false)}"
        >
        </simple-toolbar-button>
        <div id="drag-preview">${this.__dragPreview}</div>
        <div id="preview" part="preview"><slot name="preview"></slot></div>
        <simple-toolbar-button
          id="expand"
          controls="${this.id}"
          icon="more-vert"
          label="Toggle expand"
          @click="${this.toggle}"
          toggles
          ?toggled="${this.expanded}"
          part="expand"
        >
        </simple-toolbar-button>
      </div>
      <div id="content" part="content">
        <div id="content-inner" part="content-inner">
          <div><slot></slot></div>
          <simple-toolbar-button
            id="remove"
            controls="${this.id}"
            icon="delete"
            label="Remove this item"
            ?disabled="${this.disabled}"
            @click="${(e) => this._handleRemove()}"
            part="remove"
          >
          </simple-toolbar-button>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "simple-fields-array-item";
  }

  static get properties() {
    return {
      /**
       * is disabled?
       */
      expanded: {
        type: Boolean,
      },
      /**
       * is disabled?
       */
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: "disabled",
      },
      /**
       * is disabled?
       */
      draggable: {
        type: String,
      },
      /**
       * is disabled?
       */
      preview: {
        type: Boolean,
      },
      /**
       * fields to preview by
       */
      previewBy: {
        type: Array,
        reflect: true,
        attribute: "preview-by",
      },
      __dragging: {
        type: Boolean,
      },
      __dropAccepts: {
        type: Object,
      },
      /**
       * fields to sort by
       * /
      sortBy: {
        type: Array,
        reflect: true,
        attribute: "sort-by"
      }*/
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.draggable = "truest";
    this.previewBy = [];
    this.addEventListener("dragenter", this._dragEnter);
    this.addEventListener("dragleave", this._dragLeave);
    this.addEventListener("dragover", this._dragMoving);
    this.addEventListener("drop", this._dragDrop);
  }
  _dragMoving(e) {
    this.__dragMoving = true;
    e.preventDefault();
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    let heading = normalizeEventPath(e) ? normalizeEventPath(e)[0] : undefined,
      item = heading ? heading.item : undefined;
    this._setDragging(false);
    [...this.parentNode.childNodes].forEach((item) => item._setDropzone(false));
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    this._setDragging();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  /**
   * Enter an element, meaning we've over it while dragging
   */
  _dragEnter(e) {
    this._setDropzone();
  }
  /**
   * Leaving an element while dragging.
   */
  _dragLeave(e) {
    this._setDropzone(false);
  }
  /**
   * Drop an item onto another
   */
  _dragDrop(e) {
    if (!this.parentNode.disabled && this.__dropAccepts) {
      this.parentNode.insertBefore(this.__dropAccepts, this);
      [...this.parentNode.childNodes].forEach((item) => {
        item._setDragging(false);
        item._setDragging(false);
      });
      this.dispatchEvent(
        new CustomEvent("reorder", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this.parentNode,
        })
      );
    }
  }
  _setDragging(show = true) {
    if (!this.parentNode.disabled) this.__dragging = show;
    if (show) {
      [...this.parentNode.childNodes].forEach((item) => {
        if (item !== this) item.__dropAccepts = this;
      });
      this.classList.add("dragging");
    } else {
      [...this.parentNode.childNodes].forEach((item) => {
        if (item !== this) item.__dropAccepts = undefined;
      });
      this.classList.remove("dragging");
    }
  }
  _setDropzone(show = true) {
    if (show && !this.__dragging && this.__dropAccepts) {
      this.classList.add("dropzone");
    } else {
      this.classList.remove("dropzone");
    }
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      /**
       * Fires when constructed, so that parent radio group can listen for it.
       *
       * @event add-item
       */
      this.dispatchEvent(
        new CustomEvent("added", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }, 0);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let expanded = this.getAttribute("aria-expanded");
      if (propName === "error")
        this.setAttribute("aria-expanded", this.error || expanded);
    });
  }
  get slots() {
    let slots = {};
    this.previewBy.forEach((field) => (slots[field] = "preview"));
    return slots;
  }
  /**
   * handles individual toggling
   */
  toggle() {
    if (this.getAttribute("aria-expanded") === "true") {
      this.setAttribute("aria-expanded", "false");
    } else {
      this.setAttribute("aria-expanded", "true");
    }
  }

  /**
   * Fires add event
   * @event add
   */
  _handleCopy() {
    this.dispatchEvent(
      new CustomEvent("copy", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }

  /**
   * Fires add event
   * @event add
   */
  _handleRemove() {
    this.dispatchEvent(
      new CustomEvent("remove", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }

  /**
   * Let the group know that this is gone.
   */
  disconnectedCallback() {
    /**
     * Fires when detatched, so that parent radio group will no longer listen for it.
     *
     * @event remoive-item
     */
    this.dispatchEvent(
      new CustomEvent("removed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
    super.disconnectedCallback();
  }
}
window.customElements.define(SimpleFieldsArrayItem.tag, SimpleFieldsArrayItem);
export { SimpleFieldsArrayItem };
