import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../lib/hax-reel.js";

const src = (name) => new URL(`../demo/files/${name}`, import.meta.url).href;
const items = [
  {
    src: src("traveler-logo.svg"),
    alt: "The logo",
    name: "Logo",
    tags: ["One"],
  },
  { src: src("sticker-beaver-blue.svg"), alt: "A sticker", name: "Sticker" },
];

describe("hax-reel", function () {
  this.timeout(10000);

  it("shows the first picture and names the button", async () => {
    const el = await fixture(html`<hax-reel .items="${items}"></hax-reel>`);
    expect(el.shadowRoot.querySelector("img").getAttribute("src")).to.equal(
      items[0].src,
    );
    expect(
      el.shadowRoot.querySelector("button").getAttribute("aria-label"),
    ).to.equal("Show another");
  });

  it("flips to the next picture on click and wraps around", async () => {
    const el = await fixture(html`<hax-reel .items="${items}"></hax-reel>`);
    el.shadowRoot.querySelector("button").click();
    await waitUntil(() => el.index === 1, "moves to the second");
    await waitUntil(() => !el._changing, "settles");
    el.shadowRoot.querySelector("button").click();
    await waitUntil(() => el.index === 0, "wraps to the first");
  });

  it("does nothing with one picture", async () => {
    const el = await fixture(
      html`<hax-reel .items="${[items[0]]}"></hax-reel>`,
    );
    expect(el.shadowRoot.querySelector("button").disabled).to.be.true;
  });

  it("shows the name and tags with caption", async () => {
    const el = await fixture(
      html`<hax-reel caption .items="${items}"></hax-reel>`,
    );
    const caption = el.shadowRoot.querySelector(".caption").textContent;
    expect(caption).to.contain("Logo");
    expect(caption).to.contain("One");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<hax-reel
        caption
        label="Show another theme"
        .items="${items}"
      ></hax-reel>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
