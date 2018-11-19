/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "../simple-colors.js"; //import the shared styles
import "./simple-colors-demo-child.js";

export { SimpleColorsDemo };
/**
 * `simple-colors-demo`
 * `testing css variables`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleColorsDemo extends SimpleColors {
  // render function
  static get template() {
    return html`
<style is="custom-style" include="simple-colors-shared-styles">
:host {
  background-color: var(--simple-colors-default-theme-accent-1); 
  color: var(--simple-colors-default-theme-grey-12); 
  border: 1px solid var(--simple-colors-default-theme-accent-6);
  margin: 15px 0;
  padding: 15px;
  display: block;
}
a, a[link] {
  color: var(--simple-colors-default-theme-blue-8); 
}
a[visited] {
  color: var(--simple-colors-default-theme-purple-8); 
}
select {
  font-family: monospace;
}
</style>

<p>
  <tt>
    &lt;<a href="simple-colors-demo.js" target="_blank">simple-colors-demo</a> 
    <select id="paccent" on-change="_setSelected">
      <option>--- (accent not specified) ---</option>
      <template is="dom-repeat" items="[[_toArray(colors)]]" as="color">
        <option value="[[color.name]]">accent-color="[[color.name]]"</option>
      </template>
    </select> 
    <select id="pdark" on-change="_setSelected">
      <option value="false">--- (dark not specified) ---</option>
      <option value="dark">dark="dark"</option>
    </select>&gt; 
  </tt>
</p>
<template is="dom-if" if="[[nested]]">
  <simple-colors-demo-child accent-color$="[[__accentColorChild]]" dark$="[[__darkChild]]">
    <tt>&lt;<a href="simple-colors-demo-child.js" target="_blank">simple-colors-demo-child</a> 
      <select id="caccent" on-change="_setSelected">
      <option value="false">--- (accent not specified) ---</option>
      <option value$="[[accentColor]]">accent-color[[__open]]accentColor[[__close]]</option>
      <template is="dom-repeat" items="[[_toArray(colors)]]" as="color">
        <option value="[[color.name]]">accent-color="[[color.name]]"</option>
      </template>
    </select> 
    <select id="cdark" on-change="_setSelected">
      <option value="false">--- (dark not specified) ---</option>
      <option value="parent">dark[[__open]]dark[[__close]]</option>
      <option value="dark">dark="dark"</option>
    </select>/&gt;</tt>
  </simple-colors-demo-child>
</template>

<p><tt>&lt;/simple-colors-demo&gt;</tt></p>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      nested: {
        name: "nested",
        type: "Boolean",
        value: false,
        reflectToAttribute: false,
        observer: false
      },
      __accentColorChild: {
        name: "__accentColorChild",
        type: "String",
        value: null,
        reflectToAttribute: false,
        observer: false
      },
      __darkSelectorChild: {
        name: "__darkSelectorChild",
        type: "Boolean",
        value: false,
        reflectToAttribute: false,
        observer: false
      },
      __darkChild: {
        name: "__darkChild",
        type: "Boolean",
        value: false,
        reflectToAttribute: false,
        observer: false
      },
      __open: {
        name: "open",
        type: "String",
        value: '$="[[',
        reflectToAttribute: false,
        observer: false
      },
      __close: {
        name: "open",
        type: "String",
        value: ']]"',
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  // properties available to the custom element for data binding
  static get behaviors() {
    return [SimpleColors];
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-demo";
  }

  _accentSelected(option) {
    return this.accentColor === option ? "selected" : "";
  }

  _setSelected(e) {
    if (e.path[0].id === "paccent") {
      this.accentColor = e.path[0].value;
    } else if (e.path[0].id === "caccent") {
      this.__accentColorChild = e.path[0].value;
    } else if (e.path[0].id === "pdark") {
      this.dark = e.path[0].value !== "false";
    } else {
      this.__darkSelectorChild = e.path[0].value !== "false";
    }
    this.__darkChild =
      this.__darkSelectorChild === "parent"
        ? this.dark
        : this.__darkSelectorChild !== false;
  }

  _toArray(obj) {
    return Object.keys(obj).map(function(key) {
      return {
        name: key,
        value: obj[key]
      };
    });
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
}
window.customElements.define(SimpleColorsDemo.tag, SimpleColorsDemo);
