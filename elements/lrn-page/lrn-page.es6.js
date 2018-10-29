import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/oer-schema/oer-schema.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <oer-schema>
      <slot></slot>
    </oer-schema>
`,is:"lrn-page"});