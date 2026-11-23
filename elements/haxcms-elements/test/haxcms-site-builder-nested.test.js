import { expect } from "@open-wc/testing";
import {
  HAXCMSSiteBuilder,
  isNestedSiteBuilder,
} from "../lib/core/haxcms-site-builder.js";

// One site builder runs a page. A second one inside page content loads
// nothing and hands the store nothing.
//
// The markup lives in an inert document: elements there are connected but
// never upgraded, so no real builder boots and nothing touches the store.
function inertPage(html) {
  const doc = globalThis.document.implementation.createHTMLDocument("t");
  doc.body.innerHTML = html;
  return doc;
}

function stubFetch() {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = (url) => {
    calls.push(String(url));
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve('{"items":[]}'),
    });
  };
  return {
    calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

describe("haxcms-site-builder inside page content", () => {
  it("the page's own builder is not nested", () => {
    const doc = inertPage(
      '<haxcms-site-builder id="site" file="site.json"><p>page</p></haxcms-site-builder>',
    );
    expect(isNestedSiteBuilder(doc.getElementById("site"))).to.equal(false);
  });

  it("a builder in the first one's content is nested, at any depth", () => {
    const doc = inertPage(
      '<haxcms-site-builder id="site" file="site.json"><div><section>' +
        '<haxcms-site-builder id="inner" file="https://other.example/site.json"></haxcms-site-builder>' +
        "</section></div></haxcms-site-builder>",
    );
    expect(isNestedSiteBuilder(doc.getElementById("inner"))).to.equal(true);
    expect(isNestedSiteBuilder(doc.getElementById("site"))).to.equal(false);
  });

  it("a builder inside a shadow root under the first one is nested", () => {
    const doc = inertPage(
      '<haxcms-site-builder id="site" file="site.json"><div id="theme"></div></haxcms-site-builder>',
    );
    const shadow = doc.getElementById("theme").attachShadow({ mode: "open" });
    const inner = doc.createElement("haxcms-site-builder");
    shadow.appendChild(inner);
    expect(isNestedSiteBuilder(inner)).to.equal(true);
  });

  it("an element that is not attached, or not an element, is never nested", () => {
    const doc = inertPage("");
    expect(
      isNestedSiteBuilder(doc.createElement("haxcms-site-builder")),
    ).to.equal(false);
    expect(isNestedSiteBuilder(null)).to.equal(false);
    expect(isNestedSiteBuilder({ file: "site.json" })).to.equal(false);
  });

  it("a nested builder fetches nothing and never sets or shares a manifest", async () => {
    const doc = inertPage(
      '<haxcms-site-builder id="site" file="site.json">' +
        '<haxcms-site-builder id="inner"></haxcms-site-builder>' +
        "</haxcms-site-builder>",
    );
    const inner = doc.getElementById("inner");
    inner.file = "https://other.example/site.json";
    inner.outlineLocation = "";
    inner.isLoggedIn = false;
    inner._timeStamp = "";
    const proto = HAXCMSSiteBuilder.prototype;
    const f = stubFetch();
    try {
      await proto.loadJOSData.call(inner);
      expect(await proto._revalidateManifest.call(inner)).to.equal(false);
      expect(f.calls.length).to.equal(0);
      expect(inner.loading).to.equal(undefined);
      // a manifest handed to it by any other route is not kept or shared
      proto._updateManifest.call(inner, { id: "other", items: [] });
      expect(inner.manifest).to.equal(undefined);
      // would throw on the store if it went any further
      proto._manifestChanged.call(inner, {
        id: "other",
        metadata: {},
        items: [],
      });
    } finally {
      f.restore();
    }
  });
});
