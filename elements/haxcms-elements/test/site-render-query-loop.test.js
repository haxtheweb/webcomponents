import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/ui-components/query/site-render-query.js";

// site-render-query passes its result down to site-query and takes
// site-query's result-changed back. site-query also reports a result it was
// given; copying that back made a new array that went down again, an
// endless microtask loop that froze the page (no timer ever ran again).
describe("site-render-query", () => {
  let original;
  beforeEach(() => {
    original = store.manifest;
    store.manifest = {
      items: [1, 2, 3, 4, 5].map((n) => ({
        id: "p" + n,
        title: "Page " + n,
        slug: "p" + n,
        location: "pages/p" + n + "/index.html",
        parent: null,
        indent: 0,
        order: n,
        metadata: { published: true },
      })),
    };
  });
  afterEach(() => {
    store.manifest = original;
  });

  it("keeps its result when site-query reports that same result back", () => {
    const el = document.createElement("site-render-query");
    const given = [{ id: "a" }];
    el.result = given;
    el.resultEvent({ detail: { value: given } });
    // a copy here is what started the loop
    expect(el.result).to.equal(given);
    // a new result from site-query is taken
    const next = [{ id: "b" }];
    el.resultEvent({ detail: { value: next } });
    expect(el.result).to.deep.equal(next);
    expect(el.result).to.not.equal(next);
  });

  it("settles after rendering its result", async () => {
    const el = await fixture(html`<site-render-query></site-render-query>`);
    const query = el.shadowRoot.querySelector("site-query");
    let reports = 0;
    query.addEventListener("result-changed", () => reports++);
    await aTimeout(300);
    expect(reports, "no more reports once settled").to.equal(0);
    expect(el.result.map((i) => i.id)).to.deep.equal([
      "p1",
      "p2",
      "p3",
      "p4",
      "p5",
    ]);
    expect(el.shadowRoot.querySelectorAll("#list .item").length).to.equal(5);
  });

  it("takes a new result from site-query when the site changes", async () => {
    const el = await fixture(html`<site-render-query></site-render-query>`);
    await aTimeout(100);
    store.manifest = {
      items: store.manifest.items.slice(0, 2).map((i) => Object.assign({}, i)),
    };
    await aTimeout(200);
    expect(el.result.map((i) => i.id)).to.deep.equal(["p1", "p2"]);
  });
});
