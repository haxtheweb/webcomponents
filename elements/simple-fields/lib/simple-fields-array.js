import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "./simple-fields-array-item.js";
/**
 * `simple-fields-array` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 * 
 * @group simple-fields
 * @customElement simple-fields-array
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
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
          padding: 0 10px;
        }
        #item-fields {
          clear: both;
          margin: 10px 0;
          z-index: 3;
        }
        #top {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }
        #description {
          flex: 1 1 auto;
          padding: 8px 0;
          margin-right: 16px;
          min-height: 24px;
        }
        #add {
          float: right;
        }
        paper-button {
          padding: 8px;
          z-index: 1;
          margin: 0;
          text-transform: unset;
        }
        .expanded {
          transform: rotate(-180deg);
          transition: transform 0.5s ease;
        }
        .collapsed {
          transform: rotate(0deg);
          transition: transform 0.5s ease;
        }
      `
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      count: {
        type: Number
      },
      /*
       * icon when expanded
       */
      expanded: {
        type: Boolean
      }
    };
  }
  render() {
    return html`
      <fieldset>
        ${this.legend}${this.fields}
      </fieldset>
    `;
  }
  get fields() {
    return html`
      <div id="top">
        ${this.desc}
        <paper-button
          id="expand"
          controls="item-fields"
          @click="${e => this.toggle()}"
        >
          ${this.expanded ? "Collapse All" : "Expand All"}
          <iron-icon
            class="${this.expanded ? "expanded" : "collapsed"}"
            aria-hidden="true"
            icon="expand-more"
          ></iron-icon>
        </paper-button>
      </div>
      <div id="item-fields" aria-live="polite">
        <slot></slot>
        <paper-button
          id="add"
          controls="item-fields"
          @click="${e => this._handleAdd()}"
        >
          Add Item
          <iron-icon aria-hidden="true" icon="add"></iron-icon>
        </paper-button>
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
        this.querySelectorAll("simple-fields-array-item").forEach(item =>
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
    item.addEventListener("remove", e => this._handleRemove(e));
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
        detail: this
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
        detail: e.detail
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
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
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
          detail: this
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
          detail: this
        })
      );
    }
  }
}
window.customElements.define(SimpleFieldsArray.tag, SimpleFieldsArray);
export { SimpleFieldsArray };
