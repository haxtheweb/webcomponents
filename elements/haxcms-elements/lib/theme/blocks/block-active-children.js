/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/haxcms-elements/lib/theme/query/site-query.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-button/paper-button.js";

/**
 * `block-active-children`
 * `Child pages of whatever is active`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class BlockActiveChildren extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "block-active-children";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        :host .wrapper ::slotted(div.spacing) {
          display: inline-flex;
          @apply --block-active-children-spacing;
        }
        .spacing {
          display: inline-flex;
          @apply --block-active-children-spacing;
        }
        .link {
          color: var(--block-active-children-link-color, #444444);
          @apply --block-active-children-link;
        }
        paper-button {
          text-transform: unset;
          min-width: unset;
          @apply --block-active-children-button;
        }
        .active {
          color: var(--block-active-children-link-active-color, #000000);
          @apply --block-active-children-link-active;
        }
      </style>
      <div class="wrapper">
        <site-query
          result="{{__items}}"
          sort='{"order": "ASC"}'
          conditions='{"parent": "$activeId"}'
        ></site-query>
        <iron-list items="[[__items]]" mutable-data grid>
          <template>
            <div class="spacing">
              <a
                data-id$="[[item.id]]"
                class="link"
                tabindex="-1"
                href$="[[item.location]]"
                ><paper-button noink="[[noink]]"
                  >[[item.title]]</paper-button
                ></a
              >
            </div>
          </template>
        </iron-list>
      </div>
    `;
  }
  static get properties() {
    return {
      noink: {
        type: Boolean,
        value: false
      },
      __items: {
        type: Object,
        notify: true
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    this.__disposer();
    super.disconnectedCallback();
  }
}
window.customElements.define(BlockActiveChildren.tag, BlockActiveChildren);
export { BlockActiveChildren };
