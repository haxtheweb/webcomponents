/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * PDF export falls back to the browser's own print dialog (Save as PDF) when
 * the backend can't make a PDF itself: a server without Chrome, or HAXcms
 * running in the browser (haxtheweb/issues#3389). It prints the HTML export
 * of the same page or site the way the server renderer does: sanitized, with
 * scripts off, and with a print stylesheet.
 *
 * Security: the export is sanitized, then shown in a sandboxed frame without
 * allow-scripts, so nothing in it runs. allow-same-origin lets this page
 * call print() on the frame; allow-modals lets that print dialog open.
 */
import { sanitizeHTMLString } from "@haxtheweb/utils/lib/sanitize.js";
import { siteApiFetch } from "./site-api-auth-fetch.js";

// A4 pages and readable defaults, as the server's PDF renderer prints them
const PRINT_CSS = [
  "@page { size: A4; margin: 18mm 16mm; }",
  "html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }",
  "body { margin: 0; color: #1f2328; font-family: Helvetica, Arial, sans-serif; font-size: 11.5pt; line-height: 1.55; }",
  "h1, h2, h3, h4, h5, h6 { line-height: 1.25; margin: 1.2em 0 0.45em; break-after: avoid; }",
  "p, li { orphans: 3; widows: 3; }",
  "a { color: #0b5cad; }",
  "img, svg, video, canvas { display: block; max-width: 100%; height: auto; margin: 0.6em auto; break-inside: avoid; }",
  "figure, pre, tr { break-inside: avoid; }",
  "pre { white-space: pre-wrap; }",
  "table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #d0d7de; padding: 4px 8px; text-align: left; vertical-align: top; }",
].join("\n");

// how long the frame is kept if the browser never says printing finished
const FRAME_LIFETIME_MS = 10 * 60 * 1000;

/**
 * The HTML export address for a PDF export address
 * (…/export/pdf?x=y → …/export/html?x=y).
 * @param {String} pdfUrl
 * @returns {String} the HTML export address, or "" when it isn't a PDF export
 */
export function htmlExportUrlFor(pdfUrl) {
  try {
    const url = new URL(pdfUrl, globalThis.location.href);
    if (!url.pathname.endsWith("/export/pdf")) {
      return "";
    }
    url.pathname = url.pathname.slice(0, -"pdf".length) + "html";
    return url.toString();
  } catch {
    return "";
  }
}

/**
 * Print the HTML export at htmlUrl with the browser's print dialog.
 * Resolves once the dialog has been opened; rejects when the export can't
 * be loaded or the browser refuses to print.
 * @param {String} htmlUrl the page or site HTML export
 * @param {String} title the document title (Save as PDF's default file name)
 */
export async function printHtmlExport(htmlUrl, title) {
  const response = await siteApiFetch(htmlUrl, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`HTML export for printing failed: ${response.status}`);
  }
  const body = sanitizeHTMLString(await response.text());
  return new Promise((resolve, reject) => {
    const frame = globalThis.document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-same-origin allow-modals");
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("tabindex", "-1");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    let timer = null;
    const remove = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      frame.remove();
    };
    frame.addEventListener(
      "load",
      () => {
        try {
          const doc = frame.contentDocument;
          const win = frame.contentWindow;
          doc.title = String(title || "");
          const style = doc.createElement("style");
          style.textContent = PRINT_CSS;
          doc.head.appendChild(style);
          win.addEventListener("afterprint", remove, { once: true });
          timer = setTimeout(remove, FRAME_LIFETIME_MS);
          win.focus();
          win.print();
          resolve();
        } catch (e) {
          remove();
          reject(e);
        }
      },
      { once: true },
    );
    // relative image addresses resolve against this page, as srcdoc does
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"></head><body>${body}</body></html>`;
    globalThis.document.body.appendChild(frame);
  });
}

/**
 * Fetch a PDF export; when the backend can't make one, print the matching
 * HTML export instead.
 * @param {String} pdfUrl the page or site PDF export
 * @param {String} title the document title
 * @returns {Promise<{blob: Blob}|{printed: true}>}
 */
export async function fetchPdfOrPrint(pdfUrl, title) {
  let failure = null;
  try {
    const response = await siteApiFetch(pdfUrl, { credentials: "include" });
    if (response.ok) {
      return { blob: await response.blob() };
    }
    failure = new Error(`PDF export failed: ${response.status}`);
  } catch (e) {
    failure = e;
  }
  const htmlUrl = htmlExportUrlFor(pdfUrl);
  if (!htmlUrl) {
    throw failure;
  }
  console.warn("PDF export unavailable, using the print dialog:", failure);
  await printHtmlExport(htmlUrl, title);
  return { printed: true };
}
