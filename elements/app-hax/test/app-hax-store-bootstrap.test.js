import { expect } from "@open-wc/testing";

// Clear demo appSettings so store bootstrap reads a clean environment
globalThis.appSettings = {};

// Seed localStorage BEFORE importing the store so the module-load-time
// bootstrap branches run during construction:
//  - a stored sound preference short-circuits device-based detection
//  - a stored site without a license field defaults license to null
globalThis.localStorage.setItem("app-hax-soundStatus", JSON.stringify(false));
globalThis.localStorage.setItem(
  "app-hax-site",
  JSON.stringify({ structure: null, type: null, theme: null, name: null }),
);

const { store } = await import("../lib/v2/AppHaxStore.js");

describe("AppHaxStore bootstrap from localStorage", () => {
  it("uses the stored sound preference instead of device detection", () => {
    expect(store.soundStatus).to.be.false;
  });

  it("reads the stored site data with license defaulting to null", () => {
    expect(store.site).to.be.an("object");
    expect(store.site.structure).to.be.null;
    expect(store.site.license).to.be.null;
  });
});
