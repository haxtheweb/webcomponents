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
          --bootstrap-dark-theme-secondary-background-color: #343a40;
          margin-bottom: 10px;
          --simple-icon-height: 18px;
          --simple-icon-width: 18px;
          --simple-icon-color: #007bff;
        }

        button:hover {
          --simple-icon-color: white;
        }

        .container {
          display: flex;
          background-color: #e9ecef;
          border-radius: 5px;
          padding: 10px;
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
        }
        /* dark theme */
        :host([color-theme="1"]) {
          --simple-icon-color: #fff;
        }

        :host([color-theme="1"]) .btn {
          color: #fff;
          background-color: transparent;
          background-image: none;
          border-color: #6c757d;
        }

        :host([color-theme="1"]) .btn:hover {
          color: #fff;
          background-color: #6c757d;
          border-color: #6c757d;
        }

        :host([color-theme="1"]) .container {
          background-color: var(
            --bootstrap-dark-theme-secondary-background-color
          );
        }
      `,
    ];
  }

  static get properties() {
    return {
      _backwardItem: {
        type: Object,
        reflect: true,
      },
      _forwardItem: {
        type: Object,
        reflect: true,
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
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    this._bootstrapPath = basePath + "bootstrap/dist/css/bootstrap.min.css";
    this._forwardItem = {};
    this._backwardItem = {};
    this._activeItemIndex = -1;
    this._routerManifest = {};
    autorun(() => {
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
