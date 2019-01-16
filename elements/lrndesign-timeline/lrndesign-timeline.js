/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import {} from "@polymer/polymer/lib/elements/dom-repeat.js";

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
  // render function
  static get template() {
    return html`
      <style>
        :host {
          font-size: 14px;
          font-weight: 100;
          line-height: 160%;
          display: block;
          --lrndesign-timeline-color: var(
            --simple-colors-default-theme-grey-8,
            #444
          );
          --lrndesign-timeline-background: #f4f4f4;
          --lrndesign-timeline-border: var(
            --simple-colors-default-theme-grey-5,
            #bbb
          );
          --lrndesign-timeline-accent: #000;
          --lrndesign-timeline-accent-background: #fff;
          --lrndesign-timeline-accent-border: var(
            --simple-colors-default-theme-accent-8,
            #444
          );
          --lrndesign-timeline-header: var(
            --simple-colors-default-theme-accent-1,
            #fff
          );
          --lrndesign-timeline-header-accent: var(
            --simple-colors-default-theme-accent-8,
            #444
          );
        }
        :host([dark]) {
          --lrndesign-timeline-background: #1b1b1b;
        }
        :host([hidden]) {
          display: none;
        }
        :host #timeline {
          display: block;
          border-radius: 3px;
          border: 1px solid var(--lrndesign-timeline-border);
          border-left: 3px solid var(--lrndesign-timeline-accent-border);
        }
        :host #events {
          padding: 0;
          width: 100%;
        }
        :host .heading {
          margin: 0;
        }
        :host .heading h2 {
          font-size: 24px;
          font-weight: 300;
          color: var(--lrndesign-timeline-header-accent);
        }
        :host .heading h2,
        :host .details,
        :host .media {
          padding: 0 40px;
        }
        :host .details {
          margin: 15px 0;
        }
        :host .media {
          opacity: 1;
          transition: opacity 0.5s;
        }
        :host .media,
        :host .media * {
          margin: 0 auto;
          max-width: 100%;
          max-height: 260px;
        }
        :host(:not([timeline-size*="s"])) #timeline {
          background-color: var(--lrndesign-timeline-background);
        }
        :host(:not([timeline-size*="s"])) #events {
          height: 300px;
          position: relative;
          overflow-y: scroll;
        }
        :host(:not([timeline-size*="s"])) .event {
          position: static;
          top: 0;
        }
        :host(:not([timeline-size*="s"])) .event-overview {
          padding: 0;
          position: sticky;
          top: 0;
        }
        :host(:not([timeline-size*="s"])) .heading {
          position: absolute;
          top: 0;
          padding: 10px 0;
          overflow: hidden;
          background-color: transparent;
          width: calc(55% + 30px);
        }
        :host(:not([timeline-size*="s"])) .event[has-media][selected] .heading {
          z-index: 2;
        }
        :host(:not([timeline-size*="s"])) .event[has-media] .heading:after {
          content: " ";
          z-index: 200;
          position: absolute;
          top: 42px;
          right: 30px;
          width: 0;
          padding: 0;
          border-top: 0px solid transparent;
          border-bottom: 0px solid transparent;
          border-left: 0px solid transparent;
          transition: all 0.3s;
          transition-delay: 0.2s;
        }
        :host(:not([timeline-size*="s"]))
          .event[has-media][selected]
          .heading:after {
          top: 7px;
          right: 0px;
          border-top: 35px solid transparent;
          border-bottom: 35px solid transparent;
          border-left: 35px solid var(--lrndesign-timeline-header-accent);
          transition-delay: 0s;
        }
        :host(:not([timeline-size*="s"])) .heading h2 {
          margin: 7px 48px 0 20px;
          padding: 0 20px;
          line-height: 50px;
          height: 50px;
          color: var(--lrndesign-timeline-color);
          background-color: var(--lrndesign-timeline-background);
          transition: background-color 0.3s;
        }
        :host(:not([timeline-size*="s"])) .event[selected] .heading h2 {
          background-color: var(--lrndesign-timeline-header-accent);
          color: var(--lrndesign-timeline-header);
        }
        :host(:not([timeline-size*="s"])) .event[has-media] .heading h2:after {
          content: "";
          position: absolute;
          left: calc(100% - 48px);
          height: 50px;
          width: 0px;
          transition: all 0.3s;
          background-color: var(--lrndesign-timeline-background);
        }
        :host(:not([timeline-size*="s"]))
          .event[has-media][selected]
          .heading
          h2:after {
          width: 13px;
          background-color: var(--lrndesign-timeline-header-accent);
        }
        :host(:not([timeline-size*="s"])) .media-outer {
          display: flex;
          align-items: center;
          position: absolute;
          right: 0;
          width: 45%;
          height: 300px;
        }
        :host(:not([timeline-size*="s"])) .media {
          display: flex;
          padding: 20px 20px 20px 50px;
          opacity: 0;
          transition: opacity 0.3s delay 0.3s;
        }
        :host(:not([timeline-size*="s"])) .event[selected] .media {
          opacity: 1;
          transition-delay: 0s;
        }
        :host(:not([timeline-size*="s"])) .details {
          padding: 67px 20px 20px;
          margin: 0 20px;
          width: calc(55% - 80px);
          color: var(--lrndesign-timeline-color);
          background-color: var(--lrndesign-timeline-background);
          border: 1px solid var(--lrndesign-timeline-background);
          border-radius: 3px;
          transition: all 0.5s;
        }
        :host(:not([timeline-size*="s"])) .event:last-of-type .details {
          min-height: 180px;
        }
        :host(:not([timeline-size*="s"])) .event[selected] .details {
          color: var(--lrndesign-timeline-accent);
          background-color: var(--lrndesign-timeline-accent-background);
          border: 1px solid var(--lrndesign-timeline-border);
          box-shadow: 0 2px 2px var(--lrndesign-timeline-border);
        }
        :host(:not([timeline-size*="s"]))
          .event:first-of-type[selected]
          .details {
          border-top: 1px solid var(--lrndesign-timeline-background);
        }
        :host(:not([timeline-size*="s"]))
          .event:last-of-type[selected]
          .details {
          border-bottom: 1px solid var(--lrndesign-timeline-background);
        }
      </style>
      <style is="custom-style" include="simple-colors"></style>
      <article>
        <h1 id="title">[[title]]</h1>
        <slot></slot>
        <div id="timeline">
          <div id="events" on-scroll="_onScroll">
            <template
              id="repeat"
              is="dom-repeat"
              items="[[eventsData]]"
              as="event"
              index-as="index"
              restamp
            >
              <section class="event" has-media$="[[_isSet(event.image)]]">
                <div class="event-overview">
                  <div class="heading"><h2>[[event.heading]]</h2></div>
                  <div class="media-outer">
                    <template is="dom-if" if="[[_isSet(event.image)]]" restamp>
                      <div class="media">
                        <image
                          alt$="[[event.image.alt]]"
                          src$="[[event.image.src]]"
                        />
                      </div>
                    </template>
                  </div>
                </div>
                <div class="details">[[event.details]]</div>
              </section>
            </template>
          </div>
        </div>
      </article>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * the title of the timeline
       */
      title: {
        type: "String",
        value: null
      },
      /**
   * the events of the timeline, in the desired order, as in:```
[
  {
    "heading": "1855 - Penn State Charter",   //required, the main heading for the media, usually a date, time, or era
    "details": "",                            //optional, text describing the event
    "image": {                                //optional image for the event
      "src": "path/to/media.jpg",             //the alt text of the image
      "alt": "path/to/media.mp3",             //the url of the image
    },
    {...},
    {...},
  }
]```
   */
      events: {
        type: "Array",
        value: []
      },
      /**
   * the events of the timeline, in the desired order, as in:```
[
  {
    "heading": "1855 - Penn State Charter",   //required, the main heading for the media, usually a date, time, or era
    "details": "",                            //optional, text describing the event
    "image": {                                //optional image for the event
      "src": "path/to/media.jpg",             //the alt text of the image
      "alt": "path/to/media.mp3",             //the url of the image
    },
    {...},
    {...},
  }
]```
   */
      eventsData: {
        type: "Array",
        computed: "_sanitizeEvents(events)"
      },
      /**
       * the timline size, calculated by responsive utility
       */
      timelineSize: {
        type: "String",
        value: "xs",
        reflectToAttribute: true
      }
    };
  }

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

    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
          attribute: "timeline-size",
          relativeToParent: true
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
