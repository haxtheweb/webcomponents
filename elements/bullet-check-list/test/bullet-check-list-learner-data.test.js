import { fixture, expect, html } from "@open-wc/testing";
import { executeServerCommand } from "@web/test-runner-commands";
import "../bullet-check-list.js";
import {
  XAPI_VERBS,
  XAPI_EXTENSIONS,
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const flush = (ms = 20) => new Promise((r) => setTimeout(r, ms));
const clear = () => {
  Object.keys(globalThis.localStorage)
    .filter((k) => k.indexOf("bullet-check-list:") === 0)
    .forEach((k) => globalThis.localStorage.removeItem(k));
};
const key = (id) =>
  `bullet-check-list:v1:${globalThis.location.pathname}:${id}`;

describe("bullet-check-list learner data", () => {
  beforeEach(clear);
  afterEach(clear);

  it("every statement passes the xAPI 1.0.3 conformance check", async () => {
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000b2",
        "https://example.org/",
      ),
    );
    try {
      const el = await fixture(
        html`<bullet-check-list
          title="Steps"
          storage-id="ld-conf"
          .items="${[{ label: "A" }, { label: "B" }]}"
        ></bullet-check-list>`,
      );
      const seen = [];
      el.addEventListener("user-engagement", (e) => seen.push(e.detail));
      el.shadowRoot.querySelectorAll("input").forEach((i) => i.click());
      expect(seen.length).to.equal(3);
      for (const d of seen) {
        const r = await executeServerCommand("xapi-validate", d.statement);
        expect(r.errors).to.deep.equal([]);
      }
    } finally {
      setActorProvider(null);
    }
  });

  it("ticks carry xAPI statements: progressed, then completed", async () => {
    const el = await fixture(
      html`<bullet-check-list
        id="steps"
        title="Steps"
        storage-id="ld1"
        .items="${[{ label: "A" }, { label: "B" }]}"
      ></bullet-check-list>`,
    );
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    const boxes = el.shadowRoot.querySelectorAll("input");
    boxes[0].click();
    boxes[1].click();
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "progressed",
      "progressed",
      "completed",
    ]);
    // old fields are still there
    expect(seen[0].resultScore).to.equal(0.5);
    const s = seen[2].statement;
    expect(s.verb.id).to.equal(XAPI_VERBS.completed);
    expect(s.object.id.endsWith("#steps")).to.equal(true);
    expect(s.result.completion).to.equal(true);
    expect(s.result.response).to.equal("A[,]B");
    expect(s.result.score).to.include({ raw: 2, max: 2 });
    // backwards compatible: its own key is still written
    expect(
      JSON.parse(globalThis.localStorage.getItem(key("ld1"))).checked,
    ).to.deep.equal(["A", "B"]);
  });

  it("announces ticks saved under the old key once, for import", async () => {
    globalThis.localStorage.setItem(
      key("ld2"),
      JSON.stringify({ v: 1, checked: ["A"] }),
    );
    const imports = [];
    const h = (e) => imports.push(e.detail.statement);
    globalThis.addEventListener("learner-progress-import", h);
    const el = await fixture(
      html`<bullet-check-list
        storage-id="ld2"
        .items="${[{ label: "A" }, { label: "B" }]}"
      ></bullet-check-list>`,
    );
    await flush();
    el.title = "Renamed";
    await el.updateComplete;
    await flush();
    globalThis.removeEventListener("learner-progress-import", h);
    expect(imports.length).to.equal(1);
    expect(imports[0].verb.id).to.equal(XAPI_VERBS.progressed);
    expect(imports[0].context.extensions[XAPI_EXTENSIONS.imported]).to.equal(
      true,
    );
    expect(imports[0].result.response).to.equal("A");
  });

  it("reads ticks back from the profile when its own key is empty", async () => {
    const h = (e) => {
      e.detail.record = { response: "B", done: false };
    };
    globalThis.addEventListener("learner-progress-request", h);
    const el = await fixture(
      html`<bullet-check-list
        storage-id="ld3"
        .items="${[{ label: "A" }, { label: "B" }]}"
      ></bullet-check-list>`,
    );
    await flush();
    await el.updateComplete;
    globalThis.removeEventListener("learner-progress-request", h);
    const boxes = el.shadowRoot.querySelectorAll("input");
    expect(boxes[0].checked).to.equal(false);
    expect(boxes[1].checked).to.equal(true);
    expect(
      JSON.parse(globalThis.localStorage.getItem(key("ld3"))).checked,
    ).to.deep.equal(["B"]);
  });

  it("empties its ticks when progress is cleared", async () => {
    const el = await fixture(
      html`<bullet-check-list
        storage-id="ld4"
        .items="${[{ label: "A" }]}"
      ></bullet-check-list>`,
    );
    el.shadowRoot.querySelector("input").click();
    await el.updateComplete;
    globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("input").checked).to.equal(false);
  });
});
