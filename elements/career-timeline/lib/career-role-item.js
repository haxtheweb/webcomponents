/**
 * Copyright 2026 winstonwumbo
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `ddd-steps-list-item`
 *
 * @demo index.html
 * @element ddd-steps-list-item
 */
export class CareerRoleItem extends DDDSuper(LitElement) {
  static get tag() {
    return "career-role-item";
  }

  constructor() {
    super();
    this.title = "Role Title";
    this.startDate = new Date();
    this.endDate = new Date();
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      startDate: { type: String, attribute: "start-date" },
      endDate: { type: String, attribute: "end-date" }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          border-left: 2px solid var(--ddd-theme-default-limestoneLight);
          padding-left: 45px;
          margin-left: 24px;
          position: relative;
          scroll-margin-top: 112px;
        }

        :host([data-hax-active]) .role-content {
          outline: var(
            --hax-body-active-outline,
            1px solid var(--hax-ui-color-focus, #000)
          );
          outline-offset: 8px;
        }

        .circle {
          width: var(--ddd-icon-size-xl, 8px);
          height: var(--ddd-icon-size-xl, 8px);
          border-radius: 50%;
          background-color: var(--ddd-theme-default-limestoneLight);
          margin-left: -50px;
          position: absolute;
        }

        .role-content div ::slotted(p) {
          padding: 0;
          margin: 0;
        }

        .role-content div {
          min-height: 36px;
          padding: 0;
          margin: 0;
        }

        h3 {
          margin: 4px 0 0 0;
          color: var(--lowContrast-override, var(--ddd-theme-primary, #1e407c));
        }

        h5 {
          margin-top: 0;
        }

        :host(:last-of-type) {
          border-left: unset;
          margin-left: 26px;
        }

        @media (max-width: 768px) {
          :host {
            border-left: unset;
            padding-left: unset;
            display: block;
          }
          .circle {
            position: relative;
            margin-left: unset;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="circle"></div>
        <div class="role-content">
          <h5>${this.title}</h5>
          ${this._formatDate()}
          <div><slot></slot></div>
        </div>
      </div>
    `;
  }

  /**
  * LitElement lifecycle
  */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "startDate" && oldValue !== undefined) {
        // When people hit "clear" from the HAX editor, default back to current day
        // Otherwise, the empty value returns all the way back to the start of Unix time!
        if(!this.startDate) this.startDate = new Date();

        this.dispatchEvent(new CustomEvent('start-date-changed', {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: { node: this }
        }));
      };

      if (propName === "endDate" && oldValue !== undefined) {
        if(!this.endDate) this.endDate = new Date();
      };
    });
  }

  connectedCallback() {
    super.connectedCallback();

    // Force a contenteditable primitive if there's nothing in the slot
    if (this.children.length === 0) {
      const p = globalThis.document.createElement("p");
      p.textContent = "Describe your role here...";
      this.appendChild(p);
    }
  }

  _formatDate(){
    const startDateObj = new Date(this.startDate);
    const endDateObj = new Date(this.endDate);

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

    // Using a 3-letter short format for the months
    const shortDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    });

    const shortStart = shortDate.format(startDateObj);
    // If there's no explicit end date, interpret as ongoing role
    const shortEnd = this.hasAttribute('end-date') ? shortDate.format(endDateObj) : "Present";

    return `${shortStart} - ${shortEnd} · ${totalYears} ${totalMonths}`;
  }

  static get haxProperties() {
    return {
      "type": "grid",
      "canScale": false,
      "designSystem": false,
      "canEditSource": true,
      "contentEditable": false,
      "hideDefaultSettings": true,
      "gizmo": {
        "title": "Career Role Item",
        "description": "An individual role within an organization",
        "icon": "chrome-reader-mode",
        "color": "light-blue",
        "tags": ["Content", "list", "step"],
        "handles": [],
        "meta": {
          "author": "winstonwumbo",
          "hidden": true
        }
      },
      "settings": {
        "configure": [
          {
            "property": "title",
            "title": "Title",
            "inputMethod": "textfield"
          },
          {
            "property": "startDate",
            "title": "Start Date",
            "inputMethod": "datepicker"
          },
          {
            "property": "endDate",
            "title": "End Date (Optional)",
            "inputMethod": "datepicker"
          }
        ],
        "advanced": [],
        "developer": []
      },
    }
  }
}

globalThis.customElements.define(CareerRoleItem.tag, CareerRoleItem);
