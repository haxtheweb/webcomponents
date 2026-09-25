import { fixture, expect, html } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../training-theme.js";

describe("elementName test", () => {
  let element;
  let savedManifest;
  let savedActiveId;

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    store.manifest = {
      id: "training-test",
      title: "Training Test Site",
      metadata: { platform: {}, theme: { variables: {} } },
      items: [
        {
          id: "p1",
          title: "Page One",
          slug: "page-one",
          location: "pages/page-one/index.html",
          order: 1,
          parent: null,
          indent: 0,
          metadata: { published: true, locked: false, status: "" },
        },
      ],
    };
    store.activeId = null;
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
  });

  beforeEach(async () => {
    element = await fixture(html`<training-theme></training-theme>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
