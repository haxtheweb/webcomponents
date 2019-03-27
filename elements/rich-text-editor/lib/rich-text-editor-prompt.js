/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "@polymer/paper-input/paper-input.js";
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
        on-keys-pressed="_buttonTap"
      >
      </iron-a11y-keys>
      <a11y-collapse
        id="collapse"
        accordion
        disabled$="[[disabled]]"
        icon="arrow-drop-down"
        label="toggle info"
        tooltip$="[[__label]]"
      >
        <div id="heading" slot="heading">
          <iron-icon
            id="icon"
            aria-hidden
            icon$="[[_regOrToggled(icon,toggledIcon,toggled)]]"
          >
          </iron-icon>
          <span id="label" class$="[[labelStyle]]"></span>
        </div>
        <div id="prompt" slot="content">
          <paper-input
            label$="[[prompt]]"
            placeholder="http://www.google.com"
            type="text"
            value=""
          >
          </paper-input>
          <paper-button
            id="cancel"
            class="confirm-or-cancel"
            disabled$="[[disabled]]"
            controls="[[controls]]"
            label="Cancel"
            tabindex="0"
          >
            <iron-icon aria-hidden icon="clear"> </iron-icon>
          </paper-button>
          <paper-button
            id="button"
            class="confirm-or-cancel"
            disabled$="[[disabled]]"
            controls="[[controls]]"
            label="Ok"
            tabindex="0"
          >
            <iron-icon id="icon" aria-hidden icon="done"> </iron-icon>
          </paper-button>
        </div>
      </a11y-collapse>
      <paper-tooltip id="tooltipCancel" for="cancel">Cancel</paper-tooltip>
      <paper-tooltip id="tooltipOk" for="button">Ok</paper-tooltip>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      prompt: {
        name: "prompt",
        type: "String",
        value: "Value"
      }
    };
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
