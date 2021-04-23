/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import {
  CSVtoArray,
  validURL,
  cleanVideoSource,
} from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-tag-list.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js";
import "@lrnwebcomponents/editable-table/lib/editable-table-display.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "@lrnwebcomponents/a11y-tabs/lib/a11y-tab.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@lrnwebcomponents/iframe-loader/lib/loading-indicator.js";
import "./lib/grade-book-student-block.js";
import "./lib/letter-grade.js";
import "@github/time-elements/dist/time-elements.js";
/**
 * `grade-book`
 * `A headless gradebook that supports multiple backends with rubrics`
 * @demo demo/index.html
 * @element grade-book
 */
class GradeBook extends I18NMixin(SimpleColors) {
  constructor() {
    super();
    // gid from the google sheet. technically if you add / remove sheets this would
    // have to be updated to match
    this.sheetGids = {
      tags: 0,
      roster: 118800528,
      assignments: 540222065,
      rubrics: 1744429439,
      submissions: 2104732668,
      gradeScale: 980501320,
      grades: 2130903440,
      gradesDetails: 644559151,
      settings: 1413275461,
    };
    // what is tapped to get data
    this.activeSheetPage = "tags";
    // storing internals of the assessmentView tab
    this.assessmentView = this.resetAssessmentView();
    this.totalScore = 0;
    // active ID in the array of the student being reviewed
    this.activeStudent = 0;
    // active ID in the array of the assignment being reviewed
    this.activeAssignment = 0;
    // active Submission is the data itself
    this.activeSubmission = null;
    // student submission status for rendering
    this.activeStudentSubmissions = [];
    // lock on score override
    this.scoreLock = true;
    // active rubric data
    this.activeRubric = [];
    // the active grade sheet
    this.activeGrading = {};
    // internal data structure of the "app". This is bridging all data from the
    // backend sheets and then informing how our application works
    this.database = {
      tags: {
        categories: [],
        data: [],
      },
      submissions: [],
      rubrics: [],
      assignments: [],
      roster: [],
      grades: {},
      gradesDetails: {},
      gradeScale: [],
      settings: {},
    };
    // general state
    this.hideGradeScale = true;
    this.disabled = false;
    // shows progress indicator as it loads
    this.loading = true;
    // translatable text
    this.t = {
      csvURL: "CSV URL",
      debugData: "Debug data",
      points: "Points",
      criteria: "Criteria",
      description: "Description",
      assessmentWeight: "Assessment Weight",
      overallFeedback: "Overall feedback",
      letterGrade: "Letter grade",
      highRange: "High range",
      lowRange: "Low range",
      noSubmission: "No submission found",
      studentSubmission: "Student submission",
      openInNewWindow: "Open in new window",
      gradingScale: "Grading Scale",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
      locales: ["es", "fr", "de"],
    });
    // notice that a category on the active grading area responded that it changed
    this.addEventListener(
      "simple-fields-tag-list-changed",
      this.qualitativeFeedbackUpdate.bind(this)
    );
    // value change within the rubric area
    this.addEventListener("value-changed", this.rubricCriteriaPointsChange);
    // drop event to remove the styling from droppable areas
    this.addEventListener("drop", this._handleDragDrop.bind(this));
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
  // return the active submission based on student and assignment
  getActiveSubmission() {
    for (var i in this.database.submissions) {
      let row = this.database.submissions[i];
      // look for student AND that the assignment column name is there
      if (
        row.student === this.database.roster[this.activeStudent].student &&
        row[this.database.assignments[this.activeAssignment].shortName]
      ) {
        return row[this.database.assignments[this.activeAssignment].shortName];
      }
    }
    return null;
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
      // support debugging, only import debugger element if needed
      if (propName == "debug" && this[propName]) {
        import("@lrnwebcomponents/csv-render/csv-render.js");
      }
      // set rubric based on assignment
      if (
        ["activeAssignment", "activeStudent", "database", "loading"].includes(
          propName
        )
      ) {
        this.activeSubmission = this.getActiveSubmission();
        this.assessmentView = this.resetAssessmentView();
        this.activeRubric = this.getActiveRubric();
        this.activeStudentSubmissions = [];
        this.activeStudentSubmissions = [
          ...this.getStudentSubmissions(this.activeStudent),
        ];
        // ensure we maintain visibility of the active student / assignment
        // in our mini-map; delay to ensure paints pixel before visibility
        if (
          this.shadowRoot &&
          this.shadowRoot.querySelector(
            ".mini-map div[data-active-assignment-student-pixel]"
          )
        ) {
          setTimeout(() => {
            this.shadowRoot.querySelector(".mini-map").scrollTop =
              this.shadowRoot.querySelector(
                ".mini-map div[data-active-assignment-student-pixel]"
              ).offsetTop -
              120 -
              this.shadowRoot.querySelector(".mini-map").offsetTop;
          }, 100);
        }
      }
      // source will have to fetch ALL the pages and slowly load data as it rolls through
      if (propName == "source" && this[propName]) {
        // minor debounce just in case source changes from input
        clearTimeout(this.__debouce);
        this.__debouce = setTimeout(async () => {
          this.loading = true;
          for (var i in this.sheetGids) {
            this.activeSheetPage = i;
            this.database[this.activeSheetPage] = await this.loadCSVData(
              `${this[propName]}&gid=${this.sheetGids[this.activeSheetPage]}`,
              this.activeSheetPage
            );
            // complex data update that I am sure will not be picked up by LitElement
            // this forces an update
            this.requestUpdate();
          }
          this.loading = false;
          // ensure the letter-grade tags KNOW about the database refresh
          setTimeout(() => {
            if (this.database.gradeScale.length > 0) {
              let lg = this.shadowRoot.querySelectorAll("letter-grade");
              for (var i in Array.from(lg)) {
                lg[i].gradeScale = this.database.gradeScale;
              }
            }
          }, 0);
        }, 100);
      }
      if (propName == "sheet" && this[propName]) {
        this.source = `https://docs.google.com/spreadsheets/d/e/${this[propName]}/pub?output=csv`;
      }
    });
  }
  /**
   * generate appstore query
   */
  async loadCSVData(source, sheet) {
    return await fetch(source, {
      method: this.method,
    })
      .then((response) => {
        if (response.ok) return response.text();
      })
      .then((text) => {
        return this.handleResponse(text, sheet);
      });
  }
  /**
   * Convert from csv text to an array in the table function
   */
  async handleResponse(text, sheet) {
    // Set helps performantly assemble possible collapsed areas
    let table = CSVtoArray(text);
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
    return typeof this[`process${sheet}Data`] === "function"
      ? this[`process${sheet}Data`](table, headings, data)
      : data;
  }
  /**
   * process assignment data to normalize date string
   */
  processassignmentsData(table, headings, data) {
    for (var i in data) {
      const event = new Date(`${data[i].dueDate} ${data[i].dueTime}`);
      data[i]._ISODueDate = event.toISOString();
    }
    return data;
  }
  /**
   * Process our tagging structure for use in the rubric
   * Tag structure allows the instructor to drag and drop elements into
   * qualitative areas of a rubric
   */
  processtagsData(table, headings, data) {
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
  processrubricsData(table, headings, data) {
    for (var i in data) {
      data[i].qualitative = data[i].qualitative
        ? data[i].qualitative.split(",")
        : [];
    }
    return data;
  }
  processrosterData(table, headings, data) {
    for (var i in data) {
      data[i].interests = data[i].interests ? data[i].interests.split(",") : [];
    }
    return data;
  }
  processsettingsData(table, headings, data) {
    let d = {};
    for (var i in data) {
      d[data[i].key] = data[i].value;
    }
    return d;
  }

  static get properties() {
    return {
      ...super.properties,
      hideGradeScale: { type: Boolean },
      disabled: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      activeStudent: { type: Number, attribute: "active-student" },
      activeAssignment: { type: Number, attribute: "active-assignment" },
      totalScore: { type: Number },
      scoreLock: { type: Boolean },
      debug: { type: Boolean },
      sheet: { type: String },
      source: { type: String },
      activeSubmission: { type: String, attribute: false },
      database: { type: Object, attribute: false },
      activeRubric: { type: Object, attribute: false },
      assessmentView: { type: Object, attribute: false },
      activeGrading: { type: Object, attribute: false },
      activeStudentSubmissions: { type: Array },
    };
  }
  changeStudent(e) {
    if (e.target.value == "prev" && 0 !== this.activeStudent) {
      this.activeStudent--;
    } else if (
      e.target.value == "next" &&
      this.database.roster.length - 1 !== this.activeStudent
    ) {
      this.activeStudent++;
    }
    this.requestUpdate();
  }
  changeAssignment(e) {
    if (e.target.value == "prev" && 0 !== this.activeAssignment) {
      this.activeAssignment--;
    } else if (
      e.target.value == "next" &&
      this.database.assignments.length - 1 !== this.activeAssignment
    ) {
      this.activeAssignment++;
    }
    this.requestUpdate();
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
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
        grid-plate {
          --hax-layout-container-transition: none;
          --grid-plate-col-transition: none;
          --grid-plate-item-margin: 8px;
          --grid-plate-item-padding: 8px;
        }
        a11y-tabs {
          --a11y-tabs-border-color: var(
            --simple-colors-default-theme-accent-10,
            black
          );
        }
        a11y-collapse {
          --a11y-collapse-border-color: var(
            --simple-colors-default-theme-accent-10,
            black
          );
        }
        a11y-collapse:not([expanded]):hover {
          background-color: var(--simple-colors-default-theme-accent-1, grey);
        }
        a11y-collapse div[slot="heading"] {
          font-size: 16px;
          font-weight: normal;
          cursor: pointer;
          line-height: 34px;
          display: flex;
        }
        a11y-collapse[expanded] div[slot="heading"] {
          font-weight: bold;
        }
        .active-student-grade-history {
          display: flex;
          width: 100%;
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
          background-color: yellow;
        }
        .active-student-grade-history button:focus,
        .active-student-grade-history button:active,
        .active-student-grade-history button:hover {
          opacity: 1;
          outline: 1px solid black;
          outline-offset: 2px;
        }
        simple-fields-tag-list.drag-focus {
          background-color: #dddddd;
        }
        simple-colors[accent-color] {
          display: inline-flex;
          width: 24px;
          height: 24px;
          margin: 4px 6px 0px 0px;
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
          padding: 0px;
        }

        #totalpts {
          width: 84px;
          margin: 0px 12px;
        }
        .mini-map {
          max-height: 150px;
          max-width: 150px;
          overflow: auto;
        }
        .mini-map div[data-pixel-row] {
          height: 5px;
        }
        .mini-map div[data-pixel-col] {
          background-color: yellow;
          float: left;
          width: 5px;
          height: 5px;
        }
        .mini-map div[data-active-assignment-student-pixel] {
          background-color: blue;
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
      `,
    ];
  }
  // render submission; guessing game really :)
  renderSubmission(data) {
    let pre = html`<h3>${this.t.studentSubmission}</h3>`;
    // test if this smells like a URL
    if (validURL(data)) {
      pre = html`${pre}<a
          href="${data}"
          target="_blank"
          rel="noopener noreferrer"
          ><simple-icon-button-lite
            label="${this.t.openInNewWindow}"
            icon="open-in-new"
          ></simple-icon-button-lite
        ></a>`;
      // see if this is a video we know about
      if (data != cleanVideoSource(data)) {
        // implies it was able to clean it up in some way
        import("@lrnwebcomponents/video-player/video-player.js");
        return html`${pre}<video-player
            class="active-submission"
            source="${data}"
            width="60%"
          ></video-player>`;
      } else {
        return html`${pre}
          <div class="active-submission">
            <iframe
              src="${data}"
              loading="lazy"
              width="100%"
              height="100%"
            ></iframe>
          </div>`;
      }
    } else {
      // see if we can just present this as data
      import("@lrnwebcomponents/md-block/md-block.js");
      return html`${pre}
        <div class="active-submission">
          <md-block .markdown="${data}"></md-block>
        </div>`;
    }
  }
  studentLetterGradeHistoryClick(e) {
    // ensure this is numeric
    this.activeAssignment = parseInt(e.target.value);
    this.requestUpdate();
  }
  toggleGradeScale(e) {
    import("@lrnwebcomponents/simple-popover/simple-popover.js");
    this.hideGradeScale = !this.hideGradeScale;
  }
  /**
   * LitElement render method
   */
  render() {
    return html`
      <grid-plate layout="1-1-1">
        <div slot="col-1">
          <simple-icon-button-lite
            @click="${this.changeStudent}"
            value="prev"
            ?disabled="${0 === this.activeStudent}"
            icon="arrow-back"
          >
            Previous student
          </simple-icon-button-lite>
          <simple-icon-button-lite
            @click="${this.changeStudent}"
            value="next"
            icon="arrow-forward"
            ?disabled="${this.database.roster.length - 1 ===
            this.activeStudent}"
          >
            Next student
          </simple-icon-button-lite>
        </div>
        <div slot="col-2">
          <simple-icon-button-lite
            @click="${this.changeAssignment}"
            value="prev"
            icon="arrow-back"
            ?disabled="${0 === this.activeAssignment}"
          >
            Previous assignment
          </simple-icon-button-lite>
          <simple-icon-button-lite
            @click="${this.changeAssignment}"
            value="next"
            ?disabled="${this.database.assignments.length - 1 ===
            this.activeAssignment}"
            icon="arrow-forward"
          >
            Next Assignment
          </simple-icon-button-lite>
          <simple-icon-button-lite
            icon="list"
            @click="${this.toggleGradeScale}"
            id="gradescalebtn"
          >
            ${this.t.gradingScale}
          </simple-icon-button-lite>
          <simple-popover
            ?hidden="${this.hideGradeScale}"
            for="gradescalebtn"
            auto
          >
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
                    <td>${this.t.letterGrade}</td>
                    <td>${this.t.highRange}</td>
                    <td>${this.t.lowRange}</td>
                  </tr>
                  ${this.database.gradeScale.map(
                    (scale) => html`
                      <tr>
                        <td>${scale.letter}</td>
                        <td>${scale.highRange}</td>
                        <td>${scale.lowRange}</td>
                      </tr>
                    `
                  )}
                </tbody>
              </table>
            </editable-table-display>
          </simple-popover>
        </div>
        <loading-indicator
          ?loading="${this.loading}"
          slot="col-3"
        ></loading-indicator>
      </grid-plate>
      <a11y-tabs full-width>
        <a11y-tab icon="social:person" label="Active student">
          <grid-plate layout="3-1">
            <div slot="col-1">
              ${this.database.roster[this.activeStudent] &&
              this.database.grades[this.activeStudent]
                ? html`
                    <grade-book-student-block
                      .student="${this.database.roster[this.activeStudent]}"
                    ></grade-book-student-block>
                    <div class="active-student-grade-history">
                      ${this.activeStudentSubmissions.map(
                        (sRecord) => html`
                          <button
                            .value="${sRecord.assignmentIndex}"
                            @click="${this.studentLetterGradeHistoryClick}"
                            class="${this.activeAssignment ===
                            sRecord.assignmentIndex
                              ? `activeAssignment`
                              : ``}"
                          >
                            <letter-grade
                              mini
                              label="${sRecord.assignmentName}"
                              .total="${sRecord.assignmentPoints}"
                              .score="${sRecord.studentScore}"
                              .value="${sRecord.assignmentIndex}"
                            >
                            </letter-grade>
                          </button>
                        `
                      )}
                    </div>
                  `
                : html`<loading-indicator></loading-indicator>`}
            </div>
            <div slot="col-2">
              ${this.database.roster.length && this.database.assignments.length
                ? html`
                    <h4>Active submission map</h4>
                    <div class="mini-map">
                      ${this.database.roster.map(
                        (s, i) => html` <div data-pixel-row>
                          ${this.database.assignments.map(
                            (a, h) => html`
                              <div
                                data-pixel-col
                                ?data-active-assignment-student-pixel="${this
                                  .activeStudent === i &&
                                this.activeAssignment === h}"
                              ></div>
                            `
                          )}
                        </div>`
                      )}
                    </div>
                  `
                : html`<loading-indicator></loading-indicator>`}
            </div>
          </grid-plate>
        </a11y-tab>
        <a11y-tab icon="assignment-ind" label="Active Assessment">
          ${this.database.assignments.length &&
          this.database.assignments[this.activeAssignment]
            ? html`
                <h3>
                  ${this.database.assignments[this.activeAssignment].name}
                </h3>
                <ul>
                  <li>
                    Due date:
                    <local-time
                      datetime="${this.database.assignments[
                        this.activeAssignment
                      ]._ISODueDate}"
                      month="short"
                      day="numeric"
                      year="numeric"
                      hour="numeric"
                      minute="numeric"
                      time-zone-name="short"
                    >
                    </local-time>
                  </li>
                  <li>
                    Date submitted:
                    ${Math.floor(
                      this.database.assignments[this.activeAssignment]
                        ._ISODueDate - new Date("2021-03-01T10:20:08")
                    ) / 60e3}
                    minutes ago
                  </li>
                </ul>
                <div>
                  ${this.activeSubmission
                    ? this.renderSubmission(this.activeSubmission)
                    : html`${this.t.noSubmission}`}
                </div>
              `
            : html`<loading-indicator></loading-indicator>`}
        </a11y-tab>
      </a11y-tabs>
      <grid-plate layout="3-1">
        <div slot="col-1">
          <a11y-tabs
            full-width
            @a11y-tabs-active-changed="${this.updateStudentReport}"
          >
            <a11y-tab
              icon="image:style"
              label="Assessment view"
              id="assessmentview"
            >
              ${this.activeRubric[0]
                ? html`
                    <h3>${this.activeRubric[0].name}</h3>
                    ${this.activeRubric.map(
                      (rubric) => html`
                        <h4>${rubric.criteria}</h4>
                        <p>${rubric.description}</p>
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
                                  (cat) => html` <td>${cat}</td> `
                                )}
                                <td>${rubric.percentage} %</td>
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
                                  `
                                )}
                                <td>
                                  <simple-fields-field
                                    type="number"
                                    part="simple-fields-field"
                                    min="0"
                                    value="${this.database.settings
                                      .defaultScore === "max"
                                      ? Math.round(
                                          (rubric.percentage / 100) *
                                            this.database.assignments[
                                              this.activeAssignment
                                            ].points
                                        )
                                      : this.database.settings.defaultScore}"
                                    max="${Math.round(
                                      (rubric.percentage / 100) *
                                        this.database.assignments[
                                          this.activeAssignment
                                        ].points
                                    )}"
                                    maxlength="10"
                                    data-rubric-score
                                    data-criteria="${rubric.criteria}"
                                  ></simple-fields-field>
                                </td>
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
                      `
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
                  `
                : html`<loading-indicator></loading-indicator>`}
            </a11y-tab>
            <a11y-tab icon="assignment" label="Student report">
              <div>
                ${!this.loading
                  ? html`
                      <h2>Student feedback report</h2>
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
                                    ${rubric.criteria}
                                  </div>
                                  <div slot="content">
                                    <div class="student-feedback-score-heading">
                                      <div>
                                        ${this.getCriteriaScore(
                                          rubric.criteria
                                        )}
                                        /
                                        ${Math.round(
                                          (rubric.percentage / 100) *
                                            this.database.assignments[
                                              this.activeAssignment
                                            ].points
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
                                            ${this.activeGrading[
                                              rubric.criteria
                                            ]
                                              ? html`${this.activeGrading[
                                                  rubric.criteria
                                                ][cat].map(
                                                  (tag) => html` <li>
                                                    <span>${tag.term}</span
                                                    >${tag.description
                                                      ? html` -
                                                        ${tag.description}`
                                                      : ``}
                                                    ${tag.associatedMaterial
                                                      ? html`
                                                          <ul>
                                                            ${tag.associatedMaterial.map(
                                                              (
                                                                material
                                                              ) => html`
                                                                <li>
                                                                  <a
                                                                    href="${material}"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    >${material}</a
                                                                  >
                                                                </li>
                                                              `
                                                            )}
                                                          </ul>
                                                        `
                                                      : ``}
                                                  </li>`
                                                )}`
                                              : ``}
                                          </ul>
                                        `
                                      )}
                                    </ul>
                                    <h3>Additional Criteria feedback</h3>
                                    <p>
                                      ${this.getCriteriaFeedback(
                                        rubric.criteria
                                      )}
                                    </p>
                                  </div>
                                </a11y-collapse>
                              `
                            )}
                          <a11y-collapse class="student-feedback-text">
                            <div slot="heading" class="heading">
                              ${this.t.overallFeedback}
                            </div>
                            <div slot="content">
                              <p>${this.getCriteriaFeedback("overall")}</p>
                              <h3>Your total Score</h3>
                              <div class="score-display">
                                ${this.totalScore} /
                                ${this.database.assignments[
                                  this.activeAssignment
                                ].points}
                                pts
                              </div>
                            </div>
                          </a11y-collapse>
                        </a11y-collapse-group>
                        <letter-grade
                          class="student-report-score"
                          show-scale
                          total="${this.database.assignments[
                            this.activeAssignment
                          ].points}"
                          score="${this.totalScore}"
                        ></letter-grade>
                      </div>
                    `
                  : html`<loading-indicator></loading-indicator>`}
              </div>
            </a11y-tab>
          </a11y-tabs>
        </div>
        <div slot="col-2" class="tag-group">
          ${this.database.tags.categories.length > 0
            ? html`
                <h4>Qualitative Rubric Tags</h4>
                <a11y-collapse-group heading-button>
                  ${this.debug
                    ? html`
                        <a11y-collapse>
                          <div slot="heading">${this.t.debugData}</div>
                          <div slot="content">
                            <simple-fields-field
                              ?disabled="${this.disabled}"
                              .value="${this.source}"
                              @value-changed="${this.sourceUpdate}"
                              type="text"
                              label="${this.t.csvURL}"
                              required
                            ></simple-fields-field>
                            <csv-render
                              data-source="${this.source}"
                            ></csv-render>
                          </div>
                        </a11y-collapse>
                      `
                    : ``}
                  ${this.database.tags.categories.map(
                    (category, i) => html`
                      <a11y-collapse>
                        <div slot="heading">
                          <simple-colors accent-color="${this.pickColor(i)}"
                            ><span></span></simple-colors
                          >${category}
                        </div>
                        <div slot="content">
                          ${this.database.tags.data
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
                                ></simple-tag>`
                            )}
                        </div>
                      </a11y-collapse>
                    `
                  )}
                </a11y-collapse-group>
              `
            : html`<loading-indicator></loading-indicator>`}
        </div>
      </grid-plate>
    `;
  }
  /**
   * Listen for value change coming from the fields in the active rubric
   * and update the overall point total to match
   */
  rubricCriteriaPointsChange(e) {
    // detect score field change
    if (e.detail.getAttribute("data-rubric-score") != null) {
      clearTimeout(this.__debouce);
      this.__debouce = setTimeout(() => {
        if (!this.loading) {
          // @todo we need to store and recall these values
          this.updateTotalScore();
          // this will defer to whatever the "grades" db value is
          this.totalScore = this.getCurrentScore(
            this.activeStudent,
            this.activeAssignment
          );
          this.shadowRoot.querySelector("#totalpts").value = this.totalScore;
        }
        // force locking the score if this changes as we're using the rubric
        // to modify things
        this.scoreLock = true;
      }, 10);
    }
  }
  updateTotalScore() {
    let score = 0;
    let tables = this.shadowRoot.querySelectorAll(
      "#assessmentview editable-table-display"
    );
    // add the scores up based on values of the pieces
    for (var i in Array.from(tables)) {
      if (tables[i].shadowRoot.querySelector("[data-rubric-score]").value) {
        score =
          score +
          parseInt(
            tables[i].shadowRoot.querySelector("simple-fields-field").value
          );
      }
    }
    this.totalScore = score;
    this.requestUpdate();
  }
  totalScoreChangedEvent(e) {
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
      "#assessmentview editable-table-display"
    );
    // add the scores up based on values of the pieces
    for (var i in Array.from(tables)) {
      if (
        tables[i].shadowRoot.querySelector(
          `[data-rubric-score][data-criteria="${criteria}"]`
        )
      ) {
        return tables[i].shadowRoot.querySelector(
          `[data-rubric-score][data-criteria="${criteria}"]`
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
        `#assessmentview [data-rubric-written][data-criteria="${criteria}"]`
      )
    ) {
      return this.shadowRoot.querySelector(
        `#assessmentview [data-rubric-written][data-criteria="${criteria}"]`
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
    window.dispatchEvent(
      new CustomEvent("simple-tag-drop", {
        detail: {
          value: "drop",
        },
      })
    );
  }
  // set the drag transfer data
  setDragTransfer(e) {
    window.dispatchEvent(
      new CustomEvent("simple-tag-dragstart", {
        detail: {
          value: e.target,
        },
      })
    );
    let data = e.target.data;
    // have to add in color
    data.color = e.target.accentColor;
    e.dataTransfer.setData("text", JSON.stringify(data));
  }
  sourceUpdate(e) {
    this.source = e.detail.value;
  }
  static get tag() {
    return "grade-book";
  }
}
customElements.define(GradeBook.tag, GradeBook);
export { GradeBook };
