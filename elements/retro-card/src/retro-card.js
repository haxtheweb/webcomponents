/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `retro-card`
 * `Simple card in a cool retro design`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @customElement retro-card
 */
class RetroCard extends SimpleColors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Convention we use
   */
  static get tag() {
    return "retro-card";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__cardTags = [];
    this.hoverState = false;
    setTimeout(() => {
      this.addEventListener("keypress", this._keyPress.bind(this));
      this.addEventListener("mouseover", this._hoverStateOn.bind(this));
      this.addEventListener("mouseout", this._hoverStateOff.bind(this));
      this.addEventListener("focusin", this._hoverStateOn.bind(this));
      this.addEventListener("focusout", this._hoverStateOff.bind(this));
    }, 0);
  }
  /**
   * A11y because we are delegating keyboard function to hit the link when enter pressed
   */
  _keyPress(e) {
    switch (e.key) {
      case "Enter":
        // simulate click to go to whatever link / action it has
        this.shadowRoot.querySelector("a").click();
        break;
    }
  }
  _hoverStateOff(e) {
    this.hoverState = false;
  }
  _hoverStateOn(e) {
    this.hoverState = true;
  }
  firstUpdated() {
    // makes this focusable and we normalize the hover / focus state
    // between CSS, JS and keyboard actions this way
    this.setAttribute("tabindex", 0);
    // optional support for hoverSource being the default source
    if (!this.hoverSource) {
      this.hoverSource = this.mediaSource;
    }
  }
  /**
   * special support for HAX since the whole card is selectable
   */
  _clickCard(e) {
    if (
      window.HaxStore &&
      window.HaxStore.ready &&
      window.HaxStore.instance &&
      window.HaxStore.instance.editMode
    ) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "tags") {
        this._tagsChanged(this[propName]);
      }
      if (propName == "source") {
        this.__source = this.mediaSource;
      }
      if (propName == "hoverState") {
        this.__source = this[propName] ? this.hoverSource : this.mediaSource;
      }
    });
  }
  /**
   * Convert string based tags into array
   */
  _tagsChanged(tags) {
    let ary = tags.split(",");
    this.__cardTags = [...ary];
  }
}
customElements.define(RetroCard.tag, RetroCard);
export { RetroCard };
