import { html } from "lit";
import { fixture, expect } from "@open-wc/testing";

import "../post-card.js";

describe("PostCard", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<post-card
        post-mark-locations="Egypt"
        photoSrc="http://media.liveauctiongroup.net/i/11189/11535427_1.jpg?v=8CE770C8F1EEC60"
        to="Future"
        from="Past"
        message="To make a baby...."
      ></post-card>`
    );
  });

  it("renders an h3", () => {
    const h3 = element.shadowRoot.querySelector("h3");
    expect(h3).to.exist;
  });

  it("renders a post-card-photo", () => {
    const pcp = element.shadowRoot.querySelector("post-card-photo");
    expect(pcp).to.exist;
  });

  it("renders a post-card-stamp", () => {
    const pcs = element.shadowRoot.querySelector("post-card-stamp");
    expect(pcs).to.exist;
  });

  it("renders a correct To address", () => {
    const to = element.shadowRoot.querySelector('slot[name="to"]');
    expect(to).to.exist;
    expect(to.textContent).to.equal("Future");
  });

  it("renders a correct from address", () => {
    const from = element.shadowRoot.querySelector('slot[name="from"]');
    expect(from).to.exist;
    expect(from.textContent).to.equal("Past");
  });

  it("renders a correct message", () => {
    const mess = element.shadowRoot.querySelector('slot[name="message"]');
    expect(mess).to.exist;
    expect(mess.textContent).to.equal("To make a baby....");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("PostCardPostmark", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<post-card-postmark locations="Europe"></post-card-postmark>`
    );
  });

  it("renders a location", async () => {
    const loco = element.shadowRoot.querySelector("p");
    expect(loco).to.exist;
    // expect(loco.textContent).to.equal('Europe')
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
