import { LitElement, html, css } from "lit-element/lit-element.js";
import { materialCssStyles } from "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@polymer/paper-card/paper-card.js";
import "./lrnapp-block-recent-project.js";
import "./lrnapp-block-recent-submissions.js";
import "./lrnapp-block-recent-comments.js";
import "./lrnapp-block-need-feedback.js";
class LrnappStudioDashboard extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      materialCssStyles,
      css`
        :host {
          display: block;
          padding: 0 2em;
        }
        h1.title {
          font-size: 2em;
          color: black;
          margin: 0;
          padding: 0.5em 0 0 0;
          text-transform: none;
          text-align: left;
        }
        p.para {
          margin: 0;
          padding: 0.25em 0.5em;
        }
        .dashboard-row {
          width: 100%;
          display: inline-flex;
        }
        .dashboard-item {
          width: 30%;
        }
      `
    ];
  }
  render() {
    return html`
      <h1 class="title">Welcome back ${this.username}!</h1>
      <p class="para">Here's what's been going on in the studio</p>
      <div class="dashboard-row">
        <paper-card heading="Your active project" class="dashboard-item">
          <div class="card-content">
            <lrnapp-block-recent-project
              csrf-token="${this.csrfToken}"
              end-point="${this._getEndPoint(this.basePath)}"
              base-path="${this.basePath}"
              source-path="${this._getDataSource(
                this.csrfToken,
                this.basePath,
                "recent-project"
              )}"
            >
            </lrnapp-block-recent-project>
          </div>
        </paper-card>
        <paper-card
          heading="Classmates needing feedback"
          class="dashboard-item"
        >
          <div class="card-content">
            <lrnapp-block-need-feedback
              csrf-token="${this.csrfToken}"
              end-point="${this._getEndPoint(this.basePath)}"
              base-path="${this.basePath}"
              source-path="${this._getDataSource(
                this.csrfToken,
                this.basePath,
                "need-feedback"
              )}"
            >
            </lrnapp-block-need-feedback>
          </div>
        </paper-card>
        <paper-card heading="Recent Studio submissions" class="dashboard-item">
          <div class="card-content">
            <lrnapp-block-recent-submissions
              csrf-token="${this.csrfToken}"
              end-point="${this._getEndPoint(this.basePath)}"
              base-path="${this.basePath}"
              source-path="${this._getDataSource(
                this.csrfToken,
                this.basePath,
                "recent-submissions"
              )}"
            >
            </lrnapp-block-recent-submissions>
          </div>
        </paper-card>
        <paper-card heading="Recent Studio comments" class="dashboard-item">
          <div class="card-content">
            <lrnapp-block-recent-comments
              csrf-token="${this.csrfToken}"
              end-point="${this._getEndPoint(this.basePath)}"
              base-path="${this.basePath}"
              source-path="${this._getDataSource(
                this.csrfToken,
                this.basePath,
                "recent-comments"
              )}"
            >
            </lrnapp-block-recent-comments>
          </div>
        </paper-card>
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
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path",
        reflect: true
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token",
        reflect: true
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      username: {
        type: String,
        reflect: true
      },
      sourcePath: {
        type: String,
        reflect: true,
        attribute: "source-path"
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["sourcePath", "basePath", "csrfToken"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
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
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(LrnappStudioDashboard.tag, LrnappStudioDashboard);
export { LrnappStudioDashboard };
