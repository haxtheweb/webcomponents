import { LitElement, html, css } from "lit-element/lit-element.js";
import "@vaadin/vaadin-grid/vaadin-grid.js";
import "@vaadin/vaadin-grid/vaadin-grid.js";
import "@vaadin/vaadin-grid/vaadin-grid-column-group.js";
import "@vaadin/vaadin-grid/vaadin-grid-filter.js";
import "@vaadin/vaadin-grid/vaadin-grid-sorter.js";
import "@vaadin/vaadin-grid/vaadin-grid-selection-column.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";

class LrnappCanvasListing extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 0 2em;
        }
        .loading {
          width: 100%;
          z-index: 1000;
          opacity: 0.8;
          text-align: center;
          align-content: center;
          justify-content: center;
          height: 100vh;
          position: absolute;
          background-color: white;
        }
        vaadin-grid {
          height: 75vh;
          font-family: Roboto, sans-serif;
        }

        vaadin-grid .cell {
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 56px;
        }

        vaadin-grid .cell.last {
          padding-right: 24px;
        }

        vaadin-grid .cell.numeric {
          text-align: right;
        }

        vaadin-grid paper-checkbox {
          --primary-color: var(--paper-indigo-500);
          margin: 0 24px;
        }

        vaadin-grid vaadin-grid-sorter .cell {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        vaadin-grid vaadin-grid-sorter iron-icon {
          transform: scale(0.8);
        }

        vaadin-grid vaadin-grid-sorter:not([direction]) iron-icon {
          color: rgba(0, 0, 0, var(--dark-disabled-opacity));
        }

        vaadin-grid vaadin-grid-sorter[direction] {
          color: rgba(0, 0, 0, var(--dark-primary-opacity));
        }

        vaadin-grid vaadin-grid-sorter[direction="desc"] iron-icon {
          transform: scale(0.8) rotate(180deg);
        }
        vaadin-grid-sorter {
          text-align: center;
        }
        lrndesign-avatar {
          display: inline-flex;
        }
        lrnsys-dialog {
          display: inline-flex;
        }
        lrnsys-dialog #dialog-trigger span {
          pointer-events: none;
        }
        .avatar-name {
          line-height: 2em;
          margin: 0;
          display: inline-block;
        }
        .listing-select {
          display: block;
          height: 100%;
          margin: 0;
          width: 100%;
        }
      `
    ];
  }
  render() {
    return html`
      <custom-style>
        <style include="materializecss-styles">
          vaadin-grid {
            --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

            --vaadin-grid-cell: {
              padding: 0;
            }

            --vaadin-grid-header-cell: {
              height: 3.5em;
              color: rgba(0, 0, 0, var(--dark-secondary-opacity));
              font-size: 1em;
            }

            --vaadin-grid-body-cell: {
              height: 3em;
              color: rgba(0, 0, 0, var(--dark-primary-opacity));
              font-size: 0.8em;
            }

            --vaadin-grid-body-row-hover-cell: {
              background-color: var(--paper-grey-200);
            }

            --vaadin-grid-body-row-selected-cell: {
              background-color: var(--paper-grey-100);
            }

            --vaadin-grid-focused-cell: {
              box-shadow: none;
              font-weight: bold;
            }
          }
          vaadin-grid vaadin-grid-sorter {
            --vaadin-grid-sorter-arrow: {
              display: none !important;
            }
          }
        </style>
      </custom-style>
      <iron-ajax
        auto
        url="${this.sourcePath}"
        params='{"return": "courses"}'
        handle-as="json"
        @response="${this.handleResponse}"
        last-response="{{queryResponse}}"
      ></iron-ajax>
      <div id="loading" class="loading">
        <h3>Loading..</h3>
        <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      </div>
      <vaadin-grid
        column-reordering-allowed
        id="material"
        aria-label="Course list"
        .items="${this._toArray(this.canvasCourses)}"
      >
        <vaadin-grid-column width="50px" flex-grow="0">
          <template class="header"
            >#</template
          >
          <template
            >[[index]]</template
          >
          <template class="footer"
            >#</template
          >
        </vaadin-grid-column>
        <vaadin-grid-column width="200px" flex-grow="0" resizable>
          <template class="header">
            <vaadin-grid-sorter path="term">Semester</vaadin-grid-sorter>
          </template>
          <template>
            [[item.term]]
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Semester"
              path="term"
              value="${this._filterTerm}"
            >
              <paper-input
                slot="filter"
                label="Semester"
                @value-changed="${this._filterTermEvent}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable>
          <template class="header">
            <vaadin-grid-sorter path="name">Name</vaadin-grid-sorter>
          </template>
          <template
            >[[item.name]]</template
          >
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Course"
              path="name"
              value="${this._filterCourse}"
            >
              <paper-input
                slot="filter"
                label="Course"
                @value-changed="${this._filterCourseEvent}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable>
          <template class="header">
            <vaadin-grid-sorter path="sis_course_id">SIS</vaadin-grid-sorter>
          </template>
          <template>
            [[item.sis_course_id]]
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Student information system ID"
              path="sis_course_id"
              value="${this._filterSIS}"
            >
              <paper-input
                slot="filter"
                label="SIS"
                @value-changed="${this._filterSISChanged}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="100px" flex-grow="0" resizable>
          <template class="header">
            <vaadin-grid-sorter path="student_count"
              >Students</vaadin-grid-sorter
            >
          </template>
          <template
            >[[item.student_count]]</template
          >
        </vaadin-grid-column>
        <vaadin-grid-column width="100px" flex-grow="0" resizable>
          <template class="header">
            <vaadin-grid-sorter path="workflow_state">State</vaadin-grid-sorter>
          </template>
          <template
            >[[item.workflow_state]]</template
          >
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Workflow state"
              path="workflow_state"
              value="${this._filterWorkflow}"
            >
              <paper-input
                slot="filter"
                label="State"
                value="${this._filterWorkflowChanged}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header"
            >ELMSLN Course</template
          >
          <template>
            <select
              name="elmsln--map--:key:[[item.sis_course_id]]:key:[[item.term]]:key:[[item.start]]:key:[[item.end]]"
              class="listing-select"
              value="{{item.elmslnCourse::input}}"
            >
            ${this.elmslnCourses.map(elmsCourse => html`
              <option value="${elmsCourse.machineName}">
                ${elmsCourse.name} (${elmsCourse.machineName})
              </option>            
            `)}
            </select>
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Course"
              path="elmslnCourse"
              value="${this._filterELMSLNCourse}"
            >
              <paper-input
                slot="filter"
                label="Course"
                @value-changed="${this.filterELMSLNCourseEvent}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="100px" flex-grow="0">
          <template class="header"></template>
          <template>
            <paper-button
              raised
              @click="${this._triggerDialog}"
              id="{{item.sis_course_id}}"
              >Details</paper-button
            >
          </template>
          <template class="footer"></template>
        </vaadin-grid-column>
      </vaadin-grid>
      <iron-ajax
        id="request"
        url="${this.sourcePath}"
        params='{"return": "users"}'
        handle-as="json"
        @response="${this.handleRosterResponse}"
        last-response="{{queryResponse}}"
      ></iron-ajax>
      <lrnsys-dialog
        tabindex="-1"
        id="details-dialog"
        body-append
        header="${this.activeCourse.name}"
      >
        <div slot="content">
          <template is="dom-if" if="{{!roster}}">
            <div id="loadingRoster" class="loading">
              <h3>Loading..</h3>
              <elmsln-loading color="grey-text" size="large"></elmsln-loading>
            </div>
          </template>
        </div>
        <div slot="header">
          <template is="dom-if" if="{{roster}}">
            <template is="dom-if" if="${this.activeCourse.image}">
              <iron-image
                style="width:100%; height:200px; background-color: lightgray;"
                sizing="cover"
                preload
                fade
                src="${this.activeCourse.image}"
              ></iron-image>
            </template>
            <span class="heading">
              <span>Student count: ${this.activeCourse.student_count}</span>
              <span>SIS ID: ${this.activeCourse.sis_course_id}</span>
              <span>Term: ${this.activeCourse.term}</span>
              <span>Workflow: ${this.activeCourse.workflow_state}</span>
            </span>
          </template>
        </div>
        <div id="loadingContent" slot="content">
          ${this._toArray(this.roster).map(roleList => html`
            <h2>${roleList.role}s</h2>
            ${this._toArray(roleList.users).map(user => html`
              <div class="avatar-name" id="user-${user.id}">
                <lrndesign-avatar
                  label="${user.name}"
                  src="${user.picture}"
                ></lrndesign-avatar>
              </div>
              <paper-tooltip for="user-${user.id}"
                >${user.name}</paper-tooltip
              >
            `)}
          `)}
        </div>
      </lrnsys-dialog>
    `;
  }
  _filterWorkflowChanged(e) {
    this._filterWorkflow = e.detail.value;
  }
  _filterCourseEvent(e) {
    this._filterCourse = e.detail.value;
  }
  filterELMSLNCourseEvent(e) {
    this._filterELMSLNCourse = e.detail.value;
  }
  _filterTermEvent(e) {
    this._filterTerm = e.detail.value;
  }
  _filterSISChanged(e) {
    this._filterSIS = e.detail.value;
  }
  static get tag() {
    return "lrnapp-canvas-listing";
  }
  static get properties() {
    return {
      _filterWorkflow: {
        type: String,
      },
      _filterSIS: {
        type: String,
      },
      _filterCourse: {
        type: String,
      },
      _filterTerm: {
        type: String,
      },
      _filterELMSLNCourse: {
        type: String,
      },
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
      canvasCourses: {
        type: Array,
      },
      roster: {
        type: Array,
        value: false
      },
      queryResponse: {
        type: Array,
      },
      sourcePath: {
        type: String,
      },
      activeCourse: {
        type: String,
        reflect: true
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ['activeCourse', 'sourcePath', 'queryResponse', 'roster', 'canvasCourses', 'elmslnCourses'];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()}-changed`
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
    });
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
  /**
   * Toggling collapse on an iron element.
   */
  collapseToggle(e) {
    e.target.nextElementSibling.toggle();
  }
  /**
   * Trigger the dialog box to opened and kick off request for data.
   */
  _triggerDialog(e) {
    this.querySelector("#details-dialog").toggleDialog();
    this.roster = false;
    this.activeCourse = this.canvasCourses[e.target.id];
    this.querySelector("#request").params[
      "sis_course_id"
    ] = this.activeCourse.sis_course_id;
    this.querySelector("#request").generateRequest();
    this.querySelector("#loadingContent").style.display = "none";
  }
  handleResponse() {
    this.elmslnCourses = this.queryResponse.data.elmslnCourses;
    this.canvasCourses = this.queryResponse.data.canvasCourses;
    this.shadowRoot.querySelector("#loading").hidden = true;
  }
  handleRosterResponse() {
    this.roster = this.queryResponse.data;
    this.querySelector("#loadingContent").style.display = "block";
  }
  /**
   * highjack shadowDom
   */
  _attachDom(dom) {
    this.appendChild(dom);
  }
}
window.customElements.define(LrnappCanvasListing.tag, LrnappCanvasListing);
export { LrnappCanvasListing };
