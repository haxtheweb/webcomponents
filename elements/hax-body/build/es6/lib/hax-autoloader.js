import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "../node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { pathFromUrl } from "../node_modules/@polymer/polymer/lib/utils/resolve-url.js";
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
    this._observer = new FlattenedNodesObserver(this, info => {
      if (0 < info.addedNodes.length) {
        this.processNewElements(info.addedNodes);
      }
    });
  },
  processNewElements: function(e) {
    for (
      var effectiveChildren = FlattenedNodesObserver.getFlattenedNodes(
          this
        ).filter(n => n.nodeType === Node.ELEMENT_NODE),
        i = 0;
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
          const basePath = pathFromUrl(import.meta.url);
          import(`../../${name}/${name}.js`);
        } catch (err) {}
      }
    }
  }
});
