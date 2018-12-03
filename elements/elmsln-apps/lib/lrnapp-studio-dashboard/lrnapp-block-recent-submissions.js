Polymer({
  _template: `
    <style include="paper-item-styles">
      :host {
        display: block;
      }
      paper-button {
        width: 100%;
      }
    </style>
    <iron-ajax auto="" url="{{sourcePath}}" handle-as="json" last-response="{{response}}" on-response="handleResponse"></iron-ajax>
    <div id="loading">
      <h3>Loading..</h3>
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
    </div>
    <iron-list items="[[_toArray(response.data)]]" as="item">
      <template>
        <paper-button on-tap="_loadSubmissionUrl">
          <lrndesign-gallerycard data-submission-id\$="[[item.id]]" title="[[item.attributes.title]]" author="[[item.relationships.author.data]]" comments="[[item.meta.comment_count]]" image="[[item.display.image]]" icon="[[item.display.icon]]" class="ferpa-protect">
          </lrndesign-gallerycard>
        </paper-button>
      </template>
    </iron-list>
`,

  is: "lrnapp-block-recent-submissions",

  properties: {
    sourcePath: {
      type: String,
      notify: true
    },
    response: {
      type: Array,
      notify: true
    }
  },

  /**
   * Handle tap on paper-button above to redirect to the correct submission url.
   */
  _loadSubmissionUrl: function(e) {
    let root = this;
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // this will have the id of the current submission
    var active = local.getAttribute("data-submission-id");
    // @todo need a cleaner integration but this at least goes the right place for now
    window.location.href =
      this.basePath + "lrnapp-studio-submission/submissions/" + active;
  },

  handleResponse: function(e) {
    this.$.loading.hidden = true;
  },

  _getViewLink: function(nid) {
    return this.basePath + "lrnapp-studio-submission/submissions/" + nid;
  },

  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
