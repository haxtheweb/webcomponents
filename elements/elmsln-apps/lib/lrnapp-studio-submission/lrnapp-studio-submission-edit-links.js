import "./lrnapp-studio-submission-edit-add-asset.js";
Polymer({
  _template: `
    <style>
       :host {
        display: block;
      }

      .item {
        display: flex;
        margin: auto;
      }

      .info {
        flex: 1 1 auto;
      }

      .create {
        display: flex;
        align-items: center;
      }

      .input {
        flex: 1 1 auto;
      }

      paper-dialog {
        width: 50%;
        width: 50vmax;
        padding: 1em;
      }
    </style>

    <template is="dom-repeat" items="{{links}}" as="link">
      <div class="item">
        <div class="info">
          <div class="linksfield__url">{{link.url}}</div>
        </div>
        <div class="linksfield__actions">
          <paper-icon-button icon="delete" class="linksfield__delete" data-index\$="{{index}}" on-click="_deleteLink"></paper-icon-button>
        </div>
      </div>
    </template>
    <lrnapp-studio-submission-edit-add-asset icon="link" display="pill" on-click="_openDialog"></lrnapp-studio-submission-edit-add-asset>

    <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" with-backdrop="">
      <h2>Add Link</h2>
      <paper-dialog-scrollable>
        <paper-input id="link-input" class="input" label="URL" value="{{newlink}}"></paper-input>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button dialog-dismiss="">Cancel</paper-button>
        <paper-button dialog-confirm="" on-click="_createLink">Add Link</paper-button>
      </div>
    </paper-dialog>
`,

  is: "lrnapp-studio-submission-edit-links",

  properties: {
    links: {
      type: Array,
      value: null,
      notify: true
    },
    newlink: {
      type: String,
      value: ""
    }
  },

  _openDialog: function() {
    document.body.appendChild(this.$.dialog);
    this.$.dialog.open();
  },

  _createLink: function(e) {
    var root = this;
    var links = root.links;
    if (links === null) {
      root.set("links", []);
    }
    root.push("links", { url: root.newlink });
    root.newlink = "";
  },

  _deleteLink: function(e) {
    var root = this;
    var normalizedEvent = dom(e);
    var deleteIndex = normalizedEvent.localTarget.getAttribute("data-index");
    root.splice("links", deleteIndex, 1);
  }
});
