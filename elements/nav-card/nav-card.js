/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";
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
class NavCard extends AccentCard {
  
  //styles function
  static get styles() {
    return  [
      ...super.styles,
      css`
:host {
  display: block;
  --accent-card-content-padding-bottom: 0px;
  --nav-card-linklist-icon-size: 24px;
}
::slotted([slot=linklist]) {
  display: none;
}
.linklist {
  list-style-type: none;
  padding-inline-start: 0;
  margin-top: var(--nav-card-linklist-margin-top, 20px);
  margin-bottom: var(--nav-card-linklist-margin-bottom, 20px);
}
.linklist > li {
  position: relative;
  padding: 5px 0;
  margin-bottom: 1px;
  opacity: 0.8;  
  min-height: calc(1px + var(--nav-card-linklist-left-size, 24px));
  display: flex;
  flex-direction: column;
  justify-content: var(--nav-card-linklist-li-justify, center);
}
.linklist > li {
  padding: 5px 0;
  text-align: left;
  border-bottom: var(--nav-card-linklist-border-bottom, 1px solid
    var(--simple-colors-default-theme-grey-4, #666));
}
.linklist > li:last-of-type {
  border-bottom: none;
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
.linklist-left,
.linklist iron-icon {
  position: absolute;
  right: 0px;
}
.linklist-left {
  left: 0px;
  top: calc(50% - 0.5 * var(--nav-card-linklist-left-size, 24px));
  width: var(--nav-card-linklist-left-size, 24px);
  height: var(--nav-card-linklist-left-size, 24px);
  border-radius: var(--nav-card-linklist-left-border-radius, 50%); 
  border: var(--nav-card-linklist-left-border, 
    var(--nav-card-linklist-border-bottom, 1px solid
    var(--simple-colors-default-theme-grey-4, #666))); 
}
.linklist iron-icon {
  top: calc(50% - 0.5 * var(--nav-card-linklist-icon-size, 24px));
  width: var(--nav-card-linklist-icon-size, 24px);
  height: var(--nav-card-linklist-icon-size, 24px);
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
  width: 100%;
}
:host([link-icon]) .linklist-heading,
:host([link-icon]) .linklist-subheading,
li.left-icon .linklist-heading,
li.left-icon .linklist-subheading {
  width: calc(100% - 7px - var(--nav-card-linklist-icon-size, 24px));
}
:host([link-icon]) li.left-icon .linklist-heading,
:host([link-icon]) li.left-icon .linklist-subheading {
  width: calc(100% - 14px - var(--nav-card-linklist-icon-size, 24px) - var(--nav-card-linklist-left-size, 24px));
}
li.left-icon .linklist-heading,
li.left-icon .linklist-subheading {
  margin-left: calc(7px + var(--nav-card-linklist-left-size, 24px));
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

<article id="card">
  <div class="image-outer" ?hidden="${!this.imageSrc}">
    <div
      class="image"
      .style="${this.imageSrc
        ? `background-image: url(${this.imageSrc});`
        : `display: none;`}"
    ></div>
  </div>
  <div class="body">
    <h1 id="heading"><slot name="heading"></slot></h1>
    <div id="subheading"><slot name="subheading"></slot></div>
    <div id="content">
      <slot name="body"></slot>
      <div id="linklist"></div>
      <slot name="linklist"></slot>
    </div>
    <div id="footer"><slot name="footer"></slot></div>
  </div>
</article>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Nav card",
    "description": "an accent card of link lists",
    "icon": "av:playlist-play",
    "color": "pink",
    "groups": ["Card", "Nav", "List"],
    "handles": [
      {
        "type": "todo:read-the-docs-for-usage"
      }
    ],
    "meta": {
      "author": "nikkimk",
      "owner": "The Pennsylvania State University"
    }
  },
  "settings": {
    "quick": [],
    "configure": [
      {
        "property": "accentColor",
        "title": "Accent Color",
        "description": "Select an accent color.",
        "inputMethod": "colorpicker",
        "required": false
      },
      {
        "property": "Dark",
        "title": "Dark",
        "description": "Display the card as dark theme?",
        "inputMethod": "boolean",
        "required": false
      },
      {
        "property": "linkIcon",
        "title": "Link Icon",
        "description": "Select an icon.",
        "inputMethod": "iconpicker",
        "required": false
      },
      {
        "slot": "heading",
        "title": "Heading",
        "inputMethod": "code-editor",
        "required": false
      },
      {
        "slot": "subheading",
        "title": "Subheading",
        "inputMethod": "code-editor",
        "required": false
      },
      {
        "slot": "body",
        "title": "Body",
        "inputMethod": "code-editor",
        "required": false
      },
      {
        "slot": "linklist",
        "title": "Link List",
        "inputMethod": "code-editor",
        "required": false
      },
      {
        "slot": "footer",
        "title": "Footer",
        "inputMethod": "code-editor",
        "required": false
      }
    ],
    "advanced": []
  }
}
;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
  
  ...super.properties,
  
  "linkIcon": {
    "attribute": "link-icon",
    "type": String
  }
}
;
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
    this.hidden = false;
    this.tag = NavCard.tag;
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: true
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
    if (super.updated) super.updated(changedProperties);
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
        ul = this.querySelector('ul[slot="linklist"],ol[slot="linklist"]');
      if (ul) {
        linklist.innerHTML = "";
        let list = ul.cloneNode(true);
        list.querySelectorAll("li").forEach((li, i) => this._getLi(li, i));
        list.classList.add("linklist");
        linklist.appendChild(list);
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
      subheading = this._getSubheading(li),
      left = li.querySelector(".linklist-left");
    if(left) {
      li.classList.add('left-icon');
      li.appendChild(left.cloneNode(true));
    }
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
