/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Style guide presets: a few designed combinations of DDD data attributes
 * for the everyday tags (headings, paragraphs, quotes, lists) so authors get
 * a good look in one click instead of setting each option.
 *
 * Rules the list keeps:
 *  - At most MAX_STYLE_GUIDE_PRESETS_PER_TAG presets offer themselves for any
 *    one tag (the style guide tests enforce it).
 *  - Keys are authored data: content stores data-style-guide="<key>", so a
 *    key is never renamed or removed. A preset that no longer fits a tag drops
 *    that tag from allowedTags instead; content keeps its attributes.
 *  - A preset only sets DDD data attributes. DDD-capable design systems
 *    (systems that extend "ddd", such as PatternFly or Material) remap the
 *    tokens behind them, so each preset takes on that system's colors, radii
 *    and shadows. Systems that do not extend "ddd" never see presets.
 *  - Colors come from tokens every bridge maps: the semantic info, warning,
 *    success and error colors, the neutral limestone accents and the DDD
 *    blues. A block with an accent background also sets data-primary, which
 *    colors its border; without it the border falls back to black.
 */
export const MAX_STYLE_GUIDE_PRESETS_PER_TAG = 5;

export const DDDStyleGuidePresets = {
  // ---- headings ----
  headline: {
    name: "Headline",
    allowedTags: ["h1", "h2"],
    default: true,
    properties: {
      "data-design-treatment": "vert",
      "data-primary": "8",
      "data-padding": "xs",
      "data-border-radius": "xs",
    },
  },
  byline: {
    name: "Byline",
    allowedTags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    default: false,
    properties: {
      "data-design-treatment": "horz-10p",
      "data-primary": "8",
      "data-border-radius": "xs",
    },
  },
  sectionDivider: {
    name: "Section divider",
    allowedTags: ["h2", "h3", "h4"],
    default: false,
    properties: {
      "data-design-treatment": "horz-md",
      "data-primary": "2",
      "data-padding": "xs",
    },
  },
  bannerHeading: {
    name: "Banner",
    allowedTags: ["h2", "h3", "h4", "h5", "h6"],
    default: false,
    properties: {
      "data-design-treatment": "bg",
      "data-primary": "2",
      "data-border-radius": "xs",
    },
  },
  // ---- paragraphs ----
  "style-1": {
    name: "Box Style 1",
    allowedTags: ["p"],
    default: false,
    properties: {
      "data-design-treatment": "dropCap-sm",
      "data-accent": "2",
      "data-border-radius": "md",
    },
  },
  calloutInfo: {
    name: "Callout - Info",
    allowedTags: ["p"],
    default: false,
    properties: {
      "data-primary": "24",
      "data-accent": "9",
      "data-border-radius": "md",
      "data-padding": "s",
      "data-box-shadow": "sm",
    },
  },
  calloutWarning: {
    name: "Callout - Warning",
    allowedTags: ["p"],
    default: false,
    properties: {
      "data-primary": "23",
      "data-accent": "8",
      "data-border-radius": "md",
      "data-padding": "s",
      "data-box-shadow": "sm",
    },
  },
  calloutSuccess: {
    name: "Callout - Success",
    allowedTags: ["p"],
    default: false,
    properties: {
      "data-primary": "25",
      "data-accent": "10",
      "data-border-radius": "md",
      "data-padding": "s",
      "data-box-shadow": "sm",
    },
  },
  calloutError: {
    name: "Callout - Error",
    allowedTags: ["p"],
    default: false,
    properties: {
      "data-primary": "22",
      "data-accent": "7",
      "data-border-radius": "md",
      "data-padding": "s",
      "data-box-shadow": "sm",
    },
  },
  // ---- quotes ----
  // blockquote has designSystem: false in hax-store, so the style guide
  // picker does not offer this preset there yet
  pullQuote: {
    name: "Pull quote",
    allowedTags: ["blockquote"],
    default: false,
    properties: {
      "data-design-treatment": "dropCap-sm",
      "data-primary": "2",
      "data-accent": "2",
      "data-border-radius": "xs",
      "data-padding": "s",
    },
  },
  // ---- blocks ----
  // kept for content that already uses it; div has designSystem: false, so
  // the picker does not offer it
  statBlock: {
    name: "Stat block",
    allowedTags: ["div"],
    default: false,
    properties: {
      "data-primary": "10",
      "data-accent": "2",
      "data-padding": "m",
      "data-border-radius": "md",
      "data-box-shadow": "sm",
      "data-text-align": "center",
    },
  },
  // ---- lists ----
  // Reading lists (DDDStyles.js, data-design-treatment="reading-*"). The
  // visible label is the authored heading before the list, e.g.
  // <h3 data-instructional-action="read">Optional reading</h3>, so it stays
  // real translatable text.
  readingRequired: {
    name: "Required reading",
    allowedTags: ["ul", "ol"],
    default: false,
    properties: {
      "data-design-treatment": "reading-required",
    },
  },
  readingOptional: {
    name: "Optional reading",
    allowedTags: ["ul", "ol"],
    default: false,
    properties: {
      "data-design-treatment": "reading-optional",
    },
  },
  // Bullet and number styles (DDDStyles.js list-* treatments). A plain ul is
  // square bullets and a plain ol is decimal, so those need no preset. The
  // decimal-leading-zero and upper-roman treatments still render for content
  // that has them but are not offered, to stay within five per tag.
  listDisc: {
    name: "Disc bullets",
    allowedTags: ["ul"],
    default: false,
    properties: {
      "data-design-treatment": "list-disc",
    },
  },
  listCircle: {
    name: "Circle bullets",
    allowedTags: ["ul"],
    default: false,
    properties: {
      "data-design-treatment": "list-circle",
    },
  },
  listLowerAlpha: {
    name: "Letters (a, b, c)",
    allowedTags: ["ol"],
    default: false,
    properties: {
      "data-design-treatment": "list-lower-alpha",
    },
  },
  listUpperAlpha: {
    name: "Capital letters (A, B, C)",
    allowedTags: ["ol"],
    default: false,
    properties: {
      "data-design-treatment": "list-upper-alpha",
    },
  },
  listLowerRoman: {
    name: "Roman numerals (i, ii, iii)",
    allowedTags: ["ol"],
    default: false,
    properties: {
      "data-design-treatment": "list-lower-roman",
    },
  },
};

function normalizeTag(tag) {
  if (tag && tag.toLowerCase) {
    return tag.toLowerCase();
  }
  return null;
}

export function getDDDStyleGuidePresetByKey(presetKey) {
  if (presetKey && DDDStyleGuidePresets[presetKey]) {
    return DDDStyleGuidePresets[presetKey];
  }
  return null;
}

export function getDDDStyleGuideOptionsForTag(tag) {
  const normalizedTag = normalizeTag(tag);
  if (!normalizedTag) {
    return [];
  }
  return Object.keys(DDDStyleGuidePresets)
    .filter((presetKey) => {
      const preset = DDDStyleGuidePresets[presetKey];
      return (
        preset &&
        Array.isArray(preset.allowedTags) &&
        preset.allowedTags.includes(normalizedTag)
      );
    })
    .map((presetKey) => {
      const preset = DDDStyleGuidePresets[presetKey];
      return {
        value: presetKey,
        text: preset.name,
      };
    });
}

export function getDDDStyleGuidePresetManagedAttributes() {
  const attributes = {};
  Object.keys(DDDStyleGuidePresets).forEach((presetKey) => {
    const preset = DDDStyleGuidePresets[presetKey];
    if (preset && preset.properties) {
      Object.keys(preset.properties).forEach((attribute) => {
        attributes[attribute] = true;
      });
    }
  });
  return Object.keys(attributes);
}

export function getDDDStyleGuideDefaultPresetForTag(tag) {
  const normalizedTag = normalizeTag(tag);
  if (!normalizedTag) {
    return null;
  }
  let defaultKey = null;
  Object.keys(DDDStyleGuidePresets).forEach((presetKey) => {
    const preset = DDDStyleGuidePresets[presetKey];
    if (
      !defaultKey &&
      preset &&
      preset.default === true &&
      Array.isArray(preset.allowedTags) &&
      preset.allowedTags.includes(normalizedTag)
    ) {
      defaultKey = presetKey;
    }
  });
  if (defaultKey) {
    return {
      key: defaultKey,
      ...DDDStyleGuidePresets[defaultKey],
    };
  }
  return null;
}

export function getDDDStyleGuideSchemaOverride(tag) {
  const normalizedTag = normalizeTag(tag);
  if (!normalizedTag) {
    return null;
  }
  const defaultPreset = getDDDStyleGuideDefaultPresetForTag(normalizedTag);
  if (!defaultPreset || !defaultPreset.properties) {
    return null;
  }
  return {
    demoSchema: [
      {
        tag: normalizedTag,
        properties: {
          "data-style-guide": defaultPreset.key,
          ...defaultPreset.properties,
        },
        content: "",
      },
    ],
  };
}
