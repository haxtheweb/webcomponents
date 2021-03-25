import { LitElement, html, css } from "lit-element/lit-element.js";
import { autorun, toJS } from "mobx";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

class BootstrapMenu extends LitElement {
  constructor() {
    super();
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    this._bootstrapPath = basePath + "bootstrap/dist/css/bootstrap.min.css";
    this._manifestItems = {};
    autorun(() => {
      let storeManifestItems = toJS(store.manifest.items);
      if (this._manifestItems !== storeManifestItems) {
        this._manifestItems = storeManifestItems;
      }
    });
  }

  static get tag() {
    return "bootstrap-menu";
  }

  static get properties() {
    return {
      colorTheme: {
        type: String,
        reflect: true,
        attribute: "color-theme",
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          --simple-icon-color: #007bff;
        }

        .indent-0 {
          padding-left: 0px;
        }
        .indent-1,
        .indent-2 {
          padding-left: 16px;
        }
        .indent-3,
        .indent-4,
        .indent-5,
        .indent-6 {
          padding-left: 32px;
        }

        simple-icon-lite {
          transform: rotate(270deg);
        }
      `,
    ];
  }

  render() {
    return html`
      <link rel="stylesheet" href="${this._bootstrapPath}" />

      ${this._manifestItems.map((item) => {
        if (item.parent === null) {
          return html`
            <div class="indent-${item.indent}">
              <simple-icon-lite icon="arrow-drop-down"> </simple-icon-lite>
              <a href="${item.slug}"> ${item.title} </a>
            </div>
            ${item.children ? this.renderChildren(item) : ``}
          `;
        }
      })}
    `;
  }

  renderChildren(item) {
    return html`
      ${item.children.map((item) => {
        if (item.children) {
          this.renderChildren(item);
        } else {
          return html`
            <div class="indent-${item.indent}">
              <a href="${item.slug}"> ${item.title} </a>
            </div>
          `;
        }
      })}
    `;
  }

  getBasePath(url) {
    return url.substring(0, url.lastIndexOf("/@lrnwebcomponents/") + 1);
  }
}
customElements.define(BootstrapMenu.tag, BootstrapMenu);
export { BootstrapMenu };
