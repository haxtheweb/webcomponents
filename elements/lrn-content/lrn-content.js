import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`lrn-content`
  A LRN element for presenting content with a simple heading.
  This is to improve accessibility, consistency, and tag things
  with OER schema.

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div typeof="oer:SupportingMaterial">
      <h2 property="oer:name">[[title]]</h2>
      <div property="oer:description">
        <slot></slot>
      </div>
    </div>
`,

  is: "lrn-content",

  properties: {
    title: {
      type: String,
      value: ""
    }
  }
});
