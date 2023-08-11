/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { HAXCMSI18NMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import "@lrnwebcomponents/simple-fields/lib/simple-tags.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import { loadViewsForm, mediaKeys } from "@lrnwebcomponents/haxcms-elements/lib/ui-components/magic/site-view.js";

/**
 * `site-uuid-link`
 * `UUID to render an accurate link and title in the site`
 *
 * @demo demo/index.html
 */
export class SiteViewsRoute extends HAXCMSI18NMixin(LitElement) {
  static get tag() {
    return "site-views-route";
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: 16px;
        }
        h3 {
          margin: 4px 0;
          padding: 0;
        }
        a {
          text-decoration: none;
          font-size: 16px;
        }
        [data-active] {
          background-color: var(--simple-colors-default-theme-accent-1);
        }
        simple-icon-button-lite {
          border-radius: 0;
          font-size: 16px;
        }
        /* list display */
        .list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .list-item {
          margin: 0;
          padding: 16px;
          border-bottom: 1px solid var(--simple-colors-default-theme-grey-3);
        }
        .list-item:hover {
          background-color: var(--simple-colors-default-theme-grey-2);
        }
        .list-link a {
          font-size: 32px;
        }
        .list-breadcrumb {
          font-size: 10px;
        }

        .overview {
          padding: 0;
          margin: 0;
          list-style: none;
          font-size: 12px;
        }
    `];
  }

  constructor() {
    super();
    this.search = window.location.search;
    this.t = super.t || {};
    this.t = {
      ...this.t,
      selectPage: "Select Page",
      title: "Title",
      parent: "Parent",
      block: "Block",
      tags: "Tags",
    }
    this.loading = false;
    this.params = {
      display: "list",
      displayOf: "title",
    };
    this._searchDebounce = null;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot.querySelector('#schema').fields = loadViewsForm();
    setTimeout(() => {
      this.shadowRoot.querySelector('#schema').value = {
        settings: {
          displayFormat: {
            displayedAs: this.params.display || "list",
            displayOf: this.params.displayOf || "title",
          },
          filters: {
            title: this.params.title || "",
            parent: this.params.parent || "",
            tags: this.params.tags ? this.params.tags : "",
            blockFilter: this.params.blockFilter || ""
          }
        }
      };
    }, 0);

  }

  formValuesChanged(e) {
    clearTimeout(this._formDebounce);
    this._formDebounce = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const settings = e.detail.value.settings;
      if (settings && settings.displayFormat && settings.filters) {
        if (settings.displayFormat.displayedAs) {
          params.set('display', settings.displayFormat.displayedAs);
        }
        if (settings.displayFormat.displayOf) {
          params.set('displayOf', settings.displayFormat.displayOf);
          if (this.shadowRoot.querySelector('#schema').formElements["settings.filters.blockFilter"]) {
            this.shadowRoot.querySelector('#schema').formElements["settings.filters.blockFilter"].element.hidden = (settings.displayFormat.displayOf !== "blocks"); 
          }
        }
        if (settings.filters.title) {
          params.set('title', settings.filters.title);
        }
        else {
          params.delete('title');
        }
        if (settings.filters.parent && settings.filters.parent != "null") {
          params.set('parent', settings.filters.parent);
        }
        else {
          params.delete('parent');
        }
        if (settings.filters.tags) {
          params.set('tags', settings.filters.tags);
        }
        else {
          params.delete('tags');
        }
        if (settings.filters.blockFilter && settings.displayFormat.displayOf === "blocks") {
          let bf = settings.filters.blockFilter;
          if (parseInt(bf) && mediaKeys[parseInt(bf)]) {
            bf = mediaKeys[bf];
          }
          params.set('blockFilter', bf);
        }
        else {
          params.delete('blockFilter');
        }
        window.history.pushState({}, "", decodeURIComponent(`./x/views?${params}`));
        this.search = `?${decodeURIComponent(params)}`;
      }
    }, 600);
  }

  iconForDisplay(display) {
    switch(display) {
      case "list":
        return "hax:module";
      case "table":
        return "editable-table:col-striped";
      case "card":
        return "image:grid-on";
      case "contentplayer":
        return "hax:multimedia";
      default:
        return "hax:module";
    }
  }

  render() {
    return html`
<grid-plate cols="1-1" disable-responsive>
  <div slot="col-1">
    <form id="form"><simple-fields id="schema" @value-changed="${this.formValuesChanged}"></simple-fields></form>
  </div>
  <div slot="col-2">
    <ul class="overview">
      <li>Display:
        <simple-icon-lite icon="${this.iconForDisplay(this.params.display)}"></simple-icon-lite>
        ${this.params.display} of ${this.params.displayOf}
      </li>
      <li>Filters:
        <ul>
          ${this.params.title ? html`<li>${this.t.title}: ${this.params.title}</li>` : nothing}
          ${this.params.parent ? html`<li>${this.t.parent}: ${this.params.parent}</li>` : nothing}
          ${this.params.tags ? html`<li>${this.t.tags}: ${this.params.tags}</li>` : nothing}
          ${this.params.blockFilter ? html`<li>${this.t.block}: ${this.params.blockFilter}</li>` : nothing}
        </ul>
      </li>
    </ul>
  </div>
</grid-plate>
${this.loading ? html`<h3>Loading...</h3>` : html`<h3>Results <simple-icon-button-lite icon="refresh" @click="${this.refreshData}">Refresh</simple-icon-button-lite></h3>`}
<site-view search="${this.search}" @loading-changed="${this.syncLoad}"></site-view>
    <slot></slot>`;
  }

  refreshData(e) {
    this.shadowRoot.querySelector('site-view').rebuildSearchResults();
  }

  syncLoad(e) {
    this.loading = e.detail.value;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "search" && oldValue && this.search) {
        const rawParams = new URLSearchParams(this.search);
        const searchParams = Object.fromEntries(rawParams);
        this.params = searchParams;
        // ensure display is always stateful even if not directly set
        if (!searchParams.display) {
          rawParams.set('display', this.params.display || 'list');
          window.history.replaceState({}, "", decodeURIComponent(`./x/views?${rawParams}`));
        }
      }
      // change if tag changes, always change if coming to or from media since it's a larger query
      if (propName === "params" && oldValue && this.params && this.shadowRoot) {
        this.shadowRoot.querySelector('site-view').rebuildSearchResults();
      }
    });
  }

  static get properties() {
    return {
      ...super.properties,
      loading: {
        type: Boolean,
        reflect: true
      },
      params: {
        type: Object,
      },
      search: {
        type: String
      }
    }
  }
}

customElements.define(SiteViewsRoute.tag, SiteViewsRoute);