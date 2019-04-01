/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { autorun, toJS } from "mobx";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
 * `active-when-visible`
 * `Title of the site`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class ActiveWhenVisible extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "active-when-visible";
  }
  // render function
  static get template() {
    return html`
      <style>
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
      </style>
      <div>
        <a id="a" href$="[[_a]]" name$="#[[itemId]]" aria-hidden></a>
        <slot></slot>
      </div>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      itemId: {
        type: String
      },
      _a: {
        type: String
      },
      thresholds: {
        type: Array,
        value: [0.0, 0.25, 0.5, 0.75, 1.0]
      },
      rootMargin: {
        type: String,
        value: "0px"
      },
      visibleLimit: {
        type: Number,
        value: 0.5,
        reflectToAttribute: true
      },
      isVisible: {
        type: Boolean,
        value: false,
        notify: true
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    // setup the intersection observer
    afterNextRender(this, function() {
      this.observer = new IntersectionObserver(
        this.handleIntersectionCallback.bind(this),
        {
          root: document.rootElement,
          rootMargin: this.rootMargin,
          threshold: this.thresholds
        }
      );
      this.observer.observe(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
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
          this._a = item.location
            .replace("pages/", "")
            .replace("/index.html", "");
          this.isVisible = true;
          setTimeout(() => {
            this.$.a.click();
          }, 25);
        }
      }
    }
  }
}
window.customElements.define(ActiveWhenVisible.tag, ActiveWhenVisible);
export { ActiveWhenVisible };
