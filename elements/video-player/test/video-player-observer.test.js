import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../video-player.js";

// video-player watches its light DOM children (source / track) with a
// MutationObserver. The `observer` getter used to build a new observer on
// every access, so disconnectedCallback disconnected a fresh, unused observer
// and the observing one was never disconnected.

const settle = () => aTimeout(0);

describe("video-player child observer", () => {
  it("returns the same observer every time", async () => {
    const el = await fixture(html`<video-player></video-player>`);
    expect(el.observer).to.equal(el.observer);
    expect(el.observer).to.be.instanceOf(MutationObserver);
  });

  it("reacts to child changes while connected", async () => {
    const el = await fixture(html`<video-player></video-player>`);
    let calls = 0;
    el.setSourceData = () => {
      calls++;
    };
    el.appendChild(document.createElement("source"));
    await settle();
    expect(calls).to.be.at.least(1);
  });

  it("stops observing when removed and resumes when re-added", async () => {
    const host = await fixture(html`<div></div>`);
    const el = document.createElement("video-player");
    host.appendChild(el);
    await el.updateComplete;
    let calls = 0;
    el.setSourceData = () => {
      calls++;
    };
    el.remove();
    el.appendChild(document.createElement("source"));
    await settle();
    expect(calls).to.equal(0);
    host.appendChild(el);
    el.appendChild(document.createElement("track"));
    await settle();
    expect(calls).to.be.at.least(1);
    el.remove();
  });

  it("observes only once across repeated connects", async () => {
    const host = await fixture(
      html`<div><span id="a"></span><span id="b"></span></div>`,
    );
    const el = document.createElement("video-player");
    host.querySelector("#a").appendChild(el);
    host.querySelector("#b").appendChild(el);
    host.querySelector("#a").appendChild(el);
    let calls = 0;
    el.setSourceData = () => {
      calls++;
    };
    el.appendChild(document.createElement("source"));
    await settle();
    // one mutation record batch, one observer: exactly one callback
    expect(calls).to.equal(1);
    el.remove();
  });
});
