import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-collapse.js";
import { XAPI_VERBS } from "@haxtheweb/user-action/lib/xapi.js";

const listen = (el) => {
  const seen = [];
  el.addEventListener("user-engagement", (e) => seen.push(e.detail));
  return seen;
};

describe("a11y-collapse learner data", () => {
  it("records the first time a learner opens the content", async () => {
    const el = await fixture(html`
      <a11y-collapse heading="What is a cell?">
        <p>The smallest unit of life.</p>
      </a11y-collapse>
    `);
    const seen = listen(el);
    el._onClick();
    el._onClick();
    el._onClick();
    expect(seen.length).to.equal(1);
    const s = seen[0].statement;
    expect(seen[0].activityDisplay).to.equal("experienced");
    expect(s.verb.id).to.equal(XAPI_VERBS.experienced);
    expect(Object.values(s.object.definition.name)[0]).to.equal(
      "What is a cell?",
    );
    // opening it is what makes it done
    expect(s.result).to.deep.equal({ completion: true });
    expect(seen[0].resultCompletion).to.equal(true);
  });

  it("counts toward the page while there is something to open", async () => {
    const closed = await fixture(html`
      <a11y-collapse heading="Closed"><p>x</p></a11y-collapse>
    `);
    expect(closed.xapiCountsTowardCompletion()).to.equal(true);
    closed._onClick();
    // opened by the learner: still an item, now done
    expect(closed.xapiCountsTowardCompletion()).to.equal(true);
    const open = await fixture(html`
      <a11y-collapse heading="Open" expanded><p>x</p></a11y-collapse>
    `);
    expect(open.xapiCountsTowardCompletion()).to.equal(false);
  });

  it("uses a slotted heading as the name", async () => {
    const el = await fixture(html`
      <a11y-collapse>
        <h3 slot="heading">Membranes</h3>
        <p>In and out.</p>
      </a11y-collapse>
    `);
    const seen = listen(el);
    el._onClick();
    expect(Object.values(seen[0].statement.object.definition.name)[0]).to.equal(
      "Membranes",
    );
  });

  it("does not record an author's default of expanded", async () => {
    const seen = [];
    const handler = (e) => seen.push(e.detail);
    globalThis.addEventListener("user-engagement", handler);
    const el = await fixture(html`
      <a11y-collapse expanded heading="Open by default"><p>x</p></a11y-collapse>
    `);
    await el.updateComplete;
    globalThis.removeEventListener("user-engagement", handler);
    expect(seen.length).to.equal(0);
  });

  it("records nothing while HAX is editing or when disabled", async () => {
    const el = await fixture(html`
      <a11y-collapse heading="Editing"><p>x</p></a11y-collapse>
    `);
    const seen = listen(el);
    el.haxeditModeChanged(true);
    el._onClick();
    expect(seen.length).to.equal(0);
    const off = await fixture(html`
      <a11y-collapse disabled heading="Off"><p>x</p></a11y-collapse>
    `);
    const seenOff = listen(off);
    off._onClick();
    expect(seenOff.length).to.equal(0);
  });

  it("ignores collapses that are part of another element's interface", async () => {
    const host = await fixture(html`<div></div>`);
    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `<a11y-collapse heading="Settings"><p>x</p></a11y-collapse>`;
    const inner = root.querySelector("a11y-collapse");
    await inner.updateComplete;
    const seen = listen(inner);
    inner._onClick();
    expect(inner.expanded).to.equal(true);
    expect(seen.length).to.equal(0);
  });
});
