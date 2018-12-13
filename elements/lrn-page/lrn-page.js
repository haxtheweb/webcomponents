import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/oer-schema/oer-schema.js";
/**
`lrn-page`
A LRN element for a "page" of material. This ensures there's an OERSchema wrapper
so that all content produced has a baseline level of being identified as OER.

* @demo demo/index.html
*/
let LrnPage = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <oer-schema> <slot></slot> </oer-schema>
  `,

  is: "lrn-page"
});
export { LrnPage };
