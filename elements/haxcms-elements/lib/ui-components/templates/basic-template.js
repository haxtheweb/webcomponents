/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/blocks/site-children-block.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js";
/**
 * `An incredibly basic template.
 * @HTMLElement
 */
let BasicTemplate = superclass =>
  class extends superclass {
    // render function
    static get template() {
      return html`
        <site-top-menu noink indicator="arrow" arrow-size="8">
          <site-title slot="prefix" class="spacing"></site-title>
        </site-top-menu>
        <div class="container">
          <site-breadcrumb></site-breadcrumb>
          <grid-plate layout="1-3">
            <div slot="col-1" class="left-col">
              <div class="menu-buttons">
                <site-menu-button type="prev" position="top"></site-menu-button>
                <site-menu-button type="next" position="top"></site-menu-button>
              </div>
              <site-active-title
                dynamic-methodology="ancestor"
              ></site-active-title>
              <site-children-block
                dynamic-methodology="ancestor"
              ></site-children-block>
              <div class="buttons">
                <site-rss-button type="atom"></site-rss-button>
                <site-rss-button type="rss"></site-rss-button>
              </div>
            </div>
            <div id="contentcontainer" slot="col-2">
              <div id="slot"><slot></slot></div>
            </div>
          </grid-plate>
        </div>
      `;
    }
  };
class Basic extends BasicTemplate(HTMLElement) {}
window.customElements.define("basic-template", Basic);
export { BasicTemplate, Basic };
