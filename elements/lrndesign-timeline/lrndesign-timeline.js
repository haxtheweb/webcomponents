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
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
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

        ::slotted(section) {
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
        .media-outer > div {
          padding: 0 40px;
        }

        .details {
          margin: 15px 0;
        }

        .media-outer > div {
          opacity: 1;
          transition: opacity 0.5s;
        }

        .media-outer > div,
        .media-outer > div * {
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
            background-color: var(--lrndesign-timeline-background);
            color: var(--lrndesign-timeline-header-accent);
          }

          :host(:not([timeline-size="xs"])) .event[selected] .heading h2 {
            background-color: var(--lrndesign-timeline-header-accent);
            color: var(--lrndesign-timeline-header);
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
            opacity: 0;
            width: 0px;
            transition: opacity 0.3s;
            background-color: var(--lrndesign-timeline-background);
          }

          :host(:not([timeline-size="xs"]))
            .event[has-media][selected]
            .heading
            h2:after {
            width: 13px;
            opacity: 1;
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

          :host(:not([timeline-size="xs"])) .media-outer > div {
            display: flex;
            padding: 20px 20px 20px 50px;
            opacity: 0;
            transition: opacity 0.3s delay 0.3s;
          }

          :host(:not([timeline-size="xs"]))
            .event[selected]
            .media-outer
            > div {
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
      `
    ];
  }

  // render function
  render() {
    return html`
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
                  tabindex="0"
                  @focus="${this._setScroll}"
                >
                  <div class="event-overview">
                    <div class="heading"><h2>${event.heading}</h2></div>
                    <div class="media-outer">
                      ${!event.imagesrc || event.imagesrc === ""
                        ? ``
                        : html`
                            <div>
                              <div>
                                <img
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

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Timeline",
        description: "A timeline of events with images and text",
        icon: "hax:timeline",
        color: "indigo",
        groups: ["Content", "Instructional", "Media", "Image"],
        handles: [
          {
            type: "image",
            source: "image"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "accentColor",
            title: "Accent Color",
            description: "An optional accent color.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean",
            icon: "icons:invert-colors"
          }
        ],
        configure: [
          {
            property: "timelineTitle",
            title: "Timeline Title",
            description: "A title for the timeline.",
            inputMethod: "textfield"
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "An optional accent color.",
            inputMethod: "colorpicker"
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean"
          },
          {
            slot: "",
            title: "Timeline Description",
            description: "Optional text describing the timeline.",
            inputMethod: "textfield"
          },
          {
            property: "events",
            title: "Timeline Events",
            description: "The events in the timeline",
            inputMethod: "array",
            itemLabel: "heading",
            properties: [
              {
                property: "heading",
                title: "Event Heading",
                description: "The heading for the event.",
                inputMethod: "textfield"
              },
              {
                property: "details",
                title: "Event Details",
                description: "The body text with details for the event.",
                inputMethod: "textfield"
              },
              {
                property: "imagesrc",
                title: "Event Image",
                description: "The path of the image.",
                inputMethod: "haxupload"
              },
              {
                property: "imagealt",
                title: "Event Image Alt Text",
                description: "The alt text of the image (for accessibility).",
                inputMethod: "alt"
              }
            ]
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
        type: Array
      },
      /**
       * the timline size, calculated by responsive utility
       */
      timelineSize: {
        type: String,
        reflect: true,
        attribute: "timeline-size",
        value: "xs",
        /**
         * title of timeline
         */
        timelineTitle: {
          type: String,
          reflect: true,
          attribute: "timeline-title"
        },
        /**
         * @depeacated: title of timeline
         */
        title: {
          type: String,
          attribute: "title"
        }
      }
    };
  }

  static get tag() {
    return "lrndesign-timeline";
  }

  // life cycle
  constructor() {
    super();
    this.events = [];
    this.timelineSize = "xs";
  }

  connectedCallback() {
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

    this.updateTimeline();
    this.observer.observe(this, {
      childList: true,
      subtree: false
    });
  }
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    if (super.disconnectedCallback) super.disconnectedCallback();
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
    this.updateTimeline();
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
   * mutation observer for tabs
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.updateTimeline();
    return new MutationObserver(callback);
  }
  _setScroll(e) {
    let el = e.path[0],
      parent = e.path[0].parentNode;
    parent.scroll({
      top: el.offsetTop,
      left: 0,
      behavior: "smooth"
    });
  }

  /**
   * checks the scroll of each event
   */
  _checkScroll(e) {
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
  updateTimeline() {
    let sections = document.querySelectorAll("section") || [];
    if (
      this.eventsList.length < 1 &&
      sections.length > 0 &&
      this.eventsElement
    ) {
      this.eventsElement.innerHTML = "";
      sections.forEach(section => {
        let clone = section.cloneNode(true),
          div = document.createElement("div"),
          overview = div.cloneNode(),
          details = div.cloneNode(),
          heading = div.cloneNode(),
          media = clone.querySelector(".media")
            ? clone.querySelector(".media")
            : undefined,
          cloneHeading = clone.querySelector("h1,h2,h3,h4,h5,h6")
            ? clone.querySelector("h1,h2,h3,h4,h5,h6")
            : undefined;

        //get heading
        overview.classList.add("event-overview");
        if (cloneHeading) {
          let inner = document.createElement("h2");
          heading.appendChild(inner);
          heading.classList.add("heading");
          inner.innerHTML = cloneHeading.innerHTML;
          cloneHeading.remove();
        }
        overview.appendChild(heading);

        //get media
        if (media) {
          let outer = div.cloneNode(),
            inner = div.cloneNode();
          outer.appendChild(inner);
          div.appendChild(outer);
          inner.appendChild(media.cloneNode(true));
          media.remove();
          clone.setAttribute("has-media", true);
        }
        div.classList.add("media-outer");
        overview.appendChild(div);

        //get details
        Object.keys(clone.children || []).forEach(child =>
          details.append(clone.children[child])
        );
        details.classList.add("details");

        //add to events
        clone.classList.add("event");
        clone.appendChild(overview);
        clone.appendChild(details);
        this.eventsElement.appendChild(clone);
      });
    }
    this._checkScroll();
  }
}
customElements.define(LrndesignTimeline.tag, LrndesignTimeline);
export { LrndesignTimeline };
