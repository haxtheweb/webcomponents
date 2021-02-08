/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `shadow-style`
 * `write css that is for piercing shadow roots and applying CSS automatically`
 *
 * @demo demo/index.html
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
        "[laying a hand on the web component] Do you feel in charge?"
      );
      console.warn("..I've paid your APIs a small fortune.");
      console.error("And this gives you... power over me?");
      console.warn("What is this..");
      console.error("You APIs and web platform have been important, till now");
      console.warn("What are you..");
      console.error(
        "I'm web standards' reckoning, here to end the ball of twine you've all been coding on."
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
  // async to ensure we await the Promises all resolving
  async processShadowText(text) {
    // selector to help match our css
    let regex = new RegExp("(.*?)([^{])s*{s*([^}]*?)}", "gim");
    let result;
    // storage for all promises so that we can wait till they all resolve
    let promises = [];
    // run through each selector we found
    while ((result = regex.exec(text))) {
      // clean up while space and work on the high level selector for the tag to inject into
      let selector = result[1].trim().replace(/\s\s+/g, " ");
      // target our made up shadow selector
      let tmp = selector.split("::shadow");
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
        this.cssMap[ceTagName][shadowSelector] += result[3]
          .trim()
          .replace(/\s\s+/g, " ");
      }
      // we now have to wait till this definition is populated in the registry
      // so wait for this so that the definition comes in when it feels like it
      promises.push(customElements.whenDefined(ceTagName));
    }
    // below here won't run until all those elements we care about can be injected into successfully
    await Promise.all(promises);
    // delay a microtask just to be safe
    setTimeout(() => {
      // run through the map built ahead of time
      for (var tagName in this.cssMap) {
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
            let style = document.createElement("style");
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
    }, 0);
  }
}
customElements.define(ShadowStyle.tag, ShadowStyle);
export { ShadowStyle };
