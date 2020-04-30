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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
