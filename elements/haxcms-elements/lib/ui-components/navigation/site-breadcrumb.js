/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `site-breadcrumb`
 * `A basic breadcrumb of links based on the active state in HAXcms on JSON Outline Schema`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteBreadcrumb extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-breadcrumb";
  }
  constructor() {
    super();
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-button/paper-button.js");
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-size: 16px;
          color: var(--site-breadcrumb-color, #383f45);
        }
        #space {
          height: 24px;
          line-height: 24px;
        }
        a {
          height: 24px;
          color: var(--site-breadcrumb-color, #383f45);
          display: inline-flex;
          line-height: 24px;
          padding: 0 8px 0 0;
          text-decoration: var(--site-breadcrumb-text-decoration, underline);
        }
        paper-button {
          margin: 0;
          padding: 0;
          height: 24px;
          min-width: unset;
          display: inline-flex;
          text-transform: unset;
        }
        paper-button:hover,
        paper-button:focus,
        paper-button:active {
          background-color: var(--site-breadcrumb-hover-bg, transparent);
          color: var(--site-breadcrumb-hover-color, #222222);
        }
        span {
          margin: 0;
          padding: 0 8px 0 0;
          height: 24px;
          display: inline-flex;
        }
        iron-icon {
          display: inline-flex;
          height: 24px;
          width: 24px;
          padding: 0 8px 0 0;
          color: var(--site-breadcrumb-color, #383f45);
        }
      </style>
      <div
        id="space"
        itemscope
        itemtype="http://data-vocabulary.org/Breadcrumb"
      ></div>
    `;
  }
  /**
   * Notice the change and build
   */
  _activeItemChanged(active) {
    const activeItem = active;
    if (activeItem) {
      // wipe out the slot and rebuild it
      while (this.$.space.firstChild !== null) {
        this.$.space.removeChild(this.$.space.firstChild);
      }
      var items = [
        {
          title: activeItem.title,
          location: null
        }
      ];
      let itemBuilder = activeItem;
      // walk back through parent tree
      while (itemBuilder && itemBuilder.parent != null) {
        itemBuilder = this.manifest.items.find(i => i.id == itemBuilder.parent);
        // double check structure is sound
        if (itemBuilder) {
          items.unshift({
            title: itemBuilder.title,
            location: itemBuilder.location
          });
        }
      }
      for (var i in items) {
        let icon = document.createElement("iron-icon");
        icon.icon = "icons:chevron-right";
        if (items[i].location != null) {
          let button = document.createElement("paper-button");
          button.innerText = items[i].title;
          button.noink = true;
          // disable buttons if we ware editing
          if (this.editMode) {
            button.setAttribute("disabled", "disabled");
            this.$.space.appendChild(button);
          } else {
            let link = document.createElement("a");
            link.setAttribute("href", items[i].location);
            link.setAttribute("tabindex", "-1");
            link.setAttribute("itemprop", "url");
            link.appendChild(button);
            this.$.space.appendChild(link);
          }
          this.$.space.appendChild(icon);
        } else {
          let span = document.createElement("span");
          span.innerText = items[i].title;
          this.$.space.appendChild(span);
        }
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.manifest = toJS(store.routerManifest);
    });
    this.__disposer2 = autorun(() => {
      this.editMode = toJS(store.editMode);
      this._activeItemChanged(toJS(store.activeItem));
    });
  }
  disconnectedCallback() {
    this.__disposer();
    this.__disposer2();
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteBreadcrumb.tag, SiteBreadcrumb);
export { SiteBreadcrumb };
