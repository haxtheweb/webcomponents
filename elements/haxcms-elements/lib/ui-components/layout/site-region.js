import { html, LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
class SiteRegion extends LitElement {
  static get tag() {
    return "site-region";
  }
  static get properties() {
    return {
      name: { type: String },
      contentItemIds: { type: Array },
    };
  }

  constructor() {
    super();
    this.name = null;
    this.__disposer = this.__disposer ? this.__disposer : [];
    // load region data when we get access to it
    autorun((reaction) => {
      const data = toJS(store.regionData);
      if (this.name && data[this.name]) {
        this.contentItemIds = data[this.name];
      }
      this.__disposer.push(reaction);
    });
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (this.shadowRoot) {
        if (propName === "name" && this[propName]) {
          const data = toJS(store.regionData);
          if (data[this.name]) {
            this.contentItemIds = data[this.name];
          }
        }
        if (
          propName === "contentItemIds" &&
          this[propName] &&
          this[propName].length > 0
        ) {
          clearTimeout(this.__debounce);
          this.__debounce = setTimeout(async () => {
            // reset because it's going to get built by the content item IDs we found
            this.innerHTML = "";
            await this.contentItemIds.map(async (id) => {
              let item = store.findItem(id);
              if (item && item.location) {
                await fetch(item.location, {
                  method: "GET",
                  priority: "low",
                })
                  .then((response) => {
                    if (response.ok) {
                      return response.text();
                    }
                  })
                  .then((data) => {
                    // region data found
                    let div = globalThis.document.createElement("div");
                    div.innerHTML = data;
                    div.classList.add("site-region-wrapper");
                    // set a part to improve shadowRoot targetting from outside the theme
                    // css vars still based way to penetrate this
                    div.setAttribute(
                      "part",
                      `site-region-wrapper-${this.name}`,
                    );
                    this.appendChild(div);
                  })
                  .catch((err) => {
                    console.error("region data not found");
                  });
              }
            });
          }, 100);
        }
      }
    });
  }

  render() {
    return html`<slot></slot>`;
  }
}
customElements.define(SiteRegion.tag, SiteRegion);
