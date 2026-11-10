import { expect } from "@open-wc/testing";
import { HAXStore } from "../lib/hax-store.js";
import { HaxTextEditorToolbar } from "../lib/hax-text-editor-toolbar.js";

const supportedFeatures = [
  "addPage",
  "saveAndEdit",
  "deletePage",
  "styleGuide",
  "outlineDesigner",
  "insights",
  "siteManifest",
  "themeManifest",
  "authorManifest",
  "seoManifest",
  "addBlock",
  "contentMap",
  "viewSource",
  "uploadMedia",
  "onlineMedia",
  "pageBreak",
  "pageTemplates",
  "blockTemplates",
  "popularGizmos",
  "recentGizmos",
  "community",
];

const makePlatformConfig = (allowedBlocks = []) => ({
  __supportedFeatures: new Set(supportedFeatures),
  features: {},
  allowedBlocks: new Set(allowedBlocks),
});

const makeInlineGizmoButton = (tag, title) => ({
  type: "hax-text-editor-button",
  element: {
    gizmo: {
      tag,
      title,
      meta: {
        inlineOnly: true,
      },
    },
    settings: {
      inline: [],
    },
  },
});

describe("hax-text-editor-toolbar inline block filtering", () => {
  let toolbar;
  let originalPlatformConfig;
  let originalInlineGizmos;
  let originalDefaultConfig;

  beforeEach(() => {
    originalPlatformConfig = HAXStore.platformConfig;
    HAXStore.platformConfig = makePlatformConfig([]);
    if (!globalThis.HaxTextEditorToolbarConfig) {
      globalThis.HaxTextEditorToolbarConfig = {};
    }
    originalInlineGizmos = {
      ...(globalThis.HaxTextEditorToolbarConfig.inlineGizmos || {}),
    };
    originalDefaultConfig = globalThis.HaxTextEditorToolbarConfig.default;
    toolbar = new HaxTextEditorToolbar();
  });

  afterEach(() => {
    HAXStore.platformConfig = originalPlatformConfig;
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos = originalInlineGizmos;
    if (typeof originalDefaultConfig === "undefined") {
      delete globalThis.HaxTextEditorToolbarConfig.default;
    } else {
      globalThis.HaxTextEditorToolbarConfig.default = originalDefaultConfig;
    }
  });

  it("filters disabled inline blocks while preserving allowed ones", () => {
    HAXStore.platformConfig = makePlatformConfig(["lrn-math"]);
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos = {
      "moar-sarcasm": makeInlineGizmoButton("moar-sarcasm", "Sarcasm"),
      "lrn-math": makeInlineGizmoButton("lrn-math", "Math"),
    };

    toolbar.__updated = false;
    const config = toolbar.updateToolbarElements();
    const insertGroup = config.find(
      (item) => item && item.subtype === "hax-insert-button-group",
    );
    const insertTags = insertGroup.buttons.map(
      (button) => button.element.gizmo.tag,
    );

    expect(insertTags).to.deep.equal(["lrn-math"]);
  });

  it("retains inline blocks that are explicitly allowed", () => {
    HAXStore.platformConfig = makePlatformConfig(["moar-sarcasm", "lrn-math"]);
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos = {
      "moar-sarcasm": makeInlineGizmoButton("moar-sarcasm", "Sarcasm"),
      "lrn-math": makeInlineGizmoButton("lrn-math", "Math"),
    };

    toolbar.__updated = false;
    const config = toolbar.updateToolbarElements();
    const insertGroup = config.find(
      (item) => item && item.subtype === "hax-insert-button-group",
    );
    const insertTags = insertGroup.buttons.map(
      (button) => button.element.gizmo.tag,
    );

    expect(insertTags).to.deep.equal(["moar-sarcasm", "lrn-math"]);
  });
});

describe("hax-text-editor-toolbar compact bar", () => {
  let toolbar;
  let originalPlatformConfig;
  let originalInlineGizmos;

  const findSubtype = (items, subtype) =>
    (items || []).find((item) => item && item.subtype === subtype);

  beforeEach(() => {
    originalPlatformConfig = HAXStore.platformConfig;
    if (!globalThis.HaxTextEditorToolbarConfig) {
      globalThis.HaxTextEditorToolbarConfig = {};
    }
    originalInlineGizmos = {
      ...(globalThis.HaxTextEditorToolbarConfig.inlineGizmos || {}),
    };
    toolbar = new HaxTextEditorToolbar();
    toolbar.barSize = "compact";
  });

  afterEach(() => {
    HAXStore.platformConfig = originalPlatformConfig;
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos = originalInlineGizmos;
  });

  it("keeps only insert-at-cursor tools and the bubble (format, lists and alignment are in the block bar)", () => {
    HAXStore.platformConfig = makePlatformConfig([]);
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos = {};
    toolbar.__updated = false;
    const config = toolbar.updateToolbarElements();
    expect(findSubtype(config, "hax-symbol-insert-button-group")).to.exist;
    expect(findSubtype(config, "list-indent-button-group")).to.not.exist;
    expect(findSubtype(config, "basic-formatting-group")).to.not.exist;
    expect(findSubtype(config, "advanced-inline-button-group")).to.not.exist;
  });

  it("only accepts web, mail, phone and site links", () => {
    expect(toolbar._safeHref("haxtheweb.org/meme")).to.equal(
      "https://haxtheweb.org/meme",
    );
    expect(toolbar._safeHref("https://haxtheweb.org")).to.equal(
      "https://haxtheweb.org",
    );
    expect(toolbar._safeHref("mailto:a@b.co")).to.equal("mailto:a@b.co");
    expect(toolbar._safeHref("/about")).to.equal("/about");
    expect(toolbar._safeHref("#top")).to.equal("#top");
    expect(toolbar._safeHref("javascript:alert(1)")).to.equal("");
    expect(toolbar._safeHref("data:text/html,x")).to.equal("");
    expect(toolbar._safeHref("")).to.equal("");
  });

  it("moves inline formatting into the selection bubble", () => {
    HAXStore.platformConfig = makePlatformConfig([]);
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos = {};
    toolbar.__updated = false;
    const config = toolbar.updateToolbarElements();
    const bubble = findSubtype(config, "hax-selection-bubble");
    expect(bubble).to.exist;
    const commands = bubble.buttons
      .filter((button) => button.command)
      .map((button) => button.command);
    expect(commands).to.include("bold");
    expect(commands).to.include("italic");
    expect(
      bubble.buttons.some(
        (button) => button.className === "hax-selection-link",
      ),
    ).to.equal(true);
    const more = findSubtype(bubble.buttons, "hax-selection-more");
    expect(more).to.exist;
    expect(more.buttons.length).to.be.greaterThan(0);
  });

  it("puts inline blocks that wrap a selection in More formats and keeps cursor inserts in the bar", () => {
    HAXStore.platformConfig = makePlatformConfig(["moar-sarcasm", "lrn-math"]);
    const atCursor = makeInlineGizmoButton("lrn-math", "Math");
    atCursor.element.gizmo.meta.selectionRequired = false;
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos = {
      "moar-sarcasm": makeInlineGizmoButton("moar-sarcasm", "Sarcasm"),
      "lrn-math": atCursor,
    };
    toolbar.__updated = false;
    const config = toolbar.updateToolbarElements();
    const insertGroup = findSubtype(config, "hax-insert-button-group");
    expect(
      insertGroup.buttons.map((button) => button.element.gizmo.tag),
    ).to.deep.equal(["lrn-math"]);
    const more = findSubtype(
      findSubtype(config, "hax-selection-bubble").buttons,
      "hax-selection-more",
    );
    const moreTags = more.buttons
      .filter((button) => button.element)
      .map((button) => button.element.gizmo.tag);
    expect(moreTags).to.deep.equal(["moar-sarcasm"]);
  });

  it("uses today's full toolbar when all tools are shown", () => {
    HAXStore.platformConfig = makePlatformConfig([]);
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos = {};
    toolbar.barSize = "full";
    toolbar.__updated = false;
    const config = toolbar.updateToolbarElements();
    expect(findSubtype(config, "hax-selection-bubble")).to.not.exist;
    expect(findSubtype(config, "basic-formatting-group")).to.exist;
  });
});
