/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `shadow-style`
 * `write css that is for piercing shadow roots and applying CSS automatically`
 * @element shadow-style
 */
class ShadowStyle extends HTMLElement {
  constructor() {
    super();
    // support evil
    if (this.getAttribute("evil") != null) {
      // this will forcibly hijack all shadowRoot definitions to ensure that they
      // can work with our call structure: reference: https://twitter.com/btopro/status/1356798076812484614
      Element.prototype._attachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function () {
        return this._attachShadow({ mode: "open" });
      };
      console.error("Leave us..");
      console.warn("No, stay here. I'm in charge");
      console.error(
        "[laying a hand on the web component] Do you feel in charge?",
      );
      console.warn("..I've paid your APIs a small fortune.");
      console.error("And this gives you... power over me?");
      console.warn("What is this..");
      console.error("You APIs and web platform have been important, till now");
      console.warn("What are you..");
      console.error(
        "I'm web standards' reckoning, here to end the ball of twine you've all been coding on.",
      );
      console.warn("You .. you're evil.");
      console.error("I am nessecary evil");
    }
    // this will build the map for all styles
    this.cssMap = {};
    // force this to not be shown visually
    this.style.display = "none";
    // run through the injector based on innerText
    this.processShadowText(this.innerText);
  }
  static get tag() {
    return "shadow-style";
  }
  // async to keep the historical call signature; injection now happens
  // per tag so one bad tag can never block the batch (issue #3102 bug 41)
  async processShadowText(text) {
    // selector to help match our css
    let regex = new RegExp("(.*?)([^{])s*{s*([^}]*?)}", "gim");
    let result;
    // run through each selector we found
    while ((result = regex.exec(text))) {
      // clean up while space and work on the high level selector for the tag to inject into
      let selector = result[1].trim().replace(/\s\s+/g, " ");
      // target our made up shadow selector
      let tmp = selector.split("::shadow");
      // validate the selector shape (issue #3102 bug 9): the regex matches
      // ANY css rule, so plain rules without a ::shadow part must be
      // SKIPPED rather than dereferencing an undefined tmp[1] (which used
      // to reject the un-awaited constructor promise with a TypeError)
      if (tmp.length < 2) {
        continue;
      }
      // this is the tag to be injecting into
      let ceTagName = tmp[0];
      // clean up the () around it
      let shadowSelector = tmp[1].replace("(", "").replace(")", "");
      // ensure we have this defined / there can be multiple selectors on same thing applied
      if (!this.cssMap[ceTagName]) {
        this.cssMap[ceTagName] = {};
      }
      // append the text of the css selector (aka attributes / css props) to a single string
      // accounting for multiple selections of the same shadow selector
      if (!this.cssMap[ceTagName][shadowSelector]) {
        this.cssMap[ceTagName][shadowSelector] = result[3]
          .trim()
          .replace(/\s\s+/g, " ");
      } else {
        // join duplicate tag+selector blocks with a newline so the
        // generated css stays valid (issue #3102 bug 40)
        this.cssMap[ceTagName][shadowSelector] +=
          "\n" + result[3].trim().replace(/\s\s+/g, " ");
      }
    }
    // wait per tag so that the definition comes in when it feels like it:
    // an invalid name rejects whenDefined (skip and warn) and a valid but
    // never-defined tag simply never injects its own rules; neither blocks
    // the other tags anymore (issue #3102 bug 41)
    for (let ceTagName in this.cssMap) {
      this.__injectWhenDefined(ceTagName);
    }
  }
  /**
   * wait for a single tag to be defined, then inject only its rules
   */
  __injectWhenDefined(ceTagName) {
    customElements
      .whenDefined(ceTagName)
      .then(() => {
        // delay a microtask just to be safe
        setTimeout(() => {
          this.__injectTag(ceTagName);
        }, 0);
      })
      .catch(() => {
        console.warn(
          `shadow-style: skipping "${ceTagName}" because it is not a valid custom element name`,
        );
      });
  }
  /**
   * inject the mapped css for one tag into every instance in this root
   */
  __injectTag(tagName) {
    // walk the tag name and query anything in the root document above our implementation
    // this SHOULD then work within shadows of shadows :)
    this.getRootNode()
      .querySelectorAll(tagName)
      .forEach((el) => {
        // sanity check for shadow or just append into the tag itself
        // which is of limited use but at least do... something
        let appendTo = el;
        if (el.shadowRoot) {
          appendTo = el.shadowRoot;
        }
        // make a style tag that is empty
        let style = globalThis.document.createElement("style");
        style.innerHTML = "";
        // apply any / all selectors found to this element
        for (let shadowSelector in this.cssMap[tagName]) {
          // append the selector
          style.innerHTML += `${shadowSelector} {${this.cssMap[tagName][shadowSelector]}}`;
        }
        // append it to the shadowRoot of the node in question
        appendTo.appendChild(style);
      });
  }
}
globalThis.customElements.define(ShadowStyle.tag, ShadowStyle);
export { ShadowStyle };
