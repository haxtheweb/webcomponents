import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";

/**
`hax-autoloader`
Automatically load elements based on the most logical location with future fallback support for CDNs.

* @demo demo/index.html

@microcopy - the mental model for this element
 - hax-autoloader - autoloading of custom element imports which can then emmit events as needed
*/
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
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    /**
     * List of elements processed so we don't double process
     */
    processedList: {
      type: Object,
      value: {}
    }
  },

  /**
   * Attached to the DOM, now fire that we exist.
   */
  attached: function() {
    // fire an event that this is the manager
    this.fire("hax-register-autoloader", this);
    // notice elements when they update
    this._observer = new FlattenedNodesObserver(this, info => {
      // if we've got new nodes, we have to react to that
      if (info.addedNodes.length > 0) {
        async.microTask.run(() => {
          this.processNewElements(info.addedNodes);
        });
      }
    });
  },
  /**
   * Process new elements
   */
  processNewElements: function(e) {
    // when new nodes show up in the slots then fire the needed pieces
    let effectiveChildren = FlattenedNodesObserver.getFlattenedNodes(
      this
    ).filter(n => n.nodeType === Node.ELEMENT_NODE);
    for (var i = 0; i < effectiveChildren.length; i++) {
      // strip invalid tags / textnodes
      if (
        typeof effectiveChildren[i].tagName !== typeof undefined &&
        typeof this.processedList[effectiveChildren[i].tagName] ===
          typeof undefined
      ) {
        // attempt a dynamic import with graceful failure / fallback
        try {
          let name = effectiveChildren[i].tagName.toLowerCase();
          // see if we already have this definition
          if (typeof effectiveChildren[i].getHaxProperties === "function") {
            const evt = new CustomEvent("hax-register-properties", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: {
                tag: name,
                properties: effectiveChildren[i].getHaxProperties(),
                polymer: true
              }
            });
            context.dispatchEvent(evt);
          } else if (typeof effectiveChildren[i].HAXWiring === "function") {
            const evt = new CustomEvent("hax-register-properties", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                tag: name,
                properties: effectiveChildren[i].HAXWiring.getHaxProperties(),
                polymer: false
              }
            });
            context.dispatchEvent(evt);
          } else {
            // @todo support CDN failover or a flag of some kind to ensure
            // this delivers locally or from remote
            // @todo need to support name spacing of packages so that we
            // don't assume they are all relative to lrnwebcomponents
            const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
            import(`${basePath}../../${name}/${name}.js`)
              .then(response => {
                // get the custom element definition we used to add that file
                let CEClass = window.customElements.get(name);
                if (typeof CEClass.getHaxProperties === "function") {
                  this.setHaxProperties(CEClass.getHaxProperties(), name);
                } else if (typeof CEClass.HAXWiring === "function") {
                  this.setHaxProperties(
                    CEClass.HAXWiring.getHaxProperties(),
                    name
                  );
                } else if (CEClass.haxProperties) {
                  this.setHaxProperties(CEClass.haxProperties, name);
                } else {
                  console.log(`${name} didn't have hax wiring in the end`);
                }
              })
              .catch(error => {
                /* Error handling */
                console.log(error);
              });
          }
          this.processedList[name] = name;
        } catch (err) {
          // error in the event this is a double registration
        }
      }
    }
  }
});
