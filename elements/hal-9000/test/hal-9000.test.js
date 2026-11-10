import { fixture, expect, html } from "@open-wc/testing";

import "../hal-9000.js";
import { Hal9000, HAL9000Instance } from "../hal-9000.js";

// settle helper: let Lit finish the current update plus any update
// scheduled from inside the updated() hook (e.g. auto -> enabled)
async function settle(el) {
  await el.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
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

describe("hal-9000 speech that is cut off", () => {
  it("resolves when speech is cut off instead of ending", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    el.synth = { speak: () => {} };
    const spoken = el.speak("I'm sorry dave");
    expect(el.speaking).to.be.true;
    el.utter.onerror(new Event("error"));
    await spoken;
    expect(el.speaking).to.be.false;
  });
});

// a stand-in listener so these tests never touch the microphone
function stubListener(el) {
  const calls = { start: [], abort: 0 };
  el.listener.start = (options) => calls.start.push(options);
  el.listener.abort = () => {
    calls.abort += 1;
  };
  return calls;
}

describe("hal-9000 commands and listening", () => {
  it("routes commands to the listener, splat commands last", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const noop = () => {};
    el.commands = { "*anything": noop, "(hey) merlin": noop, scroll: noop };
    await settle(el);
    expect(el.listener.commands.map((c) => c.phrase)).to.deep.equal([
      "(hey) merlin",
      "scroll",
      "*anything",
    ]);
  });

  it("rebuilds commands when respondsTo changes", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const noop = () => {};
    el.commands = { "(merlin) go": noop, other: noop };
    await settle(el);
    el.respondsTo = "(hal)";
    await settle(el);
    expect(Object.keys(el.commands)).to.deep.equal(["(hal) go", "other"]);
    expect(el.listener.commands[0].phrase).to.equal("(hal) go");
  });

  it("starts continuous when auto is on and plain when only enabled", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    const calls = stubListener(el);
    el.enabled = true;
    await settle(el);
    expect(calls.start[0]).to.deep.equal({ continuous: false });
    el.enabled = false;
    await settle(el);
    expect(calls.abort).to.equal(1);
    el.auto = true;
    await settle(el);
    expect(calls.start[1]).to.deep.equal({ continuous: true });
  });

  it("forwards debug, language and phrases to the listener", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    el.debug = true;
    el.language = "es-ES";
    el.phrases = ["Upload a file", "upload a file", "Merlin"];
    await settle(el);
    expect(el.listener.debug).to.be.true;
    expect(el.listener.lang).to.equal("es-ES");
    // de-duplicated, case-insensitive
    expect(el.listener.phrases).to.deep.equal(["Upload a file", "Merlin"]);
  });

  it("runs a command and reports it", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    let selected = null;
    el.commands = { "(select) :element": (name) => (selected = name) };
    await settle(el);
    const matched = new Promise((resolve) =>
      el.addEventListener("hal-9000-matched", resolve, { once: true }),
    );
    el.listener.handleAlternatives(["select paragraph"]);
    const event = await matched;
    expect(selected).to.equal("paragraph");
    expect(event.detail.phrase).to.equal("(select) :element");
  });

  it("reports speech no command took, with every alternative", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    el.commands = { "close merlin": () => {} };
    await settle(el);
    const missed = new Promise((resolve) =>
      el.addEventListener("hal-9000-no-match", resolve, { once: true }),
    );
    el.listener.handleAlternatives(["upload a file", "upload a mile"]);
    const event = await missed;
    expect(event.detail.alternatives).to.deep.equal([
      "upload a file",
      "upload a mile",
    ]);
  });

  it("ignores its own voice while speaking", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    let ran = false;
    el.commands = { "*anything": () => (ran = true) };
    await settle(el);
    el.synth = { speak: () => {}, cancel: () => {} };
    const spoken = el.speak("How can I help?");
    expect(el.listener.handleAlternatives(["how can I help"])).to.be.false;
    expect(ran).to.be.false;
    el.utter.onend(new Event("end"));
    await spoken;
  });

  it("stops listening and reports when speech is unavailable", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    stubListener(el);
    el.enabled = true;
    await settle(el);
    const reported = new Promise((resolve) =>
      el.addEventListener("hal-9000-listening-state", resolve, { once: true }),
    );
    el.listener.unavailable = true;
    el.listener._setState("unavailable");
    const event = await reported;
    expect(event.detail.state).to.equal("unavailable");
    expect(el.enabled).to.be.false;
    expect(el.canListen).to.be.false;
  });

  it("stops talking when someone talks over it", async () => {
    const el = await fixture(html`<hal-9000></hal-9000>`);
    let cancelled = 0;
    el.synth = {
      speak: () => {},
      cancel: () => {
        cancelled += 1;
      },
    };
    const spoken = el.speak("Here is a very long answer");
    el._bargeIn("very long answer");
    expect(cancelled).to.equal(0);
    el._bargeIn("upload a file");
    expect(cancelled).to.equal(1);
    el.utter.onend(new Event("end"));
    await spoken;
  });
});
