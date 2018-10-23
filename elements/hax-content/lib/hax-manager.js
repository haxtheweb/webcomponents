import "@polymer/polymer/polymer.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/paper-tabs/paper-tabs.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/neon-animation/animations/scale-up-animation.js";
import "@polymer/neon-animation/animations/fade-out-animation.js";
import "./hax-manager-content-item.js";
/**
`hax-manager`


@demo demo/index.html 
*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        --hax-manager-ink:lightgray;
      }
      .manager-links {
        --paper-tabs-selection-bar-color: var(--hax-manager-ink);
      }
      .manager-dialog {
        width: 80%;
      }
      .manager-content {
        background: #f3f3f3;
        min-height: 100px;
        min-height: 50vw;
        min-height: 50vmin;
        padding: 1em;
        display: flex;
        flex-wrap: wrap;
      }
      hax-manager-content-item {
        max-height: 45vmin;
        width: 25%;
      }
    </style>
    <paper-dialog opened\$="{{opened}}" class="manager-dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" with-backdrop="">
      <paper-tabs class="manager-links" selected="0" scrollable="" fit-container="">
        <paper-tab>Components</paper-tab>
        <paper-tab>Assets</paper-tab>
        <paper-tab>Upload</paper-tab>
      </paper-tabs>
      <paper-dialog-scrollable>
        <div class="manager-content">
          <template is="dom-repeat" items="[[components]]">
            <hax-manager-content-item type="component" value="[[item]]"></hax-manager-content-item>
          </template>
        </div>
      </paper-dialog-scrollable>
    </paper-dialog>
`,

  is: "hax-manager",

  properties: {
    components: {
      type: Object
    },
    opened: {
      type: Boolean
    }
  },

  listeners: {
    "hax-item-selected": "_itemSelected"
  },

  ready: function() {},

  _itemSelected: function(e) {
    let selectedComponent = e.detail.value;
    let node = document.createElement(selectedComponent);
    node.setAttribute("show-hax", true);
    this.fire("hax-manager-component-selected", {
      value: selectedComponent,
      node: node
    });
  }
});
