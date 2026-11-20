import { expect } from "@open-wc/testing";
import {
  htmlExportUrlFor,
  fetchPdfOrPrint,
} from "../lib/core/utils/pdf-print-fallback.js";
import { SITE_API_STATE_KEY } from "../lib/core/utils/site-api-auth-fetch.js";

// PDF export falls back to the browser's print dialog when the backend can't
// make a PDF (no Chrome on the server, HAXcms in the browser:
// haxtheweb/issues#3389).

const PDF_URL = `${globalThis.location.origin}/x/api/v1/items/page-1/export/pdf`;
const HTML_URL = `${globalThis.location.origin}/x/api/v1/items/page-1/export/html`;

function printFrames() {
  return Array.from(
    globalThis.document.querySelectorAll("iframe[sandbox]"),
  ).filter((f) => f.srcdoc);
}

describe("pdf-print-fallback", () => {
  let originalFetch;
  let savedState;
  let requests;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    savedState = globalThis[SITE_API_STATE_KEY];
    globalThis[SITE_API_STATE_KEY] = Object.assign({}, savedState || {}, {
      auth: { jwt: "editor-jwt", siteToken: "", userToken: "" },
    });
    requests = [];
    delete globalThis.__pdfFallbackScriptRan;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    globalThis[SITE_API_STATE_KEY] = savedState;
    printFrames().forEach((f) => f.remove());
    delete globalThis.__pdfFallbackScriptRan;
  });

  it("maps a PDF export address to the HTML export, keeping the query", () => {
    expect(htmlExportUrlFor(PDF_URL + "?filter.ancestor=a")).to.equal(
      HTML_URL + "?filter.ancestor=a",
    );
    expect(
      htmlExportUrlFor(
        `${globalThis.location.origin}/x/api/v1/site/export/pdf`,
      ),
    ).to.equal(`${globalThis.location.origin}/x/api/v1/site/export/html`);
    expect(htmlExportUrlFor(HTML_URL)).to.equal("");
  });

  it("returns the server's PDF when it makes one, and does not print", async () => {
    globalThis.fetch = async (url, init) => {
      requests.push({ url: String(url), init: init || {} });
      return {
        ok: true,
        status: 200,
        blob: async () => new Blob(["%PDF"], { type: "application/pdf" }),
      };
    };
    const result = await fetchPdfOrPrint(PDF_URL, "Page One");
    expect(result.blob).to.exist;
    expect(requests.map((r) => r.url)).to.deep.equal([PDF_URL]);
    expect(printFrames()).to.have.length(0);
  });

  it("prints the HTML export in a frame where nothing runs when the PDF fails", async () => {
    globalThis.fetch = async (url, init) => {
      requests.push({ url: String(url), init: init || {} });
      if (String(url) === PDF_URL) {
        return { ok: false, status: 500 };
      }
      return {
        ok: true,
        status: 200,
        text: async () =>
          "<h1>Page One</h1><p>Body text</p>" +
          "<script>globalThis.parent.__pdfFallbackScriptRan = true</script>" +
          '<img src="data:image/png;base64,AA" onerror="globalThis.parent.__pdfFallbackScriptRan = true">',
      };
    };
    const result = await fetchPdfOrPrint(PDF_URL, "Page One");
    expect(result.printed).to.equal(true);
    expect(requests.map((r) => r.url)).to.deep.equal([PDF_URL, HTML_URL]);
    // the HTML export goes out signed in, like every site API call
    expect(requests[1].init.headers.Authorization).to.equal(
      "Bearer editor-jwt",
    );
    const frames = printFrames();
    expect(frames).to.have.length(1);
    const frame = frames[0];
    const sandbox = frame.getAttribute("sandbox").split(/\s+/);
    expect(sandbox).to.include("allow-modals");
    expect(sandbox).to.not.include("allow-scripts");
    expect(frame.getAttribute("aria-hidden")).to.equal("true");
    const doc = frame.contentDocument;
    // the title is Save as PDF's default file name
    expect(doc.title).to.equal("Page One");
    expect(doc.body.textContent).to.include("Body text");
    expect(doc.querySelector("script")).to.equal(null);
    expect(doc.head.querySelector("style").textContent).to.include("@page");
    // give an image error handler a chance to run, if it could
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(globalThis.__pdfFallbackScriptRan).to.equal(undefined);
  });

  it("removes the frame once printing is done", async () => {
    globalThis.fetch = async (url) =>
      String(url) === PDF_URL
        ? { ok: false, status: 500 }
        : { ok: true, status: 200, text: async () => "<p>Done</p>" };
    await fetchPdfOrPrint(PDF_URL, "Page One");
    const frame = printFrames()[0];
    if (frame) {
      frame.contentWindow.dispatchEvent(new Event("afterprint"));
    }
    expect(printFrames()).to.have.length(0);
  });

  it("rejects when neither the PDF nor the HTML export can be had", async () => {
    globalThis.fetch = async () => ({ ok: false, status: 401 });
    let error = null;
    try {
      await fetchPdfOrPrint(PDF_URL, "Page One");
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(printFrames()).to.have.length(0);
  });
});
