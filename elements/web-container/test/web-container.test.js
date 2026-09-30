import { html, fixture, expect } from '@open-wc/testing';
import "../web-container.js";

// firstUpdated boots a full @webcontainer/api instance through the
// WebContainerManager singleton; stub requestAvailability so this suite
// (and every other suite in this page) runs against a fake container
// instead of executing a real in-browser Node.js runtime
const fakeContainer = {
  spawn: async () => ({
    output: { pipeTo: async () => {} },
    input: { getWriter: () => ({ write: () => {} }) },
    resize: () => {},
    exit: Promise.resolve(0),
  }),
  mount: async () => {},
  fs: {
    writeFile: async () => {},
    readFile: async () => "",
  },
  on: () => {},
};
const originalRequestAvailability =
  window.WebContainerManager.requestAvailability;
window.WebContainerManager.requestAvailability = async () => fakeContainer;

describe("webContainer test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <web-container
        title="title"
      ></web-container>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
