/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icon/iron-icon.js";

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
  font-size: 14px;
  color: rgb(97,97,97);
}
:host ul {
  list-style-type: none;
}
:host li {
  display: inline-block;
  width: 10em;
  margin: 1em 0.5em;
  text-align: center;
}
:host li > #icon > div {
  text-align: center;
}
:host li #icon-text {
  margin-top: 0.5em;
  font-size: 10px;
  color: black;
}</style>
<template is="dom-repeat" items="[[items]]" as="iconset">
<h1>[[iconset.name]]</h1>
<ul>
    <template is="dom-repeat" items="[[iconset.icons]]" as="icon">
        <li>
        <div id="icon">
            <div id="icon-svg"><iron-icon icon\$="[[iconset.prefix]][[icon]]"></iron-icon></div>
            <div id="icon-text">[[iconset.prefix]][[icon]]</div>
        </div>
        </li>
    </template>
</ul>
</template>`;
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
