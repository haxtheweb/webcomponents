import { fixture, expect, html } from "@open-wc/testing";

import "../hal-9000.js";
import { Hal9000, HAL9000Instance } from "../hal-9000.js";
import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";

// settle helper: let Lit finish the current update plus any update
// scheduled from inside the updated() hook (e.g. auto -> enabled)
async function settle(el) {
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
}

// stub/restore pattern for the annyang dependency
class AnnyangStub {
  constructor() {
    this.removeCommandsCalls = 0;
    this.addCommandsArgs = [];
    this.debugCalls = [];
    this.startArgs = [];
    this.abortCalls = 0;
  }
  removeCommands() {
    this.removeCommandsCalls += 1;
  }
  addCommands(commands) {
    this.addCommandsArgs.push(commands);
  }
  debug(state) {
    this.debugCalls.push(state);
  }
  start(options) {
    this.startArgs.push(options);
  }
  abort() {
    this.abortCalls += 1;
  }
}

function dispatchBridgeEvent() {
  globalThis.dispatchEvent(new CustomEvent("es-bridge-annyang-loaded"));
}

describe("hal-9000 test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <hal-9000 title="test-title"></hal-9000> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("hal-9000 defaults and singleton", () => {
  it("sets sensible defaults", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    expect(el).to.be.instanceOf(Hal9000);
    expect(el.toast).to.be.false;
    expect(el.commands).to.deep.equal({});
    expect(el.respondsTo).to.equal("(merlin)");
    expect(el.debug).to.be.false;
    expect(el.auto).to.be.false;
    expect(el.enabled).to.be.false;
    expect(el.pitch).to.equal(0.9);
    expect(el.rate).to.equal(0.9);
    expect(el.language).to.equal(globalThis.navigator.language);
  });

  it("reflects observable properties to attributes", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    el.toast = true;
    el.pitch = 1.5;
    el.rate = 0.75;
    el.language = "en-GB";
    await settle(el);
    expect(el.hasAttribute("toast")).to.be.true;
    expect(el.getAttribute("pitch")).to.equal("1.5");
    expect(el.getAttribute("rate")).to.equal("0.75");
    expect(el.getAttribute("language")).to.equal("en-GB");
    // respondsTo reflects so the constructor default writes the attribute
    expect(el.getAttribute("responds-to")).to.equal("(merlin)");
  });

  it("exposes a singleton through requestAvailability", async () => {
    expect(HAL9000Instance).to.exist;
    expect(HAL9000Instance.tagName.toLowerCase()).to.equal("hal-9000");
    const el = await fixture(html`<hal-9000></hal-9000>`);
    // the most recently constructed element is the current instance
    expect(globalThis.Hal9000.instance).to.equal(el);
    expect(globalThis.Hal9000.requestAvailability()).to.equal(el);
  });
});

describe("hal-9000 speak", () => {
  it("creates an utterance with the configured voice settings", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    el.pitch = 1.2;
    el.rate = 0.5;
    el.language = "en-GB";
    // force a synth so the test does not depend on browser speech support
    el.synth = { speak: () => {} };
    const spoken = el.speak("hello dave");
    expect(el.utter).to.exist;
    expect(el.utter.text).to.equal("hello dave");
    // SpeechSynthesisUtterance stores pitch/rate as 32-bit floats
    expect(el.utter.pitch).to.be.closeTo(1.2, 0.00001);
    expect(el.utter.rate).to.be.closeTo(0.5, 0.00001);
    expect(el.utter.lang).to.equal("en-GB");
    // resolve the promise via the utterance end handler
    el.utter.onend(new Event("end"));
    const event = await spoken;
    expect(event).to.exist;
  });

  it("resolves false when there is no speech synthesis", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    el.synth = undefined;
    expect(await el.speak("anything")).to.be.false;
  });

  it("shows a toast when toast mode is on", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    el.synth = { speak: () => {} };
    el.toast = true;
    const toastShown = new Promise((resolve) => {
      globalThis.addEventListener("super-daemon-toast-show", resolve, {
        once: true,
      });
    });
    const spoken = el.speak("I am completely operational");
    const event = await toastShown;
    expect(event.detail.text).to.equal("I am completely operational");
    expect(event.detail.merlin).to.be.true;
    expect(event.detail.accentColor).to.equal("purple");
    expect(event.detail.duration).to.equal(4000);
    expect(event.detail.alwaysvisible).to.be.false;
    expect(event.detail.awaitingMerlinInput).to.be.true;
    el.utter.onend(new Event("end"));
    await spoken;
  });

  it("hides the toast on utterance end when not awaiting input", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    el.synth = { speak: () => {} };
    const toastHidden = new Promise((resolve) => {
      globalThis.addEventListener("super-daemon-toast-hide", resolve, {
        once: true,
      });
    });
    const spoken = el.speak("goodbye", false, false);
    el.utter.onend(new Event("end"));
    const event = await toastHidden;
    expect(event.detail).to.be.false;
    await spoken;
  });

  it("sets and resets the HAXCMS cursor around speech", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const calls = [];
    globalThis.HAXCMS = {
      instance: {
        setCursor: (value) => calls.push(["setCursor", value]),
        setFavicon: (value) => calls.push(["setFavicon", value]),
        resetCursor: () => calls.push(["resetCursor"]),
        resetFavicon: () => calls.push(["resetFavicon"]),
      },
    };
    try {
      el.synth = { speak: () => {} };
      const spoken = el.speak("open the pod bay doors");
      el.utter.onend(new Event("end"));
      await spoken;
    } finally {
      delete globalThis.HAXCMS;
    }
    expect(calls).to.deep.equal([
      ["setCursor", "hax:wizard-hat"],
      ["setFavicon", "hax:wizard-hat"],
      ["resetCursor"],
      ["resetFavicon"],
    ]);
  });

  it("setToast dispatches the show event directly", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const toastShown = new Promise((resolve) => {
      globalThis.addEventListener("super-daemon-toast-show", resolve, {
        once: true,
      });
    });
    el.setToast("all systems nominal", true, false);
    const event = await toastShown;
    expect(event.detail.text).to.equal("all systems nominal");
    expect(event.detail.alwaysvisible).to.be.true;
    expect(event.detail.awaitingMerlinInput).to.be.false;
  });
});

describe("hal-9000 property change handlers", () => {
  it("routes new commands to annyang", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const stub = new AnnyangStub();
    el.annyang = stub;
    el.commands = { hello: () => {} };
    await settle(el);
    expect(stub.removeCommandsCalls).to.equal(1);
    expect(stub.addCommandsArgs.length).to.equal(1);
    expect(Object.keys(stub.addCommandsArgs[0])).to.deep.equal(["hello"]);
  });

  it("is a no-op for commands when annyang is not loaded", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    expect(() => {
      el.addCommands({ hello: () => {} });
    }).to.not.throw();
  });

  it("moves the *anything command to the end of the list", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const stub = new AnnyangStub();
    el.annyang = stub;
    el.addCommands({
      b: () => {},
      "*anything": () => {},
      a: () => {},
    });
    const keys = Object.keys(stub.addCommandsArgs[0]);
    expect(keys[keys.length - 1]).to.equal("*anything");
  });

  it("rebuilds and saves commands when respondsTo changes", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    // detach first so the constructor's global es-bridge listener is aborted;
    // otherwise a late annyang dispatch can clobber our stub mid-test
    el.remove();
    const stub = new AnnyangStub();
    el.annyang = stub;
    el.commands = { "(merlin) hello": () => {}, plain: () => {} };
    await settle(el);
    stub.removeCommandsCalls = 0;
    el.respondsTo = "hal";
    await settle(el);
    // the re-keyed commands object is saved back and re-registered: once
    // from the rename and once from the commands change handler
    expect(stub.removeCommandsCalls).to.equal(2);
    expect(Object.keys(el.commands)).to.deep.equal(["hal hello", "plain"]);
    expect(
      stub.addCommandsArgs[stub.addCommandsArgs.length - 1],
    ).to.deep.equal(el.commands);
  });

  it("starts with autoRestart and continuous when auto is enabled", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const stub = new AnnyangStub();
    el.annyang = stub;
    el.auto = true;
    await settle(el);
    expect(el.enabled).to.be.true;
    expect(stub.startArgs).to.deep.equal([
      { autoRestart: true, continuous: true },
    ]);
  });

  it("starts plain when enabled without auto", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const stub = new AnnyangStub();
    el.annyang = stub;
    el.enabled = true;
    await settle(el);
    expect(stub.startArgs.length).to.equal(1);
    expect(stub.startArgs[0]).to.be.undefined;
  });

  it("aborts annyang when disabled", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const stub = new AnnyangStub();
    el.annyang = stub;
    el.enabled = true;
    await settle(el);
    el.enabled = false;
    await settle(el);
    expect(stub.abortCalls).to.equal(1);
  });

  it("forwards debug changes to annyang", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const stub = new AnnyangStub();
    el.annyang = stub;
    el.debug = true;
    await settle(el);
    expect(stub.debugCalls).to.deep.equal([true]);
  });
});

describe("hal-9000 _annyangLoaded", () => {
  it("registers commands and announces itself when annyang is present", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const stub = new AnnyangStub();
    const originalAnnyang = globalThis.annyang;
    globalThis.annyang = stub;
    const online = new Promise((resolve) => {
      el.addEventListener("hal-9000-online", resolve, { once: true });
    });
    try {
      dispatchBridgeEvent();
    } finally {
      globalThis.annyang = originalAnnyang;
    }
    expect(el.annyang).to.equal(stub);
    expect(stub.addCommandsArgs).to.include(el.commands);
    expect(stub.debugCalls).to.include(false);
    // auto and enabled are both off, so it must not start
    expect(stub.startArgs.length).to.equal(0);
    expect(await online).to.exist;
  });

  it("starts automatically when auto is set at load time", async () => {
    const el = await fixture(html`<hal-9000 auto></hal-9000>`);
    const stub = new AnnyangStub();
    const originalAnnyang = globalThis.annyang;
    globalThis.annyang = stub;
    try {
      dispatchBridgeEvent();
    } finally {
      globalThis.annyang = originalAnnyang;
    }
    expect(stub.startArgs).to.deep.equal([
      { autoRestart: true, continuous: true },
    ]);
  });

  it("starts once when enabled without auto", async () => {
    const el = await fixture(html`<hal-9000 enabled></hal-9000>`);
    const stub = new AnnyangStub();
    const originalAnnyang = globalThis.annyang;
    globalThis.annyang = stub;
    try {
      dispatchBridgeEvent();
    } finally {
      globalThis.annyang = originalAnnyang;
    }
    expect(stub.startArgs.length).to.equal(1);
    expect(stub.startArgs[0]).to.be.undefined;
  });

  it("does nothing when annyang is not defined", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const originalAnnyang = globalThis.annyang;
    globalThis.annyang = undefined;
    let onlineFired = false;
    el.addEventListener("hal-9000-online", () => {
      onlineFired = true;
    }, { once: true });
    try {
      dispatchBridgeEvent();
    } finally {
      globalThis.annyang = originalAnnyang;
    }
    expect(el.annyang).to.be.undefined;
    expect(onlineFired).to.be.false;
  });

  it("stops listening after the element is disconnected", async () => {
    const el = globalThis.document.createElement("hal-9000");
    globalThis.document.body.appendChild(el);
    el.remove();
    const marker = new AnnyangStub();
    const originalAnnyang = globalThis.annyang;
    globalThis.annyang = marker;
    try {
      dispatchBridgeEvent();
    } finally {
      globalThis.annyang = originalAnnyang;
    }
    expect(el.annyang).to.not.equal(marker);
  });
});

describe("hal-9000 es-global-bridge integration", () => {
  it("loads annyang through the bridge and wires the real lib up", async () => {
    const store = ESGlobalBridgeStore;
    expect(store).to.exist;
    const started = Date.now();
    while (store.imports.annyang !== true && Date.now() - started < 3000) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    expect(store.imports.annyang).to.equal(true);
    expect(globalThis.annyang).to.exist;
    expect(globalThis.annyang.addCommands).to.be.a("function");
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const online = new Promise((resolve) => {
      el.addEventListener("hal-9000-online", resolve, { once: true });
    });
    // re-deliver the bridge event deterministically against the real lib
    dispatchBridgeEvent();
    expect(el.annyang).to.equal(globalThis.annyang);
    await online;
  });

  it("covers the bridge success path with a fresh script load", async () => {
    const store = ESGlobalBridgeStore;
    const fired = new Promise((resolve) => {
      globalThis.addEventListener("es-bridge-fresh-test-loaded", resolve, {
        once: true,
      });
    });
    const location = "data:text/javascript,void 0;";
    const result = await store.load("fresh-test", location);
    expect(result).to.equal(location);
    expect(store.imports["fresh-test"]).to.equal(true);
    expect(await fired).to.exist;
  });

  it("covers the bridge failure path and records false", async () => {
    const store = ESGlobalBridgeStore;
    const failPromise = store.load(
      "bad-test",
      "https://nonexistent.invalid/nope.js",
    );
    setTimeout(() => {
      const script = globalThis.document.querySelector(
        'script[data-name="bad-test"]',
      );
      if (script && script.onerror) {
        script.onerror();
      }
    }, 10);
    await failPromise.catch((error) => {
      expect(error.message).to.include("Failed to load bad-test");
    });
    expect(store.imports["bad-test"]).to.equal(false);
  });

  it("uses the import alias as well as load", async () => {
    const store = ESGlobalBridgeStore;
    store.imports["alias-probe"] = true;
    expect(
      await store.import("alias-probe", "data:text/javascript,void 0;"),
    ).to.equal(true);
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("hal-9000 passes accessibility test", async () => {
    const el = await fixture(html` <hal-9000></hal-9000> `);
    await expect(el).to.be.accessible();
  });
  it("hal-9000 passes accessibility negation", async () => {
    const el = await fixture(
      html`<hal-9000 aria-labelledby="hal-9000"></hal-9000>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("hal-9000 can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<hal-9000 .foo=${'bar'}></hal-9000>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<hal-9000 ></hal-9000>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<hal-9000></hal-9000>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<hal-9000></hal-9000>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
