/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { getRange } from "@lrnwebcomponents/utils/utils.js";
import "../simple-autocomplete.js";

export class SimpleAutocompleteTextTrigger extends LitElement {
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.haxUIElement = true;
    this.target = null;
    this.triggers = {};
    this.value = "";
  }
  /**
   * LitElement life cycle
   */
  render() {
    return html`<simple-autocomplete
        @item-selected="${this.valueChanged}"
        selection-position
        hide-input
      ></simple-autocomplete
      ><slot></slot>`;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "simple-autocomplete-text-trigger";
  }
  /**
   * LitElement convention
   */
  static get properties() {
    return {
      target: {
        type: Object,
      },
      triggers: {
        type: Object,
      },
      value: {
        type: String,
      },
    };
  }
  // link value below w/ this so we can bubble our own event from here
  valueChanged(e) {
    this.value = e.detail.value;
  }

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // if our value changes then mirror that into the target elsewhere
      if (propName == "value" && this.value != "" && this.target) {
        // clear what's there and insert matching value
        const old = this.getTargetValue();
        this.setTargetValue(
          old.substring(0, this._triggerStart - 1) +
            this.value +
            old.substring(this._triggerEnd)
        );
        // set cursor for better UX
        if (["TEXTAREA", "INPUT"].includes(this.target.tagName)) {
          this.target.setSelectionRange(
            this._triggerStart - 1 + this.value.length,
            this._triggerStart - 1 + this.value.length
          );
        } else if (this.target.getAttribute("contenteditable") != null) {
          // set range appropriately for cursor placement
          var range = document.createRange();
          var sel = this.getSelection();
          range.setStart(
            this.target.childNodes[0],
            this._triggerStart - 1 + this.value.length
          );
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        this.target.focus();
        this._triggerStart = null;
        this._triggerEnd = null;
      }
    });
  }
  /**
   * Manage events on the target which is external to this element
   */
  connectTargetEvents(enable = true) {
    if (enable) {
      window.addEventListener("keydown", this.targetKeyDownMonitor.bind(this));
      window.addEventListener("keyup", this.targetKeyMonitor.bind(this));
    } else {
      window.removeEventListener(
        "keydown",
        this.targetKeyDownMonitor.bind(this)
      );
      window.removeEventListener("keyup", this.targetKeyMonitor.bind(this));
    }
  }
  /**
   * Selection normalizer
   */
  getSelection() {
    // try and obtain the selection from the nearest shadow
    // which would give us the selection object when running native ShadowDOM
    // with fallback support for the entire window which would imply Shady
    if (this.target) {
      // native API
      if (this.target.getSelection) {
        return this.target.getSelection();
      }
      // ponyfill from google
      else if (getRange(this.target)) {
        return getRange(this.target);
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
   * process in the autocompletes handling of this
   */
  targetKeyDownMonitor(e) {
    // run through the autocomplete key handlers as well for consistency
    this.$autocomplete.a11yInputKeys(e);
  }
  /**
   * Monitor keys in the target to look for a tigger key so we can start paying attention
   */
  targetKeyMonitor(e) {
    // you monster you...
    if (Object.keys(this.triggers).includes(e.key)) {
      let items = [];
      // resolve difference between psuedo elements w/o real positioning from contenteditable
      if (["TEXTAREA", "INPUT"].includes(this.target.tagName)) {
        this._triggerStart = this.target.selectionStart;
      } else if (this.target.getAttribute("contenteditable") != null) {
        this._triggerStart = this.getRange().startOffset;
      }
      // crazy... see if we have a function or an array response
      if (typeof this.triggers[e.key] === "function") {
        items = this.triggers[e.key](this);
      } else {
        items = this.triggers[e.key];
      }
      this.$autocomplete.items = [...items];
    }
    // should ensure that each new character does this
    if (this._triggerStart) {
      // resolve difference between psuedo elements w/o real positioning from contenteditable
      if (["TEXTAREA", "INPUT"].includes(this.target.tagName)) {
        this._triggerEnd = this.target.selectionEnd;
      } else if (this.target.getAttribute("contenteditable") != null) {
        // @todo need to get the cursor position in a contenteditable area
        this._triggerEnd = this.getRange().endOffset;
      }
    }
    // update value in the autocomplete to match our target value the +1 ensures we don't pick up the trigger
    if (this._triggerStart != this._triggerEnd) {
      this.$autocomplete.opened = true;
      // delay so the range can be set
      setTimeout(() => {
        this.$autocomplete.setValue(
          this.getTargetValue().substring(this._triggerStart, this._triggerEnd)
        );
      }, 1);
    }
    // if we just got a space, it's time to cut the value
    if (e.code === "Space") {
      this._triggerStart = null;
      this._triggerEnd = null;
      this.$autocomplete.opened = false;
    }
  }
  /**
   * Set target correctly between inputs and contenteditable
   */
  setTargetValue(value) {
    if (this.target) {
      if (["TEXTAREA", "INPUT"].includes(this.target.tagName)) {
        this.target.value = value;
      } else if (this.target.getAttribute("contenteditable") != null) {
        this.target.innerText = value;
      }
    }
  }
  /**
   * Resolve target value between contenteditable and native inputs
   */
  getTargetValue() {
    if (this.target) {
      if (["TEXTAREA", "INPUT"].includes(this.target.tagName)) {
        return this.target.value;
      } else if (this.target.getAttribute("contenteditable") != null) {
        return this.target.innerText;
      }
    }
    return false;
  }
  /**
   * LitElement life cycle for shadowRoot being available
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.$autocomplete = this.shadowRoot.querySelector("simple-autocomplete");
    // progressive enhancement by wrapping field, test again if not already set
    if (!this.target && this.children && this.children.length === 1) {
      this.target = this.children[0];
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.connectTargetEvents();
  }
  disconnectedCallback() {
    this.connectTargetEvents(false);
    super.disconnectedCallback();
  }
}
customElements.define(
  SimpleAutocompleteTextTrigger.tag,
  SimpleAutocompleteTextTrigger
);
