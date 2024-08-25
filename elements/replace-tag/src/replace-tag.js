/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { DeviceDetails } from "./lib/PerformanceDetect.js";
import { WCRegistryLoaderCSS } from "./lib/loading-styles.js";

/**
 * `replace-tag`
 * `Loading helpers and css`
 *
 * This is a powerful little helper that can detect device performance
 * and then conditionally load / import accordingly.
 * The API has two key methods. The default, is used as <replace-tag with="new-tag"></replace-tag>
 * This will ensure that when visible (via IntersectionObserver) that new-tag will get imported.
 * This requires the use of the wc-registry.json setup used in unbundled-webcomponents.
 * The second methodology is to simply do the import on visibility. This is to avoid possible layout
 * thrashing. This looks like `<replace-tag with="new-tag" import-only></replace-tag>` which will NOT
 * render a `new-tag` element but instead simply import the definition. This is useful when you want
 * to avoid layout thrashing OR you want to import assets conditionally based on visibility of any kind.
 * @api import-only     @boolean   - will trigger an import of the tag and then self removal.
 *  This is useful for NOT replacing the tag in context but ensuring the definition loads based on
 *  passing into the viewport
 * @api importing-text  @string - what it says as it is visible to the user while importing.
 *  This also is the "Click to view" on low power environments
 * @api import-method   @string  - if it should import on view or device capabilities
 *  (or automatic, default). View will FORCE a load even on low performance environments while
 * things without this set (like a meme in content) would only load if it's been clicked on
 * for low performance unless the `import-method="view"` is specifically set.
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
              rootMargin: "0px",
              threshold: [0.0, 0.25, 0.5, 0.75, 1.0],
              delay: 150,
            },
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
          if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
          }
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
        import("@haxtheweb/wc-autoload/wc-autoload.js").then(() => {
          // force a process to occur if this is the 1st time
          globalThis.WCAutoload.process().then(() => {
            // kicks off the definition to load from the registry if its in there
            // the promise ensures everyting in the registry is teed up before
            // the DOM is asked to be processed w/ a definition
            globalThis.WCAutoload.requestAvailability().registry.loadDefinition(
              this.getAttribute("with"),
            );
          });
        });
      } else {
        console.warn(
          "replace-tag requires use of with attribute for what to upgrade to",
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
    this.exists = true;
    // support for element being defined prior to view
    if (customElements.get(this.getAttribute("with"))) {
      let props = {};
      if (this.getAttribute("import-only") != null) {
        this.exists = false;
        setTimeout(() => {
          this.remove();
        }, 0);
      } else {
        for (var i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
          props[atts[i].nodeName] = atts[i].nodeValue;
        }
        let replacement = globalThis.document.createElement(props.with);
        // set the value in the new object
        for (var i in props) {
          if (props[i] != null) {
            // trap for bad attributes that were manually typed
            // or HTML imported that was improper in the past
            try {
              replacement.setAttribute(i, props[i]);
            } catch (error) {
              console.warn("Invalid Attribute Name detected: " + i);
            }
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
          this.exists = false;
          setTimeout(() => {
            this.remove();
          }, 0);
        } else {
          // just the props off of this for complex state
          for (var i = 0, atts = this.attributes, n = atts.length; i < n; i++) {
            props[atts[i].nodeName] = atts[i].nodeValue;
          }
          let replacement = globalThis.document.createElement(props.with);
          replacement.setAttribute("popup-loader", "popup-loader");
          // set the value in the new object
          for (var i in props) {
            if (props[i] != null) {
              // trap for bad attributes that were manually typed
              // or HTML imported that was improper in the past
              try {
                replacement.setAttribute(i, props[i]);
              } catch (error) {
                console.warn("Invalid Attribute Name detected: " + i);
              }
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
          globalThis.document.body
            .querySelectorAll('replace-tag[with="' + props.with + '"]')
            .forEach((el) => {
              el.runReplacement();
            });
        }, 0);
      });
    }
    if (this.exists) {
      this.template = globalThis.document.createElement("template");
      this.attachShadow({ mode: "open" });
    }
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
      opacity: .2;
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
    div {
      font-size: 12px;
    }
    :host(:not([import-method="click"])) {
      background-color: #FEFEFE33;
      font-size: 12px;
      opacity: .8;
      margin: 12px;
      padding: 12px;
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
    if (this.exists) {
      this.shadowRoot.innerHTML = null;
      this.template.innerHTML = this.html;

      if (globalThis.ShadyCSS) {
        globalThis.ShadyCSS.prepareTemplate(this.template, this.tag);
      }
      this.shadowRoot.appendChild(this.template.content.cloneNode(true));
    }
  }
}
customElements.define(ReplaceTag.tag, ReplaceTag);
export { ReplaceTag };
