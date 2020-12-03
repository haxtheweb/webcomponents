/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFilterMixin } from "@lrnwebcomponents/simple-filter/simple-filter.js";
import { getRange } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";

/**
 * `simple-autocomplete`
 * `auto complete either from an endpoint or local json array`
 * @demo demo/index.html
 * @element simple-autocomplete
 */
class SimpleAutocomplete extends SimpleFilterMixin(LitElement) {
  /**
   * LitElement convention
   */
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
          max-width: var(--simple-autocomplete-popover-max-width, 50vw);
          padding: 0;
          --simple-popover-padding: 0px;
          --simple-popover-border: none;
          --simple-popover-border-color: #eeeeee;
          --simple-popover-border-radius: 0;
        }
        ul {
          margin: 0;
          padding: 0;
          border: var(--simple-autocomplete-ul-border, 1px solid #eeeeee);
        }
        li {
          list-style: none;
          padding: 0;
          margin: 0;
          display: block;
        }
        button {
          font-size: var(--simple-autocomplete-font-size, 14px);
          line-height: var(--simple-autocomplete-line-height, 1.5);
          display: block;
          border: none;
          border-bottom: var(
            --simple-autocomplete-border-bottom,
            1px solid #eeeeee
          );
          padding: 6px 12px;
          font-weight: 500;
          width: 100%;
          background-color: transparent;
          max-height: var(
            --simple-autocomplete-max-height,
            54px
          ); /* font * line-height * 2 + padding */
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: left;
          color: var(--simple-autocomplete-color, #333333);
        }
        ul li:first-child button {
          border-top: none;
        }
        button:hover,
        button:active,
        button:focus {
          background-color: var(
            --simple-autocomplete-button-hover-background-color,
            #eeeeee
          );
          color: var(--simple-autocomplete-hover-color, #000000);
          outline: none;
        }
        .no-results {
          font-size: var(--simple-autocomplete-font-size, 16px);
          padding: 4px 8px;
        }
        simple-icon-lite {
          color: var(--simple-autocomplete-color, #333333);
          --simple-icon-width: var(--simple-autocomplete-icon-size, 16px);
          --simple-icon-height: var(--simple-autocomplete-icon-size, 16px);
          margin-right: 2px;
          vertical-align: middle;
        }
      `,
    ];
  }
  setValue(value) {
    this.processInput(value);
    if (!this.hideInput) {
      this.$input.innerText = value;
    }
  }
  /**
   * Logic for processing input and ensuring list is filtered
   */
  processInput(value) {
    this.opened = true;
    this.value = value;
    this.like = this.value;
  }
  /**
   * When input changes as in user types into the contenteditable area
   * Then we need to open the autocomplete menu and start filtering
   */
  inputChanged(e) {
    this.processInput(this.$input.innerText);
  }
  /**
   * LitElement convention for rendering
   */
  render() {
    return html`
      ${!this.hideInput
        ? html`<span
            part="input"
            id="input"
            name="input"
            @input="${this.inputChanged}"
            contenteditable
            @keydown="${this.a11yInputKeys}"
          ></span>`
        : ``}
      <simple-popover
        part="popover"
        auto
        part="simple-popover"
        ?hidden="${!this.opened || this.filtered.length === 0}"
        position="bottom"
        for="input"
      >
        ${this.filtered.length > 0 && this.opened
          ? html` <ul
              part="list"
              role="listbox"
              @keydown="${this.a11yListKeys}"
            >
              ${this.filtered.map(
                (item, i) =>
                  html`${i < this.itemLimit
                    ? html`<li
                        role="option"
                        part="list-item"
                        value="${item.value}"
                        data-index="${i}"
                      >
                        <button
                          part="button"
                          value="${item.value}"
                          data-index="${i}"
                          @click="${this.itemSelect}"
                        >
                          ${item.icon
                            ? html`<simple-icon-lite
                                icon="${item.icon}"
                              ></simple-icon-lite>`
                            : ``}${item.label}
                        </button>
                      </li>`
                    : ``}`
              )}
            </ul>`
          : html`<div class="no-results" part="no-result">No results</div>`}
      </simple-popover>
    `;
  }
  /**
   * Accessibility enhancements for key presses while in the list of items
   */
  a11yListKeys(e) {
    if (this.filtered.length > 0 && this.opened) {
      switch (e.key) {
        case "ArrowDown":
          // we are on a button actively and there is a next element (li) which has a button
          if (
            this.shadowRoot.activeElement.tagName === "BUTTON" &&
            this.shadowRoot.activeElement.parentNode.nextElementSibling &&
            this.shadowRoot.activeElement.parentNode.nextElementSibling.children
          ) {
            this.hardStopEvent(e);
            this.shadowRoot.activeElement.parentNode.nextElementSibling.children[0].focus();
          }

          break;
        case "Escape":
          this.hardStopEvent(e);
          // close the popover list of items and do focus clean up
          this.resetFocusOnInput();
          break;
        case "ArrowUp":
          // we are actively on a button and there is a previous element (li) which has a button
          if (
            this.shadowRoot.activeElement.tagName === "BUTTON" &&
            this.shadowRoot.activeElement.parentNode.previousElementSibling &&
            this.shadowRoot.activeElement.parentNode.previousElementSibling
              .children
          ) {
            this.hardStopEvent(e);
            this.shadowRoot.activeElement.parentNode.previousElementSibling.children[0].focus();
          }
          break;
      }
    }
  }
  hardStopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (e.detail.keyboardEvent) {
      e.detail.keyboardEvent.preventDefault();
      e.detail.keyboardEvent.stopPropagation();
      e.detail.keyboardEvent.stopImmediatePropagation();
    }
  }
  /**
   * Accessibility enhancements when typing in order to move to the autocomplete list easily
   */
  a11yInputKeys(e) {
    if (this.filtered.length > 0 && this.opened) {
      switch (e.key) {
        case "ArrowDown":
          // down means from the input field, focus on the 1st button
          if (this.shadowRoot.querySelector("button")) {
            this.hardStopEvent(e);
            this.shadowRoot.querySelector("button").focus();
          }
          break;
        case "Escape":
          this.hardStopEvent(e);
          // close the menu, though it'll reopen when typing more
          this.opened = false;
          break;
        case "ArrowUp":
          // up implies cycling back around so focus on the last button in the list
          if (this.shadowRoot.querySelectorAll("button").length) {
            this.hardStopEvent(e);
            this.shadowRoot
              .querySelectorAll("button")
              [this.shadowRoot.querySelectorAll("button").length - 1].focus();
          }
          break;
      }
    }
  }
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    // default limit of items to show even if there are more results
    this.itemLimit = 6;
    // flag to hide input; useful if something else is implementing this tag w/ own input
    this.hideInput = false;
    this.selectionPosition = false;
    this.value = "";
    this.opened = false;
    // click trap to ensure we don't close the popover menu by accident of clicking on it
    this.addEventListener("mousedown", (e) => {
      this._clicking = true;
    });
    // remove the trap
    this.addEventListener("mouseup", (e) => {
      this._clicking = false;
    });
    // ONLY execute a focusout if we mousedown'ed outside of the scope of this element
    // if mousedown happens inside the element then this doesn't fire
    // if you click away on the screen or tab away from the element then this ensures
    // the popover menu automatically closes and the value is established as the contenteditable
    this.addEventListener("focusout", (e) => {
      if (!this._clicking) {
        if (!this.hideInput) {
          this.value = this.$input.innerText;
        }
        this.opened = false;
      } else {
        this._clicking = false;
      }
    });
  }
  /**
   * LitElement life cycle for shadowRoot being available
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // store reference to input field as we use it a lot
    if (!this.selectionPosition && this.shadowRoot.querySelector("#input")) {
      this.$input = this.shadowRoot.querySelector("#input");
      // set target for popover so it shows up on the input element
      this.shadowRoot.querySelector("simple-popover").target = this.$input;
      // when focusing the input area ensure we open the popover correctly
      this.$input.addEventListener("focusin", (e) => {
        // ensure when we optimize for a value to fill in the area that we don't accidently open the menu immediately
        if (this.value && !this._ignoreFocusOpen) {
          this.opened = true;
          if (!this.hideInput) {
            // this forces the filter to kick in based on what's already there
            this.value = this.$input.innerText;
            // "like" is the filtering value to searching against
            this.like = this.$input.innerText;
          }
        }
        this._ignoreFocusOpen = false;
      });
    }
  }
  /**
   * Selection normalizer
   */
  getSelection() {
    // try and obtain the selection from the nearest shadow
    // which would give us the selection object when running native ShadowDOM
    // with fallback support for the entire window which would imply Shady
    if (this.$input) {
      // native API
      if (this.$input.getSelection) {
        return this.$input.getSelection();
      }
      // ponyfill from google, check that we don't already have a range
      else if (
        typeof this.$input.endOffset === "undefined" &&
        getRange(this.$input)
      ) {
        return getRange(this.$input);
      }
    }
    // missed on both, hope the normal one will work
    return window.getSelection();
  }
  /**
   * Get a normalized range based on current selection
   */
  getRange() {
    let sel = this.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }
  /**
   * Reset focus back on the input area while closing the popover
   */
  resetFocusOnInput() {
    this.opened = false;
    // trap to ensure we don't open the popover when we mean to close it
    this._ignoreFocusOpen = true;
    // focus the input, can't on a range though
    if (typeof this.$input.endOffset === "undefined") {
      this.$input.focus();
      if (this.$input.getAttribute("contenteditable") != null) {
        // generate a fake range at the end of the input so that we can place
        // the cursor where the user expects (end of the input area)
        var range = document.createRange();
        var sel = this.getSelection();
        range.setEnd(this.$input.childNodes[0], this.$input.innerText.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }
  /**
   * handle item selection and reset focus
   */
  itemSelect(e) {
    // get value from the button selected
    this.value = e.target.parentNode.getAttribute("value");
    // inject that value into the contenteditable
    if (!this.hideInput) {
      this.$input.innerText = this.value;
    }
    this.dispatchEvent(
      new CustomEvent(`item-selected`, {
        detail: {
          value: this.value,
        },
      })
    );
    // ensure the _clicking lock is removed as we need to close popover
    this._clicking = false;
    // correctly focus the input area now w/ the new value set
    this.resetFocusOnInput();
  }

  /**
   * LitElement convention
   */
  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflect: true,
      },
      hideInput: {
        type: Boolean,
        attribute: "hide-input",
      },
      selectionPosition: {
        type: Boolean,
        attribute: "selection-position",
      },
      value: {
        type: String,
      },
      itemLimit: {
        type: Number,
        attribute: "item-limit",
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
      // notify others that our value has changed if they want to use this
      // as an input to feed their tag
      if (propName == "value") {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          })
        );
      }
      // when we open, force popover to position correctly
      if (propName == "opened" && this.opened) {
        this.shadowRoot.querySelector("simple-popover").updatePosition();
        setTimeout(() => {
          if (this.selectionPosition && this.getRange()) {
            this.$input = this.getRange();
            // special support for native inputs
            if (
              ["TEXTAREA", "INPUT"].includes(document.activeElement.tagName)
            ) {
              this.$input = document.activeElement;
            }
            this.shadowRoot.querySelector(
              "simple-popover"
            ).target = this.$input;
            this.shadowRoot.querySelector("simple-popover").updatePosition();
          }
        }, 0);
      }
      // if we have new items do advanced processing of the items
      if (propName == "items" && this.items.length > 0 && !this._ignore) {
        this._ignore = true;
        for (var i = 0; i < this.items.length; i++) {
          // oh... your going to enjoy this one..
          // convert ALL objcet keys into a searchable string called title
          if (!this.items[i].title) {
            this.items[i].title = Object.keys(this.items[i])
              .map((key) => {
                return key !== "icon" ? this.items[i][key] : false; // skip icon since it is visual
              })
              .join(" ");
          }
          // if we have an icon, inject icon loading imports
          if (this.items[i].icon) {
            import("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");
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
