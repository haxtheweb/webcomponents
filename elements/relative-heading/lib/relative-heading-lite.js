/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "./relative-heading-state-manager.js";
/**
 * `relative-heading-lite`
 * `outputs the correct heading hierarchy based on parent heading`
 *
 * @demo demo/lite.html
 * @element relative-heading-lite
 */
class RelativeHeadingLite extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --simple-icon-color: currentColor;
        }
        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }
  // render function
  render() {
    return this.template;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * The default heading level (1-6),
       * eg., 1 for <h1>, if there  is no parent.
       */
      defaultLevel: {
        type: Number,
        attribute: "default-level",
        reflect: true,
      },
      /**
       * The relative-heading's UUID.
       */
      id: {
        type: String,
        attribute: "id",
        reflect: true,
      },
      /**
       * The parent relative-heading's UUID.
       */
      parent: {
        type: String,
        attribute: "parent",
        reflect: true,
      },
      /**
       * The parent relative-heading's UUID.
       */
      __level: {
        type: Number,
        attribute: "level",
        reflect: true,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "relative-heading-lite";
  }

  get template() {
    return html` <slot></slot> `;
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.parent = null;
    this.checkId();
    this.__level = this.querySelector("h1,h2,h3,h4,h5,h6")
      ? parseInt(
          this.querySelector("h1,h2,h3,h4,h5,h6").tagName.replace(/\D/, "")
        )
      : 1;
    this.defaultLevel = 1;
  }

  /**
   * life cycle, element is added to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.manager.addHeading(this);
    this.observer.observe(this, { childList: true });
  }

  /**
   * returns mutation observer
   * @readonly
   * @returns {object} MutationObserver to unwrap contents
   */
  get observer() {
    let unwrap = () => this.updateContents();
    return new MutationObserver(unwrap);
  }

  /**
   * returns state manager
   * @readonly
   * @returns {object} window.RelativeHeadingStateManager instance
   */
  get manager() {
    return window.RelativeHeadingStateManager.requestAvailability();
  }

  /**
   * ensures that id is not blank
   */
  checkId() {
    this.id = this.id || `heading-${this._generateUUID()}`;
  }

  /**
   * @param {map} changedProperties the properties that have changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "defaultLevel") {
        if (
          !this.defaultLevel ||
          this.defaultLevel < 1 ||
          this.defaultLevel > 6
        )
          this.defaultLevel = Math.min(0, Math.max(this.defaultLevel, 6));
        this.manager.updateDefaultLevel(this, oldValue);
      }
      if (propName === "id") {
        if (!this.id) this.checkId();
        this.manager.updateId(this, oldValue);
      }
      if (propName === "parent") this.manager.updateParent(this, oldValue);
      if (propName === "__level") {
        this.observer.disconnect();
        this.updateContents();
        this.observer.observe(this, { childList: true });
      }
    });
  }

  /**
   * sets the heading level
   * @param {number} level of heading
   */
  _setLevel(level) {
    if (this.__level !== level) this.__level = level;
  }

  /**
   * unwraps tags on slotted content
   */
  updateContents() {
    if (!this.querySelector(`h${this.__level}`) || this.children > 0) {
      this.innerHTML = `<h${this.__level}>${
        this.children && this.children[0]
          ? this.children[0].innerHTML
          : this.textContent
      }</h${this.__level}>`;
    }
  }

  /**
   * generates a unique id
   * @returns {string } unique id
   */
  _generateUUID() {
    return "ss-s-s-s-sss".replace(
      /s/g,
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    );
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.observer.disconnect();
    this.manager.removeHeading(this);
    super.disconnectedCallback();
  }
}
window.customElements.define(RelativeHeadingLite.tag, RelativeHeadingLite);
export { RelativeHeadingLite };
