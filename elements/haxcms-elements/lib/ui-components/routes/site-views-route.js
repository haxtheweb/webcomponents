/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";
import "@lrnwebcomponents/simple-fields/lib/simple-tags.js";
import { autorun, toJS } from "mobx";
/**
 * `site-uuid-link`
 * `UUID to render an accurate link and title in the site`
 *
 * @demo demo/index.html
 */
export class SiteViewsRoute extends LitElement {
  static get tag() {
    return "site-views-route";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        a {
          text-decoration: none;
        }
    `];
  }

  constructor() {
    super();
    this.loading = false;
    this.results = [];
    this._debounce = null;
    enableServices(["haxcms"]);
    autorun(() => {
      const routerLocation = store.currentRouterLocation;
      clearTimeout(this._debounce);
      this._debounce = setTimeout(async () => {
        if (!this.loading && store.getInternalRoute() === "views") {
          const searchParams = Object.fromEntries(new URLSearchParams(location.search));
          const site = toJS(store.manifest);
          let base = document.querySelector("base").href;
          if (!base) {
            base = '/';
          }
          const params = {
            type: "site",
            site: {
              file: base + "site.json",
              id: site.id,
              title: site.title,
              author: site.author,
              description: site.description,
              license: site.license,
              metadata: site.metadata,
              items: site.items,
            },
            link: base,
            ...searchParams
          };
          this.loading = true;
          const response = await MicroFrontendRegistry.call(
            "@haxcms/views",
            params
          );
          if (response.data) {
            this.results = response.data;
          }
          this.loading = false;
        }        
      }, 0);
    });
  }

  render() {
    return html`
      ${this.loading ? html`<h3>Loading...</h3>` : html`<h3>Results</h3>
${this.results.map(
        (item) => html`
        <div>
          <a href="${item.slug}">${item.title}</a>
          ${item.metadata.tags && item.metadata.tags != "" ? item.metadata.tags
          .split(",")
          .map(
            (tag) => html`<a href="x/views?tag=${tag.trim()}">
            <simple-tag
              auto-accent-color
              value="${tag.trim()}"
              accent-color="${item.accentColor}"
            ></simple-tag></a>`
          )
      : ``}
        </div>
      `)}`}
      <slot></slot>
    `;
  }

  activateView(e) {
     const params = new URLSearchParams(window.location.search);
     params.set('tag', e.target.value);
     window.history.pushState({}, "", decodeURIComponent(`./x/views?${params}`));
  }

  static get properties() {
    return {
      results: {
        type: Array,
      },
      loading: {
        type: Boolean,
        reflect: true
      }
    }
  }
}

customElements.define(SiteViewsRoute.tag, SiteViewsRoute);