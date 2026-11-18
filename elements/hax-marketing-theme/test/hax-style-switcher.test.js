import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import { toJS } from "mobx";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { lockLightColorScheme } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../lib/hax-style-switcher.js";

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

const manifest = () => ({
  title: "HAX the web",
  metadata: {
    site: {},
    theme: {
      element: "hax-marketing-theme",
      path: "@haxtheweb/hax-marketing-theme/hax-marketing-theme.js",
      name: "HAX marketing",
      variables: {},
      regions: {},
    },
  },
  items: [],
});

describe("hax-style-switcher", function () {
  this.timeout(10000);
  let element;
  let restoreColorScheme;
  let saved;

  before(() => {
    restoreColorScheme = lockLightColorScheme();
    saved = { manifest: store.manifest, jwt: store.jwt };
  });

  after(() => {
    restoreColorScheme();
    store.manifest = saved.manifest;
    store.jwt = saved.jwt;
    globalThis.sessionStorage.removeItem("hax-style-switcher");
  });

  const show = async () => {
    store.jwt = null;
    store.manifest = manifest();
    element = await fixture(html`<hax-style-switcher></hax-style-switcher>`);
    await waitUntil(
      () =>
        Object.keys(element._themes).length > 0 &&
        Object.keys(element._systems).length > 0,
      "registries load",
    );
    await tick();
    await element.updateComplete;
    return element.shadowRoot;
  };

  it("offers every design system in the registry", async () => {
    const root = await show();
    const values = [...root.querySelectorAll("#ds option")].map((o) => o.value);
    expect(values[0]).to.equal("");
    expect(values.slice(1)).to.deep.equal(Object.keys(element._systems));
    expect(values.length).to.be.greaterThan(1);
  });

  it("writes a design system and palette pick as site theme data", async () => {
    await show();
    const system = Object.keys(element._systems)[0];
    element._apply({ ds: system, palette: "9" });
    const theme = toJS(store.manifest.metadata.theme);
    expect(theme.element).to.equal("hax-marketing-theme");
    expect(theme.designSystem).to.equal(system);
    expect(theme.variables.palette).to.equal("9");
  });

  it("swaps to a theme from the registry", async () => {
    await show();
    element._apply({ theme: "clean-one" });
    const theme = toJS(store.manifest.metadata.theme);
    expect(theme.element).to.equal("clean-one");
    expect(theme.path).to.equal(element._themes["clean-one"].path);
  });

  it("ignores a theme or design system that is not in a registry", async () => {
    await show();
    element._apply({ theme: "not-a-theme" });
    expect(toJS(store.manifest.metadata.theme).element).to.equal(
      "hax-marketing-theme",
    );
    element._apply({ ds: "not-a-system" });
    expect(toJS(store.manifest.metadata.theme).designSystem).to.be.undefined;
  });

  it("keeps the site's own theme in the list", async () => {
    await show();
    const values = [
      ...element.shadowRoot.querySelectorAll("#theme option"),
    ].map((o) => o.value);
    expect(values).to.include("hax-marketing-theme");
  });

  it("stays out of the way of someone who can edit", async () => {
    await show();
    store.jwt = "editor-token";
    store.appSettings = {};
    await tick(30);
    await element.updateComplete;
    expect(element.shadowRoot.querySelector("select")).to.not.exist;
    const before = JSON.stringify(toJS(store.manifest.metadata.theme));
    element._apply({ theme: "clean-one" });
    expect(JSON.stringify(toJS(store.manifest.metadata.theme))).to.equal(
      before,
    );
    store.jwt = null;
  });

  it("opens and closes as a floating panel", async () => {
    await show();
    element.floating = true;
    await element.updateComplete;
    const toggle = element.shadowRoot.querySelector(".toggle");
    expect(toggle.getAttribute("aria-expanded")).to.equal("false");
    toggle.click();
    await element.updateComplete;
    expect(element.open).to.be.true;
    expect(toggle.getAttribute("aria-expanded")).to.equal("true");
  });

  it("passes the a11y audit", async () => {
    await show();
    await expect(element).shadowDom.to.be.accessible();
  });
});
