import { expect } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { AppHaxUseCaseFilter } from "../lib/v2/app-hax-use-case-filter.js";

// The import cards in the v2 site creation chooser are the only way an end user
// reaches an importer, and each card names the @system/ service it calls. A card
// whose service is not registered does nothing when it is clicked, because
// MicroFrontendRegistry.call() returns null for a name it does not have. That is
// how the OpenStax importer shipped unreachable (haxtheweb/issues#2912), and
// nothing covered these cards until haxtheweb/issues#2923 added VitePress.
//
// Scope: the url-kind cards are the site importers registered by
// enableHAXcmsServices() in microServices.js, asserted here. The file-kind cards
// (docx, pdf, pptx, xlsx) resolve from the server's OpenAPI spec at runtime in
// app-hax-system-api-registry.js, so they are out of this file's reach.
describe("app-hax-use-case-filter import cards", () => {
  let importItems;
  let urlCards;

  before(() => {
    enableServices(["haxcms"]);
    // getImportItems() returns a static list and reads no element state, so it
    // can be called without upgrading the element.
    importItems = AppHaxUseCaseFilter.prototype.getImportItems.call({});
    urlCards = importItems.filter((item) => item.importKind === "url");
  });

  it("offers import cards, each marked as an import with a callback", () => {
    expect(importItems.length).to.be.greaterThan(0);
    expect(urlCards.length).to.be.greaterThan(0);
    importItems.forEach((item) => {
      expect(item.dataType, item.importType).to.equal("import");
      expect(item.callback, item.importType).to.be.a("string").that.is.not
        .empty;
    });
  });

  it("every url import card calls a registered site import service", () => {
    urlCards.forEach((card) => {
      const label = `${card.importType} -> ${card.callback}`;
      expect(MicroFrontendRegistry.has(card.callback), label).to.equal(true);
      expect(
        MicroFrontendRegistry.get(card.callback).endpoint,
        label,
      ).to.include("/system/api/v1/site/import/");
    });
  });

  it("every url import card prompts for the param it sends", () => {
    urlCards.forEach((card) => {
      expect(card.param, card.importType).to.be.a("string").that.is.not.empty;
      expect(card.prompt, card.importType).to.be.a("string").that.is.not.empty;
    });
  });

  it("offers VitePress as a url import on the vitepress endpoint", () => {
    const vitepress = importItems.find(
      (item) => item.importType === "vitepress",
    );
    expect(vitepress, "a VitePress import card").to.exist;
    expect(vitepress.importKind).to.equal("url");
    expect(vitepress.callback).to.equal("@system/vitepressToSite");
    expect(vitepress.param).to.equal("repoUrl");
    expect(vitepress.prompt).to.equal("URL for the VitePress git repo");
    expect(vitepress.useCaseTitle).to.equal("VitePress");
    expect(vitepress.useCaseTag).to.include("Import");
    expect(MicroFrontendRegistry.get(vitepress.callback).endpoint).to.equal(
      "/system/api/v1/site/import/vitepress",
    );
  });
});
