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
    this.needsHydrated = [];
  }
  /**
   * Iconsets are to register a namespace in either manner:
   * object notation: key name of the icon with a specific path to the file
   * {
   *   icon: iconLocation,
   *   icon2: iconLocation2
   * }
   * string notation: assumes icon name can be found at ${iconLocationBasePath}${iconname}.svg
   * iconLocationBasePath
   */
  registerIconset(name, icons = {}) {
    if (typeof icons === "object") {
      this.iconsets[name] = { ...icons };
    } else if (typeof icons === "string") {
      this.iconsets[name] = icons;
    }
    // try processing anything that might have missed previously
    if (this.needsHydrated.length > 0) {
      let list = [];
      this.needsHydrated.forEach((item, index) => {
        // set the src from interns of the icon, returns if it matched
        // which will then push it into the list to be removed from processing
        if (item.setSrcByIcon(this)) {
          list.push(index);
        }
      });
      // process in reverse order to avoid key splicing issues
      list.reverse().forEach((val) => {
        this.needsHydrated.splice(val, 1);
      });
    }
  }
  /**
   * return the icon location on splitting the string on : for position in the object
   * if the icon doesn't exist, it sets a value for future updates in the event
   * that the library for the icon registers AFTER the request to visualize is made
   */
  getIcon(val, context) {
    let ary = val.split(":");
    if (ary.length == 2 && this.iconsets[ary[0]]) {
      if (this.iconsets[ary[0]][ary[1]]) {
        return this.iconsets[ary[0]][ary[1]];
      } else {
        return `${this.iconsets[ary[0]]}${ary[1]}.svg`;
      }
    }
    // if we get here we just missed on the icon hydrating which means
    // either it's an invalid icon OR the library to register the icons
    // location will import AFTER (possible microtiming early on)
    // also weird looking by context is either the element asking about
    // itself OR the the iconset state manager checking for hydration
    if (context != this) {
      this.needsHydrated.push(context);
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
// self request so that when this file is referenced it exists in the dom
window.SimpleIconset.requestAvailability();
