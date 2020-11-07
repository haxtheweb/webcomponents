import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@vaadin/vaadin-grid/vaadin-grid.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@vaadin/vaadin-grid/vaadin-grid.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@vaadin/vaadin-grid/vaadin-grid-column-group.js";
import "@vaadin/vaadin-grid/vaadin-grid-filter.js";
import "@polymer/paper-input/paper-input.js";
import "../elmsln-base-deps.js";
import "@vaadin/vaadin-grid/vaadin-grid-sorter.js";
import "@vaadin/vaadin-grid/vaadin-grid-selection-column.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";

class LrnappCanvasListing extends PolymerElement {
  static get template() {
    return html`
      <style include="materializecss-styles">
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
        vaadin-grid#material {
          height: 75vh;
          font-family: Roboto, sans-serif;
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

        vaadin-grid#material .cell {
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 56px;
        }

        vaadin-grid#material .cell.last {
          padding-right: 24px;
        }

        vaadin-grid#material .cell.numeric {
          text-align: right;
        }

        vaadin-grid#material simple-fields-field {
          --primary-color: var(--paper-indigo-500);
          margin: 0 24px;
        }

        vaadin-grid#material vaadin-grid-sorter {
          --vaadin-grid-sorter-arrow: {
            display: none !important;
          }
        }

        vaadin-grid#material vaadin-grid-sorter .cell {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        vaadin-grid#material vaadin-grid-sorter simple-icon {
          transform: scale(0.8);
        }

        vaadin-grid#material vaadin-grid-sorter:not([direction]) simple-icon {
          color: rgba(0, 0, 0, var(--dark-disabled-opacity));
        }

        vaadin-grid#material vaadin-grid-sorter[direction] {
          color: rgba(0, 0, 0, var(--dark-primary-opacity));
        }

        vaadin-grid#material vaadin-grid-sorter[direction="desc"] simple-icon {
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
      </style>
      <iron-ajax
        auto
        url="[[sourcePath]]"
        params='{"return": "courses"}'
        handle-as="json"
        on-response="handleResponse"
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
        items="[[_toArray(canvasCourses)]]"
      >
        <vaadin-grid-column width="50px" flex-grow="0">
          <template class="header">#</template>
          <template>[[index]]</template>
          <template class="footer">#</template>
        </vaadin-grid-column>
        <vaadin-grid-column width="200px" flex-grow="0" resizable>
          <template class="header">
            <vaadin-grid-sorter path="term">Semester</vaadin-grid-sorter>
          </template>
          <template> [[item.term]] </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Semester"
              path="term"
              value="[[_filterTerm]]"
            >
              <paper-input
                slot="filter"
                label="Semester"
                value="{{_filterTerm::input}}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable>
          <template class="header">
            <vaadin-grid-sorter path="name">Name</vaadin-grid-sorter>
          </template>
          <template>[[item.name]]</template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Course"
              path="name"
              value="[[_filterCourse]]"
            >
              <paper-input
                slot="filter"
                label="Course"
                value="{{_filterCourse::input}}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column resizable>
          <template class="header">
            <vaadin-grid-sorter path="sis_course_id">SIS</vaadin-grid-sorter>
          </template>
          <template> [[item.sis_course_id]] </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Student information system ID"
              path="sis_course_id"
              value="[[_filterSIS]]"
            >
              <paper-input
                slot="filter"
                label="SIS"
                value="{{_filterSIS::input}}"
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
          <template>[[item.student_count]]</template>
        </vaadin-grid-column>
        <vaadin-grid-column width="100px" flex-grow="0" resizable>
          <template class="header">
            <vaadin-grid-sorter path="workflow_state">State</vaadin-grid-sorter>
          </template>
          <template>[[item.workflow_state]]</template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Workflow state"
              path="workflow_state"
              value="[[_filterWorkflow]]"
            >
              <paper-input
                slot="filter"
                label="State"
                value="{{_filterWorkflow::input}}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column>
          <template class="header">ELMSLN Course</template>
          <template>
            <select
              name$="elmsln--map--:key:[[item.sis_course_id]]:key:[[item.term]]:key:[[item.start]]:key:[[item.end]]"
              class="listing-select"
              value="{{item.elmslnCourse::input}}"
            >
              <template
                is="dom-repeat"
                items="[[elmslnCourses]]"
                as="elmsCourse"
              >
                <option value="[[elmsCourse.machineName]]">
                  [[elmsCourse.name]] ([[elmsCourse.machineName]])
                </option>
              </template>
            </select>
          </template>
          <template class="footer">
            <vaadin-grid-filter
              aria-label="Course"
              path="elmslnCourse"
              value="[[_filterELMSLNCourse]]"
            >
              <paper-input
                slot="filter"
                label="Course"
                value="{{_filterELMSLNCourse::input}}"
                focus-target
              ></paper-input>
            </vaadin-grid-filter>
          </template>
        </vaadin-grid-column>
        <vaadin-grid-column width="100px" flex-grow="0">
          <template class="header"></template>
          <template>
            <button on-click="_triggerDialog" id$="{{item.sis_course_id}}">
              Details
            </button>
          </template>
          <template class="footer"></template>
        </vaadin-grid-column>
      </vaadin-grid>
      <iron-ajax
        id="request"
        url="[[sourcePath]]"
        params='{"return": "users"}'
        handle-as="json"
        on-response="handleRosterResponse"
        last-response="{{queryResponse}}"
      ></iron-ajax>
      <lrnsys-dialog
        tabindex="-1"
        id="details-dialog"
        body-append
        header="{{activeCourse.name}}"
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
            <template is="dom-if" if="{{activeCourse.image}}">
              <img
                style="width:100%; height:200px; background-color: lightgray;"
                loading="lazy"
                src$="{{activeCourse.image}}"
              />
            </template>
            <span class="heading">
              <span>Student count: {{activeCourse.student_count}}</span>
              <span>SIS ID: {{activeCourse.sis_course_id}}</span>
              <span>Term: {{activeCourse.term}}</span>
              <span>Workflow: {{activeCourse.workflow_state}}</span>
            </span>
          </template>
        </div>
        <div id="loadingContent" slot="content">
          <template is="dom-repeat" items="[[_toArray(roster)]]" as="roleList">
            <h2>{{roleList.role}}s</h2>
            <template
              is="dom-repeat"
              items="[[_toArray(roleList.users)]]"
              as="user"
            >
              <div class="avatar-name" id$="user-{{user.id}}">
                <lrndesign-avatar
                  label$="{{user.name}}"
                  src$="{{user.picture}}"
                ></lrndesign-avatar>
              </div>
              <simple-tooltip for$="user-{{user.id}}"
                >{{user.name}}</simple-tooltip
              >
            </template>
          </template>
        </div>
      </lrnsys-dialog>
    `;
  }
  static get tag() {
    return "lrnapp-canvas-listing";
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
      elmslnCourses: {
        type: Array,
        notify: true,
      },
      canvasCourses: {
        type: Array,
        notify: true,
      },
      roster: {
        type: Array,
        notify: true,
        value: false,
      },
      queryResponse: {
        type: Array,
        notify: true,
      },
      sourcePath: {
        type: String,
        notify: true,
      },
      activeCourse: {
        type: String,
        notify: true,
        reflectToAttribute: true,
      },
    };
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
    this.$.loading.hidden = true;
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
