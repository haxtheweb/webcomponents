import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./lrnapp-block-recent-project.js";
import "./lrnapp-block-recent-submissions.js";
import "./lrnapp-block-recent-comments.js";
import "./lrnapp-block-need-feedback.js";
class LrnappStudioDashboard extends PolymerElement {
  static get template() {
    return html`
      <style include="materializecss-styles">
        :host {
          display: block;
          padding: 0 32px;
        }
        h1.title {
          font-size: 32px;
          color: black;
          margin: 0;
          padding: 4px 0 0 0;
          text-transform: none;
          text-align: left;
        }
        .dashboard-row {
          width: 100%;
          display: inline-flex;
          justify-content: space-evenly;
        }
        .dashboard-item {
          min-width: 30%;
        }
        h2 {
          font-size: 32px;
          margin: 8px;
          text-align: center;
        }
      </style>
      <h1 class="title">Welcome back [[username]]!</h1>
      <div class="dashboard-row">
        <div class="dashboard-item card">
          <h2>Recent project</h2>
          <div class="card-content">
            <lrnapp-block-recent-project
              csrf-token="[[csrfToken]]"
              end-point="[[_getEndPoint(basePath)]]"
              base-path="[[basePath]]"
              source-path="[[_getDataSource(csrfToken, basePath,'recent-project')]]"
            >
            </lrnapp-block-recent-project>
          </div>
        </div>
        <div class="dashboard-item card">
          <h2>Recent submissions</h2>
          <div class="card-content">
            <lrnapp-block-recent-submissions
              csrf-token="[[csrfToken]]"
              end-point="[[_getEndPoint(basePath)]]"
              base-path="[[basePath]]"
              source-path="[[_getDataSource(csrfToken, basePath,'recent-submissions')]]"
            >
            </lrnapp-block-recent-submissions>
          </div>
        </div>
        <div class="dashboard-item card">
          <h2>Recent comments</h2>
          <div class="card-content">
            <lrnapp-block-recent-comments
              csrf-token="[[csrfToken]]"
              end-point="[[_getEndPoint(basePath)]]"
              base-path="[[basePath]]"
              source-path="[[_getDataSource(csrfToken, basePath,'recent-comments')]]"
            >
            </lrnapp-block-recent-comments>
          </div>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "lrnapp-studio-dashboard";
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
      },
      elmslnSection: {
        type: String,
      },
      basePath: {
        type: String,
      },
      csrfToken: {
        type: String,
      },
      endPoint: {
        type: String,
      },
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
      },
    };
  }
  ready() {
    super.ready();
    window.dispatchEvent(new Event("resize"));
  }
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1000);
  }
  _getEndPoint(basePath) {
    return basePath + "lrnapp-studio-dashboard/blocks";
  }
  _getDataSource(csrfToken, basePath, dataPoint) {
    return (
      basePath +
      "lrnapp-studio-dashboard/blocks/" +
      dataPoint +
      "?token=" +
      csrfToken
    );
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  }
}
window.customElements.define(LrnappStudioDashboard.tag, LrnappStudioDashboard);
export { LrnappStudioDashboard };
