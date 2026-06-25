/**
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./career-role-item.js";

/**
 * `ddd-steps-list`
 *
 * @demo index.html
 * @element ddd-steps-list
 */
export class CareerOrgItem extends DDDSuper(LitElement) {
  static get tag() {
    return "career-org-item";
  }

  constructor() {
    super();
    this.organization = "";
    this.location = "";
    this.source = "https://avatars.githubusercontent.com/u/170651362";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      organization: { type: String },
      location: { type: String },
      source: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          position: relative;
          padding: var(--ddd-spacing-4);
          font-family: var(--ddd-font-primary, sans-serif);
        }

        :host([data-hax-active]){
          outline: var(
            --hax-body-active-outline,
            1px solid var(--hax-ui-color-focus, #000)
          );
        }

        .item-container {
          position: relative;
          padding-left: calc(
            var(--ddd-icon-md) + var(--ddd-spacing-4)
          );
        }

        .org-info {
          display: flex;
        }

        #logo {
          width: 48px;
          height: 48px;
        }

        .org {
          padding-left: 20px;
          padding-bottom: 20px;
        }

        h3{
          margin-top: 0px;
        }

        .border-line {
          position: relative;
          border-bottom: var(--ddd-border-sm);
          width: 80%;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          :host {
            padding: 0px;
          }
          .item-container {
            padding-left: 0px;
          }
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="org-info">
        <img id="logo" src="${this.source}" alt=""/>
        <div class="org">
          <h3>${this.organization}</h3>
          ${this.location} · ${this._formatDate()}
        </div>
      </div>
      <div class="steps-container">
        <slot><career-role-item title="Add a Role"></career-role-item></slot>
        <div class="border-line"></div>
      </div>
    `;
  }

  /**
  * LitElement lifecycle
  */
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('start-date-changed', this._sortByDate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('start-date-changed', this._sortByDate);
  }

  /**
   * overrides query selector for slotted children
   * @readonly
   */
  get earliestDate() {
    const items = Array.from(this.querySelectorAll('career-role-item'));
    const startDates = items.map(item => new Date(item.startDate));
    return Math.min(...startDates);
  }
  
  /**
   * overrides query selector for slotted children
   * @readonly
   */
  get latestDate(){
    const items = Array.from(this.querySelectorAll('career-role-item'));
    const endDates = items.map(item => new Date(item.endDate));
    return Math.max(...endDates);
  }

  _formatDate(){
    // Math.max/min return Infinity for empty arrays
    if(!Number.isFinite(this.earliestDate) || !Number.isFinite(this.latestDate)) return `0 yr 0 mo`;
    const startDateObj = new Date(this.earliestDate);
    const endDateObj = new Date(this.latestDate);

    // The career timeline also aggregates total timespan at a position
    let totalYears = endDateObj.getFullYear() - startDateObj.getFullYear()
    let totalMonths = endDateObj.getMonth() - startDateObj.getMonth()

    // Sometimes something like 1 year -3 months will show up, this corrects for that
    if (totalMonths < 0) {
      totalYears--;
      totalMonths += 12;
    }

    // Accounting for proper grammar with small values
    totalYears = totalYears > 1 ? `${totalYears} yrs` : `${totalYears} yr`;
    totalMonths = totalMonths > 1 ? `${totalMonths} mos` : `${totalMonths} mo`

    return `${totalYears} ${totalMonths}`;
  }

  _sortByDate(e) {
    const items = Array.from(this.querySelectorAll('career-role-item'));

    // Descending order; if an item doesn't have a start date, default to today's date
    const sorted = items.sort((curr, next) => 
      new Date(next.startDate) - new Date(curr.startDate)
    );

    // This just moves the existing nodes around, doesn't create new ones
    sorted.forEach(item => this.appendChild(item));
    this.requestUpdate();

    // Scroll to the active node
    e.detail.node.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  _addItemHandler(e){
    const item = globalThis.document.createElement("career-role-item");

    // We need to hydrate these if we're directly appending
    const attrs = { 
      "data-hax-layout": true, 
      "data-hax-ray": "career-role-item"
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
        label: "Add role under organization",
      },
    ];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return {
      "type": "grid",
      "canScale": false,
      "designSystem": false,
      "canEditSource": false,
      "contentEditable": false,
      "hideDefaultSettings": true,
      "gizmo": {
        "title": "Career Item",
        "description": "An individual organization and its affiliated roles",
        "icon": "chrome-reader-mode",
        "color": "light-blue",
        "tags": ["Content", "list", "step"],
        "handles": [],
        "meta": {
          "author": "HAXTheWeb core team",
        }
      },
      "settings": {
        "configure": [
          {
            "property": "organization",
            "title": "Organization Name",
            "inputMethod": "textfield"
          },
          {
            "property": "location",
            "title": "Location",
            "inputMethod": "textfield"
          },
          {
            "property": "source",
            "title": "Source",
            "inputMethod": "haxupload"
          }
        ],
        "advanced": [],
        "developer": []
      }
    };
  }
}

globalThis.customElements.define(CareerOrgItem.tag, CareerOrgItem);
