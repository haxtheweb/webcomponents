/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";

/**
 * `lrndesign-timeline`
 * `an element that displays events on a timeline`
 *
 * @element lrndesign-timeline
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class LrndesignTimeline extends SimpleColors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  static get tag() {
    return "lrndesign-timeline";
  }

  // life cycle
  constructor() {
    super();
    this.events = [];
    this.timelineSize = "xs";

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
   * events container element
   *
   * @readonly
   * @memberof LrndesignTimeline
   */
  get eventsElement() {
    return this.shadowRoot && this.shadowRoot.querySelector("#events")
      ? this.shadowRoot.querySelector("#events")
      : false;
  }

  /**
   * ensures that events list is an Array
   *
   * @readonly
   * @memberof LrndesignTimeline
   */
  get eventsList() {
    let events =
      typeof this.events === "string" ? JSON.parse(this.events) : this.events;
    return events || [];
  }

  /**
   * checks the scroll of each event
   */
  _checkScroll() {
    if (this.shadowRoot) {
      let events = this.shadowRoot.querySelectorAll(".event") || [];
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
}
customElements.define(LrndesignTimeline.tag, LrndesignTimeline);
export { LrndesignTimeline };
