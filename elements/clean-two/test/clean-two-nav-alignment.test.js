// local development and mobx
globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";

import "../clean-two.js";

// haxtheweb/issues#3268: on desktop the page navigation (Previous / Next
// cards and their rules) and the footer row must share the content
// blocks' column instead of sitting to the left of it.

const edges = (node) => {
  const rect = node.getBoundingClientRect();
  return { left: rect.left, right: rect.right };
};

const expectSameEdges = (actual, expected, label) => {
  expect(
    Math.abs(actual.left - expected.left),
    `${label} left edge ${actual.left} vs ${expected.left}`,
  ).to.be.at.most(1);
  expect(
    Math.abs(actual.right - expected.right),
    `${label} right edge ${actual.right} vs ${expected.right}`,
  ).to.be.at.most(1);
};

async function renderAt(width, size) {
  await setViewport({ width: width, height: 1000 });
  const el = await fixture(
    html`<clean-two><div>Content block for alignment checks.</div></clean-two>`,
  );
  // responsive-size is normally derived from the element width; pin it so
  // the assertion does not depend on resize observer timing
  el.responsiveSize = size;
  await el.updateComplete;
  await waitUntil(
    () => el.getAttribute("responsive-size") === size,
    `responsive-size never became ${size}`,
  );
  return el;
}

describe("clean-two page navigation and footer alignment", function () {
  this.timeout(10000);

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  [
    { width: 1280, size: "lg" },
    { width: 1440, size: "lg" },
    { width: 1920, size: "xl" },
    { width: 2560, size: "xl" },
  ].forEach(({ width, size }) => {
    it(`aligns navigation and footer with the content column at ${width}px (${size})`, async () => {
      const el = await renderAt(width, size);
      const sr = el.shadowRoot;
      const article = edges(sr.querySelector("article"));
      const block = edges(el.querySelector("div"));
      // sanity: a slotted block fills the content column (prose such as p
      // uses the narrower reading column, which is not the target here)
      expectSameEdges(block, article, "content block");
      expectSameEdges(
        edges(sr.querySelector(".link-actions")),
        article,
        "page navigation",
      );
      expectSameEdges(edges(sr.querySelector(".footer")), article, "footer");
      expect(
        Math.abs(
          sr
            .querySelector('site-menu-button[type="prev"]')
            .getBoundingClientRect().left - article.left,
        ),
      ).to.be.at.most(1);
      expect(
        Math.abs(
          sr
            .querySelector('site-menu-button[type="next"]')
            .getBoundingClientRect().right - article.right,
        ),
      ).to.be.at.most(1);
    });
  });

  it("keeps the tablet layout unchanged (footer spans main) at 1024px (md)", async () => {
    const el = await renderAt(1024, "md");
    const sr = el.shadowRoot;
    const main = edges(sr.querySelector("main"));
    expectSameEdges(edges(sr.querySelector("footer")), main, "footer");
    expectSameEdges(
      edges(sr.querySelector(".link-actions")),
      main,
      "page navigation",
    );
  });
});
