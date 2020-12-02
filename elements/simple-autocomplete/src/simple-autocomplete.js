/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFilterMixin } from "@lrnwebcomponents/simple-filter/simple-filter.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
/**
 * `simple-autocomplete`
 * `auto complete either from an endpoint or local json array`
 * @demo demo/index.html
 * @element simple-autocomplete
 */
class SimpleAutocomplete extends SimpleFilterMixin(LitElement) {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          min-width: 10px;
        }
        :host([hidden]) {
          display: none;
        }
        #input {
          border: none;
          min-width: 10px;
          outline: none;
          padding: 0 2px;
        }
        simple-popover {
          max-width: 200px;
          padding: 0;
          --simple-popover-padding: 0px;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          text-align: left;
          padding: 4px 8px;
          border: none;
          list-style: none;
          background-color: transparent;
          border-top: 1px solid #eeeeee;
          cursor: pointer;
        }
        li:hover,
        li:active,
        li:focus {
          background-color: #eeeeee;
        }
      `,
    ];
  }
  inputChanged(e) {
    this.opened = true;
    this.value = e.target.innerText;
    this.like = e.target.innerText;
  }
  // Template return function
  render() {
    return html`
      <span
        id="input"
        name="input"
        @input="${this.inputChanged}"
        contenteditable
      ></span>
      <simple-popover
        auto
        part="simple-popover"
        ?hidden="${!this.opened}"
        position="bottom"
        for="input"
      >
        ${this.filtered.length > 0
          ? html` <ul role="listbox">
              ${this.filtered.map(
                (item, i) => html` <li
                  role="option"
                  @click="${this.itemSelect}"
                  value="${item.value}"
                  data-index="${i}"
                >
                  ${item.label}
                </li>`
              )}
            </ul>`
          : "No results"}
      </simple-popover>
    `;
  }

  constructor() {
    super();
    this.value = "";
    this.opened = false;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__input = this.shadowRoot.querySelector("#input");
    this.shadowRoot.querySelector("simple-popover").target = this.__input;
    this.__input.addEventListener("focusout", (e) => {
      console.log(e.path);
    });
  }
  itemSelect(e) {
    this.value = e.target.getAttribute("value");
    this.__input.innerText = this.value;
    this.opened = false;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflect: true,
      },
      value: {
        type: String,
      },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "simple-autocomplete";
  }

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // notify
      if (propName == "value") {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          })
        );
      }
      if (propName == "opened" && this.opened) {
        this.shadowRoot.querySelector("simple-popover").updatePosition();
      }
      if (propName == "items" && this.items.length > 0 && !this._ignore) {
        this._ignore = true;
        for (var i = 0; i < this.items.length; i++) {
          // oh... your going to enjoy this one..
          // convert ALL objcet keys into a searchable string called title
          if (!this.items[i].title) {
            this.items[i].title = Object.keys(this.items[i])
              .map((key) => {
                return this.items[i][key];
              })
              .join(" ");
          }
        }
        this._ignore = false;
      }
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
  obsKeysToString(o, k, sep) {
    return k
      .map((key) => o[key])
      .filter((v) => v)
      .join(sep);
  }
}
customElements.define(SimpleAutocomplete.tag, SimpleAutocomplete);
export { SimpleAutocomplete };
