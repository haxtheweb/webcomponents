import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";
import "@polymer/iron-list/iron-list.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status";
/**
 * `simple-blog-listing`
 * `A simple blog and associated elements`
 */
class SimpleBlogListing extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-blog-listing";
  }
  constructor() {
    super();
    import("@lrnwebcomponents/simple-blog/lib/simple-blog-overview.js");
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.shadowRoot.querySelector("iron-list").dispatchEvent(
        new CustomEvent("iron-resize", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true
        })
      );
    });
  }
  // render function
  static get template() {
    return html`
      <style include="simple-colors-shared-styles-polymer">
        :host {
          display: block;
        }
        iron-list {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
        @media only screen and (max-width: 800px) {
          iron-list {
            padding: 0 32px;
          }
        }
        simple-blog-overview:not(:defined) {
          display: none;
        }
        simple-blog-overview {
          width: 100%;
          border: 1px solid #f2f2f0;
        }
      </style>
      <site-query
        result="{{__items}}"
        sort='{"metadata.created": "DESC"}'
      ></site-query>
      <iron-list items="[[__items]]">
        <template>
          <simple-blog-overview
            item-id="[[item.id]]"
            title="[[item.title]]"
            description="[[item.description]]"
            link="[[item.location]]"
            changed="[[item.metadata.created]]"
          ></simple-blog-overview>
        </template>
      </iron-list>
    `;
  }
}
window.customElements.define(SimpleBlogListing.tag, SimpleBlogListing);
export { SimpleBlogListing };
