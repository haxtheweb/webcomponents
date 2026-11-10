import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lrndesign-imagemap.js";
import "../lib/lrndesign-imagemap-hotspot.js";
import { XAPI_ITEM_DELIMITER } from "@haxtheweb/user-action/lib/xapi.js";

const svgText =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  "<title>Map title</title>" +
  '<circle id="dd-a" cx="20" cy="20" r="10"/>' +
  '<circle id="dd-b" cx="60" cy="60" r="10"/>' +
  '<circle id="dd-c" cx="80" cy="20" r="10"/>' +
  "</svg>";
const svgDataUri = "data:image/svg+xml," + encodeURIComponent(svgText);

async function map() {
  const el = await fixture(html`
    <lrndesign-imagemap label="Cell parts" src="${svgDataUri}">
      <lrndesign-imagemap-hotspot hotspot-id="dd-a" label="Nucleus"
        >Holds the DNA.</lrndesign-imagemap-hotspot
      >
      <lrndesign-imagemap-hotspot hotspot-id="dd-b" label="Membrane"
        >Lets things in.</lrndesign-imagemap-hotspot
      >
      <lrndesign-imagemap-hotspot hotspot-id="dd-c" label="Ribosome"
        >Builds proteins.</lrndesign-imagemap-hotspot
      >
    </lrndesign-imagemap>
  `);
  await aTimeout(300);
  await el.updateComplete;
  return el;
}

const footerText = (el) =>
  el.shadowRoot.querySelector(".ddd-block-footer .explored").textContent.trim();

describe("lrndesign-imagemap DDD block", () => {
  it("renders the block header with the label as a real heading", async () => {
    const el = await map();
    const header = el.shadowRoot.querySelector(".ddd-block-header");
    expect(
      header.querySelector(".ddd-block-label").textContent.trim(),
    ).to.equal("Image map · Interactive");
    const heading = header.querySelector("relative-heading#heading");
    expect(heading).to.exist;
    const h = heading.querySelector("h1, h2, h3, h4, h5, h6");
    expect(h).to.exist;
    expect(h.textContent.trim()).to.equal("Cell parts");
  });

  it("counts explored hotspots in the footer and shows the done chip", async () => {
    const el = await map();
    expect(footerText(el)).to.equal("0 of 3 hotspots explored");
    el.openHotspot(el.hotspotDetails[0]);
    await el.updateComplete;
    expect(footerText(el)).to.equal("1 of 3 hotspots explored");
    expect(
      el.shadowRoot.querySelectorAll(".progress span[data-explored]").length,
    ).to.equal(1);
    const label = el.shadowRoot.querySelector(
      ".popover-header .ddd-block-label",
    );
    expect(label.textContent.replace(/\s+/g, " ").trim()).to.equal(
      "Hotspot · 1 of 3",
    );
    el.openHotspot(el.hotspotDetails[1]);
    el.openHotspot(el.hotspotDetails[2]);
    await el.updateComplete;
    expect(footerText(el)).to.equal("3 of 3 hotspots explored");
    const chip = el.shadowRoot.querySelector(".ddd-block-chip");
    expect(chip.hasAttribute("data-done")).to.be.true;
  });

  it("closes from the popover close button and returns focus", async () => {
    const el = await map();
    el.openHotspot(el.hotspotDetails[1]);
    await el.updateComplete;
    el.shadowRoot.querySelector(".popover-header button.close").click();
    await el.updateComplete;
    expect(el.__activeHotspot).to.equal(undefined);
    expect(globalThis.document.activeElement).to.equal(
      el.hotspotDetails[1].hotspot,
    );
  });

  it("sends the opened hotspot ids as the statement response", async () => {
    const el = await map();
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    el.openHotspot(el.hotspotDetails[0]);
    el.openHotspot(el.hotspotDetails[2]);
    const last = seen[seen.length - 1];
    expect(last.statement.result.response).to.equal(
      ["dd-a", "dd-c"].join(XAPI_ITEM_DELIMITER),
    );
  });

  it("restores explored hotspots from the learner profile", async () => {
    const handler = (e) => {
      if (e.detail.tag === "lrndesign-imagemap") {
        e.detail.record = {
          response: ["dd-b", "gone"].join(XAPI_ITEM_DELIMITER),
          done: false,
        };
      }
    };
    globalThis.addEventListener("learner-progress-request", handler);
    try {
      const el = await map();
      expect(footerText(el)).to.equal("1 of 3 hotspots explored");
      // reopening a restored hotspot is not a new step
      const seen = [];
      el.addEventListener("user-engagement", (e) => seen.push(e.detail));
      el.openHotspot(el.hotspotDetails[1]);
      expect(seen.length).to.equal(0);
    } finally {
      globalThis.removeEventListener("learner-progress-request", handler);
    }
  });

  it("restores a completed map as done without celebrating", async () => {
    const handler = (e) => {
      e.detail.record = { done: true };
    };
    globalThis.addEventListener("learner-progress-request", handler);
    try {
      const el = await map();
      expect(footerText(el)).to.equal("3 of 3 hotspots explored");
      const chip = el.shadowRoot.querySelector(".ddd-block-chip");
      expect(chip.hasAttribute("data-done")).to.be.true;
      expect(chip.hasAttribute("data-ddd-celebrate")).to.be.false;
    } finally {
      globalThis.removeEventListener("learner-progress-request", handler);
    }
  });

  it("starts over when the learner clears their progress", async () => {
    const el = await map();
    el.openHotspot(el.hotspotDetails[0]);
    await el.updateComplete;
    globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
    await el.updateComplete;
    expect(footerText(el)).to.equal("0 of 3 hotspots explored");
  });

  it("is accessible", async () => {
    const el = await map();
    await expect(el).shadowDom.to.be.accessible();
  });
});
