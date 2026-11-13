import { expect } from "@open-wc/testing";

// see app-hax.test.js: no demo session, so nothing reloads the page
globalThis.appSettings = {};

const { store } = await import("../lib/v2/AppHaxStore.js");
const { AppHaxUseCaseFilter } =
  await import("../lib/v2/app-hax-use-case-filter.js");
const { MicroFrontendRegistry } =
  await import("@haxtheweb/micro-frontend-registry/micro-frontend-registry.js");
const {
  fileExtension,
  dragTypeLabel,
  dragTypeMakesSite,
  isImportUrl,
  fileRows,
  goToSiteRows,
} = await import("../lib/v2/app-hax-dashboard-programs.js");
await import("../app-hax.js");

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
