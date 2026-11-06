import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lrndesign-imagemap.js";
import "../lib/lrndesign-imagemap-hotspot.js";
import { XAPI_VERBS } from "@haxtheweb/user-action/lib/xapi.js";

const svgText =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  "<title>Map title</title>" +
  '<circle id="lm-a" cx="20" cy="20" r="10"/>' +
  '<circle id="lm-b" cx="60" cy="60" r="10"/>' +
  "</svg>";
const svgDataUri = "data:image/svg+xml," + encodeURIComponent(svgText);

async function map() {
  const el = await fixture(html`
    <lrndesign-imagemap label="Parts of a cell" src="${svgDataUri}">
      <lrndesign-imagemap-hotspot hotspot-id="lm-a" label="Nucleus">
        Holds the DNA.
      </lrndesign-imagemap-hotspot>
      <lrndesign-imagemap-hotspot hotspot-id="lm-b" label="Membrane">
        Lets things in and out.
      </lrndesign-imagemap-hotspot>
    </lrndesign-imagemap>
  `);
  await aTimeout(300);
  return el;
}

describe("lrndesign-imagemap keyboard and learner data", () => {
  it("makes every hotspot shape keyboard reachable", async () => {
    const el = await map();
    el.hotspotDetails.forEach((h) => {
      expect(h.hotspot.getAttribute("tabindex")).to.equal("0");
      expect(h.hotspot.getAttribute("role")).to.equal("button");
    });
  });

  it("opens with Enter or Space and closes with Escape", async () => {
    const el = await map();
    const shape = el.querySelector("#lm-b");
    shape.focus();
    shape.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.__activeHotspot.id).to.equal("lm-b");
    expect(shape.getAttribute("aria-expanded")).to.equal("true");
    el.querySelector("#lm-a").dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.__activeHotspot.id).to.equal("lm-a");
    el.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.__activeHotspot).to.equal(undefined);
    expect(shape.getAttribute("aria-expanded")).to.equal("false");
    expect(el.shadowRoot.querySelector("simple-popover").hidden).to.equal(true);
  });

  it("styles hotspot shapes from one light DOM stylesheet", async () => {
    await map();
    await map();
    expect(
      globalThis.document.querySelectorAll("#lrndesign-imagemap-hotspot-styles")
        .length,
    ).to.equal(1);
  });

  it("generates ids without Math.random", async () => {
    const el = await map();
    const a = el._getId(globalThis.document.createElement("div"));
    const b = el._getId(globalThis.document.createElement("div"));
    expect(a).to.match(/^lrndesign-imagemap-info-\d+$/);
    expect(a).to.not.equal(b);
  });

  it("records each hotspot opened once, then completes the map", async () => {
    const el = await map();
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    el.openHotspot(el.hotspotDetails[0]);
    el.openHotspot(el.hotspotDetails[0]);
    el.openHotspot(el.hotspotDetails[1]);
    el.openHotspot(el.hotspotDetails[1]);
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "progressed",
      "progressed",
      "completed",
    ]);
    const first = seen[0].statement;
    expect(first.verb.id).to.equal(XAPI_VERBS.progressed);
    expect(Object.values(first.object.definition.name)[0]).to.equal(
      "Parts of a cell",
    );
    expect(Object.values(first.object.definition.description)[0]).to.equal(
      "Nucleus",
    );
    expect(first.result.completion).to.equal(false);
    expect(first.result.score).to.include({ raw: 1, max: 2 });
    const done = seen[2].statement;
    expect(done.verb.id).to.equal(XAPI_VERBS.completed);
    expect(done.result.completion).to.equal(true);
    expect(done.object.id).to.equal(first.object.id);
  });

  it("records nothing while HAX is editing", async () => {
    const el = await map();
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    el.haxeditModeChanged(true);
    el.openHotspot(el.hotspotDetails[0]);
    expect(seen.length).to.equal(0);
  });

  it("passes the a11y audit with the map loaded", async () => {
    const el = await map();
    await expect(el).to.be.accessible();
  });
});
