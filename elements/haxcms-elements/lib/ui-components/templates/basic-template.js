/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "lit";
import "@haxtheweb/grid-plate/grid-plate.js";

/**
 * `An incredibly basic template.
 * @HTMLElement
 */
let BasicTemplate = (superclass) =>
  class extends superclass {
    constructor() {
      super();
      import("@haxtheweb/simple-icon/simple-icon.js");
      import("@haxtheweb/simple-icon/lib/simple-icons.js");
      import("@haxtheweb/scroll-button/scroll-button.js");
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/blocks/site-children-block.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/blocks/site-outline-block.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/blocks/site-recent-content-block.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-footer.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-dot-indicator.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query-menu-slice.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js"
      )
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/site/site-print-button.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/site/site-rss-button.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js"
      );
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/magic/active-when-visible.js"
      );
    }
    // render function
    render() {
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
          <site-modal
            slot="suffix"
            icon="icons:search"
            title="Search site"
            button-label="Search"
          >
            <site-search></site-search>
          </site-modal>
        </site-top-menu>
        <div class="container">
          <site-breadcrumb></site-breadcrumb>
          <grid-plate layout="1-3" class="grid-wrapper" ignore-hax>
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
customElements.define("basic-template", Basic);
export { BasicTemplate, Basic };
