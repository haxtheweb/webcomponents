/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
/**
 * `active-when-visible`
 * `Title of the site`
 *
 * @demo demo/index.html
 */
class ActiveWhenVisible extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        a {
          height: 10px;
          width: 10px;
          float: left;
          pointer-events: none;
          background-color: transparent;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "active-when-visible";
  }
  // render function
  render() {
    return html`
      <div>
        <a
          id="a"
          .href="${this._a}"
          .name="#${this.itemId}"
          aria-hidden="true"
        ></a>
        <slot></slot>
      </div>
    `;
  }
  constructor() {
    super();
    this.thresholds = [0.0, 0.25, 0.5, 0.75, 1.0];
    this.rootMargin = "0px";
    this.visibleLimit = 0.5;
    this.isVisible = false;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "isVisible") {
        // fire an event that this is a core piece of the system
        this.dispatchEvent(
          new CustomEvent("is-visible-changed", {
            detail: this[propName],
          }),
        );
      }
    });
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      itemId: {
        type: String,
        attribute: "item-id",
      },
      _a: {
        type: String,
      },
      thresholds: {
        type: Array,
      },
      rootMargin: {
        type: String,
        attribute: "root-margin",
      },
      visibleLimit: {
        type: Number,
        reflect: true,
        attribute: "visible-limit",
      },
      isVisible: {
        type: Boolean,
        attribute: "is-visible",
      },
    };
  }
  connectedCallback() {
    super.connectedCallback();
    // setup the intersection observer
    this.observer = new IntersectionObserver(
      this.handleIntersectionCallback.bind(this),
      {
        rootMargin: this.rootMargin,
        threshold: this.thresholds,
      },
    );
    this.observer.observe(this);
  }
  /**
   * Handle this being visible
   */
  handleIntersectionCallback(entries) {
    for (let entry of entries) {
      if (Number(entry.intersectionRatio).toFixed(2) >= this.visibleLimit) {
        // now we care
        if (this.itemId) {
          let item = store.findItem(this.itemId);
          this._a = item.slug;
          this.isVisible = true;
          setTimeout(() => {
            this.shadowRoot.querySelector("#a").click();
          }, 25);
        }
      }
    }
  }
}
customElements.define(ActiveWhenVisible.tag, ActiveWhenVisible);
export { ActiveWhenVisible };
