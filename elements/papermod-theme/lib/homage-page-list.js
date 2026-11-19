/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

/**
 * `homage-page-list`
 * The pages under the active page, as a list of title, date and
 * description: a post index, or the contents of a section. Renders nothing
 * when the active page has no pages under it. Theme chrome, not a HAX block.
 *
 * Colors come from the --homage-* properties of the theme around it.
 * variant: cards | rows | plain | compact | grid
 *
 * @element homage-page-list
 */
class HomagePageList extends LitElement {
  static get tag() {
    return "homage-page-list";
  }

  static get properties() {
    return {
      variant: { type: String, reflect: true },
      label: { type: String },
      empty: { type: Boolean, reflect: true },
      items: { type: Array },
    };
  }

  constructor() {
    super();
    this.variant = "rows";
    this.label = "";
    this.empty = true;
    this.items = [];
    this.__disposer = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.__disposer.push(
      autorun(() => {
        const manifest = toJS(store.manifest);
        const activeId = toJS(store.activeId);
        const all =
          manifest && Array.isArray(manifest.items) ? manifest.items : [];
        const items = activeId
          ? all
              .filter(
                (item) =>
                  item.parent === activeId &&
                  !(item.metadata && item.metadata.published === false),
              )
              .sort((a, b) => a.order - b.order)
          : [];
        this.items = items;
        this.empty = items.length === 0;
      }),
    );
  }

  // the theme around this gives the page less reserved height when a list
  // follows it
  updated(changedProperties) {
    if (changedProperties.has("empty")) {
      this.dispatchEvent(
        new CustomEvent("empty-changed", { detail: { value: this.empty } }),
      );
    }
  }

  disconnectedCallback() {
    this.__disposer.forEach((dispose) => dispose());
    this.__disposer = [];
    super.disconnectedCallback();
  }

  // created is unix seconds; pages made by hand may not carry one
  __date(item) {
    const created = item.metadata ? Number(item.metadata.created) : 0;
    if (!created) {
      return null;
    }
    const date = new Date(created * 1000);
    const lang = globalThis.document.documentElement.lang || undefined;
    let text;
    try {
      text = date.toLocaleDateString(lang, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      // a lang the page declares but the browser does not know
      text = date.toLocaleDateString();
    }
    return { iso: date.toISOString().slice(0, 10), text };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin-top: var(--ddd-spacing-8);
          font-family: var(--homage-font-heading, var(--ddd-font-navigation));
        }
        :host([empty]) {
          display: none;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--ddd-spacing-6);
        }
        a {
          color: var(--homage-text);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          text-decoration: none;
        }
        a:hover,
        a:focus-visible {
          text-decoration: underline;
        }
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
        time {
          display: block;
          color: var(--homage-muted);
          font-size: var(--ddd-font-size-4xs);
        }
        p {
          margin: var(--ddd-spacing-2) 0 0;
          color: var(--homage-text);
          font-family: var(--homage-font-body, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }

        /* cards and grid: each page on its own surface */
        :host([variant="cards"]) li,
        :host([variant="grid"]) li {
          padding: var(--ddd-spacing-6);
          border: var(--ddd-border-xs);
          border-color: var(--homage-rule);
          border-radius: var(--homage-radius, var(--ddd-radius-md));
          background-color: var(--homage-surface);
        }
        :host([variant="cards"]) time,
        :host([variant="grid"]) time {
          margin-top: var(--ddd-spacing-3);
        }
        :host([variant="grid"]) ul {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }

        /* rows: titles in the accent color */
        :host([variant="rows"]) a {
          color: var(--homage-accent);
          text-decoration: underline;
          text-decoration-style: dashed;
          text-underline-offset: 4px;
        }
        :host([variant="rows"]) time {
          margin-top: var(--ddd-spacing-1);
        }

        /* plain: the date over the title */
        :host([variant="plain"]) li {
          display: flex;
          flex-direction: column;
        }
        :host([variant="plain"]) time {
          order: -1;
        }
        :host([variant="plain"]) a {
          color: var(--homage-accent);
        }

        /* compact: date and title on one line, no description */
        :host([variant="compact"]) ul {
          gap: var(--ddd-spacing-2);
        }
        :host([variant="compact"]) li {
          display: flex;
          align-items: baseline;
          gap: var(--ddd-spacing-4);
        }
        :host([variant="compact"]) time {
          order: -1;
          flex: 0 0 auto;
          min-width: 104px;
          font-family: var(--ddd-font-mono);
        }
        :host([variant="compact"]) a {
          font-size: var(--ddd-font-size-xxs);
          font-weight: var(--ddd-font-weight-regular);
        }
        :host([variant="compact"]) p {
          display: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <ul aria-label="${this.label}">
        ${this.items.map((item) => {
          const date = this.__date(item);
          return html`
            <li>
              <a href="${item.slug}">${item.title}</a>
              ${
                date
                  ? html`<time datetime="${date.iso}">${date.text}</time>`
                  : ``
              }
              ${item.description ? html`<p>${item.description}</p>` : ``}
            </li>
          `;
        })}
      </ul>
    `;
  }
}
globalThis.customElements.define(HomagePageList.tag, HomagePageList);
export { HomagePageList };
