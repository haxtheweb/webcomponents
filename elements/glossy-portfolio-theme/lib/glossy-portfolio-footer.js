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
      .wrapper{
        height: 300px;
        padding-top: 10px;
        background-color: #1d1d1d;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }

      .license{

      }

    `];
  }

openHamburger(){

}

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <div class="site-details">
    <p>Last updated: ${this.lastUpdated}</p>

    <p>© ${this.copyrightYear}</p>
  </div>

  <div class="license"> 
    <a href="${this.licenseLink}" target="_blank">
      <img src="${this.licenseImage}" alt="${this.licenseName}" />
    </a>
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