/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `site-tags-route`
 * `Route for displaying tags of a site`
 *
 * @demo demo/index.html
 */
export class SiteTagsRoute extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-tags-route";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-size: 16px;
        }

        simple-tag {
          margin: 0 4px 4px 0;
          cursor: pointer;
        }
        
      `,
    ];
  }

  constructor() {
    super();
    this.HAXCMSI18NMixinBase = "../../../";
    this.search = globalThis.location.search;
    this.t.tags = "Tags";
    this.filteredItems = [];
    this.resultsTags = [];
  }

  _tagClick(e) {
    let tag = e.target.value;
    const rawParams = new URLSearchParams(this.search);
    rawParams.set("tag", tag.trim());
    globalThis.history.replaceState(
      {},
      "",
      decodeURIComponent(`./x/tags?${rawParams}`),
    );
    this.search = globalThis.location.search;
  }

  render() {
    return html`
    ${this.resultsTags.map((tag) => html`
      <simple-tag auto-accent-color
        value="${tag.trim()}"
        @click="${this._tagClick}"
      ></simple-tag>
    `)}
    
    ${this.filteredItems.map((item) => html`
      <collection-item
        line1="${item.title}"
        line2="${item.description}"
        url="${item.slug}"
        image="${item.metadata.image}"
        tags="${item.metadata.tags}"
        icon="${item.metadata.icon}"
        accent-color="${item.metadata.accentColor}"></collection-item>
      `)}`;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "search" && this.search) {
        const rawParams = new URLSearchParams(this.search);
        const searchParams = Object.fromEntries(rawParams);
        this.params = {};
        this.params = searchParams;
        // ensure display is always stateful even if not directly set
        if (!searchParams.display) {
          rawParams.set("display", this.params.display || "card");
          globalThis.history.replaceState(
            {},
            "",
            decodeURIComponent(`./x/tags?${rawParams}`),
          );
        }
      }
      if (propName === "params" && store.manifest.items) {
        this.filteredItems = [...toJS(store.manifest.items).filter((item) => {
          if (!this.params.tag) {
            return true;
          }
          return item.metadata.tags && item.metadata.tags.split(',').some((tag) => {
            return tag.toLowerCase().includes(this.params.tag.toLowerCase());
          });
        })];
      }
      if (propName === "filteredItems") {
        this.updateResultsTags(this.filteredItems);
      }
    });
  }

  async updateResultsTags(filteredItems) {
    let resultsTags = [];
    await filteredItems.forEach(async (item) => {
      if (item.metadata.tags) {
        const tags = item.metadata.tags.trim().split(',');
        resultsTags.push(...tags);
      }
    });
    this.resultsTags = [...new Set(resultsTags)];
  }

  static get properties() {
    return {
      ...super.properties,
      search: {
        type: String,
      },
      params: {
        type: Object,
      },
      filteredItems: {
        type: Array,
      },
      resultsTags: {
        type: Array,
      },
    };
  }
}

globalThis.customElements.define(SiteTagsRoute.tag, SiteTagsRoute);
