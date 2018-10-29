import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: none;
      }
    </style>
    <slot></slot>
`,
  is: "hax-autoloader",
  properties: { processedList: { type: Object, value: {} } },
  attached: function() {
    this.fire("hax-register-autoloader", this);
  },
  ready: function() {
    this._observer = dom(this).observeNodes(function(info) {
      if (0 < info.addedNodes.length) {
        this.processNewElements(info.addedNodes);
      }
    });
  },
  processNewElements: function() {
    for (
      var effectiveChildren = dom(this).getEffectiveChildNodes(), i = 0;
      i < effectiveChildren.length;
      i++
    ) {
      if (
        typeof effectiveChildren[i].tagName !== typeof void 0 &&
        typeof this.processedList[effectiveChildren[i].tagName] ===
          typeof void 0
      ) {
        try {
          let name = effectiveChildren[i].tagName.toLowerCase();
          this.processedList[name] = name;
          this.importHref(this.resolveUrl(`../../${name}/${name}.js`));
        } catch (err) {}
      }
    }
  },
  importHref: function(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script"),
        tempGlobal =
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
