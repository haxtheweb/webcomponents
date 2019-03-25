/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `site-dot-indicator`
 * `list of items based on manifest`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteDotIndicator extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-dot-indicator";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --site-dot-indicator-color: white;
        }
        ol {
          padding-left: 0;
          margin-left: 0;
        }
        li {
          transition: 0.3s all ease-in-out;
          display: inline-block;
          width: 10px;
          height: 10px;
          margin: 2px;
          text-indent: -999px;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.1);
          border: 1px solid var(--site-dot-indicator-color);
          border-radius: 10px;
        }
        a {
          width: 12px;
          height: 12px;
          display: block;
          margin: 0;
          padding: 0;
        }
        .active {
          width: 12px;
          height: 12px;
          margin: 1px;
          background-color: var(--site-dot-indicator-color);
        }
      </style>
      <ol id="list"></ol>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      /**
       * acitvely selected item
       */
      activeId: {
        type: String,
        observer: "_activeIdChanged"
      },
      routerManifest: {
        type: Object,
        observer: "_routerManifestChanged"
      }
    };
  }
  _activeIdChanged(newValue, oldValue) {
    if (newValue) {
      let tmp = this.shadowRoot.querySelector('[data-item="' + newValue + '"');
      if (tmp) {
        tmp.classList.add("active");
      }
      if (oldValue) {
        let tmp = this.shadowRoot.querySelector(
          '[data-item="' + oldValue + '"'
        );
        if (tmp) {
          tmp.classList.remove("active");
        }
      }
    }
  }
  _routerManifestChanged(routerManifest) {
    while (this.$.list.firstChild !== null) {
      this.$.list.removeChild(this.$.list.firstChild);
    }
    for (var i in routerManifest.items) {
      let li = document.createElement("li");
      li.setAttribute("data-item", routerManifest.items[i].id);
      li.setAttribute("title", routerManifest.items[i].title);
      if (this.activeId === routerManifest.items[i].id) {
        li.classList.add("active");
      }
      let link = document.createElement("a");
      link.href = routerManifest.items[i].location;
      li.appendChild(link);
      this.$.list.appendChild(li);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.routerManifest = toJS(store.routerManifest);
    });
    this.__disposer2 = autorun(() => {
      this.activeId = toJS(store.activeId);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
    this.__disposer2();
  }
}
window.customElements.define(SiteDotIndicator.tag, SiteDotIndicator);
export { SiteDotIndicator };
