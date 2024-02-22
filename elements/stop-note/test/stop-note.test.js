import { fixture, expect, html } from "@open-wc/testing";

import "../stop-note.js";

describe("stop-note test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<stop-note
        title="Confirmation Message"
        url="https://www.google.com"
        icon="stopnoteicons:confirm-icon"
      >
        <span slot="message">You can write any confirmation</span>
      </stop-note>`,
    );
  });

  it("message slot correct", async () => {
    expect(
      element.shadowRoot
        .querySelector("slot[name='message']")
        .assignedNodes({ flatten: true })[0].textContent,
    ).to.equal("You can write any confirmation");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
