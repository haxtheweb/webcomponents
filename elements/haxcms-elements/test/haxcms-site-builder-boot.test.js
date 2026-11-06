import { expect } from "@open-wc/testing";
import "../lib/core/haxcms-site-builder.js";

// first paint work: site.json is reused from a preload, re-checked on idle,
// and the toast / editor builder stay off the first-paint path
const Builder = () => globalThis.customElements.get("haxcms-site-builder");

function stubFetch(responder) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = (url, options) => {
    calls.push({ url: String(url), options: options || {} });
    return Promise.resolve(responder(String(url), options || {}));
  };
  return {
    calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

function textResponse(text) {
  return { ok: true, text: () => Promise.resolve(text) };
}

function builderStub(extra = {}) {
  const updates = [];
  return {
    file: "site.json?abc",
    outlineLocation: "./",
    isLoggedIn: false,
    _timeStamp: "",
    __manifestText: '{"items":[]}',
    updates,
    _updateManifest(data) {
      updates.push(data);
    },
    loadPageData() {
      this.pageLoads = (this.pageLoads || 0) + 1;
    },
    ...extra,
  };
}

describe("haxcms-site-builder boot", () => {
  it("starts without a cache-busting stamp so a preload is reused", () => {
    const el = globalThis.document.createElement("haxcms-site-builder");
    expect(el._timeStamp).to.equal("");
    expect(el.freshManifestReady).to.be.an.instanceof(Promise);
  });

  it("revalidation leaves the page alone when site.json is unchanged", async () => {
    const stub = builderStub();
    const f = stubFetch(() => textResponse('{"items":[]}'));
    try {
      const changed = await Builder().prototype._revalidateManifest.call(stub);
      expect(changed).to.equal(false);
      expect(f.calls.length).to.equal(1);
      expect(f.calls[0].options.cache).to.equal("no-store");
      expect(f.calls[0].url).to.match(/^\.\/site\.json\?abc&\d+$/);
      expect(stub.updates.length).to.equal(0);
      expect(stub.pageLoads).to.equal(undefined);
    } finally {
      f.restore();
    }
  });

  it("revalidation applies a newer site.json and refetches the page fresh", async () => {
    const stub = builderStub();
    const f = stubFetch(() => textResponse('{"items":[{"id":"a"}]}'));
    try {
      const changed = await Builder().prototype._revalidateManifest.call(stub);
      expect(changed).to.equal(true);
      expect(stub.updates[0].items[0].id).to.equal("a");
      expect(stub.__freshNextPage).to.equal(true);
      expect(stub.pageLoads).to.equal(1);
    } finally {
      f.restore();
    }
  });

  it("revalidation is skipped for logged-in users (they reload with a stamp)", async () => {
    const stub = builderStub({ isLoggedIn: true });
    const f = stubFetch(() => textResponse("{}"));
    try {
      const changed = await Builder().prototype._revalidateManifest.call(stub);
      expect(changed).to.equal(false);
      expect(f.calls.length).to.equal(0);
    } finally {
      f.restore();
    }
  });

  it("revalidation drops its result if a login lands while it waits", async () => {
    const stub = builderStub();
    const f = stubFetch(() => {
      stub.isLoggedIn = true;
      return textResponse('{"items":[{"id":"b"}]}');
    });
    try {
      const changed = await Builder().prototype._revalidateManifest.call(stub);
      expect(changed).to.equal(false);
      expect(stub.updates.length).to.equal(0);
    } finally {
      f.restore();
    }
  });

  it("only skips the editor builder on published sites without app settings", () => {
    const proto = Builder().prototype;
    const prevContext = globalThis.HAXCMSContext;
    const prevSettings = globalThis.appSettings;
    try {
      globalThis.HAXCMSContext = "published";
      delete globalThis.appSettings;
      expect(proto._needsEditorBuilder.call({})).to.not.equal(true);
      globalThis.appSettings = { login: "x" };
      expect(proto._needsEditorBuilder.call({})).to.equal(true);
      delete globalThis.appSettings;
      globalThis.HAXCMSContext = "nodejs";
      expect(proto._needsEditorBuilder.call({})).to.equal(true);
    } finally {
      globalThis.HAXCMSContext = prevContext;
      if (prevSettings === undefined) {
        delete globalThis.appSettings;
      } else {
        globalThis.appSettings = prevSettings;
      }
    }
  });

  it("replaceTagReplacement still swaps custom tags and keeps page-break", () => {
    const html = Builder().prototype.replaceTagReplacement(
      '<p>hi</p><video-player source="a"></video-player><page-break title="x"></page-break>',
    );
    expect(html).to.contain('<replace-tag with="video-player"  source="a">');
    expect(html).to.contain("</replace-tag>");
    expect(html).to.contain('<page-break title="x"></page-break>');
  });

  it("idle work waits for the first page body", async () => {
    const proto = Builder().prototype;
    const stub = {
      _afterFirstContent: proto._afterFirstContent,
      _flushAfterFirstContent: proto._flushAfterFirstContent,
    };
    let ran = false;
    stub._afterFirstContent(() => {
      ran = true;
    }, 0);
    await new Promise((r) => setTimeout(r, 50));
    expect(ran).to.equal(false);
    stub._flushAfterFirstContent();
    for (let i = 0; i < 50 && !ran; i++) {
      await new Promise((r) => setTimeout(r, 20));
    }
    expect(ran).to.equal(true);
  });

  it("a toast hide with nothing showing does not load the toast", async () => {
    if (globalThis.HAXCMSToast && globalThis.HAXCMSToast.instance) {
      return;
    }
    const controller = new AbortController();
    Builder().prototype._installLazyToast.call({
      windowControllers: controller,
      _afterFirstContent: () => {},
    });
    globalThis.dispatchEvent(new CustomEvent("haxcms-toast-hide"));
    await new Promise((r) => setTimeout(r, 200));
    controller.abort();
    expect(
      !!(globalThis.HAXCMSToast && globalThis.HAXCMSToast.instance),
    ).to.equal(false);
  });

  it("a toast asked for before the toast loads is still shown", async () => {
    const controller = new AbortController();
    // idle loading is held back here so the event is what triggers it
    Builder().prototype._installLazyToast.call({
      windowControllers: controller,
      _afterFirstContent: () => {},
    });
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-toast-show", {
        detail: { text: "queued hello", duration: 3000 },
      }),
    );
    let toast = null;
    for (let i = 0; i < 100 && !toast; i++) {
      await new Promise((r) => setTimeout(r, 20));
      toast = globalThis.HAXCMSToast && globalThis.HAXCMSToast.instance;
    }
    controller.abort();
    expect(toast).to.not.equal(null);
    expect(toast.text).to.equal("queued hello");
  });

  it("content waits for the theme to be defined and rendered", async () => {
    const proto = Builder().prototype;
    const tag = "late-theme-" + Date.now();
    const theme = document.createElement(tag);
    let ready = false;
    proto._whenThemeReady(theme).then(() => {
      ready = true;
    });
    await new Promise((r) => setTimeout(r, 40));
    expect(ready).to.equal(false);
    let rendered;
    customElements.define(
      tag,
      class extends HTMLElement {
        constructor() {
          super();
          this.updateComplete = new Promise((r) => {
            rendered = r;
          });
        }
      },
    );
    customElements.upgrade(theme);
    await new Promise((r) => setTimeout(r, 40));
    // defined, but not drawn yet
    expect(ready).to.equal(false);
    rendered(true);
    for (let i = 0; i < 20 && !ready; i++) {
      await new Promise((r) => setTimeout(r, 10));
    }
    expect(ready).to.equal(true);
  });

  it("content without a theme goes in on the next task", async () => {
    const proto = Builder().prototype;
    let ready = false;
    proto._whenThemeReady(null).then(() => {
      ready = true;
    });
    await new Promise((r) => setTimeout(r, 30));
    expect(ready).to.equal(true);
  });
});
