/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, render, nothing } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { gSheetInterface } from "@haxtheweb/utils/lib/gSheetsInterface.js";
import { normalizeEventPath } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-fields/lib/simple-fields-tag-list.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import "@haxtheweb/a11y-collapse/lib/a11y-collapse-group.js";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/a11y-tabs/a11y-tabs.js";
import "@haxtheweb/a11y-tabs/lib/a11y-tab.js";
import "@haxtheweb/grid-plate/grid-plate.js";
import "@haxtheweb/iframe-loader/lib/loading-indicator.js";
import "@github/time-elements";
import { autorun, toJS } from "mobx";
import { get, set } from "idb-keyval";
import { XLSXFileSystemBrokerSingleton } from "@haxtheweb/file-system-broker/lib/xlsx-file-system-broker.js";
import { SimpleFilterMixin } from "@haxtheweb/simple-filter/simple-filter.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { b64toBlob } from "@haxtheweb/utils/utils.js";

import { UIRenderPieces } from "./GradeBookUIPieces.js";
import { GradeBookStore } from "./grade-book-store.js";
import "./grade-book-pop-up.js";
import "./letter-grade.js";
import "./letter-grade-picker.js";

/**
 * `grade-book`
 * `A headless gradebook that supports multiple backends with rubrics`
 * @demo demo/index.html Grade book
 * @element grade-book
 */
class GradeBookLite extends UIRenderPieces(
  I18NMixin(SimpleFilterMixin(SimpleColors)),
) {
  constructor() {
    super();
    this.__pdfLoading = false;
    this.__hashLoading = false;
    enableServices(["core"]);
    this.where = "term";
    this.hasFilePicker = false;
    this.source = "googledocs";
    if (globalThis.showOpenFilePicker) {
      this.source = "filesystem";
      this.hasFilePicker = true;
    }
    this.ready = false;
    // 0,1 - column splits for 3 column
    // 2 - renders in a new popped up window
    this.displayMode = 0;
    // storing internals of the assessmentView tab
    this.assessmentView = this.resetAssessmentView();
    this.totalScore = 0;
    // student submission status for rendering
    this.activeStudentSubmissions = [];
    // lock on score override
    this.scoreLock = true;
    // active rubric data
    this.activeRubric = [];
    // the active grade sheet
    this.activeGrading = {};
    this.disabled = false;
    // shows progress indicator as it loads
    this.loading = false;
    // translatable text
    this.t = {
      generateHashLink: "Generate hash link",
      generatingPleaseWait: "Generating please wait..",
      downloadingPdfPleaseWait: "Downloading PDF please wait..",
      downloadPdf: "Download PDF",
      csvURL: "CSV URL",
      points: "Points",
      criteria: "Criteria",
      description: "Description",
      assessmentWeight: "Assessment weight",
      overallFeedback: "Overall feedback",
      letterGrade: "Letter grade",
      highRange: "High range",
      lowRange: "Low range",
      noSubmission: "No submission found",
      studentSubmission: "Student submission",
      openInNewWindow: "Open in new window",
      gradingScale: "Grading scale",
      activeStudent: "Active student",
      activeAssignment: "Active assignment",
      submitted: "Submitted",
      dueDate: "Due date",
      firstName: "First name",
      surname: "Surname",
      photo: "Photo",
      email: "Email",
      previous: "Previous",
      next: "Next",
      previousStudent: "Previous student",
      nextStudent: "Next student",
      previousAssignment: "Previous assignment",
      nextAssignment: "Next assignment",
      student: "Student",
      assessmentView: "Assessment View",
      activeAssessment: "Active assessment",
      studentReportView: "Student report view",
      loadGradebook: "Load gradebook",
      load: "Load",
      saveGradebook: "Save gradebook",
      selectGradebookSource: "Select gradebook source",
      sourceData: "Source data",
      pasteValidJSONHere: "Paste valid JSON here",
      loadingFilePleaseWait: "LOADING FILE PLEASE WAIT..",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
    // notice that a category on the active grading area responded that it changed
    this.addEventListener(
      "simple-fields-tag-list-changed",
      this.qualitativeFeedbackUpdate.bind(this),
    );
    // value change within the rubric area
    this.addEventListener("value-changed", this.rubricCriteriaPointsChange);
    // drop event to remove the styling from droppable areas
    this.addEventListener("drop", this._handleDragDrop.bind(this));
    autorun(() => {
      this.activeStudent = toJS(GradeBookStore.activeStudent);
    });
    autorun(() => {
      this.activeAssignment = toJS(GradeBookStore.activeAssignment);
    });
    autorun(() => {
      this.database = toJS(GradeBookStore.database);
    });
    autorun(() => {
      this.activeSubmission = toJS(GradeBookStore.activeSubmission);
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    const resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(this.__resizer);
      this.__resizer = setTimeout(() => {
        var pixels = 0;
        for (let entry of entries) {
          if (entry.contentBoxSize) {
            pixels = Math.round(
              globalThis.innerHeight - entry.contentBoxSize[0].blockSize - 122,
            );
          } else {
            pixels = Math.round(
              globalThis.innerHeight - entry.contentRect.height - 122,
            );
          }
        }
        this.shadowRoot
          .querySelector("#studentassessment")
          .shadowRoot.querySelector("[part='content']").style.height =
          pixels + "px";
      }, 50);
    });
    // see if we have a previous file reference
    setTimeout(async () => {
      this.prevLocalFileReference = await get("grade-book-prev-file");
      this.requestUpdate();
    }, 0);
  }
  resetAssessmentView() {
    return {
      qualitative: [],
      written: [],
    };
  }
  /**
   * Return an object representing all scores on all assignments
   * which allows us to make a visual of all submissions this student
   * has had.
   */
  getStudentSubmissions(activeStudent) {
    let response = [];
    for (var i in this.database.submissions) {
      let row = this.database.submissions[i];
      // look for student, need a match before we render anything
      if (row.student === this.database.roster[activeStudent].student) {
        for (var j in row) {
          if (j !== "student") {
            let a = this.getAssignmentByShortName(j);
            if (a) {
              response.push({
                studentScore:
                  !this.database.grades[activeStudent] ||
                  this.database.grades[activeStudent][j] == ""
                    ? null
                    : this.database.grades[activeStudent][j],
                assignmentPoints: a.points,
                assignmentName: a.name,
                assignmentIndex: a.index,
              });
            }
          }
        }
        return response;
      }
    }
    return response;
  }
  getAssignmentByShortName(name) {
    let index;
    let item = this.database.assignments.filter((i, ind) => {
      if (i.shortName === name) {
        index = ind;
        return true;
      }
      return false;
    });
    if (item.length === 1) {
      item[0].index = index;
      return item[0];
    }
    return null;
  }
  // generate current score based on student / assignment cross-section
  getCurrentScore(activeStudent, activeAssignment) {
    // see if there's a score set in the grades setup
    if (
      this.database.grades[activeStudent] &&
      this.database.grades[activeStudent][
        this.database.assignments[activeAssignment].shortName
      ]
    ) {
      return this.database.grades[activeStudent][
        this.database.assignments[activeAssignment].shortName
      ];
    }
    return 0;
  }
  // return the active rurbic based on active assignment
  getActiveRubric() {
    return this.database.rubrics.filter((item) => {
      return (
        item.shortName ==
        this.database.assignments[this.activeAssignment].rubric
      );
    });
  }
  /**
   * LitElement life cycle for property change notification
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // set rubric based on assignment
      if (
        !this.loading &&
        ["activeAssignment", "activeStudent", "database", "loading"].includes(
          propName,
        )
      ) {
        setTimeout(() => {
          // this will defer to whatever the "grades" db value is
          this.totalScore = this.getCurrentScore(
            this.activeStudent,
            this.activeAssignment,
          );
          this.assessmentView = this.resetAssessmentView();
          this.activeRubric = [...this.getActiveRubric()];
          this.hideRubricInfo = [
            ...this.activeRubric.map(() => {
              return false;
            }),
          ];
          this.activeStudentSubmissions = [];
          this.activeStudentSubmissions = [
            ...this.getStudentSubmissions(this.activeStudent),
          ];
          if (this.database.tags && this.database.tags.data) {
            this.items = this.database.tags.data;
          }
        }, 0);
      }
      // source will have to fetch ALL the pages and slowly load data as it rolls through
      if (["sourceData", "source"].includes(propName)) {
        if (this.sourceData) {
          switch (this.source) {
            case "googledocs":
              this.loading = true;
              // gid from the google sheet. technically if you add / remove sheets this would
              // have to be updated to match
              this.gSheet = new gSheetInterface(this, this.sourceData, {
                tags: 0,
                roster: 118800528,
                assignments: 540222065,
                rubrics: 1744429439,
                submissions: 2104732668,
                gradeScale: 980501320,
                grades: 2130903440,
                gradesDetails: 644559151,
                settings: 1413275461,
              });
              setTimeout(async () => {
                for (var i in this.gSheet.sheetGids) {
                  let loadedData = await this.gSheet.loadSheetData(i);
                  loadedData = this.transformTable(loadedData);
                  if (typeof this[`process${i}Data`] === "function") {
                    loadedData = this[`process${i}Data`](loadedData);
                  }
                  this.database[i] = loadedData;
                  if (
                    i === "gradeScale" &&
                    this.database.gradeScale &&
                    this.database.gradeScale.length > 0
                  ) {
                    GradeBookStore.gradeScale = this.database.gradeScale;
                  }
                  this.requestUpdate();
                }
                this.importStateCleanup();
              }, 0);
              break;
            case "url":
              this.loading = true;
              fetch(this.sourceData)
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  }
                })
                .then((json) => {
                  GradeBookStore.database = json;
                  this.importStateCleanup();
                })
                .catch((error) => {
                  console.warn(error);
                });
              break;
            case "json":
              GradeBookStore.database = JSON.parse(this.sourceData);
              this.importStateCleanup();
              break;
          }
        } else if (this.source == "filesystem") {
          if (!this.__applied) {
            this.__applied = true;
            // this listener gets the event from the service worker
            globalThis.addEventListener("xlsx-file-system-data", (e) => {
              let database = e.detail.data;
              for (var i in database) {
                let loadedData = this.transformTable(database[i]);
                if (typeof this[`process${i}Data`] === "function") {
                  loadedData = this[`process${i}Data`](loadedData);
                }
                GradeBookStore.database[i] = loadedData;
              }
              this.importStateCleanup();
            });
          }
        }
      }
    });
  }
  importStateCleanup() {
    this.loading = false;
    if (this.database.gradeScale && this.database.gradeScale.length > 0) {
      GradeBookStore.gradeScale = this.database.gradeScale;
    }
    this.requestUpdate();
    this.ready = true;
  }
  transformTable(table) {
    let tmp = table.shift();
    let headings = {};
    let data = [];
    for (var i in tmp) {
      headings[tmp[i]] = i;
    }
    for (var i in table) {
      let item = {};
      for (var j in headings) {
        item[j] = table[i][headings[j]];
      }
      // push data onto the database of all data we have now as objects
      data.push(item);
    }
    // allow for deeper processing on the data or just return the data found
    return data;
  }
  /**
   * process assignment data to normalize date string
   */
  processassignmentsData(data) {
    for (var i in data) {
      if (data[i].dueDate != "") {
        try {
          const event = new Date(`${data[i].dueDate} ${data[i].dueTime}`);
          data[i]._ISODueDate = event.toISOString();
        } catch (e) {}
      }
    }
    return data;
  }
  /**
   * Process our tagging structure for use in the rubric
   * Tag structure allows the instructor to drag and drop elements into
   * qualitative areas of a rubric
   */
  processtagsData(data) {
    let categories = new Set([]);
    let rCategories = [];
    // these must all exist as keys for us to proceed
    for (var i in data) {
      data[i].category = data[i].category ? data[i].category.split(",") : [];
      data[i].associatedMaterial = data[i].associatedMaterial
        ? data[i].associatedMaterial.split(",")
        : [];
      // trick to dedup the categories using a Set
      data[i].category.forEach((item) => {
        categories.add(item);
      });
      // convert Set to Array for data visualization purposes
      rCategories = [...Array.from(categories)];
    }
    return {
      categories: rCategories,
      data: data,
    };
  }
  processrubricsData(data) {
    for (var i in data) {
      data[i].qualitative = data[i].qualitative
        ? data[i].qualitative.split(",")
        : [];
    }
    return data;
  }
  processrosterData(data) {
    for (var i in data) {
      data[i].interests = data[i].interests ? data[i].interests.split(",") : [];
    }
    return data;
  }
  processsettingsData(data) {
    let d = {};
    for (var i in data) {
      d[data[i].key] = data[i].value;
    }
    return d;
  }

  static get properties() {
    return {
      ...super.properties,
      displayMode: { type: Number },
      __pdfLoading: { type: Boolean },
      __hashLoading: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      ready: { type: Boolean, reflect: true },
      activeStudent: { type: Number, attribute: "active-student" },
      activeAssignment: { type: Number, attribute: "active-assignment" },
      totalScore: { type: Number },
      scoreLock: { type: Boolean },
      source: { type: String },
      sourceData: { type: String, attribute: "source-data" },
      activeSubmission: { type: String, attribute: false },
      database: { type: Object, attribute: false },
      activeRubric: { type: Object, attribute: false },
      assessmentView: { type: Object, attribute: false },
      activeGrading: { type: Object, attribute: false },
      activeStudentSubmissions: { type: Array },
    };
  }
  async changeAssignment(e) {
    // have to possibly resolve UI click handler of span vs the button
    if (
      e.target.getAttribute("value") == "prev" &&
      0 !== this.activeAssignment
    ) {
      GradeBookStore.activeAssignment--;
    } else if (
      e.target.getAttribute("value") == "next" &&
      this.database.assignments.length - 1 !== GradeBookStore.activeAssignment
    ) {
      GradeBookStore.activeAssignment++;
    }
    await this.requestUpdate();
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        :host [hidden] {
          display: none !important;
        }
        @media (max-width: 900px) {
          .hide-900 {
            display: none;
          }
        }
        loading-indicator {
          --loading-indicator-background-color: var(
            --simple-colors-default-theme-accent-2,
            grey
          );
          --loading-indicator-color: var(
            --simple-colors-default-theme-accent-10,
            black
          );
        }
        loading-indicator[full] {
          top: 0;
          position: absolute;
          left: 0;
          right: 0;
          z-index: 1;
        }
        h1,
        h2,
        h3,
        h4 {
          margin: 0;
        }
        grid-plate {
          --hax-layout-container-transition: none;
          --grid-plate-col-transition: none;
          --grid-plate-item-margin: 0px;
          --grid-plate-item-padding: 8px;
        }
        #studentassessment {
          --a11y-tabs-border-color: var(
            --simple-colors-default-theme-accent-10,
            black
          );
          --a11y-tabs-border-color: var(
            --simple-colors-default-theme-accent-10,
            black
          );
          color: var(--simple-colors-default-theme-grey-12);
          background-color: var(--simple-colors-default-theme-grey-1);
          --a11y-tabs-faded-color: var(--simple-colors-default-theme-grey-11);
          --a11y-tabs-focus-color: var(--simple-colors-default-theme-grey-10);
          --a11y-tabs-faded-background: var(
            --simple-colors-default-theme-grey-2
          );
        }
        #studentassessment::part(content) {
          overflow: scroll;
        }
        a11y-collapse {
          --a11y-collapse-border-color: var(
            --simple-colors-default-theme-accent-10,
            black
          );
          --a11y-collapse-horizontal-padding: 8px;
          --a11y-collapse-vertical-padding: 4px;
        }
        a11y-collapse:not([expanded]):hover {
          background-color: var(--simple-colors-default-theme-accent-1, grey);
        }
        a11y-collapse div[slot="heading"] {
          font-size: 18px;
          font-weight: normal;
          cursor: pointer;
          line-height: 30px;
          display: flex;
        }
        a11y-collapse[expanded] div[slot="heading"] {
          font-weight: bold;
        }
        .active-student-grade-history letter-grade {
          display: inline-flex;
          margin: 2px;
        }
        .active-student-grade-history button {
          opacity: 0.4;
          background-color: transparent;
          border: 0;
          padding: 0;
          margin: 0;
        }
        .active-student-grade-history button.activeAssignment {
          opacity: 0.9;
          background-color: var(--simple-colors-default-theme-yellow-8);
        }
        .active-student-grade-history button:focus,
        .active-student-grade-history button:active,
        .active-student-grade-history button:hover {
          opacity: 1;
          outline: 1px solid black;
          outline-offset: 2px;
        }
        simple-fields-tag-list {
          --simple-fields-tag-list-possible: var(
            --simple-colors-default-theme-accent-2
          );
          --simple-fields-tag-list-focus: var(
            --simple-colors-default-theme-accent-10
          );
        }
        simple-colors[accent-color] {
          display: inline-flex;
          width: 24px;
          height: 24px;
          margin: 4px 6px 0 0;
        }
        simple-colors[accent-color] span {
          display: inline-flex;
          width: 24px;
          height: 24px;
          background-color: var(
            --simple-colors-default-theme-accent-3,
            #eeeeee
          );
        }
        simple-fields-field[type="textarea"] {
          --simple-fields-font-size: 20px;
        }
        .source-selection {
          text-align: center;
          margin-top: 30vh;
          font-size: 32px;
        }
        .source-selection label {
          display: block;
        }
        .source-selection select {
          font-size: 18px;
        }
        #sourcedata,
        #sourcedatablob {
          display: block;
          margin: 16px auto;
          font-size: 24px;
        }
        simple-fields-field[type="number"] {
          --simple-fields-font-size: 40px;
          line-height: 40px;
        }

        .student-feedback-score-heading {
          display: flex;
          font-size: 28px;
          font-weight: bold;
          line-height: 28px;
          padding: 8px;
        }
        .student-feedback-score-heading h3 {
          margin: 0 0 0 8px;
          padding: 0;
        }

        #totalpts {
          width: 84px;
          margin: 0 12px;
        }
        .student-feedback-wrap {
          display: flex;
        }
        .student-feedback-wrap .student-feedback-text {
          width: 80%;
          margin: 0;
        }
        .student-feedback-wrap .student-feedback-text div.heading {
          padding: 20px;
        }
        .student-feedback-wrap .student-feedback-score {
          font-size: 40px;
          line-height: 68px;
          padding: 34px 16px;
          display: flex;
          width: 50%;
        }
        simple-tag {
          margin: 2px;
        }
        simple-tag:focus,
        simple-tag:hover {
          --simple-fields-fieldset-border-color: var(
            --simple-colors-default-theme-accent-10,
            #eeeeee
          );
        }
        .user-info {
          display: flex;
          font-size: 16px;
          min-width: 140px;
          font-family: sans-serif;
          font-weight: normal;
          border-right: 1px solid black;
        }
        .user-left {
          display: inline-flex;
        }
        .user-right {
          display: block;
          padding: 0 4px 0 0;
          margin: 12px 0;
        }
        .user-right div a {
          color: var(--simple-colors-default-theme-grey-12);
          text-decoration: none;
        }
        .user-right div a:hover,
        .user-right div a:focus,
        .user-right div a:active {
          color: var(--simple-colors-default-theme-blue-8);
          text-decoration: underline;
        }
        .user-right div {
          display: block;
          text-align: center;
        }
        .user-photo {
          --simple-icon-height: 48px;
          --simple-icon-width: 48px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          margin: 12px 6px;
          float: left;
          vertical-align: middle;
        }
        .active-submission {
          max-height: 400px;
          width: 60%;
          overflow: auto;
          margin: 0 auto;
        }
        .active-submission iframe {
          height: 400px;
          width: 60%;
        }
        .tag-group {
          position: sticky;
          top: 0;
        }
        .student-report-wrap {
          display: flex;
          justify-content: space-evenly;
        }
        .student-report-score {
          position: absolute;
          right: 40px;
          margin-top: -20px;
        }
        editable-table-display::part(td),
        editable-table-display::part(th) {
          text-align: center;
          vertical-align: top;
          max-width: 250px;
        }
        editable-table-display::part(simple-fields-field) {
          --simple-fields-font-size: 32px;
          --simple-fields-text-align: center;
          background-color: transparent;
          max-width: 100px;
          padding: 0 0 28px 0;
          margin: 0;
        }

        table thead th {
          padding: 4px !important;
          position: sticky;
          top: -2px;
          z-index: 1;
        }
        table thead th:first-child {
          position: sticky;
          left: 0;
          z-index: 2;
        }
        table tbody th {
          position: sticky;
          left: 0;
          z-index: 1;
        }

        .col-highlight,
        tr:hover td,
        tr:hover th {
          transition: 0.3s ease-in-out all;
          background-color: var(
            --simple-colors-default-theme-yellow-2
          ) !important;
        }
        table {
          width: calc(100% - 2 * var(--editable-table-border-width, 1px));
          border-collapse: collapse;
          border-width: var(--editable-table-border-width, 1px);
          border-style: var(--editable-table-border-style, solid);
          border-color: var(--simple-colors-default-theme-grey-6, #999);
          font-weight: var(--editable-table-light-weight, 200);
          color: var(--simple-colors-default-theme-grey-10, #222);
          background-color: var(--simple-colors-default-theme-grey-1, #fff);
        }
        .th,
        .td {
          font-weight: var(--editable-table-light-weight, 200);
          color: var(--simple-colors-default-theme-grey-10, #222);
          background-color: var(--simple-colors-default-theme-grey-1, #fff);
        }
        caption {
          font-size: var(
            --editable-table-caption-font-size,
            var(--editable-table-font-size, unset)
          );
          font-weight: var(--editable-table-heavy-weight, 600);
          color: var(
            --editable-table-caption-color,
            var(--simple-colors-default-theme-grey-10, #222)
          );
          background-color: var(
            --editable-table-caption-bg-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          width: 100%;
        }
        .tr {
          display: table-row;
        }
        .th-or-td {
          display: table-cell;
        }
        .thead .th-or-td {
          height: 32px;
          padding: 0;
          margin: 0;
        }
        .thead-tr .th {
          background-color: var(--simple-colors-default-theme-grey-2, #e0e0e0);
          font-weight: var(--editable-table-heavy-weight, 600);
          color: var(--simple-colors-default-theme-grey-12, #000);
        }
        .tbody-tr .th {
          font-weight: var(--editable-table-heavy-weight, 600);
          color: var(--simple-colors-default-theme-grey-12, #000);
          background-color: var(--simple-colors-default-theme-grey-1, #fff);
          text-align: left;
        }
        table[bordered] .th,
        table[bordered] .td {
          border-width: var(--editable-table-border-width, 1px);
          border-style: var(--editable-table-border-style, solid);
          border-color: var(--simple-colors-default-theme-grey-6, #999);
        }
        table[condensed] {
          --editable-table-cell-vertical-padding: var(
            --editable-table-cell-vertical-padding-condensed,
            2px
          );
          --editable-table-cell-horizontal-padding: var(
            --editable-table-cell-horizontal-padding-condensed,
            4px
          );
        }
        table[striped] .tbody-tr:nth-child(2n + 1) .th-or-td {
          background-color: var(--simple-colors-default-theme-grey-2, #f0f0f0);
        }
        .tfoot-tr .th,
        .tfoot-tr .td {
          border-top: 2px solid var(--simple-colors-default-theme-grey-10, #222);
          font-weight: var(--editable-table-heavy-weight, 600);
          color: var(--simple-colors-default-theme-grey-12, #000);
        }
        caption,
        .th-or-td {
          text-align: left;
        }
        table[numeric-styles] .thead-tr .th-or-td[numeric],
        table[numeric-styles] .tfoot-tr .th-or-td[numeric],
        table[numeric-styles] .th-or-td[numeric] {
          text-align: center;
          font-size: 24px;
          font-family: sans-serif;
          --editable-table-cell-justify: flex-end;
        }
        table[numeric-styles] .tfoot-tr .th-or-td[negative],
        table[numeric-styles] .td[negative] {
          color: var(--simple-colors-default-theme-red-7, red);
          --editable-table-cell-color: var(
            --editable-table-negative-color,
            red
          );
        }

        caption > div {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        caption > div > *:not(:last-child) {
          padding: 0 0 5px;
        }
        #column {
          width: calc(var(--simple-picker-option-size) + 6px);
          overflow: visible;
          display: none;
          margin-left: 10px;
          --simple-picker-border-width: 1px;
          --simple-picker-focus-border-width: 1px;
          --simple-picker-border-color: var(
            --simple-colors-default-theme-grey-6,
            #999
          );
        }
        .th,
        .td {
          padding: 0;
        }
        .top-controls {
          background-color: var(--simple-colors-default-theme-accent-12);
          color: var(--simple-colors-default-theme-accent-1);
          height: 36px;
          vertical-align: middle;
          width: 100%;
          display: flex;
        }
        .top-controls .group {
          padding: 0 8px;
        }
        .top-controls .app-name {
          padding: 0 24px 0 16px;
        }
        .top-controls simple-icon-button-lite span {
          padding: 0 8px 0 0;
        }
        .top-controls .divider-left {
          border-left: 1px solid var(--simple-colors-default-theme-accent-1);
        }
        .top-controls .divider-right {
          border-right: 1px solid var(--simple-colors-default-theme-accent-1);
        }
      `,
    ];
  }
  studentLetterGradeHistoryClick(e) {
    // ensure this is numeric
    GradeBookStore.activeAssignment = parseInt(e.target.value);
    this.requestUpdate();
  }
  activateOption(e) {
    let target = normalizeEventPath(e);
    if (
      target[0].getAttribute("data-student") &&
      target[0].getAttribute("data-assignment")
    ) {
      GradeBookStore.activeAssignment = parseInt(
        target[0].getAttribute("data-assignment"),
      );
      GradeBookStore.activeStudent = parseInt(
        target[0].getAttribute("data-student"),
      );
    }
  }
  handleGridScaling(e) {
    let paths = normalizeEventPath(e);
    if (paths[0].tagName === "TABLE") {
      // toggle between height
      if (paths[0].style.height != "") {
        paths[0].style.height = null;
      } else {
        paths[0].style.height = "90vh";
      }
    }
  }
  PDFPageButton(position = "auto") {
    return html`
      ${MicroFrontendRegistry.has("@core/htmlToPdf")
        ? html` <div class="pdf-page-btn">
            <simple-icon-button-lite
              part="pdf-page-btn"
              class="btn"
              icon="${this.__pdfLoading ? `hax:loading` : `lrn:pdf`}"
              id="pdf-page-btn"
              @click="${this.downloadPDFviaMicro}"
              icon-position="top"
            >
            </simple-icon-button-lite>
            <simple-tooltip for="pdf-page-btn" position="${position}">
              ${this.__pdfLoading
                ? this.t.downloadingPdfPleaseWait
                : this.t.downloadPdf}
            </simple-tooltip>
          </div>`
        : ``}
      <div class="hash-page-btn">
        <simple-icon-button-lite
          part="hash-page-btn"
          class="btn"
          icon="${this.__hashLoading ? `hax:loading` : `link`}"
          id="hash-page-btn"
          @click="${this.createHashLink}"
          icon-position="top"
        >
        </simple-icon-button-lite>
        <simple-tooltip for="pdf-page-btn" position="${position}">
          ${this.__hashLoading
            ? this.t.generatingPleaseWait
            : this.t.generateHashLink}
        </simple-tooltip>
      </div>
    `;
  }
  /**
   * Download PDF, via microservice
   */
  async downloadPDFviaMicro(e) {
    this.__pdfLoading = true;
    // active dom, but remove the Lit comments from response
    let htmlContent = this.shadowRoot
      .querySelector("#studentreport")
      .innerHTML.replace(/<\!--.*?-->/g, "")
      .replace(/\s+/g, " ")
      .trim();
    // base helps w/ calculating URLs in content
    var base = "";
    if (globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    const response = await MicroFrontendRegistry.call("@core/htmlToPdf", {
      base: base,
      html: htmlContent,
    });
    if (response.status == 200 && response.data) {
      const link = globalThis.document.createElement("a");
      // click link to download file
      // @todo this downloads but claims to be corrupt.
      link.href = globalThis.URL.createObjectURL(
        b64toBlob(response.data, "application/pdf"),
      );
      link.download = `StudentReport.pdf`;
      link.target = "_blank";
      this.appendChild(link);
      link.click();
      this.removeChild(link);
    }
    this.__pdfLoading = false;
  }
  /**
   * Download PDF, via microservice
   */
  async createHashLink(e) {
    this.__hashLoading = true;
    // active dom, but remove the Lit comments from response
    let htmlContent = this.shadowRoot
      .querySelector("#studentreport")
      .innerHTML.replace(/<\!--.*?-->/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const response = await MicroFrontendRegistry.call("@core/crypto", {
      op: "hash",
      data: htmlContent,
    });
    if (response.status == 200 && response.data) {
      globalThis.open(
        `https://secure-feedback.vercel.app/?message=${response.data}`,
        "_blank",
      );
    }
    this.__hashLoading = false;
  }
  // open extra window and then render content
  openWindow(e) {
    if (this.__openWindow && !this.__openWindow.closed) {
      this.__openWindow.focus();
    } else {
      this.__openWindow = globalThis.open(
        "",
        "studentwork",
        `left=0,top=0,width=${screen.width / 2},height=${
          screen.height / 2
        },menubar=0,location=0,toolbar=0,status=0`,
      );
      this.__openWindow.onbeforeunload = () => {
        this.displayMode = 0;
        this.__openWindow = null;
      };
    }
  }
  /**
   * LitElement render method
   */
  render() {
    return html`
      <loading-indicator full ?loading="${this.loading}"></loading-indicator>
      <div class="top-controls">
        <div class="group divider-right app-name">
          <slot name="app-name"></slot>
        </div>
        <div class="group divider-right">
          ${this.renderActiveAssignmentBtn()}
          <simple-icon-button-lite
            @click="${this.changeAssignment}"
            value="prev"
            title="${this.t.previousAssignment}"
            icon="arrow-back"
            ?disabled="${0 === this.activeAssignment || !this.ready}"
          >
            <span class="hide-900" value="prev">${this.t.previous}</span>
          </simple-icon-button-lite>
          <simple-icon-button-lite
            @click="${this.changeAssignment}"
            value="next"
            title="${this.t.nextAssignment}"
            ?disabled="${this.database.assignments.length - 1 ===
              this.activeAssignment || !this.ready}"
            icon="arrow-forward"
          >
            <span class="hide-900" value="next">${this.t.next}</span>
          </simple-icon-button-lite>
        </div>
        <div class="group">${this.renderGradeScaleBtn()}</div>
        ${this.ready && this.source === "filesystem" && this.sourceData
          ? html`
              <div class="group">
                <simple-icon-button-lite
                  @click="${this.saveToFilesystem}"
                  title="${this.t.saveGradebook}"
                  ?disabled="${!this.sourceData}"
                  icon="save"
                >
                  <span class="hide-900">${this.t.saveGradebook}</span>
                </simple-icon-button-lite>
              </div>
            `
          : nothing}
      </div>
      <div ?hidden="${this.sourceData}" class="source-selection">
        <label>${this.t.selectGradebookSource}..</label>
        <select id="source" @change="${this.selectSource}">
          ${this.hasFilePicker
            ? html`<option
                value="filesystem"
                ?selected="${this.source === "filesystem"}"
              >
                File system
              </option>`
            : nothing}
          <option
            value="googledocs"
            ?selected="${this.source === "googledocs"}"
          >
            Google docs
          </option>
          <option value="url">URL endpoint (JSON)</option>
          <option value="json">JSON data blob</option>
        </select>
        <simple-icon-button-lite
          @click="${this.loadFromSource}"
          title="${this.t.loadGradebook}"
          ?disabled="${this.sourceData}"
          icon="folder-shared"
        >
          <span class="hide-900">${this.t.loadGradebook}</span>
        </simple-icon-button-lite>
        ${this.source == "filesystem" && this.prevLocalFileReference
          ? html`
              <simple-icon-button-lite
                @click="${this.loadFromExistingSource}"
                title="${this.t.loadGradebook}"
                ?disabled="${this.sourceData}"
                icon="folder-shared"
              >
                <span class="hide-900"
                  >${this.t.load} ${this.prevLocalFileReference.name}</span
                >
              </simple-icon-button-lite>
            `
          : nothing}
        <input
          id="sourcedata"
          placeholder="${this.t.sourceData}"
          ?hidden="${!["googledocs", "url"].includes(this.source)}"
        />
        <textarea
          id="sourcedatablob"
          rows="10"
          cols="40"
          placeholder="${this.t.pasteValidJSONHere}"
          ?hidden="${this.source != "json"}"
        ></textarea>
      </div>
      ${this.source === "filesystem" && this.loading
        ? html`<p class="source-selection">${this.t.loadingFilePleaseWait}</p>`
        : nothing}
      <a11y-tabs
        id="studentassessment"
        full-width
        @a11y-tabs-active-changed="${this.updateStudentReport}"
        ?hidden="${!(
          this.database.assignments &&
          this.database.assignments[this.activeAssignment]
        )}"
      >
        <a11y-tab
          id="assessment"
          icon="assignment-ind"
          label="${this.t.activeAssessment}"
        >
          ${this.activeRubric[0]
            ? html`
                <grid-plate disable-responsive layout="1-1">
                  <div slot="col-1" class="tag-group">
                    <simple-fields-field
                      id="inputfilter"
                      @value-changed="${this.inputfilterChanged}"
                      .value="${this.like}"
                      label="Filter"
                      placeholder="Tag search"
                      type="text"
                      auto-validate=""
                      autofocus
                      part="filter"
                    ></simple-fields-field>
                    <simple-icon-button-lite
                      @click="${this.collapseAll}"
                      icon="hardware:keyboard-arrow-right"
                      class="control"
                      value=""
                      >Collapse all</simple-icon-button-lite
                    >
                    <simple-icon-button-lite
                      @click="${this.expandAll}"
                      icon="hardware:keyboard-arrow-down"
                      class="control"
                      value=""
                      >Expand all</simple-icon-button-lite
                    >
                    ${this.database.tags.categories.length > 0
                      ? html`
                          <a11y-collapse-group
                            heading-button
                            id="categoriesgroup"
                            global-options='{"expanded": true}'
                          >
                            ${this.database.tags.categories.map(
                              (category, i) => html`
                                <a11y-collapse>
                                  <div slot="heading">
                                    <simple-colors
                                      accent-color="${this.pickColor(i)}"
                                      ><span></span></simple-colors
                                    >${category}
                                  </div>
                                  <div slot="content">
                                    ${this.filtered
                                      .filter((item) => {
                                        return item.category.includes(category);
                                      })
                                      .map(
                                        (term) =>
                                          html`<simple-tag
                                            draggable="true"
                                            tabindex="0"
                                            @keypress="${this.keyDown}"
                                            @dragstart="${this.setDragTransfer}"
                                            accent-color="${this.pickColor(i)}"
                                            value="${term.term}"
                                            .data="${term}"
                                          ></simple-tag>`,
                                      )}
                                  </div>
                                </a11y-collapse>
                              `,
                            )}
                          </a11y-collapse-group>
                        `
                      : nothing}
                  </div>
                  <div slot="col-2">
                    <h3>${this.activeRubric[0].name}</h3>
                    ${this.PDFPageButton()}
                    ${this.activeRubric.map(
                      (rubric, index) => html`
                        <letter-grade-picker></letter-grade-picker>

                        <editable-table-display
                          accent-color="${this.accentColor}"
                          bordered
                          column-header
                          condensed
                          disable-responsive
                          scroll
                          striped
                        >
                          <table>
                            <tbody>
                              <tr>
                                ${rubric.qualitative.map(
                                  (cat) => html` <td>${cat}</td> `,
                                )}
                              </tr>
                              <tr>
                                ${rubric.qualitative.map(
                                  (cat) => html`
                                    <td>
                                      <simple-fields-tag-list
                                        style="background-color:transparent;"
                                        data-criteria="${rubric.criteria}"
                                        label="${cat}"
                                      ></simple-fields-tag-list>
                                    </td>
                                  `,
                                )}
                              </tr>
                            </tbody>
                          </table>
                        </editable-table-display>
                        <h4>Additional ${rubric.criteria} feedback</h4>
                        <simple-fields-field
                          type="textarea"
                          data-rubric-written
                          data-criteria="${rubric.criteria}"
                        ></simple-fields-field>
                      `,
                    )}
                    <div class="student-feedback-wrap">
                      <div class="student-feedback-text">
                        <h3 class="heading">Overall feedback</h3>
                        <simple-fields-field
                          type="textarea"
                          data-criteria="overall"
                          data-rubric-written
                        ></simple-fields-field>
                      </div>
                      <div class="student-feedback-score">
                        <simple-icon-button-lite
                          icon="${this.scoreLock ? `lock` : `lock-open`}"
                          @click="${this.toggleLock}"
                        ></simple-icon-button-lite>
                        <simple-fields-field
                          ?disabled="${this.scoreLock}"
                          type="number"
                          min="0"
                          id="totalpts"
                          maxlength="10"
                          @value-changed="${this.totalScoreChangedEvent}"
                        ></simple-fields-field>
                        /
                        ${this.database.assignments[this.activeAssignment]
                          .points}
                        pts
                        <letter-grade
                          style="margin:-8px 0 0 16px;"
                          total="${this.database.assignments[
                            this.activeAssignment
                          ].points}"
                          score="${this.totalScore}"
                        ></letter-grade>
                      </div>
                    </div>
                  </div>
                </grid-plate>
              `
            : nothing}
        </a11y-tab>
        <a11y-tab
          id="studentreporttab"
          icon="assignment"
          label="${this.t.studentReportView}"
        >
          <div id="studentreport">
            ${!this.loading &&
            this.database.assignments &&
            this.database.assignments[this.activeAssignment]
              ? html`
                  <letter-grade
                    class="student-report-score"
                    show-scale
                    total="${this.database.assignments[this.activeAssignment]
                      .points}"
                    score="${this.totalScore}"
                  ></letter-grade>
                  <h2>Feedback report</h2>
                  <div class="student-report-wrap">
                    <a11y-collapse-group
                      heading-button
                      expanded
                      style="width:80%;"
                    >
                      ${this.database.rubrics
                        .filter((item) => {
                          return (
                            item.shortName ==
                            this.database.assignments[this.activeAssignment]
                              .rubric
                          );
                        })
                        .map(
                          (rubric) => html`
                            <a11y-collapse class="student-feedback-text">
                              <div slot="heading" class="heading">
                                <span style="font-size:20px;"
                                  >${rubric.criteria}</span
                                >
                              </div>
                              <div slot="content">
                                <div class="student-feedback-score-heading">
                                  <div>
                                    ${this.getCriteriaScore(rubric.criteria)} /
                                    ${Math.round(
                                      (rubric.percentage / 100) *
                                        this.database.assignments[
                                          this.activeAssignment
                                        ].points,
                                    )}
                                  </div>
                                  <h3>Criteria details</h3>
                                </div>
                                <p>${rubric.description}</p>
                                <h3>Your feedback</h3>
                                <ul>
                                  ${rubric.qualitative.map(
                                    (cat) => html`
                                      <h4>${cat}</h4>
                                      <ul>
                                        ${this.activeGrading[rubric.criteria]
                                          ? html`${this.activeGrading[
                                              rubric.criteria
                                            ][cat].map(
                                              (tag) =>
                                                html` <li>
                                                  <span>${tag.term}</span
                                                  >${tag.description
                                                    ? html` - ${tag.description}`
                                                    : ``}
                                                  ${tag.associatedMaterial
                                                    ? html`
                                                        <ul>
                                                          ${tag.associatedMaterial.map(
                                                            (material) => html`
                                                              <li>
                                                                <a
                                                                  href="${material}"
                                                                  target="_blank"
                                                                  rel="noopener noreferrer"
                                                                  >${material}</a
                                                                >
                                                              </li>
                                                            `,
                                                          )}
                                                        </ul>
                                                      `
                                                    : ``}
                                                </li>`,
                                            )}`
                                          : ``}
                                      </ul>
                                    `,
                                  )}
                                </ul>
                                <h3>Additional Criteria feedback</h3>
                                <p>
                                  ${this.getCriteriaFeedback(rubric.criteria)}
                                </p>
                              </div>
                            </a11y-collapse>
                          `,
                        )}
                      <a11y-collapse class="student-feedback-text">
                        <div slot="heading" class="heading">
                          <span style="font-size:20px;"
                            >${this.t.overallFeedback}</span
                          >
                        </div>
                        <div slot="content">
                          <p>${this.getCriteriaFeedback("overall")}</p>
                          <h2>Your total Score</h2>
                          <div class="score-display">
                            ${this.totalScore} /
                            ${this.database.assignments[this.activeAssignment]
                              .points}
                            pts
                          </div>
                        </div>
                      </a11y-collapse>
                    </a11y-collapse-group>
                  </div>
                `
              : nothing}
          </div>
        </a11y-tab>
      </a11y-tabs>
    `;
  }
  inputfilterChanged(e) {
    if (e.detail.value !== "") {
      this.expandAll();
    }
    this.like = e.target.value;
  }
  expandAll(e) {
    this.shadowRoot
      .querySelectorAll("#categoriesgroup a11y-collapse")
      .forEach((item) => {
        item.expanded = true;
      });
  }
  collapseAll(e) {
    this.shadowRoot
      .querySelectorAll("#categoriesgroup a11y-collapse")
      .forEach((item) => {
        item.expanded = false;
      });
  }
  selectSource(e) {
    this.source = this.shadowRoot.querySelector("#source").value;
  }
  loadFromSource(e) {
    this.source = this.shadowRoot.querySelector("#source").value;
    if (this.source === "json") {
      this.sourceData = this.shadowRoot.querySelector("#sourcedatablob").value;
    } else if (this.source == "filesystem") {
      this.loadFromFilesystem();
    } else {
      this.sourceData = this.shadowRoot.querySelector("#sourcedata").value;
    }
  }
  loadFromExistingSource(e) {
    this.source = this.shadowRoot.querySelector("#source").value;
    this.loadFromFilesystem(true);
  }
  loadFromFilesystem(existing = false) {
    // implies they already selected a file and want to use that again
    if (existing) {
      this.loading = true;
      setTimeout(() => {
        XLSXFileSystemBrokerSingleton.processFile(
          this.prevLocalFileReference,
          "json",
        );
        this.sourceData = this.prevLocalFileReference;
      }, 0);
    } else {
      XLSXFileSystemBrokerSingleton.loadFile("xls").then(async (file) => {
        this.loading = true;
        // store reference so we can add a button for recent
        await set("grade-book-prev-file", file);
        setTimeout(() => {
          XLSXFileSystemBrokerSingleton.processFile(file, "json");
          this.sourceData = file;
        }, 0);
      });
    }
  }
  async saveToFilesystem(e) {
    // return as Blob based output
    // @todo undo the table transform on import so that we can have it as an array
    // form that they want in xlsx files
    // ensure we save the header row into the output based on correct key names
    // this means we'll ahve to undo the process functions as well.
    // MAY want to consider redoing how we look info up so that we don't transform it
    // into complex objects and instead use complex arrays (maybe)
    const output = XLSXFileSystemBrokerSingleton.workbookFromJSON(
      this.database,
    );
    // treat as a Blob and then convert to a FileReader object
    const blob = new Blob([output], { type: "application/octet-stream" });
    const file = new FileReader();
    file.readAsDataURL(blob);
    // save to file format in question!
    await XLSXFileSystemBrokerSingleton.saveFile("xlsx", output);
  }
  /**
   * Listen for value change coming from the fields in the active rubric
   * and update the overall point total to match
   */
  rubricCriteriaPointsChange(e) {
    // detect score field change
    if (e.detail.getAttribute("data-rubric-score") != null) {
      clearTimeout(this.__debounce);
      this.__debounce = setTimeout(async () => {
        if (!this.loading) {
          // @todo we need to store and recall these values
          this.updateTotalScore();
          this.shadowRoot.querySelector("#totalpts").value = this.totalScore;
        }
        // force locking the score if this changes as we're using the rubric
        // to modify things
        this.scoreLock = true;
      }, 0);
    }
  }
  updateTotalScore() {
    let score = 0;
    let tables = this.shadowRoot.querySelectorAll(
      "#assessment simple-fields-field[type='number']:not(#totalpts)",
    );
    // add the scores up based on values of the pieces
    for (var i in Array.from(tables)) {
      if (tables[i].value) {
        score = score + parseInt(tables[i].value);
      }
    }
    this.totalScore = score;
    this.shadowRoot.querySelector("#totalpts").value = score;
    this.requestUpdate();
  }
  totalScoreChangedEvent(e) {
    if (this.ready) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
      this.totalScore = e.detail.value;
      this.database.grades[this.activeStudent][
        this.database.assignments[this.activeAssignment].shortName
      ] = this.totalScore;
      this.activeStudentSubmissions = [];
      this.activeStudentSubmissions = [
        ...this.getStudentSubmissions(this.activeStudent),
      ];
      this.requestUpdate();
    }
  }
  /**
   * lock toggle
   */
  toggleLock(e) {
    this.scoreLock = !this.scoreLock;
  }
  /**
   * update student report when that tab is activated
   */
  updateStudentReport() {
    // force a repaint of the calculated values from the Assessment view
    this.requestUpdate();
  }
  /**
   * Return the criteria score, current value
   */
  getCriteriaScore(criteria) {
    let tables = this.shadowRoot.querySelectorAll(
      "#assessment editable-table-display",
    );
    // add the scores up based on values of the pieces
    for (var i in Array.from(tables)) {
      if (
        tables[i].shadowRoot.querySelector(
          `[data-rubric-score][data-criteria="${criteria}"]`,
        )
      ) {
        return tables[i].shadowRoot.querySelector(
          `[data-rubric-score][data-criteria="${criteria}"]`,
        ).value;
      }
    }
    return 0;
  }
  /**
   * Return the criteria written feedback, current value
   */
  getCriteriaFeedback(criteria) {
    if (
      this.shadowRoot.querySelector(
        `#assessment [data-rubric-written][data-criteria="${criteria}"]`,
      )
    ) {
      return this.shadowRoot.querySelector(
        `#assessment [data-rubric-written][data-criteria="${criteria}"]`,
      ).value;
    }
    return "";
  }
  /**
   * A qualitative feedback field got a new value
   */
  qualitativeFeedbackUpdate(e) {
    // group grade report by criteria, then qualitative label, THEN the list of tags used
    if (!this.activeGrading[e.detail.getAttribute("data-criteria")]) {
      this.activeGrading[e.detail.getAttribute("data-criteria")] = {};
    }
    this.activeGrading[e.detail.getAttribute("data-criteria")][e.detail.label] =
      e.detail.tagList;
    this.requestUpdate();
  }
  // @todo add support for keyboard based assignment of tag to criteria
  keyDown(e) {
    if (e.key === "Enter") {
    }
  }
  // get color based on index in the object "colors" from SimpleColors
  // this allows us to use an index in a common way and obtain a color
  // so that our tags have a color association per category
  pickColor(val) {
    let colors = Object.keys(this.colors);
    while (val > colors.length) {
      val = val - colors.length;
    }
    return colors[val];
  }
  // ensure when we drop a tag onto the UI that it removes all the outlines
  // of fields that can have items dropped into them
  _handleDragDrop(e) {
    globalThis.dispatchEvent(
      new CustomEvent("simple-tag-drop", {
        detail: {
          value: "drop",
        },
      }),
    );
  }
  // set the drag transfer data
  setDragTransfer(e) {
    globalThis.dispatchEvent(
      new CustomEvent("simple-tag-dragstart", {
        detail: {
          value: e.target,
        },
      }),
    );
    let data = e.target.data;
    // have to add in color
    data.color = e.target.accentColor;
    e.dataTransfer.setData("text", JSON.stringify(data));
  }
  static get tag() {
    return "grade-book-lite";
  }
}
globalThis.customElements.define(GradeBookLite.tag, GradeBookLite);
export { GradeBookLite };
globalThis.GradeBook = globalThis.GradeBook || {};
globalThis.GradeBook.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!globalThis.GradeBook.instance) {
    if (globalThis.document.querySelector("grade-book")) {
      globalThis.GradeBook.instance =
        globalThis.document.querySelector("grade-book");
    } else {
      globalThis.GradeBook.instance =
        globalThis.document.createElement("grade-book");
      globalThis.document.body.appendChild(globalThis.GradeBook.instance);
    }
  }
  return globalThis.GradeBook.instance;
};
