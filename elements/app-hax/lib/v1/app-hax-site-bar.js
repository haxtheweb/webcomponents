/* eslint-disable no-console */
// dependencies / things imported
import { html, css, unsafeCSS } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { animate } from "@lit-labs/motion";

const DropDownBorder = new URL(
  "../assets/images/DropDownBorder.svg",
  import.meta.url,
);
// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class AppHaxSiteBars extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-bar";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.icon = "link";
    this.opened = false;
    this.inprogress = false;
    this.iconLink = "/";
    this.textInfo = {};
    this.siteId = "";
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      opened: { type: Boolean, reflect: true },
      icon: { type: String },
      inprogress: { type: Boolean, reflect: true },
      iconLink: { type: String, attribute: "icon-link" },
      textInfo: { type: Object },
      siteId: { type: String, reflect: true, attribute: "site-id" },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "opened" && oldValue !== undefined) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --main-banner-width: 513px;
          --main-banner-height: 60px;
          --band-banner-height: 208px;
          display: inline-block;
          background-color: var(--simple-colors-default-theme-accent-3);
          color: var(--simple-colors-default-theme-grey-12);
          border-color: var(--simple-colors-default-theme-accent-4);
          border-style: solid;
          border-width: 5px 10px 5px 10px;
        }

        #labels {
          display: block;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        #labels ::slotted(*) {
          font-family: "Press Start 2P", sans-serif;
          font-size: 25px;
        }
        #labels ::slotted(a) {
          color: var(--simple-colors-default-theme-accent-11);
          padding: 8px 0;
          display: block;
        }
        #labels ::slotted(a:focus),
        #labels ::slotted(a:hover) {
          color: var(--simple-colors-default-theme-accent-3);
          background-color: var(--simple-colors-default-theme-accent-11);
        }

        :host([opened]) {
          background-color: var(--simple-colors-default-theme-accent-3);
        }
        #mainCard {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: var(--main-banner-width);
          height: var(--main-banner-height);
          padding: 2px 4px;
        }

        #band-container {
          display: block;
          visibility: hidden;
          height: 1px;
          width: var(--main-banner-width);
        }

        :host([opened]) #band-container {
          height: var(--band-banner-height);
          visibility: visible;
        }
        a {
          flex: 1;
        }
        #labels {
          flex: 6;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        #icon {
          --simple-icon-width: 49px;
          --simple-icon-height: 49px;
          color: var(--simple-colors-default-theme-accent-11);
        }
        #icon:hover,
        #icon:focus,
        #icon:active {
          color: var(--simple-colors-default-theme-accent-3);
          background-color: var(--simple-colors-default-theme-accent-11);
        }
        #dots {
          --simple-icon-width: 49px;
          --simple-icon-height: 49px;
          color: var(--simple-colors-default-theme-grey-12);
          background-image: url(${unsafeCSS(DropDownBorder)});
          background-repeat: no-repeat;
          background-position: center;
        }
        @media (max-width: 640px) {
          :host {
            --main-banner-height: 40px;
            --band-banner-height: 140px;
          }
          #icon,
          #dots {
            --simple-icon-width: 30px;
            --simple-icon-height: 30px;
          }
          #mainCard {
            padding: 0;
          }
        }
      `,
    ];
  }

  __clickButton() {
    this.opened = !this.opened;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div id="mainCard">
        <a href="${this.iconLink}" tabindex="-1" id="icon">
          <simple-icon-button-lite
            icon="${this.icon}"
          ></simple-icon-button-lite>
        </a>
        <div id="labels">
          <slot name="heading"></slot>
        </div>
        <simple-icon-button-lite
          icon="more-vert"
          id="dots"
          @click=${this.__clickButton}
        ></simple-icon-button-lite>
      </div>
      <div id="band-container" ${animate()}>
        <slot name="band"></slot>
      </div>
      <simple-tooltip for="icon" position="left">Access site</simple-tooltip>
      <simple-tooltip for="dots" position="right">More options</simple-tooltip>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
}
customElements.define(AppHaxSiteBars.tag, AppHaxSiteBars);
