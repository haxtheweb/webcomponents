import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
/**
 * `hax-stax-browser`
 * `Select a stack / template to insert`
 * @microcopy - the mental model for this element
 * - stax - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxStaxBrowser extends PolymerElement {
  constructor() {
    super();
    import("@lrnwebcomponents/hax-body/lib/hax-stax-browser-item.js");
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        hax-stax-browser-item {
          margin: 10px;
          -webkit-transition: 0.3s all linear;
          transition: 0.3s all linear;
        }
      </style>
      <dom-repeat items="[[__staxList]]" as="stax">
        <template>
          <div class="stax-container">
            <hax-stax-browser-item
              index="[[stax.index]]"
              title="[[stax.details.title]]"
              tag="[[stax.details.tag]]"
              image="[[stax.details.image]]"
              author="[[stax.details.author]]"
              teaser="[[stax.details.teaser]]"
              description="[[stax.details.description]]"
              examples="[[stax.details.examples]]"
              status="[[stax.details.status]]"
              stax="[[stax.stax]]"
            ></hax-stax-browser-item>
          </div>
        </template>
      </dom-repeat>
    `;
  }
  static get tag() {
    return "hax-stax-browser";
  }
  static get properties() {
    return {
      /**
       * The list of stax
       */
      staxList: {
        type: Array,
        observer: "_staxListChanged"
      },
      __staxList: {
        type: Array
      }
    };
  }

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
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
  }

  /**
   * Notice staxList changing.
   */
  _staxListChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.set("__staxList", newValue);
    }
  }
}
window.customElements.define(HaxStaxBrowser.tag, HaxStaxBrowser);
export { HaxStaxBrowser };
