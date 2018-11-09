import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-fab/paper-fab.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";

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

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style is="custom-style" include="iron-flex iron-flex-alignment materializecss-styles-colors"></style>
    <style>
      :host {
        @apply(--layout-horizontal);
        @apply(--layout-center);
        @apply(--layout-end-justified);
        margin-top: 15px;
        margin-right: 8px;
        /** For IE11: otherwise the label overlays the FAB */
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
        --lrnapp-fab-background: var(--lrnapp-fab-speed-dial-action-background);
        --lrnapp-fab-keyboard-focus-background: var(--lrnapp-fab-speed-dial-action-keyboard-focus-background);
      }

      .label,.fab {
        display: inline-block;
      }
    </style>

    <div class="flex"><span class="label"><slot></slot></span></div>
    <paper-fab class$="fab [[color]]" icon="[[icon]]" mini></paper-fab>
`,
  is: "lrnapp-fab-speed-dial-action",
  properties: {
    /**
     * Icon that is shown next to the content
     */
    icon: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Color class work to apply
     */
    color: {
      type: String,
      value: "blue",
      reflectToAttribute: true
    }
  }
});
