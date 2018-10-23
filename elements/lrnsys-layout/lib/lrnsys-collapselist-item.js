import "@polymer/polymer/polymer.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-collapse/iron-collapse.js";
/**
`lrnsys-collapselist-item`


@demo demo/index.html
*/
Polymer({
  _template: `
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
    /**
     * Whether or not this is default open on render.
     */
    opened: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      notify: true
    }
  },

  /**
   * Toggling collapse on an iron element.
   */
  collapseToggle: function(e) {
    this.$.collapse.toggle();
  }
});
