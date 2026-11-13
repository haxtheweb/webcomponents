import { expect } from "@open-wc/testing";

// see app-hax.test.js: no demo session, so nothing reloads the page
globalThis.appSettings = {};

const { store } = await import("../lib/v2/AppHaxStore.js");
const { AppHaxUseCaseFilter } =
  await import("../lib/v2/app-hax-use-case-filter.js");
const { MicroFrontendRegistry } =
  await import("@haxtheweb/micro-frontend-registry/micro-frontend-registry.js");
const { AppHaxImportUrlDialog } =
  await import("../lib/v2/app-hax-import-url-dialog.js");
const {
  siteRows,
  SITE_OPTIONS,
  fileExtension,
  dragTypeLabel,
  dragTypeMakesSite,
  isImportUrl,
  fileRows,
  goToSiteRows,
} = await import("../lib/v2/app-hax-dashboard-programs.js");
await import("../app-hax.js");
const { SuperDaemonInstance } =
  await import("@haxtheweb/super-daemon/super-daemon.js");

const DOCX =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function createFilter() {
  const el = new AppHaxUseCaseFilter();
  el.items = [];
  el.filteredItems = [];
  return el;
}

describe("dashboard Merlin: file types", () => {
  it("reads a file's extension", () => {
    expect(fileExtension("unit-3.outline.DOCX")).to.equal("docx");
    expect(fileExtension("README")).to.equal("");
    expect(fileExtension(null)).to.equal("");
  });

  it("names a dragged type and says if it makes a site", () => {
    expect(dragTypeLabel(DOCX)).to.equal(".docx");
    expect(dragTypeMakesSite(DOCX)).to.equal(true);
    expect(dragTypeMakesSite("application/pdf")).to.equal(true);
    expect(dragTypeMakesSite("text/html")).to.equal(true);
    expect(dragTypeMakesSite("image/png")).to.equal(false);
    expect(dragTypeMakesSite("")).to.equal(false);
  });

  it("only hands importers http(s) URLs", () => {
    expect(isImportUrl("https://news.example.edu")).to.equal(true);
    expect(isImportUrl(" http://example.org/x ")).to.equal(true);
    expect(isImportUrl("javascript:alert(1)")).to.equal(false);
    expect(isImportUrl("news.example.edu")).to.equal(false);
    expect(isImportUrl("")).to.equal(false);
  });
});

describe("app-hax-use-case-filter: importers for Merlin", () => {
  let el;
  beforeEach(() => {
    el = createFilter();
  });

  it("finds the file importer from a file name", () => {
    expect(el.importItemForFileName("a.docx").importType).to.equal("docx");
    expect(el.importItemForFileName("a.PDF").importType).to.equal("pdf");
    expect(el.importItemForFileName("a.pptx").importType).to.equal("pptx");
    expect(el.importItemForFileName("a.xlsx").importType).to.equal("xlsx");
    const htm = el.importItemForFileName("page.htm");
    expect(htm.importType).to.equal("html");
    expect(htm.importKind).to.equal("file");
    expect(el.importItemForFileName("map.png")).to.equal(null);
    expect(el.importItemForFileName("noextension")).to.equal(null);
  });

  it("finds an importer by kind and type", () => {
    expect(el.importItemFor("url", "wordpress").callback).to.equal(
      "@system/wordpressToSite",
    );
    expect(el.importItemFor("url", "html").importKind).to.equal("url");
    expect(el.importItemFor("file", "html").importKind).to.equal("file");
    expect(el.importItemFor("url", "nope")).to.equal(null);
  });

  describe("processImportTemplate with a preset", () => {
    let calls;
    let originalCall;
    let modal;
    beforeEach(() => {
      calls = [];
      originalCall = MicroFrontendRegistry.call;
      MicroFrontendRegistry.call = async (name, params) => {
        calls.push({ name, params });
        return {
          status: 200,
          data: { items: [{ id: "a", title: "A" }], filename: "unit-3.docx" },
        };
      };
      modal = { openModal: () => (modal.opened = true) };
    });
    afterEach(() => {
      MicroFrontendRegistry.call = originalCall;
      store.clearProcessingVisual();
    });

    it("uses a dropped file instead of opening the picker", async () => {
      const file = new File(["x"], "unit-3.docx");
      await el.processImportTemplate(el.importItemFor("file", "docx"), modal, {
        file,
      });
      expect(calls.length).to.equal(1);
      expect(calls[0].name).to.equal("@system/importDocx");
      expect(calls[0].params.get("upload")).to.equal(file);
      expect(modal.opened).to.equal(true);
      expect(modal.siteName).to.equal("unit 3");
    });

    it("uses a URL typed in Merlin instead of prompting", async () => {
      const item = el.importItemFor("url", "wordpress");
      await el.processImportTemplate(item, modal, {
        url: "https://news.example.edu",
      });
      expect(calls.length).to.equal(1);
      expect(calls[0].name).to.equal("@system/wordpressToSite");
      expect(calls[0].params[item.param || "repoUrl"]).to.equal(
        "https://news.example.edu",
      );
    });
  });
});

describe("app-hax: Merlin in the dashboard bar", () => {
  let el;
  beforeEach(async () => {
    el = document.createElement("app-hax");
    document.body.appendChild(el);
    await el.updateComplete;
  });
  afterEach(() => {
    el.remove();
  });

  it("puts app-header-pre after the character and app-header-post before the HAX mark", () => {
    const left = el.shadowRoot.querySelector(".left-group");
    const leftOrder = Array.from(left.children).map(
      (n) => n.getAttribute("name") || n.localName,
    );
    expect(leftOrder.indexOf("app-hax-user-menu")).to.be.lessThan(
      leftOrder.indexOf("app-header-pre"),
    );
    const right = el.shadowRoot.querySelector(".right-group");
    const rightOrder = Array.from(right.children).map(
      (n) => n.getAttribute("name") || n.className || n.localName,
    );
    expect(rightOrder).to.deep.equal(["app-header-post", "haxLogo"]);
  });

  it("lists the dashboard operations before Community, with no Editor group", () => {
    const options = SuperDaemonInstance.allItems;
    const community = options.filter((o) => o.path.indexOf("Community/") === 0);
    expect(community.length).to.be.greaterThan(0);
    expect(
      options.some((o) => (o.path || "").indexOf("HAX/community") === 0),
    ).to.equal(false);
    expect(
      options.some((o) =>
        /pedagogy|Teaching Excellence/.test(`${o.path} ${o.title}`),
      ),
    ).to.equal(false);
    community.forEach((o) => expect(o.priority).to.be.greaterThan(0));
    // the site operations are commands too, so / Commands is never empty
    const copy = options.find((o) => o.path === "Sites/Copy a site");
    expect(copy.context).to.include("/");
    expect(copy.priority).to.be.lessThan(0);
  });

  it("puts Merlin's field where the title was", () => {
    const center = el.shadowRoot.querySelector('[slot="center"]');
    expect(center.querySelector("super-daemon-search#merlinsearch")).to.exist;
    expect(center.querySelector("a")).to.equal(null);
  });

  it("says what a drop will do while a file is dragged", async () => {
    expect(el._merlinPlaceholder()).to.equal("Search or drop a file");
    el.fileDragActive = true;
    el.fileDragType = DOCX;
    expect(el._merlinPlaceholder()).to.equal("Drop .docx to make a site");
    await el.updateComplete;
    const veil = el.shadowRoot.querySelector(".file-drop-veil");
    expect(veil).to.exist;
    expect(veil.textContent).to.contain(
      "Drop to make a site from this .docx file",
    );
    el.fileDragType = "image/png";
    expect(el._merlinPlaceholder()).to.equal(
      "Drop a file to see what HAX can do with it",
    );
    el._resetFileDrag();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".file-drop-veil")).to.equal(null);
  });

  it("gets a drop even when a later window listener stops it", async () => {
    // user-scaffold's window drop listener calls stopImmediatePropagation
    const stopper = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    globalThis.addEventListener("drop", stopper);
    const dropped = [];
    const originalFileToSite = el.fileToSite;
    const originalAllowed = el._fileDropAllowed;
    el.fileToSite = (file) => dropped.push(file.name);
    el._fileDropAllowed = () => true;
    try {
      const dt = new DataTransfer();
      dt.items.add(new File(["x"], "unit-3.docx", { type: DOCX }));
      const target = el.shadowRoot.querySelector("main") || el;
      target.dispatchEvent(
        new DragEvent("dragenter", {
          bubbles: true,
          composed: true,
          cancelable: true,
          dataTransfer: dt,
        }),
      );
      expect(el.fileDragActive).to.equal(true);
      target.dispatchEvent(
        new DragEvent("drop", {
          bubbles: true,
          composed: true,
          cancelable: true,
          dataTransfer: dt,
        }),
      );
      expect(dropped).to.deep.equal(["unit-3.docx"]);
      expect(el.fileDragActive).to.equal(false);
    } finally {
      globalThis.removeEventListener("drop", stopper);
      el.fileToSite = originalFileToSite;
      el._fileDropAllowed = originalAllowed;
    }
  });

  it("clears the drop state when a drag stops without a drop", async () => {
    const originalAllowed = el._fileDropAllowed;
    el._fileDropAllowed = () => true;
    try {
      const dt = new DataTransfer();
      dt.items.add(new File(["x"], "unit-3.docx", { type: DOCX }));
      el.dispatchEvent(
        new DragEvent("dragenter", {
          bubbles: true,
          composed: true,
          dataTransfer: dt,
        }),
      );
      expect(el.fileDragActive).to.equal(true);
      await new Promise((r) => setTimeout(r, 1100));
      expect(el.fileDragActive).to.equal(false);
    } finally {
      el._fileDropAllowed = originalAllowed;
    }
  });

  it("offers to make a site from a file an importer takes", () => {
    const rows = fileRows(el, new File(["x"], "unit-3-outline.docx"));
    expect(rows[0].title).to.equal("Create a site from unit-3-outline.docx");
    expect(rows[0].value.method).to.equal("importFileToSite");
    expect(rows[0].path).to.equal("Import/Word Doc");
    expect(rows.map((r) => r.value.method)).to.deep.equal([
      "importFileToSite",
      "chooseFileForSite",
      "showImportOptions",
    ]);
  });

  it("says when no importer takes a file, and offers the way on", () => {
    const rows = fileRows(el, new File(["x"], "campus-map.png"));
    expect(rows.map((r) => r.value.method)).to.deep.equal([
      "chooseFileForSite",
      "openImportFromUrl",
    ]);
    expect(rows[0].description).to.equal(
      "HAX can't make a site from a .png file.",
    );
  });

  it("lists sites to go to, filtered by what was typed", () => {
    const original = store.manifest;
    store.manifest = {
      items: [
        {
          title: "Lab Safety",
          slug: "/sites/lab",
          metadata: { site: { name: "lab" } },
        },
        {
          title: "Portfolio",
          slug: "/sites/port",
          metadata: { site: { name: "port" } },
        },
      ],
    };
    try {
      const rows = goToSiteRows(el, store, "lab");
      expect(rows.length).to.equal(1);
      expect(rows[0].path).to.equal("Sites/Go to/Lab Safety");
      expect(rows[0].value.args).to.deep.equal(["/sites/lab"]);
      expect(goToSiteRows(el, store, "").length).to.equal(2);
    } finally {
      store.manifest = original;
    }
  });
});

describe("app-hax-use-case-filter: the two import cards", () => {
  let el;
  beforeEach(async () => {
    el = document.createElement("app-hax-use-case-filter");
    document.body.appendChild(el);
    await el.updateComplete;
  });
  afterEach(() => el.remove());

  it("renders one file card and one URL card", async () => {
    el.filteredItems = el.getImportItems();
    el.items = el.getImportItems();
    await el.updateComplete;
    const cards = el.shadowRoot.querySelectorAll(".import-card");
    expect(cards.length).to.equal(2);
    const fileNames = Array.from(
      cards[0].querySelectorAll(".import-kind-name"),
    ).map((n) => n.textContent.trim());
    expect(fileNames).to.deep.equal([
      "Word Doc",
      "PDF",
      "PowerPoint",
      "Excel",
      "HTML File",
    ]);
    const urlNames = Array.from(
      cards[1].querySelectorAll(".import-kind-name"),
    ).map((n) => n.textContent.trim());
    expect(urlNames[0]).to.equal("WordPress Pages");
    expect(urlNames[urlNames.length - 1]).to.equal("HTML URL");
    expect(urlNames.length).to.equal(11);
    expect(
      el.shadowRoot.querySelectorAll(
        "app-hax-use-case[data-data-type='import']",
      ).length,
    ).to.equal(0);
  });

  it("shows only the card whose importers match", async () => {
    el.items = el.getImportItems();
    await el.updateComplete;
    el.filteredItems = el
      .getImportItems()
      .filter((i) => i.importKind === "url");
    await el.updateComplete;
    const cards = el.shadowRoot.querySelectorAll(".import-card");
    expect(cards.length).to.equal(1);
    expect(cards[0].querySelector("h4").textContent).to.equal("From a URL");
  });

  it("says when no importer takes a picked file", async () => {
    const toasts = [];
    const originalToast = store.toast;
    store.toast = (msg) => toasts.push(msg);
    let started = 0;
    el.startImport = async () => (started += 1);
    try {
      await el.importFile(new File(["x"], "campus-map.png"));
      expect(started).to.equal(0);
      expect(toasts[0]).to.contain("HAX can't make a site from a .png file.");
      await el.importFile(new File(["x"], "notes.docx"));
      expect(started).to.equal(1);
    } finally {
      store.toast = originalToast;
    }
  });

  it("runs the importer for the kind of site picked in the URL dialog", async () => {
    const started = [];
    el.startImport = async (item, preset) =>
      started.push([item.importType, preset.url]);
    const pending = el.importFromUrl();
    await new Promise((r) => setTimeout(r, 0));
    const dialog = document.querySelector("app-hax-import-url-dialog");
    await dialog.updateComplete;
    expect(dialog.kinds.length).to.equal(11);
    dialog.url = "https://news.example.edu";
    dialog.importType = "drupal";
    await dialog.updateComplete;
    dialog._continue();
    await pending;
    expect(started).to.deep.equal([["drupal", "https://news.example.edu"]]);
    expect(document.querySelector("app-hax-import-url-dialog")).to.equal(null);
  });
});

describe("app-hax-import-url-dialog", () => {
  it("continues only with an http(s) URL and a kind of site", async () => {
    const el = new AppHaxImportUrlDialog();
    el.kinds = [
      {
        importType: "wordpress",
        title: "WordPress Pages",
        icon: "hax:wordpress",
      },
    ];
    expect(el._canContinue()).to.equal(false);
    el.url = "javascript:alert(1)";
    el.importType = "wordpress";
    expect(el._canContinue()).to.equal(false);
    el.url = "https://news.example.edu";
    expect(el._canContinue()).to.equal(true);
    el.importType = "";
    expect(el._canContinue()).to.equal(false);
  });

  it("resolves null when cancelled", async () => {
    const el = new AppHaxImportUrlDialog();
    el.labels = { title: "Import from a URL" };
    document.body.appendChild(el);
    const pending = el.ask();
    await el.updateComplete;
    el._cancel();
    expect(await pending).to.equal(null);
  });
});

describe("dashboard Merlin: site options", () => {
  let el;
  let original;
  beforeEach(async () => {
    original = store.manifest;
    store.manifest = {
      items: [
        {
          id: "s1",
          title: "Lab Safety",
          slug: "/sites/lab",
          metadata: { site: { name: "lab" } },
        },
      ],
    };
    el = document.createElement("app-hax");
    document.body.appendChild(el);
    await el.updateComplete;
  });
  afterEach(() => {
    store.manifest = original;
    el.remove();
  });

  it("covers every item of the site options menu", () => {
    expect(SITE_OPTIONS.map((o) => o[0])).to.deep.equal([
      "copy",
      "download",
      "archive",
      "template",
      "access",
    ]);
    expect(siteRows(store, "lab").length).to.equal(1);
    expect(siteRows(store, "zzz").length).to.equal(0);
  });

  it("runs the site bar's own option code for the picked site", () => {
    const Bar = customElements.get("app-hax-site-bar");
    const calls = [];
    const saved = {};
    ["copySite", "downloadSite", "archiveSite", "createTemplate"].forEach(
      (m) => {
        saved[m] = Bar.prototype[m];
        Bar.prototype[m] = function () {
          calls.push([m, this.siteId, this.isConnected]);
        };
      },
    );
    try {
      el.siteOptionFromMerlin("copy", "s1");
      el.siteOptionFromMerlin("download", "s1");
      el.siteOptionFromMerlin("archive", "s1");
      el.siteOptionFromMerlin("template", "s1");
      el.siteOptionFromMerlin("copy", "missing");
    } finally {
      Object.keys(saved).forEach((m) => (Bar.prototype[m] = saved[m]));
    }
    expect(calls).to.deep.equal([
      ["copySite", "s1", false],
      ["downloadSite", "s1", false],
      ["archiveSite", "s1", false],
      ["createTemplate", "s1", false],
    ]);
  });

  it("closing the menu of a site bar off the page does nothing", () => {
    const bar = document.createElement("app-hax-site-bar");
    expect(() => bar.closeOptionsMenu()).not.to.throw();
    expect(() => bar.toggleOptionsMenu()).not.to.throw();
  });
});
