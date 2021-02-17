/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { DeviceDetails } from "./lib/PerformanceDetect.js";
import { WCRegistryLoaderCSS } from "./lib/loading-styles.js";

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
      if (!this.importingText) {
        this.importingText = "Loading...";
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
        this.getAttribute("import-method") != "view" &&
        this.getAttribute("import-only") == null
      ) {
        // look at browser performance
        // if below a threashold display message to replace on click
        if (badDevice) {
          if (!this.importingText) {
            this.importingText = "Click to load";
          }
          this.addEventListener("click", this.performanceBasedReplacement);
        }
      }
      // if we don't have a poor device or another setting is used, then we are
      // expected to use lazy loading as it comes into the viewport like the rest
      if (
        !badDevice ||
        this.getAttribute("import-only") != null ||
        this.getAttribute("import-method") == "view"
      ) {
        this.setAttribute("laser-loader", "laser-loader");
        if (!this.importingText) {
          this.importingText = "Loading...";
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
    if (this.getAttribute("importing-text")) {
      this.importingText = this.getAttribute("importing-text");
    }
    // support for element being defined prior to view
    if (customElements.get(this.getAttribute("with"))) {
      let props = {};
      if (this.getAttribute("import-only") != null) {
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
        replacement.removeAttribute("with");
        replacement.removeAttribute("import-method");
        replacement.removeAttribute("importing-text");
        replacement.innerHTML = this.innerHTML;
        this.replaceWith(replacement);
      }
    } else {
      customElements.whenDefined(this.getAttribute("with")).then((response) => {
        let props = {};
        if (this.getAttribute("import-only") != null) {
          this.remove();
        } else {
          // just the props off of this for complex state
          for (var i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
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
            replacement.removeAttribute("with");
            replacement.removeAttribute("import-method");
            replacement.removeAttribute("importing-text");
            replacement.removeAttribute("laser-loader");
            replacement.style.setProperty("--laserEdgeAni-width", null);
            replacement.style.setProperty("--laserEdgeAni-innerWidth", null);
            replacement.style.setProperty("--laserEdgeAni-height", null);
            replacement.style.setProperty("--laserEdgeAni-innerHeight", null);
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
    :host(:not([import-method="click"])) {
      background-color: #EEEEEE;
      color: #444444;
      font-size: 16px;
      opacity: .8;
      margin: 16px;
      padding: 16px;
    }
    :host(:not([import-method="click"]):hover) {
      opacity: 1 !important;
      outline: 1px solid black;
      cursor: pointer;
    }
    :host([hidden]) {
      display: none;
    }
    </style>
<div>${this.importingText}</div>`;
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
