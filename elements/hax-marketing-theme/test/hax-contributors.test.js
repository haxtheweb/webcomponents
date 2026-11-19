import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../lib/hax-contributors.js";

const source = new URL("./contributors.fixture.json", import.meta.url).href;

describe("hax-contributors", function () {
  this.timeout(10000);
  let element;

  const show = async (view) => {
    element = await fixture(
      html`<hax-contributors
        source="${source}"
        show="${view}"
      ></hax-contributors>`,
    );
    await waitUntil(() => element._data, "the roster loads");
    await element.updateComplete;
    return element.shadowRoot;
  };

  it("lab: lists everyone on the roster", async () => {
    const root = await show("lab");
    expect(root.querySelectorAll("li").length).to.equal(2);
  });

  it("landed: lists only people with a known next step", async () => {
    const root = await show("landed");
    const cards = root.querySelectorAll("li");
    expect(cards.length).to.equal(1);
    expect(cards[0].querySelector(".now").textContent).to.contain(
      "Engineer, Example Co",
    );
  });

  it("names each link and drops one that is not http(s)", async () => {
    const root = await show("landed");
    const links = [...root.querySelectorAll(".links > a")];
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute("aria-label")).to.equal(
      "Sam Example on GitHub",
    );
    expect(root.querySelector("hax-story-link").story).to.equal(
      "stories/abc12345",
    );
  });

  it("code: lists logins with their commit count", async () => {
    const root = await show("code");
    const text = [...root.querySelectorAll("li")].map((li) =>
      li.textContent.replace(/\s+/g, " ").trim(),
    );
    expect(text).to.deep.equal(["example 12 commits", "solo 1 commit"]);
  });

  it("passes the a11y audit", async () => {
    await show("landed");
    await expect(element).shadowDom.to.be.accessible();
  });
});
