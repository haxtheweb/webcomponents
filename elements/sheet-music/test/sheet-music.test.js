import { html, fixture, expect } from "@open-wc/testing";
import "../sheet-music.js";

// Stub IntersectionObserver so the visibility-gated alphaTab import/init does
// not fire (and pull in a 1.1MB module + workers) during unit tests. This lets
// us deterministically assert the off-screen gating behavior.
before(() => {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
});

describe("SheetMusic test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <sheet-music>
        <template preserve-content="preserve-content">\\title "Test"
.
:4 0.5 2.5</template>
      </sheet-music>
    `);
  });

  it("instantiates and registers", async () => {
    expect(element).to.exist;
    expect(customElements.get("sheet-music")).to.be.ok;
  });

  it("has audio on by default", async () => {
    expect(element.audio).to.be.true;
  });

  it("reads alphaTex from the slotted template", async () => {
    expect(element._tex).to.contain("\\title");
    expect(element._tex).to.contain(":4");
  });

  it("haxProperties resolves to the external schema file", async () => {
    const url = element.constructor.haxProperties;
    expect(url).to.include("sheet-music.haxProperties.json");
  });

  it("creates a light-DOM surface wrapper for alphaTab", async () => {
    // alphaTab injects its CSS into document.head so its container must live in
    // light DOM (not the shadow root) for the font/surface styles to apply.
    expect(element._surfaceWrap).to.exist;
    expect(element._surfaceWrap.getAttribute("data-sheet-music-surface")).to.equal(
      "surface",
    );
    expect(element.contains(element._surfaceWrap)).to.be.true;
  });

  it("does not initialize alphaTab until the element is visible", async () => {
    // IntersectionObserver-gated init: off-screen the api stays null
    expect(element.api).to.be.null;
  });

  it("renders the alphaTab surface into light DOM when made visible", async function () {
    // alphaTab loads a 1.1MB core + spawns workers on init, so allow ample time.
    this.timeout(20000);
    // Simulate scrolling into view: flip the mixin flag and trigger init.
    element.elementVisible = true;
    await element._initAlphaTab();
    expect(element.api).to.exist;
    // poll for the rendered .at-surface (worker-based render is async)
    let surface = null;
    for (let i = 0; i < 40 && !surface; i++) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      surface = element._surfaceWrap.querySelector(".at-surface");
    }
    expect(surface).to.exist;
  });

  it("uses simple-icon-button-lite for play/pause and stop controls", async () => {
    const controls = element.shadowRoot.querySelector(".at-controls");
    expect(controls).to.exist;
    const buttons = controls.querySelectorAll("simple-icon-button-lite");
    // play/pause + stop + zoom out + zoom in + stretch + layout + download + print
    expect(buttons.length).to.equal(8);
    // play/pause toggles icon based on playing state (starts as play-arrow)
    expect(buttons[0].icon).to.equal("av:play-arrow");
    expect(buttons[1].icon).to.equal("av:stop");
  });

  it("passes the a11y shadow-dom audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
