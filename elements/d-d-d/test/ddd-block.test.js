import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import * as DDDModule from "../d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  canDDDBlockFullscreen,
  isDDDBlockFullscreen,
  toggleDDDBlockFullscreen,
  listenDDDBlockFullscreen,
} from "../lib/DDDBlock.js";

class DDDBlockTester extends LitElement {
  static get styles() {
    return [DDDBlockStyles];
  }
  static get properties() {
    return { title: { type: String }, withActions: { type: Boolean } };
  }
  render() {
    return html`<div class="ddd-block" role="group" aria-labelledby="hdr">
      ${renderDDDBlockHeader({
        id: "hdr",
        icon: "icons:info",
        label: "Type · Kind",
        title: this.title,
        titleTag: "h3",
        actions: this.withActions
          ? html`<button class="ddd-block-action" aria-label="Open">x</button>`
          : undefined,
      })}
      <div class="ddd-block-body">body</div>
    </div>`;
  }
}
globalThis.customElements.define("ddd-block-tester", DDDBlockTester);

describe("DDDBlock", () => {
  it("is a standalone module that adds nothing to the d-d-d exports", () => {
    expect(DDDModule.DDDBlockStyles).to.equal(undefined);
    expect(DDDModule.renderDDDBlockHeader).to.equal(undefined);
  });

  it("shares one stylesheet across instances", async () => {
    const a = await fixture(html`<ddd-block-tester></ddd-block-tester>`);
    const b = await fixture(html`<ddd-block-tester></ddd-block-tester>`);
    const sa = a.shadowRoot.adoptedStyleSheets;
    const sb = b.shadowRoot.adoptedStyleSheets;
    if (sa && sa.length && sb && sb.length) {
      expect(sa[0]).to.equal(sb[0]);
    }
  });

  it("renders the header parts and names the frame", async () => {
    const el = await fixture(
      html`<ddd-block-tester title="Hello" with-actions></ddd-block-tester>`,
    );
    el.withActions = true;
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(root.querySelector(".ddd-block-chip simple-icon-lite")).to.exist;
    expect(root.querySelector(".ddd-block-label").textContent).to.equal(
      "Type · Kind",
    );
    const title = root.querySelector("h3.ddd-block-title");
    expect(title).to.exist;
    expect(title.textContent).to.equal("Hello");
    expect(root.querySelector("#hdr")).to.exist;
    expect(root.querySelector(".ddd-block-actions .ddd-block-action")).to.exist;
  });

  it("omits the title and actions when not given", async () => {
    const el = await fixture(html`<ddd-block-tester></ddd-block-tester>`);
    const root = el.shadowRoot;
    expect(root.querySelector(".ddd-block-title")).to.equal(null);
    expect(root.querySelector(".ddd-block-actions")).to.equal(null);
  });
});

describe("DDDBlock full screen helpers", () => {
  it("reports support from the standard and webkit APIs", () => {
    const d = globalThis.document;
    expect(canDDDBlockFullscreen()).to.equal(
      !!(d.fullscreenEnabled && HTMLElement.prototype.requestFullscreen),
    );
    expect(canDDDBlockFullscreen({ webkit: true })).to.equal(
      !!(d.fullscreenEnabled || d.webkitFullscreenEnabled),
    );
  });

  it("matches the target against the root full screen element", () => {
    const target = {};
    expect(isDDDBlockFullscreen({ fullscreenElement: target }, target)).to.be
      .true;
    expect(isDDDBlockFullscreen({ fullscreenElement: {} }, target)).to.be.false;
    expect(isDDDBlockFullscreen({ fullscreenElement: null }, target)).to.be
      .false;
    expect(isDDDBlockFullscreen(null, target)).to.be.false;
    expect(isDDDBlockFullscreen({ fullscreenElement: target }, null)).to.be
      .false;
    const wk = { fullscreenElement: null, webkitFullscreenElement: target };
    expect(isDDDBlockFullscreen(wk, target)).to.be.false;
    expect(isDDDBlockFullscreen(wk, target, { webkit: true })).to.be.true;
  });

  it("requests full screen on the target when not active", () => {
    let calls = 0;
    const target = {
      requestFullscreen() {
        calls++;
        return Promise.reject(new Error("denied"));
      },
    };
    toggleDDDBlockFullscreen(target, false);
    expect(calls).to.equal(1);
    let webkitCalls = 0;
    toggleDDDBlockFullscreen(
      {
        webkitRequestFullscreen() {
          webkitCalls++;
        },
      },
      false,
      { webkit: true },
    );
    expect(webkitCalls).to.equal(1);
    // without the webkit option the prefixed request is never used
    toggleDDDBlockFullscreen(
      {
        webkitRequestFullscreen() {
          webkitCalls++;
        },
      },
      false,
    );
    expect(webkitCalls).to.equal(1);
  });

  it("exits full screen when active", () => {
    const d = globalThis.document;
    const original = d.exitFullscreen;
    let exits = 0;
    let requests = 0;
    d.exitFullscreen = () => {
      exits++;
      return Promise.resolve();
    };
    const target = {
      requestFullscreen() {
        requests++;
      },
    };
    try {
      toggleDDDBlockFullscreen(target, true);
      toggleDDDBlockFullscreen(target, true, { webkit: true });
    } finally {
      d.exitFullscreen = original;
    }
    expect(exits).to.equal(2);
    expect(requests).to.equal(0);
  });

  it("adds and removes the change listeners", () => {
    const d = globalThis.document;
    let count = 0;
    const handler = () => count++;
    listenDDDBlockFullscreen(handler, true);
    d.dispatchEvent(new Event("fullscreenchange"));
    d.dispatchEvent(new Event("webkitfullscreenchange"));
    expect(count).to.equal(1);
    listenDDDBlockFullscreen(handler, false);
    d.dispatchEvent(new Event("fullscreenchange"));
    expect(count).to.equal(1);
    listenDDDBlockFullscreen(handler, true, { webkit: true });
    d.dispatchEvent(new Event("fullscreenchange"));
    d.dispatchEvent(new Event("webkitfullscreenchange"));
    expect(count).to.equal(3);
    listenDDDBlockFullscreen(handler, false, { webkit: true });
    d.dispatchEvent(new Event("fullscreenchange"));
    d.dispatchEvent(new Event("webkitfullscreenchange"));
    expect(count).to.equal(3);
  });
});
