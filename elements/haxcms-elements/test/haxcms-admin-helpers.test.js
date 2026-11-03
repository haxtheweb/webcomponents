import { expect } from "@open-wc/testing";
import {
  resolveThemeThumbnail,
  actionTargetFromEvent,
  closeChoiceOnEscape,
  compareCategories,
} from "../lib/core/utils/haxcms-admin-helpers.js";

describe("haxcms-admin-helpers", () => {
  describe("resolveThemeThumbnail", () => {
    let autoload, global;
    beforeEach(() => {
      autoload = globalThis.WCAutoloadBasePath;
      global = globalThis.WCGlobalBasePath;
      delete globalThis.WCAutoloadBasePath;
      delete globalThis.WCGlobalBasePath;
    });
    afterEach(() => {
      globalThis.WCAutoloadBasePath = autoload;
      globalThis.WCGlobalBasePath = global;
    });

    it("returns empty for nothing and passes other strings through", () => {
      expect(resolveThemeThumbnail("", "https://a.b/x.js")).to.equal("");
      expect(resolveThemeThumbnail(null, "https://a.b/x.js")).to.equal("");
      expect(resolveThemeThumbnail("files/t.jpg", "https://a.b/x.js")).to.equal(
        "files/t.jpg",
      );
    });

    it("uses the scope of the caller's url when it has one", () => {
      const base =
        "https://cdn.test/build/es6/node_modules/@haxtheweb/haxcms-elements/lib/core/x.js";
      expect(
        resolveThemeThumbnail("@haxtheweb/clean-one/thumb.jpg", base),
      ).to.equal(
        "https://cdn.test/build/es6/node_modules/@haxtheweb/clean-one/thumb.jpg",
      );
    });

    it("uses WCAutoloadBasePath then WCGlobalBasePath", () => {
      globalThis.WCGlobalBasePath = "https://g.test/base";
      expect(
        resolveThemeThumbnail("@haxtheweb/a/t.jpg", "https://x.test/y/z.js"),
      ).to.equal("https://g.test/base/@haxtheweb/a/t.jpg");
      globalThis.WCAutoloadBasePath = "https://w.test/auto/";
      expect(
        resolveThemeThumbnail("@haxtheweb/a/t.jpg", "https://x.test/y/z.js"),
      ).to.equal("https://w.test/auto/@haxtheweb/a/t.jpg");
    });

    it("falls back to four folders up from the caller's own url", () => {
      expect(
        resolveThemeThumbnail(
          "@haxtheweb/a/t.jpg",
          "https://x.test/1/2/3/4/5/file.js",
        ),
      ).to.equal("https://x.test/1/@haxtheweb/a/t.jpg");
      expect(
        resolveThemeThumbnail(
          "@haxtheweb/a/t.jpg",
          "https://x.test/1/2/3/4/5/6/file.js",
        ),
      ).to.equal("https://x.test/1/2/@haxtheweb/a/t.jpg");
    });
  });

  it("actionTargetFromEvent finds the nearest data-action node", () => {
    const outer = document.createElement("div");
    outer.setAttribute("data-action", "open");
    const inner = document.createElement("span");
    outer.appendChild(inner);
    document.body.appendChild(outer);
    let found;
    outer.addEventListener("click", (e) => {
      found = actionTargetFromEvent(e);
    });
    inner.click();
    outer.remove();
    expect(found).to.equal(outer);
    expect(actionTargetFromEvent(null)).to.equal(null);
    expect(actionTargetFromEvent({})).to.equal(null);
  });

  it("closeChoiceOnEscape closes only on Escape", () => {
    let closed = 0;
    const host = {
      _closeChoice() {
        closed++;
      },
    };
    const esc = new KeyboardEvent("keydown", {
      key: "Escape",
      cancelable: true,
    });
    closeChoiceOnEscape(esc, host);
    expect(closed).to.equal(1);
    expect(esc.defaultPrevented).to.equal(true);
    closeChoiceOnEscape(new KeyboardEvent("keydown", { key: "a" }), host);
    closeChoiceOnEscape(null, host);
    expect(closed).to.equal(1);
  });

  it("compareCategories puts Writing, Text first and Other last", () => {
    const list = ["Media", "Other", "", "Text", "Layout", "Writing"];
    list.sort(compareCategories);
    expect(list).to.deep.equal([
      "Writing",
      "Text",
      "Layout",
      "Media",
      "Other",
      "",
    ]);
  });
});
