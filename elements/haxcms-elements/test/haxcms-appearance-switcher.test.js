import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { toJS } from "mobx";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/ui/haxcms-appearance-switcher.js";

const THEMES = {
  "clean-one": {
    element: "clean-one",
    path: "@haxtheweb/clean-one/clean-one.js",
    name: "Clean One",
    supportedPalettes: ["4", "5"],
  },
  "book-theme": {
    element: "book-theme",
    path: "@haxtheweb/book-theme/book-theme.js",
    name: "Book",
    supportedPalettes: null,
  },
};

async function make(theme = {}) {
  store.manifest = {
    id: "test",
    title: "Test",
    metadata: { site: {}, theme: { element: "book-theme", ...theme } },
    items: [],
  };
  const el = await fixture(
    html`<haxcms-appearance-switcher></haxcms-appearance-switcher>`,
  );
  // registries are fetched; the tests use a fixed one
  await aTimeout(50);
  el._themes = THEMES;
  el._designSystems = { carbon: { title: "Carbon" } };
  await el.updateComplete;
  return el;
}

const pick = async (el, id, value) => {
  const select = el.shadowRoot.querySelector(`#${id}`);
  select.value = value;
  select.dispatchEvent(new Event("change"));
  await el.updateComplete;
};

describe("haxcms-appearance-switcher", () => {
  afterEach(() => {
    store.manifest = null;
  });

  it("shows the look the site loaded with", async () => {
    const el = await make({
      variables: { palette: "9" },
      designSystem: "carbon",
    });
    expect(el.theme).to.equal("book-theme");
    expect(el.palette).to.equal("9");
    expect(el.designSystem).to.equal("carbon");
    expect(el.shadowRoot.querySelector("#theme").value).to.equal("book-theme");
  });

  it("lists every theme in the registry by name", async () => {
    const el = await make();
    expect(el.themeOptions.map((o) => o.name)).to.deep.equal([
      "Book",
      "Clean One",
    ]);
  });

  it("puts the registry's theme entry on the manifest, and nowhere else", async () => {
    const el = await make();
    await pick(el, "theme", "clean-one");
    const theme = toJS(store.manifest.metadata.theme);
    expect(theme.element).to.equal("clean-one");
    expect(theme.path).to.equal("@haxtheweb/clean-one/clean-one.js");
  });

  it("ignores a theme that is not in the registry", async () => {
    const el = await make();
    const select = el.shadowRoot.querySelector("#theme");
    const option = globalThis.document.createElement("option");
    option.value = "not-a-theme";
    select.appendChild(option);
    await pick(el, "theme", "not-a-theme");
    expect(toJS(store.manifest.metadata.theme).element).to.equal("book-theme");
  });

  it("keeps the palette as a theme variable and clears it for the theme default", async () => {
    const el = await make();
    await pick(el, "palette", "9");
    expect(toJS(store.manifest.metadata.theme).variables.palette).to.equal("9");
    await pick(el, "palette", "");
    expect(toJS(store.manifest.metadata.theme).variables).to.not.have.property(
      "palette",
    );
  });

  it("drops a palette the new theme does not support", async () => {
    const el = await make({ variables: { palette: "9" } });
    await pick(el, "theme", "clean-one");
    expect(toJS(store.manifest.metadata.theme).variables).to.not.have.property(
      "palette",
    );
    expect(el.paletteOptions.map((o) => String(o.dataPalette))).to.deep.equal([
      "4",
      "5",
    ]);
  });

  it("sets and clears the design system by registry name only", async () => {
    const el = await make();
    el._acceptsSystems = true;
    await el.updateComplete;
    await pick(el, "designSystem", "carbon");
    expect(toJS(store.manifest.metadata.theme).designSystem).to.equal("carbon");
    await pick(el, "designSystem", "");
    expect(toJS(store.manifest.metadata.theme)).to.not.have.property(
      "designSystem",
    );
  });

  it("disables the design system select for a theme that keeps its own", async () => {
    const el = await make();
    // book-theme is not defined in this test page, so it cannot say it takes one
    expect(el.shadowRoot.querySelector("#designSystem").disabled).to.be.true;
  });

  it("keeps the look in the address only when asked to", async () => {
    const before = globalThis.location.href;
    const el = await make();
    await pick(el, "palette", "9");
    expect(globalThis.location.search).to.not.contain("palette=9");
    el.syncUrl = true;
    await pick(el, "palette", "4");
    expect(globalThis.location.search).to.contain("palette=4");
    expect(globalThis.location.search).to.contain("theme=book-theme");
    globalThis.history.replaceState({}, "", before);
  });

  it("shows only the theme picker in theme-only mode", async () => {
    const el = await make();
    el.themeOnly = true;
    await el.updateComplete;
    expect(el.hasAttribute("theme-only")).to.equal(true);
    expect(el.shadowRoot.querySelectorAll("select").length).to.equal(1);
    expect(el.shadowRoot.querySelector("#theme")).to.not.equal(null);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("takes a palette and design system from outside and keeps the theme", async () => {
    const el = await make({ variables: { palette: "9" } });
    el.applyLook({ palette: "2", designSystem: "carbon" });
    await aTimeout(100);
    const theme = toJS(store.manifest.metadata.theme);
    expect(theme.element).to.equal("book-theme");
    expect(theme.variables.palette).to.equal("2");
    expect(theme.designSystem).to.equal("carbon");
    // back to the defaults
    el.applyLook({ palette: "", designSystem: "" });
    await aTimeout(100);
    const reset = toJS(store.manifest.metadata.theme);
    expect(reset.variables.palette).to.equal(undefined);
    expect(reset.designSystem).to.equal(undefined);
  });

  it("only takes a known palette and a design system in the registry", async () => {
    const el = await make();
    el.applyLook({ palette: "not-a-palette", designSystem: "../evil" });
    await aTimeout(100);
    el.applyLook({ palette: "3", designSystem: "nope-not-registered" });
    await aTimeout(100);
    const theme = toJS(store.manifest.metadata.theme);
    expect(theme.variables.palette).to.equal("3");
    expect(theme.designSystem).to.equal(undefined);
  });

  it("holds a look handed over before the site loads, then applies it", async () => {
    store.manifest = null;
    const el = await fixture(
      html`<haxcms-appearance-switcher></haxcms-appearance-switcher>`,
    );
    el.applyLook({ palette: "4", designSystem: "carbon" });
    store.manifest = {
      id: "test",
      title: "Test",
      metadata: { site: {}, theme: { element: "book-theme" } },
      items: [],
    };
    await aTimeout(150);
    const theme = toJS(store.manifest.metadata.theme);
    expect(theme.variables.palette).to.equal("4");
    expect(theme.designSystem).to.equal("carbon");
  });

  it("labels each select and passes the a11y audit", async () => {
    const el = await make();
    el.shadowRoot.querySelectorAll("select").forEach((select) => {
      expect(select.closest("label")).to.exist;
    });
    await expect(el).shadowDom.to.be.accessible();
  });
});
