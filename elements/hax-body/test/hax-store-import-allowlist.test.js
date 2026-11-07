import { expect } from "@open-wc/testing";
import { HAXStore } from "../lib/hax-store.js";

// security: app store autoloader entries can be absolute URLs; only trusted
// external origins (or an app store that opted in) may be imported
describe("hax-store external import allow-list", () => {
  let savedAppStore;
  let savedAppStoreData;
  let savedBase;
  beforeEach(() => {
    savedAppStore = HAXStore.appStore;
    savedAppStoreData = HAXStore.__appStoreData;
    savedBase = globalThis.WCGlobalBasePath;
    delete globalThis.WCGlobalBasePath;
  });
  afterEach(async () => {
    HAXStore.appStore = savedAppStore;
    // the appStore autorun writes __appStoreData asynchronously
    await new Promise((r) => setTimeout(r, 0));
    HAXStore.__appStoreData = savedAppStoreData;
    if (savedBase === undefined) {
      delete globalThis.WCGlobalBasePath;
    } else {
      globalThis.WCGlobalBasePath = savedBase;
    }
  });

  it("allows the HAX CDNs over https", () => {
    HAXStore.appStore = {};
    expect(
      HAXStore.isAllowedExternalImport(
        "https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/x/x.js",
      ),
    ).to.equal(true);
    expect(
      HAXStore.isAllowedExternalImport(
        "https://cdn.webcomponents.psu.edu/cdn/build/es6/x.js",
      ),
    ).to.equal(true);
  });

  it("refuses other origins, lookalike hosts and plain http", () => {
    HAXStore.appStore = {};
    expect(
      HAXStore.isAllowedExternalImport("https://evil.example/x.js"),
    ).to.equal(false);
    expect(
      HAXStore.isAllowedExternalImport(
        "https://cdn.hax.cloud.evil.example/x.js",
      ),
    ).to.equal(false);
    expect(
      HAXStore.isAllowedExternalImport("http://cdn.hax.cloud/x.js"),
    ).to.equal(false);
    expect(HAXStore.isAllowedExternalImport("not a url")).to.equal(false);
  });

  it("trusts the configured WCGlobalBasePath host", () => {
    HAXStore.appStore = {};
    globalThis.WCGlobalBasePath = "https://my-cdn.example/cdn/";
    expect(
      HAXStore.isAllowedExternalImport("https://my-cdn.example/cdn/x.js"),
    ).to.equal(true);
    expect(
      HAXStore.isAllowedExternalImport("https://other.example/x.js"),
    ).to.equal(false);
  });

  it("lets an app store opt into any origin explicitly", () => {
    HAXStore.appStore = { allowExternalImports: true };
    expect(
      HAXStore.isAllowedExternalImport("https://other.example/x.js"),
    ).to.equal(true);
    HAXStore.appStore = { allowExternalImports: "yes" };
    expect(
      HAXStore.isAllowedExternalImport("https://other.example/x.js"),
    ).to.equal(false);
  });

  it("skips a refused import in _handleDynamicImports without throwing", async () => {
    HAXStore.appStore = {};
    const autoloader = globalThis.document.createElement("div");
    await HAXStore._handleDynamicImports(
      { "evil-element": "https://evil.example/evil-element.js" },
      autoloader,
    );
    expect(globalThis.customElements.get("evil-element")).to.equal(undefined);
    expect(autoloader.children.length).to.equal(0);
  });
});
