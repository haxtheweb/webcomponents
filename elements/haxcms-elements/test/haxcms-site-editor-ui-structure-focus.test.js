import { expect } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";

// Structure (the outline editor) is opened from the house's site settings
// menu, so when nothing else says who opened it, closing the admin dialog
// returns focus to the house (#manifestbtn). The top bar no longer has an
// #outlinebutton to return to.
describe("haxcms-site-editor-ui Structure focus return", () => {
  function editorWithHouse() {
    const ui = globalThis.document.createElement("haxcms-site-editor-ui");
    const house = globalThis.document.createElement("button");
    house.id = "manifestbtn";
    const calls = [];
    Object.defineProperty(ui, "shadowRoot", {
      configurable: true,
      value: {
        querySelector: (selector) =>
          selector === "#manifestbtn" ? house : null,
      },
    });
    ui._syncAdminRoutePath = () => true;
    ui._showSiteAdminShell = (route, options) => {
      calls.push({ route: route, options: options });
    };
    return { ui: ui, house: house, calls: calls };
  }

  it("returns focus to the house after Structure closes", () => {
    const { ui, house, calls } = editorWithHouse();
    ui._outlineButtonTap(null, true, "Structure", {
      skipUrlUpdate: true,
      silent: true,
    });
    expect(calls.length).to.equal(1);
    expect(calls[0].route).to.equal("structure");
    expect(calls[0].options.invokedBy).to.equal(house);
  });

  it("returns focus to the house after the Structure import step closes", () => {
    const { ui, house, calls } = editorWithHouse();
    ui._openImportHierarchy([], false, { skipUrlUpdate: true, silent: true });
    expect(calls.length).to.equal(1);
    expect(calls[0].route).to.equal("structure-import");
    expect(calls[0].options.invokedBy).to.equal(house);
  });

  it("keeps the opener it is given", () => {
    const { ui, calls } = editorWithHouse();
    const opener = globalThis.document.createElement("button");
    ui._outlineButtonTap(null, true, "Structure", {
      skipUrlUpdate: true,
      silent: true,
      invokedBy: opener,
    });
    expect(calls[0].options.invokedBy).to.equal(opener);
  });
});
