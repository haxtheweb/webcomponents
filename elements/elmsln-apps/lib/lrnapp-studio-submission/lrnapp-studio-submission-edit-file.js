import './lrnapp-studio-submission-media-editoverlay.js';
Polymer({
  _template: `
    <style>
       :host {
        display: inline-flex;
        justify-content: space-around;
        align-items: stretch;
        min-height: 100px;
        width: 100px;
        position: relative;
        background: lightgray;
        color: #333333;
      }

      lrnapp-studio-submission-media-editoverlay {
        display: flex;
      }

      .file_url {
        margin: 1em;
      }
    </style>

    <lrnapp-studio-submission-media-editoverlay on-delete="_delete" data-index\$="[[index]]" embedcode="{{embedcode}}">
      <div class="file_url">[[file.filename]]</div>
    </lrnapp-studio-submission-media-editoverlay>
`,

  is: 'lrnapp-studio-submission-edit-file',

  properties: {
    file: {
      type: Object
    },
    embedcode: {
      type: String,
      computed: '_computeEmbedCode(file)'
    }
  },

  observers: [
  ],

  _computeEmbedCode: function (file) {
    return '[Alternative Text Here](' + file.url + ')';
  },

  _delete: function (e) {
    this.fire('deleted');
  }
});
