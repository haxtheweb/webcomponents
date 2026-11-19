import { html, fixture, expect } from "@open-wc/testing";
import "../lib/hax-story-link.js";

describe("hax-story-link", () => {
  const href = (el) => el.shadowRoot.querySelector("a").getAttribute("href");

  it("links to a story's address on hax.cloud", async () => {
    const el = await fixture(
      html`<hax-story-link
        story="stories/ee450a19"
        about="Jimmy Kane"
      ></hax-story-link>`,
    );
    expect(href(el)).to.equal("https://hax.cloud/stories/ee450a19");
    expect(el.shadowRoot.textContent).to.contain("See the story");
    expect(el.shadowRoot.querySelector(".sr").textContent).to.contain(
      "Jimmy Kane",
    );
  });

  it("links to a web by its path", async () => {
    const el = await fixture(
      html`<hax-story-link story="hax-lab"></hax-story-link>`,
    );
    expect(href(el)).to.equal("https://hax.cloud/hax-lab");
  });

  it("falls back to the home of the stories for anything else", async () => {
    const el = await fixture(
      html`<hax-story-link story="../evil?x=<script>"></hax-story-link>`,
    );
    expect(href(el)).to.equal("https://hax.cloud/");
  });

  it("keeps hax.cloud when the base is not http(s)", async () => {
    const el = await fixture(
      html`<hax-story-link
        story="hax-lab"
        base="javascript:alert(1)"
      ></hax-story-link>`,
    );
    expect(href(el)).to.equal("https://hax.cloud/hax-lab");
  });

  it("reads Story as a compact chip", async () => {
    const el = await fixture(
      html`<hax-story-link compact story="hax-lab"></hax-story-link>`,
    );
    expect(el.shadowRoot.querySelector("a").textContent).to.contain("Story");
    expect(el.shadowRoot.querySelector("a").textContent).to.not.contain(
      "See the story",
    );
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<hax-story-link story="hax-lab" about="HAX Lab"></hax-story-link>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
