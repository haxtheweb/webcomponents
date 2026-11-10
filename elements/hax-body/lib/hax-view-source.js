import { LitElement, html, css } from "lit";
import { stripMSWord, formatHTML } from "@haxtheweb/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-toolbar.js";
import { HaxComponentStyles } from "./hax-ui-styles.js";
import { autorun, toJS } from "mobx";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-menu-item.js";
import "./hax-tray-button.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { trimLineEdges } from "@haxtheweb/utils/lib/safe-html.js";

/**
 * `hax-eview-source`
 * @element hax-eview-source
 * `Export dialog with all export options and settings provided.`
 */
class HaxViewSource extends I18NMixin(LitElement) {
  static get styles() {
    return [
      ...HaxComponentStyles,
      css`
        :host {
          display: block;
          height: calc(100vh - 120px);
        }
        #wrapper {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          position: relative;
          flex: 1 1 100%;
        }
        #spacer {
          flex: 1 1 100%;
          z-index: -1;
        }
        #textarea {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: 0;
          padding: 0;
          height: calc(100vh - 200px);
        }
        /* HAX UI tool row: labeled 32px buttons in their usual order,
           Update HTML as the one primary, Copy HTML (changes nothing) last
           and quiet */
        hax-toolbar {
          flex: 0 0 auto;
          background-color: var(
            --hax-ui-surface,
            var(--hax-ui-background-color)
          );
          border-bottom: 1px solid
            var(--hax-ui-line, var(--hax-ui-border-color));
        }
        hax-toolbar::part(buttons) {
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
          gap: var(--hax-ui-gap, 4px);
          margin: 0;
          padding: var(--hax-ui-gap-md, 8px) var(--hax-ui-gap-lg, 12px);
        }
        hax-tray-button {
          flex: 0 0 auto;
          --simple-toolbar-button-height: var(--hax-ui-icon, 16px);
          --simple-toolbar-button-width: var(--hax-ui-icon, 16px);
        }
        hax-tray-button.copycontent {
          margin-inline-start: auto;
        }
        hax-tray-button::part(button) {
          box-sizing: border-box;
          height: var(--hax-ui-row-height, 32px);
          gap: var(--hax-ui-gap-md, 8px);
          padding: 0 var(--hax-ui-gap-lg, 12px);
          border: 1px solid
            var(--hax-ui-line-strong, var(--hax-ui-border-color));
          border-radius: var(--hax-ui-radius, 4px);
          background-color: var(
            --hax-ui-surface,
            var(--hax-ui-background-color)
          );
          color: var(--hax-ui-text, var(--hax-ui-color));
          font-size: var(--hax-ui-admin-font-size, 14px);
          text-transform: none;
        }
        hax-tray-button::part(label) {
          margin: 0;
        }
        hax-tray-button:hover::part(button),
        hax-tray-button:focus-within::part(button) {
          background-color: var(
            --hax-ui-hover,
            var(--hax-ui-background-color-secondary)
          );
        }
        hax-tray-button.updatecontent::part(button) {
          border-color: var(--hax-ui-primary);
          background-color: var(--hax-ui-primary);
          color: var(--hax-ui-on-primary);
          font-weight: 700;
        }
        hax-tray-button.updatecontent:hover::part(button),
        hax-tray-button.updatecontent:focus-within::part(button) {
          border-color: var(--hax-ui-primary-hover);
          background-color: var(--hax-ui-primary-hover);
        }
        hax-tray-button.copycontent::part(button) {
          border-color: transparent;
          background-color: transparent;
        }
        simple-toolbar-menu {
          --simple-toolbar-button-border-color: var(--hax-ui-border-color);
        }
        /** This is mobile layout for controls */
        @media screen and (max-width: 800px) {
          /* icon-only on a phone; the label stays the accessible name */
          hax-tray-button::part(label) {
            display: none;
          }
          hax-tray-button::part(button) {
            width: var(--hax-ui-row-height, 32px);
            padding: 0;
            justify-content: center;
          }
        }
      `,
    ];
  }
  render() {
    return html`${
      this.hidden
        ? ``
        : html` <hax-toolbar always-expanded>
              <hax-tray-button
                label="${this.t.updateHTML}"
                icon="hax:admin-check"
                @click="${this.updateBodyFromHTML}"
                icon-position="left"
                show-text-label
                class="updatecontent"
              >
              </hax-tray-button>
              <hax-tray-button
                @click="${this.scrubContent}"
                icon="hax:admin-clear-format"
                label="${this.t.cleanFormatting}"
                icon-position="left"
                show-text-label
              >
              </hax-tray-button>
              ${
                MicroFrontendRegistry.has("@core/prettyHtml")
                  ? html`
                      <hax-tray-button
                        label="${this.t.prettifyHtml}"
                        icon="hax:admin-prettify"
                        @click="${this.prettifyContent}"
                        icon-position="left"
                        show-text-label
                      >
                      </hax-tray-button>
                    `
                  : html``
              }
              <hax-tray-button
                @click="${this.selectBody}"
                icon="hax:admin-copy"
                label="${this.t.copyHTML}"
                icon-position="left"
                show-text-label
                class="copycontent"
              >
              </hax-tray-button>
            </hax-toolbar>
            <div id="wrapper">
              <div id="spacer"></div>
              <textarea id="hiddentextarea" hidden></textarea>
              <code-editor
                id="textarea"
                theme="${
                  this.haxUiTheme == "hax"
                    ? "vs"
                    : this.haxUiTheme == "haxdark"
                      ? "vs-dark"
                      : "auto"
                }"
                language="html"
                font-size="13"
                word-wrap
              ></code-editor>
            </div>`
    } `;
  }
  static get tag() {
    return "hax-view-source";
  }
  // ability to refresh source view; possible something else in the system updated it
  // after we loaded
  refreshHTMLEditor(_e) {
    this.updateEditor();
  }
  /**
   * Import content into body area.
   */
  async updateBodyFromHTML(_e) {
    // import contents of this text area into the activeHaxBody
    let htmlBody = this.shadowRoot.querySelector("#textarea").value || "";
    let children =
      HAXStore.activeHaxBody.shadowRoot.querySelector("#body").localName ===
      "slot"
        ? HAXStore.activeHaxBody.shadowRoot
            .querySelector("#body")
            .assignedNodes({
              flatten: true,
            })
        : [];
    // we have children and we don't have a page break, so we need to
    // inject the current one at the top of what's being imported
    // or else they'll brick the resulting transaction
    if (
      children.length > 0 &&
      children[0].tagName === "PAGE-BREAK" &&
      !htmlBody.includes("<page-break")
    ) {
      let pb = await HAXStore.nodeToContent(children[0]);
      htmlBody = pb + "\n" + htmlBody;
    }
    HAXStore.activeHaxBody.importContent(htmlBody);
    HAXStore.haxTray.trayDetail = "";
  }

  /**
   * Scrub and then import content as if pasted from Word / GDocs
   */
  scrubContent(_e) {
    // import contents of this text area into the activeHaxBody
    const htmlBody = this.shadowRoot.querySelector("#textarea").value || "";
    HAXStore.toast(this.t.scrubbedContentUpdated);
    HAXStore.activeHaxBody.importContent(stripMSWord(htmlBody));
    this.close();
  }

  async prettifyContent(_e) {
    let haxBodyHtml = await HAXStore.activeHaxBody.haxToContent();
    const response = await MicroFrontendRegistry.call("@core/prettyHtml", {
      html: haxBodyHtml,
    });
    if (response.status == 200) {
      this.shadowRoot.querySelector("#textarea").editorValue = "";
      setTimeout(() => {
        const htmlCode = trimLineEdges(response.data);
        this.shadowRoot.querySelector("#textarea").editorValue = htmlCode;
      }, 0);
    }
    const htmlBody = this.shadowRoot.querySelector("#textarea").value || "";
    HAXStore.toast(this.t.formattingUpdated);
    HAXStore.activeHaxBody.importContent(htmlBody);
  }
  /**
   * update content of the editor area
   */
  openSource() {
    // import at this time so we can delay as long as possible
    // from needing to pull in monaco
    if (!globalThis.customElements.get("code-editor")) {
      import("@haxtheweb/code-editor/code-editor.js").then(() => {
        this.updateEditor();
        // delay is because we conditionally render the entire tree
        // to reduce memory usage because of how large the Monaco window is
        setTimeout(() => {
          this.updateEditor();
        }, 1000);
      });
    } else {
      // delay is because we conditionally render the entire tree
      // to reduce memory usage because of how large the Monaco window is
      setTimeout(() => {
        this.updateEditor();
      }, 1000);
    }
  }
  /**
   * selectBody
   */
  selectBody(_e) {
    let hiddenarea = this.shadowRoot.querySelector("#hiddentextarea");
    hiddenarea.value = this.shadowRoot.querySelector("#textarea").value || "";
    hiddenarea.removeAttribute("hidden");
    hiddenarea.focus();
    hiddenarea.select();
    globalThis.document.execCommand("copy");
    hiddenarea.setAttribute("hidden", "hidden");
    HAXStore.toast(this.t.copiedToClipboard);
    //this.close();
  }

  close() {
    HAXStore.haxTray.trayDetail = "";
  }

  updateEditor() {
    if (
      HAXStore.activeHaxBody &&
      this.shadowRoot &&
      this.shadowRoot.querySelector("#textarea")
    ) {
      this.shadowRoot.querySelector("#textarea").editorValue = "";
      setTimeout(async () => {
        const htmlCode = formatHTML(
          await HAXStore.activeHaxBody.haxToContent(),
        );
        this.shadowRoot.querySelector("#textarea").editorValue = htmlCode;
      }, 0);
    }
  }

  /**
   * Output entire thing as a file.
   */
  async contentToFile(full) {
    let body = await HAXStore.activeHaxBody.haxToContent();
    let content = body;
    // if you want full HTML headers or not
    if (full) {
      // derive the CDN base from the generating page when it defines one,
      // falling back to the PSU CDN, and normalize a trailing slash
      let cdnBase =
        globalThis.WCGlobalCDNPath || "https://cdn.webcomponents.psu.edu/cdn/";
      if (!cdnBase.endsWith("/")) {
        cdnBase += "/";
      }
      content = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes"
            />
            <title>hax-body demo</title>
            <script>globalThis.WCGlobalCDNPath="${cdnBase}"; </script> <script src="${cdnBase}build.js"></script> 
            <style>
              body {
                padding: 32px;
              }
            </style>
          </head>
          <body>
          ${body}
          </body>
        </html>
      `;
    }
    return content;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Global preferences for HAX overall
       */
      globalPreferences: {
        type: Object,
      },
      hidden: {
        type: Boolean,
        reflect: true,
      },
      theme: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.t = {
      updateHTML: "Update HTML",
      copyHTML: "Copy HTML",
      copiedToClipboard: "Copied to clipboard",
      prettifyHtml: "Prettify HTML",
      cleanFormatting: "Clean Formatting",
      haxSchema: "HAX schema JSON",
      revisionHistory: "Revision history",
      scrubbedContentUpdated: "Scrubbed. Content updated.",
      formattingUpdated: "Formatting updated. Content updated.",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.globalPreferences);
      Promise.resolve().then(() => {
        this.globalPreferences = _mobx_val_0;
        this.haxUiTheme = (this.globalPreferences || {}).haxUiTheme || "hax";
      });
    });
  }
}
globalThis.customElements.define(HaxViewSource.tag, HaxViewSource);
export { HaxViewSource };
