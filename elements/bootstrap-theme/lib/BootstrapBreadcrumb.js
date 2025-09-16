/**
 * Copyright 2021 collinkleest
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

/**
 * `bootstrap-breadcrumb`
 * `Breadcrumb element for bootstrap theme`
 * @demo demo/index.html
 * @element bootstrap-breadcrumb
 */
class BootstrapBreadcrumb extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          --bootstrap-dark-theme-secondary-background-color: #343a40;
          --simple-icon-height: 18px;
          --simple-icon-width: 18px;
          --simple-icon-color: #007bff;
        }
        a {
          color: #007bff;
        }

        .container {
          background-color: #e9ecef;
          border-radius: 5px;
        }

        .breadcrumb {
          -moz-box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 10%);
          -webkit-box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 10%);
          box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 10%);
          list-style-type: none;
          display: flex;
        }
        .breadcrumb-item {
          padding: 0.5rem 0.75rem;
        }

        simple-icon-lite {
          margin-bottom: 5px;
        }

        a:hover simple-icon-lite {
          text-decoration: underline;
        }

        /* dark mode */
        :host([color-theme="1"]) {
          --simple-icon-color: #999;
        }

        :host([color-theme="1"]) simple-icon-lite:hover {
          --simple-icon-color: #fff;
        }

        :host([color-theme="1"]) .breadcrumb {
          background-color: var(
            --bootstrap-dark-theme-secondary-background-color
          );
          -moz-box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
          -webkit-box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
          box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
        }

        :host([color-theme="1"]) .container {
          background-color: var(
            --bootstrap-dark-theme-secondary-background-color
          );
        }

        :host([color-theme="1"]) a {
          color: #999;
        }

        :host([color-theme="1"]) a:hover {
          color: #fff;
        }

        /* palenight theme */
        :host([color-theme="2"]) {
          --simple-icon-color: var(--bootstrap-theme-palenight-color);
        }

        :host([color-theme="2"]) simple-icon-lite:hover {
          --simple-icon-color: var(--bootstrap-theme-palenight-color);
        }

        :host([color-theme="2"]) .breadcrumb {
          background-color: var(
            --bootstrap-theme-palenight-secondary-background-color
          );
          -moz-box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
          -webkit-box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
          box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
        }

        :host([color-theme="2"]) .container {
          background-color: var(
            --bootstrap-theme-palenight-secondary-background-color
          );
        }

        :host([color-theme="2"]) a {
          color: var(--bootstrap-theme-palenight-color);
        }

        :host([color-theme="2"]) a:hover {
          color: var(--bootstrap-theme-palenight-color);
        }
        
        .visually-hidden {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
      `,
    ];
  }

  static get tag() {
    return "bootstrap-breadcrumb";
  }

  static get properties() {
    return {
      items: {
        type: Array,
      },
      homeItem: {
        type: Object,
      },
      colorTheme: {
        type: String,
        reflect: true,
        attribute: "color-theme",
      },
    };
  }

  constructor() {
    super();
    this.items = [];
    this._activeItem = {};
    this.homeItem = {};
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    this._bootstrapPath = basePath + "bootstrap/dist/css/bootstrap.min.css";
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      let manifestHomeItem = toJS(store.manifest.items[0]);
      let storeActiveItem = toJS(store.activeItem);
      // check if home item has changed, if it has set new home item
      if (this.homeItem !== manifestHomeItem) {
        this.homeItem = manifestHomeItem;
      }
      // check if we have a new active item
      // if so we clear our items array, set a new activeItem, push it to the items array
      // then check for a parent, if a parent is present call recursive function that keeps adding subsequent parents
      if (storeActiveItem && this._activeItem !== storeActiveItem) {
        this.items = [];
        this._activeItem = storeActiveItem;
        this.items.push(storeActiveItem);
        if (storeActiveItem.parent) {
          this.addParentToItems(storeActiveItem);
        }
      }
      this.__disposer.push(reaction);
    });
  }

  render() {
    return html`
      <link rel="stylesheet" href="${this._bootstrapPath}" />
      <div class="container p-0 mb-3">
        <nav aria-label="Breadcrumb navigation">
          <ol class="breadcrumb m-auto">
            <li
              class="breadcrumb-item"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="${this.homeItem.title}"
            >
              <a href="${this.homeItem.slug}" aria-label="Navigate to home page">
                <simple-icon-lite accent-color="blue" icon="home" aria-hidden="true">
                </simple-icon-lite>
                <span class="visually-hidden">Home</span>
              </a>
            </li>
            ${this.items.map(
              (item, index) => {
                const isLast = index === this.items.length - 1;
                return html`
                  <li
                    class="breadcrumb-item ${isLast ? 'active' : ''}"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="${item.title}"
                    ${isLast ? 'aria-current="page"' : ''}
                  >
                    ${isLast 
                      ? html`<span>${item.title}</span>`
                      : html`<a href="${item.slug}" aria-label="Navigate to ${item.title}">${item.title}</a>`
                    }
                  </li>
                `;
              }
            )}
          </ol>
        </nav>
      </div>
    `;
  }

  getBasePath(url) {
    return url.substring(0, url.lastIndexOf("/@haxtheweb/") + 1);
  }

  // gets parents item by the items id
  getParentById(parentId) {
    let elementPos = store.manifest.items
      .map((item) => {
        return toJS(item.id);
      })
      .indexOf(parentId);
    let parentFound = toJS(store.manifest.items[elementPos]);
    return parentFound;
  }

  // recursive function that keeps adding parents to items array
  addParentToItems(item) {
    let parentItem = this.getParentById(item.parent);
    this.items.unshift(parentItem);
    if (parentItem.parent) {
      this.addParentToItems(parentItem);
    }
  }

  firstUpdated(changedProperties) {}

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
globalThis.customElements.define(BootstrapBreadcrumb.tag, BootstrapBreadcrumb);
export { BootstrapBreadcrumb };
