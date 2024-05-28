/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import "@haxtheweb/simple-fields/lib/simple-tags.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/grid-plate/grid-plate.js";
import { mediaKeys } from "@haxtheweb/haxcms-elements/lib/ui-components/magic/site-view.js";
import { autorun } from "mobx";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

// simple fields schema for our filter and display capabilities
export function loadViewsForm() {
  // get a fresh copy of the manifest so we can build the select
  // list based on UUIDs in this site, presented in a tree format
  const itemManifest = store.getManifest(true);
  // default to null parent as the whole site
  var items = [
    {
      text: "Select page",
      value: null,
    },
  ];
  itemManifest.items.forEach((el) => {
    // calculate -- depth so it looks like a tree
    let itemBuilder = el;
    // walk back through parent tree
    let distance = "- ";
    while (itemBuilder && itemBuilder.parent != null) {
      itemBuilder = itemManifest.items.find((i) => i.id == itemBuilder.parent);
      // double check structure is sound
      if (itemBuilder) {
        distance = "--" + distance;
      }
    }
    items.push({
      text: distance + el.title,
      value: el.id,
    });
  });
  return [
    {
      property: "settings",
      inputMethod: "collapse",
      properties: [
        {
          property: "displayFormat",
          title: "Display format",
          accordion: true,
          expanded: false,
          properties: [
            {
              property: "displayedAs",
              title: "Displayed as",
              description: "How the entire display should be rendered",
              inputMethod: "select",
              options: {
                list: "List",
                table: "Table",
                card: "Card",
                contentplayer: "Content Player",
              },
            },
            {
              property: "displayOf",
              title: "Results as",
              description: "How do you want each result to appear",
              inputMethod: "select",
              options: {
                title: "Title",
                full: "Full content",
                fullRemote: "Full content (remote load)",
                blocks: "Blocks",
              },
            },
          ],
        },
        {
          property: "filters",
          title: "Filters",
          accordion: true,
          expanded: false,
          properties: [
            {
              property: "parent",
              title: "Parent",
              description:
                "Limit results to those that have this item as it's parent",
              inputMethod: "select",
              itemsList: items,
            },
            {
              property: "tags",
              title: "Tags",
              description: "Filter by tags, comma separated",
              inputMethod: "text",
            },
            {
              property: "title",
              title: "Title",
              description: "Filter by title",
              inputMethod: "text",
            },
            {
              property: "blockFilter",
              title: "Block filter",
              description: "Filter by block type",
              inputMethod: "select",
              options: mediaKeys,
            },
          ],
        },
      ],
    },
  ];
}

/**
 * `site-views-route`
 * `Route for displaying views output`
 *
 * @demo demo/index.html
 */
export class SiteViewsRoute extends HAXCMSI18NMixin(SimpleColors) {
  static get tag() {
    return "site-views-route";
  }

  static get styles() {
    return [
      super.styles,
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
        a11y-collapse,
        simple-fields {
          --a11y-collapse-heading-color: var(
            --simple-colors-default-theme-grey-12
          );
          color: var(--simple-colors-default-theme-grey-12);
          background-color: var(--simple-colors-default-theme-grey-1);
        }
        simple-icon-button-lite {
          border-radius: 0;
          font-size: 16px;
        }
        .views-controls {
          display: none;
        }
        :host([is-logged-in]) .views-controls {
          display: block;
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
      `,
    ];
  }

  constructor() {
    super();
    this.HAXCMSI18NMixinBase = "../../../";
    this.search = globalThis.location.search;
    this.t.selectPage = "Select Page";
    this.t.title = "Title";
    this.t.parent = "Parent";
    this.t.block = "Block";
    this.t.tags = "Tags";
    this.isLoggedIn = false;
    this.accentColor = "grey";
    this.loading = false;
    this._searchDebounce = null;
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.isLoggedIn = store.isLoggedIn;
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      let search = new URLSearchParams(store.currentRouterLocation.search);
      const params = Object.fromEntries(search);
      if (this.shadowRoot) {
        this.shadowRoot.querySelector("#schema").fields = loadViewsForm();
        setTimeout(() => {
          this.shadowRoot.querySelector("#schema").value = {
            settings: {
              displayFormat: {
                displayedAs: params.display || "list",
                displayOf: params.displayOf || "title",
              },
              filters: {
                title: params.title || "",
                parent: params.parent || "",
                tags: params.tags || "",
                blockFilter: params.blockFilter || "",
              },
            },
          };
        }, 0);
      } else {
        this.params = params;
      }
      this.__disposer.push(reaction);
    });
  }

  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    this._ready = false;
    super.disconnectedCallback();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._ready = true;
    this.shadowRoot.querySelector("#schema").fields = loadViewsForm();
    setTimeout(() => {
      this.shadowRoot.querySelector("#schema").value = {
        settings: {
          displayFormat: {
            displayedAs: this.params.display || "list",
            displayOf: this.params.displayOf || "title",
          },
          filters: {
            title: this.params.title || "",
            parent: this.params.parent || "",
            tags: this.params.tags || "",
            blockFilter: this.params.blockFilter || "",
          },
        },
      };
    }, 0);
  }

  formValuesChanged(e) {
    clearTimeout(this._formDebounce);
    this._formDebounce = setTimeout(() => {
      const params = new URLSearchParams(globalThis.location.search);
      const settings = e.detail.value.settings;
      if (
        this._ready &&
        settings &&
        settings.displayFormat &&
        settings.filters
      ) {
        if (settings.displayFormat.displayedAs) {
          params.set("display", settings.displayFormat.displayedAs);
        }
        if (settings.displayFormat.displayOf) {
          params.set("displayOf", settings.displayFormat.displayOf);
          if (
            this.shadowRoot.querySelector("#schema").formElements[
              "settings.filters.blockFilter"
            ]
          ) {
            this.shadowRoot.querySelector("#schema").formElements[
              "settings.filters.blockFilter"
            ].element.hidden = settings.displayFormat.displayOf !== "blocks";
          }
        }
        if (settings.filters.title) {
          params.set("title", settings.filters.title);
        } else {
          params.delete("title");
        }
        if (settings.filters.parent && settings.filters.parent != "null") {
          params.set("parent", settings.filters.parent);
        } else {
          params.delete("parent");
        }
        if (settings.filters.tags) {
          params.set("tags", settings.filters.tags);
        } else {
          params.delete("tags");
        }
        if (
          settings.filters.blockFilter &&
          settings.displayFormat.displayOf === "blocks"
        ) {
          let bf = settings.filters.blockFilter;
          if (parseInt(bf) && mediaKeys[parseInt(bf)]) {
            bf = mediaKeys[bf];
          }
          params.set("blockFilter", bf);
        } else {
          params.delete("blockFilter");
        }
        globalThis.history.pushState(
          {},
          "",
          decodeURIComponent(`./x/views?${params}`),
        );
        this.search = `?${decodeURIComponent(params)}`;
      }
    }, 600);
  }

  iconForDisplay(display) {
    switch (display) {
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
    return html` <grid-plate
        cols="1-1"
        disable-responsive
        class="views-controls"
      >
        <div slot="col-1">
          <form id="form">
            <simple-fields
              id="schema"
              @value-changed="${this.formValuesChanged}"
            ></simple-fields>
          </form>
        </div>
        <div slot="col-2">
          <ul class="overview">
            <li>
              Display:
              <simple-icon-lite
                icon="${this.iconForDisplay(this.params.display)}"
              ></simple-icon-lite>
              ${this.params.display} of ${this.params.displayOf}
            </li>
            <li>
              Filters:
              <ul>
                ${this.params.title
                  ? html`<li>${this.t.title}: ${this.params.title}</li>`
                  : nothing}
                ${this.params.parent
                  ? html`<li>${this.t.parent}: ${this.params.parent}</li>`
                  : nothing}
                ${this.params.tags
                  ? html`<li>${this.t.tags}: ${this.params.tags}</li>`
                  : nothing}
                ${this.params.blockFilter
                  ? html`<li>${this.t.block}: ${this.params.blockFilter}</li>`
                  : nothing}
                <label>Search query for use in embedded views</label
                ><textarea cols="40" rows="5">${this.search}</textarea>
              </ul>
            </li>
          </ul>
        </div>
      </grid-plate>
      ${this.loading
        ? html`<h3>Loading...</h3>`
        : html`<h3 class="views-controls">
            Results
            <simple-icon-button-lite icon="refresh" @click="${this.refreshData}"
              >Refresh</simple-icon-button-lite
            >
          </h3>`}
      <site-view
        search="${this.search}"
        @loading-changed="${this.syncLoad}"
      ></site-view>
      <slot></slot>`;
  }

  refreshData(e) {
    this.shadowRoot.querySelector("site-view").rebuildSearchResults();
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
          rawParams.set("display", this.params.display || "list");
          globalThis.history.replaceState(
            {},
            "",
            decodeURIComponent(`./x/views?${rawParams}`),
          );
        }
      }
      // change if tag changes, always change if coming to or from media since it's a larger query
      if (propName === "params" && oldValue && this.params && this.shadowRoot) {
        this.shadowRoot.querySelector("site-view").rebuildSearchResults();
      }
    });
  }

  static get properties() {
    return {
      ...super.properties,
      loading: {
        type: Boolean,
        reflect: true,
      },
      isLoggedIn: {
        type: Boolean,
        reflect: true,
        attribute: "is-logged-in",
      },
      params: {
        type: Object,
      },
      search: {
        type: String,
      },
    };
  }
}

customElements.define(SiteViewsRoute.tag, SiteViewsRoute);
