import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
Polymer({
  _template: html`
    <style>
       :host {
        display: block;
      }

      paper-card {
        padding: 2em 2em 0 2em;
        clear: right;
      }

      paper-button {
        background-color: var(--paper-grey-100);
        margin: 1em;
      }

      .card-content {
        padding-left: 2em;
        padding-right: 2em;
        width: 100%;
      }

      .card-actions {
        width: 100%;
      }

      .card-actions paper-button {
        display: flex;
      }

      lrndesign-avatar {
        float: left;
        margin-right: 1em;
      }

      .flex-wrap {
        @apply --layout-horizontal;
        @apply --layout-wrap;
      }

      .inactive {
        max-height: 4.6em;
        overflow: hidden;
      }

      paper-button {
        background: white;
        width: 100%;
        display: flex;
      }

      lrn-icon {
        color: black;
        width: 100%;
      }

      .hidden {
        display: none;
      }
    </style>
    <paper-card elevation="3" class="flex-wrap">
      <div class="card-content">
        <lrndesign-avatar label="{{commentUser.name}}" src="{{commentUser.avatar}}"></lrndesign-avatar>
        <h3>{{commentUser.display_name}}</h3>
        <div class="button-wrapper">
          <div id="comment" class="inactive">
            <content></content>
          </div>
          <paper-button id="btn" class="hidden">
            <lrn-icon icon="chevron-down" id="icon"></lrn-icon>
          </paper-button>
        </div>
      </div>
      <div class="card-actions">
        <template is="dom-if" if="{{actionView}}">
          <a href="{{actionView}}" tabindex="-1">
            <paper-button raised="" id="view">View thread</paper-button>
          </a>
        </template>
      </div>
    </paper-card>
`,

  is: 'lrnapp-block-recent-comments-comment',
  behaviors: [IronResizableBehavior],

  listeners: {
    "iron-resize": "onHeightChange"
  },

  onHeightChange: function () {
    var root = this;
    var height = root.shadowRoot.querySelector('#comment').offsetHeight;
    var btn = root.shadowRoot.querySelector('#btn');

    if (height > 80)
      btn.classList.toggle('hidden', this.hidden)
  },

  properties: {
    commentTitle: {
      type: String,
      value: 'Comment title',
      reflectToAttribute: true,
      notify: true,
    },
    actionView: {
      type: String,
      reflectToAttribute: true,
      notify: true,
    },
    dateUpdated: {
      type: String,
      reflectToAttribute: true,
      notify: true,
    },
    commentUser: {
      type: Object,
      value: {},
      reflectToAttribute: true,
      notify: true,
    },
  },

  ready: function () {
    var root = this;
    var comment = root.shadowRoot.querySelector('#comment');
    var btn = root.shadowRoot.querySelector('#btn');

    root.shadowRoot.querySelector('.button-wrapper').addEventListener('click', function (e) {
      var target = e.target
      if (target) {
        comment.classList.toggle('inactive', this.inactive)
      }
    });
  }
});
