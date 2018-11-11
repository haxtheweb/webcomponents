import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/app-layout/app-layout.js";
import "../node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-collapse/iron-collapse.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
        background-color: var(--simple-colors-background1);
        --lrnsys-collapselist-text-color: var(--simple-colors-foreground1);
        --lrnsys-collapselist-item-color: var(--simple-colors-background1);
        --lrnsys-collapselist-item-active-color: var(--simple-colors-background2);
        --lrnsys-collapselist-item-border: var(--simple-colors-background5);
      }
      ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
      ul li {
        width: 100%;
        border: 1px solid var(--lrnsys-collapselist-item-border);
        margin-bottom: -1px;
      }
      ul li paper-button {
        height: 32px;
        padding: 8px;
        margin: 0;
        min-width: .16px;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        text-transform: unset;
        border-radius: 0;
      }
      ul li paper-button iron-icon,
      ul li paper-button span {
        pointer-events: none;
      }
      iron-icon {
        display: inline-block;
      }
      .collapse-label {
        margin-left: 8px;
      }
      .collapse-content {
        padding: 16px;
      }
    </style>
    <ul>
    <template is="dom-repeat" items="{{items}}" as="row">
      <li>
        <lrnsys-collapselist-item>
          <span slot="label">
            <iron-icon icon="[[row.icon]]"></iron-icon>
            <span class="collapse-label">[[row.label]]</span>
          </span>
          <span slot="content">
            [[row.content]]
          </span>
        </lrnsys-collapselist-item>
      </li>
    </template>
    </ul>
`,
  is: "lrnsys-collapselist",
  behaviors: [simpleColorsBehaviors],
  properties: { items: { type: Array } }
});
