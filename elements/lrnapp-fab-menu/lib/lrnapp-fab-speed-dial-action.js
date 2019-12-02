import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/*
An action within a material design [Floating Action Button with Speed Dial](https://www.google.com/design/spec/components/buttons-floating-action-button.html#buttons-floating-action-button-transitions)

### Styling

Style                                                   | Description
------------------------------------------------------- | ------------
--lrnapp-fab-speed-dial-action-background                | The background color of the Floating Action Button
--lrnapp-fab-speed-dial-action-keyboard-focus-background | The background color of the Floating Action Button when focused

### Example

```html
<lrnapp-fab-speed-dial-action icon="icons:content-copy">Copy</lrnapp-fab-speed-dial-action>
```

* @demo demo/index.html
*/
class LrnappFabSpeedDialAction extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          margin-top: 15px;
          margin-right: 8px;
          min-width: 270px;
        }
        .label {
          color: black;
          background: white;
          padding: 0 16px;
          border-radius: 4px;
          margin-right: 24px;
        }
        .fab {
          --lrnapp-fab-background: var(
            --lrnapp-fab-speed-dial-action-background
          );
          --lrnapp-fab-keyboard-focus-background: var(
            --lrnapp-fab-speed-dial-action-keyboard-focus-background
          );
        }
        .label,
        .fab {
          display: flex;
        }
      `
    ];
  }
  static get tag() {
    return "lrnapp-fab-speed-dial-action";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.color = "blue";
    import("@polymer/paper-fab/paper-fab.js");
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <custom-style>
        <style
          include="iron-flex iron-flex-alignment materializecss-styles-colors"
        >
          :host {
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --layout-end-justified;
          }
        </style>
      </custom-style>
      <div class="flex">
        <span class="label"><slot></slot></span>
      </div>
      <paper-fab class="fab ${this.color}" icon="${this.icon}" mini></paper-fab>
    `;
  }
  static get properties() {
    return {
      /**
       * Icon that is shown next to the content
       */
      icon: {
        type: String
      },
      /**
       * Color class work to apply
       */
      color: {
        type: String
      }
    };
  }
}
window.customElements.define(
  LrnappFabSpeedDialAction.tag,
  LrnappFabSpeedDialAction
);
export { LrnappFabSpeedDialAction };
