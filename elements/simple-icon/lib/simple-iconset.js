/**
 * Singleton to manage iconsets
 */
class SimpleIconset extends HTMLElement {
  static get tag() {
    return "simple-iconset";
  }
  constructor() {
    super();
    this.iconsets = {};
  }
  /**
   * Iconsets are to register a namespace like so.
   * {
   *   icon: iconLocation,
   *   icon2: iconLocation2
   * }
   */
  registerIconset(name, icons = {}) {
    this.iconsets[name] = { ...icons };
  }
  /**
   * return the icon based on splitting the string on : for position in the object
   */
  getIcon(val) {
    let ary = val.split(":");
    if (ary.length == 2 && this.iconsets[ary[0]]) {
      return this.iconsets[ary[0]][ary[1]];
    }
    return null;
  }
}
/**
 * helper function for iconset developers to resolve relative paths
 */
function pathResolver(base, path = "") {
  return pathFromUrl(decodeURIComponent(base)) + path;
}
// simple path from url
function pathFromUrl(url) {
  return url.substring(0, url.lastIndexOf("/") + 1);
}

customElements.define(SimpleIconset.tag, SimpleIconset);
export { SimpleIconset, pathResolver, pathFromUrl };

window.SimpleIconset = window.SimpleIconset || {};
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.SimpleIconset.requestAvailability = () => {
  if (window.SimpleIconset.instance == null) {
    window.SimpleIconset.instance = document.createElement("simple-iconset");
  }
  document.body.appendChild(window.SimpleIconset.instance);
  return window.SimpleIconset.instance;
};
// self request
window.SimpleIconset.requestAvailability();
