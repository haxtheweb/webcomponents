/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
/**
 * `haxcms-editor-builder`
 * Figure out what our context is and setup based on that
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - something called us asking to provide an authoring solution
 * - we need to decide based on environment if this supports php, beaker or none
 */
Polymer({
  is: "haxcms-editor-builder",
  /**
   * created life cycle
   */
  ready: function() {
    this.getContext();
  },
  /**
   * Try to get context of what backend is powering this
   */
  getContext: function() {
    let context = "";
    let basePath = pathFromUrl(import.meta.url);
    // @todo add support for a demo mode as well as other context definitions
    // figure out if we need to load the PHP or beaker
    if (typeof DatArchive !== typeof undefined) {
      this.importHref(basePath + "haxcms-beaker.js");
      window.cmsSiteEditor.tag = "haxcms-beaker";
      context = "beaker";
    } else if (window.__haxCMSContextNode === true) {
      // @todo add support for node js based back end
      context = "nodejs";
      //this.importHref(basePath + "haxcms-nodejs.js");
      //window.cmsSiteEditor.tag = "haxcms-nodejs";
    } else if (window.__haxCMSContextDemo === true) {
      // @todo add support for demo mode that has no real backend
      context = "demo";
      //this.importHref(basePath + "haxcms-demo.js");
      //window.cmsSiteEditor.tag = "haxcms-demo";
    } else {
      this.importHref(basePath + "haxcms-jwt.php");
      window.cmsSiteEditor.tag = "haxcms-jwt";
      context = "php";
    }
    return context;
  },
  /**
   * Hack to replace importHref from Polymer 1 that TYPICALLY will work in ESM
   */
  importHref: function(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const tempGlobal =
        "__tempModuleLoadingVariable" +
        Math.random()
          .toString(32)
          .substring(2);
      script.type = "module";
      script.textContent = `import * as m from "${url}"; window.${tempGlobal} = m;`;
      script.onload = () => {
        resolve(window[tempGlobal]);
        delete window[tempGlobal];
        script.remove();
      };
      script.onerror = () => {
        reject(new Error("Failed to load module script with URL " + url));
        delete window[tempGlobal];
        script.remove();
      };
      document.documentElement.appendChild(script);
    });
  }
});

window.cmsSiteEditor = window.cmsSiteEditor || {};
// store reference to the instance as a global
window.cmsSiteEditor.instance = null;
// self append if anyone calls us into action
window.cmsSiteEditor.requestAvailability = function(
  element = this,
  location = document.body
) {
  if (!window.cmsSiteEditor.instance) {
    window.cmsSiteEditor.instance = document.createElement(
      window.cmsSiteEditor.tag
    );
    window.cmsSiteEditor.instance.appElement = element;
    window.cmsSiteEditor.instance.appendTarget = location;
    // self append the reference to.. well.. us.
    document.body.appendChild(window.cmsSiteEditor.instance);
  } else {
    // already exists, just alter some references
    window.cmsSiteEditor.instance.appElement = element;
    window.cmsSiteEditor.instance.appendTarget = location;
    if (
      typeof window.cmsSiteEditor.instance.haxCmsSiteEditorElement !==
      typeof undefined
    ) {
      window.cmsSiteEditor.instance.appendTarget.appendChild(
        window.cmsSiteEditor.instance.haxCmsSiteEditorElement
      );
    }
  }
};
