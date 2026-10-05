/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { parseIcs } from "./lib/ics-parse.js";

/**
 * `ics-render`
 * Render a calendar file (.ics) in place, in the shape that suits the content:
 * date cards, a timeline, a table or a list.
 *
 * It follows csv-render: point `data-source` at a file, it is fetched once the
 * element is on screen, parsed client side and rendered. Parsing is local, so
 * a calendar still renders with no network and nothing about it is sent
 * anywhere. `calendar-data` takes the same file contents inline instead, which
 * is what the demo and the tests use.
 *
 * Recurring events are shown once, at their first occurrence, and flagged as
 * repeating. Expanding an RRULE into its occurrences is a calendar engine's
 * job, and guessing at it would invent dates the file does not state.
 *
 * @demo demo/index.html
 * @element ics-render
 */
export class IcsRender extends I18NMixin(IntersectionObserverMixin(DDD)) {
  static get tag() {
    return "ics-render";
  }

  constructor() {
    super();
    this.dataSource = "";
    this.calendarData = "";
    this.displayAs = "cards";
    this.caption = "";
    this.status = "idle";
    this.events = [];
    this.calendarName = "";
    this.debounceDelay = 500;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      event: "Event",
      when: "When",
      where: "Where",
      details: "Details",
      allDay: "All day",
      repeats: "Repeats",
      loadingCalendar: "Loading calendar",
      calendarUnavailable: "Calendar unavailable",
      noEvents: "No events in this calendar",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/ics-render.ar.json", import.meta.url).href + "/../",
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * URL of the .ics file, usually one uploaded to the site's files.
       */
      dataSource: { type: String, attribute: "data-source" },
      /**
       * Calendar file contents, for rendering without a fetch.
       */
      calendarData: { type: String, attribute: "calendar-data" },
      /**
       * How to present the events: cards, timeline, table or list.
       */
      displayAs: { type: String, attribute: "display-as", reflect: true },
      /**
       * Caption for the table and a heading for the other modes. Falls back to
       * the calendar's own name when the file carries one.
       */
      caption: { type: String },
      /**
       * idle, loading, ready or error.
       */
      status: { type: String, reflect: true },
      /**
       * Delay in ms before a data-source change triggers a load. Exposed
       * mainly so tests can shrink it; the default matches csv-render.
       */
      debounceDelay: { type: Number, attribute: "debounce-delay" },
      events: { type: Array },
      calendarName: { type: String, attribute: "calendar-name" },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        .heading {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          margin: 0 0 var(--ddd-spacing-2);
        }
        /* one card per event, as many across as the container can hold. a
           plain grid keeps this to the container's own width without pulling
           in the float based legacy grid elements */
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--ddd-spacing-4);
        }
        .cards > div {
          min-width: 0;
        }
        .status {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-2) 0;
        }
        .status[data-error] {
          color: var(--ddd-theme-default-original87Pink);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
      `,
    ];
  }

  /**
   * Locale for the formatted dates: this element's own lang if it has one,
   * otherwise the document's, otherwise whatever the browser prefers.
   */
  get displayLocale() {
    return (
      this.lang ||
      (globalThis.document && globalThis.document.documentElement.lang) ||
      undefined
    );
  }

  /**
   * The display modes, in the order Merlin should offer them.
   */
  static get displayModes() {
    return ["cards", "timeline", "table", "list"];
  }

  /**
   * LitElement life cycle - property about to change. Reading the file here
   * folds the parsed events into the update already in flight instead of
   * scheduling another one (see https://lit.dev/msg/change-in-update).
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("calendarData")) {
      this.parseCalendar();
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      (changedProperties.has("displayAs") ||
        changedProperties.has("elementVisible")) &&
      this.elementVisible
    ) {
      this.importDisplayDependencies();
    }
    if (
      (changedProperties.has("dataSource") ||
        changedProperties.has("elementVisible")) &&
      this.dataSource &&
      this.elementVisible
    ) {
      clearTimeout(this.__debounce);
      this.__debounce = setTimeout(() => {
        this.loadCalendarData();
      }, this.debounceDelay);
    }
  }

  disconnectedCallback() {
    // drop any pending load so the element does not fetch, or leak a timer,
    // after it leaves the page
    clearTimeout(this.__debounce);
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  /**
   * Pull in only the elements the current mode renders, and only once the
   * calendar is on screen, so a mode nobody looks at costs nothing.
   */
  importDisplayDependencies() {
    switch (this.displayAs) {
      case "timeline":
        import("@haxtheweb/lrndesign-timeline/lrndesign-timeline.js");
        break;
      case "table":
        import("@haxtheweb/editable-table/editable-table.js");
        break;
      case "list":
        import("@haxtheweb/collection-list/collection-list.js");
        import("@haxtheweb/collection-list/lib/collection-item.js");
        break;
      default:
        import("@haxtheweb/date-card/date-card.js");
        break;
    }
  }

  /**
   * Fetch the calendar file. A failure is reported in the element rather than
   * only in the console, because empty space gives a reader nothing to act on.
   */
  async loadCalendarData() {
    if (!this.dataSource) {
      return;
    }
    this.status = "loading";
    try {
      const response = await fetch(this.dataSource);
      if (!response.ok) {
        throw new Error(`request for ${this.dataSource} failed`);
      }
      this.calendarData = await response.text();
    } catch (error) {
      this.events = [];
      this.status = "error";
    }
  }

  parseCalendar() {
    if (!this.calendarData) {
      this.events = [];
      if (this.status !== "error") {
        this.status = "idle";
      }
      return;
    }
    const { calendar, events } = parseIcs(
      this.calendarData,
      this.displayLocale,
    );
    this.events = events;
    this.calendarName = calendar.name;
    this.status = "ready";
    this.dispatchEvent(
      new CustomEvent("ics-render-parsed", {
        bubbles: true,
        composed: true,
        detail: { events, calendar },
      }),
    );
  }

  /**
   * When an event happens, as one readable string.
   */
  whenLabel(event) {
    if (!event.start) {
      return "";
    }
    if (event.allDay) {
      return `${event.dateLabel} (${this.t.allDay})`;
    }
    const times = [event.startTime, event.endTime].filter(Boolean).join(" - ");
    return [event.dateLabel, times].filter(Boolean).join(", ");
  }

  get headingText() {
    return this.caption || this.calendarName || "";
  }

  renderCards() {
    return html`
      <div class="cards" role="list">
        ${this.events.map(
          (event) => html`
            <div role="listitem">
              <date-card
                month="${event.month}"
                date="${event.date}"
                day="${event.day}"
                title="${event.title}"
                start-time="${event.startTime}"
                end-time="${event.endTime}"
                location="${event.location}"
                accent-color="${this.accentColor}"
              ></date-card>
            </div>
          `,
        )}
      </div>
    `;
  }

  renderTimeline() {
    const events = this.events.map((event) => ({
      heading: event.title || event.dateLabel,
      details: [
        this.whenLabel(event),
        event.location,
        event.description,
        event.recurring ? this.t.repeats : "",
      ]
        .filter(Boolean)
        .join(" — "),
    }));
    return html`
      <lrndesign-timeline
        timeline-title="${this.headingText}"
        accent-color="${this.accentColor}"
        .events="${events}"
      ></lrndesign-timeline>
    `;
  }

  renderTable() {
    return html`
      <editable-table
        accent-color="${this.accentColor}"
        bordered
        striped
        condensed
        column-header
        sort
        printable
        downloadable
      >
        <table>
          ${this.headingText
            ? html`<caption>
                ${this.headingText}
              </caption>`
            : nothing}
          <thead>
            <tr>
              <th>${this.t.event}</th>
              <th>${this.t.when}</th>
              <th>${this.t.where}</th>
              <th>${this.t.details}</th>
            </tr>
          </thead>
          <tbody>
            ${this.events.map(
              (event) => html`
                <tr>
                  <td>${event.title}</td>
                  <td>${this.whenLabel(event)}</td>
                  <td>${event.location}</td>
                  <td>${event.description}</td>
                </tr>
              `,
            )}
          </tbody>
        </table>
      </editable-table>
    `;
  }

  renderList() {
    return html`
      <collection-list>
        ${this.events.map(
          (event) => html`
            <collection-item
              line1="${event.title}"
              line2="${this.whenLabel(event)}"
              line3="${event.location}"
              alt="${event.title}"
              icon="icons:date-range"
              tags="${event.categories.join(", ")}"
              url="${event.url || this.dataSource}"
              accent-color="${this.accentColor}"
            ></collection-item>
          `,
        )}
      </collection-list>
    `;
  }

  renderEvents() {
    switch (this.displayAs) {
      case "timeline":
        return this.renderTimeline();
      case "table":
        return this.renderTable();
      case "list":
        return this.renderList();
      default:
        return this.renderCards();
    }
  }

  render() {
    if (this.status === "error") {
      return html`<div class="status" data-error role="alert">
        ${this.t.calendarUnavailable}
      </div>`;
    }
    if (this.status === "loading") {
      return html`<div class="status" aria-live="polite">
        ${this.t.loadingCalendar}
      </div>`;
    }
    if (!this.events.length) {
      if (this.status === "ready") {
        return html`<div class="status">${this.t.noEvents}</div>`;
      }
      // an element with nothing in it has no height, and an element with no
      // height never crosses the visibility threshold that starts the fetch,
      // so a calendar that is waiting to load has to take up a line. with no
      // file to load there is nothing to say, and HAX shows its own
      // placeholder for an unconfigured element
      return this.dataSource
        ? html`<div class="status" aria-live="polite">
            ${this.t.loadingCalendar}
          </div>`
        : nothing;
    }
    return html`
      ${this.headingText && this.displayAs !== "timeline"
        ? html`<div class="heading">${this.headingText}</div>`
        : nothing}
      ${this.renderEvents()}
    `;
  }

  /**
   * HAX lifecycle hooks this element takes part in.
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
    };
  }

  /**
   * Teach HAX that ics is a type an element can handle, so this element can be
   * offered for one. The platform stays type agnostic: the type is registered
   * here rather than hard-coded in the store.
   *
   * @param {object} store the HAX store
   */
  haxgizmoRegistration(store) {
    if (
      store &&
      Array.isArray(store.validGizmoTypes) &&
      !store.validGizmoTypes.includes("ics")
    ) {
      store.validGizmoTypes.push("ics");
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(IcsRender.tag, IcsRender);
