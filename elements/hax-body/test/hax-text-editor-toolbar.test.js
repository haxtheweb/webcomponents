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
