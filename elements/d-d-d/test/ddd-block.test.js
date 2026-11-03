import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import * as DDDModule from "../d-d-d.js";
import { DDDBlockStyles, renderDDDBlockHeader } from "../lib/DDDBlock.js";

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
