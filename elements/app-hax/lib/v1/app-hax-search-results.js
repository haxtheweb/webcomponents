/* eslint-disable no-return-assign */
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import { varGet } from "@haxtheweb/utils/utils.js";
import { store } from "./AppHaxStore.js";
import "./app-hax-site-bar.js";
import "./app-hax-site-details.js";

export class AppHaxSearchResults extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-search-results";
  }

  constructor() {
    super();
    this.searchItems = [];
    this.displayItems = [];
    this.searchTerm = "";
    this.dark = false;
    autorun(() => {
      this.searchTerm = toJS(store.searchTerm);
    });
    autorun(() => {
      this.dark = toJS(store.darkMode);
    });
    autorun(() => {
      const manifest = toJS(store.manifest);
      if (manifest && manifest.items) {
        this.searchItems = manifest.items;
        this.displayItems = [...this.searchItems];
      }
    });
  }

  // Site.json is coming from

  static get properties() {
    return {
      ...super.properties,
      searchTerm: { type: String, reflect: true },
      searchItems: { type: Array },
      displayItems: { type: Array },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "searchTerm") {
        this.displayItems = this.searchItems.filter((word) => {
          if (
            word.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            word.description
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            word.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            word.slug.toLowerCase().includes(this.searchTerm.toLowerCase())
          ) {
            return true;
          }
          return false;
        });
      }
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          overflow: hidden;
        }
        ul,
        li {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        app-hax-site-bar {
          margin: 8px 0;
        }
        .description {
          max-height: 64px;
          overflow: hidden;
          max-width: 80%;
          text-overflow: ellipsis;
          word-break: break-all;
        }

        @media (max-width: 800px) {
          app-hax-site-bar {
            --main-banner-width: 60vw;
          }
          .description {
            max-height: 24px;
            font-size: 8px;
            font-family: sans-serif;
          }
        }
        @media (max-width: 640px) {
          app-hax-site-bar a {
            font-size: 14px;
          }
          app-hax-site-bar {
            --main-banner-width: 70vw;
          }
        }
        span[slot="band"] {
          height: 48px;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 8px;
        }
        :host([dark]) #noResult {
          color: var(--simple-colors-default-theme-grey-12, black);
        }
      `,
    ];
  }
  render() {
    return html`
      <ul id="results">
        ${this.displayItems.length > 0
          ? this.displayItems.map(
              (item) =>
                html` <li>
                  <app-hax-site-bar
                    @opened-changed="${this.openedChanged}"
                    ?dark="${this.dark}"
                    accent-color="${varGet(
                      item,
                      "metadata.theme.variables.cssVariable",
                      "orange",
                    )
                      .replace("--simple-colors-default-theme-", "")
                      .replace("-7", "")}"
                    icon-link="${item.slug}"
                    icon="${varGet(
                      item,
                      "metadata.theme.variables.icon",
                      "link",
                    )}"
                  >
                    <a href="${item.slug}" slot="heading">${item.title}</a>
                    <span slot="subHeading">${item.author}</span>
                    <app-hax-site-details
                      slot="band"
                      .details="${this.getItemDetails(item)}"
                      site-id="${item.id}"
                    >
                      <div class="description" slot="pre">
                        ${item.description}
                      </div>
                    </app-hax-site-details>
                  </app-hax-site-bar>
                </li>`,
            )
          : html`<div id="noResult">
              No results for
              ${this.searchTerm !== ""
                ? html`<strong>"${this.searchTerm}"</strong>`
                : "your account, try starting a new journey!"}.
            </div>`}
      </ul>
    `;
  }

  getItemDetails(item) {
    const details = {
      created: varGet(item, "metadata.site.created", new Date() / 1000),
      updated: varGet(item, "metadata.site.updated", new Date() / 1000),
      pages: varGet(item, "metadata.pageCount", 0),
      url: item.slug,
    };
    return details;
  }

  openedChanged(e) {
    store.appEl.playSound("click");
    if (!e.detail.value) {
      this.shadowRoot
        .querySelector("app-hax-site-details")
        .setAttribute("tabindex", "-1");
    } else {
      this.shadowRoot
        .querySelector("app-hax-site-details")
        .removeAttribute("tabindex");
    }
  }
}
customElements.define(AppHaxSearchResults.tag, AppHaxSearchResults);
