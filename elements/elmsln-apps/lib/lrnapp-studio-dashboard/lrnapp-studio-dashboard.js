<link rel="import" href="../../bower_components/polymer/polymer.html">
<link rel="import" href="../../bower_components/paper-card/paper-card.html">
<script type="module" src="../blocks/lrnapp-block-recent-project.js"></script>
<script type="module" src="../blocks/lrnapp-block-recent-submissions.js"></script>
<script type="module" src="../blocks/lrnapp-block-recent-comments.js"></script>
<script type="module" src="../blocks/lrnapp-block-need-feedback.js"></script>

<dom-module id="lrnapp-studio-dashboard">
  <template>
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
        padding: 0 2em;
      }
      h1.title {
        font-size: 2em;
        color: black;
        margin: 0;
        padding: .5em 0 0 0;
        text-transform: none;
        text-align: left;
      }
      p.para {
        margin: 0;
        padding: .25em .5em;
      }
      .dashboard-row {
        width: 100%;
        display: inline-flex;
      }
      .dashboard-item {
        width: 30%;
      }
    </style>
      <h1 class="title">Welcome back [[username]]!</h1>
      <p class="para">Here's what's been going on in the studio</p>
      <div class="dashboard-row">
        <paper-card heading="Your active project" class="dashboard-item">
          <div class="card-content">
            <lrnapp-block-recent-project csrf-token="[[csrfToken]]" end-point="[[_getEndPoint(basePath)]]" base-path="[[basePath]]" source-path="[[_getDataSource(csrfToken, basePath,'recent-project')]]">
            </lrnapp-block-recent-project>
          </div>
        </paper-card>
        <paper-card heading="Classmates needing feedback" class="dashboard-item">
          <div class="card-content">
            <lrnapp-block-need-feedback csrf-token="[[csrfToken]]" end-point="[[_getEndPoint(basePath)]]" base-path="[[basePath]]" source-path="[[_getDataSource(csrfToken, basePath,'need-feedback')]]">
            </lrnapp-block-need-feedback>
          </div>
        </paper-card>
        <paper-card heading="Recent Studio submissions" class="dashboard-item">
          <div class="card-content">
            <lrnapp-block-recent-submissions csrf-token="[[csrfToken]]" end-point="[[_getEndPoint(basePath)]]" base-path="[[basePath]]" source-path="[[_getDataSource(csrfToken, basePath,'recent-submissions')]]">
            </lrnapp-block-recent-submissions>
          </div>
        </paper-card>
        <paper-card heading="Recent Studio comments" class="dashboard-item">
          <div class="card-content">
            <lrnapp-block-recent-comments csrf-token="[[csrfToken]]" end-point="[[_getEndPoint(basePath)]]" base-path="[[basePath]]" source-path="[[_getDataSource(csrfToken, basePath,'recent-comments')]]">
            </lrnapp-block-recent-comments>
          </div>
        </paper-card>
      </div>
  </template>
  <script type="module">
import '../blocks/lrnapp-block-recent-project.js';
import '../blocks/lrnapp-block-recent-submissions.js';
import '../blocks/lrnapp-block-recent-comments.js';
import '../blocks/lrnapp-block-need-feedback.js';
Polymer({
  is: 'lrnapp-studio-dashboard',
  properties: {
    username: {
      type: String,
      reflectToAttribute: true,
    },
    basePath: {
      type: String,
      notify: true,
      reflectToAttribute: true,
    },
    csrfToken: {
      type: String,
      notify: true,
      reflectToAttribute: true,
    },
    sourcePath: {
      type: String,
      notify: true,
      reflectToAttribute: true,
    }
  },
  _getEndPoint: function(basePath) {
    return basePath + 'lrnapp-studio-dashboard/blocks';
  },
  _getDataSource: function(csrfToken, basePath, dataPoint) {
    return basePath + 'lrnapp-studio-dashboard/blocks/' + dataPoint + '?token=' + csrfToken;
  },
  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  },
});
</script>
</dom-module>
