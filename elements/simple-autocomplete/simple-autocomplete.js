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
          max-width: 300px;
          padding: 0;
          --simple-popover-padding: 0px;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        li {
          padding: 0;
          list-style: none;
          margin: 0;
          text-align: left;
        }
        button {
          font-size: 16px;
          line-height: 16px;
          display: block;
          padding: 4px;
          border: none;
          border-top: 1px solid #eeeeee;
          width: 100%;
          background-color: transparent;
        }
        ul li:first-child button {
          border-top: none;
        }
        button:hover,
        button:active,
        button:focus {
          background-color: #eeeeee;
          outline: 1px black solid;
          outline-offset: -1px;
        }
        .no-results {
          font-size: 16px;
          padding: 4px;
        }
        simple-icon {
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
          margin-right: 2px;
          vertical-align: middle;
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
          ? html` <ul role="listbox" @keydown="${this.a11yKeyArrows}">
              ${this.filtered.map(
                (item, i) => html` <li
                  role="option"
                  value="${item.value}"
                  data-index="${i}"
                >
                  <button
                    value="${item.value}"
                    data-index="${i}"
                    @click="${this.itemSelect}"
                  >
                    ${item.icon
                      ? html`<simple-icon
                          icon="${item.icon}"
                          contrast="4"
                        ></simple-icon>`
                      : ``}${item.label}
                  </button>
                </li>`
              )}
            </ul>`
          : html`<div class="no-results">No results</div>`}
      </simple-popover>
    `;
  }
  // on up and down keys we should skip to the next or previous
  // button that's been printed into the shadowRoot
  a11yKeyArrows(e) {
    switch (e.key) {
      case "ArrowDown":
        if (
          this.shadowRoot.activeElement.tagName === "BUTTON" &&
          this.shadowRoot.activeElement.parentNode.nextElementSibling
        ) {
          this.shadowRoot.activeElement.parentNode.nextElementSibling.children[0].focus();
        }
        break;
      case "ArrowUp":
        if (
          this.shadowRoot.activeElement.tagName === "BUTTON" &&
          this.shadowRoot.activeElement.parentNode.previousElementSibling
        ) {
          this.shadowRoot.activeElement.parentNode.previousElementSibling.children[0].focus();
        }
        break;
    }
  }

  constructor() {
    super();
    this.value = "";
    this.opened = false;
    // click trap to hide the context menu
    this.addEventListener("mousedown", (e) => {
      this._clicking = true;
    });
    this.addEventListener("mouseup", (e) => {
      this._clicking = false;
    });
    this.addEventListener("focusout", (e) => {
      if (!this._clicking) {
        this.opened = false;
      } else {
        this._clicking = false;
      }
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__input = this.shadowRoot.querySelector("#input");
    this.shadowRoot.querySelector("simple-popover").target = this.__input;
  }
  itemSelect(e) {
    this.value = e.target.parentNode.getAttribute("value");
    this.__input.innerText = this.value;
    this._clicking = false;
    this.opened = false;
    this.__input.focus();
    var range = document.createRange();
    var sel = window.getSelection();
    range.setEnd(this.__input.childNodes[0], this.__input.innerText.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
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
                return key !== "icon" ? this.items[i][key] : false;
              })
              .join(" ");
          }
          if (this.items[i].icon) {
            import("@lrnwebcomponents/simple-icon/simple-icon.js");
            import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");
          }
        }
        this._ignore = false;
      }
    });
  }
}
customElements.define(SimpleAutocomplete.tag, SimpleAutocomplete);
export { SimpleAutocomplete };
