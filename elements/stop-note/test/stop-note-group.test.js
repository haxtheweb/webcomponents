import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../lib/stop-note-group.js";

const visible = (el) => el.getBoundingClientRect().height > 0;

describe("stop-note-group", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <stop-note-group label="Tips">
        <stop-note status="tip" title="First tip">
          <p slot="message">One</p>
        </stop-note>
        <stop-note status="tip" title="Second tip">
          <p slot="message">Two</p>
        </stop-note>
        <stop-note status="new" title="Something new">
          <p slot="message">Three</p>
        </stop-note>
      </stop-note-group>
    `);
    await element.updateComplete;
  });

  it("shows one note at a time with a pager", async () => {
    const notes = element.notes;
    expect(notes.length).to.equal(3);
    expect(notes.map(visible)).to.deep.equal([true, false, false]);
    const count = element.shadowRoot.querySelector(".count");
    expect(count.textContent.trim()).to.equal("1 / 3");
  });

  it("goes forward and back, wrapping at the ends", async () => {
    const [prev, next] = element.shadowRoot.querySelectorAll(".pager button");
    next.click();
    await element.updateComplete;
    expect(element.active).to.equal(1);
    expect(element.notes.map(visible)).to.deep.equal([false, true, false]);
    prev.click();
    prev.click();
    await element.updateComplete;
    expect(element.active).to.equal(2);
    expect(element.notes.map(visible)).to.deep.equal([false, false, true]);
    next.click();
    await element.updateComplete;
    expect(element.active).to.equal(0);
  });

  it("announces the note it moves to and fires a change event", async () => {
    const next = element.shadowRoot.querySelector('[data-go="1"]');
    setTimeout(() => next.click());
    const e = await oneEvent(element, "stop-note-group-change");
    expect(e.detail.active).to.equal(1);
    await element.updateComplete;
    const status = element.shadowRoot.querySelector('[role="status"]');
    expect(status.textContent).to.equal("2 of 3: Second tip");
  });

  it("names the group and its buttons", async () => {
    const group = element.shadowRoot.querySelector('[role="group"]');
    expect(group.getAttribute("aria-label")).to.equal("Tips");
    const labels = Array.from(
      element.shadowRoot.querySelectorAll(".pager button"),
    ).map((b) => b.getAttribute("aria-label"));
    expect(labels).to.deep.equal(["Previous note", "Next note"]);
  });

  it("leaves room in the note header for the pager", async () => {
    await element._place();
    const header =
      element.notes[0].shadowRoot.querySelector(".ddd-block-header");
    const pager = element.shadowRoot.querySelector(".pager");
    const h = header.getBoundingClientRect();
    const p = pager.getBoundingClientRect();
    // the pager sits inside the header row
    expect(p.top).to.be.at.least(h.top - 1);
    expect(p.bottom).to.be.at.most(h.bottom + 1);
    expect(parseFloat(getComputedStyle(header).paddingRight)).to.be.at.least(
      p.width,
    );
  });

  it("never writes to the host or the notes", async () => {
    element.next();
    await element.updateComplete;
    expect(element.getAttribute("style")).to.equal(null);
    element.notes.forEach((n) => {
      expect(n.hasAttribute("hidden")).to.equal(false);
      expect(n.getAttribute("style")).to.equal(null);
    });
  });

  it("shows every note while HAX is editing", async () => {
    element.haxeditModeChanged(true);
    await element.updateComplete;
    expect(element.notes.map(visible)).to.deep.equal([true, true, true]);
    expect(element.shadowRoot.querySelector(".pager")).to.equal(null);
    element.haxeditModeChanged(false);
    await element.updateComplete;
    expect(element.notes.map(visible)).to.deep.equal([true, false, false]);
  });

  it("has no pager with a single note", async () => {
    const el = await fixture(html`
      <stop-note-group>
        <stop-note status="tip" title="Only"></stop-note>
      </stop-note-group>
    `);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".pager")).to.equal(null);
    expect(visible(el.notes[0])).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
    await expect(element).to.be.accessible();
  });
});

describe("stop-note tip and new statuses", () => {
  it("map to their icons and labels", async () => {
    const tip = await fixture(
      html`<stop-note status="tip" title="A tip"></stop-note>`,
    );
    const fresh = await fixture(
      html`<stop-note status="new" title="Fresh"></stop-note>`,
    );
    await tip.updateComplete;
    await fresh.updateComplete;
    expect(tip.icon).to.equal("stopnoteicons:tip-icon");
    expect(fresh.icon).to.equal("stopnoteicons:new-icon");
    expect(
      tip.shadowRoot.querySelector(".status-label").textContent.trim(),
    ).to.equal("Did you know?");
    expect(
      fresh.shadowRoot.querySelector(".status-label").textContent.trim(),
    ).to.equal("What's new");
    await expect(tip).shadowDom.to.be.accessible();
    await expect(fresh).shadowDom.to.be.accessible();
  });

  it("derives the status from a tip or new icon", async () => {
    const el = await fixture(
      html`<stop-note icon="stopnoteicons:new-icon"></stop-note>`,
    );
    await el.updateComplete;
    expect(el.status).to.equal("new");
  });
});

describe("stop-note-group with other framed blocks", () => {
  it("stacks instruction cards and framed quotes with notes", async () => {
    await import("@haxtheweb/course-design/lib/learning-component.js");
    await import("@haxtheweb/course-design/lib/block-quote.js");
    const el = await fixture(html`
      <stop-note-group label="Before you start">
        <stop-note status="warning"><p slot="message">One</p></stop-note>
        <p>Not a member</p>
        <learning-component type="takeaways"><p>Two</p></learning-component>
        <block-quote>Plain quotes have no header to hold the pager</block-quote>
        <block-quote framed>Three</block-quote>
      </stop-note-group>
    `);
    await el.updateComplete;
    const notes = el.notes;
    expect(notes.map((n) => n.tagName.toLowerCase())).to.deep.equal([
      "stop-note",
      "learning-component",
      "block-quote",
    ]);
    expect(notes.map(visible)).to.deep.equal([true, false, false]);
    el.next();
    await el.updateComplete;
    expect(notes.map(visible)).to.deep.equal([false, true, false]);
    el.next();
    await el.updateComplete;
    expect(notes.map(visible)).to.deep.equal([false, false, true]);
    // children that are not part of the stack never show while paging
    expect(visible(el.querySelector("p:not([slot])"))).to.equal(false);
    expect(visible(el.querySelector("block-quote:not([framed])"))).to.equal(
      false,
    );
  });
});
