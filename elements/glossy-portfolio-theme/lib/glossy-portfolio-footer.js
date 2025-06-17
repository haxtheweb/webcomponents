/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { licenseList } from "@haxtheweb/license-element/license-element.js";

/**
 * `glossy-portfolio-footer`
 * 
 * @demo index.html
 * @element glossy-portfolio-footer
 */
export class GlossyPortfolioFooter extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "glossy-portfolio-footer";
  }

  constructor() {
    super();
    this.title = "Title";
    this.homeLink = "";
    this.__disposer = this.__disposer || [];
   
    // gets licensing stuff
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      let LList = new licenseList();
      if (this.manifest.license && LList[this.manifest.license]) {
        this.licenseName = LList[this.manifest.license].name;
        this.licenseLink = LList[this.manifest.license].link;
        this.licenseImage = LList[this.manifest.license].image;
        
      }

      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.lastUpdated = new Date(store.manifest.metadata.site.updated * 1000).toDateString();
      this.copyrightYear = new Date(store.manifest.metadata.site.created * 1000).getFullYear();
      this.__disposer.push(reaction);

    });

    

 
  }
  
  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      thumbnail: {type: String},
      link: {type: String},
      topItems: {type: Array},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      *{
        box-sizing: border-box;
      }
      .background{
        background-color: #161616;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .wrapper {
        height: var(--footer-height, 76px); /* Default height if not set */
        padding: var(--page-padding);
        padding-top: 20px;
        padding-bottom: 20px;
        display: grid;
        grid-template-columns: 1fr auto 1fr; /* Three columns: left, center, right */
        align-items: center;
        width: 100%;
        max-width: var(--max-width);

        
      }
      p {
        margin: 0;
        font-family: Inter;
        color: #ffffff97;
        font-size: 0.8rem;
        text-align: center; /* Center-align text inside the grid cell */
        font-weight: 300;
      }
      .item {
        justify-self: start; /* Align left-side text to the start */
        text-align: left; /* Ensure text is left-aligned */

      }
      .center {
        justify-self: center; /* Center-align the copyright text */
      }
      .license {
        justify-self: end; /* Align the license image to the end */
      }


    `];
  }


  // Lit render the HTML
  render() {
    return html`
<div class="background">
  <div class="wrapper">
      <p class="item"> Last updated: ${this.lastUpdated} </p>
      <p class="center">© ${this.copyrightYear}   </p>
    <div class="license item"> 
      <a href="${this.licenseLink}" target="_blank">
        <img src="${this.licenseImage}" alt="${this.licenseName}" />
      </a>
    </div>
  </div>
</div>


  `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(GlossyPortfolioFooter.tag, GlossyPortfolioFooter);