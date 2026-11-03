/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { parseIcs } from "./lib/ics-parse.js";

/**
 * Small calendar picture for a list entry whose event has no image of its
 * own, so the list shows a tinted panel with a calendar instead of an empty
 * box. It is a data URI because collection-item takes an image URL; the
 * colours are the DDD skyMaxLight / beaverBlue pair (nittanyNavy / pughBlue
 * in dark mode).
 */
const CALENDAR_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">' +
      "<style>rect.bg{fill:#e6f7ff}g{stroke:#1e407c}" +
      "@media (prefers-color-scheme: dark){rect.bg{fill:#001e44}g{stroke:#96bee6}}</style>" +
      '<rect class="bg" width="100%" height="100%"/>' +
      '<svg x="50%" y="50%" overflow="visible"><g transform="translate(-18 -18) scale(1.5)" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></g></svg></svg>',
  );

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
 * It renders as a DDD block: a header ("Event · Calendar", the caption or
 * the calendar's own name as a heading, and a download link for the .ics
 * when there is a data-source), the events, and a footer with the count and
 * the time zone the times are shown in. `accent-color` colours the month
 * band of the date tiles.
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
      eventCalendar: "Event · Calendar",
      downloadCalendar: "Download calendar (.ics)",
      oneEvent: "1 event",
      eventCount: "{count} events",
      timesInYourZone: "times in your time zone ({zone})",
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
      DDDBlockStyles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        .ddd-block-body {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        }
        .ddd-block-body.flush {
          padding: 0;
        }
        /* one row per event: a date tile beside the title, time and place */
        .rows {
          display: block;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .row {
          display: flex;
          gap: var(--ddd-spacing-3);
          align-items: stretch;
          margin: 0;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .row:last-child {
          border-bottom: none;
        }
        .tile {
          display: flex;
          flex-direction: column;
          flex: none;
          box-sizing: border-box;
          width: var(--ddd-spacing-16);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          text-align: center;
          line-height: var(--ddd-lh-120);
        }
        /* grey is the SimpleColors default every element starts with, so
           it reads as no accent chosen: the band stays beaverBlue */
        :host([accent-color="grey"]) .tile .month {
          --ddd-accent-color: var(--ddd-theme-default-beaverBlue);
          --ddd-accent-color-ink: var(--ddd-theme-default-white);
        }
        .tile .month {
          display: block;
          padding: var(--ddd-spacing-1) 0;
          background-color: var(
            --ddd-accent-color,
            var(--ddd-theme-default-beaverBlue)
          );
          color: var(--ddd-accent-color-ink, var(--ddd-theme-default-white));
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .tile .date {
          display: block;
          padding-top: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .tile .weekday {
          display: block;
          padding-bottom: var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .tile .month,
        :host(:lang(fa)) .tile .month,
        :host(:lang(he)) .tile .month,
        :host(:lang(ur)) .tile .month {
          letter-spacing: 0;
        }
        .meta {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: var(--ddd-spacing-1);
          min-width: 0;
          font-size: var(--ddd-font-size-5xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .meta .title {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .meta .line {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          overflow-wrap: anywhere;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .meta .line simple-icon-lite {
          flex: none;
        }
        .ddd-block-footer {
          font-size: var(--ddd-font-size-5xs);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-medium);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .status {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          padding: var(--ddd-spacing-2) 0;
        }
        .status[data-error] {
          color: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-theme-default-discoveryCoral)
          );
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
      (globalThis.document &&
        globalThis.document.documentElement &&
        globalThis.document.documentElement.lang) ||
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
        // cards are drawn by this element itself
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
    } catch {
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

  /**
   * The time zone the times are shown in, as the reader's browser names it
   * (e.g. "EST"), taken from the first timed event so daylight saving matches
   * the dates on screen. Empty when every event is all day.
   */
  get zoneLabel() {
    const timed = this.events.find((event) => event.start && !event.allDay);
    if (!timed) {
      return "";
    }
    try {
      const part = new Intl.DateTimeFormat(this.displayLocale, {
        timeZoneName: "short",
      })
        .formatToParts(timed.start.date)
        .find((piece) => piece.type === "timeZoneName");
      return part ? part.value : "";
    } catch {
      return "";
    }
  }

  /**
   * Footer text: how many events, and the time zone of the times shown.
   */
  get footerText() {
    const count =
      this.events.length === 1
        ? this.t.oneEvent
        : String(this.t.eventCount).replace(
            "{count}",
            String(this.events.length),
          );
    const zone = this.zoneLabel;
    return zone
      ? `${count} · ${String(this.t.timesInYourZone).replace("{zone}", zone)}`
      : count;
  }

  /**
   * Short month and weekday for the date tile, in the element's language.
   */
  tileParts(event) {
    if (!event.start) {
      return null;
    }
    const date = event.start.date;
    const tag = this.displayLocale;
    return {
      month: date.toLocaleDateString(tag, { month: "short" }).replace(".", ""),
      date: event.date,
      weekday: date
        .toLocaleDateString(tag, { weekday: "short" })
        .replace(".", ""),
    };
  }

  renderCards() {
    return html`
      <ul class="rows" role="list">
        ${this.events.map((event) => {
          const tile = this.tileParts(event);
          return html`
            <li class="row" role="listitem">
              ${tile
                ? html`<span class="tile" aria-hidden="true">
                    <span class="month">${tile.month}</span>
                    <span class="date">${tile.date}</span>
                    <span class="weekday">${tile.weekday}</span>
                  </span>`
                : nothing}
              <span class="meta">
                <span class="title">${event.title}</span>
                ${event.start
                  ? html`<span class="line"
                      ><simple-icon-lite
                        icon="device:access-time"
                        aria-hidden="true"
                      ></simple-icon-lite
                      ><span>${this.whenLabel(event)}</span></span
                    >`
                  : nothing}
                ${event.location
                  ? html`<span class="line"
                      ><simple-icon-lite
                        icon="maps:place"
                        aria-hidden="true"
                      ></simple-icon-lite
                      ><span>${event.location}</span></span
                    >`
                  : nothing}
                ${event.recurring
                  ? html`<span class="line"
                      ><simple-icon-lite
                        icon="av:repeat"
                        aria-hidden="true"
                      ></simple-icon-lite
                      ><span>${this.t.repeats}</span></span
                    >`
                  : nothing}
              </span>
            </li>
          `;
        })}
      </ul>
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
    // the block header already shows the calendar's title, so the timeline
    // drops its own frame and header
    return html`
      <lrndesign-timeline
        hide-block-header
        accent-color="${this.accentColor}"
        .events="${events}"
      ></lrndesign-timeline>
    `;
  }

  renderTable() {
    return html`
      <editable-table
        accent-color="${this.accentColor}"
        hide-block-header
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
    // an event without a picture gets a calendar placeholder rather than an
    // empty box; the round icon is only added over a real picture, since the
    // placeholder already is a calendar
    return html`
      <collection-list>
        ${this.events.map(
          (event) => html`
            <collection-item
              line1="${event.title}"
              line2="${this.whenLabel(event)}"
              line3="${event.location}"
              alt="${event.title}"
              image="${event.image || CALENDAR_PLACEHOLDER}"
              icon="${event.image ? "icons:date-range" : nothing}"
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

  /**
   * The body of the block for the current state: loading, error, empty or
   * the events. Null when there is nothing to show at all.
   */
  renderBody() {
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
        : null;
    }
    return this.renderEvents();
  }

  render() {
    const body = this.renderBody();
    if (body === null) {
      return nothing;
    }
    const showsEvents = this.events.length > 0 && this.status === "ready";
    const isRows =
      showsEvents && !["timeline", "table", "list"].includes(this.displayAs);
    return html`
      <div class="ddd-block" part="frame" role="group" aria-labelledby="hdr">
        ${renderDDDBlockHeader({
          id: "hdr",
          icon: "icons:date-range",
          label: this.t.eventCalendar,
          title: this.headingText,
          titleTag: "h3",
          actions: this.dataSource
            ? html`<a
                class="ddd-block-action"
                href="${this.dataSource}"
                download
                aria-label="${this.t.downloadCalendar}"
                title="${this.t.downloadCalendar}"
                ><simple-icon-lite
                  icon="icons:file-download"
                  aria-hidden="true"
                ></simple-icon-lite
              ></a>`
            : nothing,
        })}
        <div class="ddd-block-body ${isRows ? "flush" : ""}">${body}</div>
        ${showsEvents
          ? html`<div class="ddd-block-footer">${this.footerText}</div>`
          : nothing}
      </div>
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
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `ics-render.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
        },
      }),
    );
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
