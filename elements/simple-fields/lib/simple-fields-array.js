import { LitElement, html, css } from "lit";
import { SimpleFieldsFieldsetBehaviors } from "./simple-fields-fieldset.js";
import { SimpleFieldsButtonStyles } from "./simple-fields-ui.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "./simple-fields-array-item.js";
import "@haxtheweb/responsive-utility/responsive-utility.js";
/**
 * `simple-fields-array` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @customElement
 * @group simple-field
 * @extends simple-fields-fieldset
 * @element simple-fields-array
 * @class SimpleFieldsArray
 * @extends {SimpleFieldsFieldsetBehaviors(LitElement)}
 */
class SimpleFieldsArray extends SimpleFieldsFieldsetBehaviors(LitElement) {
  static get tag() {
    return "simple-fields-array";
  }
  static get styles() {
    return [
      super.styles,
      ...SimpleFieldsButtonStyles,
      css`
        :host([expanded]) #expand::part(icon) {
          transform: rotate(90deg);
          transition: all 0.5s ease;
        }
        #item-fields {
          margin: var(--simple-fields-margin-small, 8px) 0;
          clear: both;
          z-index: 3;
        }
        #top {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }
        #add {
          float: right;
        }
      `,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      count: {
        type: Number,
      },
      disableAdd: {
        type: Boolean,
        reflect: true,
        attribute: "disable-add",
      },
      hideExpand: {
        type: Boolean,
        reflect: true,
        attribute: "hide-expand",
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
      /*
       * icon when expanded
       */
      expanded: {
        type: Boolean,
        reflect: true,
      },
      responsiveSize: {
        type: String,
        attribute: "responsive-size",
        reflect: true,
      },
      __dragging: {
        type: Boolean,
      },
    };
  }
  render() {
    return html`
      <fieldset part="fieldset">${this.legend}${this.fields}</fieldset>
    `;
  }
  get fields() {
    return html`
      <div id="top" part="top">
        ${this.descriptionTemplate}
        <simple-toolbar-button
          id="expand"
          controls="item-fields"
          icon="more-vert"
          ?disabled="${this.disabled}"
          @click="${(e) => this.toggle()}"
          ?toggled="${this.expanded}"
          ?hidden="${this.hideExpand}"
          toggles
          ?show-text-label="${this.responsiveSize !== "xs"}"
          label="${this.expanded ? "Collapse All" : "Expand All"}"
          part="expand"
        >
        </simple-toolbar-button>
      </div>
      <div id="item-fields" aria-live="polite" part="items">
        <slot></slot>
        <simple-toolbar-button
          id="add"
          icon="add"
          ?disabled="${this.disabled || this.disableAdd}"
          controls="item-fields"
          @click="${(e) => this._handleAdd()}"
          part="add"
          icon="more-vert"
          ?toggled="${this.expanded}"
          toggles
          ?show-text-label="${this.responsiveSize !== "xs"}"
          label="Add Item"
        >
        </simple-toolbar-button>
      </div>
    `;
  }
  constructor() {
    super();
    this.hideExpand = false;
    this.hideReorder = false;
    this.hideDuplicate = false;
    this.count = 0;
    this.expanded = false;
    this.disableAdd = false;
    this.responsiveSize = "sm";
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
    if (super.updated) super.updated(changedProperties);

    changedProperties.forEach((oldValue, propName) => {
      if (propName === "expanded") {
        this.querySelectorAll("simple-fields-array-item").forEach((item) => {
          item.expanded = this.expanded;
        });
      }
      if (propName === "hideDuplicate") {
        this.querySelectorAll("simple-fields-array-item").forEach((item) => {
          item.hideDuplicate = this.hideDuplicate;
        });
      }
      if (propName === "hideReorder") {
        this.querySelectorAll("simple-fields-array-item").forEach((item) => {
          item.hideReorder = this.hideReorder;
        });
      }
    });
  }
  buildItem(id) {
    let item = globalThis.document.createElement("simple-fields-array-item");
    item.id = id;
    item.hideReorder = this.hideReorder;
    item.hideDuplicate = this.hideDuplicate;
    item.expanded = this.expanded;
    item.innerHTML = `
      <slot name="sort"></slot>
      <slot name="preview"></slot>
      <slot></slot>`;
    this.appendChild(item);
    item.addEventListener("remove", (e) => this._handleRemove(e));
    return item;
  }

  /**
   * Fires add event
   * @event add
   */
  _handleAdd() {
    this.dispatchEvent(
      new CustomEvent("add", {
        detail: this,
      }),
    );
  }

  /**
   * Fires add event
   * @event add
   */
  _handleRemove(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.dispatchEvent(
      new CustomEvent("remove", {
        detail: e.detail,
      }),
    );
  }
  /**
   * Collapses the content
   */
  collapse() {
    this.toggle(false);
  }

  /**
   * Expands the content
   */
  expand() {
    this.toggle(true);
  }
  /**
   * handles focus
   *
   * @memberof SimpleFieldsArray
   */
  focus(index) {
    if (this.childNodes && index) {
      if (this.childNodes.length < index) index = this.childNodes.length - 1;
      // account for delete of 1st item
      if (index == -1) {
        index = 0;
      }
      if (this.childNodes.length != 0) {
        this.childNodes[index].focus();
      }
    } else if (this.shadowRoot) {
      let id = !this.childNodes ? "add" : "expand";
      this.shadowRoot.getElementById(id).focus();
    }
  }

  /**
   * Toggles based on mode
   * @param {boolean} open whether to toggle open
   */
  toggle(open = !this.expanded) {
    this.expanded = open;
    this._handleToggle();
  }

  /**
   * Fires toggling events
   */
  _handleToggle() {
    /**
     * Fires when toggled.
     *
     * @event toggle
     */
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: this,
      }),
    );
    if (this.expanded) {
      /**
       * Fires when expanded.
       *
       * @event expand
       */
      this.dispatchEvent(
        new CustomEvent("expand", {
          detail: this,
        }),
      );
    } else {
      /**
       * Fires when collapsed.
       *
       * @event collapse
       */
      this.dispatchEvent(
        new CustomEvent("collapse", {
          detail: this,
        }),
      );
    }
  }
}
customElements.define(SimpleFieldsArray.tag, SimpleFieldsArray);
export { SimpleFieldsArray };
