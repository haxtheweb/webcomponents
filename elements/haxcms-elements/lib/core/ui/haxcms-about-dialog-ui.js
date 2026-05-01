import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "../haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { HAXCMSKeyboardShortcutsInstance } from "../utils/HAXCMSKeyboardShortcuts.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

class HAXCMSAboutDialogUI extends DDD {
  static get tag() {
    return "haxcms-about-dialog-ui";
  }
  static get properties() {
    return {
      haxVersion: { type: String, attribute: "hax-version" },
      keyboardShortcuts: { type: Array },
      markdownShortcuts: { type: Array },
    };
  }

  constructor() {
    super();
    this.haxVersion = "Loading…";
    this.keyboardShortcuts = [];
    this.markdownShortcuts = [];
    this.__disposer = [];
    this.__keyboardShortcutsUpdatedHandler =
      this._handleKeyboardShortcutsUpdated.bind(this);
    this._loadKeyboardShortcuts();
    this._loadMarkdownShortcuts();
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(
      "haxcms-keyboard-shortcuts-updated",
      this.__keyboardShortcutsUpdatedHandler,
    );
    const disposeVersion = autorun(() => {
      const version = toJS(store.version);
      this.haxVersion = version ? version : "Loading…";
    });
    this.__disposer.push(disposeVersion);
    this._loadKeyboardShortcuts();
    this._loadMarkdownShortcuts();
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
    const shortcuts = HAXCMSKeyboardShortcutsInstance.getShortcutsForDisplay();
    this.keyboardShortcuts = shortcuts
      .slice()
      .sort((a, b) =>
        `${a.label} ${a.description}`.localeCompare(`${b.label} ${b.description}`),
      );
  }

  _handleKeyboardShortcutsUpdated() {
    this._loadKeyboardShortcuts();
  }

  _loadMarkdownShortcuts() {
    const shortcutMap = HAXStore.keyboardShortcuts || {};
    const preferredOrder = [
      "#",
      "##",
      "###",
      "####",
      "#####",
      "######",
      "1.",
      "-",
      "*",
      "+",
      ">",
      "```",
      "---",
      "***",
      "___",
    ];
    const allKeys = Object.keys(shortcutMap);
    const ordered = [...preferredOrder];
    allKeys.forEach((key) => {
      if (!ordered.includes(key)) {
        ordered.push(key);
      }
    });
    this.markdownShortcuts = ordered
      .filter((key) => shortcutMap[key])
      .map((key) => ({
        trigger: key,
        description: this._markdownShortcutDescription(shortcutMap[key]),
      }));
  }

  _markdownShortcutDescription(shortcut) {
    if (!shortcut || !shortcut.tag) {
      return "Insert block";
    }
    const tag = shortcut.tag.toLowerCase();
    switch (tag) {
      case "h2":
        return "Heading 2";
      case "h3":
        return "Heading 3";
      case "h4":
        return "Heading 4";
      case "h5":
        return "Heading 5";
      case "h6":
        return "Heading 6";
      case "ol":
        return "Numbered list";
      case "ul":
        return "Bulleted list";
      case "hr":
        return "Horizontal rule";
      case "code":
        return "Code block";
      case "blockquote":
        return "Blockquote";
      default:
        return `Insert ${tag}`;
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
        No shortcuts are registered for this context.
      </p>`;
    }
    return html`<ul class="shortcut-list">
      ${shortcuts.map(
        (shortcut) => html`<li>
          <span class="shortcut-key">${shortcut.label}</span>
          <span>${shortcut.description}</span>
        </li>`,
      )}
    </ul>`;
  }

  _renderMarkdownShortcutList() {
    if (!this.markdownShortcuts || this.markdownShortcuts.length === 0) {
      return html`<p class="section-description">
        No editor shortcuts are registered.
      </p>`;
    }
    return html`<ul class="shortcut-list">
      ${this.markdownShortcuts.map(
        (shortcut) => html`<li>
          <span class="shortcut-key"><code>${shortcut.trigger}</code></span>
          <span>${shortcut.description}</span>
        </li>`,
      )}
    </ul>`;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 85vh) -
              var(--simple-modal-titlebar-height, 80px) -
              var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          min-width: 70vw;
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
          outline: var(--ddd-border-sm) solid var(--ddd-theme-default-skyBlue);
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

        .version-row {
          margin: 0 0 var(--ddd-spacing-3) 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.4;
        }

        .version-row code {
          margin-left: var(--ddd-spacing-2);
        }

        .grouped-paths {
          gap: var(--ddd-spacing-2);
        }

        .grouped-paths > li {
          margin-bottom: var(--ddd-spacing-1);
        }

        .grouped-paths ul {
          margin-top: var(--ddd-spacing-1);
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
              100dvh -
                var(
                  --simple-modal-titlebar-mobile-height,
                  var(--simple-modal-titlebar-height, 80px)
                ) -
                var(--ddd-spacing-4, 16px)
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
          <h2>Help &amp; About</h2>
          <p class="intro">
            One place for keyboard shortcuts, editor shortcuts, and
            Search options that help you learn HAXcms from inside HAXcms.
          </p>

          <details class="section" open>
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite icon="hax:hax2022" aria-hidden="true"></simple-icon-lite>
                <h3>About HAX and community</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">
                HAX is a web-native authoring system designed for accessible,
                modular content publishing across many delivery environments.
              </p>
              <p class="version-row">
                Current HAX version:
                <code>${this.haxVersion}</code>
              </p>
              <ul>
                <li>
                  <a
                    href="https://haxtheweb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Project overview</a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Documentation</a
                  >
                </li>
                <li>
                  <a
                    href="https://discord.gg/VVcAcCeZQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Join the HAX Discord community</a
                  >
                </li>
                <li>
                  <a
                    href="https://github.com/haxtheweb/issues/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Issue queue (bugs and feature requests)</a
                  >
                </li>
              </ul>
            </div>
          </details>

          <details class="section">
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite icon="hardware:keyboard" aria-hidden="true"></simple-icon-lite>
                <h3>Keyboard shortcuts</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">
                Registered centrally in HAXcms and shown by active context:
              </p>
              <div class="shortcut-groups">
                <div class="shortcut-group">
                  <h4>Global</h4>
                  ${this._renderShortcutList(globalShortcuts)}
                </div>
                <div class="shortcut-group">
                  <h4>View mode</h4>
                  ${this._renderShortcutList(viewShortcuts)}
                </div>
                <div class="shortcut-group">
                  <h4>Edit mode</h4>
                  ${this._renderShortcutList(editShortcuts)}
                </div>
              </div>
              <p class="section-description">
                Search shortcut browser path:
                <code>CMS/help/keyboard-shortcuts</code>
              </p>
            </div>
          </details>

          <details class="section">
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite icon="hax:blocks" aria-hidden="true"></simple-icon-lite>
                <h3>Editor shortcuts</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">
                <span class="shortcut-key"><code>/</code></span>
                In an empty text block, opens inline Search.
              </p>
              <p class="section-description">
                In the editor, text triggers are converted to blocks
                after typing a trigger and then space.
              </p>
              ${this._renderMarkdownShortcutList()}
            </div>
          </details>

          <details class="section">
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite icon="hax:page-edit" aria-hidden="true"></simple-icon-lite>
                <h3>Tutorials and how-to</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">
                Start with guided tasks, then move to step-by-step tutorials.
              </p>
              <ul>
                <li>
                  <a
                    href="https://haxtheweb.org/tutorials"
                    target="_blank"
                    rel="noopener noreferrer"
                    >HAX tutorials</a
                  >
                </li>
                <li>
                  Search onboarding path: <code>CMS/welcome</code>
                </li>
              </ul>
            </div>
          </details>

          <details class="section">
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite icon="hax:hax2022" aria-hidden="true"></simple-icon-lite>
                <h3>AI-ready content interfaces</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">
                HAXcms can publish pages in machine-friendly formats so LLM tools can
                read and process your content with less cleanup.
              </p>
              <ul>
                <li>
                  Add <code>.md</code>, <code>.json</code>, <code>.yaml</code>, or
                  <code>.xml</code> to page URLs to request alternate page outputs.
                </li>
                <li>
                  Use <code>/llms.txt</code> as a model-facing index for this site,
                  with links to key machine-readable resources.
                </li>
                <li>
                  Pair <code>/site.json</code> (structure) with
                  <code>/lunrSearchIndex.json</code> (retrieval) for stronger
                  AI-powered workflows.
                </li>
              </ul>
              <p class="section-description">Learn more in the HAX ecosystem:</p>
              <ul>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation/data-formats"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Data formats guide</a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation/developers/schema/json-outline-schema"
                    target="_blank"
                    rel="noopener noreferrer"
                    >JSON Outline Schema</a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/documentation/oer-schema"
                    target="_blank"
                    rel="noopener noreferrer"
                    >OER Schema</a
                  >
                </li>
                <li>
                  <a
                    href="https://haxtheweb.org/hax-lab/hax-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    >HAX AI overview</a
                  >
                </li>
              </ul>
            </div>
          </details>

          <details class="section">
            <summary class="section-title">
              <span class="summary-leading">
                <simple-icon-lite icon="icons:search" aria-hidden="true"></simple-icon-lite>
                <h3>Search options in one place</h3>
              </span>
            </summary>
            <div class="collapse-body">
              <p class="section-description">
                Use these grouped Search paths to jump directly to major
                workflows:
              </p>
              <ul class="grouped-paths">
                <li>
                  <strong>Help and onboarding</strong>
                  <ul>
                    <li><code>CMS/help/keyboard-shortcuts</code></li>
                    <li><code>CMS/welcome</code></li>
                    <li><code>CMS/admin/about</code></li>
                  </ul>
                </li>
                <li>
                  <strong>Admin and site configuration</strong>
                  <ul>
                    <li><code>CMS/admin/dashboard</code></li>
                    <li><code>CMS/admin/structure</code></li>
                    <li><code>CMS/admin/content</code></li>
                    <li><code>CMS/admin/files</code></li>
                    <li><code>CMS/admin/appearance</code></li>
                    <li><code>CMS/admin/editor</code></li>
                    <li><code>CMS/admin/seo</code></li>
                  </ul>
                </li>
                <li>
                  <strong>Page editing and metadata</strong>
                  <ul>
                    <li><code>CMS/action/edit</code></li>
                    <li><code>CMS/action/save</code></li>
                    <li><code>CMS/edit/title</code></li>
                    <li><code>CMS/edit/description</code></li>
                    <li><code>CMS/edit/slug</code></li>
                    <li><code>CMS/edit/tags</code></li>
                  </ul>
                </li>
                <li>
                  <strong>Navigation and publishing operations</strong>
                  <ul>
                    <li><code>/site/navigation</code></li>
                    <li><code>CMS/export/page</code></li>
                    <li><code>CMS/export/site</code></li>
                    <li><code>CMS/action/print</code></li>
                  </ul>
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
