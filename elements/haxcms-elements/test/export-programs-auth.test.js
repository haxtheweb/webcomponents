import { expect } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { SITE_API_STATE_KEY } from "../lib/core/utils/site-api-auth-fetch.js";
import {
  _exportSiteAsHTML,
  _exportSiteAsMarkdown,
  _exportSiteAsDOCX,
  _exportSiteAsPDF,
  _exportSiteAsEPUB,
} from "../lib/core/utils/ExportSiteProgram.js";
import {
  _exportPageRouteVariant,
  _exportPageAsDOCX,
  _exportPageAsPDF,
  _exportPageAsEPUB,
} from "../lib/core/utils/ExportPageProgram.js";

// Drives each whole-site and per-page export as a logged-in editor and
// asserts the request carries the editor's bearer JWT. The HAXcms site API
// ignores cookies, so any of these without the header 401s (pdf / docx /
// epub) or silently omits unpublished pages (html / md) for real users even
// though every mocked-fetch test that only checks the URL keeps passing.

function makeManifest() {
  return {
    id: "auth-site",
    title: "Auth Site",
    metadata: {
      site: { name: "auth-site", lang: "en" },
      platform: {},
      theme: { element: "test-theme", variables: {}, regions: {} },
    },
    items: [
      {
        id: "page-1",
        title: "Page One",
        slug: "page-1",
        location: "pages/page-1/index.html",
        order: 1,
        parent: null,
        indent: 0,
        metadata: { published: true },
      },
    ],
  };
}

function fakeHost() {
  return {
    t: {},
    setProcessingVisual() {},
    clearProcessingVisual() {},
    _downloadFile() {},
    _downloadBlob() {},
  };
}

function okResponse() {
  return {
    ok: true,
    status: 200,
    text: async () => "content",
    blob: async () => new Blob(["bytes"]),
  };
}

describe("export programs send the editor JWT", () => {
  let savedState;
  let savedManifest;
  let savedActiveId;
  let originalFetch;
  let requests;

  beforeEach(() => {
    savedState = globalThis[SITE_API_STATE_KEY];
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    originalFetch = globalThis.fetch;
    globalThis[SITE_API_STATE_KEY] = Object.assign({}, savedState || {}, {
      auth: { jwt: "editor-jwt", siteToken: "", userToken: "" },
    });
    store.manifest = makeManifest();
    store.activeId = "page-1";
    requests = [];
    globalThis.fetch = async (url, init) => {
      requests.push({ url: String(url), init: init || {} });
      return okResponse();
    };
  });

  afterEach(() => {
    globalThis[SITE_API_STATE_KEY] = savedState;
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
    globalThis.fetch = originalFetch;
  });

  function expectAuthorized(pathPart) {
    const hit = requests.find((r) => r.url.includes(pathPart));
    expect(hit, `expected a request to ${pathPart}`).to.exist;
    const headers = hit.init.headers || {};
    expect(
      headers.Authorization,
      `${pathPart} must send Authorization: Bearer <jwt>`,
    ).to.equal("Bearer editor-jwt");
  }

  const base = `${globalThis.location.origin}/`;
  const siteCases = [
    ["html", _exportSiteAsHTML, "x/api/v1/site/export/html"],
    ["markdown", _exportSiteAsMarkdown, "x/api/v1/content"],
    ["docx", _exportSiteAsDOCX, "x/api/v1/site/export/docx"],
    ["pdf", _exportSiteAsPDF, "x/api/v1/site/export/pdf"],
    ["epub", _exportSiteAsEPUB, "x/api/v1/site/export/epub"],
  ];
  siteCases.forEach(([format, fn, pathPart]) => {
    it(`whole-site ${format} export`, async () => {
      await fn.call(fakeHost(), makeManifest(), "Auth Site", base);
      expectAuthorized(pathPart);
    });
  });

  const pageCases = [
    ["docx", () => _exportPageAsDOCX.call(fakeHost(), "Page One")],
    ["pdf", () => _exportPageAsPDF.call(fakeHost(), "Page One")],
    ["epub", () => _exportPageAsEPUB.call(fakeHost(), "Page One")],
    ["md", () => _exportPageRouteVariant.call(fakeHost(), "md", "Page One")],
  ];
  pageCases.forEach(([format, run]) => {
    it(`page ${format} export`, async () => {
      await run();
      expectAuthorized(`x/api/v1/items/page-1/export/${format}`);
    });
  });

  it("still exports anonymously when nobody is logged in", async () => {
    globalThis[SITE_API_STATE_KEY] = Object.assign({}, savedState || {}, {
      auth: { jwt: "", siteToken: "", userToken: "" },
    });
    await _exportSiteAsHTML.call(fakeHost(), makeManifest(), "Auth Site", base);
    const hit = requests.find((r) =>
      r.url.includes("x/api/v1/site/export/html"),
    );
    expect(hit).to.exist;
    expect(hit.init.headers || {}).to.not.have.property("Authorization");
  });
});
