export const DDDPaletteSwatches = Object.freeze([1, 2, 3, 4, 5, 6, 7]);

export const DDDPaletteRegistry = Object.freeze([
  {
    key: "wisdom-walk-green",
    label: "Wisdom Walk Green",
    dataPalette: "0",
    aliases: Object.freeze(["wisdom-walk-green", "0"]),
  },
  {
    key: "very-violent-red",
    label: "Very Violent Red",
    dataPalette: "1",
    aliases: Object.freeze(["very-violent-red", "1"]),
  },
  {
    key: "beetles-yellow",
    label: "Beetles Yellow",
    dataPalette: "2",
    aliases: Object.freeze(["beetles-yellow", "2"]),
  },
  {
    key: "offbrand-nittany-blue",
    label: "Offbrand Nittany Blue",
    dataPalette: "3",
    aliases: Object.freeze(["offbrand-nittany-blue", "3"]),
  },
  {
    key: "boring-blue-gray",
    label: "Boring Blue Gray",
    dataPalette: "4",
    aliases: Object.freeze(["boring-blue-gray", "4"]),
  },
  {
    key: "monotone",
    label: "Monotone",
    dataPalette: "5",
    aliases: Object.freeze(["monotone", "5"]),
  },
  {
    key: "salmon-season",
    label: "Salmon Season",
    dataPalette: "6",
    aliases: Object.freeze(["salmon-season", "6"]),
  },
  {
    key: "tweedle-dee",
    label: "Tweedle Dee",
    dataPalette: "7",
    aliases: Object.freeze(["tweedle-dee", "7"]),
  },
  {
    key: "polaris-invent",
    label: "Polaris Invent",
    dataPalette: "8",
    aliases: Object.freeze(["polaris-invent", "8"]),
  },
  {
    key: "positively-purple",
    label: "Positively Purple",
    dataPalette: "9",
    aliases: Object.freeze(["positively-purple", "9"]),
  },
  {
    key: "honey-bear",
    label: "Honey Bear",
    dataPalette: "10",
    aliases: Object.freeze(["honey-bear", "10"]),
  },
  {
    key: "boldly-lion",
    label: "Boldly Lion",
    dataPalette: "11",
    aliases: Object.freeze(["boldly-lion", "11"]),
  },
]);

function _normalizePaletteInput(value) {
  if (value === 0 || value === "0") {
    return "0";
  }
  if (!value && value !== 0) {
    return "";
  }
  if (!value.toString) {
    return "";
  }
  return value.toString().trim().toLowerCase();
}

function _matchesPaletteOption(option, normalizedValue) {
  if (!option || !normalizedValue) {
    return false;
  }
  if (option.key === normalizedValue || option.dataPalette === normalizedValue) {
    return true;
  }
  if (!Array.isArray(option.aliases)) {
    return false;
  }
  return option.aliases.includes(normalizedValue);
}

function _fallbackPaletteOption(options, fallbackValue = "0") {
  const normalizedFallback = _normalizePaletteInput(fallbackValue);
  let fallback = null;
  if (Array.isArray(options)) {
    fallback =
      options.find((option) =>
        _matchesPaletteOption(option, normalizedFallback),
      ) || null;
    if (!fallback && options.length > 0) {
      fallback = options[0];
    }
  }
  return fallback;
}

function _normalizeOption(option) {
  const aliases = Array.isArray(option.aliases)
    ? [...option.aliases]
    : [option.key, option.dataPalette].filter((value) => !!value || value === 0);
  return {
    key: option.key,
    label: option.label,
    dataPalette: option.dataPalette,
    aliases,
    swatches: [...DDDPaletteSwatches],
  };
}

export function getDDDPaletteOptions() {
  return DDDPaletteRegistry.map((option) => _normalizeOption(option));
}

export function getDDDPaletteOptionByValue(
  value,
  fallbackValue = "0",
  options = DDDPaletteRegistry,
) {
  const normalizedValue = _normalizePaletteInput(value);
  const fallback = _fallbackPaletteOption(options, fallbackValue);
  if (!normalizedValue) {
    return fallback ? _normalizeOption(fallback) : null;
  }
  const match = Array.isArray(options)
    ? options.find((option) => _matchesPaletteOption(option, normalizedValue))
    : null;
  if (match) {
    return _normalizeOption(match);
  }
  return fallback ? _normalizeOption(fallback) : null;
}

export function getDDDPaletteAttributeValue(
  value,
  fallbackValue = "0",
  options = DDDPaletteRegistry,
) {
  const option = getDDDPaletteOptionByValue(value, fallbackValue, options);
  return option ? option.dataPalette : fallbackValue;
}

export function getDDDPaletteKey(
  value,
  fallbackValue = "0",
  options = DDDPaletteRegistry,
) {
  const option = getDDDPaletteOptionByValue(value, fallbackValue, options);
  return option ? option.key : null;
}
