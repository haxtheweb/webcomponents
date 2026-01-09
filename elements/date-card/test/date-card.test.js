import { fixture, expect, html, assert } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../date-card.js";

describe("date-card basic functionality", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<date-card
        month="January"
        date="15"
        day="Monday"
        title="Meeting"
      ></date-card>`,
    );
  });

  it("should render correctly", () => {
    expect(element).to.exist;
    expect(element.tagName).to.equal("DATE-CARD");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has correct default properties", async () => {
    const el = await fixture(html`<date-card></date-card>`);
    expect(el.borderSpacing).to.equal(5);
    expect(el.accentColor).to.equal("light-blue");
  });

  it("renders required DOM structure", () => {
    const card = element.shadowRoot.querySelector(".card");
    const monthSection = element.shadowRoot.querySelector(".monthSection");
    const dateSection = element.shadowRoot.querySelector(".dateSection");

    expect(card).to.exist;
    expect(monthSection).to.exist;
    expect(dateSection).to.exist;
  });
});

describe("date-card accessibility tests", () => {
  it("passes accessibility with full date information", async () => {
    const el = await fixture(html`
      <date-card
        month="December"
        date="25"
        day="Friday"
        title="Holiday Party"
        start-time="6:00 PM"
        end-time="10:00 PM"
        location="Conference Room A"
      ></date-card>
    `);
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with minimal information", async () => {
    const el = await fixture(
      html`<date-card month="March" date="10"></date-card>`,
    );
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with SimpleColors properties", async () => {
    const el = await fixture(
      html`<date-card accent-color="red" dark></date-card>`,
    );
    await expect(el).to.be.accessible();
  });
});

describe("date-card property validation", () => {
  it("accepts valid string properties", async () => {
    const el = await fixture(html`
      <date-card
        month="October"
        date="31"
        day="Tuesday"
        title="Halloween"
        start-time="7:00 PM"
        end-time="11:00 PM"
        location="Main Hall"
      ></date-card>
    `);

    expect(el.month).to.equal("October");
    expect(el.date).to.equal("31");
    expect(el.day).to.equal("Tuesday");
    expect(el.title).to.equal("Halloween");
    expect(el.startTime).to.equal("7:00 PM");
    expect(el.endTime).to.equal("11:00 PM");
    expect(el.location).to.equal("Main Hall");
  });

  it("accepts valid numeric properties", async () => {
    const el = await fixture(html`<date-card border-spacing="10"></date-card>`);
    expect(el.borderSpacing).to.equal(10);
    expect(typeof el.borderSpacing).to.equal("number");
  });

  it("inherits SimpleColors properties correctly", async () => {
    const el = await fixture(
      html`<date-card accent-color="green" dark></date-card>`,
    );
    expect(el.accentColor).to.equal("green");
    expect(el.dark).to.be.true;
  });

  it("updates properties reactively", async () => {
    const el = await fixture(html`<date-card></date-card>`);

    el.month = "June";
    el.date = "15";
    el.day = "Wednesday";
    el.title = "Summer Event";
    el.borderSpacing = 8;

    await el.updateComplete;

    expect(el.month).to.equal("June");
    expect(el.date).to.equal("15");
    expect(el.day).to.equal("Wednesday");
    expect(el.title).to.equal("Summer Event");
    expect(el.borderSpacing).to.equal(8);
  });
});

describe("date-card rendering and display", () => {
  it("renders month and date correctly", async () => {
    const el = await fixture(
      html`<date-card month="September" date="5"></date-card>`,
    );

    const monthEl = el.shadowRoot.querySelector(".month");
    const dateEl = el.shadowRoot.querySelector(".dateNumber");

    expect(monthEl.textContent.trim()).to.equal("SEPTEMBER");
    expect(dateEl.textContent).to.include("5");
    expect(dateEl.textContent).to.include("th"); // 5th
  });

  it("renders day when provided", async () => {
    const el = await fixture(
      html`<date-card month="April" date="20" day="Saturday"></date-card>`,
    );

    const dayEl = el.shadowRoot.querySelector(".dayName");
    expect(dayEl).to.exist;
    expect(dayEl.textContent.trim()).to.equal("SATURDAY");
  });

  it("renders details section when title is provided", async () => {
    const el = await fixture(
      html`<date-card month="May" date="1" title="Labor Day"></date-card>`,
    );

    const details = el.shadowRoot.querySelector(".details");
    const titleEl = el.shadowRoot.querySelector(".title");

    expect(details).to.exist;
    expect(titleEl).to.exist;
    expect(titleEl.textContent.trim()).to.equal("Labor Day");
  });

  it("renders time information correctly", async () => {
    const el = await fixture(html`
      <date-card
        month="August"
        date="15"
        title="Meeting"
        start-time="2:00 PM"
        end-time="4:00 PM"
      ></date-card>
    `);

    const timeEl = el.shadowRoot.querySelector(".time");
    expect(timeEl).to.exist;
    expect(timeEl.textContent).to.include("August");
    expect(timeEl.textContent).to.include("15th");
    expect(timeEl.textContent).to.include("from 2:00 PM - 4:00 PM");
  });

  it("renders location when provided", async () => {
    const el = await fixture(html`
      <date-card
        month="November"
        date="11"
        title="Veterans Day"
        location="Memorial Park"
      ></date-card>
    `);

    const locationEl = el.shadowRoot.querySelector(".location");
    expect(locationEl).to.exist;
    expect(locationEl.textContent.trim()).to.equal("Memorial Park");
  });
});

describe("date-card ordinal number functionality", () => {
  it("correctly generates ordinal suffixes", async () => {
    const el = await fixture(html`<date-card></date-card>`);

    expect(el.nth(1)).to.equal("st");
    expect(el.nth(2)).to.equal("nd");
    expect(el.nth(3)).to.equal("rd");
    expect(el.nth(4)).to.equal("th");
    expect(el.nth(11)).to.equal("th");
    expect(el.nth(21)).to.equal("st");
    expect(el.nth(22)).to.equal("nd");
    expect(el.nth(23)).to.equal("rd");
    expect(el.nth(31)).to.equal("st");
  });

  it("handles edge cases for ordinals", async () => {
    const el = await fixture(html`<date-card></date-card>`);

    expect(el.nth(null)).to.equal("");
    expect(el.nth(undefined)).to.equal("");
    expect(el.nth(0)).to.equal("th");
  });
});

describe("date-card HAX integration", () => {
  it("has haxProperties configuration", async () => {
    const el = await fixture(html`<date-card></date-card>`);
    const haxProps = el.constructor.haxProperties;

    expect(haxProps).to.exist;
    expect(typeof haxProps).to.equal("string");
    expect(haxProps).to.include(".haxProperties.json");
  });

  it("has correct tag name", async () => {
    const el = await fixture(html`<date-card></date-card>`);
    expect(el.constructor.tag).to.equal("date-card");
  });
});

describe("date-card responsive design", () => {
  beforeEach(async () => {
    await setViewport({ width: 375, height: 750 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts to mobile viewport", async () => {
    const el = await fixture(
      html`<date-card
        month="July"
        date="4"
        title="Independence Day"
      ></date-card>`,
    );

    expect(el).to.exist;
    await el.updateComplete;

    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal("inline-flex");
  });

  it("maintains accessibility on mobile", async () => {
    const el = await fixture(
      html`<date-card
        month="February"
        date="14"
        title="Valentine's Day"
      ></date-card>`,
    );
    await expect(el).to.be.accessible();
  });
});

describe("date-card desktop responsiveness", () => {
  beforeEach(async () => {
    await setViewport({ width: 1200, height: 800 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts to desktop viewport", async () => {
    const el = await fixture(
      html`<date-card
        month="September"
        date="22"
        title="Fall Equinox"
      ></date-card>`,
    );

    expect(el).to.exist;
    await el.updateComplete;

    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal("inline-flex");
  });
});

describe("date-card error handling", () => {
  it("handles missing date information gracefully", async () => {
    const el = await fixture(html`<date-card></date-card>`);

    expect(el).to.exist;
    await expect(el).to.be.accessible();

    const monthEl = el.shadowRoot.querySelector(".month");
    const dateEl = el.shadowRoot.querySelector(".dateNumber");

    expect(monthEl).to.exist;
    expect(dateEl).to.exist;
  });

  it("handles invalid date values", async () => {
    const el = await fixture(
      html`<date-card date="invalid" month="NotAMonth"></date-card>`,
    );

    expect(el.date).to.equal("invalid");
    expect(el.month).to.equal("NotAMonth");
    expect(el).to.exist;
  });

  it("handles rapid property changes", async () => {
    const el = await fixture(html`<date-card></date-card>`);

    const months = ["Jan", "Feb", "Mar", "Apr", "May"];
    const dates = ["1", "15", "31", "8", "22"];

    for (let i = 0; i < 10; i++) {
      el.month = months[i % months.length];
      el.date = dates[i % dates.length];
      el.borderSpacing = i + 1;
    }

    await el.updateComplete;
    expect(el.month).to.equal("May");
    expect(el.date).to.equal("22");
    expect(el.borderSpacing).to.equal(10);
  });

  it("handles special characters in text fields", async () => {
    const el = await fixture(html`
      <date-card
        month="Décembre"
        title="Noël 🎄"
        location="Café & Restaurant"
      ></date-card>
    `);

    expect(el.month).to.equal("Décembre");
    expect(el.title).to.equal("Noël 🎄");
    expect(el.location).to.equal("Café & Restaurant");
  });

  it("handles extreme border spacing values", async () => {
    const smallEl = await fixture(
      html`<date-card border-spacing="0"></date-card>`,
    );
    const largeEl = await fixture(
      html`<date-card border-spacing="100"></date-card>`,
    );

    expect(smallEl.borderSpacing).to.equal(0);
    expect(largeEl.borderSpacing).to.equal(100);

    expect(smallEl).to.exist;
    expect(largeEl).to.exist;
  });

  it("maintains SimpleColors functionality with invalid colors", async () => {
    const el = await fixture(
      html`<date-card accent-color="invalid-color"></date-card>`,
    );

    expect(el.accentColor).to.equal("invalid-color");
    expect(el).to.exist;
  });
});
