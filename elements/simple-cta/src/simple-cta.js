/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { remoteLinkBehavior } from "@lrnwebcomponents/utils/lib/remoteLinkBehavior.js";
import { activeStateBehavior } from "@lrnwebcomponents/utils/lib/activeStateBehavior.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `simple-cta`
 * `Simple call to action button`
 * @demo demo/index.html
 * @element simple-cta
 */
class SimpleCta extends activeStateBehavior(remoteLinkBehavior(SimpleColors)) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Convention we use
   */
  static get tag() {
    return "simple-cta";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.link = "#";
    this.title = null;
    this.accentColor = "green";
    if (this.querySelector("a")) {
      this.link = this.querySelector("a").getAttribute("href");
      this.title = this.querySelector("a").innerText;
      this.innerHTML = null;
    }
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this.editMode = val;
  }
  /**
   * special support for HAX since the whole card is selectable
   */
  _clickCard(e) {
    if (this.editMode) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    // flag for HAX to not trigger active on changes
    this.alignState();
    this.editMode = val;
    return false;
  }
  alignState() {
    // easy, name is flat
    this.title = this.shadowRoot.querySelector("#title").innerText;
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.remoteLinkTarget = this.shadowRoot.querySelector("a");
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "link") {
        this.remoteLinkURL = this[propName];
      }
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
}
customElements.define(SimpleCta.tag, SimpleCta);
export { SimpleCta };
