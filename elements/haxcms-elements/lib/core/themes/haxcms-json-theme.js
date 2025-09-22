/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSPrintTheme } from "./haxcms-print-theme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import "@haxtheweb/code-sample/code-sample.js";

// a JSON display theme that extends HAXCMSPrintTheme for minimal UI but displays activeItem data as JSON
class HAXCMSJSONTheme extends HAXCMSPrintTheme {
  static get properties() {
    return {
      ...super.properties,
      activeItemData: { type: Object },
      showChildren: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.activeItemData = null;
    this.showChildren = false;
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
    
    return html`
      <header>
        <simple-icon-button-lite
          @click="${this.copyToClipboard}"
          id="copybtn"
          icon="content-copy"
          title="Copy JSON to clipboard"
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
            <h2>Active Item Data (JSON)</h2>
            <p>This is the JSON representation of the current page's activeItem data:</p>
            ${hasChildren ? html`
              <div class="controls">
                <simple-icon-button-lite
                  @click="${this.toggleChildren}"
                  id="togglebtn"
                  icon="${this.showChildren ? 'expand-less' : 'expand-more'}"
                  title="${this.showChildren ? 'Hide children' : 'Show children'}"
                >
                  ${this.showChildren ? 'Hide children' : 'Show children'}
                </simple-icon-button-lite>
              </div>
            ` : ''}
            <code-sample 
              type="json" 
              copy-clipboard-button 
              .value="${jsonData}"
            >
              <pre><code>${jsonData}</code></pre>
            </code-sample>
          </section>
        </article>
      </main>
      <footer>
        <site-footer></site-footer>
      </footer>
    `;
  }

  async copyToClipboard(e) {
    if (this.activeItemData && globalThis.navigator && globalThis.navigator.clipboard) {
      try {
        await globalThis.navigator.clipboard.writeText(JSON.stringify(this.activeItemData, null, 2));
        if (globalThis.SimpleToast && globalThis.SimpleToast.requestAvailability) {
          const toast = globalThis.SimpleToast.requestAvailability();
          toast.showSimpleToast("JSON data copied to clipboard!");
        } else {
          console.log("JSON data copied to clipboard!");
        }
      } catch (err) {
        console.error("Failed to copy JSON data: ", err);
        if (globalThis.SimpleToast && globalThis.SimpleToast.requestAvailability) {
          const toast = globalThis.SimpleToast.requestAvailability();
          toast.showSimpleToast("Failed to copy JSON data", 3000, { hat: "error" });
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

  toggleChildren(e) {
    this.showChildren = !this.showChildren;
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
            --secondary-text-color: var(--ddd-theme-default-limestoneLight, #ccc);
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