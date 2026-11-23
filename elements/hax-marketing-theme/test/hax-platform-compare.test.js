import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import { platformLink } from "../lib/hax-platform-compare.js";

const source = new URL("./platforms.fixture.json", import.meta.url).href;

describe("hax-platform-compare", function () {
  this.timeout(10000);
  let element;

  const show = async (a = "hax", b = "other") => {
    element = await fixture(
      html`<hax-platform-compare
        source="${source}"
        a="${a}"
        b="${b}"
      ></hax-platform-compare>`,
    );
    await waitUntil(() => element._data, "the data loads");
    await element.updateComplete;
    return element.shadowRoot;
  };

  it("draws one row per feature with a column for each platform", async () => {
    const root = await show();
    expect(root.querySelectorAll("tbody tr").length).to.equal(2);
    const heads = [...root.querySelectorAll("thead th")].map((th) =>
      th.textContent.replace(/\s+/g, " ").trim(),
    );
    expect(heads[0]).to.equal("Feature");
    expect(heads[1]).to.contain("HAX");
    expect(heads[1]).to.contain("2 of 2 a clear yes");
    expect(heads[2]).to.contain("0 of 2 a clear yes");
  });

  it("says each answer in a word, not only a mark", async () => {
    const root = await show();
    const cells = [...root.querySelectorAll("tbody tr:first-child td")].map(
      (td) => td.textContent.replace(/\s+/g, " ").trim(),
    );
    expect(cells[0]).to.contain("Yes");
    expect(cells[1]).to.contain("Partly");
    expect(cells[1]).to.contain("Core only");
  });

  it("keeps the reason behind an info button that describes itself", async () => {
    const root = await show();
    const cell = root.querySelectorAll("tbody tr:first-child td")[1];
    const button = cell.querySelector("button.info");
    const tip = cell.querySelector(".tip");
    expect(button.getAttribute("aria-label")).to.equal("Why");
    expect(button.getAttribute("aria-describedby")).to.equal(tip.id);
    expect(tip.getAttribute("role")).to.equal("tooltip");
    expect(getComputedStyle(tip).display).to.equal("none");
    button.click();
    await element.updateComplete;
    expect(button.getAttribute("aria-expanded")).to.equal("true");
    expect(getComputedStyle(tip).display).to.equal("block");
    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await element.updateComplete;
    expect(getComputedStyle(tip).display).to.equal("none");
  });

  it("treats a platform with no answer as a no", async () => {
    const root = await show("hax", "third");
    const cell = root.querySelector("tbody tr:last-child td:last-child");
    expect(cell.textContent).to.contain("No");
  });

  it("swaps a side from its select and ignores an unknown id", async () => {
    const root = await show();
    const select = root.querySelector("#b");
    select.value = "third";
    select.dispatchEvent(new Event("change"));
    await element.updateComplete;
    expect(element.b).to.equal("third");
    element._set("b", { target: { value: "nope" } });
    expect(element.b).to.equal("third");
  });

  it("links a platform only to an http(s) address", async () => {
    const root = await show();
    const links = [...root.querySelectorAll(".foot a")];
    expect(links.length).to.equal(2);
    expect(links[0].getAttribute("href")).to.equal("https://haxtheweb.org/");
    element._data = {
      ...element._data,
      platforms: element._data.platforms.map((p, i) =>
        i === 0 ? { ...p, url: "javascript:alert(1)" } : p,
      ),
    };
    await element.updateComplete;
    const foot = root.querySelector(".foot");
    expect(foot.querySelectorAll("a").length).to.equal(1);
    expect(foot.innerHTML).to.not.contain("javascript:");
    expect(foot.textContent).to.contain("HAX");
  });

  it("platformLink keeps web addresses and drops script ones", () => {
    expect(platformLink("https://example.com")).to.equal(
      "https://example.com/",
    );
    expect(platformLink("javascript:alert(1)")).to.equal("");
    expect(platformLink(" JavaScript:alert(1)")).to.equal("");
    expect(platformLink("data:text/html,x")).to.equal("");
    expect(platformLink("")).to.equal("");
  });

  it("passes the a11y audit", async () => {
    await show();
    await expect(element).shadowDom.to.be.accessible();
  });
});
