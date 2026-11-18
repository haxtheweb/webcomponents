import { expect, oneEvent } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/haxcms-appearance-admin-dialog.js";
import "../lib/core/ui/haxcms-theme-preview-panel.js";
import {
  applySiteDesignSystem,
  loadDesignSystemRegistry,
  siteDesignSystemName,
  themeAcceptsDesignSystems,
  themeDefaultDesignSystem,
  themeDefaultDesignSystemTitle,
} from "../lib/core/utils/HAXCMSDesignSystems.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";

// a theme whose chrome reads only --ddd-*, and one that doesn't say so
class DsAcceptingTheme extends HTMLElement {
  static get acceptsDesignSystems() {
    return true;
  }
}
class DsPlainTheme extends HTMLElement {}
// takes any system and starts on one of its own
class DsDefaultTheme extends HTMLElement {
  static get acceptsDesignSystems() {
    return true;
  }
  static get defaultDesignSystem() {
    return "carbon";
  }
}
// names a default but takes no system: the default means nothing
class DsDefaultPlainTheme extends HTMLElement {
  static get defaultDesignSystem() {
    return "carbon";
  }
}
globalThis.customElements.define("ds-accepting-theme", DsAcceptingTheme);
globalThis.customElements.define("ds-plain-theme", DsPlainTheme);
globalThis.customElements.define("ds-default-theme", DsDefaultTheme);
globalThis.customElements.define("ds-default-plain-theme", DsDefaultPlainTheme);

/** a stand-in for the design system manager */
function fakeManager() {
  return {
    active: "ddd",
    systems: { ddd: { name: "ddd" } },
    addDesignSystem(system) {
      this.systems[system.name] = system;
    },
  };
}

describe("site design systems", () => {
  it("reads the site's choice, DDD when there is none", () => {
    expect(siteDesignSystemName({ designSystem: "carbon" })).to.equal("carbon");
    expect(siteDesignSystemName({ designSystem: " Carbon " })).to.equal(
      "carbon",
    );
    expect(siteDesignSystemName({ designSystem: "ddd" })).to.equal("");
    expect(siteDesignSystemName({})).to.equal("");
    expect(siteDesignSystemName(null)).to.equal("");
    expect(siteDesignSystemName({ designSystem: "../evil" })).to.equal("");
  });

  it("lists the bridged systems, each with its module", async () => {
    const registry = await loadDesignSystemRegistry();
    expect(registry.carbon.path).to.equal(
      "@haxtheweb/carbon-theme/lib/CarbonDesignSystem.js",
    );
    expect(registry.carbon.activate).to.equal("activateCarbonDesignSystem");
    // a theme's private system is not offered
    expect(registry.keepcase).to.equal(undefined);
  });

  it("knows which themes take a design system", () => {
    expect(themeAcceptsDesignSystems("ds-accepting-theme")).to.equal(true);
    expect(themeAcceptsDesignSystems("ds-plain-theme")).to.equal(false);
    expect(themeAcceptsDesignSystems("not-defined-theme")).to.equal(false);
  });

  it("activates the site's system on a theme that takes one", async () => {
    const manager = fakeManager();
    const result = await applySiteDesignSystem(
      "carbon",
      "ds-accepting-theme",
      manager,
    );
    expect(result).to.equal("carbon");
    expect(manager.active).to.equal("carbon");
    expect(manager.systems.carbon.extends).to.equal("ddd");
  });

  it("goes back to DDD when the choice is cleared", async () => {
    const manager = fakeManager();
    await applySiteDesignSystem("carbon", "ds-accepting-theme", manager);
    const result = await applySiteDesignSystem(
      "",
      "ds-accepting-theme",
      manager,
    );
    expect(result).to.equal("ddd");
    expect(manager.active).to.equal("ddd");
  });

  it("never imports a name the registry doesn't list", async () => {
    const manager = fakeManager();
    const result = await applySiteDesignSystem(
      "not-a-system",
      "ds-accepting-theme",
      manager,
    );
    expect(result).to.equal("ddd");
    expect(Object.keys(manager.systems)).to.deep.equal(["ddd"]);
  });

  it("leaves a theme that takes none alone", async () => {
    const manager = fakeManager();
    manager.active = "something-the-theme-set";
    const result = await applySiteDesignSystem(
      "carbon",
      "ds-plain-theme",
      manager,
    );
    expect(result).to.equal(null);
    expect(manager.active).to.equal("something-the-theme-set");
  });

  it("puts a theme that takes none back on DDD after the site's choice", async () => {
    const manager = fakeManager();
    await applySiteDesignSystem("carbon", "ds-accepting-theme", manager);
    await applySiteDesignSystem("carbon", "ds-plain-theme", manager);
    expect(manager.active).to.equal("ddd");
  });

  it("reads the system a theme starts on", async () => {
    expect(themeDefaultDesignSystem("ds-default-theme")).to.equal("carbon");
    expect(themeDefaultDesignSystem("ds-accepting-theme")).to.equal("");
    expect(themeDefaultDesignSystem("ds-default-plain-theme")).to.equal("");
    expect(themeDefaultDesignSystem("not-defined-theme")).to.equal("");
    const registry = await loadDesignSystemRegistry();
    expect(
      themeDefaultDesignSystemTitle("ds-default-theme", registry),
    ).to.equal("Carbon");
    expect(
      themeDefaultDesignSystemTitle("ds-accepting-theme", registry),
    ).to.equal("");
  });

  it("starts a theme on its own system when the site picked none", async () => {
    const manager = fakeManager();
    const result = await applySiteDesignSystem("", "ds-default-theme", manager);
    expect(result).to.equal("carbon");
    expect(manager.active).to.equal("carbon");
  });

  it("keeps the site's choice over the theme's default", async () => {
    const manager = fakeManager();
    const result = await applySiteDesignSystem(
      "patternfly",
      "ds-default-theme",
      manager,
    );
    expect(result).to.equal("patternfly");
    expect(manager.active).to.equal("patternfly");
  });

  it("lets the newest choice win a quick switch", async () => {
    const manager = fakeManager();
    const first = applySiteDesignSystem(
      "carbon",
      "ds-accepting-theme",
      manager,
    );
    const second = applySiteDesignSystem(
      "patternfly",
      "ds-accepting-theme",
      manager,
    );
    expect(await first).to.equal(null);
    expect(await second).to.equal("patternfly");
    expect(manager.active).to.equal("patternfly");
  });
});

function makeManifest(designSystem) {
  const theme = {
    element: "ds-accepting-theme",
    variables: {},
    regions: {},
  };
  if (designSystem) {
    theme.designSystem = designSystem;
  }
  return {
    id: "ds-site",
    title: "DS Site",
    metadata: {
      site: { name: "ds-site", lang: "en" },
      platform: {},
      theme: theme,
    },
    items: [],
  };
}

async function settle(el) {
  await new Promise((r) => setTimeout(r, 10));
  await el.updateComplete;
}

function fieldsFor(el, key) {
  return [...el.shadowRoot.querySelectorAll("simple-fields")].find(
    (sf) => sf.value && Object.prototype.hasOwnProperty.call(sf.value, key),
  );
}

function setField(el, key, value) {
  const sf = fieldsFor(el, key);
  sf.dispatchEvent(
    new CustomEvent("value-changed", {
      detail: { value: { ...sf.value, [key]: value } },
    }),
  );
}

async function appearance() {
  const el = document.createElement("haxcms-appearance-admin-dialog");
  el.inShell = true;
  // appended directly: fixture() waits for a frame, and frames stall in a
  // tab that is not showing when several test files run at once
  globalThis.document.body.appendChild(el);
  await settle(el);
  // the registry loads with the theme list; wait for the rebuild
  await loadDesignSystemRegistry();
  await settle(el);
  return el;
}

describe("design system setting in appearance", () => {
  let savedManifest;
  let savedSound;
  let savedTheme;
  beforeEach(() => {
    savedManifest = store.manifest;
    savedSound = store.playSound;
    savedTheme = store.themeElement;
    store.playSound = () => {};
    store.themeElement = document.createElement("ds-accepting-theme");
  });
  afterEach(() => {
    globalThis.document
      .querySelectorAll("haxcms-appearance-admin-dialog")
      .forEach((el) => el.remove());
    store.manifest = savedManifest;
    store.playSound = savedSound;
    store.themeElement = savedTheme;
  });

  it("offers DDD and every bridged system for a theme that takes one", async () => {
    store.manifest = makeManifest("patternfly");
    const el = await appearance();
    const sf = fieldsFor(el, "manifest-metadata-theme-designSystem");
    expect(sf).to.exist;
    const field = sf.fields[0];
    expect(field.options[""]).to.equal("DDD (default)");
    expect(field.options.carbon).to.equal("Carbon");
    expect(sf.value["manifest-metadata-theme-designSystem"]).to.equal(
      "patternfly",
    );
  });

  it("is not offered for a theme that takes none", async () => {
    store.manifest = makeManifest();
    store.manifest.metadata.theme.element = "ds-plain-theme";
    const el = await appearance();
    expect(fieldsFor(el, "manifest-metadata-theme-designSystem")).to.equal(
      undefined,
    );
  });

  it("leaves the field out of a save that didn't change it", async () => {
    store.manifest = makeManifest("patternfly");
    const el = await appearance();
    setTimeout(() => el.save());
    const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
    expect(
      Object.prototype.hasOwnProperty.call(
        e.detail.manifest.theme,
        "manifest-metadata-theme-designSystem",
      ),
    ).to.equal(false);
  });

  it("saves the choice and previews it before saving", async () => {
    store.manifest = makeManifest();
    const el = await appearance();
    setField(el, "manifest-metadata-theme-designSystem", "carbon");
    await new Promise((r) => setTimeout(r, 200));
    expect(DesignSystemManager.active).to.equal("carbon");
    setTimeout(() => el.save());
    const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
    expect(
      e.detail.manifest.theme["manifest-metadata-theme-designSystem"],
    ).to.equal("carbon");
    // discarding puts the saved choice back
    el.discard();
    await new Promise((r) => setTimeout(r, 200));
    expect(DesignSystemManager.active).to.equal("ddd");
  });
  it("takes the design system picked in Theme Preview", async () => {
    store.manifest = makeManifest();
    const el = await appearance();
    el.applyThemePreviewSelection({
      theme: "ds-accepting-theme",
      palette: "",
      designSystem: "patternfly",
    });
    setTimeout(() => el.save());
    const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
    expect(
      e.detail.manifest.theme["manifest-metadata-theme-designSystem"],
    ).to.equal("patternfly");
  });
});

describe("design system in Theme Preview (the quick switch)", () => {
  let savedManifest;
  beforeEach(() => {
    savedManifest = store.manifest;
  });
  afterEach(() => {
    globalThis.document
      .querySelectorAll("haxcms-theme-preview-panel")
      .forEach((el) => el.remove());
    store.manifest = savedManifest;
  });

  async function panel() {
    const el = globalThis.document.createElement("haxcms-theme-preview-panel");
    globalThis.document.body.appendChild(el);
    await loadDesignSystemRegistry();
    await new Promise((r) => setTimeout(r, 50));
    await el.updateComplete;
    return el;
  }

  it("offers the select for a theme that takes one, starting on the site's choice", async () => {
    store.manifest = makeManifest("carbon");
    const el = await panel();
    const select = el.shadowRoot.querySelector("#design-system");
    expect(select).to.exist;
    expect(select.value).to.equal("carbon");
    expect(select.options[0].value).to.equal("");
  });

  it("hides the select for a theme that takes none", async () => {
    store.manifest = makeManifest();
    store.manifest.metadata.theme.element = "ds-plain-theme";
    const el = await panel();
    expect(el.shadowRoot.querySelector("#design-system")).to.equal(null);
  });

  it("previews a pick on the site and hands it to Appearance", async () => {
    store.manifest = makeManifest();
    const el = await panel();
    const select = el.shadowRoot.querySelector("#design-system");
    select.value = "patternfly";
    select.dispatchEvent(new Event("change"));
    expect(store.manifest.metadata.theme.designSystem).to.equal("patternfly");
    setTimeout(() => el._openAdminTheme());
    const e = await oneEvent(globalThis, "haxcms-theme-preview-open-admin");
    expect(e.detail.designSystem).to.equal("patternfly");
  });

  it("clearing the pick previews DDD", async () => {
    store.manifest = makeManifest("carbon");
    const el = await panel();
    const select = el.shadowRoot.querySelector("#design-system");
    select.value = "";
    select.dispatchEvent(new Event("change"));
    expect(
      Object.prototype.hasOwnProperty.call(
        store.manifest.metadata.theme,
        "designSystem",
      ),
    ).to.equal(false);
  });
});
