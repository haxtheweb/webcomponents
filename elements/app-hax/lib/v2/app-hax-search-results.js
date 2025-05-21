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
      if (manifest && manifest.data.items) {
        this.searchItems = manifest.data.items;
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
      siteUrl: { type: String, attribute: "site-url" },
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
        
        .carousel-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          overflow: hidden;
          margin: 0px;
          max-height: 260px;
          justify-self: flex-start;
          align-self: flex-start;
        }
        .scroll-left,
        .scroll-right {
          background: var(--app-hax-accent-color, black);
          color: white;
          border: none;
          padding: 16px;
          cursor: pointer;
          height: 240px;
          opacity: 50%;
          color: var(--simple-colors-default-theme-accent-1, var(--simple-colors-default-theme-accent-12));
        }
        
        #results {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          gap: 20px;
          white-space: nowrap;
          scrollbar-width: none;
          -ms-overflow-style: none; 
          padding: 4px;
          padding-left: 8px;
          padding-right: 8px;
        }

        #results::-webkit-scrollbar {
          display: none;
        }

        li {
          flex: 0 0 auto;
          scroll-snap-align: center;
          width: 220px;
          height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        app-hax-site-bar {
          margin: 0 12px;
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
          color: var(--ddd-theme-default-coalyGray);
        }
      `,
    ];
  }
  render() {
    return html`
    <div class="carousel-container">
    <button class="scroll-left" @click="${this.scrollLeft}">◀</button>
      <ul id="results">
        ${this.displayItems.length > 0
          ? this.displayItems.map(
              (item) =>
                html` <li>
                  <app-hax-site-bar
                    ?dark="${this.dark}"
                    .siteUrl="${item.slug}"
                    accent-color="${varGet(
                      item,
                      "metadata.theme.variables.cssVariable",
                      "",
                    )
                      .replace("--simple-colors-default-theme-", "")
                      .replace("-7", "")}"
                  >
                    <span slot="heading">${item.title}</span>
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
      <button class="scroll-right" @click="${this.scrollRight}">▶</button>
    </div>
    
    `;
  }

  scrollLeft() {
    this.shadowRoot.querySelector("#results").scrollBy({ left: -800, behavior: "smooth" });
  }
  
  scrollRight() {
    this.shadowRoot.querySelector("#results").scrollBy({ left: 800, behavior: "smooth" });
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
