
let wordboundaries = " ,.;:'')*!-";

/**
 * rich-text-editor regex patterns 
 * and documentation for emdash
 */
export const rteMdashReplacement = {
  patterns: [
    {
      match: /(\w+)--(\w+\W)/,
      replace: "$1&mdash;$2",
      excludeAncestors: ["pre", "code", "a"],
      lastChars: wordboundaries.split(""),
      examples: ["The emdash--a useful punctuation mark."],
    },
  ]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for ellipsis
 */
export const rteEllipReplacement = {
  patterns: [
    {
      match: /(^|[^\.])\.{3}/,
      replace: "$1&hellip;",
      excludeAncestors: ["pre", "code", "a"],
      lastChars: ['.'],
      examples: ["The ellipsis..."],
    },
  ]
};
/**
 * rich-text-editor regex patterns 
 * and documentation for right arrow
 */
export const rteRarrReplacement = {
  patterns: [
    {
      match: /(\S)-->(\w+\W)/,
      replace: "$1&rarr;$2",
      excludeAncestors: ["pre", "code", "a"],
      lastChars: wordboundaries.split(""),
      examples: ["File-->Save "],
    },
  ]
};

/**
 * rich-text-editor regex patterns 
 * and documentation for basic patterns
 */
 export const rteMiscPatterns = {
  documentation : {
    id: "misc-patterns",
    title: "Miscellaneous Pattern Cheatsheet",
    cheatsheet: {}
  },
  patterns: [
    rteMdashReplacement,
    rteEllipReplacement,
    rteRarrReplacement
  ]
};