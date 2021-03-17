/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
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
      gradeScale: 980501320,
      grades: 2130903440,
      gradesDetails: 644559151,
      settings: 1413275461,
    };
    // what is tapped to get data
    this.activeSheetPage = "tags";
    // @todo swap this for a database value
    this.currentOverallScore = 0;
    // active ID in the array of the student being reviewed
    this.activeStudent = 0;
    // active ID in the array of the assignment being reviewed
    this.activeAssignment = 0;
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
      rubrics: [],
      assignments: [],
      roster: [],
      grades: {},
      gradesDetails: {},
      gradeScale: [],
      settings: {},
    };
    // general state
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
    this.addEventListener("drop", this._handleDragDrop);
  }

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
      if (["activeAssignment", "database", "loading"].includes(propName)) {
        this.activeRubric = this.getActiveRubric();
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
        }, 100);
      }
      if (propName == "sheet" && this[propName]) {
        this.source = `https://docs.google.com/spreadsheets/d/e/${this[propName]}/pub?output=csv`;
      }
    });
  }
  /**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
   */
  CSVtoArray(text) {
    let p = "",
      row = [""],
      ret = [row],
      i = 0,
      r = 0,
      s = !0,
      l;
    for (l in text) {
      l = text[l];
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if ("," === l && s) l = row[++i] = "";
      else if ("\n" === l && s) {
        if ("\r" === p) row[i] = row[i].slice(0, -1);
        row = ret[++r] = [(l = "")];
        i = 0;
      } else row[i] += l;
      p = l;
    }
    return ret;
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
    let table = this.CSVtoArray(text);
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
      activeStudent: { type: Number, attribute: "active-student" },
      activeAssignment: { type: Number, attribute: "active-assignment" },
      activeRubric: { type: Object },
      currentOverallScore: { type: Number },
      activeGrading: { type: Object },
      loading: { type: Boolean },
      sheet: { type: String },
      source: { type: String },
      database: { type: Object },
      disabled: { type: Boolean, reflect: true },
      debug: { type: Boolean },
    };
  }
  changeStudent(e) {
    if (e.target.value == "prev") {
      this.activeStudent--;
    } else if (e.target.value == "next") {
      this.activeStudent++;
    }
  }
  changeAssignment(e) {
    if (e.target.value == "prev") {
      this.activeAssignment--;
    } else if (e.target.value == "next") {
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
          --grid-plate-col-transition: none;
          --grid-plate-item-margin: 8px;
          --grid-plate-item-padding: 8px;
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
        .mini-map {
          float: right;
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
          padding: 8px;
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
        .tag-group {
          position: sticky;
          top: 0;
        }
      `,
    ];
  }
  render() {
    return html`
      <loading-indicator ?loading="${this.loading}"></loading-indicator>
      <grid-plate layout="3-1">
        <a11y-tabs full-width slot="col-1">
          <a11y-tab icon="social:person" label="Active student">
            ${this.database.roster[this.activeStudent]
              ? html`
                  <grade-book-student-block
                    .student="${this.database.roster[this.activeStudent]}"
                  ></grade-book-student-block>
                `
              : html`<loading-indicator></loading-indicator>`}
          </a11y-tab>
          <a11y-tab icon="assignment-ind" label="Active Assignment">
            <p>This is where their work would go I guess</p>
          </a11y-tab>
          <a11y-tab icon="assignment" label="Assignment details">
            ${this.database.assignments.length &&
            this.database.assignments[this.activeAssignment]
              ? html`
                  <h3>
                    ${this.database.assignments[this.activeAssignment].name}
                  </h3>
                  <ul>
                    <li>
                      Due
                      date:${this.database.assignments[this.activeAssignment]
                        .dueDate}
                      ${this.database.assignments[this.activeAssignment]
                        .dueTime}
                    </li>
                    <li>
                      Points:${this.database.assignments[this.activeAssignment]
                        .points}
                      ${this.database.assignments[this.activeAssignment]
                        .pointsSystem}
                    </li>
                  </ul>
                `
              : html`<loading-indicator></loading-indicator>`}
          </a11y-tab>
          <a11y-tab icon="list" label="Past assignments">
            <p>This could be used to show past assignments</p>
          </a11y-tab>
        </a11y-tabs>
        <div slot="col-2">
          ${this.database.roster.length && this.database.assignments.length
            ? html`
                <h4>Active assignment controls</h4>
                <div class="mini-map">
                  ${this.database.roster.map(
                    (s, i) => html` <div style="height:5px">
                      ${this.database.assignments.map(
                        (a, h) => html`
                          <div
                            .style="float:left;width:5px;height:5px;background-color:${this
                              .activeStudent === i &&
                            this.activeAssignment === h
                              ? `blue`
                              : `yellow`};"
                          ></div>
                        `
                      )}
                    </div>`
                  )}
                </div>
                <div>
                  <button
                    @click="${this.changeStudent}"
                    value="prev"
                    ?disabled="${0 === this.activeStudent}"
                  >
                    Previous student
                  </button>
                  <button
                    @click="${this.changeStudent}"
                    value="next"
                    ?disabled="${this.database.roster.length - 1 ===
                    this.activeStudent}"
                  >
                    Next student
                  </button>
                </div>
                <div>
                  <button
                    @click="${this.changeAssignment}"
                    value="prev"
                    ?disabled="${0 === this.activeAssignment}"
                  >
                    Previous assignment
                  </button>
                  <button
                    @click="${this.changeAssignment}"
                    value="next"
                    ?disabled="${this.database.assignments.length - 1 ===
                    this.activeAssignment}"
                  >
                    Next Assignment
                  </button>
                </div>
              `
            : html`<loading-indicator></loading-indicator>`}
        </div>
      </grid-plate>
      <grid-plate layout="3-1">
        <div slot="col-1">
          <a11y-tabs full-width>
            <a11y-tab icon="image:style" label="Assessment view">
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
                                <td>
                                  Possible: ${rubric.points}
                                  ${rubric.pointsSystem}
                                </td>
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
                                  <div style="display:flex;line-height:32px;">
                                    <simple-fields-field
                                      type="number"
                                      style="background-color:transparent;width:100px;padding:0 0 30px 0;margin:0;--simple-fields-font-size:40px;--simple-fields-text-align:center;"
                                      min="0"
                                      @value-changed="${this
                                        .rubricCriteriaPointsChange}"
                                      value="${this.database.settings
                                        .defaultScore === "max"
                                        ? rubric.points
                                        : this.database.settings.defaultScore}"
                                      max="${rubric.points}"
                                      maxlength="10"
                                      data-criteria="${rubric.criteria}"
                                    ></simple-fields-field>
                                    <div></div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </editable-table-display>
                        <h4>Additional ${rubric.criteria} feedback</h4>
                        <simple-fields-field
                          type="textarea"
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
                        ></simple-fields-field>
                      </div>
                      <div class="student-feedback-score">
                        <simple-fields-field
                          type="number"
                          min="0"
                          id="totalpts"
                          maxlength="10"
                        ></simple-fields-field>
                        /
                        ${this.database.assignments[this.activeAssignment]
                          .points}
                        ${this.database.assignments[this.activeAssignment]
                          .pointsSystem}
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
                      <a11y-collapse-group heading-button expanded>
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
                                  <h3>Criteria details</h3>
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
                                                (tag) => html` <li>
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
                                    @TODO PUT THE RUBRIC FEEDBACK VALUE HERE
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
                            <p>@TODO PUT THE OVERALL FEEDBACK HERE</p>
                          </div>
                        </a11y-collapse>
                      </a11y-collapse-group>
                    `
                  : html`<loading-indicator></loading-indicator>`}
              </div>
            </a11y-tab>
          </a11y-tabs>
        </div>
        <div slot="col-2">
          ${this.database.tags.categories.length > 0
            ? html`
                <h4>Qualitative Rubric Tags</h4>
                <a11y-collapse-group heading-button class="tag-group">
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
  rubricCriteriaPointsChange(e) {
    clearTimeout(this.__debouce);
    this.__debouce = setTimeout(() => {
      if (!this.loading) {
        this.updateCurrentScore();
        this.shadowRoot.querySelector(
          "#totalpts"
        ).value = this.currentOverallScore;
      }
    }, 10);
  }
  updateCurrentScore() {
    // @todo this needs recalculated
    let criteriaPts = this.shadowRoot.querySelectorAll(
      '.student-feedback-wrap.sub-totals simple-fields-field[type="number"]'
    );
    let score = 0;
    // add the scores up based on values of the pieces
    for (var i in Array.from(criteriaPts)) {
      if (criteriaPts[i].value) {
        score = score + parseInt(criteriaPts[i].value);
      }
    }
    this.currentOverallScore = score;
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
  pickColor(val) {
    let colors = Object.keys(this.colors);
    while (val > colors.length) {
      val = val - colors.length;
    }
    return colors[val];
  }
  _handleDragDrop(e) {
    window.dispatchEvent(
      new CustomEvent("simple-tag-drop", {
        detail: {
          value: "drop",
        },
      })
    );
  }
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
