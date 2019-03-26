/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
/**
 * `rich-text-editor-prompt`
 * `a picker for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorPrompt extends RichTextEditorButton {
  // render function
  static get template() {
    return html`
      <style include="rich-text-editor-styles"></style>
      <iron-a11y-keys
        id="a11y"
        target="[[__a11y]]"
        keys="enter"
        on-keys-pressed="_buttonTap">
      </iron-a11y-keys>
      <a11y-collapse id="collapse" accordion disabled$="[[disabled]]" icon="arrow-drop-down" label="toggle info" tooltip="toggle more information">
        <div id="heading" slot="heading">
          <iron-icon id="icon" 
            aria-hidden
            icon$="[[_regOrToggled(icon,toggledIcon,toggled)]]">
          </iron-icon>
          <span id="label" class$="[[labelStyle]]"></span>
        </div>
        <div slot="content">
          <input type="text" placeholder="http://www.google.com" value="">
          <paper-button id="button"
            disabled$="[[disabled]]" 
            controls="[[controls]]"
            label="Cancel"
            tabindex="0">
            <iron-icon id="icon" 
              aria-hidden
              icon="clear">
            </iron-icon>
          </paper-button>
          <paper-button id="button"
            disabled$="[[disabled]]" 
            controls="[[controls]]"
            label="Ok"
            tabindex="0">
            <iron-icon id="icon" 
              aria-hidden
              icon="done">
            </iron-icon>
          </paper-button>
        </div>
      </a11y-collapse>
      <paper-tooltip id="tooltip" for="heading"></paper-button>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-prompt";
  }
}
window.customElements.define(RichTextEditorPrompt.tag, RichTextEditorPrompt);
export { RichTextEditorPrompt };
