/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
/**
 * `type-writer`
 * `typewritter effect`
 * based off of https://github.com/PolymerEl/type-writer
 *
 * @demo demo/index.html
 * @customElement type-writer
 */
class TypeWriter extends IntersectionObserverMixin(LitElement) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Convention we use
   */
  static get tag() {
    return "type-writer";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.delay = 100;
    this.cursorDuration = 0;
    this.speed = 150;
    this.eraseSpeed = 80;
    this.typing = false;
  }

  _observeText(text, delay, elementVisible) {
    if (text && delay !== undefined && elementVisible) {
      if (this.shadowRoot.querySelector("#text").textContent) {
        this._oldText = this.shadowRoot.querySelector("#text").textContent;
        if (this.typing && this._cancel) {
          clearTimeout(this._cancel);
          this._cancel = null;
        }
        return this.erase();
      }
      this._length = 0;
      setTimeout(() => {
        this.type();
      }, this.delay);
    }
  }

  type() {
    this.typing = true;
    this.shadowRoot.querySelector("#text").textContent = this.text.substr(
      0,
      this._length++
    );
    if (this._length < this.text.length + 1) {
      this._cancel = setTimeout(() => {
        this.type();
      }, this.speed + ((Math.random() - 0.5) * this.speed) / 2);
      return;
    }
    setTimeout(() => {
      this.typing = false;
      this.dispatchEvent(
        new CustomEvent("type-writer-end", {
          detail: this.text,
          bubbles: true,
          composed: true
        })
      );
    }, this.cursorDuration);
  }

  erase() {
    this.typing = true;
    this.shadowRoot.querySelector("#text").textContent = this._oldText.substr(
      0,
      this._length--
    );
    if (this._length >= 0) {
      this._cancel = setTimeout(() => {
        this.erase();
      }, this.eraseSpeed || this.speed);
      return;
    }
    this.type();
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["text", "delay", "elementVisible"].includes(propName)) {
        this._observeText(this.text, this.delay, this.elementVisible);
      }
    });
  }
}
customElements.define(TypeWriter.tag, TypeWriter);
export { TypeWriter };
