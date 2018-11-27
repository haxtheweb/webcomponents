import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./mtz-marked-control-line-behavior.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
      }
    </style>

    <paper-icon-button icon="[[icon]]" noink="[[noink]]" on-click="_handleCommand" alt="[[title]]"></paper-icon-button>

    <iron-a11y-keys keys="[[keys]]" on-keys-pressed="_handleCommand" target="[[__editor]]"></iron-a11y-keys>
`,
  is: "mtz-marked-control-link",
  behaviors: [mtz.MarkedControlBehavior],
  properties: { title: String, icon: String, keys: String, noink: Boolean },
  _handleCommand(event) {
    event.preventDefault();
    event.stopPropagation();
    const editor = this.__editor,
      selection = editor.getSelection(),
      regex = /\[(.*)\]\((.*)\)/,
      matches = selection.text.match(regex);
    let text, link;
    if (matches) {
      text = matches[1];
      link = matches[2];
      const match = link || text;
      editor.replaceSelection(match);
      editor.setSelection(
        selection.start,
        selection.end - (selection.length - match.length)
      );
    } else {
      if (this._isLink(selection)) {
        text = prompt("What text would you like to display?");
        if (!text) return;
        link = selection.text;
      } else {
        link = prompt("What link would you like to use?");
        if (!link) return;
        text = selection.text;
      }
      if (link.startsWith("http://")) {
        alert("Links must be https://");
        return;
      }
      const newLink = regex[Symbol.replace]("[]()", `[${text}](${link})`);
      editor.replaceSelection(newLink);
      editor.setSelection(
        selection.start,
        selection.end + (newLink.length - selection.length)
      );
    }
  },
  _isLink(selection) {
    return selection.text.startsWith("https://");
  }
});
