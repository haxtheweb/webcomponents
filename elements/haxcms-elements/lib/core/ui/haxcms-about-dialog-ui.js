import { html, css } from "lit";
import "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HAXcmsStore } from "../haxcms-site-store.js";
import "@haxtheweb/hax-body/lib/hax-store.js";
import {
  KeyboardShortcutManagerInstance,
  KeyboardShortcutManager,
} from "@haxtheweb/utils/utils.js";
import { _pageRouteVariantUrl } from "../utils/ExportPageProgram.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

class HAXCMSAboutDialogUI extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-about-dialog-ui";
  }
  static get properties() {
    return {
      keyboardShortcuts: { type: Array },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      insertBlock: "Insert block",
      heading1: "Heading 1",
      heading2: "Heading 2",
      heading3: "Heading 3",
      heading4: "Heading 4",
      heading5: "Heading 5",
      heading6: "Heading 6",
      numberedList: "Numbered list",
      bulletedList: "Bulleted list",
      horizontalRule: "Horizontal rule",
      codeBlock: "Code block",
      blockquote: "Blockquote",
      insertTag: "Insert {tag}",
      noShortcutsRegisteredForContext:
        "No shortcuts are registered for this context.",
      helpAndAbout: "Help & About",
      aboutIntro:
        "Keyboard shortcuts, tutorials, community and more to help you learn and grow HAX.",
      aboutHaxAndCommunity: "About HAX and Community",
      haxDescription:
        "HAX is a web-native authoring system designed for accessible, modular content publishing across many delivery environments.",
      projectOverview: "Project overview",
      documentation: "Documentation",
      joinTheHaxDiscordCommunity: "Join the HAX Discord community",
      issueQueue: "Issue queue (bugs and feature requests)",
      keyboardShortcuts: "Keyboard shortcuts",
      keyboardShortcutsDescription:
        "Registered centrally in HAXcms and shown by active context. Bindings use Ctrl+Shift+[Key]; in the editor, typing a markdown trigger then space converts the block. Type {slash} in an empty text block to open inline Search.",
      global: "Global",
      viewMode: "View mode",
      editMode: "Edit mode",
      searchShortcutBrowserPath: "Search shortcut browser path:",
      tutorialsAndHowTo: "Tutorials and How-To",
      tutorialsDescription:
        "Start with guided tasks, then move to step-by-step tutorials.",
      haxTutorials: "HAX tutorials",
      customThemeDevelopmentDocs: "Custom theme development docs",
      searchOnboardingPath: "Search onboarding path:",
      apiLinks: "API Links",
      apiLinksDescription:
        "HAXcms can publish pages in machine-friendly formats so LLM tools can read and process your content with less cleanup.",
      apiLinksFormats:
        "Add {formats} to page URLs to request alternate page outputs.",
      apiLinksLlms:
        "Use {llms} as a model-facing index for this site, with links to key machine-readable resources.",
      apiLinksPair:
        "Pair {siteJson} (structure) with {searchIndex} (retrieval) for stronger AI-powered workflows.",
      apiLinksOpenapi: "Explore the site API contract at {openapi}.",
      learnMoreInTheHaxEcosystem: "Learn more in the HAX ecosystem:",
      dataFormatsGuide: "Data formats guide",
      haxAiOverview: "HAX AI overview",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.keyboardShortcuts = [];
    this.__disposer = [];
    this.__keyboardShortcutsUpdatedHandler =
      this._handleKeyboardShortcutsUpdated.bind(this);
    this._loadKeyboardShortcuts();
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(
      "haxcms-keyboard-shortcuts-updated",
      this.__keyboardShortcutsUpdatedHandler,
    );
    this._loadKeyboardShortcuts();
  }

  disconnectedCallback() {
    globalThis.removeEventListener(
      "haxcms-keyboard-shortcuts-updated",
      this.__keyboardShortcutsUpdatedHandler,
    );
    while (this.__disposer.length) {
      const d = this.__disposer.pop();
      if (d && typeof d === "function") {
        d();
      } else if (d && typeof d.dispose === "function") {
        d.dispose();
      }
    }
    super.disconnectedCallback();
  }

  _loadKeyboardShortcuts() {
    // Pull every descriptor (bindings + markdown triggers) from the shared
    // registry so this single list is the source of truth. Markdown
    // descriptors carry their own description (e.g. "Heading 1" for the #
    // trigger, which inserts h2 for a11y); the tag-based helper is only a
    // fallback for descriptors that did not set one.
    const descriptors = KeyboardShortcutManagerInstance.getAll();
    this.keyboardShortcuts = descriptors
      .map((d) => {
        const label =
          d.type === "markdown"
            ? d.trigger
            : KeyboardShortcutManager.generateLabel(d);
        let description = d.description;
        if (!description && d.type === "markdown") {
          description = this._markdownShortcutDescription({ tag: d.tag });
        }
        return {
          label: label,
          description: description || "",
          context: d.context,
          type: d.type,
        };
      })
      .slice()
      .sort((a, b) =>
        `${a.label} ${a.description}`.localeCompare(
          `${b.label} ${b.description}`,
        ),
      );
  }

  /**
   * Split a translated string on {placeholder} tokens and interleave the
   * matching template values so links / code can live inside one sentence
   */
  _fillTemplate(text, values = {}) {
    return text
      .split(/(\{[a-zA-Z]+\})/)
      .map((part) => {
        const m = part.match(/^\{([a-zA-Z]+)\}$/);
        return m && values[m[1]] !== undefined ? values[m[1]] : part;
      });
  }

  _handleKeyboardShortcutsUpdated() {
    this._loadKeyboardShortcuts();
  }

  _markdownShortcutDescription(shortcut) {
    if (!shortcut || !shortcut.tag) {
      return this.t.insertBlock;
    }
    const tag = shortcut.tag.toLowerCase();
    switch (tag) {
      case "h1":
        return this.t.heading1;
      case "h2":
        return this.t.heading2;
      case "h3":
        return this.t.heading3;
      case "h4":
        return this.t.heading4;
      case "h5":
        return this.t.heading5;
      case "h6":
        return this.t.heading6;
      case "ol":
        return this.t.numberedList;
      case "ul":
        return this.t.bulletedList;
      case "hr":
        return this.t.horizontalRule;
      case "code":
        return this.t.codeBlock;
      case "blockquote":
        return this.t.blockquote;
      default:
        return this.t.insertTag.replace("{tag}", () => tag);
    }
  }

  _shortcutsForContext(context) {
    return this.keyboardShortcuts.filter(
      (shortcut) => shortcut.context === context,
    );
  }

  _renderShortcutList(shortcuts) {
    if (!shortcuts || shortcuts.length === 0) {
      return html`<p class="section-description">
        ${this.t.noShortcutsRegisteredForContext}
      </p>`;
    }
    return html`<ul class="shortcut-list">
      ${shortcuts.map(
        (shortcut) =>
          html`<li>
            <span class="shortcut-key"
              >${shortcut.type === "markdown"
                ? html`<code>${shortcut.label}</code>`
                : shortcut.label}</span
            >
            <span>${shortcut.description}</span>
          </li>`,
      )}
    </ul>`;
  }

  _currentSiteBaseHref() {
    let outlineLocation = "";
    if (
      HAXcmsStore &&
      HAXcmsStore.storePieces &&
      HAXcmsStore.storePieces.siteBuilder &&
      typeof HAXcmsStore.storePieces.siteBuilder.outlineLocation === "string"
    ) {
      outlineLocation = HAXcmsStore.storePieces.siteBuilder.outlineLocation;
    }
    const baseElement = globalThis.document.querySelector("base");
    const baseHref =
      baseElement && baseElement.href
        ? baseElement.href
        : `${globalThis.location.origin}/`;
    try {
      return new URL(outlineLocation || ".", baseHref).toString();
    } catch {
      // intentionally empty
    }
    return baseHref;
  }

  _currentSiteResourceHref(resource = "") {
    const cleanResource = String(resource || "").replace(/^\/+/, "");
    try {
      return new URL(cleanResource, this._currentSiteBaseHref()).toString();
    } catch {
      // intentionally empty
    }
    return cleanResource;
  }

  _currentPageFormatHref(format = "json") {
    const normalizedFormat = String(format || "")
      .replace(/^\./, "")
      .toLowerCase();
    const routeFormat =
      normalizedFormat === "md" ? "markdown" : normalizedFormat;
    const routeVariant = _pageRouteVariantUrl(routeFormat);
    if (routeVariant) {
      return routeVariant;
    }
    if (normalizedFormat === "md") {
      return this._currentSiteResourceHref("index.md");
    }
    return this._currentSiteResourceHref(`index.${normalizedFormat}`);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          min-height: min(40vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          padding: var(--ddd-spacing-4);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          flex-shrink: 0;
        }

        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .panel-scroll {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: var(--ddd-spacing-1);
          width: 100%;
          box-sizing: border-box;
        }

        details {
          max-width: 100%;
          min-width: 100%;
          width: 100%;
          box-sizing: border-box;
        }

        h2 {
          margin: 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }

        .intro {
          margin: 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.4;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }

        .section {
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.15)
          );
          padding: var(--ddd-spacing-4);
          width: 100%;
          overflow: visible;
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0;
          cursor: pointer;
        }

        .section[open] .section-title {
          margin-bottom: var(--ddd-spacing-3);
        }

        .section-title:focus-visible {
          outline: var(--ddd-border-size-sm) solid var(--ddd-theme-default-skyBlue);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }

        .summary-leading {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }

        .section-title simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }

        .section-title h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }

        .section-description {
          margin: 0 0 var(--ddd-spacing-3) 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.4;
        }
        .section-description:last-child {
          margin-bottom: 0;
        }

        .collapse-body {
          padding: 0;
          overflow: visible;
        }

        ul {
          margin: 0;
          padding-inline-start: var(--ddd-spacing-6);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-3xs);
        }

        li {
          line-height: 1.35;
        }
        .shortcut-list {
          padding-inline-start: 0;
          list-style: none;
          gap: var(--ddd-spacing-2);
        }

        .shortcut-list li {
          display: grid;
          grid-template-columns: minmax(170px, 220px) minmax(0, 1fr);
          gap: var(--ddd-spacing-2);
          align-items: baseline;
        }

        .shortcut-key {
          display: inline-block;
          min-width: 180px;
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
        }
        .shortcut-groups {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }

        .shortcut-group h4 {
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
        }

        a {
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-primary)
          );
          text-underline-offset: 2px;
        }

        a:hover,
        a:focus-visible {
          color: var(--ddd-theme-default-skyBlue);
        }

        code {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          padding: 1px var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-xs);
          background: light-dark(
            var(--ddd-theme-default-limestoneGray),
            rgba(255, 255, 255, 0.15)
          );
        }

        @media screen and (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
            min-height: 0;
            height: auto;
            max-height: calc(
              100dvh - var(
                  --simple-modal-titlebar-mobile-height,
                  var(--simple-modal-titlebar-height, 80px)
                ) - var(--ddd-spacing-4, 16px)
            );
            overflow-y: auto;
            overflow-x: hidden;
            padding: var(--ddd-spacing-3);
          }

          .panel-shell {
            min-height: auto;
          }

          .panel-scroll {
            flex: 0 0 auto;
            min-height: auto;
            overflow: visible;
            padding-right: 0;
          }

          .section {
            padding: var(--ddd-spacing-3);
          }

          .shortcut-key {
            min-width: 0;
            margin-right: var(--ddd-spacing-2);
          }

          .shortcut-list li {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--ddd-spacing-1);
          }
        }
      `,
    ];
  }

  render() {
    const editShortcuts = this._shortcutsForContext("edit");
    const viewShortcuts = this._shortcutsForContext("view");
    const globalShortcuts = this._shortcutsForContext("global");
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <h2>${this.t.helpAndAbout}</h2>
          <p class="intro">${this.t.aboutIntro}</p>

          <details class="section" open>
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite
                  icon="hax:hax2022"
                  aria-hidden="true"
                ></simple-icon-lite>
                <h3>${this.t.aboutHaxAndCommunity}</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">${this.t.haxDescription}</p>
              <ul>
                <li>
                  <a
                    href="https://haxtheweb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${this.t.projectOverview}</a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${this.t.documentation}</a
                  >
                </li>
                <li>
                  <a
                    href="https://discord.gg/aCGxmRHEJP"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${this.t.joinTheHaxDiscordCommunity}</a
                  >
                </li>
                <li>
                  <a
                    href="https://github.com/haxtheweb/issues/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${this.t.issueQueue}</a
                  >
                </li>
              </ul>
            </div>
          </details>

          <details class="section">
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite
                  icon="hardware:keyboard"
                  aria-hidden="true"
                ></simple-icon-lite>
                <h3>${this.t.keyboardShortcuts}</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">
                ${this._fillTemplate(this.t.keyboardShortcutsDescription, {
                  slash: html`<code>/</code>`,
                })}
              </p>
              <div class="shortcut-groups">
                <div class="shortcut-group">
                  <h4>${this.t.global}</h4>
                  ${this._renderShortcutList(globalShortcuts)}
                </div>
                <div class="shortcut-group">
                  <h4>${this.t.viewMode}</h4>
                  ${this._renderShortcutList(viewShortcuts)}
                </div>
                <div class="shortcut-group">
                  <h4>${this.t.editMode}</h4>
                  ${this._renderShortcutList(editShortcuts)}
                </div>
              </div>
              <p class="section-description">
                ${this.t.searchShortcutBrowserPath}
                <code>CMS/help/keyboard-shortcuts</code>
              </p>
            </div>
          </details>

          <details class="section">
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite
                  icon="hax:page-edit"
                  aria-hidden="true"
                ></simple-icon-lite>
                <h3>${this.t.tutorialsAndHowTo}</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">${this.t.tutorialsDescription}</p>
              <ul>
                <li>
                  <a
                    href="https://haxtheweb.org/tutorials"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${this.t.haxTutorials}</a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation/developers/haxsite/custom-theme-development"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${this.t.customThemeDevelopmentDocs}</a
                  >
                </li>
                <li>
                  ${this.t.searchOnboardingPath} <code>CMS/welcome</code>
                </li>
              </ul>
            </div>
          </details>

          <details class="section">
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite
                  icon="hax:hax2022"
                  aria-hidden="true"
                ></simple-icon-lite>
                <h3>${this.t.apiLinks}</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">${this.t.apiLinksDescription}</p>
              <ul>
                <li>
                  ${this._fillTemplate(this.t.apiLinksFormats, {
                    formats: html`<a
                    href="${this._currentPageFormatHref("html")}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ><code>.html</code></a
                  >,
                  <a
                    href="${this._currentPageFormatHref("md")}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ><code>.md</code></a
                  >,
                  <a
                    href="${this._currentPageFormatHref("json")}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ><code>.json</code></a
                  >,
                  <a
                    href="${this._currentPageFormatHref("yaml")}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ><code>.yaml</code></a
                  >,
                  <a
                    href="${this._currentPageFormatHref("xml")}"
                    target="_blank"
                    rel="noopener noreferrer"
                    ><code>.xml</code></a
                  >`,
                  })}
                </li>
                <li>
                  ${this._fillTemplate(this.t.apiLinksLlms, {
                    llms: html`<a
                      href="${this._currentSiteResourceHref("llms.txt")}"
                      target="_blank"
                      rel="noopener noreferrer"
                      ><code>/llms.txt</code></a
                    >`,
                  })}
                </li>
                <li>
                  ${this._fillTemplate(this.t.apiLinksPair, {
                    siteJson: html`<a
                      href="${this._currentSiteResourceHref("site.json")}"
                      target="_blank"
                      rel="noopener noreferrer"
                      ><code>/site.json</code></a
                    >`,
                    searchIndex: html`<a
                      href="${this._currentSiteResourceHref(
                        "lunrSearchIndex.json",
                      )}"
                      target="_blank"
                      rel="noopener noreferrer"
                      ><code>/lunrSearchIndex.json</code></a
                    >`,
                  })}
                </li>
                <li>
                  ${this._fillTemplate(this.t.apiLinksOpenapi, {
                    openapi: html`<a
                      href="${this._currentSiteResourceHref("x/api/openapi")}"
                      target="_blank"
                      rel="noopener noreferrer"
                      ><code>/x/api/openapi</code></a
                    >`,
                  })}
                </li>
              </ul>
              <p class="section-description">
                ${this.t.learnMoreInTheHaxEcosystem}
              </p>
              <ul>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation/data-formats"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${this.t.dataFormatsGuide}</a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation/developers/schema/json-outline-schema"
                    target="_blank"
                    rel="noopener noreferrer"
                    >JSON Outline Schema<!-- i18n-ignore: specification name --></a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation/oer-schema"
                    target="_blank"
                    rel="noopener noreferrer"
                    >OER Schema<!-- i18n-ignore: specification name --></a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/hax-lab/hax-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${this.t.haxAiOverview}</a
                  >
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(HAXCMSAboutDialogUI.tag, HAXCMSAboutDialogUI);
export { HAXCMSAboutDialogUI };
