import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js";
import "@haxtheweb/simple-blog/lib/simple-blog-overview.js";
/**
 * `simple-blog-listing`
 * @element simple-blog-listing
 * `A simple blog and associated elements`
 */
class SimpleBlogListing extends SimpleColors {
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        .listing {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
        @media only screen and (max-width: 800px) {
          .listing {
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
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-blog-listing";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__items = [];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <site-query
        @result-changed="${this.__itemsChanged}"
        sort='{"metadata.created": "DESC"}'
      ></site-query>
      <div class="listing">
        ${this.__items.map(
          (item) => html`
            <simple-blog-overview
              item-id="${item.id}"
              title="${item.title}"
              description="${item.description}"
              link="${item.slug}"
              changed="${item.metadata.created}"
            ></simple-blog-overview>
          `,
        )}
      </div>
    `;
  }
  /**
   * Respond to change in query
   */
  __itemsChanged(e) {
    this.__items = [...e.detail.value];
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      __items: {
        type: Array,
      },
    };
  }
}
customElements.define(SimpleBlogListing.tag, SimpleBlogListing);
export { SimpleBlogListing };
