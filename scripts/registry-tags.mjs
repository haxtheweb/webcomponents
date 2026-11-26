/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
// The tags a built file defines, in the order it defines them, for
// wc-registry.json (gulp "wc-autoloader"). The first keeps the mapping it
// always had; the rest only fill tags that no file defines first.
//
// haxtheweb/issues#3428: for files that define their elements through a
// class getter, customElements.define(HaxStat.tag, HaxStat), only the first
// getter was read, so a file holding several elements registered one of
// them. hax-marketing-blocks.js defines nine and registered only hax-cast:
// hax-stat, hax-pillar and the rest could never autoload, and every site
// using them imported the file by hand.
export function definedTags(contents, isValidName = () => true) {
  // customElements.define("local-time", s): every one in the file
  const byString = Array.from(
    contents.matchAll(/customElements\.define\(["'`](.*?)["'`]/gm),
    (match) => match[1],
  ).filter((tag) => isValidName(tag));
  if (byString.length > 0) {
    return byString;
  }
  const hasDefine = /customElements\.define\((.*?),(.*?)\)/gm.exec(contents);
  if (hasDefine && hasDefine[1]) {
    // customElements.define(LocalTime.tag, s) / (LocalTime.is, s): every
    // static getter of that name in the file, as the build writes them
    let getter = null;
    if (hasDefine[1].includes(".tag")) {
      getter = /static get tag\(\)\{return"(.*?)"\}/gm;
    } else if (hasDefine[1].includes(".is")) {
      getter = /static get is\(\)\{return"(.*?)"\}/gm;
    }
    if (!getter) {
      return [];
    }
    return Array.from(contents.matchAll(getter), (match) => match[1]).filter(
      (tag) => isValidName(tag),
    );
  }
  // support for polymer legacy class housing
  const polymerLegacy = /is\:\"(.*?)\"/gm.exec(contents);
  if (polymerLegacy && polymerLegacy[1] && isValidName(polymerLegacy[1])) {
    return [polymerLegacy[1]];
  }
  // not a file with a custom element definition, so not an entry point
  return [];
}
