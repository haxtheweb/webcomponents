import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
import "../node_modules/@polymer/iron-list/iron-list.js";
import "./hax-stax-browser-item.js";
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
  properties: { staxList: { type: Array, observer: "_staxListChanged" } },
  ready: function() {
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },
  attached: function() {
    this.resetBrowser();
  },
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof void 0 &&
      e.detail.property
    ) {
      if (
        typeof this[e.detail.property] !== typeof void 0 &&
        null != this[e.detail.property] &&
        typeof this[e.detail.property].length !== typeof void 0
      ) {
        this.set(e.detail.property, []);
      }
      this.set(e.detail.property, e.detail.value);
    }
  },
  _staxListChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0) {
      this.set("__staxList", newValue);
    }
  },
  resetBrowser: function() {
    async.microTask.run(() => {
      setTimeout(() => {
        this.$.ironlist.fire("iron-resize");
        window.dispatchEvent(new Event("resize"));
      }, 100);
    });
  }
});
