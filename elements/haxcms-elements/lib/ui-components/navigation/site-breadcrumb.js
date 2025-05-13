/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDBreadcrumb } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";

/**
 * `site-breadcrumb`
 * `A basic breadcrumb of links based on the active state in HAXcms on JSON Outline Schema`
 *
 * @demo demo/index.html
 */
class SiteBreadcrumb extends HAXCMSI18NMixin(DDD) {
  static get styles() {
    return [
      super.styles,
      DDDBreadcrumb,
      css`
        :host {
          display: block;
        }
        ol.breadcrumb {
          font-weight: var(--ddd-font-weight-light);
          margin: var(--site-breadcrumb-margin, var(--ddd-spacing-6) 0);
          padding: 0;
          pointer-events: auto;
          font-size: var(
            --site-breadcrumb-font-size,
            var(--ddd-font-size-4xs, 16px)
          );
          list-style: "/";
          gap: var(--ddd-spacing-2);
          display: flex;
          flex-flow: row;
          color: var(--ddd-theme-default-link);
          line-height: normal;
          text-align: start;
        }
        ol.breadcrumb li {
          font-size: var(
            --site-breadcrumb-font-size,
            var(--ddd-font-size-4xs, 16px)
          );
        }
        ol.breadcrumb li a {
          vertical-align: text-top;
          display: inline-block;
          padding: 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-regular);
          text-decoration: none;
          font-size: var(
            --site-breadcrumb-font-size,
            var(--ddd-font-size-4xs, 16px)
          );
          color: var(
            --site-breadcrumb-color,
            var(--ddd-theme-default-link, #383f45)
          );
        }
        ol.breadcrumb li a:hover,
        ol.breadcrumb li a:focus,
        ol.breadcrumb li a:active {
          color: var(
            --site-breadcrumb-color-hover,
            var(--ddd-theme-default-link, #383f45)
          );
          text-decoration: underline;
          text-decoration-color: var(--site-breadcrumb-decoration-color-hover, var(--ddd-theme-default-link, #383f45));
          text-decoration-thickness: 2px;
          text-underline-offset: 2px;
          text-underline-position: under;
        }
        ol.breadcrumb li:first-child a {
          padding-left: 0;
        }
        ol.breadcrumb li:last-child a {
          color: var(--site-breadcrumb-last-color, black);
          pointer-events: none;
        }

        ol.breadcrumb li::marker {
          color: var(--site-breadcrumb-separator-color, light-dark(black, white));
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-breadcrumb";
  }
  constructor() {
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
}
customElements.define(SiteBreadcrumb.tag, SiteBreadcrumb);
export { SiteBreadcrumb };
