// Tests for HAXCMSPreview: devices, frame sizing and the frame helpers
// behind HAXcms preview (haxtheweb/issues#2951).
import { expect } from "@open-wc/testing";
import {
  PREVIEW_DEVICES,
  PREVIEW_FRAME_NAME,
  previewFrameName,
  parsePreviewFrameName,
  previewFrameSrc,
  previewDevice,
  previewFrameSize,
  isPreviewNavigationClick,
  lockPreviewFrame,
  waitForPreviewStore,
  showContentInPreview,
} from "../lib/core/utils/HAXCMSPreview.js";

describe("HAXCMSPreview", () => {
  it("names the frame the store looks for", () => {
    expect(PREVIEW_FRAME_NAME).to.equal("haxcms-preview-frame");
  });

  it("offers this window, big screen, desktop, tablet and phone in that order", () => {
    expect(PREVIEW_DEVICES.map((d) => d.id)).to.deep.equal([
      "window",
      "big",
      "desktop",
      "tablet",
      "phone",
    ]);
    // only tablet and phone turn sideways
    expect(
      PREVIEW_DEVICES.filter((d) => d.rotates).map((d) => d.id),
    ).to.deep.equal(["tablet", "phone"]);
  });

  it("the frame's name carries the page to keep", () => {
    expect(previewFrameName(null)).to.equal("haxcms-preview-frame");
    expect(previewFrameName("item-7")).to.equal("haxcms-preview-frame:item-7");
    expect(parsePreviewFrameName("haxcms-preview-frame:item-7")).to.deep.equal({
      inFrame: true,
      keepId: "item-7",
    });
    expect(parsePreviewFrameName("haxcms-preview-frame")).to.deep.equal({
      inFrame: true,
      keepId: null,
    });
    expect(parsePreviewFrameName("")).to.deep.equal({
      inFrame: false,
      keepId: null,
    });
    expect(parsePreviewFrameName("some-other-window").inFrame).to.equal(false);
  });

  it("the frame loads this page on this origin only", () => {
    expect(
      previewFrameSrc({
        origin: "https://site.example",
        pathname: "/sites/a/lesson-1",
      }),
    ).to.equal("https://site.example/sites/a/lesson-1");
    // a path that looks protocol-relative stays on this origin
    expect(
      previewFrameSrc({
        origin: "https://site.example",
        pathname: "//elsewhere.example/x",
      }),
    ).to.equal("https://site.example/elsewhere.example/x");
  });

  it("previewDevice falls back to this window for unknown ids", () => {
    expect(previewDevice("phone").id).to.equal("phone");
    expect(previewDevice("toaster").id).to.equal("window");
    expect(previewDevice(undefined).id).to.equal("window");
  });

  describe("previewFrameSize", () => {
    it("this window fills the space at full size", () => {
      expect(
        previewFrameSize("window", false, { width: 1200, height: 700 }),
      ).to.deep.equal({
        width: 1200,
        height: 700,
        scale: 1,
        full: true,
        rotates: false,
      });
    });

    it("a device keeps its own size and is never scaled up", () => {
      const size = previewFrameSize("phone", false, {
        width: 2000,
        height: 2000,
      });
      expect([size.width, size.height, size.scale]).to.deep.equal([
        390, 844, 1,
      ]);
      expect(size.full).to.equal(false);
    });

    it("scales a device down to fit", () => {
      const size = previewFrameSize("desktop", false, {
        width: 720,
        height: 2000,
      });
      expect(size.width).to.equal(1440);
      expect(size.scale).to.equal(0.5);
    });

    it("sideways swaps width and height for tablet and phone only", () => {
      const phone = previewFrameSize("phone", true, {
        width: 3000,
        height: 3000,
      });
      expect([phone.width, phone.height]).to.deep.equal([844, 390]);
      const desktop = previewFrameSize("desktop", true, {
        width: 3000,
        height: 3000,
      });
      expect([desktop.width, desktop.height]).to.deep.equal([1440, 900]);
    });
  });

  describe("isPreviewNavigationClick", () => {
    function clickOn(el) {
      let result = null;
      const handler = (e) => {
        result = isPreviewNavigationClick(e, globalThis);
        e.preventDefault();
      };
      globalThis.document.addEventListener("click", handler, true);
      el.click();
      globalThis.document.removeEventListener("click", handler, true);
      return result;
    }

    it("is true for a link to another page", () => {
      const a = globalThis.document.createElement("a");
      a.href = "/some/other/page";
      a.textContent = "go";
      globalThis.document.body.appendChild(a);
      expect(clickOn(a)).to.equal(true);
      a.remove();
    });

    it("is false for a fragment on the same page", () => {
      const a = globalThis.document.createElement("a");
      a.href = "#section-2";
      globalThis.document.body.appendChild(a);
      expect(clickOn(a)).to.equal(false);
      a.remove();
    });

    it("finds links inside a shadow root", () => {
      const host = globalThis.document.createElement("div");
      const root = host.attachShadow({ mode: "open" });
      const a = globalThis.document.createElement("a");
      a.href = "/elsewhere";
      const span = globalThis.document.createElement("span");
      a.appendChild(span);
      root.appendChild(a);
      globalThis.document.body.appendChild(host);
      expect(clickOn(span)).to.equal(true);
      host.remove();
    });

    it("is false when nothing clicked is a link", () => {
      const b = globalThis.document.createElement("button");
      globalThis.document.body.appendChild(b);
      expect(clickOn(b)).to.equal(false);
      b.remove();
    });
  });

  describe("lockPreviewFrame", () => {
    it("blocks link clicks and history pushes, then undoes cleanly", () => {
      const pushState = globalThis.history.pushState;
      let told = 0;
      const unlock = lockPreviewFrame(globalThis, () => told++);
      const a = globalThis.document.createElement("a");
      a.href = "/somewhere-else";
      globalThis.document.body.appendChild(a);
      const before = globalThis.location.href;
      a.click();
      globalThis.history.pushState(null, "", "/should-not-happen");
      expect(globalThis.location.href).to.equal(before);
      expect(told).to.equal(2);
      unlock();
      expect(globalThis.history.pushState).to.equal(pushState);
      a.remove();
    });

    it("is a no-op without a window", () => {
      const unlock = lockPreviewFrame(null);
      expect(unlock).to.be.a("function");
      expect(() => unlock()).to.not.throw();
    });
  });

  describe("frame hand-off", () => {
    it("waitForPreviewStore resolves with the frame's rendered store", async () => {
      const theme = globalThis.document.createElement("div");
      theme.appendChild(globalThis.document.createElement("p"));
      const fakeStore = {
        appReady: true,
        themeElement: theme,
        activeItemContent: "<p>hi</p>",
      };
      const fakeWin = {
        HAXCMS: { instance: { store: fakeStore } },
        document: { querySelector: () => null },
      };
      expect(await waitForPreviewStore(fakeWin, 500)).to.equal(fakeStore);
    });

    it("waitForPreviewStore waits for the builder's fresh load", async () => {
      const theme = globalThis.document.createElement("div");
      theme.appendChild(globalThis.document.createElement("p"));
      const fakeStore = {
        appReady: true,
        themeElement: theme,
        activeItemContent: "<p>hi</p>",
      };
      let release;
      const builder = {
        freshManifestReady: new Promise((r) => {
          release = r;
        }),
      };
      const fakeWin = {
        HAXCMS: { instance: { store: fakeStore } },
        document: { querySelector: () => builder },
      };
      let done = false;
      const waiting = waitForPreviewStore(fakeWin, 2000).then((s) => {
        done = true;
        return s;
      });
      await new Promise((r) => setTimeout(r, 150));
      expect(done).to.equal(false);
      release();
      expect(await waiting).to.equal(fakeStore);
    });

    it("waitForPreviewStore gives up with null", async () => {
      const fakeWin = { HAXCMS: { instance: { store: { appReady: false } } } };
      expect(await waitForPreviewStore(fakeWin, 150)).to.equal(null);
    });

    it("showContentInPreview hands the HTML to the frame's site builder", () => {
      const calls = [];
      const builder = {
        _updateActiveItemContent: (html, item) => calls.push([html, item]),
      };
      const fakeWin = { document: { querySelector: () => builder } };
      const item = { id: "page-1" };
      expect(
        showContentInPreview(fakeWin, { activeItem: item }, "<p>edit</p>"),
      ).to.equal(true);
      expect(calls).to.deep.equal([["<p>edit</p>", item]]);
    });

    it("showContentInPreview refuses without a builder or HTML", () => {
      const fakeWin = { document: { querySelector: () => null } };
      expect(showContentInPreview(fakeWin, null, "<p>x</p>")).to.equal(false);
      expect(showContentInPreview(null, null, "<p>x</p>")).to.equal(false);
      const withBuilder = {
        document: {
          querySelector: () => ({ _updateActiveItemContent: () => {} }),
        },
      };
      expect(showContentInPreview(withBuilder, null, null)).to.equal(false);
    });
  });
});
