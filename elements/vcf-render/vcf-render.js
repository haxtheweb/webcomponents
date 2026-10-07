/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
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
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        .heading {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          margin: 0 0 var(--ddd-spacing-2);
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
        .status {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-2) 0;
        }
        .status[data-error] {
          color: var(--ddd-theme-default-original87Pink);
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
        import("@haxtheweb/collection-list/collection-list.js");
        import("@haxtheweb/collection-list/lib/collection-item.js");
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
    } catch (error) {
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
        bordered
        striped
        condensed
        column-header
        sort
        printable
        downloadable
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

  renderList() {
    return html`
      <collection-list>
        ${this.contacts.map(
          (contact) => html`
            <collection-item
              line1="${contact.displayName}"
              line2="${[contact.position, contact.org]
                .filter(Boolean)
                .join(", ")}"
              line3="${contact.email || contact.tel}"
              alt="${contact.displayName}"
              image="${contact.photo}"
              icon="social:person"
              tags="${contact.categories.join(", ")}"
              url="${this.contactLink(contact)}"
              accent-color="${this.accentColor}"
            ></collection-item>
          `,
        )}
      </collection-list>
    `;
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

  render() {
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
        : nothing;
    }
    return html`
      ${this.headingText
        ? html`<div class="heading">${this.headingText}</div>`
        : nothing}
      ${this.renderContacts()}
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
