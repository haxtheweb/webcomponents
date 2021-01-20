/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
// pull in global styling window objects for processing
import "./lib/loading-styles.js";
import "@lrnwebcomponents/wc-autoload/wc-autoload.js";

/**
 * `replace-tag`
 * `Loading helpers and css`
 * @demo demo/index.html
 * @element replace-tag
 */
const ReplaceTagSuper = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
    }
    /**
     * HTMLElement specification
     */
    disconnectedCallback() {
      // if we have an intersection observer, disconnect it
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
      }
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
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
      this.loadingStatement = "Loading...";
      this.render();
      this.runReplacement();
    }
    /**
     * evaluate based on user device and other settings HOW to handle the replacement
     */
    evaluateReplaceMethod() {
      // ensure that ANY replace-tag gets this applied
      window.WCRegistryLoaderCSS();
      switch (this.getAttribute("with-method")) {
        case "performance":
          let crappy = true;
          if (navigator) {
            if (navigator.deviceMemory && navigator.deviceMemory > 4) {
            }
          }
          // look at browser performance
          // if below a threashold display message to replace on tap
          if (crappy) {
            this.loadingStatement = "Click / Tap to load";
            this.addEventListener("click", this.performanceBasedReplacement);
          }
          break;
        case "visible":
        default:
          this.setAttribute("laser-loader", "laser-loader");
          this.loadingStatement = "Loading...";
          this.intersectionObserver = new IntersectionObserver(
            this.handleIntersectionCallback.bind(this),
            {
              root: document.rootElement,
              rootMargin: "0px",
              threshold: [0.0, 0.25, 0.5, 0.75, 1.0],
              delay: 250,
            }
          );
          this.intersectionObserver.observe(this);
          break;
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
        setTimeout(() => {
          // kicks off the definition to load from the registry if its in there
          window.WCAutoload.requestAvailability().registry.loadDefinition(
            this.getAttribute("with")
          );
          customElements
            .whenDefined(this.getAttribute("with"))
            .then((response) => {
              // just the props off of this for complex state
              let props = {};
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
              }, 300);
            });
        }, 250);
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
      background-color: #DDDDDD;
      color: black;
      font-size: 16px;
      margin:16px;
      padding: 16px;
      opacity: .8;
      transition: .3s linear all;
    }
    :host([with-method="performance"]:hover) {
      opacity: 1 !important;
      outline: 1px solid black;
      cursor: pointer;
    }
    :host([hidden]) {
      display: none;
    }
    </style>
<div>${this.loadingStatement}</div>`;
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
