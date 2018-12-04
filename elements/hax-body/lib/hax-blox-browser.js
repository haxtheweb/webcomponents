import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-list/iron-list.js";
import "./hax-blox-browser-item.js";
import "./hax-icons.js";
/**
`hax-blox-browser`
List of layout blox to select from

@demo demo/index.html

@microcopy - the mental model for this element
 - blox - silly name for the general public when talking about custom elements and what it provides in the end.
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      hax-blox-browser-item {
        margin: 10px;
        -webkit-transition: 0.3s all linear;
        transition: 0.3s all linear;
      }
      #ironlist {
        min-height: 50vh;
      }
    </style>
    <iron-list id="ironlist" items="[[__bloxList]]" as="blox" grid="">
      <template>
        <div class="blox-container">
          <hax-blox-browser-item
            index="[[blox.index]]"
            layout="[[blox.details.layout]]"
            title="[[blox.details.title]]"
            tag="[[blox.details.tag]]"
            icon="[[blox.details.icon]]"
            author="[[blox.details.author]]"
            teaser="[[blox.details.teaser]]"
            description="[[blox.details.description]]"
            examples="[[blox.details.examples]]"
            status="[[blox.details.status]]"
            blox="[[blox.blox]]"
          ></hax-blox-browser-item>
        </div>
      </template>
    </iron-list>
  `,

  is: "hax-blox-browser",

  properties: {
    /**
     * The list of blox
     */
    bloxList: {
      type: Array,
      observer: "_bloxListChanged"
    }
  },

  ready: function() {
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },

  /**
   * Attached life cycle
   */
  attached: function() {
    this.resetBrowser();
  },

  /**
   * Detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      // make sure we set array's empty first to force a repaint of paths
      if (
        typeof this[e.detail.property] !== typeof undefined &&
        this[e.detail.property] != null &&
        typeof this[e.detail.property].length !== typeof undefined
      ) {
        this.set(e.detail.property, []);
      }
      this.set(e.detail.property, e.detail.value);
    }
  },

  /**
   * Notice bloxList changing.
   */
  _bloxListChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.set("__bloxList", newValue);
    }
  },

  /**
   * Reset this browser.
   */
  resetBrowser: function() {
    setTimeout(() => {
      this.$.ironlist.fire("iron-resize");
      window.dispatchEvent(new Event("resize"));
    }, 100);
  }
});
