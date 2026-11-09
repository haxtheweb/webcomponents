// Coverage for the in-house speech listener that replaced annyang: the
// command phrase syntax, transcript clean up, echo detection, and the
// session life cycle against a fake SpeechRecognition engine (interim
// throttling, alternatives, restarts, blocked mic, phrase biasing and the
// on-device preference).
import { expect } from "@open-wc/testing";
import {
  Hal9000Listener,
  halCommandToRegExp,
  halCleanTranscript,
  halIsEcho,
  HAL_MAX_ALTERNATIVES,
} from "../lib/hal-9000-listener.js";

const frame = () => new Promise((resolve) => setTimeout(resolve, 40));

// a fake engine: records settings and lets tests drive its events
function fakeEngine(extra = {}) {
  const made = [];
  function FakeRecognition() {
    this.started = 0;
    this.aborted = 0;
    if (extra.phrasesField) {
      this.phrases = [];
    }
    if (extra.localField) {
      this.processLocally = false;
    }
    made.push(this);
  }
  FakeRecognition.prototype.start = function () {
    this.started += 1;
    if (this.onstart) {
      this.onstart();
    }
  };
  FakeRecognition.prototype.abort = function () {
    this.aborted += 1;
  };
  if (extra.available) {
    FakeRecognition.available = extra.available;
  }
  return { Ctor: FakeRecognition, made: made };
}

// a SpeechRecognitionEvent-shaped result list
function resultEvent(entries, resultIndex = 0) {
  const results = entries.map((entry) => {
    const list = entry.alternatives.map((t) => ({ transcript: t }));
    list.isFinal = !!entry.isFinal;
    return list;
  });
  return { resultIndex: resultIndex, results: results };
}

function listenerWith(engine, options = {}) {
  const listener = new Hal9000Listener(options);
  listener.Ctor = engine.Ctor;
  return listener;
}

describe("hal-9000 listener command syntax", () => {
  it("keeps the optional, named and splat phrase syntax", () => {
    expect(halCommandToRegExp("(hey) merlin").test("hey merlin")).to.be.true;
    expect(halCommandToRegExp("(hey) merlin").test("merlin")).to.be.true;
    expect(halCommandToRegExp("(hey) merlin").test("hey marilyn")).to.be.false;
    expect(halCommandToRegExp("scroll (to) top").test("Scroll top")).to.be.true;
    const named =
      halCommandToRegExp("(select) :element").exec("select paragraph");
    expect(named[1]).to.equal("paragraph");
    const splat = halCommandToRegExp("search for *term").exec(
      "search for big ideas",
    );
    expect(splat[1]).to.equal("big ideas");
    expect(halCommandToRegExp("*anything").test("whatever you like")).to.be
      .true;
  });

  it("escapes characters that mean something in a RegExp", () => {
    expect(halCommandToRegExp("what's new?").test("what's new?")).to.be.true;
    expect(halCommandToRegExp("a.b").test("axb")).to.be.false;
  });

  it("trims edge punctuation engines sometimes add", () => {
    expect(halCleanTranscript("  Upload a file. ")).to.equal("Upload a file");
    expect(halCleanTranscript("¿qué?")).to.equal("¿qué");
    expect(halCleanTranscript("")).to.equal("");
  });

  it("knows its own voice", () => {
    expect(halIsEcho("how can I help", "How can I help?")).to.be.true;
    expect(halIsEcho("can I help", "How can I help?")).to.be.true;
    expect(halIsEcho("upload a file", "How can I help?")).to.be.false;
    expect(halIsEcho("anything", "")).to.be.false;
  });
});

describe("hal-9000 listener matching", () => {
  it("tries every alternative before giving up", () => {
    const listener = new Hal9000Listener();
    let ran = "";
    listener.setCommands({ "close merlin": () => (ran = "close") });
    expect(listener.handleAlternatives(["clothes marlin", "close merlin"])).to
      .be.true;
    expect(ran).to.equal("close");
  });

  it("reports a miss with the cleaned alternatives", () => {
    let missed = null;
    const listener = new Hal9000Listener({
      onNoMatch: (alternatives) => (missed = alternatives),
    });
    listener.setCommands({ "close merlin": () => {} });
    expect(listener.handleAlternatives([" upload a file. ", ""])).to.be.false;
    expect(missed).to.deep.equal(["upload a file"]);
  });

  it("skips non-function commands", () => {
    const listener = new Hal9000Listener();
    listener.setCommands({ broken: "nope", fine: () => {} });
    expect(listener.commands.map((c) => c.phrase)).to.deep.equal(["fine"]);
  });
});

describe("hal-9000 listener sessions", () => {
  it("is unsupported without a recognition engine", () => {
    const listener = new Hal9000Listener();
    listener.Ctor = null;
    expect(listener.supported).to.be.false;
    expect(listener.start()).to.be.false;
  });

  it("asks the engine for interim text and alternatives", async () => {
    const engine = fakeEngine();
    const listener = listenerWith(engine, { lang: "fr-FR" });
    listener.start({ continuous: true });
    await frame();
    const rec = engine.made[0];
    expect(rec.lang).to.equal("fr-FR");
    expect(rec.continuous).to.be.true;
    expect(rec.interimResults).to.be.true;
    expect(rec.maxAlternatives).to.equal(HAL_MAX_ALTERNATIVES);
    expect(rec.started).to.equal(1);
    expect(listener.state).to.equal("listening");
    listener.abort();
    expect(rec.aborted).to.equal(1);
    expect(listener.state).to.equal("idle");
  });

  it("hands on interim text at most once a frame, latest wins", async () => {
    const engine = fakeEngine();
    const seen = [];
    const listener = listenerWith(engine, {
      onInterim: (text) => seen.push(text),
    });
    listener.start();
    await frame();
    const rec = engine.made[0];
    rec.onresult(resultEvent([{ alternatives: ["up"] }]));
    rec.onresult(resultEvent([{ alternatives: ["upload"] }]));
    rec.onresult(resultEvent([{ alternatives: ["upload a"] }]));
    await frame();
    expect(seen).to.deep.equal(["upload a"]);
    listener.abort();
  });

  it("runs commands from a final result", async () => {
    const engine = fakeEngine();
    let ran = false;
    const listener = listenerWith(engine);
    listener.setCommands({ "stop listening": () => (ran = true) });
    listener.start();
    await frame();
    engine.made[0].onresult(
      resultEvent([
        { alternatives: ["stop listing", "stop listening"], isFinal: true },
      ]),
    );
    expect(ran).to.be.true;
    listener.abort();
  });

  it("restarts after each session until aborted", async () => {
    const engine = fakeEngine();
    const listener = listenerWith(engine);
    listener.start();
    await frame();
    engine.made[0].onend();
    await new Promise((resolve) => setTimeout(resolve, 320));
    expect(engine.made.length).to.equal(2);
    listener.abort();
    engine.made[1].onend();
    await new Promise((resolve) => setTimeout(resolve, 320));
    expect(engine.made.length).to.equal(2);
  });

  it("stops for good when the mic is blocked", async () => {
    const engine = fakeEngine();
    const states = [];
    const listener = listenerWith(engine, {
      onStateChange: (state) => states.push(state),
    });
    listener.start();
    await frame();
    engine.made[0].onerror({ error: "not-allowed" });
    engine.made[0].onend();
    await new Promise((resolve) => setTimeout(resolve, 320));
    expect(engine.made.length).to.equal(1);
    expect(listener.state).to.equal("blocked");
    expect(states).to.deep.equal(["listening", "blocked"]);
  });

  it("biases toward phrases where the engine supports it", async () => {
    const engine = fakeEngine({ phrasesField: true });
    const prior = globalThis.SpeechRecognitionPhrase;
    globalThis.SpeechRecognitionPhrase = function (phrase, boost) {
      this.phrase = phrase;
      this.boost = boost;
    };
    try {
      const listener = listenerWith(engine);
      listener.setPhrases(["Upload a file", "Merlin"]);
      listener.start();
      await frame();
      expect(engine.made[0].phrases.map((p) => p.phrase)).to.deep.equal([
        "Upload a file",
        "Merlin",
      ]);
      // an engine that rejects biasing keeps working without it
      engine.made[0].onerror({ error: "phrases-not-supported" });
      expect(listener._phrasesRejected).to.be.true;
      listener.abort();
    } finally {
      globalThis.SpeechRecognitionPhrase = prior;
    }
  });

  it("prefers on-device recognition only when already installed", async () => {
    const asked = [];
    const engine = fakeEngine({
      localField: true,
      available: (options) => {
        asked.push(options);
        return Promise.resolve(
          options.langs[0] === "en-US" ? "available" : "downloadable",
        );
      },
    });
    const local = listenerWith(engine, { lang: "en-US" });
    local.start();
    await frame();
    expect(engine.made[0].processLocally).to.be.true;
    expect(local.onDevice).to.be.true;
    local.abort();
    const remote = listenerWith(engine, { lang: "de-DE" });
    remote.start();
    await frame();
    expect(engine.made[1].processLocally).to.be.false;
    expect(remote.onDevice).to.be.false;
    expect(asked[0]).to.deep.equal({ langs: ["en-US"], processLocally: true });
    remote.abort();
  });
});
