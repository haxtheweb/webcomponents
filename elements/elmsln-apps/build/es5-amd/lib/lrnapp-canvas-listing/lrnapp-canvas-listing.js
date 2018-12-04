define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-column-group.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-filter.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-sorter.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-selection-column.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/iron-image/iron-image.js",
  "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js",
  "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _vaadinGrid,
  _vaadinGridColumnGroup,
  _vaadinGridFilter,
  _vaadinGridSorter,
  _vaadinGridSelectionColumn,
  _ironAjax,
  _ironImage,
  _paperTooltip,
  _lrnsysDialog,
  _elmslnLoading,
  _lrndesignAvatar
) {
  "use strict";
  function _templateObject_5e8f0830f77011e8b89b0519890f95da() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <custom-style>\n      <style is="custom-style" include="materializecss-styles">\n        :host {\n          display: block;\n          margin: 0 2em;\n        }\n        .loading {\n          width: 100%;\n          z-index: 1000;\n          opacity: 0.8;\n          text-align: center;\n          align-content: center;\n          justify-content: center;\n          height: 100vh;\n          position: absolute;\n          background-color: white;\n        }\n        vaadin-grid#material {\n          height: 75vh;\n          font-family: Roboto, sans-serif;\n          --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));\n\n          --vaadin-grid-cell: {\n            padding: 0;\n          }\n\n          --vaadin-grid-header-cell: {\n            height: 3.5em;\n            color: rgba(0, 0, 0, var(--dark-secondary-opacity));\n            font-size: 1em;\n          }\n\n          --vaadin-grid-body-cell: {\n            height: 3em;\n            color: rgba(0, 0, 0, var(--dark-primary-opacity));\n            font-size: 0.8em;\n          }\n\n          --vaadin-grid-body-row-hover-cell: {\n            background-color: var(--paper-grey-200);\n          }\n\n          --vaadin-grid-body-row-selected-cell: {\n            background-color: var(--paper-grey-100);\n          }\n\n          --vaadin-grid-focused-cell: {\n            box-shadow: none;\n            font-weight: bold;\n          }\n        }\n\n        vaadin-grid#material .cell {\n          overflow: hidden;\n          text-overflow: ellipsis;\n          padding-right: 56px;\n        }\n\n        vaadin-grid#material .cell.last {\n          padding-right: 24px;\n        }\n\n        vaadin-grid#material .cell.numeric {\n          text-align: right;\n        }\n\n        vaadin-grid#material paper-checkbox {\n          --primary-color: var(--paper-indigo-500);\n          margin: 0 24px;\n        }\n\n        vaadin-grid#material vaadin-grid-sorter {\n          --vaadin-grid-sorter-arrow: {\n            display: none !important;\n          }\n        }\n\n        vaadin-grid#material vaadin-grid-sorter .cell {\n          flex: 1;\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n        }\n\n        vaadin-grid#material vaadin-grid-sorter iron-icon {\n          transform: scale(0.8);\n        }\n\n        vaadin-grid#material vaadin-grid-sorter:not([direction]) iron-icon {\n          color: rgba(0, 0, 0, var(--dark-disabled-opacity));\n        }\n\n        vaadin-grid#material vaadin-grid-sorter[direction] {\n          color: rgba(0, 0, 0, var(--dark-primary-opacity));\n        }\n\n        vaadin-grid#material vaadin-grid-sorter[direction="desc"] iron-icon {\n          transform: scale(0.8) rotate(180deg);\n        }\n        vaadin-grid-sorter {\n          text-align: center;\n        }\n        lrndesign-avatar {\n          display: inline-flex;\n        }\n        lrnsys-dialog {\n          display: inline-flex;\n        }\n        lrnsys-dialog #dialog-trigger span {\n          pointer-events: none;\n        }\n        .avatar-name {\n          line-height: 2em;\n          margin: 0;\n          display: inline-block;\n        }\n        .listing-select {\n          display: block;\n          height: 100%;\n          margin: 0;\n          width: 100%;\n        }\n      </style>\n    </custom-style>\n    <iron-ajax\n      auto\n      url="[[sourcePath]]"\n      params="{&quot;return&quot;: &quot;courses&quot;}"\n      handle-as="json"\n      on-response="handleResponse"\n      last-response="{{queryResponse}}"\n    ></iron-ajax>\n    <div id="loading" class="loading">\n      <h3>Loading..</h3>\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n    </div>\n    <vaadin-grid\n      column-reordering-allowed\n      id="material"\n      aria-label="Course list"\n      items="[[_toArray(canvasCourses)]]"\n    >\n      <vaadin-grid-column width="50px" flex-grow="0">\n        <template class="header"\n          >#</template\n        >\n        <template\n          >[[index]]</template\n        >\n        <template class="footer"\n          >#</template\n        >\n      </vaadin-grid-column>\n      <vaadin-grid-column width="200px" flex-grow="0" resizable>\n        <template class="header">\n          <vaadin-grid-sorter path="term">Semester</vaadin-grid-sorter>\n        </template>\n        <template>\n          [[item.term]]\n        </template>\n        <template class="footer">\n          <vaadin-grid-filter\n            aria-label="Semester"\n            path="term"\n            value="[[_filterTerm]]"\n          >\n            <paper-input\n              slot="filter"\n              label="Semester"\n              value="{{_filterTerm::input}}"\n              focus-target\n            ></paper-input>\n          </vaadin-grid-filter>\n        </template>\n      </vaadin-grid-column>\n      <vaadin-grid-column resizable>\n        <template class="header">\n          <vaadin-grid-sorter path="name">Name</vaadin-grid-sorter>\n        </template>\n        <template\n          >[[item.name]]</template\n        >\n        <template class="footer">\n          <vaadin-grid-filter\n            aria-label="Course"\n            path="name"\n            value="[[_filterCourse]]"\n          >\n            <paper-input\n              slot="filter"\n              label="Course"\n              value="{{_filterCourse::input}}"\n              focus-target\n            ></paper-input>\n          </vaadin-grid-filter>\n        </template>\n      </vaadin-grid-column>\n      <vaadin-grid-column resizable>\n        <template class="header">\n          <vaadin-grid-sorter path="sis_course_id">SIS</vaadin-grid-sorter>\n        </template>\n        <template>\n          [[item.sis_course_id]]\n        </template>\n        <template class="footer">\n          <vaadin-grid-filter\n            aria-label="Student information system ID"\n            path="sis_course_id"\n            value="[[_filterSIS]]"\n          >\n            <paper-input\n              slot="filter"\n              label="SIS"\n              value="{{_filterSIS::input}}"\n              focus-target\n            ></paper-input>\n          </vaadin-grid-filter>\n        </template>\n      </vaadin-grid-column>\n      <vaadin-grid-column width="100px" flex-grow="0" resizable>\n        <template class="header">\n          <vaadin-grid-sorter path="student_count">Students</vaadin-grid-sorter>\n        </template>\n        <template\n          >[[item.student_count]]</template\n        >\n      </vaadin-grid-column>\n      <vaadin-grid-column width="100px" flex-grow="0" resizable>\n        <template class="header">\n          <vaadin-grid-sorter path="workflow_state">State</vaadin-grid-sorter>\n        </template>\n        <template\n          >[[item.workflow_state]]</template\n        >\n        <template class="footer">\n          <vaadin-grid-filter\n            aria-label="Workflow state"\n            path="workflow_state"\n            value="[[_filterWorkflow]]"\n          >\n            <paper-input\n              slot="filter"\n              label="State"\n              value="{{_filterWorkflow::input}}"\n              focus-target\n            ></paper-input>\n          </vaadin-grid-filter>\n        </template>\n      </vaadin-grid-column>\n      <vaadin-grid-column>\n        <template class="header"\n          >ELMSLN Course</template\n        >\n        <template>\n          <select\n            name$="elmsln--map--:key:[[item.sis_course_id]]:key:[[item.term]]:key:[[item.start]]:key:[[item.end]]"\n            class="listing-select"\n            value="{{item.elmslnCourse::input}}"\n          >\n            <template is="dom-repeat" items="[[elmslnCourses]]" as="elmsCourse">\n              <option value="[[elmsCourse.machineName]]"\n                >[[elmsCourse.name]] ([[elmsCourse.machineName]])</option\n              >\n            </template>\n          </select>\n        </template>\n        <template class="footer">\n          <vaadin-grid-filter\n            aria-label="Course"\n            path="elmslnCourse"\n            value="[[_filterELMSLNCourse]]"\n          >\n            <paper-input\n              slot="filter"\n              label="Course"\n              value="{{_filterELMSLNCourse::input}}"\n              focus-target\n            ></paper-input>\n          </vaadin-grid-filter>\n        </template>\n      </vaadin-grid-column>\n      <vaadin-grid-column width="100px" flex-grow="0">\n        <template class="header"></template>\n        <template>\n          <paper-button\n            raised\n            on-click="_triggerDialog"\n            id$="{{item.sis_course_id}}"\n            >Details</paper-button\n          >\n        </template>\n        <template class="footer"></template>\n      </vaadin-grid-column>\n    </vaadin-grid>\n    <iron-ajax\n      id="request"\n      url="[[sourcePath]]"\n      params="{&quot;return&quot;: &quot;users&quot;}"\n      handle-as="json"\n      on-response="handleRosterResponse"\n      last-response="{{queryResponse}}"\n    ></iron-ajax>\n    <lrnsys-dialog\n      tabindex="-1"\n      id="details-dialog"\n      body-append\n      header="{{activeCourse.name}}"\n    >\n      <div slot="content">\n        <template is="dom-if" if="{{!roster}}">\n          <div id="loadingRoster" class="loading">\n            <h3>Loading..</h3>\n            <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n          </div>\n        </template>\n      </div>\n      <div slot="header">\n        <template is="dom-if" if="{{roster}}">\n          <template is="dom-if" if="{{activeCourse.image}}">\n            <iron-image\n              style="width:100%; height:200px; background-color: lightgray;"\n              sizing="cover"\n              preload\n              fade\n              src$="{{activeCourse.image}}"\n            ></iron-image>\n          </template>\n          <span class="heading">\n            <span>Student count: {{activeCourse.student_count}}</span>\n            <span>SIS ID: {{activeCourse.sis_course_id}}</span>\n            <span>Term: {{activeCourse.term}}</span>\n            <span>Workflow: {{activeCourse.workflow_state}}</span>\n          </span>\n        </template>\n      </div>\n      <div id="loadingContent" slot="content">\n        <template is="dom-repeat" items="[[_toArray(roster)]]" as="roleList">\n          <h2>{{roleList.role}}s</h2>\n          <template\n            is="dom-repeat"\n            items="[[_toArray(roleList.users)]]"\n            as="user"\n          >\n            <div class="avatar-name" id$="user-{{user.id}}">\n              <lrndesign-avatar\n                label$="{{user.name}}"\n                src$="{{user.picture}}"\n              ></lrndesign-avatar>\n            </div>\n            <paper-tooltip for$="user-{{user.id}}">{{user.name}}</paper-tooltip>\n          </template>\n        </template>\n      </div>\n    </lrnsys-dialog>\n  '
    ]);
    _templateObject_5e8f0830f77011e8b89b0519890f95da = function _templateObject_5e8f0830f77011e8b89b0519890f95da() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5e8f0830f77011e8b89b0519890f95da()
    ),
    is: "lrnapp-canvas-listing",
    properties: {
      elmslnCourses: { type: Array, notify: !0 },
      canvasCourses: { type: Array, notify: !0 },
      roster: { type: Array, notify: !0, value: !1 },
      queryResponse: { type: Array, notify: !0 },
      sourcePath: { type: String, notify: !0 },
      activeCourse: { type: String, notify: !0, reflectToAttribute: !0 }
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    },
    collapseToggle: function collapseToggle(e) {
      e.target.nextElementSibling.toggle();
    },
    _triggerDialog: function _triggerDialog(e) {
      var root = this;
      root.shadowRoot.querySelector("#details-dialog").toggleDialog();
      root.roster = !1;
      root.activeCourse = root.canvasCourses[e.target.id];
      root.shadowRoot.querySelector("#request").params.sis_course_id =
        root.activeCourse.sis_course_id;
      root.shadowRoot.querySelector("#request").generateRequest();
      root.shadowRoot.querySelector("#loadingContent").style.display = "none";
    },
    handleResponse: function handleResponse() {
      var root = this;
      root.elmslnCourses = root.queryResponse.data.elmslnCourses;
      root.canvasCourses = root.queryResponse.data.canvasCourses;
      root.$.loading.hidden = !0;
    },
    handleRosterResponse: function handleRosterResponse() {
      var root = this;
      root.roster = root.queryResponse.data;
      root.shadowRoot.querySelector("#loadingContent").style.display = "block";
    }
  });
});
