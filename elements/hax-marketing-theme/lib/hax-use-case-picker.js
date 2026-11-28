/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { copyToClipboard } from "@haxtheweb/utils/lib/clipboard.js";
import "@haxtheweb/simple-cta/simple-cta.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

// installs the hax command; @haxtheweb/create needs Node.js 22 or newer
const INSTALL = "npm install --global @haxtheweb/create";

// which this.t keys finish "I want a website that..." for a skeleton, and
// name the site it makes; a skeleton not listed shows its own title
const PHRASES = {
  "online-course": ["teachesACourse", "nameCourse"],
  portfolio: ["showsMyWork", "namePortfolio"],
  "art-portfolio": ["showsMyArt", "nameArt"],
  "club-website": ["runsMyClub", "nameClub"],
  docs: ["documentsMyProject", "nameDocs"],
  blog: ["publishesMyWriting", "nameBlog"],
  "resume-journey": ["tellsMyCareer", "nameJourney"],
  writing: ["publishesMyWriting", "nameWriting"],
};

/** an http(s) address, or "" */
function webAddress(value) {
  try {
    const url = new URL(`${value}`, globalThis.document.baseURI);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : "";
  } catch {
    return "";
  }
}

/**
 * `hax-use-case-picker`
 * Pick what a site is for and get a link that opens HAX in the browser
 * with that skeleton, plus the matching CLI command.
 *
 * Reads a skeleton list in the shape app-hax reads ({ data: [ { title,
 * description, machineName, priority } ] }).
 *
 * @element hax-use-case-picker
 */
class HaxUseCasePicker extends I18NMixin(DDD) {
  static get tag() {
    return "hax-use-case-picker";
  }

  static get properties() {
    return {
      ...super.properties,
      /** address of the skeleton list, relative to the page */
      source: { type: String },
      /** address of HAX in the browser */
      browserUrl: { type: String, attribute: "browser-url" },
      /** machine names to leave out, comma separated */
      exclude: { type: String },
      /** the picked skeleton's machine name */
      selected: { type: String, reflect: true },
      /** the site name typed by the visitor */
      siteName: { type: String, attribute: "site-name" },
      _skeletons: { type: Array, state: true },
      _copied: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this.source = "skeletons.json";
    this.browserUrl = "https://browser.hax.cloud/";
    this.exclude = "";
    this.selected = "";
    this.siteName = "";
    this._skeletons = [];
    this._copied = "";
    this.__nameTouched = false;
    this.t = {
      groupLabel: "I want a website that",
      siteName: "Site name",
      build: "Build my site",
      agentLink: "Link an agent can hand you",
      terminal: "Or from a terminal",
      terminalHint:
        "Installs the hax command, then makes your site in a new folder and opens it in your browser.",
      haveHax: "Already have hax? Skip the install:",
      firstTime: "First time using a terminal?",
      stepNode: "Install Node.js 22 or newer (the LTS download) from",
      stepOpen:
        "Open a terminal. macOS: Terminal (search with Spotlight). Windows: PowerShell (Start menu). Linux: your terminal app.",
      stepPaste:
        "Paste the command above and press Enter. Your site folder is made wherever the terminal is, usually your home folder.",
      stepSplit:
        "If PowerShell says && is not valid, run the two parts one at a time:",
      stepInstall: "Install hax, once per computer",
      stepMake: "Make your site",
      stepOpenSite:
        "Your site opens at a localhost address in your browser. Press Ctrl+C in the terminal to stop it. To work on it again later:",
      stepPermission:
        "If the install says permission denied (EACCES) on macOS or Linux, follow",
      npmGuide: "npm's guide to fixing permissions",
      copy: "Copy",
      copied: "Copied",
      loading: "Loading the starter sites.",
      teachesACourse: "teaches a course",
      showsMyWork: "shows my work",
      showsMyArt: "shows my art",
      runsMyClub: "runs my club",
      documentsMyProject: "documents my project",
      publishesMyWriting: "publishes my writing",
      tellsMyCareer: "tells my career as a journey",
      nameCourse: "My Course",
      namePortfolio: "My Portfolio",
      nameArt: "My Art",
      nameClub: "Our Club",
      nameDocs: "Project Docs",
      nameBlog: "My Blog",
      nameJourney: "My Journey",
      nameWriting: "My Writing",
      screenshotAlt: "Screenshot of the theme the {title} starter uses.",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("../locales/hax-use-case-picker.en.json", import.meta.url)
          .href + "/../",
    });
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("source") || changedProperties.has("exclude")) {
      this._loadSkeletons();
    }
  }

  _loadSkeletons() {
    const address = webAddress(this.source);
    if (!address) {
      this._skeletons = [];
      return;
    }
    fetch(address)
      .then((response) => (response.ok ? response.json() : { data: [] }))
      .then((json) => {
        const skip = `${this.exclude || ""}`
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name);
        this._skeletons = (Array.isArray(json.data) ? json.data : [])
          .filter(
            (item) =>
              item &&
              typeof item.machineName === "string" &&
              !skip.includes(item.machineName),
          )
          .sort((a, b) => (a.priority || 0) - (b.priority || 0));
        if (
          !this._skeletons.find((item) => item.machineName === this.selected)
        ) {
          this.selected = this._skeletons.length
            ? this._skeletons[0].machineName
            : "";
        }
      })
      .catch(() => {
        this._skeletons = [];
      });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-8);
        }
        .card {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-5);
          border: var(--ddd-border-size-md) solid
            var(
              --hm-edge,
              light-dark(
                var(--ddd-theme-default-coalyGray),
                var(--ddd-theme-default-white)
              )
            );
          border-radius: var(--ddd-radius-lg);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        /* simple-cta keeps its label on one line, so on a phone the card gives
           it room: less padding and a smaller label */
        @media (max-width: 480px) {
          .card {
            padding: var(--ddd-spacing-3);
          }
          simple-cta {
            --simple-cta-font-size: var(--ddd-font-size-4xs);
          }
        }
        .preview {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: var(--ddd-spacing-6);
          align-items: center;
        }
        .preview img {
          display: block;
          width: 100%;
          height: auto;
          border: var(--ddd-border-size-md) solid
            var(
              --hm-edge,
              light-dark(
                var(--ddd-theme-default-coalyGray),
                var(--ddd-theme-default-white)
              )
            );
          border-radius: var(--ddd-radius-md);
          box-shadow: var(--ddd-spacing-2) var(--ddd-spacing-2)
            var(--ddd-spacing-0)
            var(--hm-shade, var(--ddd-theme-default-keystoneYellow));
          box-sizing: border-box;
        }
        .preview .what {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-2);
        }
        @media (max-width: 640px) {
          .preview {
            grid-template-columns: 1fr;
          }
          .preview img {
            width: calc(100% - var(--ddd-spacing-2));
          }
        }
        /* the build button takes the site palette when the theme supplies one */
        simple-cta {
          --ddd-theme-primary: var(--hm-brand);
          --ddd-theme-accent: var(--hm-on-brand);
        }
        .choices {
          display: grid;
          /* eight starters read as two rows of four */
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--ddd-spacing-2);
        }
        @media (max-width: 760px) {
          .choices {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .choice {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          min-height: var(--ddd-spacing-18, 72px);
          padding: var(--ddd-spacing-3);
          font: inherit;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-120);
          text-align: start;
          cursor: pointer;
          color: inherit;
          background-color: transparent;
          border: var(--ddd-border-size-sm) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
          border-radius: var(--ddd-radius-sm);
        }
        .choice strong {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-bold);
        }
        .choice span {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          text-transform: uppercase;
        }
        .choice:hover {
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .choice:active {
          transform: translateY(1px);
        }
        /* the picked one: ink fill with the surface color as text, and a check
           mark. Not a palette pair: under a bridged design system some palette
           pairs fall below 4.5:1, and the state must not rest on color alone
           (WCAG 1.4.1, 1.4.3, 1.4.11) */
        .choice[aria-pressed="true"] {
          background-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        .choice simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-3xs);
          --simple-icon-width: var(--ddd-icon-3xs);
          align-self: flex-end;
          margin-top: auto;
        }
        .choice:focus-visible,
        input:focus-visible,
        .copy:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        p {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        label,
        .rowlabel {
          display: block;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          margin-bottom: var(--ddd-spacing-1);
        }
        input {
          font: inherit;
          font-size: var(--ddd-font-size-4xs);
          width: 100%;
          box-sizing: border-box;
          min-height: var(--ddd-spacing-10);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          color: inherit;
          background-color: transparent;
          border: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
          border-radius: var(--ddd-control-radius, var(--ddd-radius-xs));
        }
        .row {
          display: flex;
          align-items: stretch;
          border: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
          border-radius: var(--ddd-radius-xs);
          overflow: hidden;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .terminal {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }
        .terminal .rowlabel {
          margin-bottom: var(--ddd-spacing-0);
        }
        .hint {
          font-size: var(--ddd-font-size-5xs);
        }
        details {
          max-width: none;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          border: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
          border-radius: var(--ddd-radius-xs);
        }
        /* the card's own ink and surface, not the DDD summary colors: those
           follow the page primary, which can sit too close to this surface */
        details > summary,
        details[open] > summary {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-3);
          color: inherit;
          filter: none;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        details summary:hover,
        details summary:focus {
          color: inherit;
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        summary:focus-visible,
        details a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        details a {
          color: inherit;
          font-weight: var(--ddd-font-weight-bold);
        }
        ol {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-3)
            var(--ddd-spacing-3) var(--ddd-spacing-8);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        ol,
        ol li {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        li > .row,
        li > .rowlabel,
        li > .hint {
          margin-top: var(--ddd-spacing-2);
        }
        code:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        code {
          flex: 1 1 auto;
          min-width: 0;
          /* the whole command stays readable on a phone: it wraps instead
             of hiding its end, and Copy still takes it as one line */
          white-space: normal;
          overflow-wrap: anywhere;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--ddd-font-size-5xs);
        }
        .copy {
          font: inherit;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
          padding: var(--ddd-spacing-0) var(--ddd-spacing-3);
          color: inherit;
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          border: 0;
          border-inline-start: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneLight)
            );
        }
        .copy:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
      `,
    ];
  }

  get _active() {
    return (
      this._skeletons.find((item) => item.machineName === this.selected) || null
    );
  }

  _phrase(item) {
    return PHRASES[item.machineName]
      ? this.t[PHRASES[item.machineName][0]]
      : item.title;
  }

  _name() {
    const active = this._active;
    if (this.__nameTouched && `${this.siteName}`.trim()) {
      return `${this.siteName}`.trim();
    }
    if (!active) {
      return "";
    }
    return PHRASES[active.machineName]
      ? this.t[PHRASES[active.machineName][1]]
      : active.title;
  }

  _deepLink() {
    const base = webAddress(this.browserUrl);
    if (!base) {
      return "";
    }
    const url = new URL(base);
    url.searchParams.set("skeleton", this.selected);
    url.searchParams.set("name", this._name());
    return url.href;
  }

  _folder() {
    return (
      this._name()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "mysite"
    );
  }

  _command() {
    const machineName = `${this.selected}`.replace(/[^a-z0-9-]/g, "");
    return `hax site ${this._folder()} --skeleton-machine-name ${machineName} --y`;
  }

  // a first-timer has no hax yet, so the line they copy installs it first
  _fullCommand() {
    return `${INSTALL} && ${this._command()}`;
  }

  _nameInput(e) {
    this.__nameTouched = true;
    this.siteName = e.target.value;
  }

  _copy(which, text) {
    copyToClipboard(text);
    this._copied = which;
    setTimeout(() => {
      this._copied = "";
    }, 1500);
  }

  render() {
    const active = this._active;
    const link = this._deepLink();
    return html`
      <div class="card">
        <div class="choices" role="group" aria-label="${this.t.groupLabel}">
          ${this._skeletons.map(
            (item) => html`
              <button
                class="choice"
                aria-pressed="${
                  item.machineName === this.selected ? "true" : "false"
                }"
                @click="${() => {
                  this.selected = item.machineName;
                }}"
              >
                <strong>${this._phrase(item)}</strong>
                <span>${item.title}</span>
                ${
                  item.machineName === this.selected
                    ? html`<simple-icon-lite
                        icon="icons:check"
                        aria-hidden="true"
                      ></simple-icon-lite>`
                    : ``
                }
              </button>
            `,
          )}
        </div>
        ${
          active
            ? html`
                <div class="preview">
                  ${
                    this._shot(active)
                      ? html`<img
                          src="${this._shot(active)}"
                          alt="${this.t.screenshotAlt.replace(
                            "{title}",
                            active.title,
                          )}"
                          width="1440"
                          height="900"
                        />`
                      : ``
                  }
                  <div>
                    <p class="what">${active.title}</p>
                    <p>${active.description}</p>
                  </div>
                </div>
                <div>
                  <label for="name">${this.t.siteName}</label>
                  <input
                    id="name"
                    type="text"
                    autocomplete="off"
                    .value="${this._name()}"
                    @input="${this._nameInput}"
                  />
                </div>
                ${
                  link
                    ? html`<simple-cta
                          link="${link}"
                          label="${this.t.build}"
                        ></simple-cta>
                        <div>
                          <span class="rowlabel" id="agentlinklabel"
                            >${this.t.agentLink}</span
                          >
                          <div class="row">
                            <code
                              tabindex="0"
                              role="region"
                              aria-labelledby="agentlinklabel"
                              >${link}</code
                            >
                            <button
                              class="copy"
                              @click="${() => this._copy("link", link)}"
                            >
                              ${
                                this._copied === "link"
                                  ? this.t.copied
                                  : this.t.copy
                              }
                            </button>
                          </div>
                        </div>`
                    : ``
                }
                <div class="terminal">
                  <span class="rowlabel" id="terminallabel"
                    >${this.t.terminal}</span
                  >
                  ${this._row("full", "terminallabel", this._fullCommand())}
                  <p class="hint">${this.t.terminalHint}</p>
                  <span class="rowlabel" id="havehaxlabel"
                    >${this.t.haveHax}</span
                  >
                  ${this._row("cli", "havehaxlabel", this._command())}
                  <details>
                    <summary>${this.t.firstTime}</summary>
                    <ol>
                      <li>
                        ${this.t.stepNode}
                        <a
                          href="https://nodejs.org/en/download"
                          target="_blank"
                          rel="noopener"
                          >nodejs.org</a
                        >.
                      </li>
                      <li>${this.t.stepOpen}</li>
                      <li>
                        ${this.t.stepPaste}
                        <p class="hint">${this.t.stepSplit}</p>
                        <span class="rowlabel" id="steplabel1"
                          >${this.t.stepInstall}</span
                        >
                        ${this._row("install", "steplabel1", INSTALL)}
                        <span class="rowlabel" id="steplabel2"
                          >${this.t.stepMake}</span
                        >
                        ${this._row("make", "steplabel2", this._command())}
                      </li>
                      <li>
                        <span id="steplabel3">${this.t.stepOpenSite}</span>
                        ${this._row(
                          "serve",
                          "steplabel3",
                          `cd ${this._folder()} && hax serve`,
                        )}
                      </li>
                      <li>
                        ${this.t.stepPermission}
                        <a
                          href="https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally"
                          target="_blank"
                          rel="noopener"
                          >${this.t.npmGuide}</a
                        >.
                      </li>
                    </ol>
                  </details>
                </div>
              `
            : html`<p>${this.t.loading}</p>`
        }
      </div>
    `;
  }

  // one copyable command, named by the label with the given id
  _row(which, labelId, text) {
    return html`<div class="row">
      <code tabindex="0" role="region" aria-labelledby="${labelId}"
        >${text}</code
      >
      <button class="copy" @click="${() => this._copy(which, text)}">
        ${this._copied === which ? this.t.copied : this.t.copy}
      </button>
    </div>`;
  }

  // the skeleton's own screenshot: the full-size image beside its thumbnail
  _shot(item) {
    const file = `${item.image || ""}`.split("/").pop().replace("-thumb", "");
    return /^[a-z0-9-]+\.jpg$/.test(file)
      ? new URL(
          `../../haxcms-elements/lib/theme-screenshots/${file}`,
          import.meta.url,
        ).href
      : "";
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}
globalThis.customElements.define(HaxUseCasePicker.tag, HaxUseCasePicker);
export { HaxUseCasePicker };
