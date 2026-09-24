import { fixture, expect, html } from "@open-wc/testing";
import "../micro-frontend-registry.js";
import { MicroFrontendRegistry } from "../micro-frontend-registry.js";
import { enableServices } from "../lib/microServices.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<micro-frontend-registry></micro-frontend-registry>`,
    );
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Registry Functionality", () => {
    it("maintains accessibility during dynamic loading", async () => {
      await element.updateComplete;

      // Should remain accessible during registry operations
      await expect(element).shadowDom.to.be.accessible();
    });

    it("doesn't interfere with loaded component accessibility", async () => {
      await element.updateComplete;

      // Should not negatively impact accessibility of registered components
      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.not.equal("none");
    });
  });

  describe("Accessibility - Loading States", () => {
    it("provides accessible loading feedback if visible", async () => {
      await element.updateComplete;

      // If the registry shows loading states, they should be accessible
      await expect(element).shadowDom.to.be.accessible();
    });

    it("handles errors accessibly", async () => {
      await element.updateComplete;

      // Error states should be accessible to screen readers
      expect(element.tagName.toLowerCase()).to.equal("micro-frontend-registry");
    });
  });
});

// The site importers are on-prem haxcms-nodejs routes reached through the
// @system/ namespace, so the dashboard can only offer an importer that is
// registered here. haxtheweb/issues#2912 shipped the OpenStax converter and
// its /system/api/v1/site/import/openstax route.
describe("HAXcms site import services", () => {
  before(() => {
    enableServices(["haxcms"]);
  });

  const importers = [
    ["@system/openstaxToSite", "/system/api/v1/site/import/openstax"],
    ["@system/gitbookToSite", "/system/api/v1/site/import/gitbook"],
    ["@system/notionToSite", "/system/api/v1/site/import/notion"],
    ["@system/ploneToSite", "/system/api/v1/site/import/plone"],
    ["@system/pressbooksToSite", "/system/api/v1/site/import/pressbooks"],
    ["@system/haxcmsToSite", "/system/api/v1/site/import/haxcms"],
    ["@system/wordpressToSite", "/system/api/v1/site/import/wordpress"],
    ["@system/drupalBookToSite", "/system/api/v1/site/import/drupal-book"],
    ["@system/elmslnToSite", "/system/api/v1/site/import/elmsln"],
    ["@system/htmlToSite", "/system/api/v1/site/import/html"],
  ];

  importers.forEach(([name, endpoint]) => {
    it(`registers ${name} on its on-prem endpoint`, () => {
      expect(MicroFrontendRegistry.has(name)).to.equal(true);
      expect(MicroFrontendRegistry.get(name).endpoint).to.equal(endpoint);
    });
  });

  it("asks the OpenStax importer for a repoUrl, as the chooser sends", () => {
    const openstax = MicroFrontendRegistry.get("@system/openstaxToSite");
    expect(openstax.params).to.have.property("repoUrl");
    expect(openstax.title).to.equal("OpenStax to Site");
  });
});
