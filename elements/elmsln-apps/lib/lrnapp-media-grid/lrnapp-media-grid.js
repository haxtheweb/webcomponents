Polymer({
  _template: `
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
      }
      paper-button {
        padding: 0;
        margin: 0;
        min-width: 1rem;
      }
      #details {
        opacity: .5;
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 0 1rem 0 0;
        background-color: white;
        padding: .5em;
      }
      #details:hover {
        opacity: 1;
      }
      #details span {
        font-size: .6em;
        font-weight: normal;
      }
      #details .comment-on-work {
        font-size: .8em;
        background-color: white;
      }
    </style>
    <iron-ajax id="ajax" url="[[sourcePath]]" params="" handle-as="json" last-response="{{images}}"></iron-ajax>
    <iron-scroll-threshold on-lower-threshold="_loadMoreData" id="threshold">
    <scary-gallery min-height="150">
    <template is="dom-repeat" items="[[_toArray(images.data)]]" as="image">
      <paper-button>
        <scary-image preload="" title="{{image.filename}}" alt="{{image.alt}}" src="{{image.src}}" height="{{image.height}}" width="{{image.width}}"></scary-image>
      </paper-button>
    </template>
    </scary-gallery>
    </iron-scroll-threshold>
    <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <paper-dialog-scrollable id="dialogResponse">
        <iron-image src="{{activeImage}}"></iron-image>
        <div id="details">
          <div class="title">
            <span>Title:</span> <span>{{activeTitle}}</span>
          </div>
          <div class="comment-on-work">
            <a href="{{activeUrl}}">
              <paper-button raised="">View media</paper-button>
            </a>
          </div>
        </div>
      </paper-dialog-scrollable>
    </paper-dialog>
`,

  is: "lrnapp-media-grid",

  listeners: {
    click: "_triggerDialog"
  },

  properties: {
    sourcePath: {
      type: String,
      notify: true
    },
    images: {
      type: Array,
      notify: true
    },
    activeImage: {
      type: String,
      reflectToAttribute: true,
      notify: true
    },
    activeTitle: {
      type: String,
      reflectToAttribute: true,
      notify: true
    },
    activeUrl: {
      type: String,
      reflectToAttribute: true,
      notify: true
    }
  },

  /**
   * When someone clicks if there is a url, then we need to
   * remote load whatever is in that url.
   */
  _triggerDialog: function(e) {
    let root = this;
    // make sure we found an image as we're going through here
    if (e.target.nextElementSibling.nodeName == "IMG") {
      root.activeImage = e.target.nextElementSibling.src;
      root.activeTitle = e.target.parentElement.title;
      root.activeUrl = e.target.parentElement.openUrl;
      this.shadowRoot.querySelector("#dialog").toggle();
    }
  },

  _loadMoreData: function(e) {
    let root = this;
    root.shadowRoot.querySelector("#ajax").generateRequest();
    root.shadowRoot.querySelector("#threshold").clearTriggers();
  },

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
