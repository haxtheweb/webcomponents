/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `site-dot-indicator`
 * `list of items based on manifest`
 *
 * @demo demo/index.html
 */
class SiteDotIndicator extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --site-dot-indicator-color: white;
        }
        :host([sticky="left"]) {
          position: fixed;
          left: 8px;
          z-index: 1000;
          top: 25vh;
        }
        :host([sticky="right"]) {
          position: fixed;
          right: 8px;
          z-index: 1000;
          top: 25vh;
        }
        :host([sticky="left"]) ol,
        :host([sticky="right"]) ol {
          display: grid;
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
      `,
    ];
  }
  constructor() {
    super();
    this.__disposer = [];
    this.scrollOnActive = false;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-dot-indicator";
  }
  // render function
  render() {
    return html` <ol id="list"></ol> `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      activeId: {
        type: String,
        attribute: "active-id",
      },
      routerManifest: {
        type: Object,
      },
      sticky: {
        type: String,
        reflect: true,
      },
      scrollOnActive: {
        type: Boolean,
        attribute: "scroll-on-active",
      },
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeId") {
        this._activeIdChanged(this[propName], oldValue);
      }
      if (propName == "routerManifest") {
        this._routerManifestChanged(this[propName], oldValue);
      }
    });
  }
  _activeIdChanged(newValue, oldValue) {
    if (newValue) {
      let tmp = this.shadowRoot.querySelector('[data-item="' + newValue + '"');
      if (tmp) {
        tmp.classList.add("active");
      }
      if (oldValue) {
        let tmp = this.shadowRoot.querySelector(
          '[data-item="' + oldValue + '"',
        );
        if (tmp) {
          tmp.classList.remove("active");
        }
      }
    }
  }
  _routerManifestChanged(routerManifest) {
    while (this.shadowRoot.querySelector("#list").firstChild !== null) {
      this.shadowRoot
        .querySelector("#list")
        .removeChild(this.shadowRoot.querySelector("#list").firstChild);
    }
    for (var i in routerManifest.items) {
      let li = globalThis.document.createElement("li");
      li.setAttribute("data-item", routerManifest.items[i].id);
      li.setAttribute("title", routerManifest.items[i].title);
      if (this.activeId === routerManifest.items[i].id) {
        li.classList.add("active");
      }
      let link = globalThis.document.createElement("a");
      link.href = routerManifest.items[i].slug;
      li.appendChild(link);
      this.shadowRoot.querySelector("#list").appendChild(li);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    autorun((reaction) => {
      this.routerManifest = toJS(store.routerManifest);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeId = toJS(store.activeId);
      this.__disposer.push(reaction);
    });
    if (this.scrollOnActive) {
      this.shadowRoot.querySelector("#list").addEventListener("click", () => {
        this.parentElement.querySelector("#" + this.activeId).scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      });
    }
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    if (this.scrollOnActive) {
      this.shadowRoot
        .querySelector("#list")
        .removeEventListener("click", () => {
          this.parentElement.querySelector("#" + this.activeId).scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        });
    }
    super.disconnectedCallback();
  }
}
customElements.define(SiteDotIndicator.tag, SiteDotIndicator);
export { SiteDotIndicator };
