import "@polymer/polymer/polymer.js";
import "@polymer/paper-button/paper-button.js";
import "lrndesign-dialog/lrndesign-dialog.js";
/**
`lrndesign-dialog`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-button raised="" onclick="dialog.toggle()">{{buttonLabel}}</paper-button>
    <lrndesign-dialog id="dialog">
      <h2>{{title}}</h2>
      <div>
        <content></content>
      </div>
    </lrndesign-dialog>
`,

  is: "lrndesign-buttondialog",

  properties: {
    buttonLabel: {
      type: String,
      value: "Label"
    },
    title: {
      type: String,
      value: "Heading"
    }
  }
});
