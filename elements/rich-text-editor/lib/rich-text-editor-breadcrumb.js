/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./rich-text-editor-button-styles.js";
/**
 * `rich-text-editor-breadcrumb`
 * `a button for rich text editor breadcrumbs`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorBreadcrumb extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="rich-text-editor-button-styles">
        :host #button {
          @apply --rich-text-editor-breadcrumb;
        }
      </style>
      <iron-a11y-keys
        id="a11y"
        target="[[__a11y]]"
        keys="enter"
        on-keys-pressed="_buttonTap"
      >
      </iron-a11y-keys>
      <paper-button
        id="button"
        class="rtebutton rtebreadcrumb"
        controls$="[[controls]]"
        on-tap="_buttonTap"
        tabindex="0"
      >
        [[tag]]
      </paper-button>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The text-editor that this breadcrumb controls.
       */
      controls: {
        name: "controls",
        type: String,
        value: null
      },
      /**
       * The tag for this breadcrumb.
       */
      tag: {
        name: "tag",
        type: String,
        value: ""
      },
      /**
       * The target node that this breadcrumb selects.
       */
      target: {
        name: "target",
        type: Object,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-breadcrumb";
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
    root.addEventListener("mousedown", function(e) {
      e.preventDefault();
    });
    root.addEventListener("keypress", function(e) {
      e.preventDefault();
    });
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__a11y = this.$.button;
  }
  /**
   * Handles button tap;
   */
  _buttonTap(e) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent("breadcrumb-tap", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
}
window.customElements.define(
  RichTextEditorBreadcrumb.tag,
  RichTextEditorBreadcrumb
);
export { RichTextEditorBreadcrumb };
