/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { parseVcf } from "./lib/vcf-parse.js";

/**
 * `vcf-render`
 * Render a contact file (.vcf) in place, in the shape that suits the content:
 * person cards, quotes, a table or a list.
 *
 * It follows csv-render: point `data-source` at a file, it is fetched once the
 * element is on screen, parsed client side and rendered. Parsing is local, so
 * contact details are never sent anywhere to be read. `contact-data` takes the
 * same file contents inline instead, which is what the demo and the tests use.
 *
 * A card may embed another card in an AGENT property. The embedded card is not
 * promoted to a contact of its own, because it describes someone acting for
 * the contact rather than another entry in the file.
 *
 * It renders as a DDD block: a header ("People · Contacts", the caption as a
 * heading, and a download link for the .vcf when there is a data-source),
 * the contacts, and a footer with how many there are. The list mode draws
 * one row per person (photo or initials, name, role, and email / call
 * actions when the contact has them).
 *
 * @demo demo/index.html
 * @element vcf-render
 */
export class VcfRender extends I18NMixin(IntersectionObserverMixin(DDD)) {
  static get tag() {
    return "vcf-render";
  }

  constructor() {
    super();
    this.dataSource = "";
    this.contactData = "";
    this.displayAs = "cards";
    this.caption = "";
    this.status = "idle";
    this.contacts = [];
    this.debounceDelay = 500;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      name: "Name",
      position: "Position",
      organization: "Organization",
      email: "Email",
      phone: "Phone",
      address: "Address",
      loadingContacts: "Loading contacts",
      contactsUnavailable: "Contacts unavailable",
      noContacts: "No contacts in this file",
      peopleContacts: "People · Contacts",
      downloadContacts: "Download contacts (.vcf)",
      oneContact: "1 contact",
      contactCount: "{count} contacts",
      emailName: "Email {name}",
      callName: "Call {name}",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/vcf-render.ar.json", import.meta.url).href + "/../",
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * URL of the .vcf file, usually one uploaded to the site's files.
       */
      dataSource: { type: String, attribute: "data-source" },
      /**
       * Contact file contents, for rendering without a fetch.
       */
      contactData: { type: String, attribute: "contact-data" },
      /**
       * How to present the contacts: cards, quotes, table or list.
       */
      displayAs: { type: String, attribute: "display-as", reflect: true },
      /**
       * Caption for the table and a heading for the other modes.
       */
      caption: { type: String },
      /**
       * idle, loading, ready or error.
       */
      status: { type: String, reflect: true },
      /**
       * Delay in ms before a data-source change triggers a load. Exposed
       * mainly so tests can shrink it; the default matches csv-render.
       */
      debounceDelay: { type: Number, attribute: "debounce-delay" },
      contacts: { type: Array },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        .ddd-block-body {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        }
        .ddd-block-body.flush {
          padding: 0;
        }
        /* one card per contact, as many across as the container can hold. a
           plain grid keeps this to the container's own width without pulling
           in the float based legacy grid elements */
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--ddd-spacing-4);
        }
        .cards > div {
          min-width: 0;
        }
        .quotes {
          display: grid;
          gap: var(--ddd-spacing-4);
        }
        /* one row per person: avatar, name and role, then the actions */
        .rows {
          display: block;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .row {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          margin: 0;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .row:last-child {
          border-bottom: none;
        }
        .avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-md);
          height: var(--ddd-icon-md);
          border-radius: var(--ddd-radius-circle);
          overflow: hidden;
          background-color: light-dark(
            var(--ddd-theme-default-skyLight),
            var(--ddd-theme-default-slateGray)
          );
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .meta {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          gap: var(--ddd-spacing-1);
          min-width: 0;
          font-size: var(--ddd-font-size-5xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .meta .name {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .meta a.name {
          text-decoration: underline;
          text-underline-offset: 0.15em;
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        .meta a.name:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .row-actions {
          display: inline-flex;
          gap: var(--ddd-spacing-1);
          flex: none;
        }
        .ddd-block-footer {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .status {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-2) 0;
        }
        .status[data-error] {
          color: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-theme-default-discoveryCoral)
          );
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
      `,
    ];
  }

  /**
   * The display modes, in the order Merlin should offer them.
   */
  static get displayModes() {
    return ["cards", "quotes", "table", "list"];
  }

  /**
   * LitElement life cycle - property about to change. Reading the file here
   * folds the parsed events into the update already in flight instead of
   * scheduling another one (see https://lit.dev/msg/change-in-update).
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("contactData")) {
      this.parseContacts();
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      (changedProperties.has("displayAs") ||
        changedProperties.has("elementVisible")) &&
      this.elementVisible
    ) {
      this.importDisplayDependencies();
    }
    if (
      (changedProperties.has("dataSource") ||
        changedProperties.has("elementVisible")) &&
      this.dataSource &&
      this.elementVisible
    ) {
      clearTimeout(this.__debounce);
      this.__debounce = setTimeout(() => {
        this.loadContactData();
      }, this.debounceDelay);
    }
  }

  disconnectedCallback() {
    // drop any pending load so the element does not fetch, or leak a timer,
    // after it leaves the page
    clearTimeout(this.__debounce);
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  /**
   * Pull in only the elements the current mode renders, and only once the
   * contacts are on screen, so a mode nobody looks at costs nothing.
   */
  importDisplayDependencies() {
    switch (this.displayAs) {
      case "quotes":
        import("@haxtheweb/media-quote/media-quote.js");
        break;
      case "table":
        import("@haxtheweb/editable-table/editable-table.js");
        break;
      case "list":
        // rows are drawn by this element itself
        break;
      default:
        import("@haxtheweb/person-testimonial/person-testimonial.js");
        break;
    }
  }

  /**
   * Fetch the contact file. A failure is reported in the element rather than
   * only in the console, because empty space gives a reader nothing to act on.
   */
  async loadContactData() {
    if (!this.dataSource) {
      return;
    }
    this.status = "loading";
    try {
      const response = await fetch(this.dataSource);
      if (!response.ok) {
        throw new Error(`request for ${this.dataSource} failed`);
      }
      this.contactData = await response.text();
    } catch {
      this.contacts = [];
      this.status = "error";
    }
  }

  parseContacts() {
    if (!this.contactData) {
      this.contacts = [];
      if (this.status !== "error") {
        this.status = "idle";
      }
      return;
    }
    const { contacts } = parseVcf(this.contactData);
    this.contacts = contacts;
    this.status = "ready";
    this.dispatchEvent(
      new CustomEvent("vcf-render-parsed", {
        bubbles: true,
        composed: true,
        detail: { contacts },
      }),
    );
  }

  /**
   * What goes in the quote slot of a card. A contact often carries no note, so
   * fall back to the details that identify them rather than quoting nothing.
   */
  quoteText(contact) {
    return (
      contact.summary ||
      [contact.email, contact.tel].filter(Boolean).join(" · ") ||
      contact.address ||
      ""
    );
  }

  /**
   * Where a contact should link to: their own site, then email, then the file
   * itself, which is what makes a list entry worth clicking on a phone.
   */
  contactLink(contact) {
    if (contact.url) {
      return contact.url;
    }
    if (contact.email) {
      return `mailto:${contact.email}`;
    }
    return this.dataSource || "";
  }

  get headingText() {
    return this.caption || "";
  }

  renderCards() {
    return html`
      <div class="cards" role="list">
        ${this.contacts.map(
          (contact) => html`
            <div role="listitem">
              <person-testimonial
                image="${contact.photo}"
                name="${contact.displayName}"
                position="${[contact.position, contact.org]
                  .filter(Boolean)
                  .join(", ")}"
                >${this.quoteText(contact)}</person-testimonial
              >
            </div>
          `,
        )}
      </div>
    `;
  }

  renderQuotes() {
    return html`
      <div class="quotes">
        ${this.contacts.map(
          (contact) => html`
            <media-quote
              src="${contact.photo}"
              alt="${contact.displayName}"
              quote="${this.quoteText(contact)}"
              author="${contact.displayName}"
              author-detail="${[contact.position, contact.org]
                .filter(Boolean)
                .join(", ")}"
              accent-color="${this.accentColor}"
            ></media-quote>
          `,
        )}
      </div>
    `;
  }

  renderTable() {
    return html`
      <editable-table
        accent-color="${this.accentColor}"
        hide-block-header
        bordered
        striped
        condensed
        column-header
        sort
      >
        <table>
          ${this.headingText
            ? html`<caption>
                ${this.headingText}
              </caption>`
            : nothing}
          <thead>
            <tr>
              <th>${this.t.name}</th>
              <th>${this.t.position}</th>
              <th>${this.t.organization}</th>
              <th>${this.t.email}</th>
              <th>${this.t.phone}</th>
              <th>${this.t.address}</th>
            </tr>
          </thead>
          <tbody>
            ${this.contacts.map(
              (contact) => html`
                <tr>
                  <td>${contact.displayName}</td>
                  <td>${contact.position}</td>
                  <td>${contact.org}</td>
                  <td>${contact.email}</td>
                  <td>${contact.tel}</td>
                  <td>${contact.address}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </editable-table>
    `;
  }

  /**
   * Initials for a contact without a photo: first letters of the first and
   * last words of their name.
   */
  initials(contact) {
    const words = String(contact.displayName || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!words.length) {
      return "";
    }
    const first = Array.from(words[0])[0] || "";
    const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : "";
    return (first + (last || "")).toLocaleUpperCase(this.displayLocale);
  }

  get displayLocale() {
    return (
      this.lang ||
      (globalThis.document &&
        globalThis.document.documentElement &&
        globalThis.document.documentElement.lang) ||
      undefined
    );
  }

  /**
   * A web link from the file, only when it is http(s); anything else in a
   * contact file is not something to put in an href.
   */
  safeWebLink(url) {
    return /^https?:\/\//i.test(String(url || "").trim())
      ? String(url).trim()
      : "";
  }

  /**
   * tel: link for a phone number: digits and a leading + only.
   */
  telLink(tel) {
    const digits = String(tel || "").replace(/[^\d+]/g, "");
    return digits ? `tel:${digits}` : "";
  }

  renderList() {
    return html`
      <ul class="rows" role="list">
        ${this.contacts.map((contact) => {
          const name = contact.displayName;
          const role = [contact.position, contact.org]
            .filter(Boolean)
            .join(", ");
          const site = this.safeWebLink(contact.url);
          const tel = this.telLink(contact.tel);
          return html`
            <li class="row" role="listitem">
              <span class="avatar" aria-hidden="true"
                >${contact.photo
                  ? html`<img src="${contact.photo}" alt="" loading="lazy" />`
                  : this.initials(contact)}</span
              >
              <span class="meta">
                ${site
                  ? html`<a class="name" href="${site}">${name}</a>`
                  : html`<span class="name">${name}</span>`}
                ${role ? html`<span class="role">${role}</span>` : nothing}
              </span>
              ${contact.email || tel
                ? html`<span class="row-actions">
                    ${contact.email
                      ? html`<a
                          class="ddd-block-action"
                          href="mailto:${contact.email}"
                          aria-label="${String(this.t.emailName).replace(
                            "{name}",
                            name,
                          )}"
                          title="${String(this.t.emailName).replace(
                            "{name}",
                            name,
                          )}"
                          ><simple-icon-lite
                            icon="communication:email"
                            aria-hidden="true"
                          ></simple-icon-lite
                        ></a>`
                      : nothing}
                    ${tel
                      ? html`<a
                          class="ddd-block-action"
                          href="${tel}"
                          aria-label="${String(this.t.callName).replace(
                            "{name}",
                            name,
                          )}"
                          title="${String(this.t.callName).replace(
                            "{name}",
                            name,
                          )}"
                          ><simple-icon-lite
                            icon="communication:call"
                            aria-hidden="true"
                          ></simple-icon-lite
                        ></a>`
                      : nothing}
                  </span>`
                : nothing}
            </li>
          `;
        })}
      </ul>
    `;
  }

  get footerText() {
    return this.contacts.length === 1
      ? this.t.oneContact
      : String(this.t.contactCount).replace(
          "{count}",
          String(this.contacts.length),
        );
  }

  renderContacts() {
    switch (this.displayAs) {
      case "quotes":
        return this.renderQuotes();
      case "table":
        return this.renderTable();
      case "list":
        return this.renderList();
      default:
        return this.renderCards();
    }
  }

  /**
   * The body of the block for the current state: loading, error, empty or
   * the contacts. Null when there is nothing to show at all.
   */
  renderBody() {
    if (this.status === "error") {
      return html`<div class="status" data-error role="alert">
        ${this.t.contactsUnavailable}
      </div>`;
    }
    if (this.status === "loading") {
      return html`<div class="status" aria-live="polite">
        ${this.t.loadingContacts}
      </div>`;
    }
    if (!this.contacts.length) {
      if (this.status === "ready") {
        return html`<div class="status">${this.t.noContacts}</div>`;
      }
      // an element with nothing in it has no height, and an element with no
      // height never crosses the visibility threshold that starts the fetch,
      // so a file that is waiting to load has to take up a line. with no file
      // to load there is nothing to say, and HAX shows its own placeholder
      // for an unconfigured element
      return this.dataSource
        ? html`<div class="status" aria-live="polite">
            ${this.t.loadingContacts}
          </div>`
        : null;
    }
    return this.renderContacts();
  }

  render() {
    const body = this.renderBody();
    if (body === null) {
      return nothing;
    }
    const showsContacts = this.contacts.length > 0 && this.status === "ready";
    const flush = showsContacts && this.displayAs === "list";
    return html`
      <div class="ddd-block" part="frame" role="group" aria-labelledby="hdr">
        ${renderDDDBlockHeader({
          id: "hdr",
          icon: "social:people",
          label: this.t.peopleContacts,
          title: this.headingText,
          titleTag: "h3",
          actions: this.dataSource
            ? html`<a
                class="ddd-block-action"
                href="${this.dataSource}"
                download
                aria-label="${this.t.downloadContacts}"
                title="${this.t.downloadContacts}"
                ><simple-icon-lite
                  icon="icons:file-download"
                  aria-hidden="true"
                ></simple-icon-lite
              ></a>`
            : nothing,
        })}
        <div class="ddd-block-body ${flush ? "flush" : ""}">${body}</div>
        ${showsContacts
          ? html`<div class="ddd-block-footer">${this.footerText}</div>`
          : nothing}
      </div>
    `;
  }

  /**
   * HAX lifecycle hooks this element takes part in.
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
    };
  }

  /**
   * Teach HAX that vcf is a type an element can handle, so this element can be
   * offered for one. The platform stays type agnostic: the type is registered
   * here rather than hard-coded in the store.
   *
   * @param {object} store the HAX store
   */
  haxgizmoRegistration(store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `vcf-render.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
        },
      }),
    );
    if (
      store &&
      Array.isArray(store.validGizmoTypes) &&
      !store.validGizmoTypes.includes("vcf")
    ) {
      store.validGizmoTypes.push("vcf");
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(VcfRender.tag, VcfRender);
