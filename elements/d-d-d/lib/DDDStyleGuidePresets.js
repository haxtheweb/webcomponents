export const DDDStyleGuidePresets = {
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
    allowedTags: ["h1", "h2", "h3", "h4"],
    default: false,
    properties: {
      "data-design-treatment": "horz-10p",
      "data-primary": "8",
      "data-border-radius": "xs",
    },
  },
}

function normalizeTag(tag) {
  if (tag && tag.toLowerCase) {
    return tag.toLowerCase()
  }
  return null
}

export function getDDDStyleGuidePresetByKey(presetKey) {
  if (presetKey && DDDStyleGuidePresets[presetKey]) {
    return DDDStyleGuidePresets[presetKey]
  }
  return null
}

export function getDDDStyleGuideOptionsForTag(tag) {
  const normalizedTag = normalizeTag(tag)
  if (!normalizedTag) {
    return []
  }
  return Object.keys(DDDStyleGuidePresets)
    .filter((presetKey) => {
      const preset = DDDStyleGuidePresets[presetKey]
      return (
        preset &&
        Array.isArray(preset.allowedTags) &&
        preset.allowedTags.includes(normalizedTag)
      )
    })
    .map((presetKey) => {
      const preset = DDDStyleGuidePresets[presetKey]
      return {
        value: presetKey,
        text: preset.name,
      }
    })
}

export function getDDDStyleGuidePresetManagedAttributes() {
  const attributes = {}
  Object.keys(DDDStyleGuidePresets).forEach((presetKey) => {
    const preset = DDDStyleGuidePresets[presetKey]
    if (preset && preset.properties) {
      Object.keys(preset.properties).forEach((attribute) => {
        attributes[attribute] = true
      })
    }
  })
  return Object.keys(attributes)
}

export function getDDDStyleGuideDefaultPresetForTag(tag) {
  const normalizedTag = normalizeTag(tag)
  if (!normalizedTag) {
    return null
  }
  let defaultKey = null
  Object.keys(DDDStyleGuidePresets).forEach((presetKey) => {
    const preset = DDDStyleGuidePresets[presetKey]
    if (
      !defaultKey &&
      preset &&
      preset.default === true &&
      Array.isArray(preset.allowedTags) &&
      preset.allowedTags.includes(normalizedTag)
    ) {
      defaultKey = presetKey
    }
  })
  if (defaultKey) {
    return {
      key: defaultKey,
      ...DDDStyleGuidePresets[defaultKey],
    }
  }
  return null
}

export function getDDDStyleGuideSchemaOverride(tag) {
  const normalizedTag = normalizeTag(tag)
  if (!normalizedTag) {
    return null
  }
  const defaultPreset = getDDDStyleGuideDefaultPresetForTag(normalizedTag)
  if (!defaultPreset || !defaultPreset.properties) {
    return null
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
  }
}
