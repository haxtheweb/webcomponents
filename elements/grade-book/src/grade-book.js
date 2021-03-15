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
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "@lrnwebcomponents/a11y-tabs/lib/a11y-tab.js";
import "@lrnwebcomponents/grid-plate/grid-plate.js";
import "@lrnwebcomponents/iframe-loader/lib/loading-indicator.js";
import "@lrnwebcomponents/editable-table/lib/editable-table-display.js";
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
    };
    // what is tapped to get data
    this.activeSheetPage = "tags";
    this.activeStudent = 0;
    this.activeAssignment = 0;
    this.gradeReport = {};
    this.database = {
      tags: {
        categories: [],
        data: [],
      },
      rubrics: [],
      assignments: [],
      roster: [{}],
      grades: [],
      gradeScale: [],
    };
    this.disabled = false;
    this.loading = false;
    // translatable text
    this.t = {
      csvURL: "CSV URL",
      debugData: "Debug data",
      criteria: "Criteria",
      description: "Description",
      assessmentWeight: "Assessment Weight",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
      locales: ["es", "fr", "de"],
    });
    this.addEventListener(
      "simple-fields-tag-list-changed",
      this.qualitativeFeedbackUpdate.bind(this)
    );
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // support debugging, only import debugger element if needed
      if (propName == "debug" && this[propName]) {
        import("@lrnwebcomponents/csv-render/csv-render.js");
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

  static get properties() {
    return {
      ...super.properties,
      activeStudent: { type: Number, attribute: "active-student" },
      activeAssignment: { type: Number, attribute: "active-assignment" },
      gradeReport: { type: Object },
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
        grid-plate {
          --grid-plate-col-transition: none;
          --grid-plate-item-margin: 8px;
          --grid-plate-item-padding: 8px;
        }
        a11y-collapse div[slot="heading"] {
          font-size: 14px;
          font-weight: normal;
          cursor: pointer;
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
        .student-feedback-wrap {
          display: flex;
        }
        .student-feedback-wrap a11y-collapse {
          width: 80%;
          margin: 0;
        }
        .student-feedback-wrap a11y-collapse div[slot="heading"] {
          padding: 20px;
        }
        .student-feedback-wrap .student-feedback-score {
          padding: 8px;
        }
        simple-fields-field[type="number"] {
          width: 40px;
          margin: 0 4px;
          display: inline-block;
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
      `,
    ];
  }
  render() {
    return html`
      <loading-indicator ?loading="${this.loading}"></loading-indicator>
      <grid-plate layout="3-1">
        <a11y-tabs full-width slot="col-1">
          <a11y-tab icon="social:person" label="Active student">
            <grade-book-student-block
              .student="${this.database.roster[this.activeStudent]}"
            ></grade-book-student-block>
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
              : ``}
          </a11y-tab>
          <a11y-tab icon="list" label="Past assignments">
            <p>This could be used to show past assignments</p>
          </a11y-tab>
        </a11y-tabs>
        <div slot="col-2">
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
        </div>
      </grid-plate>
      <grid-plate layout="3-1">
        <div slot="col-1">
          <a11y-tabs full-width>
            <a11y-tab icon="image:style" label="Tag view">
              <editable-table-display
                accent-color="${this.accentColor}"
                bordered
                caption="Exercise Rubric"
                column-header
                height="200px"
                condensed
                disable-responsive
                scroll
                striped
              >
                <table>
                  <caption>
                    Exercise Rubric
                  </caption>
                  <tbody>
                    <tr>
                      <td>${this.t.criteria}</td>
                      <td>${this.t.description}</td>
                      <td>${this.t.assessmentWeight}</td>
                    </tr>
                    ${this.database.rubrics
                      .filter((item) => {
                        console.log(
                          this.database.assignments[this.activeAssignment]
                            .rubric
                        );
                        return (
                          item.shortName ==
                          this.database.assignments[this.activeAssignment]
                            .rubric
                        );
                      })
                      .map(
                        (rubric) => html`
                          <tr>
                            <td>${rubric.criteria}</td>
                            <td>${rubric.description}</td>
                            <td>${rubric.points}${rubric.pointsSystem}</td>
                          </tr>
                          <tr>
                            ${rubric.qualitative.map(
                              (cat) => html`
                                <td>
                                  <simple-fields-tag-list
                                    data-criteria="${rubric.criteria}"
                                    label="${cat}"
                                  ></simple-fields-tag-list>
                                </td>
                              `
                            )}
                          </tr>
                        `
                      )}
                  </tbody>
                </table>
              </editable-table-display>
            </a11y-tab>
            <a11y-tab icon="assignment" label="Student report">
              <h2>Student feedback report</h2>
              ${this.database.rubrics
                .filter((item) => {
                  return (
                    item.shortName ==
                    this.database.assignments[this.activeAssignment].rubric
                  );
                })
                .map(
                  (rubric) => html`
                    <div class="student-feedback-wrap">
                      <div class="student-feedback-score">
                        <simple-fields-field
                          type="number"
                          min="0"
                          max="${rubric.points}"
                          maxlength="10"
                        ></simple-fields-field>
                        / ${rubric.points} ${rubric.pointsSystem}
                      </div>
                      <a11y-collapse heading-button>
                        <div slot="heading">${rubric.criteria}</div>
                        <div slot="content">
                          <h3>Criteria description</h3>
                          <p>${rubric.description}</p>
                          <h3>Feedback</h3>
                          <ul>
                            ${rubric.qualitative.map(
                              (cat) => html`
                                <h4>${cat}</h4>
                                <ul>
                                  ${this.gradeReport[rubric.criteria]
                                    ? html`${this.gradeReport[rubric.criteria][
                                        cat
                                      ].map(
                                        (tag) => html` <li>
                                          <strong>${tag.term}</strong
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
                          <h3>Additional feedback</h3>
                          <simple-fields-field
                            type="textarea"
                          ></simple-fields-field>
                        </div>
                      </a11y-collapse>
                    </div>
                  `
                )}
            </a11y-tab>
          </a11y-tabs>
        </div>
        <a11y-collapse-group heading-button slot="col-2">
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
                    <csv-render data-source="${this.source}"></csv-render>
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
      </grid-plate>
    `;
  }
  /**
   * A qualitative feedback field got a new value
   */
  qualitativeFeedbackUpdate(e) {
    // group grade report by criteria, then qualitative label, THEN the list of tags used
    if (!this.gradeReport[e.detail.getAttribute("data-criteria")]) {
      this.gradeReport[e.detail.getAttribute("data-criteria")] = {};
    }
    this.gradeReport[e.detail.getAttribute("data-criteria")][e.detail.label] =
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
  setDragTransfer(e) {
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
