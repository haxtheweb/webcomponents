/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

export class SimpleAutocompleteTextTrigger extends LitElement {
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.target = null;
    this.triggers = {};
    this.value = "";
    // progressive enhancement by wrapping field
    if (this.children && this.children.length === 1) {
      this.target = this.children[0];
    }
  }
  /**
   * LitElement life cycle
   */
  render() {
    return html`<simple-autocomplete
        @item-selected="${this.valueChanged}"
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
      // notify others that our value has changed if they want to use this
      // as an input to feed their tag
      if (propName == "triggers" && Object.keys(this.triggers) > 0) {
      }
      // target of what to bind changes between
      if (propName == "target" && this.target) {
        console.log(this.target);
        this.connectTargetEvents(this.target);
      }
      // if our value changes then mirror that into the target elsewhere
      if (propName == "value" && this.value != "" && this.target) {
        // clear what's there and insert matching value
        const old = this.target.value;
        this.target.value =
          old.substring(0, this._triggerStart) +
          this.value +
          old.substring(this._triggerEnd);
        this.target.setSelectionRange(
          this._triggerStart + this.value.length,
          this._triggerStart + this.value.length
        );
        this.target.focus();
        this._triggerStart = null;
        this._triggerEnd = null;
      }
    });
  }
  /**
   * Manage events on the target which is external to this element
   */
  connectTargetEvents(target, enable = true) {
    if (enable) {
      target.addEventListener("keydown", this.targetKeyMonitor.bind(this));
    } else {
      target.removeEventListener("keydown", this.targetKeyMonitor.bind(this));
    }
  }
  /**
   * Monitor keys in the target to look for a tigger key so we can start paying attention
   */
  targetKeyMonitor(e) {
    // you monster you...
    if (Object.keys(this.triggers).includes(e.key)) {
      let items = [];
      this._triggerStart = this.target.selectionStart;
      // crazy... see if we have a function or an array response
      if (typeof this.triggers[e.key] === "function") {
        items = this.triggers[e.key](this);
      } else {
        items = this.triggers[e.key];
      }
      this.$autocomplete.items = [...items];
    }
    setTimeout(() => {
      // should ensure that each new character does this
      if (this._triggerStart) {
        this._triggerEnd = this.target.selectionEnd;
      }
      // update value in the autocomplete to match our target value the +1 ensures we don't pick up the trigger
      if (this._triggerStart != this._triggerEnd) {
        this.$autocomplete.opened = true;
        console.log(
          this.target.value.substring(
            this._triggerStart + 1,
            this._triggerEnd + 1
          )
        );
        this.$autocomplete.setValue(
          this.target.value.substring(
            this._triggerStart + 1,
            this._triggerEnd + 1
          )
        );
      }
      // if we just got a space, it's time to cut the value
      if (e.code === "Space") {
        this._triggerStart = null;
        this._triggerEnd = null;
        this.$autocomplete.opened = false;
      }
    }, 10);
    // run through the autocomplete key handlers as well for consistency
    this.$autocomplete.a11yInputKeys(e);
  }
  /**
   * LitElement life cycle for shadowRoot being available
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.$autocomplete = this.shadowRoot.querySelector("simple-autocomplete");
  }
  disconnectedCallback() {
    if (this.target) {
      this.connectTargetEvents(this.target, false);
    }
    super.disconnectedCallback();
  }
}
customElements.define(
  SimpleAutocompleteTextTrigger.tag,
  SimpleAutocompleteTextTrigger
);
