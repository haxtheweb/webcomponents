import { fixture, fixtureCleanup, expect, html } from "@open-wc/testing";

import "../bullet-check-list.js";
import { BulletCheckList, bulletCheckListHash } from "../bullet-check-list.js";

const ITEMS = [
  { label: "One" },
  { label: "Two" },
  { label: "Three", disabled: true },
  { label: "Four", checked: true },
];

const clear = () => {
  try {
    Object.keys(globalThis.localStorage)
      .filter((k) => k.startsWith("bullet-check-list:"))
      .forEach((k) => globalThis.localStorage.removeItem(k));
  } catch {
    // ignore
  }
};

describe("bullet-check-list test", () => {
  let element;
  beforeEach(async () => {
    clear();
    element = await fixture(
      html`<bullet-check-list
        title="Steps"
        storage-id="t1"
        .items="${ITEMS}"
      ></bullet-check-list>`,
    );
  });
  afterEach(clear);

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders native checkboxes in a labelled group", () => {
    const group = element.shadowRoot.querySelector('[role="group"]');
    expect(group.getAttribute("aria-labelledby")).to.equal("title");
    const boxes = element.shadowRoot.querySelectorAll('input[type="checkbox"]');
    expect(boxes.length).to.equal(4);
    boxes.forEach((b) => {
      expect(b.closest("label")).to.exist;
    });
  });

  it("falls back to aria-label when there is no title", async () => {
    const el = await fixture(
      html`<bullet-check-list .items="${ITEMS}"></bullet-check-list>`,
    );
    const group = el.shadowRoot.querySelector('[role="group"]');
    expect(group.getAttribute("aria-label")).to.equal("Checklist");
    expect(group.hasAttribute("aria-labelledby")).to.be.false;
  });

  it("locks checked and disabled items", () => {
    const boxes = element.shadowRoot.querySelectorAll("input");
    expect(boxes[0].disabled).to.be.false;
    expect(boxes[2].disabled).to.be.true;
    expect(boxes[3].disabled).to.be.true;
    expect(boxes[3].checked).to.be.true;
  });

  it("marks the first open item as the current step with visible text", () => {
    const lis = element.shadowRoot.querySelectorAll("li");
    expect(lis[0].getAttribute("aria-current")).to.equal("step");
    expect(lis[1].getAttribute("aria-current")).to.equal("false");
    expect(lis[0].querySelector(".badge").textContent).to.equal("Current step");
  });

  it("toggling updates state, step, progress and storage", async () => {
    const box = element.shadowRoot.querySelector("input");
    box.click();
    await element.updateComplete;
    expect(element._checked).to.deep.equal(["One"]);
    const lis = element.shadowRoot.querySelectorAll("li");
    expect(lis[1].getAttribute("aria-current")).to.equal("step");
    expect(
      element.shadowRoot.querySelector('[role="status"]').textContent.trim(),
    ).to.equal("2 of 4 complete");
    const saved = JSON.parse(
      globalThis.localStorage.getItem(
        `bullet-check-list:v1:${globalThis.location.pathname}:t1`,
      ),
    );
    expect(saved).to.deep.equal({ v: 1, checked: ["One"] });
  });

  it("can be operated by keyboard (space on a focused checkbox)", async () => {
    const box = element.shadowRoot.querySelector("input");
    box.focus();
    expect(element.shadowRoot.activeElement).to.equal(box);
    box.click(); // native checkbox maps Space to click
    await element.updateComplete;
    expect(box.checked).to.be.true;
  });

  it("restores state from storage on reload", async () => {
    element.shadowRoot.querySelector("input").click();
    await element.updateComplete;
    // simulate a page reload: the first instance goes away
    fixtureCleanup();
    const again = await fixture(
      html`<bullet-check-list
        title="Steps"
        storage-id="t1"
        .items="${ITEMS}"
      ></bullet-check-list>`,
    );
    expect(again._checked).to.deep.equal(["One"]);
    expect(again.shadowRoot.querySelector("input").checked).to.be.true;
  });

  it("emits progressed and completed user-engagement events", async () => {
    const events = [];
    element.addEventListener("user-engagement", (e) => events.push(e.detail));
    const boxes = element.shadowRoot.querySelectorAll("input");
    boxes[0].click();
    boxes[1].click();
    await element.updateComplete;
    expect(events.map((e) => e.activityDisplay)).to.deep.equal([
      "progressed",
      "progressed",
    ]);
    // checked + disabled items count as not completable, so completion needs
    // every item checked; use a fresh list with no locked items
    const el = await fixture(
      html`<bullet-check-list
        storage-id="t-complete"
        .items="${[{ label: "A" }]}"
      ></bullet-check-list>`,
    );
    const seen = [];
    el.addEventListener("user-engagement", (e) =>
      seen.push(e.detail.activityDisplay),
    );
    el.shadowRoot.querySelector("input").click();
    expect(seen).to.deep.equal(["progressed", "completed"]);
  });

  it("does not change state while in HAX edit mode and creates a storage-id", async () => {
    const el = await fixture(
      html`<bullet-check-list
        .items="${[{ label: "A" }]}"
      ></bullet-check-list>`,
    );
    el.haxeditModeChanged(true);
    await el.updateComplete;
    expect(el.storageId).to.match(/^bcl-/);
    expect(el.getAttribute("storage-id")).to.equal(el.storageId);
    const box = el.shadowRoot.querySelector("input");
    expect(box.disabled).to.be.true;
    box.click();
    expect(el._checked).to.deep.equal([]);
    el.haxeditModeChanged(false);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("input").disabled).to.be.false;
  });

  it("renders ol when ordered and ul otherwise", async () => {
    expect(element.shadowRoot.querySelector("ul")).to.exist;
    element.ordered = true;
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("ol")).to.exist;
  });

  it("shows the clipboard-pulse icon decoratively", () => {
    const icon = element.shadowRoot.querySelector("simple-icon");
    expect(icon.getAttribute("icon")).to.equal("hax:clipboard-pulse");
    expect(icon.getAttribute("aria-hidden")).to.equal("true");
  });
});

describe("bullet-check-list storage keys", () => {
  let element;
  const makeElement = async () => {
    element = await fixture(
      html`<bullet-check-list
        title="Steps"
        storage-id="t1"
        .items="${ITEMS}"
      ></bullet-check-list>`,
    );
    return element;
  };
  beforeEach(clear);
  afterEach(clear);

  it("hash is deterministic", () => {
    expect(bulletCheckListHash("abc")).to.equal(bulletCheckListHash("abc"));
    expect(bulletCheckListHash("abc")).to.not.equal(bulletCheckListHash("abd"));
  });

  it("identical lists on one page do not share a key, and the first is stable", async () => {
    const wrap = await fixture(
      html`<div>
        <bullet-check-list .items="${[{ label: "A" }]}"></bullet-check-list>
        <bullet-check-list .items="${[{ label: "A" }]}"></bullet-check-list>
        <bullet-check-list
          storage-id="x"
          .items="${[{ label: "A" }]}"
        ></bullet-check-list>
      </div>`,
    );
    const [a, b, c] = wrap.querySelectorAll("bullet-check-list");
    await Promise.all([a.updateComplete, b.updateComplete, c.updateComplete]);
    expect(a._storageKey).to.not.equal(b._storageKey);
    expect(b._storageKey.endsWith(":1")).to.be.true;
    expect(a._storageKey.endsWith(":1")).to.be.false;
    expect(c._storageKey).to.include(":x");
  });

  it("works when localStorage throws", async () => {
    const orig = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });
    try {
      const el = await fixture(
        html`<bullet-check-list
          .items="${[{ label: "A" }]}"
        ></bullet-check-list>`,
      );
      const box = el.shadowRoot.querySelector("input");
      box.click();
      await el.updateComplete;
      expect(box.checked).to.be.true;
      expect(el._checked).to.deep.equal(["A"]);
    } finally {
      if (orig) Object.defineProperty(globalThis, "localStorage", orig);
    }
  });

  it("ignores corrupt storage and unknown labels", async () => {
    const key = `bullet-check-list:v1:${globalThis.location.pathname}:bad`;
    globalThis.localStorage.setItem(key, "{not json");
    let el = await fixture(
      html`<bullet-check-list
        storage-id="bad"
        .items="${[{ label: "A" }]}"
      ></bullet-check-list>`,
    );
    expect(el._checked).to.deep.equal([]);
    fixtureCleanup();
    globalThis.localStorage.setItem(
      key,
      JSON.stringify({ v: 1, checked: ["A", "gone"] }),
    );
    el = await fixture(
      html`<bullet-check-list
        storage-id="bad"
        .items="${[{ label: "A" }]}"
      ></bullet-check-list>`,
    );
    expect(el._checked).to.deep.equal(["A"]);
  });

  it("has the OER typeof as a reflected property, not set after first render", async () => {
    await makeElement();
    expect(element.typeof).to.equal("oer:LearningComponent");
    expect(element.getAttribute("typeof")).to.equal("oer:LearningComponent");
  });

  it("writes the pre-checked state as an attribute so server output is right", async () => {
    await makeElement();
    // ?checked is what server side rendering can express; .checked is not
    const boxes = element.shadowRoot.querySelectorAll("input");
    expect(boxes[0].hasAttribute("checked")).to.be.false;
    expect(boxes[3].hasAttribute("checked")).to.be.true;
  });

  it("keeps the live checked state in step when the stored state changes after a click", async () => {
    await makeElement();
    // a clicked box no longer follows its checked attribute, so the element
    // has to set the property itself when the remembered state is replaced
    const boxes = () => element.shadowRoot.querySelectorAll("input");
    boxes()[0].click();
    await element.updateComplete;
    expect(boxes()[0].checked).to.be.true;
    element.storageId = "t2";
    await element.updateComplete;
    expect(boxes()[0].checked).to.be.false;
  });

  it("exposes tag and haxProperties", () => {
    expect(BulletCheckList.tag).to.equal("bullet-check-list");
    expect(BulletCheckList.haxProperties).to.include("haxProperties.json");
  });
});
