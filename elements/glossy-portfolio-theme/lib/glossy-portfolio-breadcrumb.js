/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SiteBreadcrumb } from "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

/**
 * `glossy-portfolio-breadcrumb`
 * 
 * @demo index.html
 * @element glossy-portfolio-breadcrumb
 */
export class GlossyPortfolioBreadcrumb extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "glossy-portfolio-breadcrumb";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        ol.breadcrumb{
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: row;
          font-family: inherit;
          font-size: 0.9rem;
          gap: 15px;
          list-style: ">";
        }

        ol.breadcrumb li a {
          /* padding-left: 7px; */
          font-size: 0.9rem;
          /* color: var(--link-color); */
          color: #ffffffa6;
          font-weight: 400;
        }
        ol.breadcrumb li {
          padding-left: 8px;
          font-size: 0.9rem;
          font-weight: 300;
        }

        ol.breadcrumb li a:hover {
        }
        ol.breadcrumb li::marker {
          font-size: 0.9rem;
          color: #aaaaaa;
        }
        ol.breadcrumb li:last-child a{
          color: white;
        }
        ol.breadcrumb li:last-child a:hover{
          text-decoration: none;
          cursor: default
        }
        ol.breadcrumb li:first-child::marker {
          content: "";
          
        }
        ol.breadcrumb li:first-child {
          padding-left: 0;
      
        }


      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */

  constructor() {
    console.log(1);
    super();
    this.__disposer = [];
    this.items = [];
    this.includeHome = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      home: "Home",
    };
  }
  // render function
  render() {
    console.log(1);
    return html` ${this.items.length > 0
      ? html`
          <ol
            class="breadcrumb"
            itemscope
            itemtype="https://schema.org/BreadcrumbList"
          >
            ${this.items.map(
              (item) =>
                html`<li
                  itemprop="itemListElement"
                  itemscope
                  itemtype="https://schema.org/ListItem"
                >
                  <a itemprop="item" href="${item.slug}">${item.title}</a>
                </li>`,
            )}
          </ol>
        `
      : ``}`;
  }

  static get properties() {
    return {
      ...super.properties,
      items: { type: Array },
      editMode: { type: Boolean, reflect: true, attribute: "edit-mode" },
      includeHome: { type: Boolean, reflect: true, attribute: "include-home" },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // keep editMode in sync globally
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this._activeItemChanged(toJS(store.activeItem));
      this.__disposer.push(reaction);
    });
  }
  /**
   * Notice the change and build
   */
  _activeItemChanged(active) {
    const activeItem = active;
    console.log(activeItem);
    if (activeItem && this.shadowRoot) {
      var items = [
        {
          title: activeItem.title,
          slug: activeItem.slug,
        },
      ];
      let itemBuilder = activeItem;
      let manifest = toJS(store.routerManifest);
      // walk back through parent tree
      while (itemBuilder && itemBuilder.parent != null) {
        itemBuilder = manifest.items.find((i) => i.id == itemBuilder.parent);
        // double check structure is sound
        if (itemBuilder) {
          items.unshift({
            title: itemBuilder.title,
            slug: itemBuilder.slug,
          });
        }
      }
      if (this.includeHome) {
        items.unshift({
          title: this.t.home,
          slug: store.homeLink,
        });
      }
      // don't display if we are the only thing in the trail bc there is no point
      if (!this.includeHome && items.length === 1) {
        this.items = [];
      }
      // ensure no trail on the home page if it matches the trail
      else if (
        this.includeHome &&
        items.length === 2 &&
        items[0].slug === items[1].slug
      ) {
        this.items = [];
      } else {
        this.items = [...items];
      }
    }
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
    
  }
    /**
   * haxProperties integration via file reference
   */
    static get haxProperties() {
      return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
        .href;
    }
}

globalThis.customElements.define(GlossyPortfolioBreadcrumb.tag, GlossyPortfolioBreadcrumb);