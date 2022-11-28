/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { LitElement, css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
/**
  * `outline-designer`
  * @element outline-designer
  * `tools to modify and visualize JSON Outline Schema for editing`
  * @demo demo/index.html
  */
export class OutlineDesigner extends LitElement {
  static get styles() {
    return [css`
      :host {
        display: block;
      }
      .item {
        border: 1px solid grey;
        margin: 0;
        padding: 8px;
      }
      ul {
        list-style: none;
      }
      .item .label {
        font-size: 14px;
        font-weight: bold;
      }
      .indent-1 {
        padding-left: 0px;
      }
      .indent-2 {
        padding-left: 16px;
      }
      .indent-3,
      .indent-4,
      .indent-5,
      .indent-6 {
        padding-left: 32px;
      }
    `];
  }
  constructor() {
    super();
    this.items = [];
    this.eventData = {};
    this.addEventListener('click', (e) => {
      // clean up if something is active
      if (this.activePreview) {
        this.shadowRoot.querySelectorAll('simple-popover').forEach((item) => item.setAttribute('hidden','hidden'));
        this.activePreview = false;
      }
    })
  }
  // render function
  render() {
    return html`
    <ul>
      ${this.items.map((item) => this.renderItem(item))}
    </ul>`;
  }

  toggleContent(e) {
    this.activePreview = e.target;
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.shadowRoot.querySelectorAll('simple-popover').forEach((item) => item.setAttribute('hidden','hidden'));
    this.shadowRoot.querySelector(`[for="${e.target.id}"]`).removeAttribute('hidden');
  }

  renderItem(item) {
    return html`
    <li class="item indent-${item.indent}">
      <simple-icon-button-lite @click="${this.toggleContent}" id="od-item-${item.id}" icon="editor:insert-drive-file"></simple-icon-button-lite><span class="label">${item.title}</span>
      <simple-popover for="od-item-${item.id}" hidden
            fit-to-visible-bounds
            auto>${unsafeHTML(item.contents)}</simple-popover>
    </li>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      eventData: { type: Object },
      items: { type: Array }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "outline-designer";
  }

  /**
   * Return all data associated with the current tree
   * @note this makes more sense when we allow manipulation via this object and its options
   */
  getData() {
    let eventData = this.eventData;
    eventData.items = this.items;
    return eventData;
  }
}
customElements.define(OutlineDesigner.tag, OutlineDesigner);
