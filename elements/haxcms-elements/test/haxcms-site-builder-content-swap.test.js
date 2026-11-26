/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { expect, waitUntil } from "@open-wc/testing";
import "../lib/core/haxcms-site-builder.js";
import { store } from "../lib/core/haxcms-site-store.js";

// haxtheweb/issues#3428: putting a page on screen used to empty the theme
// first and fill it after waiting for the theme (at least one task later), so
// a frame could paint the theme with no content: its footer (previous/next)
// jumped up under the title and back down. The old page now stays until the
// new one goes in, in the same task.
describe("haxcms-site-builder content swap", () => {
  let builder;
  let theme;
  let originalTheme;
  const item = (id) => ({
    id,
    title: id,
    parent: null,
    slug: id,
    order: 1,
    metadata: {},
  });

  beforeEach(() => {
    originalTheme = store.themeElement;
    const Builder = globalThis.customElements.get("haxcms-site-builder");
    builder = new Builder();
    theme = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(theme);
    store.themeElement = theme;
  });

  afterEach(() => {
    store.themeElement = originalTheme;
    theme.remove();
  });

  it("never leaves the theme empty between one page and the next", async () => {
    await builder._activeItemContentChanged(
      "<p id='first'>First page</p>",
      item("swap-1"),
    );
    await waitUntil(
      () => theme.querySelector("#first"),
      "first page is on screen",
    );
    // a MutationObserver callback runs once the task that changed the DOM
    // is done, which is when a frame could paint: it must never see the
    // theme empty
    let emptyAtEndOfTask = false;
    const observer = new MutationObserver(() => {
      if (theme.childNodes.length === 0) {
        emptyAtEndOfTask = true;
      }
    });
    observer.observe(theme, { childList: true });
    builder._activeItemContentChanged(
      "<p id='second'>Second page</p>",
      item("swap-1"),
    );
    // the old page is still there while the new one is on its way
    expect(theme.querySelector("#first")).to.not.equal(null);
    await waitUntil(
      () => theme.querySelector("#second"),
      "second page is on screen",
    );
    observer.disconnect();
    expect(emptyAtEndOfTask).to.equal(false);
    expect(theme.querySelector("#first")).to.equal(null);
    expect(theme.querySelectorAll("#second").length).to.equal(1);
  });

  it("puts only the newest page in when two arrive while the theme is busy", async () => {
    builder._activeItemContentChanged("<p id='a'>A</p>", item("swap-2"));
    builder._activeItemContentChanged("<p id='b'>B</p>", item("swap-2"));
    await waitUntil(
      () => theme.querySelector("#b"),
      "newest page is on screen",
    );
    expect(theme.querySelector("#a")).to.equal(null);
    expect(theme.querySelectorAll("#b").length).to.equal(1);
  });
});
