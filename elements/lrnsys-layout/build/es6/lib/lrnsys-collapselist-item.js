import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-collapse/iron-collapse.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        color: var(--lrnsys-collapselist-text-color, #000);
      }
      paper-button {
        height: 3em;
        padding: 0;
        margin: 0;
        min-width: .1em;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        text-transform: unset;
        border-radius: 0;
        background-color: var(--lrnsys-collapselist-item-color, #fff);
      }
      paper-button span {
        pointer-events: none;
      }
      .collapse-label {
        padding: .75em .5em .25em .5em;
        width: 100%;
        height: 2em;
      }
      :host[opened] #collapse {
        border-top: 1px solid var(--lrnsys-collapselist-item-border, #bbb);
        background-color: var(--lrnsys-collapselist-item-active-color, #eee);
      }
      :host[opened] .collapse-label {
        font-weight: bold;
        background-color: var(--lrnsys-collapselist-item-active-color, #eee);
      }
      .collapse-content {
        padding: 1em;
      }
    </style>
    <paper-button on-tap="collapseToggle" id="collapse-trigger" aria-controls="collapse">
      <span class="collapse-label">
        <slot name="label"></slot>
      </span>
    </paper-button>
    <iron-collapse id="collapse" opened="{{opened}}">
      <div class="collapse-content">
        <slot name="content"></slot>
      </div>
    </iron-collapse>
`,
  is: "lrnsys-collapselist-item",
  properties: {
    opened: { type: Boolean, value: !1, reflectToAttribute: !0, notify: !0 }
  },
  collapseToggle: function() {
    this.$.collapse.toggle();
  }
});
