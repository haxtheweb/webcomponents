import { html, css, nothing } from "lit";
import "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import { HAXcmsStore } from "../haxcms-site-store.js";
import "@haxtheweb/hax-body/lib/hax-store.js";
import {
  KeyboardShortcutManagerInstance,
  KeyboardShortcutManager,
} from "@haxtheweb/utils/utils.js";
import { _pageRouteVariantUrl } from "../utils/ExportPageProgram.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

/**
 * `haxcms-about-dialog-ui`
 * The About admin section: help links, tutorials, API links and the
 * keyboard shortcuts list. Footer "none" in the one admin dialog
 * (haxcms-site-admin): it saves nothing, and with `inShell` it leaves the
 * page title and intro to the shell.
 */
class HAXCMSAboutDialogUI extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-about-dialog-ui";
  }
  static get properties() {
    return {
      keyboardShortcuts: { type: Array },
      /** which shortcut context is listed: global, view or edit */
      shortcutContext: { type: String, attribute: "shortcut-context" },
      /** set by haxcms-site-admin: the shell draws the page title */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
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
      shortcutContextLabel: "Shortcut context",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.keyboardShortcuts = [];
    this.shortcutContext = "global";
    this.inShell = false;
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
    return text.split(/(\{[a-zA-Z]+\})/).map((part) => {
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
      return html`<p class="empty">
        ${this.t.noShortcutsRegisteredForContext}
      </p>`;
    }
    return html`<ul class="shortcut-list">
      ${shortcuts.map(
        (shortcut) =>
          html`<li>
            <span>${shortcut.description}</span>
            <span class="shortcut-key"
              >${shortcut.type === "markdown"
                ? html`<code>${shortcut.label}</code>`
                : html`<kbd class="hax-ui-kbd">${shortcut.label}</kbd>`}</span
            >
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
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          display: block;
          box-sizing: border-box;
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow-y: auto;
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px)
            var(--ddd-spacing-5, 20px);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.4;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        /* the shell owns the height and the scroll */
        :host([in-shell]) {
          height: auto;
          max-height: none;
          overflow: visible;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        .page-head {
          margin-bottom: var(--ddd-spacing-4, 16px);
        }
        .page-head h2 {
          margin: 0;
          font-size: var(--ddd-font-size-xs, 22px);
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.2;
        }
        .page-head p {
          margin: var(--hax-ui-gap) 0 0;
          color: var(--hax-ui-text-muted);
        }
        .cols {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
          gap: var(--ddd-spacing-6, 24px);
          align-items: start;
        }
        .col {
          min-width: 0;
        }
        section + section {
          margin-top: var(--ddd-spacing-5, 20px);
        }
        h3 {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: 0 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        h3 simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
        }
        .lead {
          margin: 0 0 var(--hax-ui-gap-md);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        /* DDD lays lists out at content scale (flex, 12px gap) */
        ul {
          display: block;
          gap: 0;
          margin: 0;
          padding: 0;
          list-style: none;
          font-family: inherit;
          font-size: inherit;
        }
        ul li {
          margin: 0;
          padding: 0;
          font-size: inherit;
          line-height: inherit;
        }
        .links li + li {
          margin-top: 2px;
        }
        .hl {
          display: grid;
          grid-template-columns: var(--hax-ui-row-height) minmax(0, 1fr) var(
              --hax-ui-icon
            );
          gap: var(--hax-ui-gap-lg);
          align-items: center;
          min-height: calc(var(--hax-ui-row-height) + var(--hax-ui-gap-md));
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.35;
          text-decoration: none;
          color: var(--hax-ui-text);
        }
        .hl > span {
          font-size: inherit;
        }
        .hl:hover {
          background-color: var(--hax-ui-hover);
        }
        .hl .ic {
          display: grid;
          place-items: center;
          width: var(--hax-ui-row-height);
          height: var(--hax-ui-row-height);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        .hl simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
        }
        .hl .ext {
          color: var(--hax-ui-text-muted);
        }
        .path {
          margin: var(--hax-ui-gap) 0 0;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .api li {
          display: block;
          min-height: calc(var(--hax-ui-row-height) + var(--hax-ui-gap));
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
        }
        .api li + li {
          margin-top: var(--hax-ui-gap-md);
        }
        .api + .lead {
          margin-top: var(--hax-ui-gap-lg);
        }
        .seg {
          display: inline-flex;
          height: var(--hax-ui-row-height);
          margin-bottom: var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
        }
        .seg button {
          all: unset;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          padding: 0 var(--hax-ui-gap-lg);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .seg button + button {
          border-left: 1px solid var(--hax-ui-line-strong);
        }
        .seg button:hover {
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        .seg button[aria-pressed="true"] {
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-accent-soft);
        }
        .seg button:focus-visible,
        .hl:focus-visible,
        a:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .shortcut-list li {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: var(--hax-ui-gap-lg);
          align-items: center;
          min-height: 36px;
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .shortcut-key {
          justify-self: end;
          white-space: nowrap;
          text-align: right;
        }
        .shortcut-key .hax-ui-kbd {
          display: inline-block;
          line-height: 18px;
        }
        .empty {
          margin: 0;
          padding: var(--hax-ui-gap-md);
          color: var(--hax-ui-text-muted);
        }
        a {
          color: var(--hax-ui-accent-strong);
          text-underline-offset: 2px;
        }
        code {
          display: inline;
          margin: 0;
          border: 0;
          line-height: inherit;
          letter-spacing: normal;
          transition: none;
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
          padding: 1px var(--hax-ui-gap);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-hover);
        }
        @media (max-width: 900px) {
          :host {
            height: auto;
            max-height: none;
            padding: var(--hax-ui-gap-lg) var(--ddd-spacing-4, 16px);
          }
          .cols {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (forced-colors: active) {
          .seg button[aria-pressed="true"] {
            outline: 1px solid Highlight;
          }
        }
      `,
    ];
  }

  _renderLink(href, label, icon) {
    return html`<li>
      <a class="hl" href="${href}" target="_blank" rel="noopener noreferrer"
        ><span class="ic"
          ><simple-icon-lite
            icon="${icon}"
            aria-hidden="true"
          ></simple-icon-lite></span
        ><span>${label}</span
        ><simple-icon-lite
          class="ext"
          icon="icons:open-in-new"
          aria-hidden="true"
        ></simple-icon-lite
      ></a>
    </li>`;
  }

  _formatLink(format) {
    return html`<a
      href="${this._currentPageFormatHref(format)}"
      target="_blank"
      rel="noopener noreferrer"
      ><code>.${format}</code></a
    >`;
  }

  _resourceLink(resource, label) {
    return html`<a
      href="${this._currentSiteResourceHref(resource)}"
      target="_blank"
      rel="noopener noreferrer"
      ><code>${label}</code></a
    >`;
  }

  _renderShortcuts() {
    const contexts = [
      { id: "global", label: this.t.global },
      { id: "view", label: this.t.viewMode },
      { id: "edit", label: this.t.editMode },
    ];
    return html`
      <div class="seg" role="group" aria-label="${this.t.shortcutContextLabel}">
        ${contexts.map(
          (context) =>
            html`<button
              type="button"
              data-context="${context.id}"
              aria-pressed="${this.shortcutContext === context.id
                ? "true"
                : "false"}"
              @click="${() => {
                this.shortcutContext = context.id;
              }}"
            >
              ${context.label}
            </button>`,
        )}
      </div>
      ${this._renderShortcutList(
        this._shortcutsForContext(this.shortcutContext),
      )}
    `;
  }

  render() {
    return html`
      ${!this.inShell
        ? html`<div class="page-head">
            <h2>${this.t.helpAndAbout}</h2>
            <p class="intro">${this.t.aboutIntro}</p>
          </div>`
        : nothing}
      <div class="cols">
        <div class="col">
          <section data-group="community">
            <h3>
              <simple-icon-lite
                icon="hax:hax2022"
                aria-hidden="true"
              ></simple-icon-lite
              >${this.t.aboutHaxAndCommunity}
            </h3>
            <p class="lead">${this.t.haxDescription}</p>
            <ul class="links">
              ${this._renderLink(
                "https://haxtheweb.org/",
                this.t.projectOverview,
                "hax:hax2022",
              )}
              ${this._renderLink(
                "https://haxtheweb.org/documentation",
                this.t.documentation,
                "icons:description",
              )}
              ${this._renderLink(
                "https://discord.gg/aCGxmRHEJP",
                this.t.joinTheHaxDiscordCommunity,
                "social:people",
              )}
              ${this._renderLink(
                "https://github.com/haxtheweb/issues/issues",
                this.t.issueQueue,
                "icons:bug-report",
              )}
            </ul>
          </section>

          <section data-group="tutorials">
            <h3>
              <simple-icon-lite
                icon="hax:page-edit"
                aria-hidden="true"
              ></simple-icon-lite
              >${this.t.tutorialsAndHowTo}
            </h3>
            <p class="lead">${this.t.tutorialsDescription}</p>
            <ul class="links">
              ${this._renderLink(
                "https://haxtheweb.org/tutorials",
                this.t.haxTutorials,
                "av:play-circle-outline",
              )}
              ${this._renderLink(
                "https://haxtheweb.org/documentation/developers/haxsite/custom-theme-development",
                this.t.customThemeDevelopmentDocs,
                "lrn:palette",
              )}
            </ul>
            <p class="path">
              ${this.t.searchOnboardingPath} <code>CMS/welcome</code>
            </p>
          </section>

          <section data-group="api">
            <h3>
              <simple-icon-lite
                icon="icons:code"
                aria-hidden="true"
              ></simple-icon-lite
              >${this.t.apiLinks}
            </h3>
            <p class="lead">${this.t.apiLinksDescription}</p>
            <ul class="api">
              <li>
                ${this._fillTemplate(this.t.apiLinksFormats, {
                  formats: html`${this._formatLink("html")},
                  ${this._formatLink("md")}, ${this._formatLink("json")},
                  ${this._formatLink("yaml")}, ${this._formatLink("xml")}`,
                })}
              </li>
              <li>
                ${this._fillTemplate(this.t.apiLinksLlms, {
                  llms: this._resourceLink("llms.txt", "/llms.txt"),
                })}
              </li>
              <li>
                ${this._fillTemplate(this.t.apiLinksPair, {
                  siteJson: this._resourceLink("site.json", "/site.json"),
                  searchIndex: this._resourceLink(
                    "lunrSearchIndex.json",
                    "/lunrSearchIndex.json",
                  ),
                })}
              </li>
              <li>
                ${this._fillTemplate(this.t.apiLinksOpenapi, {
                  openapi: this._resourceLink(
                    "x/api/openapi",
                    "/x/api/openapi",
                  ),
                })}
              </li>
            </ul>
            <p class="lead">${this.t.learnMoreInTheHaxEcosystem}</p>
            <ul class="links">
              ${this._renderLink(
                "https://haxtheweb.org/documentation/data-formats",
                this.t.dataFormatsGuide,
                "icons:description",
              )}
              ${this._renderLink(
                "https://haxtheweb.org/documentation/developers/schema/json-outline-schema",
                html`JSON Outline Schema<!-- i18n-ignore: specification name -->`,
                "hax:site-map",
              )}
              ${this._renderLink(
                "https://haxtheweb.org/documentation/oer-schema",
                html`OER Schema<!-- i18n-ignore: specification name -->`,
                "icons:class",
              )}
              ${this._renderLink(
                "https://haxtheweb.org/hax-lab/hax-ai",
                this.t.haxAiOverview,
                "hax:wizard-hat",
              )}
            </ul>
          </section>
        </div>

        <div class="col">
          <section data-group="shortcuts">
            <h3>
              <simple-icon-lite
                icon="hardware:keyboard"
                aria-hidden="true"
              ></simple-icon-lite
              >${this.t.keyboardShortcuts}
            </h3>
            <p class="lead">
              ${this._fillTemplate(this.t.keyboardShortcutsDescription, {
                slash: html`<code>/</code>`,
              })}
            </p>
            ${this._renderShortcuts()}
            <p class="path">
              ${this.t.searchShortcutBrowserPath}
              <code>CMS/help/keyboard-shortcuts</code>
            </p>
          </section>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(HAXCMSAboutDialogUI.tag, HAXCMSAboutDialogUI);
export { HAXCMSAboutDialogUI };
