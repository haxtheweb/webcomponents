import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import '@polymer/iron-icon/iron-icon.js';
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        font-size: 12px;
      }
      .studio-block__header {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border: 1px solid lightgray;
        border-bottom: none;
      }
      .studio-block__content {
        padding: 0 16px;
        border: 1px solid lightgray;
      }
      .studio-block__icon-wrapper {
        width: 32px;
      }
      .studio-block__header h3 {
        margin: 0;
        font-style: none;
        font-size: inherit;
      }
    </style>
    <div class="studio-block__header">
      <div class="studio-block__icon-wrapper">
        <iron-icon icon="[[icon]]" hidden\$="[[!icon]]"></iron-icon>
      </div>
      <h3 hidden\$="[[!title]]">[[title]]</h3>
    </div>
    <div class="studio-block__content">
      <slot></slot>
    </div>
`,

  is: 'lrnapp-studio-block',

  properties: {
    title: {
      type: String,
      value: null
    },
    icons: {
      type: String,
      value: null
    }
  }
});
