import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../lib/hax-platform-compare.js";

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

  it("passes the a11y audit", async () => {
    await show();
    await expect(element).shadowDom.to.be.accessible();
  });
});
