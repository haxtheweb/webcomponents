/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * @haxcms-theme-category Website
 * @haxcms-theme-internal true
 */
import { html, css } from "lit";
import { HAXCMSPrintTheme } from "./haxcms-print-theme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import "@haxtheweb/code-sample/code-sample.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";

// a JSON display theme that extends HAXCMSPrintTheme for minimal UI but displays activeItem data as JSON
class HAXCMSJSONTheme extends HAXCMSPrintTheme {
  static get properties() {
    return {
      ...super.properties,
      activeItemData: { type: Object },
      showChildren: { type: Boolean },
      viewMode: { type: String }, // 'json' or 'yaml'
      yamlData: { type: String },
      loading: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.activeItemData = null;
    this.showChildren = false;
    this.viewMode = "json";
    this.yamlData = "";
    this.loading = false;
  }

  render() {
    // Create a version without children for compact display
    let displayData = this.activeItemData ? { ...this.activeItemData } : {};
    const hasChildren = displayData.children && displayData.children.length > 0;

    if (!this.showChildren && hasChildren) {
      displayData = { ...displayData };
      delete displayData.children;
    }

    const jsonData = JSON.stringify(displayData, null, 2);
    const currentData = this.viewMode === "yaml" ? this.yamlData : jsonData;
    const currentType = this.viewMode === "yaml" ? "yaml" : "json";

    return html`
      <header>
        <simple-icon-button-lite
          @click="${this.toggleViewMode}"
          id="formatbtn"
          icon="${this.viewMode === "yaml"
            ? "code-json"
            : "editor:format-textdirection-r-to-l"}"
          title="Switch to ${this.viewMode === "yaml" ? "JSON" : "YAML"} view"
        >
          ${this.viewMode === "yaml" ? "JSON" : "YAML"}
        </simple-icon-button-lite>
        <simple-icon-button-lite
          @click="${this.copyToClipboard}"
          id="copybtn"
          icon="content-copy"
          title="Copy ${this.viewMode.toUpperCase()} to clipboard"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          @click="${this.goBack}"
          id="backbtn"
          icon="arrow-back"
          title="Go back"
        ></simple-icon-button-lite>
      </header>
      <main>
        <article>
          <section>
            <h2>Active Item Data (${this.viewMode.toUpperCase()})</h2>
            <p>
              This is the ${this.viewMode.toUpperCase()} representation of the
              current page's activeItem data:
            </p>
            ${hasChildren
              ? html`
                  <div class="controls">
                    <simple-icon-button-lite
                      @click="${this.toggleChildren}"
                      id="togglebtn"
                      icon="${this.showChildren
                        ? "expand-less"
                        : "expand-more"}"
                      title="${this.showChildren
                        ? "Hide children"
                        : "Show children"}"
                    >
                      ${this.showChildren ? "Hide children" : "Show children"}
                    </simple-icon-button-lite>
                  </div>
                `
              : ""}
            ${this.loading
              ? html` <div class="loading">Converting to YAML...</div> `
              : html`
                  <code-sample
                    type="${currentType}"
                    copy-clipboard-button
                    .value="${currentData}"
                  >
                    <pre><code>${currentData}</code></pre>
                  </code-sample>
                `}
          </section>
        </article>
      </main>
      <footer>
        <site-footer></site-footer>
      </footer>
    `;
  }

  async copyToClipboard(e) {
    if (
      this.activeItemData &&
      globalThis.navigator &&
      globalThis.navigator.clipboard
    ) {
      try {
        let dataToCopy;
        if (this.viewMode === "yaml") {
          dataToCopy = this.yamlData;
        } else {
          // Create display data with/without children based on toggle
          let displayData = { ...this.activeItemData };
          const hasChildren =
            displayData.children && displayData.children.length > 0;
          if (!this.showChildren && hasChildren) {
            delete displayData.children;
          }
          dataToCopy = JSON.stringify(displayData, null, 2);
        }

        await globalThis.navigator.clipboard.writeText(dataToCopy);
        if (
          globalThis.SimpleToast &&
          globalThis.SimpleToast.requestAvailability
        ) {
          const toast = globalThis.SimpleToast.requestAvailability();
          toast.showSimpleToast(
            `${this.viewMode.toUpperCase()} data copied to clipboard!`,
          );
        } else {
          console.log(
            `${this.viewMode.toUpperCase()} data copied to clipboard!`,
          );
        }
      } catch (err) {
        console.error(
          `Failed to copy ${this.viewMode.toUpperCase()} data: `,
          err,
        );
        if (
          globalThis.SimpleToast &&
          globalThis.SimpleToast.requestAvailability
        ) {
          const toast = globalThis.SimpleToast.requestAvailability();
          toast.showSimpleToast(
            `Failed to copy ${this.viewMode.toUpperCase()} data`,
            3000,
            { hat: "error" },
          );
        }
      }
    }
  }

  goBack(e) {
    // Remove the format parameter and reload
    const url = new URL(globalThis.location);
    url.searchParams.delete("format");
    globalThis.location.href = url.toString();
  }

  async toggleChildren(e) {
    this.showChildren = !this.showChildren;
    // If we're in YAML mode, regenerate YAML data with new children setting
    if (this.viewMode === "yaml") {
      await this.convertToYAML();
    }
  }

  async toggleViewMode(e) {
    if (this.viewMode === "json") {
      // Switch to YAML
      this.viewMode = "yaml";
      if (!this.yamlData) {
        await this.convertToYAML();
      }
    } else {
      // Switch to JSON
      this.viewMode = "json";
    }
  }

  async convertToYAML() {
    if (!this.activeItemData) return;

    this.loading = true;
    try {
      // Create display data with/without children based on toggle
      let displayData = { ...this.activeItemData };
      const hasChildren =
        displayData.children && displayData.children.length > 0;
      if (!this.showChildren && hasChildren) {
        delete displayData.children;
      }

      // Use MicroFrontendRegistry to call our JSON to YAML endpoint
      const result = await MicroFrontendRegistry.call("@core/jsonToYaml", {
        json: displayData,
      });

      if (result && result.data) {
        this.yamlData = result.data;
      } else {
        throw new Error("No data returned from YAML conversion");
      }
    } catch (error) {
      console.error("Failed to convert to YAML:", error);
      if (
        globalThis.SimpleToast &&
        globalThis.SimpleToast.requestAvailability
      ) {
        const toast = globalThis.SimpleToast.requestAvailability();
        toast.showSimpleToast("Failed to convert to YAML", 3000, {
          hat: "error",
        });
      }
      // Fall back to JSON view on error
      this.viewMode = "json";
    } finally {
      this.loading = false;
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    // Get the activeItem data from store
    this.activeItemData = toJS(store.activeItem);

    // Set up store observer for active item changes
    this.storeDisposer = store.observe("activeItem", (change) => {
      this.activeItemData = toJS(change.newValue);
      // Clear YAML data when activeItem changes so it gets regenerated
      this.yamlData = "";
      this.requestUpdate();
    });

    setTimeout(() => {
      this.shadowRoot.querySelector("#backbtn").focus();
    }, 0);
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.storeDisposer) {
      this.storeDisposer();
    }
    super.disconnectedCallback();
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --text-color: var(--ddd-theme-default-coalyGray, #444);
          --bg-color: var(--ddd-theme-default-white, #fff);
          --secondary-text-color: var(--ddd-theme-default-slateGray, #666);
          --border-color: var(--ddd-theme-default-limestoneGray, #ddd);
          --hover-bg-color: var(--ddd-theme-default-limestoneLight, #f0f0f0);
          --code-bg-color: var(--ddd-theme-default-limestoneLight, #f8f8f8);
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --text-color: var(--ddd-theme-default-white, #fff);
            --bg-color: var(--ddd-theme-default-coalyGray, #222);
            --secondary-text-color: var(
              --ddd-theme-default-limestoneLight,
              #ccc
            );
            --border-color: var(--ddd-theme-default-slateGray, #555);
            --hover-bg-color: var(--ddd-theme-default-slateGray, #333);
            --code-bg-color: var(--ddd-theme-default-coalyGray, #1a1a1a);
          }
        }

        header {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          position: fixed;
          top: 0;
          right: 0;
          z-index: 1000;
          background: var(--bg-color);
          backdrop-filter: blur(8px);
          padding: 8px;
          border-radius: 0 0 0 8px;
          border: 1px solid var(--border-color);
          border-top: none;
          border-right: none;
        }

        #copybtn,
        #backbtn,
        #togglebtn,
        #formatbtn {
          color: var(--text-color);
          width: 44px;
          height: 44px;
          border: 1px solid var(--border-color);
          border-radius: var(--ddd-radius-xs, 4px);
          background: var(--bg-color);
          transition: all 0.2s ease;
        }

        #copybtn:hover,
        #backbtn:hover,
        #togglebtn:hover,
        #formatbtn:hover {
          background: var(--hover-bg-color);
        }

        #togglebtn,
        #formatbtn {
          width: auto;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
        }

        main {
          padding-top: 70px;
          background: var(--bg-color);
          color: var(--text-color);
          min-height: 100vh;
        }

        .controls {
          margin: var(--ddd-spacing-4, 16px) 0;
          display: flex;
          justify-content: flex-start;
        }

        h2 {
          color: var(--text-color);
          font-family: var(--ddd-font-navigation, sans-serif);
          margin-bottom: var(--ddd-spacing-4, 16px);
        }

        p {
          color: var(--secondary-text-color);
          font-family: var(--ddd-font-primary, sans-serif);
          margin-bottom: var(--ddd-spacing-4, 16px);
        }

        code-sample {
          --code-sample-background: var(--code-bg-color);
          --code-sample-color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: var(--ddd-radius-xs, 4px);
          display: block;
          margin: 16px 0;
        }

        .loading {
          padding: 20px;
          text-align: center;
          font-style: italic;
          color: var(--secondary-text-color);
          border: 1px solid var(--border-color);
          border-radius: var(--ddd-radius-xs, 4px);
          background: var(--code-bg-color);
          margin: 16px 0;
        }

        footer {
          background: var(--bg-color);
          color: var(--text-color);
        }
      `,
    ];
  }

  static get tag() {
    return "haxcms-json-theme";
  }
}
globalThis.customElements.define(HAXCMSJSONTheme.tag, HAXCMSJSONTheme);
export { HAXCMSJSONTheme };
