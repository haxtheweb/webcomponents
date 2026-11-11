import { fixture, expect, html } from "@open-wc/testing";
import "../date-card.js";

// the suffixes the element used before ordinals moved into this.t
function legacyNth(d) {
  if (!d) return "";
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

describe("date-card i18n", () => {
  it("English ordinals are unchanged for every day of the month", async () => {
    const el = await fixture(
      html`<date-card month="May" date="1"></date-card>`,
    );
    for (let d = 1; d <= 31; d++) {
      expect(el.nth(String(d)), `day ${d}`).to.equal(legacyNth(String(d)));
    }
    expect(el.nth("")).to.equal("");
    expect(el.nth("4th")).to.equal("th");
  });
  it("renders time ranges from this.t", async () => {
    const el = await fixture(
      html`<date-card
        month="August"
        date="4"
        title="Social"
        start-time="4PM"
        end-time="6PM"
      ></date-card>`,
    );
    const time = el.shadowRoot.querySelector(".time");
    expect(time.textContent.replace(/\s+/g, " ").trim()).to.equal(
      "August 4th from 4PM - 6PM",
    );
    el.t = { ...el.t, fromTimeToTime: "de {start} à {end}" };
    await el.updateComplete;
    expect(time.textContent).to.include("de 4PM à 6PM");
  });
});
