import { html, fixture, expect, aTimeout, waitUntil } from "@open-wc/testing";
import "../ics-render.js";

// a timed event, an event in a named timezone and an all day recurring event,
// so every assertion below has content that is not all alike
const SAMPLE = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "X-WR-CALNAME:Project schedule",
  "BEGIN:VEVENT",
  "UID:kickoff@example.com",
  "DTSTART:20261015T180000Z",
  "DTEND:20261015T190000Z",
  "SUMMARY:Project Kickoff Meeting",
  "DESCRIPTION:Initial alignment meeting with the project team.",
  "LOCATION:Conference Room A",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "UID:review@example.com",
  "DTSTART;TZID=America/New_York:20261029T110000",
  "DTEND;TZID=America/New_York:20261029T123000",
  "SUMMARY:Design Review",
  "LOCATION:Westgate E203",
  "CATEGORIES:Design,Review",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "UID:break@example.com",
  "DTSTART;VALUE=DATE:20261126",
  "SUMMARY:Thanksgiving break",
  "RRULE:FREQ=YEARLY",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

async function render(mode, data = SAMPLE) {
  const element = await fixture(
    html`<ics-render
      element-visible
      display-as="${mode}"
      .calendarData="${data}"
    ></ics-render>`,
  );
  await waitUntil(
    () => element.status === "ready",
    "the calendar should have been read",
  );
  await element.updateComplete;
  return element;
}

describe("IcsRender basics", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<ics-render></ics-render>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("ics-render");
  });

  it("passes the a11y audit with nothing to show", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("starts idle, in cards mode, with no events", () => {
    expect(element.status).to.equal("idle");
    expect(element.displayAs).to.equal("cards");
    expect(element.events).to.deep.equal([]);
  });

  it("says nothing before a calendar has been read", () => {
    expect(element.shadowRoot.textContent.trim()).to.equal("");
  });

  it("names its display modes in the order Merlin offers them", () => {
    expect(element.constructor.displayModes).to.deep.equal([
      "cards",
      "timeline",
      "table",
      "list",
    ]);
  });

  it("points haxProperties at its own schema file", () => {
    const url = element.constructor.haxProperties;
    expect(url).to.be.a("string");
    expect(url).to.contain("lib/ics-render.haxProperties.json");
  });
});

describe("IcsRender reading a calendar", () => {
  it("reads the events out of calendar-data", async () => {
    const element = await render("cards");
    expect(element.events.length).to.equal(3);
    expect(element.events.map((event) => event.title)).to.deep.equal([
      "Project Kickoff Meeting",
      "Design Review",
      "Thanksgiving break",
    ]);
    expect(element.calendarName).to.equal("Project schedule");
  });

  it("reports what it read", async () => {
    const element = await fixture(
      html`<ics-render element-visible></ics-render>`,
    );
    const heard = new Promise((resolve) => {
      element.addEventListener("ics-render-parsed", (event) =>
        resolve(event.detail),
      );
    });
    element.calendarData = SAMPLE;
    const detail = await heard;
    expect(detail.events.length).to.equal(3);
    expect(detail.calendar.name).to.equal("Project schedule");
  });

  it("says so when the calendar holds no events", async () => {
    const element = await render(
      "cards",
      "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR",
    );
    expect(element.events).to.deep.equal([]);
    expect(element.shadowRoot.textContent).to.contain(element.t.noEvents);
  });

  it("says so when the file is not a calendar at all", async () => {
    const element = await render("cards", "this is not a calendar");
    expect(element.shadowRoot.textContent).to.contain(element.t.noEvents);
  });

  it("goes back to idle when the data is taken away", async () => {
    const element = await render("cards");
    element.calendarData = "";
    await element.updateComplete;
    expect(element.status).to.equal("idle");
    expect(element.events).to.deep.equal([]);
  });

  it("formats dates in the language of the element", async () => {
    const element = await fixture(
      html`<ics-render
        element-visible
        lang="fr"
        .calendarData="${SAMPLE}"
      ></ics-render>`,
    );
    await waitUntil(() => element.status === "ready");
    // the review is a floating time in a named zone, so its wall clock and
    // therefore its month name cannot move with the runner's timezone
    const review = element.events.find(
      (event) => event.title === "Design Review",
    );
    expect(review.month).to.equal("octobre");
    expect(review.day).to.equal("jeudi");
  });
});

describe("IcsRender display modes", () => {
  it("renders one date card per event", async () => {
    const element = await render("cards");
    const cards = element.shadowRoot.querySelectorAll("date-card");
    expect(cards.length).to.equal(3);
    const review = cards[1];
    expect(review.getAttribute("title")).to.equal("Design Review");
    expect(review.getAttribute("month")).to.equal("October");
    expect(review.getAttribute("date")).to.equal("29");
    expect(review.getAttribute("day")).to.equal("Thursday");
    expect(review.getAttribute("start-time")).to.equal("11:00 AM");
    expect(review.getAttribute("end-time")).to.equal("12:30 PM");
    expect(review.getAttribute("location")).to.equal("Westgate E203");
  });

  it("leaves the times off an all day event", async () => {
    const element = await render("cards");
    const allDay = element.shadowRoot.querySelectorAll("date-card")[2];
    expect(allDay.getAttribute("title")).to.equal("Thanksgiving break");
    expect(allDay.getAttribute("start-time")).to.equal("");
    expect(allDay.getAttribute("end-time")).to.equal("");
  });

  it("exposes the cards as a list to assistive technology", async () => {
    const element = await render("cards");
    expect(
      element.shadowRoot.querySelector(".cards").getAttribute("role"),
    ).to.equal("list");
    expect(
      element.shadowRoot.querySelectorAll('[role="listitem"]').length,
    ).to.equal(3);
  });

  it("passes the a11y audit in cards mode", async () => {
    const element = await render("cards");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("hands the timeline its events in order", async () => {
    const element = await render("timeline");
    const timeline = element.shadowRoot.querySelector("lrndesign-timeline");
    expect(timeline).to.exist;
    expect(timeline.events.length).to.equal(3);
    expect(timeline.events[0].heading).to.equal("Project Kickoff Meeting");
    expect(timeline.events[1].details).to.contain("Westgate E203");
    expect(timeline.getAttribute("timeline-title")).to.equal(
      "Project schedule",
    );
  });

  it("says in the timeline when an event repeats", async () => {
    const element = await render("timeline");
    const timeline = element.shadowRoot.querySelector("lrndesign-timeline");
    expect(timeline.events[2].details).to.contain(element.t.repeats);
  });

  it("passes the a11y audit in timeline mode", async () => {
    const element = await render("timeline");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders a table of the events", async () => {
    const element = await render("table");
    const table = element.shadowRoot.querySelector("editable-table table");
    expect(table).to.exist;
    expect(table.querySelectorAll("thead th").length).to.equal(4);
    expect(table.querySelectorAll("tbody tr").length).to.equal(3);
    expect(table.querySelector("caption").textContent.trim()).to.equal(
      "Project schedule",
    );
    const cells = table.querySelectorAll("tbody tr")[1].querySelectorAll("td");
    expect(cells[0].textContent.trim()).to.equal("Design Review");
    expect(cells[1].textContent).to.contain("11:00 AM");
    expect(cells[2].textContent.trim()).to.equal("Westgate E203");
  });

  it("passes the a11y audit in table mode", async () => {
    const element = await render("table");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders a list of the events", async () => {
    const element = await render("list");
    const items = element.shadowRoot.querySelectorAll("collection-item");
    expect(items.length).to.equal(3);
    expect(items[1].getAttribute("line1")).to.equal("Design Review");
    expect(items[1].getAttribute("line2")).to.contain("11:00 AM");
    expect(items[1].getAttribute("line3")).to.equal("Westgate E203");
    expect(items[1].getAttribute("tags")).to.equal("Design, Review");
  });

  it("links a list entry to the calendar file when the event has no url", async () => {
    const element = await fixture(
      html`<ics-render
        element-visible
        display-as="list"
        data-source="./demo/sample.ics"
        debounce-delay="10000"
        .calendarData="${SAMPLE}"
      ></ics-render>`,
    );
    await waitUntil(() => element.status === "ready");
    await element.updateComplete;
    const items = element.shadowRoot.querySelectorAll("collection-item");
    expect(items[0].getAttribute("url")).to.equal("./demo/sample.ics");
  });

  it("passes the a11y audit in list mode", async () => {
    const element = await render("list");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("switches modes without re-reading the file", async () => {
    const element = await render("cards");
    expect(element.shadowRoot.querySelectorAll("date-card").length).to.equal(3);
    element.displayAs = "list";
    await element.updateComplete;
    expect(element.shadowRoot.querySelectorAll("date-card").length).to.equal(0);
    expect(
      element.shadowRoot.querySelectorAll("collection-item").length,
    ).to.equal(3);
    expect(element.events.length).to.equal(3);
  });

  // an unimported custom element is still in the DOM, so the only proof a
  // lazy import ran is that the definition turns up. one test per mode, so a
  // single test never has to wait on four dependency graphs at once
  it("loads date-card for cards mode", async () => {
    const element = await render("cards");
    await waitUntil(
      () => globalThis.customElements.get("date-card"),
      "cards mode should have loaded date-card",
      { timeout: 5000 },
    );
    expect(element.shadowRoot.querySelector("date-card")).to.exist;
  });

  it("loads lrndesign-timeline for timeline mode", async () => {
    const element = await render("timeline");
    await waitUntil(
      () => globalThis.customElements.get("lrndesign-timeline"),
      "timeline mode should have loaded lrndesign-timeline",
      { timeout: 5000 },
    );
    expect(element.shadowRoot.querySelector("lrndesign-timeline")).to.exist;
  });

  it("loads editable-table for table mode", async () => {
    const element = await render("table");
    await waitUntil(
      () => globalThis.customElements.get("editable-table"),
      "table mode should have loaded editable-table",
      { timeout: 5000 },
    );
    expect(element.shadowRoot.querySelector("editable-table")).to.exist;
  });

  it("loads collection-item for list mode", async () => {
    const element = await render("list");
    await waitUntil(
      () => globalThis.customElements.get("collection-item"),
      "list mode should have loaded collection-item",
      { timeout: 5000 },
    );
    expect(element.shadowRoot.querySelector("collection-item")).to.exist;
  });

  it("falls back to cards for a mode it does not know", async () => {
    const element = await render("nonsense");
    expect(element.shadowRoot.querySelectorAll("date-card").length).to.equal(3);
  });
});

describe("IcsRender fetching a calendar", () => {
  let originalFetch;
  let requested;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    requested = [];
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("fetches the file named by data-source and renders it", async () => {
    globalThis.fetch = async (url) => {
      requested.push(url);
      return new Response(SAMPLE, { status: 200 });
    };
    const element = await fixture(
      html`<ics-render
        element-visible
        data-source="/files/schedule.ics"
        debounce-delay="0"
      ></ics-render>`,
    );
    await waitUntil(() => element.status === "ready");
    await element.updateComplete;
    expect(requested).to.deep.equal(["/files/schedule.ics"]);
    expect(element.events.length).to.equal(3);
    expect(element.shadowRoot.querySelectorAll("date-card").length).to.equal(3);
  });

  it("reports a calendar it could not fetch", async () => {
    globalThis.fetch = async () => new Response("nope", { status: 404 });
    const element = await fixture(
      html`<ics-render
        element-visible
        data-source="/files/missing.ics"
        debounce-delay="0"
      ></ics-render>`,
    );
    await waitUntil(() => element.status === "error");
    await element.updateComplete;
    expect(element.events).to.deep.equal([]);
    const alert = element.shadowRoot.querySelector('[role="alert"]');
    expect(alert).to.exist;
    expect(alert.textContent).to.contain(element.t.calendarUnavailable);
  });

  it("reports a request that failed outright", async () => {
    globalThis.fetch = async () => {
      throw new Error("offline");
    };
    const element = await fixture(
      html`<ics-render
        element-visible
        data-source="/files/schedule.ics"
        debounce-delay="0"
      ></ics-render>`,
    );
    await waitUntil(() => element.status === "error");
    expect(element.status).to.equal("error");
  });

  it("does not fetch without a data-source", async () => {
    globalThis.fetch = async (url) => {
      requested.push(url);
      return new Response(SAMPLE, { status: 200 });
    };
    const element = await fixture(
      html`<ics-render element-visible debounce-delay="0"></ics-render>`,
    );
    await element.updateComplete;
    await element.loadCalendarData();
    await aTimeout(20);
    expect(requested).to.deep.equal([]);
  });

  it("takes up a line while waiting, so it can become visible and load", async () => {
    const element = await fixture(
      html`<ics-render
        data-source="/files/schedule.ics"
        debounce-delay="100000"
      ></ics-render>`,
    );
    await element.updateComplete;
    expect(element.shadowRoot.textContent).to.contain(
      element.t.loadingCalendar,
    );
    expect(element.offsetHeight).to.be.greaterThan(0);
  });

  it("takes up no space when there is nothing to load", async () => {
    const element = await fixture(html`<ics-render></ics-render>`);
    await element.updateComplete;
    expect(element.shadowRoot.textContent.trim()).to.equal("");
  });

  it("drops a pending load when it leaves the page", async () => {
    globalThis.fetch = async (url) => {
      requested.push(url);
      return new Response(SAMPLE, { status: 200 });
    };
    const element = await fixture(
      html`<ics-render
        element-visible
        data-source="/files/schedule.ics"
        debounce-delay="30"
      ></ics-render>`,
    );
    element.remove();
    await aTimeout(80);
    expect(requested).to.deep.equal([]);
  });
});

describe("IcsRender HAX wiring", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<ics-render></ics-render>`);
  });

  it("takes part in gizmo registration", () => {
    expect(element.haxHooks().gizmoRegistration).to.equal(
      "haxgizmoRegistration",
    );
  });

  it("registers ics as a type HAX can hand to an element", () => {
    const store = { validGizmoTypes: ["image"] };
    element.haxgizmoRegistration(store);
    expect(store.validGizmoTypes).to.contain("ics");
  });

  it("does not register the same type twice", () => {
    const store = { validGizmoTypes: ["image"] };
    element.haxgizmoRegistration(store);
    element.haxgizmoRegistration(store);
    expect(
      store.validGizmoTypes.filter((type) => type === "ics").length,
    ).to.equal(1);
  });

  it("survives a store it does not recognise", () => {
    expect(() => element.haxgizmoRegistration(undefined)).to.not.throw();
    expect(() => element.haxgizmoRegistration({})).to.not.throw();
  });

  it("has a schema that matches the element", async () => {
    const schema = await (
      await fetch(element.constructor.haxProperties)
    ).json();
    expect(schema.gizmo.handles[0].type).to.equal("ics");
    expect(schema.gizmo.handles[0].source).to.equal("dataSource");
    const configure = schema.settings.configure;
    const source = configure.find((field) => field.property === "dataSource");
    expect(source.inputMethod).to.equal("haxupload");
    expect(source.uploadRequirements.extensions).to.deep.equal([".ics"]);
    // the modes offered in HAX have to be the modes the element can render
    const displayAs = configure.find((field) => field.property === "displayAs");
    expect(Object.keys(displayAs.options)).to.deep.equal(
      element.constructor.displayModes,
    );
    expect(schema.demoSchema[0].tag).to.equal("ics-render");
  });

  it("has a demo schema that actually renders", async () => {
    const schema = await (
      await fetch(element.constructor.haxProperties)
    ).json();
    const demo = await fixture(html`<ics-render element-visible></ics-render>`);
    Object.keys(schema.demoSchema[0].properties).forEach((key) => {
      demo[key] = schema.demoSchema[0].properties[key];
    });
    await waitUntil(() => demo.status === "ready");
    await demo.updateComplete;
    expect(demo.events.length).to.be.greaterThan(0);
  });
});
