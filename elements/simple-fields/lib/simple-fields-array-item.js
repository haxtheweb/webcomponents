import { LitElement, html, css } from "lit";
import { SimpleFieldsFieldsetBehaviors } from "./simple-fields-fieldset.js";
import { SimpleFieldsButtonStyles } from "./simple-fields-ui.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu-item.js";
import "@haxtheweb/responsive-utility/responsive-utility.js";
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
 * @customElement
 * @group simple-fields
 * @element simple-fields-array-item
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
 * @class SimpleFieldsArrayItem
 * @extends {SimpleFieldsFieldsetBehaviors(LitElement)}
 */
class SimpleFieldsArrayItem extends SimpleFieldsFieldsetBehaviors(LitElement) {
  static get styles() {
    return [
      super.styles,
      ...SimpleFieldsButtonStyles,
      css`
        :host {
          padding: 0;
          border-radius: var(--simple-fields-border-radius, 2px);
          display: block;
          border: none;
          transform: rotate(0deg);
          transition: all 0.5s ease;
          z-index: 1;
          position: relative;
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
          outline: 1px solid var(--simple-fields-error-color, #b40000);
          transition: border 0.5s ease;
        }
        *[aria-controls="content"][disabled] {
          cursor: not-allowed;
        }
        #drag-handle {
          flex: 0 1 auto;
          position: relative;
          overflow: visible;
        }
        :host([hide-reorder]) #drag-handle {
          display: none;
        }
        #preview {
          flex: 1 0 auto;
          margin: 0;
          margin-right: calc(0 - var(--simple-fields-margin-small, 8px) / 2);
          margin-left: calc(50px + var(--simple-fields-margin-small, 8px) / 2);
          max-width: calc(
            100% - 72px - 2 * var(--simple-fields-margin-small, 8px) / 2
          );
        }
        :host([hide-reorder]) #preview {
          margin: 0 4px;
          max-width: unset;
        }
        #heading,
        .heading-inner {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        #content {
          overflow: hidden;
          max-height: 0;
        }
        :host #content-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.75s ease;
        }
        :host([aria-expanded="true"]) #content {
          max-height: 20000vh;
          transition: max-height 0.75s ease;
        }
        :host([aria-expanded="true"]) #content-inner {
          max-height: 20000vh;
        }
        #content-inner > * {
          flex: 1 1 auto;
        }
        #copy-delete {
          display: flex;
          flex: 0 0 auto;
        }
        #copy,
        #remove {
          flex: 0 0 auto;
        }
        #expand {
          margin-left: calc(var(--simple-fields-margin-small, 8px) / 2);
        }
        #drag-handle {
          position: absolute;
          left: 2px;
          top: 2px;
          --simple-toolbar-button-white-space: normal !important;
        }
        :host([aria-expanded="true"]) #drag-handle {
          top: var(--simple-fields-margin, 16px);
          left: var(--simple-fields-margin-small, 8px);
        }
        #dropzone {
          height: 0px;
        }
        :host(.dragging) #heading {
          opacity: 0.5;
        }
        :host(.dragging) #content,
        :host(.dragging) #expand {
          display: none;
        }
        #content:hover,
        #content:focus-within,
        #content:hover #content-inner,
        #content:focus-within #content-inner {
          overflow: visible;
        }
        :host(.dragging) #preview,
        :host(.droppable) #preview {
          margin-left: calc(var(--simple-fields-margin-small, 8px) / 2);
        }
        :host(.dropzone) #dropzone {
          background-color: var(
            --simple-fields-button-focus-background-color,
            var(--simple-fields-accent-color-light, #d9eaff)
          );
          height: 80px;
        }

        :host([aria-expanded="true"]) #expand::part(icon) {
          transform: rotate(90deg);
          transition: all 0.5s ease;
        }
        ::slotted([slot="preview"]),
        ::slotted(*:first-child) {
          margin-top: 0;
        }
        ::slotted([slot="preview"]),
        ::slotted(*:last-child) {
          margin-bottom: 0;
        }
        :host(:hover),
        :host(:focus),
        :host(:focus-within) {
          z-index: 100000;
        }
        :host(.dropzone) {
          z-index: 1;
        }
        [hidden],
        :host(:first-child) #move-up-outer,
        :host(:last-child) #move-down-outer,
        :host(:first-child):last-child #drag-handle {
          display: none;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="dropzone"></div>
      <simple-toolbar-menu
        id="drag-handle"
        controls="${this.id}"
        icon="icons:reorder"
        label="Reorder this item"
        ?disabled="${this.disabled}"
        ?hidden="${this.__dropAccepts || this.__dragging || this.hideReorder}"
        part="drag"
        tooltip-direction="right"
        @mousedown="${(e) => (this.draggable = "true")}"
        @mouseup="${(e) => (this.draggable = "false")}"
      >
        <simple-toolbar-menu-item id="move-up-outer">
          <simple-toolbar-button
            id="move-up"
            align-horizontal="left"
            role="menuitem"
            icon="arrow-upward"
            show-text-label
            label="Up"
            @click="${this._moveUp}"
          >
          </simple-toolbar-button>
        </simple-toolbar-menu-item>
        <simple-toolbar-menu-item id="move-down-outer">
          <simple-toolbar-button
            align-horizontal="left"
            id="move-up"
            role="menuitem"
            icon="arrow-downward"
            show-text-label
            label="Down"
            @click="${this._moveDown}"
          >
          </simple-toolbar-button>
        </simple-toolbar-menu-item>
      </simple-toolbar-menu>
      <div id="heading" part="heading" .item="${this}">
        <div id="preview" part="preview"><slot name="preview"></slot></div>
        <simple-toolbar-button
          id="expand"
          controls="${this.id}"
          icon="more-vert"
          label="Toggle expand"
          ?disabled="${this.disabled}"
          @click="${this.toggle}"
          toggles
          ?toggled="${this.expanded}"
          part="expand"
          tooltip-direction="left"
        >
        </simple-toolbar-button>
      </div>
      <div id="content" part="content">
        <div id="content-inner" part="content-inner">
          <div><slot></slot></div>
          <div id="copy-delete">
            <simple-toolbar-button
              id="copy"
              ?hidden="${this.hideDuplicate}"
              controls="${(this.parentNode || {}).id}"
              icon="content-copy"
              label="Copy this item"
              ?disabled="${this.disabled}"
              @click="${this._handleCopy}"
              part="copy"
              tooltip-direction="left"
            >
            </simple-toolbar-button>
            <simple-toolbar-button
              id="confirm-remove"
              class="danger"
              tooltip-direction="left"
              align-horizontal="left"
              role="menuitem"
              controls="${this.id}"
              icon="delete"
              label="Remove"
              ?disabled="${this.disabled}"
              @click="${this._handleRemove}"
              part="confirm-remove"
            >
            </simple-toolbar-button>
          </div>
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
        reflect: true,
      },
      hideReorder: {
        type: Boolean,
        reflect: true,
        attribute: "hide-reorder",
      },
      hideDuplicate: {
        type: Boolean,
        reflect: true,
        attribute: "hide-duplicate",
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
        reflect: true,
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
      responsiveSize: {
        type: String,
        attribute: "responsive-size",
        reflect: true,
      },
      __dragging: {
        type: Boolean,
      },
      __dropAccepts: {
        type: Object,
      },
      __prev: {
        type: Object,
      },
      __next: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.hideReorder = false;
    this.hideDuplicate = false;
    this.disabled = false;
    this.draggable = "truest";
    this.previewBy = [];
    this.expanded = false;
    this.responsiveSize = "sm";
    this.addEventListener("dragenter", this._dragEnter);
    this.addEventListener("dragleave", this._dragLeave);
    this.addEventListener("dragover", this._dragMoving);
    this.addEventListener("dragstart", this._dragStart);
    this.addEventListener("dragend", this._dragEnd);
    this.addEventListener("drop", this._dragDrop);
  }
  /**
   * ensure we can indentify this and an element extending it as an array item
   *
   * @readonly
   * @memberof SimpleFieldsArrayItem
   */
  get isArrayItem() {
    return true;
  }

  _dragMoving(e) {
    this.__dragMoving = true;
    e.preventDefault();
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    [...this.parentNode.childNodes].forEach((item) => {
      if (item.isArrayItem) item._setDropzone(false);
    });
    this._setDragging(false);
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    let heading = this.shadowRoot.querySelector("#heading");
    e.dataTransfer.setDragImage(heading, 0, 0);

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
    this._moveBefore(e, this.__dropAccepts, this);
  }
  _moveUp(e) {
    let prev = this.previousElementSibling;
    if (!prev) return;
    this._moveBefore(e, this, prev);
  }
  _moveDown(e) {
    let next = this.nextElementSibling;
    if (!next) return;
    this._moveBefore(e, this, next.nextElementSibling);
  }
  _moveBefore(e, target, ref) {
    if (!this.parentNode.disabled && target) {
      if (ref) {
        this.parentNode.insertBefore(target, ref);
      } else {
        this.parentNode.append(target);
      }
      [...this.parentNode.childNodes].forEach((item) => {
        if (item.isArrayItem) item._setDragging(false);
      });
      this.dispatchEvent(
        new CustomEvent("reorder", {
          bubbles: true,
          cancelable: true,
          composed: false,
          detail: this.parentNode,
        }),
      );
    }
  }
  _setDragging(show = true) {
    if (!this.parentNode.disabled) this.__dragging = show;
    if (show) {
      [...this.parentNode.childNodes].forEach((item) => {
        if (item !== this && item.isArrayItem) {
          item.__dropAccepts = this;
          item.classList.add("droppable");
        }
      });
      this.classList.add("dragging");
    } else {
      [...this.parentNode.childNodes].forEach((item) => {
        if (item !== this && item.isArrayItem) {
          item.__dropAccepts = undefined;
          item.classList.remove("droppable");
        }
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
          composed: false,
          detail: this,
        }),
      );
    }, 0);
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    globalThis.ResponsiveUtility.requestAvailability();

    /**
     * needs the size of parent container to add responsive styling
     * @event responsive-element
     */
    globalThis.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: true,
          sm: 250,
          md: 500,
          lg: 1000,
          xl: 2000,
        },
      }),
    );
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "error" || propName === "expanded") {
        this.setAttribute("aria-expanded", this.error || this.expanded);
      }
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
    this.expanded = !this.expanded;
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
        composed: false,
        detail: this,
      }),
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
        composed: false,
        detail: this,
      }),
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
        composed: false,
        detail: this,
      }),
    );
    super.disconnectedCallback();
  }
}
customElements.define(SimpleFieldsArrayItem.tag, SimpleFieldsArrayItem);
export { SimpleFieldsArrayItem };
