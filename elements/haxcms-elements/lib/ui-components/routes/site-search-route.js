/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js";

/**
 * `site-search-route`
 * `Route for displaying search UI and results`
 *
 * @demo demo/index.html
 */
export class SiteSearchRoute extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-search-route";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: 0 auto;
          max-width: 1000px;
          padding: var(--ddd-spacing-6);
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      search: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.HAXCMSI18NMixinBase = "../../../";
    this.search = "";
    this.__disposer = [];
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(store.currentRouterLocation);
        Promise.resolve().then(() => {
          const currentLocation = _mobx_val_0;
          let locationSearch = globalThis.location.search;
          if (
            currentLocation &&
            typeof currentLocation.search === "string" &&
            currentLocation.search !== ""
          ) {
            locationSearch = currentLocation.search;
          }
          const params = new URLSearchParams(locationSearch);
          this.search = params.get("search") || "";
        });
      }),
    );
  }

  render() {
    return html`<site-search .search="${this.search}"></site-search>`;
  }

  disconnectedCallback() {
    for (var i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    super.disconnectedCallback();
  }
}

globalThis.customElements.define(SiteSearchRoute.tag, SiteSearchRoute);
