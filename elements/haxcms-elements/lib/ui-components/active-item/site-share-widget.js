import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { varGet } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { defineCustomElements } from "web-social-share/dist/esm/loader.js";

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
        simple-icon-button {
          color: #ffffff;
          background-color: var(--site-share-widget-bg);
          padding: 8px;
          margin: 0 0 0 4px;
          border-radius: 50%;
        }
        web-social-share {
          --web-social-share-zindex: 10000;
        }
        simple-icon {
          display: block;
        }
        simple-icon:hover {
          box-shadow: 0 0 20px var(--haxcms-color, #000000);
        }
      `,
    ];
  }
  render() {
    return html`
      <simple-icon-button
        @click="${this.click}"
        title="${this.alt}"
        icon="${this.icon}"
        dark
      ></simple-icon-button>
      <web-social-share share="false">
        <simple-icon slot="facebook" icon="mdi-social:facebook"></simple-icon>
        <simple-icon slot="twitter" icon="mdi-social:twitter"></simple-icon>
        <simple-icon slot="pinterest" icon="mdi-social:pinterest"></simple-icon>
        <simple-icon slot="linkedin" icon="mdi-social:linkedin"></simple-icon>
        <simple-icon slot="email" icon="icons:mail"></simple-icon>
        <simple-icon slot="copy" icon="icons:content-copy"></simple-icon>
      </web-social-share>
    `;
  }
  constructor() {
    super();
    defineCustomElements(globalThis);
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
      const location = globalThis.location.href;
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

customElements.define(SiteShareWidget.tag, SiteShareWidget);
export { SiteShareWidget };
