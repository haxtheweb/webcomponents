/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";

export { LrndesignTimeline };
/**
 * `lrndesign-timeline`
 * `an element that displays events on a timeline`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
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
   * gets simple-colors behaviors
   */
  static get behaviors() {
    return [SimpleColors];
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    let root = this;
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      LrndesignTimeline.haxProperties,
      LrndesignTimeline.tag,
      this
    );

    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
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
   * checks the scroll of each event
   */
  _checkScroll() {
    let root = this,
      events = root.shadowRoot.querySelectorAll(".event");
    if (events.length < 1) root.$.repeat.render();
    events = root.shadowRoot.querySelectorAll(".event");
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

  /**
   * returns the media type for a given event, or false if there is no media
   *
   * @param {object} the event type to check
   * @param {object} the media type to check
   * @returns {string} the media type, or false if there is no media
   */

  _isMediaType(event, type) {
    return this._isSet(event.media) && this._isSet(event.media.type)
      ? event.media.type === type
      : false;
  }

  /**
   * returns true if an property is not null
   *
   * @param {object} the property to check
   * @returns {boolean} property !== undefined && property !== null
   */
  _isSet(prop) {
    return prop !== undefined && prop !== null;
  }

  /**
   * handles the scroll on the events side
   */
  _sanitizeEvents(events) {
    if (typeof events === "string") {
      events = JSON.parse(events);
    }
    if (typeof events === "object" && events.constructor !== Array) {
      events = Object.keys(events).map(function(key) {
        return events[key];
      });
    }

    //console.log(typeof events, events, events[0],events[0].heading);
    return events;
  }

  /**
   * handles the scroll on the events side
   */
  _onScroll(e) {
    this._checkScroll();
  }
}
window.customElements.define(LrndesignTimeline.tag, LrndesignTimeline);
