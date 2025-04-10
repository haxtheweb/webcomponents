/* eslint-disable no-console */
// dependencies / things imported
import { html, css, unsafeCSS } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

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
    this.showOptions = false;
    this.inprogress = false;
    this.textInfo = {};
    this.siteId = "";
    this.description = '';
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      showOptions: { type: Boolean },
      inprogress: { type: Boolean, reflect: true },
      textInfo: { type: Object },
      siteId: { type: String, reflect: true, attribute: "site-id" },
      title: { type: String },
        description: { type: String },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
  }

  toggleOptionsMenu() {
    this.showOptions = !this.showOptions;
  }
  copySite() {
    console.log("Copy clicked");
    // implement logic
  }
  
  downloadSite() {
    console.log("Download clicked");
    // implement logic
  }
  
  archiveSite() {
    console.log("Archive clicked");
    // implement logic
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          text-align: left;
          max-width: 240px;
          margin: 16px;
          font-family: var(--ddd-font-primary);
          color: var(--ddd-theme-default-nittanyNavy);
          background-color: white;
          min-height: 240px;
          box-shadow: var(--ddd-boxShadow-lg);
          border-radius: 8px;
        }
        #mainCard {
          display: flex;
          flex-direction: column;
        }
        .cardContent {
          padding: 12px 16px 20px;
        }
        .imageLink img {
          width: 220px;
          height: 125px;
          border-top-right-radius: 8px;
          border-top-left-radius: 8px;
          border-bottom: solid var(--ddd-theme-default-nittanyNavy) 12px;
          overflow: clip;
          justify-self: center;
        }
        .imageLink {
          position: relative;
          display: inline-block;
        }
        .settings-button {
          position: relative;
          display: inline-block;
          align-self: center;
        }

        .options-menu {
          position: absolute;
          top: -110px;
          right: 0;
          background: var(--haxcms-color-ui-white, #fff);
          border: 1px solid var(--haxcms-color-ui-1, #ccc);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          border-radius: 8px;
          padding: 8px 8px 6px 10px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow:visible;
        }
        .options-menu simple-icon-button-lite {
          margin: 4px 0;
        }

        .titleBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20px;
          color: var(--ddd-theme-default-nittanyNavy);
        }
        p {
          font-size: 12px;
          padding: 8px 8px 6px 10px;
        }
        ::slotted([slot="heading"]) {
          font-size: 20px;
          font-weight: bold;
          color: var(--ddd-theme-default-nittanyNavy);
          text-decoration: none;
          display: block;
        }
        button {
          display: flex;
          background-color: white;
          color: var(--ddd-theme-default-nittanyNavy);
          border: 2px solid var(--ddd-theme-default-nittanyNavy);
          border-radius: 4px;
          font-family: var(--ddd-font-primary);
          font-size: 12px;
          font-weight: 20px;
          padding: 12px 16px 12px 24px;
          height: 16px;
          align-items: center;
          justify-content: center;
        }
        .cardBottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 8px 6px 10px;
        }
        .cardBottom button{
        flex: 1;
        margin: 0 4px;
        }
        ::slotted(a[slot="heading"]),
        ::slotted(span[slot="subHeading"]),
        ::slotted(div[slot="pre"]) {
          display: block;
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
        <div class="imageLink">
          <img src="https://image.freepik.com/free-vector/programming-website-landing-page_23-2148452312.jpg">
        </div>
        
        <div class="cardContent">
          <div class="titleBar">
            <slot name="heading"></slot>
            <div class="settings-button">
              <simple-tooltip for="settingsIcon" position="top" animation-delay="0">
                Options
              </simple-tooltip>
              <simple-icon-button-lite
                id="settingsIcon"
                icon="hax:settings"
                @click="${this.toggleOptionsMenu}"
                aria-label="Open options"
              ></simple-icon-button-lite>

              ${this.showOptions
                ? html`
                  <div class="options-menu">
                    <span @click="${this.copySite}">
                      <simple-icon-button-lite icon="content-copy" title="Copy"></simple-icon-button-lite>
                      Copy
                    </span>
                    <span @click="${this.downloadSite}">
                      <simple-icon-button-lite icon="file-download" title="Download"></simple-icon-button-lite>
                      Download
                    </span>
                    <span @click="${this.archiveSite}">
                      <simple-icon-button-lite icon="archive" title="Archive"></simple-icon-button-lite>
                      Archive
                    </span>
                  </div>
                `
                : ''}
            </div>
          </div>
          
          <slot name="pre"></slot>
          
          <div class="cardBottom"> 
            <button class="open" @click=${() => window.open(this.siteUrl, "_blank")}>
              Open
            </button>
          </div>
        </div>
        
      </div>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
}
customElements.define(AppHaxSiteBars.tag, AppHaxSiteBars);
