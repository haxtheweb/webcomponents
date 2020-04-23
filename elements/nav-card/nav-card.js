/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/accent-card/accent-card.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
/**
 * `nav-card`
 * an accent card of link lists
 *
 * @customElement nav-card
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class NavCard extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        ::slotted([slot="linklist"]) {
          display: none;
        }
        h1,
        h2,
        h3,
        accent-card > [slot="heading"] {
          font-size: 14px;
          font-weight: normal;
          color: var(--simple-colors-default-theme-grey-7, #666);
          margin: 0;
        }
        accent-card {
          margin: var(--elmsln-studio--Margin, 20px);
          flex: 1 0 calc(50% - 2 * var(--elmsln-studio--Margin, 20px));
          --accent-card-footer-border-color: transparent;
        }
        .linklist {
          list-style-type: none;
          padding-inline-start: 0;
        }
        .linklist li {
          position: relative;
          padding: 5px 0;
          margin-bottom: 1px;
          opacity: 0.8;
        }
        .linklist li {
          padding: 5px 0;
          text-align: left;
          min-height: 25px;
          border-bottom: 1px solid
            var(--simple-colors-default-theme-grey-4, #666);
        }
        button[slot="subheading"] {
          text-decoration: underline;
        }
        button[slot="subheading"]:focus,
        button[slot="subheading"]:hover {
          text-decoration: none;
        }
        ::slotted(button),
        .linklist button {
          border: none;
          padding: 0;
          text-align: left;
          font-size: inherit;
          font-weight: inherit;
        }
        .linklist iron-icon {
          position: absolute;
          width: 24px;
          height: 24px;
          right: 0px;
          top: calc(50% - 12px);
        }
        .linklist-heading::after {
          content: " ";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
        .linklist-heading:focus {
          outline: none;
        }
        .linklist li:focus,
        .linklist li:focus-within .linklist-heading::after {
          outline: 1px solid blue;
        }
        .linklist li:hover .linklist-heading,
        .linklist li:focus .linklist-heading,
        .linklist li:focus-within .linklist-heading {
          text-decoration: underline;
        }
        .linklist-heading,
        .linklist-subheading {
          display: block;
          width: calc(100% - 24px);
        }
        .linklist-heading {
          font-weight: bold;
        }
        .linklist-subheading {
          font-size: 11px;
        }
      `
    ];
  }

  // render function
  render() {
    return html`
      <accent-card
        accent-color="${this.accentColor}"
        ?dark="${this.dark}"
        ?disabled="${this.disabled}"
        ?hidden="${this.hidden}"
      >
        <div slot="heading"><slot name="heading"></slot></div>
        <div slot="subheading"><slot name="subheading"></slot></div>
        <div slot="content">
          <slot name="body"></slot>
          <slot name="linklist"></slot>
          <div id="linklist"></div>
        </div>
        <div slot="footer"><slot name="footer"></slot></div>
      </accent-card>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Nav card",
        description: "an accent card of link lists",
        icon: "icons:android",
        color: "green",
        groups: ["Card"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "nikkimk",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "hidden",
            description: "",
            inputMethod: "boolean",
            required: false,
            icon: "icons:android"
          },
          {
            property: "disabled",
            description: "",
            inputMethod: "boolean",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      dark: {
        attribute: "dark",
        type: Boolean
      },
      accentColor: {
        attribute: "accent-color",
        type: String
      },
      hidden: {
        attribute: "hidden",
        type: Boolean
      },
      linkIcon: {
        attribute: "link-icon",
        type: String
      },
      disabled: {
        attribute: "disabled",
        type: Boolean
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "nav-card";
  }

  // life cycle
  constructor() {
    super();
    this.accentColor = "grey";
    this.dark = false;
    this.disabled = false;
    this.hidden = false;
    this.tag = NavCard.tag;
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false
    });
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(NavCard.haxProperties, NavCard.tag, this);
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.updateList();
  }

  /**
   * mutation observer for tabs
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.updateList();
    return new MutationObserver(callback);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "linkIcon" && this.shadowRoot)
        this.shadowRoot
          .querySelectorAll("#linklist li > iron-icon")
          .forEach(icon => (icon.icon = this.linkIcon));
    });
  }

  updateList() {
    if (this.shadowRoot && this.shadowRoot.querySelector("#linklist")) {
      let linklist = this.shadowRoot.querySelector("#linklist"),
        ul = this.querySelector(
          'ul[slot="linklist"],ol[slot="linklist"]'
        ).cloneNode(true);
      ul.querySelectorAll("li").forEach((li, i) => this._getLi(li, i));
      linklist.innerHTML = "";
      if (ul) {
        ul.classList.add("linklist");
        linklist.appendChild(ul);
      }
    }
  }
  /**
   * formats each list item
   *
   * @param {object} li list item
   * @param {number} i index
   * @memberof NavCard
   */
  _getLi(li, i) {
    let heading = this._getHeading(li, i),
      subheading = this._getSubheading(li);

    heading.id = heading.id || `${this.id || `nav-card`}-heading${i}`;
    if (subheading) {
      subheading.id = `subheading${i}`;
      subheading.id =
        subheading.id || `${this.id || `nav-card`}-subheading${i}`;
      heading.setAttribute("aria-describedby", subheading.id);
    }
    this._makeIcon(li, heading);
  }
  /**
   * formats each heading
   *
   * @param {object} li list item
   * @returns
   * @memberof NavCard
   */
  _getHeading(li) {
    let heading = li.querySelector(".linklist-heading"),
      button = li.querySelector("button,a");
    if (!heading) {
      if (button) {
        //preferred: set heading to whatever the link or button is
        heading = button;
      } else {
        //last resort: just use dump all contents into heading
        heading = document.createElement("span");
        heading.innerHTML = li.innerHTML;
        li.innerHTML = "";
        li.appendChild(heading);
      }
      heading.classList.add(".linklist-heading");
    }
    return heading;
  }
  /**
   * formats each subheading
   *
   * @param {object} li list item
   * @returns
   * @memberof NavCard
   */
  _getSubheading(li) {
    let subheading = li.querySelector(".linklist-subheading");
    if (!subheading) {
      let contents = li.querySelectorAll(":not(.linklist-heading)");
      if (contents) {
        subheading = document.createElement("div");
        contents.forEach(item => subheading.append(item));
        subheading.classList.add(".linklist-subheading");
      }
    }
    return subheading;
  }
  /**
   * adds icon to li
   *
   * @param {object} li list-item
   * @param {object} heading heading inside list item
   * @memberof NavCard
   */
  _makeIcon(li, heading) {
    if (li && heading) {
      let icon = document.createElement("iron-icon");
      icon.icon = this.linkIcon;
      icon.setAttribute("aria-hidden", true);
      li.insertBefore(icon, heading);
    }
  }
  // static get observedAttributes() {
  //   return [];
  // }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
  }

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("nav-card", NavCard);
export { NavCard };
