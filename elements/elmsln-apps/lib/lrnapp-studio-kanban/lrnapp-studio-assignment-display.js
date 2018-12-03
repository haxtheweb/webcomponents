import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/marked-element/marked-element.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        padding: 16px;
      }
      #assignment-body {
        font-size: 21px;
      }
    </style>
    <h1>[[assignment.attributes.title]]</h1>
    <marked-element
      id="assignment-body"
      markdown="[[assignment.attributes.body]]"
    ></marked-element>
  `,
  is: "lrnapp-studio-assignment-display",
  properties: {
    assignment: {
      type: Object
    }
  }
});
