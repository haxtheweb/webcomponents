/**
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./lib/career-org-item.js";

/**
 * `career-timeline`
 * 
 * @demo index.html
 * @element career-timeline
 */
export class CareerTimeline extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "career-timeline";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/career-timeline.ar.json", import.meta.url).href +
        "/../",
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
        border: var(--ddd-border-md);
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('start-date-changed', this._sortByDate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('start-date-changed', this._sortByDate);
  }

  _sortByDate(e) {
    const items = Array.from(this.querySelectorAll('career-org-item'));

    // Descending order; if an item doesn't have a start date, default to today's date
    const sorted = items.sort((curr, next) => 
      new Date(next.earliestDate) - new Date(curr.earliestDate)
    );

    // This just moves the existing nodes around, doesn't create new ones
    sorted.forEach(item => this.appendChild(item));
  }

  _addItemHandler(e){
    const item = globalThis.document.createElement("career-org-item");

    // We need to hydrate these if we're directly appending
    const attrs = { 
      "data-hax-layout": true, 
      "data-hax-ray": "career-org-item"
    };

    for (const name in attrs) {
      item.setAttribute(name, attrs[name]);
    }

    // Assumption is that users are working on newer items, so it appends to beginning
    this.prepend(item)
  }

  haxHooks() {
    return {
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:add",
        callback: "_addItemHandler",
        label: "Add organization to timeline",
      },
    ];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CareerTimeline.tag, CareerTimeline);