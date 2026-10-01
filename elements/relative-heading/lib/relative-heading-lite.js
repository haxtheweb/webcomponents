/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
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
    this.__observer = new MutationObserver(() => this.updateContents());
    this.checkId();
    this.__level = this.querySelector("h1,h2,h3,h4,h5,h6")
      ? parseInt(
          this.querySelector("h1,h2,h3,h4,h5,h6").tagName.replace(/\D/, ""),
        )
      : 1;
    // honor a default-level attribute authored before this element was
    // upgraded since attributeChangedCallback does not replay it, which
    // matters for elements that import this one dynamically
    this.defaultLevel = parseInt(this.getAttribute("default-level")) || 1;
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
    return this.__observer;
  }

  /**
   * returns state manager
   * @readonly
   * @returns {object} globalThis.RelativeHeadingStateManager instance
   */
  get manager() {
    return globalThis.RelativeHeadingStateManager.requestAvailability();
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
          this.defaultLevel = Math.min(6, Math.max(this.defaultLevel, 1));
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
    let tag = `h${this.__level}`;
    if (this.querySelector(tag)) return;
    let first = this.children && this.children[0] ? this.children[0] : null;
    if (first && first.tagName !== "SLOT") {
      // replace only the first child node, moving its child nodes instead
      // of rewriting innerHTML, so that any host framework's DOM markers
      // (e.g. lit ChildParts) around or inside it survive and stay connected
      let heading = globalThis.document.createElement(tag);
      while (first.firstChild) heading.appendChild(first.firstChild);
      this.replaceChild(heading, first);
    } else if (!first) {
      // wrap loose content in the heading by moving the nodes rather than
      // rewriting innerHTML so nothing is ejected from the DOM
      let heading = globalThis.document.createElement(tag);
      while (this.firstChild) heading.appendChild(this.firstChild);
      this.appendChild(heading);
    }
    // a slotted first child is left alone: the assigned nodes supply their
    // own heading markup, and rewriting around the slot would eject the
    // slotting element's framework markers
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
        .substring(1),
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
globalThis.customElements.define(RelativeHeadingLite.tag, RelativeHeadingLite);
export { RelativeHeadingLite };
