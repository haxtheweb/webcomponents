import { fixture, expect, html } from "@open-wc/testing";
import "../aframe-player.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// the A-Frame library is not loaded from aframe.io until the visitor allows
// it. ESGlobalBridge.load is stubbed so the test never reaches the network.
describe("aframe-player consent", () => {
  let loads;
  let bridge;
  let originalLoad;
  before(() => {
    bridge = globalThis.ESGlobalBridge.requestAvailability();
    originalLoad = bridge.load;
  });
  beforeEach(() => {
    HaxConsent.clearAll();
    loads = [];
    bridge.load = (name, location) => {
      loads.push(location);
      return Promise.resolve(true);
    };
  });
  afterEach(() => {
    bridge.load = originalLoad;
  });
  after(() => HaxConsent.clearAll());

  it("shows the panel, no scene and loads nothing before consent", async () => {
    const el = await fixture(
      html`<aframe-player source="model.gltf"></aframe-player>`,
    );
    expect(loads).to.be.empty;
    expect(el.querySelector("a-scene")).to.not.exist;
    const gate = el.querySelector("hax-consent-gate");
    expect(gate.getAttribute("service")).to.equal("aframe");
    // shaped like the scene it stands in for
    expect(gate.getAttribute("style")).to.contain("640 / 480");
  });

  it("loads A-Frame once allowed", async () => {
    const el = await fixture(
      html`<aframe-player source="model.gltf"></aframe-player>`,
    );
    HaxConsent.set("aframe", "allow");
    await el.updateComplete;
    expect(loads).to.deep.equal([
      "https://aframe.io/releases/0.9.2/aframe.min.js",
    ]);
    expect(el.querySelector("hax-consent-gate")).to.not.exist;
    expect(el.querySelector("a-scene")).to.exist;
  });
});
