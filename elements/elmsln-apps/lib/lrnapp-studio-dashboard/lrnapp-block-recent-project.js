import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-item/paper-item-shared-styles.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import { materialCssStyles } from "@lrnwebcomponents/materializecss-styles/lib/colors.js";

class LrnappBlockRecentProject extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      materialCssStyles,
      css`
        #loading {
          width: 100%;
          z-index: 1000;
          opacity: 0.8;
          text-align: center;
          align-content: center;
          justify-content: center;
          background-color: white;
        }
        paper-button {
          padding: 0;
          margin: 0;
          min-width: 1rem;
          text-transform: unset;
        }
        .project-card {
          width: 100%;
          min-width: 15em;
          max-width: 20em;
          margin: 0 1em;
        }
        .button-contents {
          display: flex;
          align-content: center;
        }
        .assignment-row {
          border: 1px solid #000000;
          background-color: #ffffff;
        }
        .assignment-row .assignment-row-button.active {
          background-color: var(--paper-amber-50);
          font-weight: bold;
        }
        .assignment-row:hover .assignment-operations {
          display: block;
          overflow: visible;
          margin: 0.2em;
        }
        .assignment-row-button {
          width: 100%;
          justify-content: flex-start;
          height: 3em;
          text-transform: none;
        }
        .assignment-title {
          display: inline-flex;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1em;
        }
        .status-indicator {
          border-right: 1px solid grey;
          padding: 0.5em;
          margin: 0 0.5em 0 0;
          display: inline-flex;
          line-height: 3em;
          height: 3em;
          justify-content: center;
          align-items: center;
        }
        .whole-project {
          width: 100%;
          margin: 0;
          padding: 0;
        }
      `
    ];
  }
  render() {
    return html`
      <iron-ajax
        auto=""
        url="${this.sourcePath}"
        handle-as="json"
        @last-response-changed="${this.responseChanged}"
        @response="${this.handleResponse}"
      ></iron-ajax>
      <div id="loading">
        <h3>Loading..</h3>
        <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      </div>
      ${this.hasProject
        ? html`
            <a tabindex="-1" href="${this.basePath}lrnapp-studio-kanban">
              <paper-button class="whole-project ferpa-protect">
                <paper-card
                  id="project-${this.project.id}"
                  class="project-card grey lighten-3"
                  heading="${this.project.attributes.title}"
                  elevation="2"
                >
                  <div class="card-content">
                    <iron-list
                      .items="${this._toArray(
                        this.project.relationships.assignments
                      )}"
                      as="assignment"
                      mutable-data
                    >
                      <template>
                        <div class="assignment-row" id="assignment">
                          <lrnsys-button
                            inner-class="no-left-padding"
                            class="assignment-row-button"
                            button-class="assignment-row-button"
                            id="assignment-${this.project.id}-[[assignment
                              .id]]"
                            hover-class="amber lighten-5"
                            href="${this.basePath}lrnapp-studio-kanban"
                          >
                            <span class="button-contents">
                              <div
                                class="status-indicator [[assignment
                                  .metadata.relatedSubmissions.complete.color]]"
                              >
                                <iron-icon
                                  icon="[[assignment.metadata
                                    .relatedSubmissions.complete.icon]]"
                                ></iron-icon>
                              </div>
                              <div class="assignment-title">
                                [[assignment.title]]
                              </div>
                            </span>
                          </lrnsys-button>
                        </div>
                      </template>
                    </iron-list>
                  </div>
                </paper-card>
              </paper-button>
            </a>
          `
        : html`
            <lrnsys-button
              inner-class="no-left-padding"
              button-class="assignment-row-button"
              class="assignment-row-button"
              href="${this.basePath}lrnapp-studio-kanban"
              hover-class="amber lighten-5"
            >
              <span class="button-contents">
                <div class="status-indicator">
                  <iron-icon icon="assignment"></iron-icon>
                </div>
                <div class="assignment-title">
                  Tap to start your first project!
                </div>
              </span>
            </lrnsys-button>
          `}
    `;
  }
  static get tag() {
    return "lrnapp-block-recent-project";
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
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      sourcePath: {
        type: String,
        attribute: "source-path"
      },
      response: {
        type: Object
      },
      project: {
        type: Object
      },
      hasProject: {
        type: Boolean,
        reflect: true
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // computed
      if (["project"].includes(propName)) {
        this.hasProject = this._getHasProject(this[propName]);
      }
      let notifiedProps = ["sourcePath", "response", "hasProject", "project"];
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
  /**
   * Generate the correct boolean for having a project.
   */
  _getHasProject(project) {
    if (typeof project.id !== typeof undefined) {
      return true;
    }
    return false;
  }
  responseChanged(e) {
    this.response = e.detail.value;
  }
  /**
   * Swap off the loading with project data.
   */
  handleResponse(e) {
    this.shadowRoot.querySelector("#loading").hidden = true;
    this.project = this.response.data;
  }

  /**
   * Generate an array.
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
window.customElements.define(
  LrnappBlockRecentProject.tag,
  LrnappBlockRecentProject
);
export { LrnappBlockRecentProject };
