import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/lrn-markdown-editor/lrn-markdown-editor.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <lrn-markdown-editor content="{{content}}"></lrn-markdown-editor>
  `,

  is: "lrnapp-studio-submission-edit-textarea",

  properties: {
    content: {
      type: String,
      notify: true
    }
  }
});
