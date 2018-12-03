Polymer({
  _template: `
      <style>
          :host {
              display: flex;
          }

          paper-card {
              margin: 1.25em;
              padding: 1em;
          }

          h1,
          h2,
          h3,
          h4 {
              text-align: left;
          }

          p {
              font-size: 14px;
              line-height: 18px;
              text-align: left;
          }

          .nowrap p {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          .right-actions {
              float: right;
          }

          .paper-card-length-1 {
              width: 85%;
              margin-bottom: .5em;
          }

          .paper-card-length-2 {
              width: 81%;
              margin-top: 0;
              margin-bottom: .5em;
          }

          .paper-card-length-3 {
              width: 77%;
              margin-top: 0;
              margin-bottom: .5em;
          }

          .comment-depth-2 {
              margin: .5em;
          }

          .comment-depth-3 {
              margin: 1em;
          }

          .comment-depth-4 {
              margin: 1em;
          }

          .comment-depth-5 {
              margin: 1em;
          }

          .comment-depth-6 {
              margin: 1em;
          }

          .center {
              padding: 0;
          }
      </style>
      <div class\$="center comment-depth-[[comment.attributes.threadDepth]]">
        <lrndesign-avatar label="[[comment.relationships.author.data.name]]" class="float-left"></lrndesign-avatar>
        <!--<p class="date">{{comment.meta.created}}</p>-->
      </div>
      <paper-card class\$="paper-card-length-[[comment.attributes.threadDepth]]">
        <div id="body" class="comment-body nowrap">
          <h4>{{comment.relationships.author.data.name}} <span class="grey-said"> said:</span></h4>
          <word-count>{{comment.attributes.body}}</word-count>
        </div>
        <div class\$="card-actions">
          <paper-icon-button class="right-actions" id="reply" icon="icons:reply"></paper-icon-button>
          <paper-tooltip for="reply" animation-delay="0">Reply</paper-tooltip>
          <paper-icon-button class="right-actions" id="edit" icon="icons:create"></paper-icon-button>
          <paper-tooltip for="edit" animation-delay="0">Edit</paper-tooltip>
          <paper-icon-button class="right-actions" id="delete" icon="icons:delete-forever"></paper-icon-button>
          <paper-tooltip for="delete" animation-delay="0">Delete</paper-tooltip>
        </div>
      </paper-card>
`,

  is: 'lrnapp-studio-submission-comment',

  properties: {
      comment: {
          type: Object
      }
  },

  ready: function () {
      var root = this;
      var comment = root.shadowRoot.querySelector('#body');
      console.log(comment);
      comment.addEventListener('click', function (e) {
          // var normalizedEvent = dom(e);
          // console.info('localTarget is:', normalizedEvent.localTarget);
          var target = e.target
          if (target) {
              comment.classList.toggle('nowrap');
          }
      });


  }
});
