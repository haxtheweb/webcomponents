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

  it("tells the page when it moves", async () => {
    const el = await fixture(
      html`<hax-reel effect="glitch" .items="${items}"></hax-reel>`,
    );
    let detail = null;
    el.addEventListener("reel-changed", (e) => {
      detail = e.detail;
    });
    el.next();
    await waitUntil(() => detail, "fires reel-changed");
    expect(detail.index).to.equal(1);
    expect(detail.item.name).to.equal("Sticker");
    await waitUntil(() => !el._changing, "settles");
    expect(el.shadowRoot.querySelector(".was")).to.not.exist;
  });

  it("draws a callout with its network icon, and a character", async () => {
    const el = await fixture(
      html`<hax-reel
        .items="${[
          { callout: "Try it now", site: "try" },
          { character: "students", alt: "A student" },
        ]}"
      ></hax-reel>`,
    );
    expect(el.shadowRoot.querySelector(".fill .say").textContent).to.equal(
      "Try it now",
    );
    expect(el.shadowRoot.querySelector(".fill svg.glyph")).to.exist;
    el.next();
    await waitUntil(() => el.index === 1, "moves to the character");
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".now rpg-character").getAttribute("seed"),
    ).to.equal("students");
  });

  it("links the name only to a place on the page or a web address", async () => {
    const el = await fixture(
      html`<hax-reel caption name-href="#start" .items="${items}"></hax-reel>`,
    );
    const link = el.shadowRoot.querySelector("a.name");
    expect(link.getAttribute("href")).to.equal("#start");
    let asked = false;
    el.addEventListener("reel-name", (e) => {
      asked = true;
      e.preventDefault();
    });
    link.click();
    expect(asked).to.be.true;
    el.nameHref = "javascript:alert(1)";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("a.name")).to.not.exist;
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
