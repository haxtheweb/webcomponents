import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import { mtzMarkedControlBehavior } from "./mtz-marked-control-behavior.js";
class MtzMarkedControlLink extends mtzMarkedControlBehavior(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
      </style>

      <paper-icon-button
        icon="[[icon]]"
        noink="[[noink]]"
        on-click="_handleCommand"
        alt="[[title]]"
      ></paper-icon-button>

      <iron-a11y-keys
        keys="[[keys]]"
        on-keys-pressed="_handleCommand"
        target="[[__editor]]"
      ></iron-a11y-keys>
    `;
  }
  static get tag() {
    return "mtz-marked-control-link";
  }

  static get properties() {
    let props = {
      title: String,
      icon: String,
      keys: String,
      noink: Boolean // Pass-through
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }
  /**
   * Toggles a syntax prefix at the start of selected lines
   *
   * @param {MouseEvent|KeyboardEvent} event
   * @protected
   */
  _handleCommand(event) {
    event.preventDefault();
    event.stopPropagation();

    const editor = this.__editor;
    const selection = editor.getSelection();
    const regex = new RegExp("\\[(.*)\\]\\((.*)\\)");

    // Check if syntax is present (regex)
    const matches = selection.text.match(regex);
    let text;
    let link;

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
  }

  /**
   * Determines if the selection is a link, may override for more complex checks
   *
   * @param {Object} selection - the selection from the editor
   * @return {Boolean}
   * @protected
   */
  _isLink(selection) {
    return selection.text.startsWith("https://");
  }
}
window.customElements.define(MtzMarkedControlLink.tag, MtzMarkedControlLink);
export { MtzMarkedControlLink };
