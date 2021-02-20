import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "./simple-fields-array-item.js";
/**
 * `simple-fields-array` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @extends simple-fields-fieldset
 * @element simple-fields-array
 */
class SimpleFieldsArray extends SimpleFieldsFieldset {
  static get tag() {
    return "simple-fields-array";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        fieldset {
          padding: 0 var(--simple-fields-margin-small, 8px)
            var(--simple-fields-margin-small, 8px);
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
        #description {
          flex: 1 1 auto;
          padding: var(--simple-fields-margin-small, 2px) 0;
          margin-right: var(--simple-fields-margin, 8px);
          min-height: 24px;
        }
        #add {
          float: right;
        }
        button {
          color: var(---simple-fields-color);
          background-color: var(---simple-fields-background-color);
          font-family: var(--simple-fields-detail-font-family, sans-serif);
          font-size: var(--simple-fields-detail-font-size, 12px);
          line-height: var(--simple-fields-detail-line-height, 22px);
          margin: 0 2px;
          z-index: 1;
          text-transform: unset;
          border-width: 1px;
          border-color: transparent;
          border-radius: 3px;
          display: flex;
          align-items: center;
        }
        button[aria-pressed="true"],
        button:focus,
        button:hover {
          border: 1px solid var(--simple-fields-border-color, #999);
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
      /*
       * icon when expanded
       */
      expanded: {
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
        ${this.desc}
        <button
          id="expand"
          controls="item-fields"
          @click="${(e) => this.toggle()}"
          aria-pressed="${this.expanded ? "true" : "false"}"
          part="expand"
        >
          ${this.expanded ? "Collapse All" : "Expand All"}
          <simple-icon
            class="${this.expanded ? "expanded" : "collapsed"}"
            aria-hidden="true"
            icon="more-vert"
            part="expand-icon"
          ></simple-icon>
        </button>
      </div>
      <div id="item-fields" aria-live="polite" part="items">
        <slot></slot>
        <button
          id="add"
          controls="item-fields"
          @click="${(e) => this._handleAdd()}"
          part="add"
        >
          Add Item
          <simple-icon
            aria-hidden="true"
            icon="add"
            part="add-icon"
          ></simple-icon>
        </button>
      </div>
    `;
  }
  constructor() {
    super();
    this.count = 0;
    this.expanded = false;
    this.disableAdd = false;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "expanded")
        this.querySelectorAll("simple-fields-array-item").forEach((item) =>
          item.setAttribute("aria-expanded", this.expanded)
        );
    });
  }
  buildItem(id) {
    let item = document.createElement("simple-fields-array-item");
    item.id = id;
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
  _handleRemove(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.dispatchEvent(
      new CustomEvent("remove", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: e.detail,
      })
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
      })
    );
    if (this.expanded) {
      /**
       * Fires when expanded.
       *
       * @event expand
       */
      this.dispatchEvent(
        new CustomEvent("expand", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    } else {
      /**
       * Fires when collapsed.
       *
       * @event collapse
       */
      this.dispatchEvent(
        new CustomEvent("collapse", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }
  }
}
window.customElements.define(SimpleFieldsArray.tag, SimpleFieldsArray);
export { SimpleFieldsArray };
