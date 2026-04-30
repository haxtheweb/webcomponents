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
      viewMode: { type: String }, // 'json' or 'yaml' (for generated fallback mode)
      yamlData: { type: String },
      loading: { type: Boolean },
      requestedFormat: { type: String },
      loadedFormatData: { type: String },
      loadedFromNativeRoute: { type: Boolean },
      nativeFormatPath: { type: String },
      nativeFormatUrl: { type: String },
    };
  }

  constructor() {
    super();
    this.activeItemData = null;
    this.showChildren = false;
    this.viewMode = "json";
    this.yamlData = "";
    this.loading = false;
    this.requestedFormat = "json";
    this.nativeFormatPath = "";
    this.nativeFormatUrl = "";
    this.loadedFormatData = "";
    this.loadedFromNativeRoute = false;
    this.__loadStamp = 0;
  }

  render() {
    const routeFormat = this.requestedFormat || "json";
    const usingNativeRoute =
      this.loadedFromNativeRoute && this.loadedFormatData !== "";
    const copyFormat = this.getCopyFormatLabel(routeFormat);

    // Create a version without children for generated compact display
    let displayData = this.activeItemData ? { ...this.activeItemData } : {};
    const hasChildren = displayData.children && displayData.children.length > 0;
    const allowChildrenToggle =
      !usingNativeRoute &&
      hasChildren &&
      ["json", "yaml"].indexOf(routeFormat) !== -1;

    if (!this.showChildren && hasChildren) {
      displayData = { ...displayData };
      delete displayData.children;
    }

    const jsonData = JSON.stringify(displayData, null, 2);
    const generatedData = this.getGeneratedData(jsonData);
    const currentData = usingNativeRoute
      ? this.loadedFormatData
      : generatedData.data;
    const currentType = usingNativeRoute
      ? this.getCodeSampleTypeForFormat(routeFormat)
      : generatedData.type;
    const formatCopy = routeFormat.toUpperCase();
    const machineGuidance =
      routeFormat === "md"
        ? "Appending .md to the slug returns Markdown that is useful for LLM-oriented workflows."
        : `Appending .${routeFormat} to the slug returns this page directly in ${formatCopy} format for machine use.`;
    const sourceMessage = usingNativeRoute
      ? `Loaded directly from ${this.nativeFormatPath}.`
      : `Native .${routeFormat} file was not found. Showing generated ${generatedData.type.toUpperCase()} fallback from activeItem data.`;

    return html`
      <header>
        <simple-icon-button-lite
          @click="${this.copyToClipboard}"
          id="copybtn"
          icon="content-copy"
          label="Copy data to clipboard"
          title="Copy ${copyFormat.toUpperCase()} to clipboard"
        ></simple-icon-button-lite>
        <simple-icon-button-lite
          @click="${this.goBack}"
          id="backbtn"
          icon="arrow-back"
          label="Go back to page"
          title="Go back"
        ></simple-icon-button-lite>
      </header>
      <main>
        <article>
          <section>
            <h2>Active Item Data (${routeFormat.toUpperCase()})</h2>
            <p>
              This view prefers the native <code>.${routeFormat}</code> page
              file and falls back to generated data only when that file is not
              available:
            </p>
            <p class="source-note">${sourceMessage}</p>
            <div class="format-routing-help">
              <h3>Native route for robots and LLMs</h3>
              <p>
                You opened this using <code>?format=${routeFormat}</code>.
                For machine-native access, append
                <code>.${routeFormat}</code> to the current page slug instead.
              </p>
              <div class="native-route">
                <code>${this.nativeFormatPath}</code>
                <simple-icon-button-lite
                  id="copyroutebtn"
                  icon="content-copy"
                  label="Copy native data route"
                  title="Copy native format route"
                  @click="${this.copyNativeRoute}"
                ></simple-icon-button-lite>
              </div>
              <p class="machine-note">${machineGuidance}</p>
              <p class="machine-note">
                Example:
                <code>${this.nativeFormatUrl}</code>
              </p>
            </div>
            ${allowChildrenToggle
              ? html`
                  <div class="controls">
                    <simple-icon-button-lite
                      @click="${this.toggleChildren}"
                      id="togglebtn"
                      icon="${this.showChildren
                        ? "expand-less"
                        : "expand-more"}"
                      label="${this.showChildren
                        ? "Hide children"
                        : "Show children"}"
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
              ? html`
                  <div class="loading">
                    Loading ${routeFormat.toUpperCase()} data...
                  </div>
                `
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
  getCodeSampleTypeForFormat(format) {
    switch (format) {
      case "json":
        return "json";
      case "yaml":
        return "yaml";
      case "xml":
        return "xml";
      case "md":
        return "html";
    }
    return "json";
  }

  getCopyFormatLabel(routeFormat) {
    if (this.loadedFromNativeRoute && routeFormat) {
      return routeFormat;
    }
    if (this.viewMode === "yaml") {
      return "yaml";
    }
    return "json";
  }

  getGeneratedData(jsonData) {
    if (this.viewMode === "yaml") {
      return {
        type: "yaml",
        data: this.yamlData || jsonData,
      };
    }
    return {
      type: "json",
      data: jsonData,
    };
  }

  isLikelyHtmlDocument(content) {
    if (!content) {
      return false;
    }
    const normalized = content.trim().toLowerCase();
    return (
      normalized.startsWith("<!doctype html") ||
      normalized.startsWith("<html") ||
      normalized.indexOf("<haxcms-site-builder") !== -1
    );
  }

  async loadNativeFormatData(format) {
    if (!this.nativeFormatUrl) {
      return null;
    }
    try {
      const response = await fetch(this.nativeFormatUrl, {
        credentials: "same-origin",
      });
      if (!response.ok) {
        return null;
      }
      const contentType = (response.headers.get("content-type") || "")
        .toLowerCase()
        .trim();
      const data = await response.text();
      if (!data || data.trim() === "") {
        return null;
      }
      if (
        contentType.indexOf("text/html") !== -1 ||
        this.isLikelyHtmlDocument(data)
      ) {
        return null;
      }
      if (format === "json") {
        try {
          JSON.parse(data);
        } catch (e) {
          return null;
        }
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  async loadPreferredDataSource() {
    const loadStamp = this.__loadStamp + 1;
    this.__loadStamp = loadStamp;
    this.updateFormatRoutingHelp();
    const routeFormat = this.requestedFormat || "json";
    this.loadedFromNativeRoute = false;
    this.loadedFormatData = "";
    this.viewMode = routeFormat === "yaml" ? "yaml" : "json";
    this.loading = true;
    const nativeData = await this.loadNativeFormatData(routeFormat);
    if (loadStamp !== this.__loadStamp) {
      return;
    }
    if (nativeData) {
      this.loadedFormatData = nativeData;
      this.loadedFromNativeRoute = true;
      this.loading = false;
      this.requestUpdate();
      return;
    }
    if (routeFormat === "yaml" && this.activeItemData) {
      await this.convertToYAML();
      if (loadStamp !== this.__loadStamp) {
        return;
      }
    }
    this.loading = false;
    this.requestUpdate();
  }

  async copyToClipboard(e) {
    if (globalThis.navigator && globalThis.navigator.clipboard) {
      try {
        let dataToCopy;
        const routeFormat = this.requestedFormat || "json";
        const copyFormat = this.getCopyFormatLabel(routeFormat);
        if (this.loadedFromNativeRoute && this.loadedFormatData) {
          dataToCopy = this.loadedFormatData;
        } else if (this.viewMode === "yaml") {
          dataToCopy = this.yamlData;
        } else if (this.activeItemData) {
          // Create display data with/without children based on toggle
          let displayData = { ...this.activeItemData };
          const hasChildren =
            displayData.children && displayData.children.length > 0;
          if (!this.showChildren && hasChildren) {
            delete displayData.children;
          }
          dataToCopy = JSON.stringify(displayData, null, 2);
        } else {
          dataToCopy = "";
        }

        await globalThis.navigator.clipboard.writeText(dataToCopy);
        if (
          globalThis.SimpleToast &&
          globalThis.SimpleToast.requestAvailability
        ) {
          const toast = globalThis.SimpleToast.requestAvailability();
          toast.showSimpleToast(
            `${copyFormat.toUpperCase()} data copied to clipboard!`,
          );
        } else {
          console.log(`${copyFormat.toUpperCase()} data copied to clipboard!`);
        }
      } catch (err) {
        const routeFormat = this.requestedFormat || "json";
        const copyFormat = this.getCopyFormatLabel(routeFormat);
        console.error(
          `Failed to copy ${copyFormat.toUpperCase()} data: `,
          err,
        );
        if (
          globalThis.SimpleToast &&
          globalThis.SimpleToast.requestAvailability
        ) {
          const toast = globalThis.SimpleToast.requestAvailability();
          toast.showSimpleToast(
            `Failed to copy ${copyFormat.toUpperCase()} data`,
            3000,
            { hat: "error" },
          );
        }
      }
    }
  }

  async copyNativeRoute(e) {
    if (
      this.nativeFormatUrl &&
      globalThis.navigator &&
      globalThis.navigator.clipboard
    ) {
      try {
        await globalThis.navigator.clipboard.writeText(this.nativeFormatUrl);
        if (
          globalThis.SimpleToast &&
          globalThis.SimpleToast.requestAvailability
        ) {
          const toast = globalThis.SimpleToast.requestAvailability();
          toast.showSimpleToast("Native format route copied to clipboard!");
        } else {
          console.log("Native format route copied to clipboard!");
        }
      } catch (err) {
        console.error("Failed to copy native format route: ", err);
      }
    }
  }

  updateFormatRoutingHelp() {
    const allowedFormats = ["json", "yaml", "md", "xml"];
    const url = new URL(globalThis.location.href);
    const urlParams = new URLSearchParams(url.search);
    const formatParam = urlParams.get("format");
    let currentFormat = "json";
    if (formatParam) {
      const normalizedFormat = formatParam.toLowerCase();
      if (allowedFormats.indexOf(normalizedFormat) !== -1) {
        currentFormat = normalizedFormat;
      }
    } else if (this.viewMode === "yaml") {
      currentFormat = "yaml";
    }
    this.requestedFormat = currentFormat;

    const cleanUrl = new URL(globalThis.location.href);
    cleanUrl.search = "";
    cleanUrl.hash = "";

    let pathname = cleanUrl.pathname;
    if (pathname.endsWith("/") && pathname.length > 1) {
      pathname = pathname.substring(0, pathname.length - 1);
    }
    if (pathname === "/" || pathname === "") {
      pathname = "/index";
    }

    const slashIndex = pathname.lastIndexOf("/");
    const dotIndex = pathname.lastIndexOf(".");
    if (dotIndex > slashIndex) {
      pathname = pathname.substring(0, dotIndex);
    }

    this.nativeFormatPath = `${pathname}.${currentFormat}`;
    cleanUrl.pathname = this.nativeFormatPath;
    this.nativeFormatUrl = cleanUrl.toString();
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
    this.loadPreferredDataSource();

    // Set up store observer for active item changes
    this.storeDisposer = store.observe("activeItem", (change) => {
      this.activeItemData = toJS(change.newValue);
      // Clear YAML data when activeItem changes so it gets regenerated
      this.yamlData = "";
      this.loadPreferredDataSource();
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
        #togglebtn {
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
        #togglebtn:hover {
          background: var(--hover-bg-color);
        }
        #togglebtn {
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

        .format-routing-help {
          margin: var(--ddd-spacing-4, 16px) 0;
          padding: var(--ddd-spacing-4, 16px);
          border: 1px solid var(--border-color);
          border-radius: var(--ddd-radius-xs, 4px);
          background: var(--code-bg-color);
        }

        .format-routing-help h3 {
          margin: 0 0 var(--ddd-spacing-2, 8px);
          color: var(--text-color);
          font-family: var(--ddd-font-navigation, sans-serif);
        }

        .native-route {
          align-items: center;
          display: flex;
          gap: var(--ddd-spacing-2, 8px);
          flex-wrap: wrap;
          margin: var(--ddd-spacing-2, 8px) 0;
        }

        #copyroutebtn {
          color: var(--text-color);
          width: 44px;
          height: 44px;
          border: 1px solid var(--border-color);
          border-radius: var(--ddd-radius-xs, 4px);
          background: var(--bg-color);
        }

        #copyroutebtn:hover {
          background: var(--hover-bg-color);
        }

        .machine-note {
          margin: var(--ddd-spacing-2, 8px) 0 0;
        }

        .source-note {
          border-left: var(--ddd-border-sm) solid var(--border-color);
          margin: 0 0 var(--ddd-spacing-4, 16px);
          padding-left: var(--ddd-spacing-2, 8px);
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
