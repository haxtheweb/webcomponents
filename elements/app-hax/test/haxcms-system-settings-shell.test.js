import { expect } from "@open-wc/testing";
import "../lib/v2/admin/haxcms-system-settings.js";

describe("haxcms-system-settings HAX UI shell", () => {
  let el;

  beforeEach(() => {
    el = document.createElement("haxcms-system-settings");
  });

  it("opens on Status and sends the old launcher route there", () => {
    expect(el.activePanel).to.equal("status");
    expect(el._normalizePanelKey("dashboard")).to.equal("status");
    expect(el._normalizePanelKey("")).to.equal("status");
    expect(el._normalizePanelKey("not-a-panel")).to.equal("status");
    expect(el._normalizePanelKey("themes")).to.equal("themes");
  });

  it("lists what works before what is coming soon", () => {
    const keys = (group) =>
      el.panelList.filter((p) => p.group === group).map((p) => p.key);
    // Blocks stays where it is in the primary list
    expect(keys("primary")).to.deep.equal([
      "status",
      "skeletons",
      "themes",
      "blocks",
    ]);
    expect(keys("advanced")).to.deep.equal([
      "media",
      "configuration",
      "integrations",
      "custom-code",
    ]);
  });

  it("leads the rail with Collapse menu, as site admin does", async () => {
    document.body.appendChild(el);
    await el.updateComplete;
    const rail = el.shadowRoot.querySelector("nav.rail");
    const first = rail.firstElementChild;
    expect(first.classList.contains("rail-collapse")).to.be.true;
    expect(first.getAttribute("aria-label")).to.equal("Collapse menu");
    expect(first.getAttribute("aria-controls")).to.equal(rail.id);
    expect(el.shadowRoot.querySelector(".rail-foot")).to.equal(null);
    first.click();
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".rail-collapse").getAttribute("aria-label"),
    ).to.equal("Expand menu");
    el._toggleRail();
    el.remove();
  });

  it("groups status rows by area and pulls problems to the top", () => {
    el.statusRows = el._normalizeStatusRows([
      { key: "runtime", tone: "info", title: "Runtime", value: "node22" },
      { key: "jwt-security", tone: "warning", title: "JWT", value: "Off" },
      { key: "published-directory", tone: "error", title: "Pub" },
      { key: "sites-directory", tone: "ok", title: "Sites" },
      { key: "config-directory", tone: "ok", title: "Config" },
      { key: "config-directory-path", tone: "info", title: "Config path" },
      { key: "php-curl", tone: "ok", title: "cURL" },
      { key: "something-new", tone: "info", title: "New" },
    ]);
    const sections = el._statusSections();
    expect(sections.map((section) => section.id)).to.deep.equal([
      "attention",
      "environment",
      "directories",
      "other",
    ]);
    // errors before warnings
    expect(sections[0].rows.map((row) => row.key)).to.deep.equal([
      "published-directory",
      "jwt-security",
    ]);
    // the duplicate config directory row is folded into the checked one
    expect(
      el
        ._visibleStatusRows()
        .some((row) => row.key === "config-directory-path"),
    ).to.equal(false);
    expect(el._statusCounts()).to.deep.equal({
      error: 1,
      warning: 1,
      ok: 3,
      info: 2,
    });
  });

  it("reads server upload limits in the forms both backends report", () => {
    expect(el._parseSizeMb("50mb")).to.equal(50);
    expect(el._parseSizeMb("64M")).to.equal(64);
    expect(el._parseSizeMb("2G")).to.equal(2048);
    expect(el._parseSizeMb("512K")).to.equal(0.5);
    expect(el._parseSizeMb("unlimited")).to.equal(null);
  });

  it("stages media edits, names them, and discards back to what loaded", () => {
    el._applyMediaSettingsRecord({
      jpegQuality: 80,
      maxUploadSizeMb: 1024,
      acceptedFormats: "jpg,png",
    });
    expect(el._isPanelDirty("media")).to.equal(false);
    el._setPanelPropertyValue("media", "jpegQuality", 70);
    el._setAcceptedFormats(["jpg", "png", "webp"]);
    expect(el._isPanelDirty("media")).to.equal(true);
    expect(el._panelChanges("media")).to.deep.equal([
      el.t.jpegQualityLabel,
      el.t.acceptedFileFormats,
    ]);
    el._discardPanel("media");
    expect(el._isPanelDirty("media")).to.equal(false);
    expect(el._getPanelValue("media").jpegQuality).to.equal(80);
  });

  it("describes skeleton toggles by name and saves the same payload shape", () => {
    const options = el._normalizeSkeletonOptions([
      { title: "Course", machineName: "course", category: ["Course"] },
      { title: "Blog", machineName: "blog", enabled: false },
    ]);
    el.skeletonOptions = options;
    el._syncCheckboxPanelDefaults("skeletons", options);
    expect(options[0].categories).to.deep.equal(["Course"]);
    expect(el._isPanelDirty("skeletons")).to.equal(false);
    el._setPanelPropertyValue("skeletons", options[1].property, true);
    expect(el._panelChanges("skeletons")).to.deep.equal(["Blog on"]);
    expect(
      el._buildSavePayload("skeletons", el._getPanelValue("skeletons")),
    ).to.deep.equal({ enabledSkeletons: ["course", "blog"] });
  });

  it("filters options by text, category and on/off", () => {
    const options = el._normalizeThemeOptions([
      { machineName: "clean-one", name: "Clean One", category: ["Course"] },
      { machineName: "polaris-theme", name: "Polaris", category: ["Website"] },
      { machineName: "journey-theme", name: "Journey", enabled: false },
    ]);
    el.themeOptions = options;
    el._syncCheckboxPanelDefaults("themes", options);
    el._filterView = "category:Course";
    expect(
      el._filteredOptions("themes", options).map((o) => o.machineName),
    ).to.deep.equal(["clean-one"]);
    el._filterView = "off";
    expect(
      el._filteredOptions("themes", options).map((o) => o.machineName),
    ).to.deep.equal(["journey-theme"]);
    el._filterView = "all";
    el._filterText = "pol";
    expect(
      el._filteredOptions("themes", options).map((o) => o.machineName),
    ).to.deep.equal(["polaris-theme"]);
  });

  it("uses the full theme screenshot for cards", () => {
    expect(
      el._themeScreenshotLarge(
        "/lib/theme-screenshots/theme-clean-one-thumb.jpg",
      ),
    ).to.equal("/lib/theme-screenshots/theme-clean-one.jpg");
    expect(el._themeScreenshotLarge("/x/custom.png")).to.equal("/x/custom.png");
  });
});
