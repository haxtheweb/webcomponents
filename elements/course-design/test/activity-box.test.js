import { fixture, expect, html } from "@open-wc/testing";

import "../lib/activity-box.js";
import { ActivityBox } from "../lib/activity-box.js";

describe("activity-box", () => {
  it("registers the custom element", () => {
    expect(globalThis.customElements.get("activity-box")).to.exist;
  });

  it("has the expected static tag and haxProperties URL", () => {
    expect(ActivityBox.tag).to.equal("activity-box");
    const url = ActivityBox.haxProperties;
    expect(typeof url).to.equal("string");
    expect(url.endsWith("activity-box.haxProperties.json")).to.be.true;
  });

  it("has default property values", async () => {
    const el = await fixture(html`<activity-box></activity-box>`);
    expect(el.icon).to.equal("");
    expect(el.tag).to.equal("");
    // no constructor default, so unset until an author sets it
    expect(el.nocolourize).to.be.undefined;
    expect(el.t.activity).to.equal("Activity");
  });

  it("renders a DDD block: icon chip, Activity label, tag title, body", async () => {
    const el = await fixture(html`
      <activity-box icon="icons:assignment" tag="Try it">
        Complete this activity
      </activity-box>
    `);
    await el.updateComplete;
    const block = el.shadowRoot.querySelector(".ddd-block");
    expect(block).to.exist;
    expect(
      block
        .querySelector(".ddd-block-chip simple-icon-lite")
        .getAttribute("icon"),
    ).to.equal("icons:assignment");
    expect(block.querySelector(".ddd-block-label").textContent.trim()).to.equal(
      "Activity",
    );
    const title = block.querySelector(".ddd-block-title.tag-content");
    expect(title.textContent.trim()).to.equal("Try it");
    expect(title.hasAttribute("data-empty")).to.be.false;
    expect(block.querySelector(".ddd-block-body .pullout slot")).to.exist;
    expect(el.textContent).to.include("Complete this activity");
    // the old gradient bar and its 80px icon are gone
    expect(el.shadowRoot.querySelector("simple-icon")).to.not.exist;
    await expect(el).shadowDom.to.be.accessible();
  });

  it("uses a default chip icon and hides the empty title when unset", async () => {
    const el = await fixture(html`<activity-box>No tag or icon</activity-box>`);
    await el.updateComplete;
    expect(
      el.shadowRoot
        .querySelector(".ddd-block-chip simple-icon-lite")
        .getAttribute("icon"),
    ).to.equal("hax:ticket");
    const title = el.shadowRoot.querySelector(".tag-content");
    expect(title.hasAttribute("data-empty")).to.be.true;
    expect(getComputedStyle(title).display).to.equal("none");
    expect(el.textContent).to.include("No tag or icon");
  });

  it("marks the chip neutral with nocolourize", async () => {
    const el = await fixture(html`
      <activity-box icon="save" nocolourize>Neutral</activity-box>
    `);
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".ddd-block").hasAttribute("data-neutral"),
    ).to.be.true;
  });

  it("draws the accent top rule only with data-accent", async () => {
    const plain = await fixture(
      html`<activity-box icon="save"></activity-box>`,
    );
    const accented = await fixture(html`
      <activity-box icon="save" data-primary="2" data-accent="1"></activity-box>
    `);
    const plainTop = parseFloat(
      getComputedStyle(plain.shadowRoot.querySelector(".ddd-block"))
        .borderTopWidth,
    );
    const accentTop = parseFloat(
      getComputedStyle(accented.shadowRoot.querySelector(".ddd-block"))
        .borderTopWidth,
    );
    expect(accentTop).to.be.greaterThan(plainTop);
  });

  it("edits the tag in place in the header title through hax hooks", async () => {
    const el = await fixture(html`
      <activity-box icon="icons:assignment" tag="Try it"></activity-box>
    `);
    await el.updateComplete;
    expect(el.haxHooks()).to.deep.equal({
      activeElementChanged: "haxactiveElementChanged",
    });
    const result = el.haxactiveElementChanged(el, true);
    expect(result).to.equal(false);
    const container = el.shadowRoot.querySelector(".tag-content");
    expect(container.classList.contains("ddd-block-title")).to.be.true;
    expect(container.hasAttribute("contenteditable")).to.be.true;
    el.haxactiveElementChanged(el, false);
    expect(container.hasAttribute("contenteditable")).to.be.false;
    expect(el.tag).to.include("Try it");
  });

  it("shows the title for editing even when the tag is empty", async () => {
    const el = await fixture(html`<activity-box></activity-box>`);
    await el.updateComplete;
    el.haxactiveElementChanged(el, true);
    const container = el.shadowRoot.querySelector(".tag-content");
    expect(getComputedStyle(container).display).to.not.equal("none");
    el.haxactiveElementChanged(el, false);
  });
});
