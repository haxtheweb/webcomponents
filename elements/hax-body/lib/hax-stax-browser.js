import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-list/iron-list.js";
import "./hax-stax-browser-item.js";
/**
`hax-stax-browser`
Select a stack / template to insert

@demo demo/index.html

@microcopy - the mental model for this element
 - stax - silly name for the general public when talking about custom elements and what it provides in the end.
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      hax-stax-browser-item {
        margin: 10px;
        -webkit-transition: .3s all linear;
        transition: .3s all linear;
      }
      #ironlist {
        min-height: 50vh;
      }
    </style>
    <iron-list id="ironlist" items="[[__staxList]]" as="stax" grid="">
      <template>
        <div class="stax-container">
          <hax-stax-browser-item index="[[stax.index]]" title="[[stax.details.title]]" tag="[[stax.details.tag]]" image="[[stax.details.image]]" author="[[stax.details.author]]" teaser="[[stax.details.teaser]]" description="[[stax.details.description]]" examples="[[stax.details.examples]]" status="[[stax.details.status]]" stax="[[stax.stax]]"></hax-stax-browser-item>
        </div>
      </template>
    </iron-list>
`,

  is: "hax-stax-browser",

  properties: {
    /**
     * The list of stax
     */
    staxList: {
      type: Array,
      observer: "_staxListChanged"
    }
  },

  /**
   * Ready life cycle
   */
  ready: function() {
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
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
   * Attached
   */
  attached: function() {
    this.resetBrowser();
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
   * Notice staxList changing.
   */
  _staxListChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.set("__staxList", newValue);
    }
  },

  /**
   * Reset this browser.
   */
  resetBrowser: function() {
    async.microTask.run(() => {
      setTimeout(() => {
        this.$.ironlist.fire("iron-resize");
        window.dispatchEvent(new Event("resize"));
      }, 100);
    });
  }
});
