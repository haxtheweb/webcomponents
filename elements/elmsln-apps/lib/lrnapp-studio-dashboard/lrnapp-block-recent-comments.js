import './lrnapp-block-recent-comments-comment.js';
Polymer({
  _template: `
    <style include="paper-item-styles">
      :host {
        display: block;
      }
    </style>
    <div id="loading">
      <h3>Loading..</h3>
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
    </div>
    <iron-ajax auto="" url="{{sourcePath}}" handle-as="json" last-response="{{response}}" on-response="handleResponse"></iron-ajax>
    <template is="dom-repeat" items="[[_toArray(response.data)]]" as="comment">
      <lrnapp-block-recent-comments-comment comment-user="{{comment.relationships.author.data}}" comment-title="{{comment.attributes.subject}}" action-view="{{_getViewLink(comment.relationships.node.data.id)}}" date-updated="{{comment.attributes.changed}}" class="ferpa-protect">
        {{comment.attributes.body}}
      </lrnapp-block-recent-comments-comment>
    </template>
`,

  is: 'lrnapp-block-recent-comments',

  properties: {
    sourcePath: {
      type: String,
      notify: true,
    },
    response: {
      type: Array,
      notify: true,
    }
  },

  handleResponse: function(e) {
    this.$.loading.hidden = true;
  },

  _getViewLink: function(nid) {
    return this.basePath + 'lrnapp-studio-submission/submissions/' + nid;
  },

  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
