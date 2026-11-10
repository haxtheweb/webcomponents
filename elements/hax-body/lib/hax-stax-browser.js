import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-toolbar/lib/simple-button-grid.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import { HaxTrayBrowserStyles } from "./hax-tray-browser-styles.js";
/**
 * `hax-stax-browser`
 * @element hax-stax-browser
 * `Select a stack / template to insert`
 * @microcopy - the mental model for this element
 * - stax - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxStaxBrowser extends LitElement {
  static get styles() {
    return [
      ...HaxTrayBrowserStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          flex: 0 0 auto;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-x: clip;
          overflow-y: visible;
        }
        :host > * {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }
        hax-tray-button[small] {
          font-size: var(--hax-ui-admin-font-size-xs);
        }
      `,
    ];
  }
  constructor() {
    super();
    this.staxList = [];
    this.label = "Templates";
    this.templateType = "area"; // 'area', 'page', or 'all'
  }
  get filteredStaxList() {
    if (this.templateType === "all") {
      return this.staxList;
    }

    return this.staxList.filter((stax) => {
      // Check if stax has templateType metadata
      const staxTemplateType = stax.details && stax.details.templateType;

      // If no templateType is defined, default to 'area'
      const effectiveTemplateType = staxTemplateType || "area";

      return effectiveTemplateType === this.templateType;
    });
  }

  render() {
    const filteredItems = this.filteredStaxList;
    // Don't render anything if there are no items to show
    if (filteredItems.length === 0) {
      return html``;
    }

    return html`
      <a11y-collapse heading="${this.label}" heading-button>
        <simple-button-grid columns="4" rows="1" always-expanded>
          ${filteredItems.map(
            (stax) => html`
              <hax-tray-button
                icon-position="top"
                show-text-label
                index="${stax.index}"
                label="${stax.details.title}"
                .stax="${stax.stax}"
                icon="hax:templates"
                color="green"
                event-name="insert-stax"
              ></hax-tray-button>
            `,
          )}
        </simple-button-grid>
      </a11y-collapse>
    `;
  }
  static get tag() {
    return "hax-stax-browser";
  }
  static get properties() {
    return {
      /**
       * The list of stax
       */
      staxList: {
        type: Array,
      },
      label: { type: String },
      /**
       * Type of templates to filter by: 'area', 'page', or 'all'
       */
      templateType: { type: String, attribute: "template-type" },
    };
  }
}
globalThis.customElements.define(HaxStaxBrowser.tag, HaxStaxBrowser);
export { HaxStaxBrowser };
