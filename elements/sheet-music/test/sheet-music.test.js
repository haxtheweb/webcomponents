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
        <template preserve-content="preserve-content"
          >\\title "Test" . :4 0.5 2.5</template
        >
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
    expect(
      element._surfaceWrap.getAttribute("data-sheet-music-surface"),
    ).to.equal("surface");
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

  it("defaults edit mode to off so the player shows by default", async () => {
    expect(element._haxstate).to.be.false;
  });

  it("uses the image:music-note icon in its haxProperties schema", async () => {
    const res = await fetch(element.constructor.haxProperties);
    const json = await res.json();
    expect(json.gizmo.icon).to.equal("image:music-note");
  });

  it("prevents drag-and-drop into its slotted area and clears the drag target", async () => {
    const store = { __dragTarget: { tagName: "VIDEO-PLAYER" } };
    globalThis.HaxStore = {
      requestAvailability() {
        return store;
      },
    };
    const evt = new Event("drop", {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    element.dispatchEvent(evt);
    expect(evt.defaultPrevented).to.be.true;
    expect(store.__dragTarget).to.be.null;
    delete globalThis.HaxStore;
  });

  it("live-updates the alphaTab preview and re-renders on editor value changes", async () => {
    let lastTex = null;
    let renderCalls = 0;
    element.api = {
      tex: (t) => {
        lastTex = t;
      },
      render: () => {
        renderCalls++;
      },
      destroy: () => {},
    };
    element.source = "";
    element._tex = '\\title "Old" . :4 0.5';
    element._onEditorValueChanged(
      new CustomEvent("value-changed", {
        detail: { value: '\\title "Live" . :4 1.1 2.1' },
      }),
    );
    // wait past the 200ms debounce window
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(lastTex).to.equal('\\title "Live" . :4 1.1 2.1');
    expect(renderCalls).to.be.greaterThan(0);
  });
});

// Silence console.warn/error noise while still recording the calls.
function silenceConsole() {
  const savedWarn = console.warn;
  const warns = [];
  console.warn = function () {
    warns.push(Array.from(arguments));
  };
  return {
    warns,
    restore: () => {
      console.warn = savedWarn;
    },
  };
}

// Build a recording stand-in for the alphaTab api surface.
function makeFakeApi() {
  const calls = {
    tex: [],
    renders: 0,
    destroyed: 0,
    loads: [],
    updates: 0,
    plays: 0,
    stops: 0,
    midis: 0,
    prints: 0,
  };
  const handlers = {};
  const api = {
    tex: (t) => {
      calls.tex.push(t);
    },
    render: () => {
      calls.renders++;
    },
    destroy: () => {
      calls.destroyed++;
    },
    load: (source) => {
      calls.loads.push(source);
    },
    updateSettings: () => {
      calls.updates++;
    },
    playPause: () => {
      calls.plays++;
    },
    stop: () => {
      calls.stops++;
    },
    downloadMidi: () => {
      calls.midis++;
    },
    print: () => {
      calls.prints++;
    },
    settings: { display: { scale: 1, stretchForce: 1, layoutMode: 0 } },
    playerReady: { on: (cb) => (handlers.playerReady = cb) },
    playerStateChanged: { on: (cb) => (handlers.playerStateChanged = cb) },
    playerFinished: { on: (cb) => (handlers.playerFinished = cb) },
    playerPositionChanged: { on: (cb) => (handlers.playerPositionChanged = cb) },
    soundFontLoad: { on: (cb) => (handlers.soundFontLoad = cb) },
    error: { on: (cb) => (handlers.error = cb) },
  };
  return { api, calls, handlers };
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("sheet-music stubbed-api surface", () => {
  it("creates a template when none is slotted", async () => {
    const el = await fixture(html`<sheet-music></sheet-music>`);
    const templates = el.querySelectorAll("template");
    expect(templates).to.have.lengthOf(1);
    const created = templates[0];
    expect(created.hasAttribute("preserve-content")).to.be.true;
    expect(el._tex).to.equal("");
    // reading with no template at all yields empty tex
    created.remove();
    expect(el._readTex()).to.equal("");
    // observing twice is guarded
    el._observeContent();
    el._observeContent();
  });

  it("bails out of init when not visible or already built", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    // not visible: no engine gets built
    el._initAlphaTab();
    expect(el.api).to.be.null;
    const { api } = makeFakeApi();
    el.api = api;
    // already built: early return
    el._ensureAlphaTab();
    el.api = null;
    // still not visible: early return
    el._ensureAlphaTab();
    expect(el.api).to.be.null;
  });

  it("wires player events into the control UI state", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    // wiring without an api is a no-op
    el._wireEvents();
    const { api, handlers } = makeFakeApi();
    el.api = api;
    el._wireEvents();
    handlers.playerReady();
    expect(el._playerReady).to.be.true;
    handlers.playerStateChanged({ state: 1 });
    await el.updateComplete;
    expect(el._playing).to.be.true;
    expect(el.shadowRoot.querySelector("#sm-play").icon).to.equal("av:pause");
    handlers.playerStateChanged({ state: 0 });
    expect(el._playing).to.be.false;
    el._playProgress = 50;
    handlers.playerFinished();
    expect(el._playing).to.be.false;
    expect(el._playProgress).to.equal(0);
    handlers.playerPositionChanged({ currentTime: 65000, endTime: 599000 });
    expect(el._timeText).to.equal("01:05 / 09:59");
    expect(el._playProgress).to.equal(11);
    // zero end time keeps the progress bar where it was
    handlers.playerPositionChanged({ currentTime: 1000, endTime: 0 });
    expect(el._playProgress).to.equal(11);
    handlers.soundFontLoad({ loaded: 25, total: 50 });
    expect(el._loadProgress).to.equal(50);
    handlers.soundFontLoad({ loaded: 1 });
    expect(el._loadProgress).to.equal(0);
    const quiet = silenceConsole();
    handlers.error("engine broke");
    quiet.restore();
    expect(quiet.warns).to.have.lengthOf(1);
  });

  it("applies display settings through the option handlers", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    // without an api every handler is a no-op
    el._applyDisplayChange("scale", 2);
    el._zoomIn();
    el._zoomOut();
    el._toggleStretch();
    el._toggleLayout();
    const { api, calls } = makeFakeApi();
    el.api = api;
    el._zoomIn();
    expect(api.settings.display.scale).to.equal(1.1);
    el._zoomOut();
    expect(api.settings.display.scale).to.equal(1);
    api.settings.display.scale = 1.9;
    el._zoomIn();
    expect(api.settings.display.scale).to.equal(2);
    api.settings.display.scale = 0.6;
    el._zoomOut();
    expect(api.settings.display.scale).to.equal(0.5);
    // stretch cycles normal -> wide -> compact -> normal
    el._toggleStretch();
    expect(api.settings.display.stretchForce).to.equal(1.5);
    el._toggleStretch();
    expect(api.settings.display.stretchForce).to.equal(0.5);
    el._toggleStretch();
    expect(api.settings.display.stretchForce).to.equal(1);
    // layout toggles between page and horizontal
    el._toggleLayout();
    expect(api.settings.display.layoutMode).to.equal(1);
    el._toggleLayout();
    expect(api.settings.display.layoutMode).to.equal(0);
    expect(calls.updates).to.be.greaterThan(0);
    expect(calls.renders).to.be.greaterThan(0);
  });

  it("runs export and playback handlers against the api", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    // no api: no-ops
    el._downloadMidi();
    el._print();
    el._playPause();
    el._stop();
    const { api, calls } = makeFakeApi();
    el.api = api;
    el._downloadMidi();
    expect(calls.midis).to.equal(1);
    el._print();
    expect(calls.prints).to.equal(1);
    el._playPause();
    expect(calls.plays).to.equal(1);
    el._stop();
    expect(calls.stops).to.equal(1);
  });

  it("loads an uploaded score source into the api", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    const { api, calls } = makeFakeApi();
    el.api = api;
    el.source = "score.gp";
    await el.updateComplete;
    expect(calls.loads).to.deep.equal(["score.gp"]);
    // tex syncing bails while a source file is active
    el._scheduleTexSync();
    await wait(350);
    expect(calls.tex).to.have.lengthOf(0);
    // without an api a source stays pending until visible
    const el2 = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    el2.source = "song.gp";
    await el2.updateComplete;
    expect(el2.api).to.be.null;
  });

  it("rebuilds alphaTab when the audio option flips", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    const { api, calls } = makeFakeApi();
    el.api = api;
    el.elementVisible = true;
    await el.updateComplete;
    // simulate the surface being torn down by a HAX save pre-process
    el._surfaceWrap = null;
    el.audio = false;
    await el.updateComplete;
    expect(calls.destroyed).to.equal(1);
    expect(el.api).to.be.null;
    expect(el._playerReady).to.be.false;
    expect(el._playing).to.be.false;
    expect(el._loadProgress).to.equal(0);
    expect(el._playProgress).to.equal(0);
    expect(el._timeText).to.equal("00:00 / 00:00");
    // rebuilding without an api skips the destroy branch
    el._rebuildAlphaTab();
    expect(calls.destroyed).to.equal(1);
  });

  it("recreates the surface wrapper when torn down while visible", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    const { api } = makeFakeApi();
    el.api = api;
    el.elementVisible = true;
    await el.updateComplete;
    el.api = null;
    el._surfaceWrap = null;
    el._ensureAlphaTab();
    // block the pending async init from building a real engine
    el.api = api;
    const surface = el._surfaceWrap;
    expect(surface).to.exist;
    expect(surface.getAttribute("slot")).to.equal("sheet-music-surface");
    expect(surface.getAttribute("data-sheet-music-surface")).to.equal(
      "surface",
    );
    expect(el.contains(surface)).to.be.true;
    await wait(150);
  });

  it("syncs template edits into alphaTab through the mutation observer", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "A" . :4 1</template
        ></sheet-music
      >`,
    );
    const { api, calls } = makeFakeApi();
    el.api = api;
    // swap the template for one with new tex
    el.querySelectorAll("template").forEach((t) => t.remove());
    const fresh = document.createElement("template");
    fresh.setAttribute("preserve-content", "preserve-content");
    fresh.content.textContent = '\\title "B" . :4 2';
    el.appendChild(fresh);
    await wait(350);
    expect(el._tex).to.equal('\\title "B" . :4 2');
    expect(calls.tex).to.deep.equal(['\\title "B" . :4 2']);
    expect(calls.renders).to.be.greaterThan(0);
  });

  it("ignores mutations that originate inside the surface wrapper", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "A" . :4 1</template
        ></sheet-music
      >`,
    );
    const { api, calls } = makeFakeApi();
    el.api = api;
    el._surfaceWrap.appendChild(document.createElement("div"));
    await wait(350);
    expect(calls.tex).to.have.lengthOf(0);
    expect(calls.renders).to.equal(0);
  });

  it("debounces editor events and skips empty or unchanged tex", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "A" . :4 1</template
        ></sheet-music
      >`,
    );
    const { api, calls } = makeFakeApi();
    el.api = api;
    el.source = "";
    el._tex = '\\title "Old" . :4 1';
    // empty detail bails
    el._onEditorValueChanged(
      new CustomEvent("value-changed", { detail: "" }),
    );
    // same value bails
    el._onEditorValueChanged(
      new CustomEvent("value-changed", {
        detail: { value: '\\title "Old" . :4 1' },
      }),
    );
    // a plain string detail is applied directly
    el._onEditorValueChanged(
      new CustomEvent("value-changed", { detail: '\\title "New" . :4 2' }),
    );
    await wait(350);
    expect(calls.tex).to.deep.equal(['\\title "New" . :4 2']);
    expect(calls.renders).to.be.greaterThan(0);
  });

  it("implements the HAX hooks", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    expect(el.haxHooks()).to.deep.equal({
      activeElementChanged: "haxactiveElementChanged",
      editModeChanged: "haxeditModeChanged",
      preProcessNodeToContent: "haxpreProcessNodeToContent",
    });
    el.haxactiveElementChanged(el, true);
    expect(el._haxstate).to.be.true;
    // deactivating leaves the flag as-is per the hook contract
    el.haxactiveElementChanged(el, false);
    expect(el._haxstate).to.be.true;
    el.haxeditModeChanged(false);
    expect(el._haxstate).to.be.false;
    el.haxeditModeChanged(true);
    expect(el._haxstate).to.be.true;
    // pre-process tears down the player but returns the node intact
    const { api, calls } = makeFakeApi();
    el.api = api;
    const node = el.haxpreProcessNodeToContent(el);
    expect(node).to.equal(el);
    expect(calls.destroyed).to.equal(1);
    expect(el.api).to.be.null;
    expect(el._playerReady).to.be.false;
    expect(el._playing).to.be.false;
    expect(el._haxstate).to.be.false;
    expect(el._surfaceWrap).to.be.null;
    expect(el.querySelector("[data-sheet-music-surface]")).to.be.null;
    // without an api it still strips the surface and returns the node
    const el2 = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    const node2 = el2.haxpreProcessNodeToContent(el2);
    expect(node2).to.equal(el2);
    expect(el2._surfaceWrap).to.be.null;
  });

  it("tolerates a broken or missing HaxStore on drop", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    globalThis.HaxStore = {
      requestAvailability() {
        throw new Error("store unavailable");
      },
    };
    const evt = new Event("drop", {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    el.dispatchEvent(evt);
    expect(evt.defaultPrevented).to.be.true;
    delete globalThis.HaxStore;
    const evt2 = new Event("drop", {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    el.dispatchEvent(evt2);
    expect(evt2.defaultPrevented).to.be.true;
  });

  it("tears everything down on disconnect", async () => {
    const el = await fixture(
      html`<sheet-music
        ><template preserve-content="preserve-content"
          >\\title "T" . :4 1</template
        ></sheet-music
      >`,
    );
    const { api, calls } = makeFakeApi();
    el.api = api;
    const surface = el._surfaceWrap;
    el.disconnectedCallback();
    expect(calls.destroyed).to.equal(1);
    expect(el.api).to.be.null;
    expect(el._observer).to.be.null;
    expect(el._surfaceWrap).to.be.null;
    expect(surface.parentNode).to.be.null;
    // a second disconnect is a no-op
    el.disconnectedCallback();
    expect(calls.destroyed).to.equal(1);
  });
});
