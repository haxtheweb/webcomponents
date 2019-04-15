/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { IronMeta } from "@polymer/iron-meta/iron-meta.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/marked-element/marked-element.js";

export { IconsetDemo };
/**
 * `iconset-demo`
 * `iterates through an iconset array to generate a demo of all of the icons`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class IconsetDemo extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
          margin-bottom: 40px;
          padding: 20px 40px;
        }
        :host .iconset:not(:first-of-type) {
          border-top: 1px solid #ddd;
        }
        :host ul {
          list-style-type: none;
          padding: 0;
        }
        :host li {
          display: inline-block;
          width: 160px;
          margin: 16px 8px;
          text-align: center;
          font-size: 10px;
        }
        :host iron-icon {
          font-size: 14px;
          color: rgb(97, 97, 97);
          display: inline-block;
        }
        :host .iconset:nth-of-type(9n + 2) iron-icon {
          color: #be3300;
        }
        :host .iconset:nth-of-type(9n + 3) iron-icon {
          color: #0000b5;
        }
        :host .iconset:nth-of-type(9n + 4) iron-icon {
          color: #750075;
        }
        :host .iconset:nth-of-type(9n + 5) iron-icon {
          color: #aa5d00;
        }
        :host .iconset:nth-of-type(9n + 6) iron-icon {
          color: #db0a5b;
        }
        :host .iconset:nth-of-type(9n + 7) iron-icon {
          color: #005500;
        }
        :host .iconset:nth-of-type(9n + 8) iron-icon {
          color: #cf000f;
        }
        :host .iconset:nth-of-type(9n) iron-icon {
          color: #005f8b;
        }
      </style>
      <template is="dom-repeat" items="[[__iconList]]" as="iconset">
        <div class="iconset">
          <p><strong>[[iconset.name]]</strong></p>
          <ul>
            <template is="dom-repeat" items="[[iconset.icons]]" as="icon">
              <li>
                <div id="icon">
                  <iron-icon icon\$="[[icon]]"></iron-icon>
                  <div id="icon-text">[[icon]]</div>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </template>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * all the iconsets
       */
      __iconList: {
        name: "__iconList",
        type: "Array",
        value: []
      },
      /**
       * a space-separated whitelist of iconsets by name
       */
      includeSets: {
        name: "includeSets",
        type: "String",
        value: null
      },
      /**
       * a space-separated blacklist of iconsets by name
       */
      excludeSets: {
        name: "excludeSets",
        type: "String",
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "iconset-demo";
  }
  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    const iconSets = new IronMeta({ type: "iconset" });
    let temp = [];

    // need to access iconset imperatively now
    if (
      typeof iconSets !== typeof undefined &&
      iconSets.list &&
      iconSets.list.length
    ) {
      var index = 0;
      iconSets.list.forEach(function(item) {
        let name = item.name;
        if (!root._hideIconset(name)) {
          temp.push({
            name: name,
            icons: []
          });
          item.getIconNames().forEach(icon => {
            temp[index].icons.push(icon);
          });
          index++;
        }
      });
    }
    this.__iconList = temp;
  }
  /**
   *  determines if a given iconset should be hidden
   *
   * @param {string} name the name of the iconset
   * @returns {boolean} whether or n ot to hide the iconset
   */
  _hideIconset(name) {
    let isets = this.includeSets !== null ? this.includeSets.split(/ /) : [],
      included = isets.length === 0 || isets.includes(name),
      esets = this.excludeSets !== null ? this.excludeSets.split(/ /) : [],
      excluded = esets.length.length > 0 && esets.includes(name);
    return !included || excluded;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(IconsetDemo.tag, IconsetDemo);
