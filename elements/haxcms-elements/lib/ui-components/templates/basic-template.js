/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@polymer/iron-icons/maps-icons.js";
import "@lrnwebcomponents/scroll-button/scroll-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-render-item.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/blocks/site-children-block.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/blocks/site-outline-block.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/blocks/site-recent-content-block.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-footer.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-dot-indicator.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query-menu-slice.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-render-query.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/magic/active-when-visible.js";

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
          <site-modal
            slot="suffix"
            icon="maps:directions"
            title="View site map"
            button-label="Site map"
          >
            <site-menu></site-menu>
          </site-modal>
        </site-top-menu>
        <div class="container">
          <site-breadcrumb></site-breadcrumb>
          <grid-plate layout="1-3" class="grid-wrapper">
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
                <site-print-button
                  slot="suffix"
                  type="ancestor"
                ></site-print-button>
              </div>
            </div>
            <div id="contentcontainer" slot="col-2">
              <div id="slot"><slot></slot></div>
            </div>
          </grid-plate>
        </div>
        <site-footer></site-footer>
        <scroll-button position="right" label="Back to top"></scroll-button>
      `;
    }
  };
class Basic extends BasicTemplate(HTMLElement) {}
window.customElements.define("basic-template", Basic);
export { BasicTemplate, Basic };
