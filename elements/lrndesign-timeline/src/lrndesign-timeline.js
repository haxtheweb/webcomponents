import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";

/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `lrndesign-timeline`
 * an element that displays events on a timeline
 *
 * @customElement lrndesign-timeline
 * @demo demo/index.html
 *
 */
class LrndesignTimeline extends SimpleColors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-timeline";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    this.events = [];
    this.timelineSize = "xs";
    super.connectedCallback();

    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "timeline-size",
          relativeToParent: true,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1600
        }
      })
    );
    this._checkScroll();
  }
  /**
   * handle initial update
   */
  firstUpdated() {
    super.firstUpdated();
    this._checkScroll();
  }

  /**
   * handle updates
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "timelineTitle" && this.title && !this.timelineTitle)
        this.timelineTitle = this.title;
    });
  }

  /**
   * ensures that events list is an Array
   *
   * @readonly
   * @memberof LrndesignTimeline
   */
  get eventsList() {
    let events = typeof events === "string" ? JSON.parse(events) : events;
    return events || [];
  }

  /**
   * checks the scroll of each event
   */
  _checkScroll() {
    let events = this.shadowRoot.querySelectorAll(".event");
    events.forEach(event => {
      let top = event.offsetTop,
        target = events[0].offsetTop + 50 + event.parentNode.scrollTop,
        bottom = event.offsetTop + event.offsetHeight;
      if (target > top && target < bottom) {
        event.setAttribute("selected", true);
      } else {
        event.removeAttribute("selected");
      }
    });
  }
}
window.customElements.define(LrndesignTimeline.tag, LrndesignTimeline);
export { LrndesignTimeline };
