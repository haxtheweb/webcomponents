import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../grid-plate.js";

// grid-plate registered with ResponsiveUtility and never unregistered, so the
// utility's ResizeObserver kept every removed grid-plate (and its content)
// alive for the life of the page.

const utility = () => globalThis.ResponsiveUtility.requestAvailability();
const entriesFor = (el) => utility().details.filter((d) => d.element === el);
// registration is deferred a microtask after firstUpdated
const registered = async (el) => {
  await el.updateComplete;
  await aTimeout(0);
};

describe("grid-plate responsive registration lifecycle", () => {
  it("registers once while connected and unregisters when removed", async () => {
    const el = await fixture(
      html`<grid-plate layout="1-1"><p slot="col-1">a</p></grid-plate>`,
    );
    await registered(el);
    expect(entriesFor(el).length).to.equal(1);
    el.remove();
    expect(entriesFor(el).length).to.equal(0);
  });

  it("observes again after being moved or re-added", async () => {
    const host = await fixture(
      html`<div>
        <section id="a"></section>
        <section id="b"></section>
      </div>`,
    );
    const el = document.createElement("grid-plate");
    host.querySelector("#a").appendChild(el);
    await registered(el);
    host.querySelector("#b").appendChild(el);
    expect(entriesFor(el).length).to.equal(1);
    el.remove();
    expect(entriesFor(el).length).to.equal(0);
    host.appendChild(el);
    expect(entriesFor(el).length).to.equal(1);
    expect(el.getAttribute("responsive-size")).to.be.a("string");
    el.remove();
  });

  it("leaves no registrations behind after many grid-plates come and go", async () => {
    const host = await fixture(html`<div style="width: 900px"></div>`);
    const before = utility().details.length;
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("grid-plate");
      host.appendChild(el);
      await registered(el);
      el.remove();
    }
    expect(utility().details.length).to.equal(before);
  });

  it("does not register a grid-plate removed before its deferred registration ran", async () => {
    const host = await fixture(html`<div></div>`);
    const before = utility().details.length;
    const el = document.createElement("grid-plate");
    host.appendChild(el);
    await el.updateComplete;
    // firstUpdated has queued the registration microtask; remove first
    el.remove();
    await aTimeout(0);
    expect(utility().details.length).to.equal(before);
  });
});
