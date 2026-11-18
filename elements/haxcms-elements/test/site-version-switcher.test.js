import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import {
  siteVersions,
  versionOf,
  versionTarget,
} from "../lib/ui-components/navigation/site-version-switcher.js";

const page = (id, parent, order, slug, tags, extra = {}) => ({
  id,
  parent,
  order,
  indent: parent ? 1 : 0,
  title: id,
  slug,
  location: `pages/${id}/index.html`,
  metadata: { published: true, tags, ...extra },
});

// two versions (2.0 first, so current), a page only 2.0 has, and a page
// outside every version
const items = () => [
  page("v2", null, 0, "v2", "version"),
  page("v2-start", "v2", 0, "v2/getting-started", ""),
  page("v2-upgrade", "v2", 1, "v2/upgrading", ""),
  page("v1", null, 1, "v1", ["Version"]),
  page("v1-start", "v1", 0, "v1/getting-started", ""),
  page("community", null, 2, "community", "help"),
];

describe("site-version-switcher: reading versions from the outline", () => {
  it("takes top level pages tagged version, in outline order", () => {
    expect(siteVersions(items()).map((v) => v.id)).to.deep.equal(["v2", "v1"]);
  });

  it("reads tags kept as a list or as a comma string, in any case", () => {
    const list = [
      page("a", null, 0, "a", "docs, Version"),
      page("b", null, 1, "b", ["VERSION"]),
      page("c", null, 2, "c", "versions"),
    ];
    expect(siteVersions(list).map((v) => v.id)).to.deep.equal(["a", "b"]);
  });

  it("leaves out unpublished versions and tagged pages that are not top level", () => {
    const list = [
      page("a", null, 0, "a", "version"),
      page("draft", null, 1, "draft", "version", { published: false }),
      page("child", "a", 0, "a/child", "version"),
    ];
    expect(siteVersions(list).map((v) => v.id)).to.deep.equal(["a"]);
  });

  it("finds the version a page is in, or none", () => {
    const list = items();
    const versions = siteVersions(list);
    expect(versionOf(list, "v1-start", versions).id).to.equal("v1");
    expect(versionOf(list, "v2", versions).id).to.equal("v2");
    expect(versionOf(list, "community", versions)).to.equal(null);
    expect(versionOf(list, "missing", versions)).to.equal(null);
  });

  it("stops on a parent cycle instead of looping", () => {
    const list = [page("a", "b", 0, "a", ""), page("b", "a", 0, "b", "")];
    expect(versionOf(list, "a", [])).to.equal(null);
  });
});

describe("site-version-switcher: where a switch lands", () => {
  const list = items();
  const byId = (id) => list.find((item) => item.id === id);

  it("keeps the same page when the other version has it", () => {
    const target = versionTarget(
      list,
      byId("v2-start"),
      byId("v2"),
      byId("v1"),
    );
    expect(target.slug).to.equal("v1/getting-started");
  });

  it("goes to the version's own page when it has no page at that path", () => {
    const target = versionTarget(
      list,
      byId("v2-upgrade"),
      byId("v2"),
      byId("v1"),
    );
    expect(target.id).to.equal("v1");
  });

  it("goes to the version's own page from outside any version", () => {
    expect(
      versionTarget(list, byId("community"), null, byId("v2")).id,
    ).to.equal("v2");
  });

  it("does not land on an unpublished page", () => {
    const withDraft = items();
    withDraft.find((item) => item.id === "v1-start").metadata.published = false;
    const target = versionTarget(
      withDraft,
      withDraft.find((item) => item.id === "v2-start"),
      withDraft.find((item) => item.id === "v2"),
      withDraft.find((item) => item.id === "v1"),
    );
    expect(target.id).to.equal("v1");
  });
});

describe("site-version-switcher element", () => {
  afterEach(() => {
    store.manifest = null;
    store.activeId = null;
  });

  const site = (list) => ({
    id: "test",
    title: "Test",
    metadata: { site: {}, theme: {} },
    items: list,
  });

  it("renders nothing with fewer than two versions", async () => {
    store.manifest = site([page("v1", null, 0, "v1", "version")]);
    const el = await fixture(
      html`<site-version-switcher></site-version-switcher>`,
    );
    await el.updateComplete;
    expect(el.empty).to.be.true;
    expect(globalThis.getComputedStyle(el).display).to.equal("none");
  });

  it("lists the versions and selects the one the page is in", async () => {
    store.manifest = site(items());
    store.activeId = "v1-start";
    const el = await fixture(
      html`<site-version-switcher></site-version-switcher>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot.querySelector("select");
    expect(el.empty).to.be.false;
    expect([...select.options].map((o) => o.value)).to.deep.equal(["v2", "v1"]);
    expect(select.value).to.equal("v1");
  });

  it("offers a choice, naming no version, on a page outside every version", async () => {
    store.manifest = site(items());
    store.activeId = "community";
    const el = await fixture(
      html`<site-version-switcher></site-version-switcher>`,
    );
    await el.updateComplete;
    const select = el.shadowRoot.querySelector("select");
    expect(select.value).to.equal("");
    expect(select.options[0].disabled).to.be.true;
  });

  it("names its select and passes the a11y audit", async () => {
    store.manifest = site(items());
    store.activeId = "v2";
    const el = await fixture(
      html`<site-version-switcher></site-version-switcher>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("label[for='version']")).to.exist;
    await expect(el).shadowDom.to.be.accessible();
  });

  it("moves the address to the matching page of the picked version", async () => {
    store.manifest = site(items());
    store.activeId = "v2-start";
    const el = await fixture(
      html`<site-version-switcher></site-version-switcher>`,
    );
    await el.updateComplete;
    const before = globalThis.location.href;
    let popped = 0;
    const onPop = () => popped++;
    globalThis.addEventListener("popstate", onPop);
    const select = el.shadowRoot.querySelector("select");
    select.value = "v1";
    select.dispatchEvent(new Event("change"));
    globalThis.removeEventListener("popstate", onPop);
    expect(globalThis.location.pathname.endsWith("v1/getting-started")).to.be
      .true;
    expect(popped).to.equal(1);
    globalThis.history.replaceState({}, "", before);
  });
});
