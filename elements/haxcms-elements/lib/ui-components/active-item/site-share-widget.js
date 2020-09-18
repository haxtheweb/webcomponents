import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { varGet } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/social-media-icons/social-media-icons.js";
import "web-social-share/dist/esm/web-social-share.entry.js";
import {
  a as patchEsm,
  b as bootstrapLazy,
} from "web-social-share/dist/esm/index-bef2383e.js";

const defineCustomElements = (win, options) => {
  return patchEsm().then(() => {
    bootstrapLazy(
      [
        [
          "web-social-share",
          [[1, "web-social-share", { show: [1028], share: [16] }]],
        ],
      ],
      options
    );
  });
};
class SiteShareWidget extends LitElement {
  static get tag() {
    return "site-share-widget";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        paper-icon-button {
          color: #ffffff;
          background-color: var(--site-share-widget-bg);
          padding: 8px;
          margin: 0 0 0 4px;
          border-radius: 50%;
        }
        web-social-share {
          --web-social-share-zindex: 10000;
        }
        iron-icon {
          display: block;
          color: var(--haxcms-color, #000000);
        }
        iron-icon:hover {
          display: block;
          color: #ffffff;
          background-color: var(--haxcms-color, #000000);
        }
      `,
    ];
  }
  render() {
    return html`
      <paper-icon-button
        @click="${this.click}"
        title="${this.alt}"
        icon="${this.icon}"
      ></paper-icon-button>
      <web-social-share .share="false">
        <iron-icon slot="facebook" icon="social-media:facebook"></iron-icon>
        <iron-icon slot="twitter" icon="social-media:twitter"></iron-icon>
        <iron-icon slot="pinterest" icon="social-media:pinterest"></iron-icon>
        <iron-icon slot="linkedin" icon="social-media:linkedin"></iron-icon>
        <iron-icon slot="email" icon="icons:mail"></iron-icon>
        <iron-icon slot="copy" icon="icons:content-copy"></iron-icon>
      </web-social-share>
    `;
  }
  constructor() {
    super();
    defineCustomElements(window);
    this.alt = "Share page";
    this.icon = "social:share";
    this.activeGitFileLink = "";
    this.__disposer = [];
    autorun((reaction) => {
      if (store.activeItem) {
        this.activeItem = toJS(store.activeItem);
      }
      this.__disposer.push(reaction);
    });
  }
  /**
   * Callback for clicking the button
   */
  click(e) {
    if (this.shadowRoot && this.shadowRoot.querySelector("web-social-share")) {
      const location = window.location.href;
      const email = varGet(store, "manifest.metadata.author.email", "");
      const share = {
        displayNames: true,
        config: [
          {
            facebook: {
              socialShareUrl: location,
              socialSharePopupWidth: 400,
              socialSharePopupHeight: 400,
            },
          },
          {
            twitter: {
              socialShareUrl: location,
              socialSharePopupWidth: 300,
              socialSharePopupHeight: 400,
            },
          },
          {
            linkedin: {
              socialShareUrl: location,
            },
          },
          {
            pinterest: {
              socialShareUrl: location,
            },
          },
          {
            email: {
              socialShareTo: email,
              socialShareBody: location,
            },
          },
          {
            copy: {
              socialShareUrl: location,
            },
          },
        ],
      };
      this.shadowRoot.querySelector("web-social-share").share = share;
    }
    this.shadowRoot.querySelector("web-social-share").show = true;
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  static get properties() {
    return {
      activeItem: { type: Object },
      show: { type: Boolean },
      alt: { type: String },
      icon: { type: String },
    };
  }
}

window.customElements.define(SiteShareWidget.tag, SiteShareWidget);
export { SiteShareWidget };
