// The top bar's three groups: the page tools on the left, the search in
// the middle, preview on the right. Whatever the width, a tool never sits
// under the search field. With room the field is 360px in the middle; as
// the bar narrows it moves over and narrows, and at 680px it folds to a
// button.
import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../lib/core/haxcms-site-editor-ui.js";

const settle = async (ms = 150) => {
  await aTimeout(ms);
  await new Promise((r) => requestAnimationFrame(r));
};

describe("haxcms-site-editor-ui top bar fit", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(0);
    el.painting = false;
    el.pageAllowed = true;
    el.editMode = true;
    await el.updateComplete;
  });
  afterEach(async () => {
    el.editMode = false;
    await setViewport({ width: 1280, height: 800 });
  });

  const measure = () => {
    const root = el.shadowRoot;
    const tools = Array.from(
      root.querySelector(".left-toolbar-buttons").children,
    ).filter((tool) => tool.getBoundingClientRect().width > 0);
    const lastTool = tools[tools.length - 1].getBoundingClientRect();
    const field = root
      .querySelector("#search")
      .shadowRoot.querySelector(".field")
      .getBoundingClientRect();
    const right = root
      .querySelector(".topbar-right-group")
      .getBoundingClientRect();
    return {
      tools: tools.length,
      lastTool: Math.round(lastTool.right),
      fieldLeft: Math.round(field.left),
      fieldRight: Math.round(field.right),
      fieldWidth: Math.round(field.width),
      rightLeft: Math.round(right.left),
    };
  };

  [1440, 1280, 1000, 855, 720].forEach((width) => {
    it(`no edit tool sits under the search at ${width}px`, async () => {
      await setViewport({ width: width, height: 800 });
      await settle();
      const m = measure();
      // Cancel and Save are there, so this is the crowded bar
      expect(m.tools).to.be.above(4);
      expect(m.lastTool).to.be.at.most(m.fieldLeft);
      expect(m.fieldRight).to.be.at.most(m.rightLeft + 1);
      expect(m.fieldWidth).to.be.at.least(100);
    });
  });

  it("the search folds to a button at 680px", async () => {
    await setViewport({ width: 680, height: 800 });
    await settle();
    const m = measure();
    expect(m.fieldWidth).to.equal(40);
    expect(m.fieldRight).to.be.at.most(m.rightLeft + 1);
  });
});
