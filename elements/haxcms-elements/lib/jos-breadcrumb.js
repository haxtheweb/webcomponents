/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `haxcms-slide-theme`
 * `A simple slide playing theme`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class JosBreadcrumb extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "jos-breadcrumb";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          font-size: 16px;
          color: var(--jos-breadcrumb-color, #383f45);
        }
        #space {
          height: 24px;
          line-height: 24px;
        }
        a {
          height: 24px;
          color: var(--jos-breadcrumb-color, #383f45);
          display: inline-flex;
          line-height: 24px;
          padding: 0 8px 0 0;
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
          background-color: var(--jos-breadcrumb-hover-bg, transparent);
          color: var(--jos-breadcrumb-hover-color, #222222);
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
          color: var(--jos-breadcrumb-color, #383f45);
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
   * Mix in an opened status
   */
  static get properties() {
    return {
      manifest: {
        type: Object,
        observer: "_manifestChanged"
      },
      activeItemId: {
        type: String,
        observer: "_activeItemIdChanged"
      }
    };
  }
  _manifestChanged(newValue, oldValue) {
    if (newValue && oldValue) {
      this._activeItemIdChanged(this.activeItemId);
    }
  }
  _activeItemIdChanged(newValue, oldValue) {
    if (newValue) {
      // wipe out the slot and rebuild it
      while (this.$.space.firstChild !== null) {
        this.$.space.removeChild(this.$.space.firstChild);
      }
      var activeItem = this.manifest.items.find(i => i.id == newValue);
      var items = [
        {
          title: activeItem.title,
          location: null
        }
      ];
      // walk back through parent tree
      while (activeItem.parent != null) {
        activeItem = this.manifest.items.find(i => i.id == activeItem.parent);
        // double check structure is sound
        if (activeItem) {
          items.unshift({
            title: activeItem.title,
            location: activeItem.location
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
          let link = document.createElement("a");
          link.setAttribute("href", items[i].location);
          link.setAttribute("tabindex", "-1");
          link.setAttribute("itemprop", "url");
          link.appendChild(button);
          this.$.space.appendChild(link);
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
      this.activeItemId = toJS(store.activeItem);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
    this.__disposer2();
  }
}
window.customElements.define(JosBreadcrumb.tag, JosBreadcrumb);
export { JosBreadcrumb };
