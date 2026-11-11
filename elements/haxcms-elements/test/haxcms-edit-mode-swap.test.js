// Entering edit mode must never show an empty page (haxtheweb/issues#3263):
// the theme keeps its viewer content (#slot) on screen and the site editor
// keeps h-a-x unpainted until hax-body has imported and rendered the editable
// copy, then both swap together. Leaving edit mode stays immediate.
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { LitElement } from "lit";
import "../lib/core/haxcms-site-editor.js";
import { HAXCMSTheme } from "../lib/core/HAXCMSThemeWiring.js";
import { HAXCMSThemeParts } from "../lib/core/utils/HAXCMSThemeParts.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import { store } from "../lib/core/haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";

class TestSwapTheme extends HAXCMSTheme(LitElement) {
  static get tag() {
    return "test-swap-theme";
  }
  static get properties() {
    return {
      editMode: { type: Boolean, reflect: true, attribute: "edit-mode" },
    };
  }
  render() {
    return html`<div id="slot"><slot></slot></div>`;
  }
}
customElements.define(TestSwapTheme.tag, TestSwapTheme);

// the way real themes are built (clean-one, clean-two): HAXCMSThemeParts has
// its own store.editMode autorun next to HAXCMSTheme's
class TestPartsTheme extends HAXCMSThemeParts(HAXCMSTheme(LitElement)) {
  static get tag() {
    return "test-parts-theme";
  }
  render() {
    return html`<div id="slot"><slot></slot></div>`;
  }
}
customElements.define(TestPartsTheme.tag, TestPartsTheme);

// a site part (site-menu, site-title...) that only mixes in HAXCMSThemeParts
class TestPartsOnly extends HAXCMSThemeParts(LitElement) {
  static get tag() {
    return "test-parts-only";
  }
}
customElements.define(TestPartsOnly.tag, TestPartsOnly);

// a block that renders lazily, like video-player
class TestLazyBlock extends IntersectionObserverMixin(LitElement) {
  static get tag() {
    return "test-lazy-block";
  }
  render() {
    return this.elementVisible
      ? html`<div id="rendered">player</div>
          <slot></slot>`
      : html`<div id="placeholder"></div>`;
  }
}
customElements.define(TestLazyBlock.tag, TestLazyBlock);

const microtasks = () => new Promise((r) => setTimeout(r, 0));
const frame = () => new Promise((r) => requestAnimationFrame(r));

/**
 * stand-in for hax-body: records imports and reports "importing" until the
 * test says the import finished
 */
function fakeBody() {
  const body = document.createElement("div");
  // off screen so no intersection observer in it fires on its own
  body.style.position = "fixed";
  body.style.top = "-10000px";
  body.imports = [];
  body.importing = false;
  body._contentState = {
    getState: (key) => (key === "importing" ? body.importing : false),
  };
  body.importContent = (content) => {
    body.imports.push(content);
    body.importing = true;
  };
  body.finishImport = () => {
    body.importing = false;
    body.dispatchEvent(
      new CustomEvent("hax-body-content-ready", {
        bubbles: true,
        composed: true,
        detail: { body: body },
      }),
    );
  };
  document.body.appendChild(body);
  return body;
}

/**
 * stand-in for the theme's viewer copy. Which blocks the visitor has seen is
 * set by each test, so the copy is kept off screen and its blocks' own
 * observers are stopped: an observer firing mid-test (an on-screen block
 * turning visible, an off-screen one turning back) made results depend on
 * timing
 * @param {string} markup viewer content
 * @param {Array} seen elementVisible for each test-lazy-block, in order
 */
async function fakeViewer(markup, seen) {
  const viewer = document.createElement("div");
  viewer.style.position = "fixed";
  viewer.style.top = "-10000px";
  viewer.innerHTML = markup;
  document.body.appendChild(viewer);
  const blocks = viewer.querySelectorAll("test-lazy-block");
  for (let i = 0; i < blocks.length; i++) {
    await blocks[i].updateComplete;
    if (blocks[i].intersectionObserver) {
      blocks[i].intersectionObserver.disconnect();
    }
    blocks[i].elementVisible = seen[i];
  }
  return viewer;
}

/** stand-in for the site editor as the theme sees it */
function fakeEditor() {
  const editor = document.createElement("div");
  editor.waits = 0;
  editor.whenEditModeReady = () => {
    editor.waits++;
    return new Promise((resolve) => {
      editor.release = resolve;
    });
  };
  document.body.appendChild(editor);
  return editor;
}

describe("theme edit-mode gate (_syncEditMode)", () => {
  let theme;
  let saved;
  beforeEach(async () => {
    saved = {
      editMode: store.editMode,
      instance: store.cmsSiteEditor.instance,
    };
    store.editMode = false;
    theme = await fixture(html`<test-swap-theme></test-swap-theme>`);
    await microtasks();
  });
  afterEach(() => {
    store.cmsSiteEditor.instance = saved.instance;
    store.editMode = saved.editMode;
  });

  it("enters immediately when there is no site editor", async () => {
    store.cmsSiteEditor.instance = null;
    theme._syncEditMode(true);
    await theme.updateComplete;
    expect(theme.hasAttribute("edit-mode")).to.equal(true);
  });

  it("keeps the viewer content until the editor is ready, then swaps", async () => {
    const editor = fakeEditor();
    store.cmsSiteEditor.instance = editor;
    store.editMode = true;
    theme._syncEditMode(true);
    // a second sync while waiting (autorun + window event) does not re-wait
    theme._syncEditMode(true);
    await microtasks();
    await theme.updateComplete;
    expect(editor.waits).to.equal(1);
    expect(theme.editMode).to.equal(false);
    expect(theme.hasAttribute("edit-mode")).to.equal(false);
    editor.release();
    await microtasks();
    await theme.updateComplete;
    expect(theme.editMode).to.equal(true);
    expect(theme.hasAttribute("edit-mode")).to.equal(true);
    editor.remove();
  });

  it("leaves edit mode immediately and drops a pending entry", async () => {
    const editor = fakeEditor();
    store.cmsSiteEditor.instance = editor;
    store.editMode = true;
    theme._syncEditMode(true);
    store.editMode = false;
    theme._syncEditMode(false);
    editor.release();
    await microtasks();
    await theme.updateComplete;
    expect(theme.editMode).to.equal(false);
    // and a fresh entry waits again
    const before = editor.waits;
    store.editMode = true;
    theme._syncEditMode(true);
    expect(editor.waits).to.equal(before + 1);
    editor.release();
    await microtasks();
    await theme.updateComplete;
    expect(theme.editMode).to.equal(true);
    theme._syncEditMode(false);
    await theme.updateComplete;
    expect(theme.hasAttribute("edit-mode")).to.equal(false);
    editor.remove();
  });

  it("routes the global edit event through the same gate", async () => {
    const editor = fakeEditor();
    store.cmsSiteEditor.instance = editor;
    store.editMode = true;
    theme.HAXCMSThemeWiring._globalEditChanged.call(theme, { detail: true });
    await microtasks();
    expect(theme.editMode).to.equal(false);
    editor.release();
    await microtasks();
    expect(theme.editMode).to.equal(true);
    editor.remove();
  });
});

describe("HAXCMSThemeParts waits for the same edit-mode gate", () => {
  let saved;
  beforeEach(() => {
    saved = {
      editMode: store.editMode,
      instance: store.cmsSiteEditor.instance,
    };
    store.editMode = false;
  });
  afterEach(() => {
    store.cmsSiteEditor.instance = saved.instance;
    store.editMode = saved.editMode;
  });

  it("a theme does not hide its viewer content before the editor is ready", async () => {
    const theme = await fixture(html`<test-parts-theme></test-parts-theme>`);
    await microtasks();
    const editor = fakeEditor();
    store.cmsSiteEditor.instance = editor;
    // both autoruns (HAXCMSTheme and HAXCMSThemeParts) see this
    store.editMode = true;
    await microtasks();
    await theme.updateComplete;
    expect(theme.hasAttribute("edit-mode")).to.equal(false);
    editor.release();
    await microtasks();
    await theme.updateComplete;
    expect(theme.hasAttribute("edit-mode")).to.equal(true);
    store.editMode = false;
    await microtasks();
    await theme.updateComplete;
    expect(theme.hasAttribute("edit-mode")).to.equal(false);
    editor.remove();
  });

  it("site parts dim in the same step the editor appears", async () => {
    const part = await fixture(html`<test-parts-only></test-parts-only>`);
    await microtasks();
    const editor = fakeEditor();
    store.cmsSiteEditor.instance = editor;
    store.editMode = true;
    await microtasks();
    await part.updateComplete;
    expect(part.hasAttribute("edit-mode")).to.equal(false);
    editor.release();
    await microtasks();
    await part.updateComplete;
    expect(part.hasAttribute("edit-mode")).to.equal(true);
    // leaving is immediate
    store.editMode = false;
    await microtasks();
    await part.updateComplete;
    expect(part.hasAttribute("edit-mode")).to.equal(false);
    editor.remove();
  });
});

describe("haxcms-site-editor edit-mode reveal", () => {
  let element;
  let body;
  let saved;
  beforeEach(async () => {
    saved = {
      editMode: store.editMode,
      activeHaxBody: HAXStore.activeHaxBody,
      content: store.activeItemContent,
    };
    store.editMode = false;
    element = await fixture(html`<haxcms-site-editor></haxcms-site-editor>`);
    // h-a-x imports its slot into the active body once the app store loads;
    // let that land before the stand-in body takes over
    try {
      await waitUntil(() => HAXStore.appStoreLoaded, "", { timeout: 5000 });
    } catch {
      // no app store in this run; nothing will import on its own
    }
    await microtasks();
    body = fakeBody();
    HAXStore.activeHaxBody = body;
    await microtasks();
  });
  afterEach(() => {
    store.editMode = false;
    HAXStore.activeHaxBody = saved.activeHaxBody;
    store.activeItemContent = saved.content;
    store.editMode = saved.editMode;
    body.remove();
  });

  it("resolves at once when nothing is being imported", async () => {
    let done = false;
    element.whenEditModeReady().then(() => {
      done = true;
    });
    await microtasks();
    expect(done).to.equal(true);
  });

  it("hides h-a-x until hax-body has rendered the import, then reveals it", async () => {
    store.editMode = true;
    // the theme can ask before or after the editor's own autorun ran
    let ready = false;
    element.whenEditModeReady().then(() => {
      ready = true;
    });
    await microtasks();
    await element.updateComplete;
    const hax = element.querySelector("h-a-x");
    expect(element.editMode).to.equal(true);
    expect(body.imports.length).to.equal(1);
    expect(hax.classList.contains("haxcms-edit-mode-pending")).to.equal(true);
    // hidden with opacity, never visibility (inherited, so blocks with
    // transition: all would animate hidden -> visible after the swap)
    expect(getComputedStyle(hax).opacity).to.equal("0");
    expect(getComputedStyle(hax).visibility).to.equal("visible");
    expect(hax.hasAttribute("inert")).to.equal(true);
    expect(hax.getBoundingClientRect().height).to.equal(0);
    expect(ready).to.equal(false);
    // asking again while pending returns the same wait
    let readyToo = false;
    element.whenEditModeReady().then(() => {
      readyToo = true;
    });
    body.finishImport();
    // swap waits one frame so editable state applied in it lands too
    expect(ready).to.equal(false);
    await frame();
    await microtasks();
    expect(ready).to.equal(true);
    expect(readyToo).to.equal(true);
    expect(hax.classList.contains("haxcms-edit-mode-pending")).to.equal(false);
    expect(getComputedStyle(hax).opacity).to.equal("1");
    expect(hax.hasAttribute("inert")).to.equal(false);
    // already editing and not importing: no wait
    let again = false;
    element.whenEditModeReady().then(() => {
      again = true;
    });
    await microtasks();
    expect(again).to.equal(true);
  });

  it("leaving edit mode while waiting reveals and resolves right away", async () => {
    store.editMode = true;
    let ready = false;
    element.whenEditModeReady().then(() => {
      ready = true;
    });
    await microtasks();
    store.editMode = false;
    await microtasks();
    await element.updateComplete;
    expect(ready).to.equal(true);
    expect(element.editMode).to.equal(false);
    expect(
      element
        .querySelector("h-a-x")
        .classList.contains("haxcms-edit-mode-pending"),
    ).to.equal(false);
  });

  it("re-importing while already editing does not hide the editor", async () => {
    store.editMode = true;
    await microtasks();
    body.finishImport();
    await frame();
    await microtasks();
    store.activeItemContent = "<p>saved and still editing</p>";
    await microtasks();
    expect(body.imports.length).to.equal(2);
    expect(
      element
        .querySelector("h-a-x")
        .classList.contains("haxcms-edit-mode-pending"),
    ).to.equal(false);
  });

  it("never strands the viewer if the import never reports back", async function () {
    this.timeout(6000);
    store.editMode = true;
    let ready = false;
    element.whenEditModeReady().then(() => {
      ready = true;
    });
    await microtasks();
    await new Promise((r) => setTimeout(r, 2100));
    expect(ready).to.equal(true);
    expect(
      element
        .querySelector("h-a-x")
        .classList.contains("haxcms-edit-mode-pending"),
    ).to.equal(false);
  });

  it("renders blocks the viewer already showed before the swap", async () => {
    // viewer copy (the theme's light DOM): the visitor saw the first block,
    // never scrolled to the second
    const viewer = await fakeViewer(
      "<p>a</p><test-lazy-block></test-lazy-block><test-lazy-block></test-lazy-block>",
      [true, false],
    );
    element.appElement = viewer;
    store.editMode = true;
    let ready = false;
    element.whenEditModeReady().then(() => {
      ready = true;
    });
    await microtasks();
    // the editable copy, hidden in h-a-x
    body.innerHTML =
      "<p>a</p><test-lazy-block><video preload='metadata'></video></test-lazy-block><test-lazy-block></test-lazy-block>";
    const blocks = body.querySelectorAll("test-lazy-block");
    await blocks[0].updateComplete;
    expect(blocks[0].elementVisible).to.equal(false);
    body.finishImport();
    await microtasks();
    await blocks[0].updateComplete;
    // rendered while hidden instead of after the swap
    expect(blocks[0].elementVisible).to.equal(true);
    expect(blocks[0].shadowRoot.querySelector("#rendered")).to.not.equal(null);
    expect(blocks[0].intersectionObserver).to.exist;
    // a block the visitor never scrolled to stays lazy
    expect(blocks[1].elementVisible).to.equal(false);
    // the swap holds for the media's metadata, which lays the player out
    await frame();
    await frame();
    expect(ready).to.equal(false);
    expect(
      element
        .querySelector("h-a-x")
        .classList.contains("haxcms-edit-mode-pending"),
    ).to.equal(true);
    blocks[0].querySelector("video").dispatchEvent(new Event("loadedmetadata"));
    await new Promise((r) => setTimeout(r, 10));
    await frame();
    await microtasks();
    expect(ready).to.equal(true);
    expect(
      element
        .querySelector("h-a-x")
        .classList.contains("haxcms-edit-mode-pending"),
    ).to.equal(false);
    element.appElement = null;
    viewer.remove();
  });

  it("does not hold the viewer long for media that never loads", async () => {
    const viewer = await fakeViewer("<test-lazy-block></test-lazy-block>", [
      true,
    ]);
    element.appElement = viewer;
    store.editMode = true;
    let ready = false;
    element.whenEditModeReady().then(() => {
      ready = true;
    });
    await microtasks();
    body.innerHTML =
      "<test-lazy-block><video preload='metadata'></video></test-lazy-block>";
    body.finishImport();
    await new Promise((r) => setTimeout(r, 700));
    await frame();
    await microtasks();
    expect(ready).to.equal(true);
    element.appElement = null;
    viewer.remove();
  });
});
