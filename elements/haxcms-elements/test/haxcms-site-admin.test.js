import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import {
  SITE_ADMIN_SECTIONS,
  SITE_ADMIN_ROUTE_CAPABILITIES,
  siteAdminRouteCapability,
  getSiteAdminSection,
  isSiteAdminShellRoute,
  resolveSiteAdminRoute,
} from "../lib/core/admin/site-admin-sections.js";
import "../lib/core/admin/haxcms-site-admin.js";
import "../lib/core/haxcms-site-details-dialog.js";

const MANIFEST = {
  title: "Intro to Biology",
  items: [
    { id: "item-1", title: "Welcome", parent: null },
    { id: "item-2", title: "Unit 1", parent: null },
  ],
  metadata: {
    site: {
      homePageId: "",
      settings: { sw: true, forceUpgrade: false },
    },
  },
};

// the switch _adminRouteCapability used before the registry existed
const PREVIOUS_CAPABILITIES = {
  appearance: "themeManifest",
  "theme-preview": "themeManifest",
  site: "siteManifest",
  blocks: "siteManifest",
  editor: "siteManifest",
  features: null,
  seo: "seoManifest",
  author: "authorManifest",
  structure: "outlineDesigner",
  "structure-import": "outlineDesigner",
  reports: "insights",
  content: null,
  views: null,
  revisions: null,
  transfer: null,
  files: "uploadMedia",
  // not in the old switch, so it fell through to the default
  about: null,
};

async function detailsInShell() {
  const shell = await fixture(
    html`<haxcms-site-admin
      style="--simple-modal-height: 720px"
    ></haxcms-site-admin>`,
  );
  shell.allowRoute = () => true;
  shell.route = "site";
  await waitUntil(() => shell._sectionEl, "section element created");
  await shell.updateComplete;
  const details = shell._sectionEl;
  await details.updateComplete;
  // replace whatever the store autorun loaded with a known manifest
  details.refreshFromManifest(JSON.parse(JSON.stringify(MANIFEST)));
  await details.updateComplete;
  await shell.updateComplete;
  return { shell, details };
}

const saveButton = (shell) => shell.shadowRoot.querySelector(".ftr .save");
const statusText = (shell) =>
  shell.shadowRoot.querySelector(".ftr .st").textContent.replace(/\s+/g, " ");

describe("site admin section registry", () => {
  it("orders sections like other CMS admin menus", () => {
    // dashboard first, then content, structure, media, look; settings
    // and tools under Advanced; help last
    expect(
      SITE_ADMIN_SECTIONS.filter((s) => s.group === "primary").map(
        (s) => s.route,
      ),
    ).to.deep.equal(["reports", "content", "structure", "files", "appearance"]);
    expect(
      SITE_ADMIN_SECTIONS.filter((s) => s.group === "advanced").map(
        (s) => s.route,
      ),
    ).to.deep.equal([
      "views",
      "blocks",
      "features",
      "site",
      "editor",
      "seo",
      "transfer",
    ]);
    expect(
      SITE_ADMIN_SECTIONS.filter((s) => s.group === "help").map((s) => s.route),
    ).to.deep.equal(["about"]);
  });

  it("maps every route to the same capability as before", () => {
    Object.keys(PREVIOUS_CAPABILITIES).forEach((route) => {
      expect(siteAdminRouteCapability(route), route).to.equal(
        PREVIOUS_CAPABILITIES[route],
      );
    });
    // plus the Reports screens, each gated like Reports
    const reportScreens = [
      "reports-accessibility",
      "reports-content",
      "reports-links",
      "reports-media",
      "reports-instructional",
      "reports-freshness",
      "reports-metadata",
      "reports-components",
    ];
    reportScreens.forEach((route) => {
      expect(siteAdminRouteCapability(route), route).to.equal("insights");
    });
    expect(Object.keys(SITE_ADMIN_ROUTE_CAPABILITIES).sort()).to.deep.equal(
      Object.keys(PREVIOUS_CAPABILITIES).concat(reportScreens).sort(),
    );
    expect(siteAdminRouteCapability("nonexistent")).to.equal(null);
    expect(siteAdminRouteCapability("")).to.equal(null);
    expect(siteAdminRouteCapability(undefined)).to.equal(null);
  });

  it("puts every section but Structure in the shell", () => {
    expect(isSiteAdminShellRoute("admin")).to.equal(true);
    SITE_ADMIN_SECTIONS.forEach((s) => {
      expect(isSiteAdminShellRoute(s.route), s.route).to.equal(
        s.route !== "structure",
      );
      if (s.shell) {
        expect(s.tag, s.route).to.be.a("string");
        expect(s.load, s.route).to.be.a("function");
        expect(["form", "selection", "none"], s.route).to.include(s.footer);
      }
    });
    // child and non-launcher routes keep their own openers
    ["structure-import", "theme-preview", "revisions"].forEach((route) => {
      expect(isSiteAdminShellRoute(route), route).to.equal(false);
    });
  });

  it("form sections are the ones that save settings", () => {
    const forms = SITE_ADMIN_SECTIONS.filter((s) => s.footer === "form").map(
      (s) => s.route,
    );
    expect(forms).to.deep.equal([
      "appearance",
      "blocks",
      "features",
      "site",
      "editor",
      "seo",
    ]);
    expect(getSiteAdminSection("files").footer).to.equal("selection");
    expect(getSiteAdminSection("content").footer).to.equal("selection");
  });

  it("renders Author as SEO's child route", () => {
    expect(isSiteAdminShellRoute("author")).to.equal(true);
    const resolved = resolveSiteAdminRoute("author");
    expect(resolved.section.route).to.equal("seo");
    expect(resolved.labelKey).to.equal("author");
    expect(resolveSiteAdminRoute("nope")).to.equal(null);
  });
});

describe("haxcms-site-admin launcher", () => {
  it("shows only the sections Features allow, in registry order", async () => {
    const shell = await fixture(html`<haxcms-site-admin></haxcms-site-admin>`);
    shell.allowRoute = (route) => route !== "files" && route !== "reports";
    await shell.updateComplete;
    const routes = [...shell.shadowRoot.querySelectorAll(".pcard, .acard")].map(
      (b) => b.getAttribute("data-route"),
    );
    // the launcher is the fallback when Reports is off; About comes last
    expect(routes).to.deep.equal([
      "content",
      "structure",
      "appearance",
      "views",
      "blocks",
      "features",
      "site",
      "editor",
      "seo",
      "transfer",
      "about",
    ]);
  });

  it("asks the editor to route when a section is chosen", async () => {
    const shell = await fixture(html`<haxcms-site-admin></haxcms-site-admin>`);
    shell.allowRoute = () => true;
    await shell.updateComplete;
    setTimeout(() =>
      shell.shadowRoot.querySelector('.pcard[data-route="files"]').click(),
    );
    const e = await oneEvent(shell, "haxcms-site-admin-navigate");
    expect(e.detail.route).to.equal("files");
  });

  it("passes the a11y audit", async () => {
    const shell = await fixture(html`<haxcms-site-admin></haxcms-site-admin>`);
    shell.allowRoute = () => true;
    await shell.updateComplete;
    await expect(shell).shadowDom.to.be.accessible();
  });
});

describe("haxcms-site-details-dialog save payload", () => {
  it("fires haxcms-save-site-data with the same payload shape as before", async () => {
    const el = document.createElement("haxcms-site-details-dialog");
    el.refreshFromManifest(JSON.parse(JSON.stringify(MANIFEST)));
    el._setValue("manifest-title", "  Introduction to Biology  ");
    el._setValue("manifest-metadata-site-homePageId", "item-2");
    el._setValue("manifest-metadata-site-settings-sw", false);
    el.inShell = true;
    setTimeout(() => el.save());
    const e = await oneEvent(globalThis, "haxcms-save-site-data");
    expect(e.detail).to.deep.equal({
      title: "Introduction to Biology",
      homePageId: "item-2",
      sw: false,
      forceUpgrade: false,
      manifest: {
        site: {
          "manifest-title": "Introduction to Biology",
          "manifest-metadata-site-homePageId": "item-2",
        },
        seo: {
          "manifest-metadata-site-settings-sw": false,
          "manifest-metadata-site-settings-forceUpgrade": false,
        },
      },
    });
  });

  it("will not save an empty title", () => {
    const el = document.createElement("haxcms-site-details-dialog");
    el.refreshFromManifest(JSON.parse(JSON.stringify(MANIFEST)));
    el._setValue("manifest-title", "   ");
    expect(el.canSave).to.equal(false);
    expect(el.save()).to.equal(false);
  });

  it("reports changes and discards them", async () => {
    const el = document.createElement("haxcms-site-details-dialog");
    el.refreshFromManifest(JSON.parse(JSON.stringify(MANIFEST)));
    setTimeout(() => el._setValue("manifest-title", "New title"));
    const e = await oneEvent(el, "haxcms-admin-section-state");
    expect(e.detail.dirty).to.equal(true);
    expect(e.detail.changes).to.deep.equal(["Title"]);
    expect(e.detail.canSave).to.equal(true);
    el.discard();
    expect(el.values["manifest-title"]).to.equal("Intro to Biology");
    expect(el.changedFields.length).to.equal(0);
  });
});

describe("haxcms-site-admin staged save", () => {
  it("keeps Save quiet until something changes", async () => {
    const { shell, details } = await detailsInShell();
    expect(saveButton(shell).disabled).to.equal(true);
    expect(statusText(shell)).to.contain("No unsaved changes");
    details._setValue("manifest-title", "New title");
    await shell.updateComplete;
    expect(saveButton(shell).disabled).to.equal(false);
    expect(saveButton(shell).classList.contains("primary")).to.equal(true);
    expect(statusText(shell)).to.contain("1 unsaved change");
    expect(statusText(shell)).to.contain("Title");
    expect(
      shell.shadowRoot
        .querySelector('.rail-item[data-route="site"]')
        .getAttribute("aria-current"),
    ).to.equal("page");
  });

  it("stays on the section and shows saved when the save succeeds", async () => {
    const { shell, details } = await detailsInShell();
    details._setValue("manifest-title", "New title");
    await shell.updateComplete;
    saveButton(shell).click();
    expect(shell._status).to.equal("saving");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-admin-save-result", {
        detail: { operation: "@site/updateSiteSummary", ok: true },
      }),
    );
    await shell.updateComplete;
    expect(shell._status).to.equal("saved");
    expect(shell.route).to.equal("site");
    expect(statusText(shell)).to.contain("All changes saved");
  });

  it("keeps the edits and says so when the save fails", async () => {
    const { shell, details } = await detailsInShell();
    details._setValue("manifest-title", "New title");
    await shell.updateComplete;
    saveButton(shell).click();
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-admin-save-result", {
        detail: { operation: "@site/updateSiteSummary", ok: false },
      }),
    );
    await shell.updateComplete;
    expect(shell._status).to.equal("error");
    expect(details.values["manifest-title"]).to.equal("New title");
    expect(statusText(shell)).to.contain("Saving failed.");
    expect(shell.hasUnsavedChanges).to.equal(true);
  });

  it("passes the a11y audit with unsaved changes", async () => {
    const { shell, details } = await detailsInShell();
    details._setValue("manifest-title", "New title");
    await shell.updateComplete;
    await expect(shell).shadowDom.to.be.accessible();
  });
});

describe("haxcms-site-admin leaving with unsaved changes", () => {
  it("asks first, and Stay keeps the edits", async () => {
    const { shell, details } = await detailsInShell();
    details._setValue("manifest-title", "New title");
    await shell.updateComplete;
    let navigated = false;
    shell.addEventListener("haxcms-site-admin-navigate", () => {
      navigated = true;
    });
    shell.shadowRoot.querySelector('.rail-item[data-route="files"]').click();
    await shell.updateComplete;
    expect(navigated).to.equal(false);
    expect(shell.shadowRoot.querySelector('[role="alertdialog"]')).to.exist;
    shell.shadowRoot.querySelector(".leave .stay").click();
    await shell.updateComplete;
    expect(shell.shadowRoot.querySelector('[role="alertdialog"]')).to.not.exist;
    expect(details.values["manifest-title"]).to.equal("New title");
  });

  it("Discard and leave restores the values and goes", async () => {
    const { shell, details } = await detailsInShell();
    details._setValue("manifest-title", "New title");
    await shell.updateComplete;
    shell.shadowRoot.querySelector('.rail-item[data-route="files"]').click();
    await shell.updateComplete;
    setTimeout(() =>
      shell.shadowRoot.querySelector(".leave .discard-leave").click(),
    );
    const e = await oneEvent(shell, "haxcms-site-admin-navigate");
    expect(e.detail.route).to.equal("files");
    expect(details.values["manifest-title"]).to.equal("Intro to Biology");
  });

  it("Save and leave saves, then goes once the save succeeds", async () => {
    const { shell, details } = await detailsInShell();
    details._setValue("manifest-title", "New title");
    await shell.updateComplete;
    let saves = 0;
    const countSave = () => {
      saves++;
    };
    globalThis.addEventListener("haxcms-save-site-data", countSave);
    let navigated = false;
    shell.addEventListener("haxcms-site-admin-navigate", () => {
      navigated = true;
    });
    shell.shadowRoot.querySelector('.rail-item[data-route="files"]').click();
    await shell.updateComplete;
    shell.shadowRoot.querySelector(".leave .save-leave").click();
    expect(saves).to.equal(1);
    expect(navigated).to.equal(false);
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-admin-save-result", { detail: { ok: true } }),
    );
    expect(navigated).to.equal(true);
    globalThis.removeEventListener("haxcms-save-site-data", countSave);
  });

  it("holds the dialog open when it is closed with unsaved changes", async () => {
    const { shell, details } = await detailsInShell();
    details._setValue("manifest-title", "New title");
    await shell.updateComplete;
    const closeRequest = new CustomEvent("simple-modal-will-close", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {},
    });
    globalThis.dispatchEvent(closeRequest);
    expect(closeRequest.defaultPrevented).to.equal(true);
    await shell.updateComplete;
    expect(shell.shadowRoot.querySelector('[role="alertdialog"]')).to.exist;
  });

  it("lets the dialog close when nothing is unsaved", async () => {
    const { shell } = await detailsInShell();
    const closeRequest = new CustomEvent("simple-modal-will-close", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {},
    });
    globalThis.dispatchEvent(closeRequest);
    expect(closeRequest.defaultPrevented).to.equal(false);
    expect(shell.requestLeave(() => {})).to.equal(true);
  });
});

/**
 * A stand-in section for shell tests, so they do not depend on what a real
 * section renders. Swapped into a registry entry and restored after.
 */
class FakeAdminSection extends HTMLElement {
  constructor() {
    super();
    this.calls = [];
  }
  emit(detail) {
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        detail: detail,
      }),
    );
  }
  clearSelection() {
    this.calls.push(["clear"]);
  }
  runAction(id) {
    this.calls.push(["action", id]);
  }
  runHeaderAction(id) {
    this.calls.push(["header", id]);
  }
}
if (!globalThis.customElements.get("fake-admin-section")) {
  globalThis.customElements.define("fake-admin-section", FakeAdminSection);
}

async function fakeSectionShell(route, registryRoute = route) {
  const entry = getSiteAdminSection(registryRoute);
  const original = { tag: entry.tag, load: entry.load };
  entry.tag = "fake-admin-section";
  entry.load = () => Promise.resolve();
  const configured = [];
  const shell = await fixture(
    html`<haxcms-site-admin
      style="--simple-modal-height: 720px"
    ></haxcms-site-admin>`,
  );
  shell.allowRoute = () => true;
  shell.configureSection = (r, el) => {
    configured.push([r, el.isConnected, el.inShell]);
  };
  shell.route = route;
  await waitUntil(() => shell._sectionEl, "section element created");
  await shell.updateComplete;
  const restore = () => {
    entry.tag = original.tag;
    entry.load = original.load;
  };
  return { shell, section: shell._sectionEl, configured, restore };
}

describe("haxcms-site-admin hosting", () => {
  it("configures a section before it connects", async () => {
    const { shell, section, configured, restore } =
      await fakeSectionShell("views");
    restore();
    expect(configured).to.deep.equal([["views", false, true]]);
    expect(section.parentNode).to.equal(shell);
    expect(shell.shadowRoot.querySelector(".ftr")).to.equal(null);
    expect(shell.shadowRoot.querySelector(".ph h2").textContent).to.contain(
      "Views",
    );
  });

  it("renders a child route under its parent in the rail", async () => {
    const { shell, restore } = await fakeSectionShell("author", "seo");
    restore();
    expect(shell.shadowRoot.querySelector(".ph h2").textContent).to.contain(
      "Author",
    );
    // the section is marked as the one you are in, the child as the page
    expect(
      shell.shadowRoot
        .querySelector('.rail-row .rail-item[data-route="seo"]')
        .getAttribute("aria-current"),
    ).to.equal("true");
    expect(
      shell.shadowRoot
        .querySelector('.rail-item.sub[data-route="author"]')
        .getAttribute("aria-current"),
    ).to.equal("page");
  });

  it("drops its header for sections that draw their own", async () => {
    const entry = getSiteAdminSection("views");
    entry.header = false;
    const { shell, restore } = await fakeSectionShell("views");
    restore();
    delete entry.header;
    expect(shell.shadowRoot.querySelector(".ph")).to.equal(null);
  });

  it("rebuilds the section on reload", async () => {
    const { shell, section, configured, restore } =
      await fakeSectionShell("about");
    await shell.reload();
    restore();
    expect(configured.length).to.equal(2);
    expect(shell._sectionEl).to.not.equal(section);
    expect(section.parentNode).to.equal(null);
  });

  it("shows header actions and runs them on the section", async () => {
    const { shell, section, restore } = await fakeSectionShell("features");
    restore();
    section.emit({
      headerActions: [{ id: "skeleton", label: "Download skeleton" }],
    });
    await shell.updateComplete;
    const button = shell.shadowRoot.querySelector(
      '.header-action[data-action="skeleton"]',
    );
    expect(button.textContent).to.contain("Download skeleton");
    button.click();
    expect(section.calls).to.deep.equal([["header", "skeleton"]]);
    // header actions alone do not make a form section dirty
    expect(shell._status).to.equal("clean");
  });

  it("runs the selection bar through the section", async () => {
    const { shell, section, restore } = await fakeSectionShell("files");
    restore();
    const bar = () => shell.shadowRoot.querySelector(".ftr.selection");
    expect(bar().textContent).to.contain("Nothing selected");
    section.emit({
      selected: 0,
      actions: [
        { id: "move", label: "Move", icon: "hax:admin-files" },
        { id: "delete", label: "Delete", danger: true },
      ],
    });
    await shell.updateComplete;
    const move = bar().querySelector('[data-action="move"]');
    expect(move.disabled).to.equal(true);
    expect(bar().querySelector(".clear")).to.equal(null);
    section.emit({ selected: 3 });
    await shell.updateComplete;
    expect(bar().textContent).to.contain("3 selected");
    expect(move.disabled).to.equal(false);
    expect(
      bar()
        .querySelector('[data-action="delete"]')
        .classList.contains("danger"),
    ).to.equal(true);
    move.click();
    bar().querySelector(".clear").click();
    expect(section.calls).to.deep.equal([["action", "move"], ["clear"]]);
    // a selection section never asks before leaving
    expect(shell.hasUnsavedChanges).to.equal(false);
    section.emit({ selected: 2, selectionText: "2 pages match" });
    await shell.updateComplete;
    expect(bar().textContent).to.contain("2 pages match");
    expect(bar().textContent).to.not.contain("2 selected");
  });
});

describe("haxcms-site-admin nested rail", () => {
  afterEach(() => {
    try {
      globalThis.localStorage.removeItem("haxcms-site-admin-rail-open");
    } catch {
      // storage blocked in this browser
    }
  });

  it("lists a section's parts and resolves Reports screens", () => {
    const reports = getSiteAdminSection("reports");
    // Reports itself is the overview; its screens hang under it
    expect(reports.children.map((c) => c.route)).to.deep.equal([
      "reports-accessibility",
      "reports-content",
      "reports-links",
      "reports-media",
      "reports-instructional",
      "reports-freshness",
      "reports-metadata",
      "reports-components",
    ]);
    const resolved = resolveSiteAdminRoute("reports-media");
    expect(resolved.section.route).to.equal("reports");
    expect(resolved.labelKey).to.equal("reportsMedia");
    expect(isSiteAdminShellRoute("reports-media")).to.equal(true);
    // author keeps its own gate, not SEO's
    expect(siteAdminRouteCapability("author")).to.equal("authorManifest");
  });

  it("opens the current section's parts and toggles others", async () => {
    const { shell, restore } = await fakeSectionShell("about");
    restore();
    const root = shell.shadowRoot;
    expect(root.querySelector("#sub-about")).to.exist;
    expect(
      root
        .querySelector('.rail-toggle[data-route="about"]')
        .getAttribute("aria-expanded"),
    ).to.equal("true");
    expect(root.querySelector("#sub-reports")).to.equal(null);
    const toggle = root.querySelector('.rail-toggle[data-route="reports"]');
    expect(toggle.getAttribute("aria-label")).to.contain("Reports");
    toggle.click();
    await shell.updateComplete;
    expect(
      root.querySelectorAll("#sub-reports .rail-item.sub").length,
    ).to.equal(8);
    // remembered for the next dialog
    expect(
      JSON.parse(
        globalThis.localStorage.getItem("haxcms-site-admin-rail-open"),
      ),
    ).to.include("reports");
    root.querySelector('.rail-toggle[data-route="reports"]').click();
    await shell.updateComplete;
    expect(root.querySelector("#sub-reports")).to.equal(null);
  });

  it("lists a section's parts in its hover text", async () => {
    const { shell, restore } = await fakeSectionShell("about");
    restore();
    const title = shell.shadowRoot
      .querySelector('.rail-row .rail-item[data-route="transfer"]')
      .getAttribute("title");
    expect(title).to.contain("Includes: Import, Export this page");
  });

  it("scrolls to a part on the open section and opens its group", async () => {
    const { shell, section, restore } = await fakeSectionShell("about");
    restore();
    section.attachShadow({ mode: "open" });
    section.shadowRoot.innerHTML = `<details data-group="shortcuts"><summary>Keys</summary><p>x</p></details>`;
    shell.shadowRoot
      .querySelector('.rail-item.sub[data-child="shortcuts"]')
      .click();
    await waitUntil(() => shell._anchor === "shortcuts", "revealed");
    expect(section.shadowRoot.querySelector("details").open).to.equal(true);
    await shell.updateComplete;
    expect(
      shell.shadowRoot
        .querySelector('.rail-item.sub[data-child="shortcuts"]')
        .getAttribute("aria-current"),
    ).to.equal("location");
  });

  it("goes to another section before scrolling to its part", async () => {
    const { shell, restore } = await fakeSectionShell("about");
    restore();
    const routes = [];
    shell.addEventListener("haxcms-site-admin-navigate", (e) =>
      routes.push(e.detail.route),
    );
    shell._toggleExpanded("transfer");
    await shell.updateComplete;
    shell.shadowRoot
      .querySelector('.rail-item.sub[data-child="export-site"]')
      .click();
    expect(routes).to.deep.equal(["transfer"]);
    expect(shell.__pendingAnchor).to.deep.equal({
      anchor: "export-site",
      key: "export-site",
    });
  });

  it("shows counts a section reports for its parts", async () => {
    const { shell, section, restore } = await fakeSectionShell("reports");
    restore();
    section.emit({
      railBadges: {
        "reports-accessibility": { badge: 31, tone: "danger" },
        "reports-media": { badge: 0, tone: "" },
      },
    });
    await shell.updateComplete;
    const badge = shell.shadowRoot.querySelector(
      '.rail-item.sub[data-route="reports-accessibility"] .rail-badge',
    );
    expect(badge.textContent.trim()).to.equal("31");
    expect(badge.getAttribute("data-tone")).to.equal("danger");
    expect(
      shell.shadowRoot.querySelector(
        '.rail-item.sub[data-route="reports-media"] .rail-badge',
      ),
    ).to.equal(null);
  });
});

describe("haxcms-site-admin help group", () => {
  it("puts About on its own at the bottom of the rail", async () => {
    const { shell, restore } = await fakeSectionShell("views");
    restore();
    const help = shell.shadowRoot.querySelector(".rail-help");
    expect(help).to.exist;
    expect(help.querySelector('.rail-item[data-route="about"]')).to.exist;
    const items = [
      ...shell.shadowRoot.querySelectorAll(".rail-row .rail-item"),
    ].map((b) => b.dataset.route);
    expect(items[0]).to.equal("reports");
    expect(items[items.length - 1]).to.equal("about");
  });
});
