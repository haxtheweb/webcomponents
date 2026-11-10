// Merlin's spoken search end to end inside super-daemon, with the speech
// engine stubbed out: what runs, what asks, what searches, the navigation
// grammar, help, live words in the voice card, programs, and Santa mode.
import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../super-daemon.js";
import { merlinVoiceEntries } from "../lib/merlin-voice-match.js";

const ITEMS = [
  {
    title: "Upload a file",
    index: "upload a file",
    tags: ["help"],
    value: {},
    eventName: "voice-test-upload",
    context: ["*"],
  },
  {
    title: "Edit title",
    index: "edit title",
    voice: "edit title",
    value: {},
    eventName: "voice-test-title",
    context: ["*"],
  },
  {
    title: "Edit description",
    index: "edit description",
    value: {},
    eventName: "voice-test-description",
    context: ["*"],
  },
];

async function merlin() {
  const el = await fixture(html`<super-daemon></super-daemon>`);
  el.hal = {
    setToast() {},
    speak: () => Promise.resolve(),
    commands: {},
    phrases: [],
  };
  el.items = ITEMS.slice();
  el._voiceEntries = merlinVoiceEntries(el.items, el._voiceVocabulary());
  el.opened = true;
  el.listeningForInput = true;
  await el.updateComplete;
  const ui = el._ui();
  ui.loading = false;
  await aTimeout(350);
  return el;
}

const ran = (name) =>
  new Promise((resolve) =>
    globalThis.addEventListener(name, () => resolve(true), { once: true }),
  );

describe("super-daemon spoken search", () => {
  let el;
  beforeEach(async () => {
    el = await merlin();
  });
  afterEach(() => {
    el.listeningForInput = false;
    el.voiceRanked = null;
  });

  it("runs a clear answer and stops listening", async () => {
    const upload = ran("voice-test-upload");
    await el._voiceHeard(["upload a file"]);
    expect(await upload).to.be.true;
    expect(el.listeningForInput).to.be.false;
  });

  it("uses a lesser alternative the engine offered", async () => {
    const upload = ran("voice-test-upload");
    await el._voiceHeard(["upload a pile", "upload a file"]);
    expect(await upload).to.be.true;
  });

  it("asks when more than one command fits, and keeps listening", async () => {
    await el._voiceHeard(["edit"]);
    expect(el.voiceRanked.map((i) => i.title)).to.have.members([
      "Edit title",
      "Edit description",
    ]);
    expect(el.listeningForInput).to.be.true;
    const toast = el.toastInstance;
    expect(toast.heard).to.equal("edit");
    expect(toast.hint).to.contain("?");
    expect(toast.hintSay).to.equal("run");
    expect(el._ui().voiceSelectedIndex).to.equal(0);
  });

  it("runs a result by number after asking", async () => {
    await el._voiceHeard(["edit"]);
    await aTimeout(300);
    const second = el._ui().filtered[1].eventName;
    const done = ran(second);
    await el._voiceHeard(["second one"]);
    expect(await done).to.be.true;
    expect(el.listeningForInput).to.be.false;
  });

  it("moves with next and runs the highlight with run", async () => {
    await el._voiceHeard(["edit"]);
    await aTimeout(300);
    await el._voiceHeard(["next"]);
    expect(el._ui().voiceSelectedIndex).to.equal(1);
    const done = ran(el._ui().filtered[1].eventName);
    await el._voiceHeard(["run"]);
    expect(await done).to.be.true;
  });

  it("says when a spoken number has no result", async () => {
    await el._voiceHeard(["number nine"]);
    expect(el.toastInstance.hint).to.contain("9");
    expect(el.listeningForInput).to.be.true;
  });

  it("searches with the words when nothing is close", async () => {
    await el._voiceHeard(["zebra crossing"]);
    expect(el.voiceRanked).to.equal(null);
    expect(el._ui().like).to.equal("zebra crossing");
    expect(el.listeningForInput).to.be.true;
    expect(el.toastInstance.heard).to.equal("zebra crossing");
    expect(el.toastInstance.hint).to.equal(el.t.voiceNoMatches);
  });

  it("starts over with clear", async () => {
    await el._voiceHeard(["edit"]);
    await el._voiceHeard(["start over"]);
    expect(el.voiceRanked).to.equal(null);
    expect(el._ui().like).to.equal("");
  });

  it("lists what can be said for help", async () => {
    await el._voiceHeard(["what can I say"]);
    const list = el.toastInstance.sayList.map((entry) => entry.say);
    expect(list).to.include.members(["second one", "next", "run", "clear"]);
    expect(list).to.include(el.t.sayStopListening);
  });

  it("shows words in the card while someone is still talking", () => {
    el._voiceInterim("upload a");
    expect(el.toastInstance.heard).to.equal("upload a");
  });

  it("rotates a tip each time listening starts", () => {
    el._voiceTip = 0;
    el._showVoiceTip();
    const first = el.toastInstance.hintSay;
    el._showVoiceTip();
    expect(el.toastInstance.hintSay).to.not.equal(first);
    expect(first).to.equal("second one");
  });

  it("puts a running program's words in the field and keeps listening", async () => {
    el.programName = "test-program";
    try {
      await el._voiceHeard(["mars rover"]);
      expect(el._ui().like).to.equal("mars rover");
      expect(el.listeningForInput).to.be.true;
      expect(el.toastInstance.heard).to.equal("mars rover");
      expect(el.toastInstance.hintSay).to.equal("second one");
    } finally {
      el.programName = null;
    }
  });

  it("picks a running program's numbered result by voice", async () => {
    // program results are numbered like any other; saying the number runs
    // it instead of searching the program for the words
    el.programName = "test-program";
    el.programResults = ITEMS.slice();
    try {
      await el.updateComplete;
      await aTimeout(350);
      const ui = el._ui();
      const second = ui.filtered[1].eventName;
      for (const said of ["Option 2", "option to", "the 2nd one"]) {
        // running a result closes Merlin and ends the program; start again
        el.programName = "test-program";
        el.programResults = ITEMS.slice();
        el.opened = true;
        el.listeningForInput = true;
        await el.updateComplete;
        await aTimeout(350);
        const done = ran(second);
        await el._voiceHeard([said]);
        expect(await done, said).to.be.true;
        expect(ui.like, said).to.not.equal(said);
      }
      el.programName = "test-program";
      el.programResults = ITEMS.slice();
      el.opened = true;
      el.listeningForInput = true;
      await el.updateComplete;
      await aTimeout(350);
      const third = ran(ui.filtered[2].eventName);
      await el._voiceHeard(["three"]);
      expect(await third).to.be.true;
    } finally {
      el.programName = null;
      el.programResults = [];
    }
  });

  it("only acts on a clear answer while closed in Santa mode", async () => {
    el.opened = false;
    await el._voiceHeard(["edit"]);
    expect(el.voiceRanked).to.equal(null);
    const upload = ran("voice-test-upload");
    await el._voiceHeard(["upload a file"]);
    expect(await upload).to.be.true;
  });

  it("ignores speech when not listening", async () => {
    el.listeningForInput = false;
    await el._voiceHeard(["edit"]);
    expect(el.voiceRanked).to.equal(null);
  });
});
