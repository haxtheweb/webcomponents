/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
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
<style>:host {
  display: block;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
}
:host .demo-container {
  padding: 20px 40px;
}
:host .demo-container:not(:last-of-type) {
  border-bottom: 1px solid #f5f5f5;
}
:host ul {
  list-style-type: none;
  padding: 0;
}
:host li {
  display: inline-block;
  width: 10em;
  margin: 1em 0.5em;
  text-align: center;
}
:host #icon > div {
  text-align: center;
}
:host iron-icon {
  font-size: 14px;
  color: rgb(97,97,97);
  display: inline-block;
}
:host #icon-text {
  margin-top: 0.5em;
  font-size: 10px;
  color: black;
}
:host .code-container {
  margin: 0;
  background-color: var(--google-grey-100,#f5f5f5);
  border-top: 1px solid #e0e0e0;
}
:host code {
  padding: 20px 40px;
  display: block;
  margin: 0;
  font-size: 13px;
}
:host .tag {
  color: #905;
}
:host .attr-name {
  color: #690;
}
:host .attr-value {
  color: #07a;
}</style>
<div class="demo-container">
<template is="dom-repeat" items="[[items]]" as="iconset">
<p><strong>[[iconset.name]]</strong></p>
<ul>
    <template is="dom-repeat" items="[[iconset.icons]]" as="icon">
        <li>
        <div id="icon">
            <iron-icon icon\$="[[iconset.prefix]][[icon]]"></iron-icon>
            <div id="icon-text">[[iconset.prefix]][[icon]]</div>
        </div>
        </li>
    </template>
</ul>
</template>
</div>
<div class="code-container">
    <code><span class="tag">&lt;iron-icon</span> <span class="attr-name">icon="<strong><em><span class="attr-value">optional_iconset_name:icon_name</span></em></strong>"</span><span class="tag">&gt;&lt;/iron-icon&gt;</span></code>
</div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      iconsets: {
        name: "iconsets",
        type: "String",
        value: null,
        reflectToAttribute: false,
        observer: false
      },
      items: {
        name: "items",
        type: "Array",
        computed: "_getIcons(iconsets)",
        reflectToAttribute: false,
        observer: false
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
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
  _getIcons(iconsets) {
    let set = iconsets !== null ? JSON.parse(iconsets) : [],
      items = [];
    for (let i = 0; i < set.length; i++) {
      items.push({
        name:
          set[i].name !== undefined && set[i].name !== null
            ? set[i].name + " "
            : "Icons",
        prefix:
          set[i].name !== undefined && set[i].name !== null
            ? set[i].name + ":"
            : "",
        icons:
          set[i].icons !== undefined && set[i].icons !== null
            ? set[i].icons
            : []
      });
    }
    return items;
  }
}
window.customElements.define(IconsetDemo.tag, IconsetDemo);
