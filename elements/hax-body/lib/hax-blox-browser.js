import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";

/**
 * `hax-blox-browser`
 * `List of layout blox to select from`
 * @microcopy - the mental model for this element
 * - blox - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxBloxBrowser extends PolymerElement {
  constructor() {
    super();
    import("@lrnwebcomponents/hax-body/lib/hax-blox-browser-item.js");
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
        hax-blox-browser-item {
          margin: 10px;
          -webkit-transition: 0.3s all linear;
          transition: 0.3s all linear;
        }
      </style>
      <dom-repeat items="[[__bloxList]]" as="blox">
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
      </dom-repeat>
    `;
  }

  static get tag() {
    return "hax-blox-browser";
  }

  static get properties() {
    return {
      /**
       * The list of blox
       */
      bloxList: {
        type: Array,
        observer: "_bloxListChanged"
      },
      __bloxList: {
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
   * Notice bloxList changing.
   */
  _bloxListChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.set("__bloxList", newValue);
    }
  }
}
window.customElements.define(HaxBloxBrowser.tag, HaxBloxBrowser);
export { HaxBloxBrowser };
