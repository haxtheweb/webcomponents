/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { DeviceDetails } from "./lib/PerformanceDetect.js";

/**
 * `replace-tag`
 * `Loading helpers and css`
 * @element replace-tag
 * @customElement
 * @demo demo/magicDeviceMethod.html magic method 2.0
 * @demo demo/magicMethod.html magic method
 * @demo demo/traditionalMethod.html traditional
 */
const ReplaceTagSuper = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
    }
    // define the scafold for how this will self-replace when updated
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.evaluateReplaceMethod();
    }
    performanceBasedReplacement() {
      this.setAttribute("laser-loader", "laser-loader");
      if (!this.loadingText) {
        this.loadingText = "Loading...";
      }
      this.render();
      this.runReplacement();
    }
    /**
     * evaluate based on user device and other settings HOW to handle the replacement
     */
    async evaluateReplaceMethod() {
      // ensure that ANY replace-tag gets this applied
      WCRegistryLoaderCSS();
      let badDevice = await DeviceDetails.badDevice();
      if (
        this.getAttribute("with-method") != "view" &&
        this.getAttribute("import") == null
      ) {
        // look at browser performance
        // if below a threashold display message to replace on click
        if (badDevice) {
          if (!this.loadingText) {
            this.loadingText = "Click to load";
          }
          this.addEventListener("click", this.performanceBasedReplacement);
        }
      }
      // if we don't have a poor device or another setting is used, then we are
      // expected to use lazy loading as it comes into the viewport like the rest
      if (!badDevice || this.getAttribute("import") != null) {
        this.setAttribute("laser-loader", "laser-loader");
        if (!this.loadingText) {
          this.loadingText = "Loading...";
        }
        if (!this.intersectionObserver) {
          this.intersectionObserver = new IntersectionObserver(
            this.handleIntersectionCallback.bind(this),
            {
              root: document.rootElement,
              rootMargin: "0px",
              threshold: [0.0, 0.25, 0.5, 0.75, 1.0],
              delay: 150,
            }
          );
          this.intersectionObserver.observe(this);
        }
      }
      this.render();
    }
    /**
     * Very basic IntersectionObserver callback which will replace on visible
     */
    handleIntersectionCallback(entries) {
      for (let entry of entries) {
        let ratio = Number(entry.intersectionRatio).toFixed(2);
        // ensure ratio is higher than our limit before trigger visibility
        if (ratio >= 0.25) {
          this.intersectionObserver.disconnect();
          this.intersectionObserver = null;
          this.runReplacement();
        }
      }
    }
    /**
     * replacement callback; avoiding use of replace bc of built in JS expectation for this method
     */
    runReplacement() {
      // ensure we have something to replace this with
      if (this.getAttribute("with")) {
        customElements
          .whenDefined(this.getAttribute("with"))
          .then((response) => {
            let props = {};
            if (this.getAttribute("import") != null) {
              this.remove();
            } else {
              // just the props off of this for complex state
              for (
                var i = 0, atts = this.attributes, n = atts.length;
                i < n;
                i++
              ) {
                props[atts[i].nodeName] = atts[i].nodeValue;
              }
              let replacement = document.createElement(props.with);
              replacement.setAttribute("popup-loader", "popup-loader");
              // set the value in the new object
              for (var i in props) {
                if (props[i] != null) {
                  replacement.setAttribute(i, props[i]);
                }
              }
              replacement.removeAttribute("laser-loader");
              replacement.innerHTML = this.innerHTML;
              this.replaceWith(replacement);
              // variable / attribute clean up on the element that got replaced as
              // "this" is still valid for this loop
              setTimeout(() => {
                replacement.removeAttribute("popup-loader");
                replacement.removeAttribute("laser-loader");
                replacement.style.setProperty("--laserEdgeAni-width", null);
                replacement.style.setProperty(
                  "--laserEdgeAni-innerWidth",
                  null
                );
                replacement.style.setProperty("--laserEdgeAni-height", null);
                replacement.style.setProperty(
                  "--laserEdgeAni-innerHeight",
                  null
                );
              }, 250);
            }
            // we resolved 1 definition so now we know it's safe to do all of them
            setTimeout(() => {
              document.body
                .querySelectorAll('replace-tag[with="' + props.with + '"]')
                .forEach((el) => {
                  el.runReplacement();
                });
            }, 0);
          });
        // inject autoload tag which self appends
        import("@lrnwebcomponents/wc-autoload/wc-autoload.js").then(() => {
          // force a process to occur if this is the 1st time
          window.WCAutoload.process().then(() => {
            // kicks off the definition to load from the registry if its in there
            // the promise ensures everyting in the registry is teed up before
            // the DOM is asked to be processed w/ a definition
            window.WCAutoload.requestAvailability().registry.loadDefinition(
              this.getAttribute("with")
            );
          });
        });
      } else {
        console.warn(
          "replace-tag requires use of with attribute for what to upgrade to"
        );
      }
    }
  };
};
class ReplaceTag extends ReplaceTagSuper(HTMLElement) {
  constructor() {
    super();
    if (this.getAttribute("loading-text")) {
      this.loadingText = this.getAttribute("loading-text");
    }
    // support for element being defined prior to view
    if (
      this.getAttribute("with") &&
      customElements.get(this.getAttribute("with"))
    ) {
      let props = {};
      if (this.getAttribute("import") != null) {
        this.remove();
      } else {
        for (var i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
          props[atts[i].nodeName] = atts[i].nodeValue;
        }
        let replacement = document.createElement(props.with);
        // set the value in the new object
        for (var i in props) {
          if (props[i] != null) {
            replacement.setAttribute(i, props[i]);
          }
        }
        replacement.removeAttribute("laser-loader");
        replacement.removeAttribute("loading-text");
        replacement.innerHTML = this.innerHTML;
        this.replaceWith(replacement);
      }
    }
    this.template = document.createElement("template");
    this.attachShadow({ mode: "open" });
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "replace-tag";
  }
  get html() {
    return `
    <style>
    :host {
      display: block;
      opacity: .3;
      transition: .3s linear opacity,.3s linear outline,.3s linear visibility,.3s linear display;
    }
    :host([import]) {
      opacity: .1 !important;
      background-color: transparent !important;
      color: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
      font-size: 2px !important;
      line-height: 2px !important;
      height:2px;
    }
    :host(:not([with-method="click"])) {
      background-color: #EEEEEE;
      color: #444444;
      font-size: 16px;
      opacity: .8;
      margin: 16px;
      padding: 16px;
    }
    :host(:not([with-method="click"]):hover) {
      opacity: 1 !important;
      outline: 1px solid black;
      cursor: pointer;
    }
    :host([hidden]) {
      display: none;
    }
    </style>
<div>${this.loadingText}</div>`;
  }
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
}
customElements.define(ReplaceTag.tag, ReplaceTag);
export { ReplaceTag };

// loading styles and utilities
// loader that uses a CSS selector and variables in order to auto generate outlines
function WCRegistryLoaderCSS(
  auto = false,
  parent = "*",
  selectorBase = ":not(:defined)"
) {
  // debounce entire call automatically in case of spamming as new things get added to screen
  clearTimeout(window.WCRegistryLoaderCSSDebounce);
  window.WCRegistryLoaderCSSDebounce = setTimeout(() => {
    // default selector is anything that says to operate this way
    let selector = parent + "[laser-loader]" + selectorBase;
    // much more aggressive, apply loading to ANYTHING not defined
    // previously. This needs more testing but would assume everything
    // has its box model in shape at run time w/ css fallbacks which is
    // probably not a realistic assumption but worth trying in the end
    if (auto) {
      selector = parent + selectorBase;
    }
    // map all results of our selector
    [...document.body.querySelectorAll("replace-tag," + selector)].map((el) => {
      // automaticlaly set the laser loader flag if told
      if (auto) {
        el.setAttribute("laser-loader", "laser-loader");
      }
      // calc the box model's definition for height and width
      const d = el.getBoundingClientRect();
      el.style.setProperty("--laserEdgeAni-width", d.width + "px");
      el.style.setProperty("--laserEdgeAni-innerWidth", d.width - 2 + "px");
      el.style.setProperty("--laserEdgeAni-innerHeight", d.height - 2 + "px");
      el.style.setProperty("--laserEdgeAni-height", d.height + "px");
      customElements.whenDefined(el.localName).then((response) => {
        if (el.localName != "replace-tag") {
          // this would be a way of doing loading state on ANYTHING without definition
          el.setAttribute("loaded", "loaded");
          el.removeAttribute("laser-loader");
          el.style.setProperty("--laserEdgeAni-width", null);
          el.style.setProperty("--laserEdgeAni-innerWidth", null);
          el.style.setProperty("--laserEdgeAni-height", null);
          el.style.setProperty("--laserEdgeAni-innerHeight", null);
          // delay this bc if it has the pop up loader on it it needs to wait to finish the animation
          setTimeout(() => {
            el.removeAttribute("popup-loader");
            // clean up loaded state as if none of this ever happened
            setTimeout(() => {
              el.removeAttribute("loaded");
            }, 1000);
          }, 1000);
        }
      });
    });
  }, 10);
}
const loadingStylesResizeEvent = function () {
  clearTimeout(window.WCRegistryLoaderCSSDebounce2);
  window.WCRegistryLoaderCSSDebounce2 = setTimeout(() => {
    // ensure we have something undefind
    if (
      document.body.querySelectorAll("replace-tag,:not(:defined)").length > 0
    ) {
      WCRegistryLoaderCSS();
    } else {
      // we no longer have anything defined so remove self listening
      window.removeEventListener("resize", loadingStylesResizeEvent);
    }
  }, 100);
};
// resize function incase the screen changes shape while still loading (like phone rotating)
window.addEventListener("resize", loadingStylesResizeEvent);
