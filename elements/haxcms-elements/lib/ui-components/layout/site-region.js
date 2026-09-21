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
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.regionData);
        Promise.resolve().then(() => {
          const data = _mobx_val_0;
          if (this.name && data[this.name]) {
            this.contentItemIds = data[this.name];
          }
        });
      }),
    );
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
                    // <site-region> lives inside the host theme's shadow root, so
                    // content we just inserted is never seen by wc-autoload's
                    // document-level MutationObserver (it does not cross shadow
                    // boundaries) nor by its initial :not(:defined) sweep. Without
                    // this, elements dropped into a region (e.g. polaris-mark)
                    // never get their definitions loaded / hydrated.
                    this._hydrateRegionContent(div);
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

  /**
   * Sweep a freshly-inserted subtree for undefined custom elements and hand
   * them off to the existing autoload registries so they hydrate even though
   * they live outside the reach of document-level mutation observers.
   */
  _hydrateRegionContent(container) {
    if (!container) {
      return;
    }
    const elements = [];
    if (
      container.tagName &&
      container.tagName.includes("-") &&
      !globalThis.customElements.get(container.tagName.toLowerCase())
    ) {
      elements.push(container);
    }
    container.querySelectorAll(":not(:defined)").forEach((el) => {
      if (el.tagName) {
        elements.push(el);
      }
    });
    if (elements.length === 0) {
      return;
    }
    if (globalThis.WCAutoload && globalThis.WCAutoload.requestAvailability) {
      const loader = globalThis.WCAutoload.requestAvailability();
      elements.forEach((el) => loader.processNewElement(el));
    } else if (
      globalThis.DynamicImportRegistry &&
      globalThis.DynamicImportRegistry.requestAvailability
    ) {
      const registry = globalThis.DynamicImportRegistry.requestAvailability();
      elements.forEach((el) => registry.loadDefinition(el.tagName));
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
globalThis.customElements.define(SiteRegion.tag, SiteRegion);
