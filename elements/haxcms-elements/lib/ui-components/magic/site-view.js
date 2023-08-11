/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, render, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";
import "@lrnwebcomponents/simple-fields/lib/simple-tags.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/editable-table/lib/editable-table-display.js";
import "@lrnwebcomponents/play-list/play-list.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-remote-content.js";
import { iconFromPageType } from "@lrnwebcomponents/course-design/lib/learning-component.js";

export const mediaKeys = [
  "audio",
  "selfChecks",
  "objectives",
  "authorNotes",
  "images",
  "h5p",
  "headings",
  "dataTables",
  "specialTags",
  "links",
  "placeholders",
  "siteremotecontent",
  "video"
];

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
      itemBuilder = itemManifest.items.find(
        (i) => i.id == itemBuilder.parent
      );
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
                contentplayer: "Content Player"
              }
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
                blocks: "Blocks"
              }
            }
          ]
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
              description: "Limit results to those that have this item as it's parent",
              inputMethod: "select",
              itemsList: items
            },
            {
              property: "tags",
              title: "Tags",
              description: "Filter by tags, comma separated",
              inputMethod: "text"
            },
            {
              property: "title",
              title: "Title",
              description: "Filter by title",
              inputMethod: "text"
            },
            {
              property: "blockFilter",
              title: "Block filter",
              description: "Filter by block type",
              inputMethod: "select",
              options: mediaKeys
            }
          ]
        }
      ]
    }
  ]
}

/**
 * `site-view`
 * `UUID to render an accurate link and title in the site`
 *
 * @demo demo/index.html
 */
export class SiteView extends LitElement {
  static get tag() {
    return "site-view";
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
        editable-table-display::part(tag-link),
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
        :host([loading]) .loading {
          width: 100%;
          --simple-icon-height: 50px;
          --simple-icon-width: 50px;
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

        /* editable table display */
        editable-table-display,
        editable-table-display::part(table),
        table,tr,th,td {
          font-size: 16px;
        }
    `];
  }

  constructor() {
    super();
    this.loading = false;
    this.params = {
      display: "list",
      displayOf: "title",
    };
    this.results = [];
    this._searchDebounce = null;
    enableServices(["haxcms"]);
  }

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Site View",
        description: "A dynamic block that queries and displays certain information based on criteria",
        icon: "av:call-to-action",
        color: "grey",
        tags: ["Other", "haxcms"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: loadViewsForm(), 
        advanced: [
          {
            property: "search",
            title: "View URL",
            description: "URL containing criteria for generating the view. You can obtain this from the Views page.",
            inputMethod: "textfield",
            required: true
          }
        ]
      },
      demoSchema: [
        {
          tag: "site-view",
          properties: {},
          content: "",
        },
      ],
    };
  }
  rebuildSearchResults() {
    clearTimeout(this._searchDebounce);
    this._searchDebounce = setTimeout(async () => {
      if (this.shadowRoot && !this.loading) {
        const site = store.getManifest(true);
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
          ...this.params
        };
        this.loading = true;
        const response = await MicroFrontendRegistry.call(
          "@haxcms/views",
          params
        );
        if (response.data) {
          this.results = [...response.data];
        }
        this.loading = false;
      }
    }, 100);
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.rebuildSearchResults();
  }

  render() {
    return html`
    ${this.loading ? html`<div class="loading">${this.loading ? html`<simple-icon-lite icon="hax:loading"></simple-icon-lite>` : ``}</div>
` : html`
${this.results.length === 0 && !this.loading ? html`<h4>No results found</h4><p>Try changing the filter criteria.</p>` : nothing}
${this.params.display === "list" ? this.listTemplate() : nothing}
${this.params.display === "table" ? this.tableTemplate() : nothing}
${this.params.display === "card" ? this.cardTemplate() : nothing}
${this.params.display === "contentplayer" ? this.contentplayerTemplate() : nothing}
    <slot></slot>`}`;
  }

  contentplayerTemplate() {
    return html`<play-list id="contentplayertemplate"></play-list>`;
  }

  listTemplate() {
    return html`
    <ul class="list">
      ${this.results.map(
      (item) => html`
        <li class="list-item">
    ${this.params.displayOf === "blocks" ? 
      mediaKeys.map((key) => 
      (item.media && item.media[key] && 
        typeof item.media[key] == "string" && 
        this.params.blockFilter === key ? 
        unsafeHTML(item.media[key]) : 
        nothing
      )
    ) : html`<div class="play-list-item">
      ${this.params.displayOf === "title" ? html`<div class="list-link"><a href="${item.slug}">${item.title}</a></div>
      <div class="list-breadcrumb">${this.calculateBreadcrumb(item).map(item => html`
      <span>${item.title}</span> `)}</div>
      ${item.metadata.tags && item.metadata.tags != "" ? item.metadata.tags
        .split(",")
        .map(
          (tag) => html`<a href="x/views?tags=${tag.trim()}">
          <simple-tag
            auto-accent-color
            value="${tag.trim()}"
            accent-color="${item.accentColor}"
          ></simple-tag></a>`
        ) : nothing}` : this.params.displayOf === "full" ? unsafeHTML(`<h3>${item.title}</h3>`+item.contents) : 
      html`<site-remote-content player hide-reference uuid="${item.id}" show-title></site-remote-content>`}</div>`
    }
      </li>`)}
      </ul>`;
  }


  tableTemplate() {
    return html`
    <editable-table-display 
      accent-color="cyan" 
      bordered 
      caption="Content matching your search criteria" 
      numeric-styles
      column-header
      printable
      downloadable
      sort
      striped>
    <table>
      <tr>
        <th>Icon</th>
        <th>Type</th>
        <th>Title</th>
        <th>Tags</th>
        <th>Updated</th>
        <th>Created</th>
        <th>Status</th>
      </tr>
    ${this.results.map(
      (item) => html`
      <tr>
        <td>${item.metadata.pageType ? html`<simple-icon title="${item.metadata.pageType}" icon="${iconFromPageType(item.metadata.pageType)}"></simple-icon>` : nothing}</td>
        <td>${item.metadata.pageType ? item.metadata.pageType : nothing}</td>
        <td><a href="${item.slug}">${item.title}</a></td>
        <td>
          ${item.metadata.tags && item.metadata.tags != "" ? item.metadata.tags
          .split(",")
          .map(
            (tag) => html`<a part="tag-link" href="x/views?tags=${tag.trim()}">
            <simple-tag
              auto-accent-color
              value="${tag.trim()}"
              accent-color="${item.accentColor}"
            ></simple-tag></a>`
          ) : nothing}
        </td>
        <td>
          <simple-datetime
            format="m/j/y"
            timestamp="${item.metadata.created}"
            unix
            class="info-date"
          ></simple-datetime>
        </td>
        <td>
          <simple-datetime
            format="m/j/y"
            timestamp="${item.metadata.updated}"
            unix
            class="info-date"
          ></simple-datetime>
        </td>
        <td>
          ${item.metadata.published !== false ? `published` : `unpublished`}
        </td>
      </tr>`)}
      </table>
      </editable-table-display>`;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "loading") {
        this.dispatchEvent(new CustomEvent("loading-changed", {
          detail: {
            value: this.loading
          },
        }));
      }
      if (propName === "search" && oldValue && this.search) {
        const rawParams = new URLSearchParams(this.search);
        const searchParams = Object.fromEntries(rawParams);
        this.params = {...this.params,...searchParams};
        this.rebuildSearchResults();
      }
      if (propName === "results" && oldValue && this.results) {
        if (this.params.display === "contentplayer") {
          setTimeout(() => {
            this.renderPlayListTemplate();
          }, 0);
        }
      }
    });
  }

  renderPlayListTemplate() {
    let template = document.createElement("template");
    render(html`${this.results.map((item) => html`
    ${this.params.displayOf === "blocks" ? 
      mediaKeys.map((key) => 
      (item.media && item.media[key] && 
        typeof item.media[key] == "string" && 
        this.params.blockFilter === key ? 
        unsafeHTML(item.media[key]) : 
        nothing
      )
    ) : html`<div class="play-list-item">
      ${this.params.displayOf === "title" ? html`<div class="list-link"><a href="${item.slug}">${item.title}</a></div>
      <div class="list-breadcrumb">${this.calculateBreadcrumb(item).map(item => html`
      <span>${item.title}</span> `)}</div>` : this.params.displayOf === "full" ? unsafeHTML(`<h3>${item.title}</h3>`+item.contents) : 
      html`<site-remote-content player hide-reference uuid="${item.id}" show-title></site-remote-content>`}</div>`
    }`)}`, template);
    this.shadowRoot.querySelector("#contentplayertemplate").appendChild(template);
  }

  cardTemplate() {
    return html`${this.results.map(
      (item) => html`
        <accent-card image-src="http://placekitten.com/200/600" accent-color="red" horizontal accent-heading>
          <div slot="heading">${item.title}</div>
          <div slot="subheading">${item.metadata.tags && item.metadata.tags != "" ? item.metadata.tags
                .split(",")
                .map(
                  (tag) => html`<a href="x/views?tags=${tag.trim()}">
                  <simple-tag
                    auto-accent-color
                    value="${tag.trim()}"
                    accent-color="${item.accentColor}"
                  ></simple-tag></a>`
                ) : nothing}</div>
          <div slot="content"><a href="${item.slug}">Link to content</a>
        </div>
        </accent-card>`)}`;
  }

  calculateBreadcrumb(activeItem) {
    let items = [];
    const site = store.getManifest(true);
    let itemBuilder = activeItem;
    // walk back through parent tree
    while (itemBuilder && itemBuilder.parent != null) {
      itemBuilder = site.items.find(
        (i) => i.id == itemBuilder.parent
      );
      // double check structure is sound
      if (itemBuilder) {
        items.unshift({
          title: itemBuilder.title,
        });
      }
    }
    return items;
  }

  static get properties() {
    return {
      search: {
        type: String,
        reflect: true
      },
      results: {
        type: Array,
      },
      loading: {
        type: Boolean,
        reflect: true
      },
      params: {
        type: Object,
      },
    }
  }
}

customElements.define(SiteView.tag, SiteView);