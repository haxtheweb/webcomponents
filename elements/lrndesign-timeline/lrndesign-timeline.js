/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element";
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
  // render function
  render() {
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
          --lrndesign-timeline-color-print: #000;
          --lrndesign-timeline-background: #f4f4f4;
          --lrndesign-timeline-background-print: #fff;
          --lrndesign-timeline-border: var(
            --simple-colors-default-theme-grey-5,
            #bbb
          );
          --lrndesign-timeline-border-print: var(
            --simple-colors-fixed-theme-grey-5,
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
          --lrndesign-timeline-accent-print: var(
            --simple-colors-fixed-theme-accent-8,
            #444
          );
        }

        :host([dark]) {
          --lrndesign-timeline-background: #1b1b1b;
        }

        :host([hidden]) {
          display: none;
        }

        #timeline {
          display: block;
          border-radius: 3px;
          border: 1px solid var(--lrndesign-timeline-border-print);
          border-left: 3px solid var(--lrndesign-timeline-accent-print);
          background-color: var(--lrndesign-timeline-background-print);
          color: var(--lrndesign-timeline-color-print);
        }

        #events {
          padding: 0;
          width: 100%;
          min-height: 300px;
        }

        .heading {
          margin: 0;
          color: var(--lrndesign-timeline-accent-print);
        }

        .heading h2 {
          font-size: 24px;
          font-weight: 300;
        }

        .heading h2,
        .details,
        .media {
          padding: 0 40px;
        }

        .details {
          margin: 15px 0;
        }

        .media {
          opacity: 1;
          transition: opacity 0.5s;
        }

        .media,
        .media * {
          margin: 0 auto;
          max-width: 100%;
          max-height: 260px;
        }
        @media screen {
          #timeline {
            color: var(--lrndesign-timeline-color);
            background-color: var(--lrndesign-accent-background);
            border: 1px solid var(--lrndesign-timeline-border);
            border-left: 3px solid var(--lrndesign-timeline-accent-border);
          }

          :host([dark]) #timeline {
            background-color: var(--lrndesign-timeline-background);
          }

          h2 {
            color: var(--lrndesign-timeline-header-accent);
          }

          :host(:not([timeline-size="xs"])) #timeline {
            background-color: var(--lrndesign-timeline-background);
          }

          :host(:not([timeline-size="xs"])) h2 {
            color: var(--lrndesign-timeline-header-accent);
          }

          :host(:not([timeline-size="xs"])) #events {
            height: 300px;
            position: relative;
            overflow-y: scroll;
          }

          :host(:not([timeline-size="xs"])) .event {
            position: static;
            top: 0;
          }

          :host(:not([timeline-size="xs"])) .event-overview {
            padding: 0;
            position: sticky;
            top: 0;
          }

          :host(:not([timeline-size="xs"])) .heading {
            position: absolute;
            top: 0;
            padding: 10px 0;
            overflow: hidden;
            background-color: transparent;
            width: calc(55% + 30px);
          }

          :host(:not([timeline-size="xs"]))
            .event[has-media][selected]
            .heading {
            z-index: 2;
          }

          :host(:not([timeline-size="xs"])) .event[has-media] .heading:after {
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

          :host(:not([timeline-size="xs"]))
            .event[has-media][selected]
            .heading:after {
            top: 7px;
            right: 0px;
            border-top: 35px solid transparent;
            border-bottom: 35px solid transparent;
            border-left: 35px solid var(--lrndesign-timeline-header-accent);
          }

          :host(:not([timeline-size="xs"])) .heading h2 {
            margin: 7px 48px 0 20px;
            padding: 0 20px;
            line-height: 50px;
            height: 50px;
            background-color: var(--lrndesign-timeline-header-accent);
            color: var(--lrndesign-timeline-header);
            opacity: 0.6;
            transition: opacity 0.3s;
          }

          :host(:not([timeline-size="xs"])) .event[selected] .heading h2 {
            opacity: 1;
          }

          :host(:not([timeline-size="xs"]))
            .event[has-media]
            .heading
            h2:after {
            content: "";
            position: absolute;
            left: calc(100% - 48px);
            top: 17px;
            height: 50px;
            width: 0px;
            transition: all 0.3s;
            background-color: var(--lrndesign-timeline-background);
          }

          :host(:not([timeline-size="xs"]))
            .event[has-media][selected]
            .heading
            h2:after {
            width: 13px;
            background-color: var(--lrndesign-timeline-header-accent);
          }

          :host(:not([timeline-size="xs"])) .media-outer {
            display: flex;
            align-items: center;
            position: absolute;
            right: 0;
            width: 45%;
            height: 300px;
          }

          :host(:not([timeline-size="xs"])) .media {
            display: flex;
            padding: 20px 20px 20px 50px;
            opacity: 0;
            transition: opacity 0.3s delay 0.3s;
          }

          :host(:not([timeline-size="xs"])) .event[selected] .media {
            opacity: 1;
            transition-delay: 0s;
          }

          :host(:not([timeline-size="xs"])) .details {
            padding: 67px 20px 20px;
            margin: 0 20px;
            width: calc(55% - 80px);
            color: var(--lrndesign-timeline-color);
            background-color: var(--lrndesign-timeline-background);
            border: 1px solid var(--lrndesign-timeline-background);
            border-radius: 3px;
            transition: all 0.5s;
          }

          :host(:not([timeline-size="xs"])) .event:last-of-type .details {
            min-height: 180px;
          }

          :host(:not([timeline-size="xs"])) .event[selected] .details {
            color: var(--lrndesign-timeline-accent);
            background-color: var(--lrndesign-timeline-accent-background);
            border: 1px solid var(--lrndesign-timeline-border);
            box-shadow: 0 2px 2px var(--lrndesign-timeline-border);
          }

          :host(:not([timeline-size="xs"]))
            .event:first-of-type[selected]
            .details {
            border-top: 1px solid var(--lrndesign-timeline-background);
          }

          :host(:not([timeline-size="xs"]))
            .event:last-of-type[selected]
            .details {
            border-bottom: 1px solid var(--lrndesign-timeline-background);
          }
        }
      </style>
      <article>
        <h1 id="title">${this.timelineTitle}</h1>
        <slot></slot>
        <div id="timeline">
          <div id="events" @scroll="${this._checkScroll}">
            ${this.eventsList.map(
              (event, index) => html`
                <section
                  class="event"
                  ?has-media="${event.imagesrc && event.imagesrc !== ""}"
                >
                  <div class="event-overview">
                    <div class="heading"><h2>${event.heading}</h2></div>
                    <div class="media-outer">
                      ${!event.imagesrc || event.imagesrc === ""
                        ? ``
                        : html`
                            <div class="media">
                              <div>
                                <image
                                  alt="${event.imagealt}"
                                  src="${event.imagesrc}"
                                />
                              </div>
                            </div>
                          `}
                    </div>
                  </div>
                  <div class="details">${event.details}</div>
                </section>
              `
            )}
          </div>
        </div>
      </article>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
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
        type: "Array"
      },
      /**
       * the timline size, calculated by responsive utility
       */
      timelineSize: {
        type: "String",
        reflect: true,
        attribute: "timeline-size",
        value: "xs",
        /**
         * title of timeline
         */
        timelineTitle: {
          type: "String",
          reflect: true,
          attribute: "timeline-title"
        },
        /**
         * DEPRECATED: title of timeline
         */
        title: {
          type: "String",
          attribute: "title"
        }
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "lrndesign-timeline";
  }

  // life cycle
  constructor() {
    super();
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
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
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
customElements.define("lrndesign-timeline", LrndesignTimeline);
export { LrndesignTimeline };
