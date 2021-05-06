import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

class BootstrapFooter extends LitElement {
  static get tag() {
    return "bootstrap-footer";
  }

  static get styles() {
    return [
      css`
        :host {
          margin-bottom: 10px;
          --simple-icon-height: 18px;
          --simple-icon-width: 18px;
          --simple-icon-color: var(--haxcms-color, #007bff);
        }
        .btn-outline-primary {
          color: var(--haxcms-color, #007bff);
          border-color: var(--haxcms-color, #007bff);
        }

        .btn-outline-primary:active,
        .btn-outline-primary:focus,
        .btn-outline-primary:hover {
          --simple-icon-color: white;
          color: #fff;
          background-color: var(--haxcms-color, #007bff);
          border-color: var(--haxcms-color, #007bff);
        }

        .container {
          display: flex;
          background-color: #e9ecef;
          border-radius: 5px;
          padding: 10px;
          -moz-box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 10%);
          -webkit-box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 10%);
          box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 10%);
        }

        .forward {
          margin-left: auto;
        }

        .backward {
          margin-right: auto;
        }

        simple-icon-lite {
          margin-bottom: 3px;
        }

        a {
          text-decoration: none;
          color: var(--haxcms-color, #007bff);
        }
        /* dark theme */
        :host([color-theme="1"]) {
          --simple-icon-color: var(--bootstrap-theme-dark-color);
        }

        :host([color-theme="1"]) .btn {
          color: var(--bootstrap-theme-dark-color);
          background-color: transparent;
          background-image: none;
          border-color: #6c757d;
        }

        :host([color-theme="1"]) .btn:hover {
          color: var(--bootstrap-theme-dark-color);
          background-color: #6c757d;
          border-color: #6c757d;
        }

        :host([color-theme="1"]) .container {
          background-color: var(
            --bootstrap-theme-dark-secondary-background-color
          );
          -moz-box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
          -webkit-box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
          box-shadow: inset 0 2px 4px 0
            rgb(var(--bootstrap-theme-light-secondary-background-color), 0.7);
        }
        /* palenight theme */
        :host([color-theme="2"]) {
          --simple-icon-color: var(--bootstrap-theme-palenight-color);
        }

        :host([color-theme="2"]) .btn {
          color: var(--bootstrap-theme-palenight-color);
          background-color: transparent;
          background-image: none;
          border-color: #6c757d;
        }

        :host([color-theme="2"]) .btn:hover {
          color: var(--bootstrap-theme-palenight-color);
          background-color: #6c757d;
          border-color: #6c757d;
        }

        :host([color-theme="2"]) .container {
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
      `,
    ];
  }

  static get properties() {
    return {
      _backwardItem: {
        type: Object,
      },
      _forwardItem: {
        type: Object,
      },
      colorTheme: {
        type: String,
        attribute: "color-theme",
      },
    };
  }

  constructor() {
    super();
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    this._bootstrapPath = basePath + "bootstrap/dist/css/bootstrap.min.css";
    this._forwardItem = {};
    this._backwardItem = {};
    this._activeItemIndex = -1;
    this._routerManifest = {};
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      let storeActiveItemIndex = toJS(store.activeManifestIndex);
      let storeRouterManifest = toJS(store.routerManifest);
      if (
        this._activeItem !== storeActiveItemIndex ||
        this._routerManifest !== storeRouterManifest
      ) {
        this._activeItem = storeActiveItemIndex;
        this._routerManifest = storeRouterManifest;
        if (storeRouterManifest.items[storeActiveItemIndex - 1]) {
          this._backwardItem =
            storeRouterManifest.items[storeActiveItemIndex - 1];
        }
        if (storeRouterManifest.items[storeActiveItemIndex + 1]) {
          this._forwardItem =
            storeRouterManifest.items[storeActiveItemIndex + 1];
        }
      }
      this.__disposer.push(reaction);
    });
  }

  render() {
    return html`
      <link rel="stylesheet" href="${this._bootstrapPath}" />
      <div class="container">
        <a class="backward" href="${this._backwardItem.slug}">
          <button class="btn btn-outline-primary">
            <simple-icon-lite icon="av:fast-rewind"></simple-icon-lite>
            ${this._backwardItem.title}
          </button>
        </a>
        <a class="forward" href="${this._forwardItem.slug}">
          <button class="btn btn-outline-primary forward">
            ${this._forwardItem.title}
            <simple-icon-lite icon="av:fast-forward"></simple-icon-lite>
          </button>
        </a>
      </div>
    `;
  }

  getBasePath(url) {
    return url.substring(0, url.lastIndexOf("/@lrnwebcomponents/") + 1);
  }
}

customElements.define(BootstrapFooter.tag, BootstrapFooter);
export { BootstrapFooter };
