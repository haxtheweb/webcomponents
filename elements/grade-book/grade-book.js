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
      rubics: 1744429439,
      assignments: 540222065,
      roster: 118800528,
      grades: 2130903440,
      gradeScale: 980501320,
    };
    // what is tapped to get data
    this.activeSheetPage = "tags";
    // make sure this pulls from the backend
    this.rubricCategories = [
      {
        title: "Good",
      },
      {
        title: "Areas for improvement",
      },
      {
        title: "Considerations and oppurtunities",
      },
    ];
    this.database = {
      tags: {
        headings: [],
        categories: [],
        data: [],
      },
      rubics: [],
      assignments: [],
      roster: [],
      grades: [],
      gradeScale: [],
    };
    this.disabled = false;
    this.loading = false;
    // translatable text
    this.t = {
      csvURL: "CSV URL",
      debugData: "Debug data",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
      locales: ["es", "fr", "de"],
    });
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
    for (var i in tmp) {
      headings[tmp[i]] = i;
    }
    return this[`process${sheet}Data`](table, headings);
  }
  /**
   * Process our tagging structure for use in the rubric
   * Tag structure allows the instructor to drag and drop elements into
   * qualitative areas of a rubric
   */
  processtagsData(table, headings) {
    let categories = new Set([]);
    let rCategories = [];
    let tagsData = [];
    // these must all exist as keys for us to proceed
    if (
      headings.term &&
      headings.category &&
      headings.description &&
      headings.associatedMaterial
    ) {
      for (var i in table) {
        let data = {
          term: table[i][headings.term],
          category: table[i][headings.category]
            ? table[i][headings.category].split(",")
            : [],
          description: table[i][headings.description],
          associatedMaterial: table[i][headings.associatedMaterial]
            ? table[i][headings.associatedMaterial].split(",")
            : [],
        };
        // trick to dedup the categories using a Set
        data.category.forEach((item) => {
          categories.add(item);
        });
        // push data onto the database of all data we have now as objects
        tagsData.push(data);
      }
      // convert Set to Array for data visualization purposes
      rCategories = [...Array.from(categories)];
    } else {
      console.warn(
        "Data requested needs term, category, description, and associatedMaterial as headings"
      );
      console.log(table);
    }
    return {
      categories: rCategories,
      data: tagsData,
    };
  }

  processrubicsData(table, headings) {
    console.log(headings);
    console.log(table);
  }
  processassignmentsData(table, headings) {
    console.log(headings);
    console.log(table);
  }
  processrosterData(table, headings) {
    console.log(headings);
    console.log(table);
  }
  processgradesData(table, headings) {
    console.log(headings);
    console.log(table);
  }
  processgradeScaleData(table, headings) {
    console.log(headings);
    console.log(table);
  }
  static get properties() {
    return {
      ...super.properties,
      loading: { type: Boolean },
      debug: { type: Boolean },
      sheet: { type: String },
      source: { type: String },
      database: { type: Object },
      disabled: { type: Boolean, reflect: true },
    };
  }
  changeStudent(e) {
    if (e.target.value == "prev") {
    } else if (e.target.value == "next") {
    }
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
      `,
    ];
  }
  render() {
    return html`
      <loading-indicator ?loading="${this.loading}"></loading-indicator>
      <grid-plate layout="3-1">
        <a11y-tabs full-width slot="col-1">
          <a11y-tab icon="assignment-ind" label="Active student">
            <grade-book-student-block></grade-book-student-block>
          </a11y-tab>
          <a11y-tab icon="assignment" label="Active Assignment">
            <p>This is where their work would go I guess</p>
          </a11y-tab>
          <a11y-tab icon="list" label="Past assignments">
            <p>This could be used to show past assignments</p>
          </a11y-tab>
        </a11y-tabs>
        <div slot="col-2">
          <button @click="${this.changeStudent}" value="prev">
            Previous student
          </button>
          <button @click="${this.changeStudent}" value="next">
            Next student
          </button>
        </div>
      </grid-plate>
      <grid-plate layout="3-1">
        <div slot="col-1">
          <editable-table-display
            accent-color="${this.accentColor}"
            bordered
            captio="Exercise Rubric"
            column-header
            height="200px"
            row-header
            condensed
            scroll
            striped
          >
            <table>
              <caption>
                Exercise Rubric
              </caption>
              <tbody>
                <tr>
                  <td>Criteria</td>
                  <td>Description</td>
                  <td>Assessment Weight</td>
                </tr>
                <tr>
                  <td>Concept Development</td>
                  <td>Description of whatever here</td>
                  <td>40%</td>
                </tr>
                <tr>
                  ${this.rubricCategories.map(
                    (rubric) => html`
                      <td>
                        <simple-fields-tag-list
                          label="${rubric.title}"
                        ></simple-fields-tag-list>
                      </td>
                    `
                  )}
                </tr>
                <tr>
                  <td>Technical Mastery</td>
                  <td>Description of whatever here</td>
                  <td>40%</td>
                </tr>
                <tr>
                  ${this.rubricCategories.map(
                    (rubric) => html`
                      <td>
                        <simple-fields-tag-list
                          label="${rubric.title}"
                        ></simple-fields-tag-list>
                      </td>
                    `
                  )}
                </tr>
              </tbody>
            </table>
          </editable-table-display>
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
                <div slot="heading">${category}</div>
                <div slot="content">
                  ${this.database.tags.data
                    .filter((item) => {
                      return item.category.includes(category);
                    })
                    .map(
                      (term) =>
                        html`<simple-tag
                          draggable="true"
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
