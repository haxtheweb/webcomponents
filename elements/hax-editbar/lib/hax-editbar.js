import "@polymer/polymer/polymer.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-toolbar/paper-toolbar.js";
import "@polymer/iron-icons/iron-icons.js";
import "lrn-icons/lrn-icons.js";
/**
`hax-editable`

@demo demo/index.html
*/
Polymer({
  _template: `
    <style>
      :host {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        min-width: 100%;
        opacity: 0;
        transition: opacity .3s ease-in-out;
        z-index: 12;
        color: #FFFFFF;
        --paper-font-common-base: #FFFFFF;
      }
      :host:hover, :host:focus {
        opacity: 1;
      }
      :host[edit] {
        opacity: 1
      }
      paper-toolbar {
        --paper-toolbar-background: rgba(0,0,0, 0.8);
        text-align: right;
        justify-content: flex-end;
      }
    </style>
    <template is="dom-if" if="{{showHax}}">
      <template is="dom-if" if="{{showEdit}}">
        <paper-toolbar>
          <paper-icon-button icon="lrn-icons:edit" on-tap="_editClicked"></paper-icon-button>
        </paper-toolbar>
      </template>

      <template is="dom-if" if="{{showSave}}">
        <paper-toolbar>
          <paper-icon-button icon="lrn-icons:save" on-tap="_saveClicked"></paper-icon-button>
          <paper-icon-button icon="lrn-icons:cancel" on-tap="_cancelClicked"></paper-icon-button>
          <content></content>
        </paper-toolbar>
      </template>
    </template>
`,

  is: "hax-editbar",

  properties: {
    edit: {
      type: Boolean,
      observer: "_editChanged"
    },
    origContent: {
      type: String
    },
    showHax: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      notify: true
    },
    showEdit: {
      type: Boolean
    },
    showSave: {
      type: Boolean
    }
  },

  _editChanged: function(edit) {
    let state = edit;
    this.showEdit = state ? false : true;
    this.showSave = state ? true : false;
  },

  _editClicked: function(e) {
    let root = this.parentNode;
    var attributeArray = Polymer.dom(root).node.attributes;
    attributeArray.tagName = root.tagName;
    attributeArray.innerHTML = Polymer.dom(root).innerHTML;
    this.fire("haxAction", { action: "edit", attributes: attributeArray });
  },

  _saveClicked: function() {
    let root = this.parentNode;
    var attributeArray = Polymer.dom(root).node.attributes;
    attributeArray.tagName = root.tagName;
    attributeArray.innerHTML = Polymer.dom(root).innerHTML;
    this.fire("haxAction", { action: "save", attributes: attributeArray });
  },

  _cancelClicked: function() {
    let root = this.parentNode;
    var attributeArray = root.attributes;
    attributeArray.tagName = root.tagName;
    attributeArray.innerHTML = Polymer.dom(root).innerHTML;
    this.fire("haxAction", { action: "cancel", attributes: attributeArray });
  }
});
