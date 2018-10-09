import "@polymer/polymer/polymer.js";
/**
`hax-autoloader`
Automatically load elements based on the most logical location with future fallback support for CDNs.

@demo demo/index.html

@microcopy - the mental model for this element
 - hax-autoloader - autoloading of custom element imports which can then emmit events as needed
*/
Polymer({
  _template: `
    <style>
      :host {
        display: none;
      }
    </style>
    <slot></slot>
`,

  is: "hax-autoloader",

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
  },

  /**
   * Ready.
   */
  ready: function() {
    // notice elements when they update
    this._observer = Polymer.dom(this).observeNodes(function(info) {
      // if we've got new nodes, we have to react to that
      if (info.addedNodes.length > 0) {
        this.processNewElements(info.addedNodes);
      }
    });
  },

  /**
   * Process new elements
   */
  processNewElements: function(e) {
    // when new nodes show up in the slots then fire the needed pieces
    var effectiveChildren = Polymer.dom(this).getEffectiveChildNodes();
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
          this.processedList[name] = name;
          // @todo support CDN failover or a flag of some kind to ensure
          // this delivers locally or from remote
          this.importHref(
            this.resolveUrl(`../${name}/${name}.html`),
            e => {
              //e.target.import
            },
            e => {
              //import failed
            }
          );
        } catch (err) {
          // error in the event this is a double registration
        }
      }
    }
  }
});
