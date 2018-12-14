/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`lrnsys-render-html`
A legacy element which just directly renders HTML.
WARNING: DO NOT USE THIS UNLESS YOU KNOW WHAT YOU ARE DOING!

This element is meant to render html from a source that has already been sanitized.
Polymer will, by design, not render html for security reasons. This element gets around
that. Do not render raw user input through this element! This would allow XSS attacks for
your users.

* @demo demo/index.html
*/
let LrnsysRenderHtml = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div id="container"></div>
  `,

  is: "lrnsys-render-html",

  properties: {
    /**
     * String to render as HTML directly
     * @type {Object}
     */
    html: {
      type: String
    }
  },

  /**
   * When HTML changes, inject it directly.
   */
  observers: ["_render(html)"],

  /**
   * Render the HTML by just injecting it directly.
   */
  _render: function(html) {
    this.$.container.innerHTML = html;
  }
});
export { LrnsysRenderHtml };
