import { expect } from "@open-wc/testing";
import { toJS } from "mobx";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { store } from "../lib/core/haxcms-site-store.js";
import {
  IMPORT_WORKFLOWS,
  PAGE_EXPORT_FORMATS,
  SITE_EXPORT_FORMATS,
} from "../lib/core/utils/import-export-options.js";
import {
  createExportPageProgram,
  exportPageAs,
  _pageRouteVariantExtension,
  _pageRouteVariantMimeType,
  _pageRouteVariantUrl,
  _pageItemExportUrl,
} from "../lib/core/utils/ExportPageProgram.js";
import {
  createExportSiteProgram,
  exportSiteAs,
} from "../lib/core/utils/ExportSiteProgram.js";

// import-export-options.js is the one catalog of import workflows and
// page / site export formats; the import-export dashboard and the Merlin
// export programs both build their lists from it, and exportPageAs() /
// exportSiteAs() dispatch on its `format` values. These tests keep the
// catalog and the dispatchers in step: every format a user can pick has to
// reach a real export path instead of the "not supported" toast, and the
// Merlin listings have to filter, translate and target the right method.
// (export-programs-auth.test.js covers the JWT on each export request.)

const NOT_SUPPORTED = /not supported/;

function makeManifest() {
  return {
    id: "io-site",
    title: "IO Site",
    metadata: {
      site: { name: "io-site" },
      theme: { element: "clean-one", variables: {} },
    },
    items: [
      {
        id: "page one/1",
        title: "Page One",
        slug: "page-one",
        location: "pages/page-one/index.html",
        order: 0,
        parent: null,
        indent: 0,
        metadata: {},
      },
    ],
  };
}

function okResponse() {
  return {
    ok: true,
    status: 200,
    text: async () => "content",
    blob: async () => new Blob(["bytes"]),
    json: async () => ({}),
  };
}

describe("import / export catalog and programs", () => {
  let saved;
  let toasts;
  let fetched;

  beforeEach(() => {
    saved = {
      manifest: toJS(store.manifest),
      activeId: store.activeId,
      fetch: globalThis.fetch,
      toast: Object.prototype.hasOwnProperty.call(HAXStore, "toast")
        ? HAXStore.toast
        : undefined,
    };
    toasts = [];
    HAXStore.toast = (message) => {
      toasts.push(String(message));
    };
    fetched = [];
    globalThis.fetch = async (url) => {
      fetched.push(String(url));
      return okResponse();
    };
    store.manifest = makeManifest();
    store.activeId = "page one/1";
  });

  afterEach(() => {
    if (saved.toast === undefined) {
      delete HAXStore.toast;
    } else {
      HAXStore.toast = saved.toast;
    }
    globalThis.fetch = saved.fetch;
    store.activeId = saved.activeId;
    store.manifest = saved.manifest;
  });

  describe("catalog", () => {
    const lists = [
      ["IMPORT_WORKFLOWS", IMPORT_WORKFLOWS, "action"],
      ["PAGE_EXPORT_FORMATS", PAGE_EXPORT_FORMATS, "format"],
      ["SITE_EXPORT_FORMATS", SITE_EXPORT_FORMATS, "format"],
    ];
    lists.forEach(([name, list, key]) => {
      it(`${name} entries are complete and unique`, () => {
        expect(list.length).to.be.greaterThan(0);
        const keys = new Set();
        const tKeys = new Set();
        list.forEach((entry) => {
          ["tKey", "title", "description", key].forEach((field) => {
            expect(entry[field], `${name} ${field}`).to.be.a("string");
            expect(entry[field].trim(), `${name} ${field}`).to.not.equal("");
          });
          expect(entry.icon, `${name} ${entry[key]} icon`).to.exist;
          keys.add(entry[key]);
          tKeys.add(entry.tKey);
        });
        expect(keys.size, `${name} ${key} values`).to.equal(list.length);
        expect(tKeys.size, `${name} tKeys`).to.equal(list.length);
      });
    });

    it("only flags the HAX schema copy as developer-only", () => {
      expect(
        PAGE_EXPORT_FORMATS.filter((f) => f.developerOnly).map((f) => f.format),
      ).to.deep.equal(["haxschema"]);
      expect(SITE_EXPORT_FORMATS.filter((f) => f.developerOnly)).to.deep.equal(
        [],
      );
    });

    it("keeps the import workflows the dashboard handles", () => {
      expect(IMPORT_WORKFLOWS.map((w) => w.action)).to.deep.equal([
        "import-file",
        "import-link",
      ]);
    });
  });

  describe("Merlin export page program", () => {
    it("lists every page format calling exportPageAs on the context", async () => {
      const context = { t: {} };
      const results = await createExportPageProgram(context)("");
      expect(results.map((r) => r.value.args[0])).to.deep.equal(
        PAGE_EXPORT_FORMATS.map((f) => f.format),
      );
      results.forEach((r, i) => {
        const f = PAGE_EXPORT_FORMATS[i];
        expect(r.title).to.equal(f.title);
        expect(r.more).to.equal(f.description);
        expect(r.icon).to.equal(f.icon);
        expect(r.value.target).to.equal(context);
        expect(r.value.method).to.equal("exportPageAs");
        expect(r.eventName).to.equal("super-daemon-element-method");
        expect(r.path).to.equal(`CMS/export/page/${f.format}`);
        expect(r.tags).to.deep.equal(["export", "page", f.format]);
        expect(r.context).to.deep.equal(["CMS", "HAX"]);
      });
    });

    it("filters by title or format id, ignoring case", async () => {
      const program = createExportPageProgram({ t: {} });
      expect((await program("PDF")).map((r) => r.value.args[0])).to.deep.equal([
        "pdf",
      ]);
      expect(
        (await program("markdown")).map((r) => r.value.args[0]),
      ).to.deep.equal(["markdown"]);
      expect(
        (await program("haxschema")).map((r) => r.value.args[0]),
      ).to.deep.equal(["haxschema"]);
      expect(await program("no-such-format")).to.deep.equal([]);
    });

    it("uses translated titles and descriptions and matches on them", async () => {
      const program = createExportPageProgram({
        t: {
          exportPagePdfTitle: "Als PDF exportieren",
          exportPagePdfDescription: "Seite als PDF herunterladen",
        },
      });
      const results = await program("exportieren");
      expect(results.length).to.equal(1);
      expect(results[0].title).to.equal("Als PDF exportieren");
      expect(results[0].more).to.equal("Seite als PDF herunterladen");
      // the English title still matches
      expect((await program("export as pdf")).length).to.equal(1);
    });
  });

  describe("Merlin export site program", () => {
    it("lists every site format calling exportSiteAs on the context", async () => {
      const context = { t: {} };
      const results = await createExportSiteProgram(context)("");
      expect(results.map((r) => r.value.args[0])).to.deep.equal(
        SITE_EXPORT_FORMATS.map((f) => f.format),
      );
      results.forEach((r, i) => {
        const f = SITE_EXPORT_FORMATS[i];
        expect(r.value.target).to.equal(context);
        expect(r.value.method).to.equal("exportSiteAs");
        expect(r.path).to.equal(`CMS/export/site/${f.format}`);
        expect(r.tags).to.deep.equal(["export", "site", f.format]);
        expect(r.context).to.deep.equal(["CMS"]);
      });
    });

    it("filters and translates like the page program", async () => {
      const program = createExportSiteProgram({
        t: { exportSiteSkeletonTitle: "Vorlage exportieren" },
      });
      expect((await program("zip")).map((r) => r.value.args[0])).to.deep.equal([
        "zip",
      ]);
      const translated = await program("vorlage");
      expect(translated.map((r) => r.value.args[0])).to.deep.equal([
        "skeleton",
      ]);
      expect(translated[0].title).to.equal("Vorlage exportieren");
    });
  });

  describe("exportSiteAs dispatch", () => {
    const handlerFor = {
      html: "_exportSiteAsHTML",
      markdown: "_exportSiteAsMarkdown",
      docx: "_exportSiteAsDOCX",
      pdf: "_exportSiteAsPDF",
      epub: "_exportSiteAsEPUB",
      zip: "_downloadSiteArchive",
      skeleton: "_exportSiteAsSkeleton",
    };
    function recordingHost() {
      const calls = [];
      const host = { t: {}, calls };
      Object.values(handlerFor).forEach((name) => {
        host[name] = async (...args) => {
          calls.push({ name, args });
        };
      });
      return host;
    }

    it("has a handler for every site format in the catalog", () => {
      SITE_EXPORT_FORMATS.forEach((f) => {
        expect(handlerFor, `site format ${f.format}`).to.have.property(
          f.format,
        );
      });
    });

    SITE_EXPORT_FORMATS.forEach((f) => {
      it(`routes "${f.format}" to its export handler`, async () => {
        const host = recordingHost();
        await exportSiteAs.call(host, f.format, { from: "test" });
        expect(host.calls.map((c) => c.name)).to.deep.equal([
          handlerFor[f.format],
        ]);
        expect(toasts.filter((t) => NOT_SUPPORTED.test(t))).to.deep.equal([]);
        const args = host.calls[0].args;
        if (f.format === "zip") {
          expect(args).to.deep.equal([]);
        } else {
          expect(args[0].id).to.equal("io-site");
          expect(args[1]).to.equal("IO Site");
          expect(args[2]).to.be.a("string");
        }
        if (f.format === "skeleton") {
          expect(args[3]).to.deep.equal({ from: "test" });
        }
      });
    });

    it("says an unknown format is not supported", async () => {
      const host = recordingHost();
      await exportSiteAs.call(host, "bogus");
      expect(host.calls).to.deep.equal([]);
      expect(toasts).to.deep.equal(['Export format "bogus" not supported']);
    });

    it("stops when there is no site manifest", async () => {
      store.manifest = {};
      const host = recordingHost();
      await exportSiteAs.call(host, "html");
      expect(host.calls).to.deep.equal([]);
      expect(toasts).to.deep.equal(["Site manifest not available for export"]);
    });

    it("reports a handler failure with its message", async () => {
      const host = recordingHost();
      host._exportSiteAsPDF = async () => {
        throw new Error("printer on fire");
      };
      await exportSiteAs.call(host, "pdf");
      expect(toasts).to.deep.equal(["Site export failed: printer on fire"]);
    });

    it("uses the host's translations for its messages", async () => {
      const host = recordingHost();
      host.t = { exportFormatNotSupported: "Format {format} fehlt" };
      await exportSiteAs.call(host, "$&");
      expect(toasts).to.deep.equal(["Format $& fehlt"]);
    });
  });

  describe("exportPageAs dispatch", () => {
    function pageHost() {
      return {
        t: {},
        downloads: [],
        setProcessingVisual() {},
        clearProcessingVisual() {},
        _downloadFile(content, filename, mime) {
          this.downloads.push({ filename, mime });
        },
        _downloadBlob(blob, filename) {
          this.downloads.push({ filename });
        },
      };
    }

    PAGE_EXPORT_FORMATS.forEach((f) => {
      it(`handles "${f.format}" without the not-supported toast`, async () => {
        await exportPageAs.call(pageHost(), f.format);
        expect(toasts.filter((t) => NOT_SUPPORTED.test(t))).to.deep.equal([]);
      });
    });

    const fileCases = [
      [
        "html",
        "x/api/v1/items/page%20one%2F1/export/html",
        ".html",
        "text/html",
      ],
      [
        "markdown",
        "x/api/v1/items/page%20one%2F1/export/md",
        ".md",
        "text/markdown",
      ],
      [
        "json",
        "x/api/v1/items/page%20one%2F1/export/json",
        ".json",
        "application/json",
      ],
      [
        "yaml",
        "x/api/v1/items/page%20one%2F1/export/yaml",
        ".yaml",
        "application/yaml",
      ],
      [
        "xml",
        "x/api/v1/items/page%20one%2F1/export/xml",
        ".xml",
        "application/xml",
      ],
      ["docx", "x/api/v1/items/page%20one%2F1/export/docx", ".docx", undefined],
      ["pdf", "x/api/v1/items/page%20one%2F1/export/pdf", ".pdf", undefined],
      ["epub", "x/api/v1/items/page%20one%2F1/export/epub", ".epub", undefined],
    ];
    fileCases.forEach(([format, path, ext, mime]) => {
      it(`exports "${format}" from the active page's item route`, async () => {
        const host = pageHost();
        await exportPageAs.call(host, format);
        expect(fetched.length).to.equal(1);
        expect(fetched[0].endsWith(path), fetched[0]).to.equal(true);
        expect(host.downloads.length).to.equal(1);
        expect(host.downloads[0].filename.endsWith(ext)).to.equal(true);
        if (mime) {
          expect(host.downloads[0].mime).to.equal(mime);
        }
      });
    });

    it("says an unknown format is not supported", async () => {
      await exportPageAs.call(pageHost(), "bogus");
      expect(toasts).to.deep.equal(['Export format "bogus" not supported']);
      expect(fetched).to.deep.equal([]);
    });

    it("tells the user when the export request fails", async () => {
      globalThis.fetch = async (url) => {
        fetched.push(String(url));
        return { ok: false, status: 500 };
      };
      const host = pageHost();
      await exportPageAs.call(host, "json");
      expect(host.downloads).to.deep.equal([]);
      expect(toasts).to.deep.equal(["Page json export not available"]);
    });

    it("does not request anything when no page is active", async () => {
      store.activeId = null;
      const host = pageHost();
      await exportPageAs.call(host, "pdf");
      expect(fetched).to.deep.equal([]);
      expect(toasts).to.deep.equal(["PDF export service not available"]);
    });
  });

  describe("page route helpers", () => {
    it("maps formats to file extensions and MIME types", () => {
      expect(_pageRouteVariantExtension("markdown")).to.equal("md");
      expect(_pageRouteVariantExtension("epub")).to.equal("epub");
      expect(_pageRouteVariantExtension("json")).to.equal("json");
      expect(_pageRouteVariantMimeType("markdown")).to.equal("text/markdown");
      expect(_pageRouteVariantMimeType("epub")).to.equal(
        "application/epub+zip",
      );
      expect(_pageRouteVariantMimeType("unknown")).to.equal("text/plain");
    });

    it("encodes the item id and format into the export URL", () => {
      const url = new URL(_pageRouteVariantUrl("MarkDown"));
      expect(
        url.pathname.endsWith("/x/api/v1/items/page%20one%2F1/export/md"),
      ).to.equal(true);
      const pdf = new URL(_pageItemExportUrl());
      expect(
        pdf.pathname.endsWith("/x/api/v1/items/page%20one%2F1/export/pdf"),
      ).to.equal(true);
      // the format cannot add path segments
      const odd = new URL(_pageItemExportUrl("../../secret"));
      expect(odd.pathname.endsWith("/export/..%2F..%2Fsecret")).to.equal(true);
    });

    it("returns null without an active page", () => {
      store.activeId = null;
      expect(_pageRouteVariantUrl("html")).to.equal(null);
      expect(_pageItemExportUrl("pdf")).to.equal(null);
    });
  });
});
