import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { zipSync, strToU8 } from "fflate";
import "../h5p-element.js";

// End to end through the real player pipeline (h5p-standalone's H5P core is
// served from node_modules), using a tiny hand made H5P library so no large
// fixture has to live in the repo. Only the network request for the .h5p is
// faked; unzipping, library ordering, the frame and H5P core all run for real.
const HELLO_JS = `
H5P.Hello = (function () {
  function Hello(options) {
    this.options = options;
  }
  Hello.prototype.attach = function ($container) {
    $container.addClass("hello-ran").append(
      H5P.jQuery("<p>").addClass("hello-text").text(this.options.text),
    );
    var img = H5P.jQuery("<img>").addClass("hello-img").attr("alt", "");
    img.attr("src", H5P.getPath("images/dot.png", 0));
    $container.append(img);
  };
  return Hello;
})();`;

function helloPackage() {
  return zipSync({
    "h5p.json": strToU8(
      JSON.stringify({
        title: "Hello",
        mainLibrary: "H5P.Hello",
        preloadedDependencies: [
          { machineName: "H5P.Hello", majorVersion: 1, minorVersion: 0 },
        ],
      }),
    ),
    "content/content.json": strToU8(
      JSON.stringify({ text: "Hello from a zip" }),
    ),
    "content/images/dot.png": new Uint8Array([137, 80, 78, 71]),
    "H5P.Hello-1.0/library.json": strToU8(
      JSON.stringify({
        title: "Hello",
        machineName: "H5P.Hello",
        majorVersion: 1,
        minorVersion: 0,
        runnable: 1,
        preloadedJs: [{ path: "hello.js" }],
        preloadedCss: [{ path: "hello.css" }],
      }),
    ),
    "H5P.Hello-1.0/hello.js": strToU8(HELLO_JS),
    "H5P.Hello-1.0/hello.css": strToU8(".hello-text{color:rgb(1, 2, 3)}"),
  });
}

describe("h5p-element playing an unpacked-in-the-browser package", () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("starts the content, applies library CSS and serves assets from the zip", async () => {
    globalThis.fetch = async (url, ...rest) =>
      String(url).endsWith(".h5p")
        ? new Response(helloPackage(), { status: 200 })
        : realFetch(url, ...rest);
    const el = await fixture(
      html`<h5p-element source="hello.h5p"></h5p-element>`,
    );
    const evt = await oneEvent(el, "h5p-package-loaded");
    expect(evt.detail.title).to.equal("Hello");
    expect(evt.detail.mainLibrary).to.equal("H5P.Hello 1.0");
    expect(evt.detail.libraries).to.deep.equal(["H5P.Hello-1.0"]);
    expect(el.status).to.equal("ready");

    const frame = el.querySelector("iframe.h5p-iframe");
    expect(frame).to.exist;
    const doc = frame.contentDocument;
    // H5P core attaches the content once the frame document is ready, a tick
    // after the package reports loaded
    await waitUntil(() => doc.querySelector(".hello-text"), "content attached");
    // the library's JavaScript ran and received the package's content.json
    const text = doc.querySelector(".hello-text");
    expect(text.textContent).to.equal("Hello from a zip");
    // library CSS reached the frame
    expect(doc.defaultView.getComputedStyle(text).color).to.equal(
      "rgb(1, 2, 3)",
    );
    // content assets are blob: URLs made from the zip, not network requests
    expect(doc.querySelector(".hello-img").getAttribute("src")).to.match(
      /^blob:/,
    );
  });

  it("replaces the player when source changes and cleans up on removal", async () => {
    globalThis.fetch = async (url, ...rest) =>
      String(url).endsWith(".h5p")
        ? new Response(helloPackage(), { status: 200 })
        : realFetch(url, ...rest);
    const el = await fixture(
      html`<h5p-element source="one.h5p"></h5p-element>`,
    );
    await oneEvent(el, "h5p-package-loaded");
    const loaded = oneEvent(el, "h5p-package-loaded");
    el.source = "two.h5p";
    await loaded;
    expect(el.querySelectorAll("iframe.h5p-iframe")).to.have.length(1);
    el.remove();
    expect(el._player).to.equal(null);
  });
});
