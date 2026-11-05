import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { zipSync, strToU8 } from "fflate";
import "../h5p-element.js";
import {
  H5PXapiBridge,
  H5P_XAPI_MAX_PER_MINUTE,
  h5pStatement,
  isH5PSubContent,
} from "../lib/h5p-xapi-bridge.js";

const ADL = "http://adlnet.gov/expapi/verbs/";
// the shape H5P sends
const h5p = (verb, extra = {}) => ({
  actor: { name: "someone", mbox: "mailto:someone@example.com" },
  verb: { id: ADL + verb, display: { "en-US": verb } },
  object: {
    id: "https://example.com/h5p/embed/12",
    objectType: "Activity",
    definition: {
      name: { "en-US": "Waves quiz" },
      interactionType: "choice",
      choices: [
        { id: "0", description: { "en-US": "Light" } },
        { id: "1", description: { "en-US": "Sound" } },
      ],
      correctResponsesPattern: ["0"],
    },
    ...(extra.object || {}),
  },
  context: extra.context || {},
  result: extra.result,
});

describe("h5p xAPI bridge filter", () => {
  let el;
  let seen;
  let bridge;
  beforeEach(async () => {
    el = await fixture(
      html`<h5p-element id="waves" source="waves.h5p"></h5p-element>`,
    );
    seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    bridge = new H5PXapiBridge(el);
  });

  it("recognises sub-content statements", () => {
    expect(isH5PSubContent(h5p("answered"))).to.equal(false);
    expect(
      isH5PSubContent(
        h5p("answered", {
          object: { id: "https://example.com/h5p/embed/12?subContentId=ab" },
        }),
      ),
    ).to.equal(true);
    expect(
      isH5PSubContent(
        h5p("answered", {
          context: {
            contextActivities: { parent: [{ id: "https://example.com/x" }] },
          },
        }),
      ),
    ).to.equal(true);
  });

  it("rebuilds the result as a HAX statement about the element", () => {
    const s = h5pStatement(
      el,
      h5p("answered", {
        result: {
          success: true,
          completion: true,
          response: "0",
          score: { raw: 1, min: 0, max: 1, scaled: 1 },
          duration: "PT12.5S",
        },
      }),
    );
    expect(s.verb.id).to.equal(ADL + "answered");
    expect(s.object.id).to.not.equal("https://example.com/h5p/embed/12");
    expect(s.object.id).to.contain("#");
    expect(Object.values(s.object.definition.name)[0]).to.equal("Waves quiz");
    expect(s.object.definition.interactionType).to.equal("choice");
    expect(s.object.definition.choices).to.have.length(2);
    expect(s.result).to.include({ success: true, completion: true });
    expect(s.result.score.scaled).to.equal(1);
    expect(s.result.duration).to.equal("PT12.5S");
    // H5P's own actor (an email) is never passed on
    expect(JSON.stringify(s)).to.not.contain("mailto:");
    expect(
      s.context.extensions["https://haxtheweb.org/xapi/extensions/element"],
    ).to.equal("h5p-element");
  });

  it("forwards only top level attempted, answered and completed", () => {
    [
      "interacted",
      "progressed",
      "passed",
      "failed",
      "experienced",
      "initialized",
    ].forEach((v) => expect(bridge.receive(h5p(v))).to.equal(null));
    expect(
      bridge.receive(
        h5p("answered", {
          object: { id: "https://example.com/h5p/embed/12?subContentId=q1" },
        }),
      ),
    ).to.equal(null);
    bridge.receive(h5p("attempted"));
    bridge.receive(h5p("attempted"));
    bridge.receive(h5p("answered", { result: { success: false } }));
    bridge.receive(h5p("completed", { result: { success: true } }));
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "attempted",
      "answered",
      "completed",
    ]);
    expect(seen[2].statement.result.completion).to.equal(true);
    expect(seen[2].resultSuccess).to.equal(true);
  });

  it("drops an immediate repeat and caps statements per minute", () => {
    const answer = (raw) =>
      h5p("answered", { result: { score: { raw, min: 0, max: 20 } } });
    bridge.receive(answer(1));
    bridge.receive(answer(1));
    expect(seen.length).to.equal(1);
    for (let i = 2; i < 40; i++) {
      bridge.receive(answer(i));
    }
    expect(seen.length).to.equal(H5P_XAPI_MAX_PER_MINUTE);
  });
});

// a tiny H5P library that reports through H5P's own dispatcher, the way
// real content does
const NOISY_JS = `
H5P.Noisy = (function () {
  function Noisy() {}
  Noisy.prototype.attach = function ($container) {
    $container.addClass("noisy-ran");
  };
  return Noisy;
})();`;

function noisyPackage() {
  return zipSync({
    "h5p.json": strToU8(
      JSON.stringify({
        title: "Noisy",
        mainLibrary: "H5P.Noisy",
        preloadedDependencies: [
          { machineName: "H5P.Noisy", majorVersion: 1, minorVersion: 0 },
        ],
      }),
    ),
    "content/content.json": strToU8("{}"),
    "H5P.Noisy-1.0/library.json": strToU8(
      JSON.stringify({
        title: "Noisy",
        machineName: "H5P.Noisy",
        majorVersion: 1,
        minorVersion: 0,
        runnable: 1,
        preloadedJs: [{ path: "noisy.js" }],
      }),
    ),
    "H5P.Noisy-1.0/noisy.js": strToU8(NOISY_JS),
  });
}

describe("h5p-element forwarding its content's xAPI", () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("listens to the content frame and forwards only what passes", async () => {
    globalThis.fetch = async (url, ...rest) =>
      String(url).endsWith(".h5p")
        ? new Response(noisyPackage(), { status: 200 })
        : realFetch(url, ...rest);
    const el = await fixture(
      html`<h5p-element source="noisy.h5p"></h5p-element>`,
    );
    await oneEvent(el, "h5p-package-loaded");
    const frame = el.querySelector("iframe.h5p-iframe");
    await waitUntil(
      () => frame.contentDocument.querySelector(".noisy-ran"),
      "content attached",
    );
    await waitUntil(() => el.xapiBridge._detach, "bridge attached");
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    const dispatcher = frame.contentWindow.H5P.externalDispatcher;
    // a burst like real content: clicks, a sub-question, then the result
    for (let i = 0; i < 25; i++) {
      dispatcher.trigger("xAPI", { statement: h5p("interacted") });
    }
    dispatcher.trigger("xAPI", {
      statement: h5p("answered", {
        object: { id: "https://example.com/h5p/embed/12?subContentId=q1" },
      }),
    });
    dispatcher.trigger("xAPI", {
      statement: h5p("completed", { result: { success: true } }),
    });
    dispatcher.trigger("xAPI", {
      statement: h5p("passed", { result: { success: true } }),
    });
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal(["completed"]);
    // detaching (done on source change, dispose and removal) stops
    // listening; the frame stays so H5P can still trigger into it
    el.xapiBridge.detach();
    dispatcher.trigger("xAPI", {
      statement: h5p("answered", { result: { success: true } }),
    });
    expect(seen.length).to.equal(1);
  });
});
