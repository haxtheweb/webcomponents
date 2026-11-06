/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, render, nothing } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { validURL, cleanVideoSource } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-fields/lib/simple-fields-tag-list.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import "@haxtheweb/a11y-collapse/lib/a11y-collapse-group.js";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/a11y-tabs/a11y-tabs.js";
import "@haxtheweb/a11y-tabs/lib/a11y-tab.js";
import "@haxtheweb/grid-plate/grid-plate.js";
import "@haxtheweb/iframe-loader/lib/loading-indicator.js";
import "./lib/letter-grade.js";
import "./lib/letter-grade-picker.js";
import "@github/relative-time-element";
import { UIRenderPieces } from "./lib/GradeBookUIPieces.js";
import { GradeBookShared } from "./lib/GradeBookShared.js";
import { GradeBookStore } from "./lib/grade-book-store.js";
import "./lib/grade-book-pop-up.js";
import { autorun, toJS } from "mobx";
import { get } from "idb-keyval";
import { ESGlobalBridgeStore } from "@haxtheweb/es-global-bridge/es-global-bridge.js";
/**
 * `grade-book`
 * `A headless gradebook that supports multiple backends with rubrics`
 * @demo demo/index.html Grade book
 * @element grade-book
 */
class GradeBook extends UIRenderPieces(
  GradeBookShared(I18NMixin(SchemaBehaviors(SimpleColors))),
) {
  constructor() {
    super();
    this.__disposer = [];
    // the first render can run before the autorun below hands over the store data
    this.database = toJS(GradeBookStore.database) || {};
    this.__resizeObserver = null;
    this.__xlsxFileSystemDataHandler = null;
    this.hasFilePicker = false;
    this.source = "googledocs";
    // eslint-disable-next-line baseline-js/use-baseline -- feature check; falls back to the googledocs source
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
    // general state
    this.settings = {
      photo: true,
      fname: true,
      surname: true,
      email: true,
    };
    this.forCourse = "";
    this.disabled = false;
    // shows progress indicator as it loads
    this.loading = false;
    // translatable text
    this.t = {
      ...this.t,
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
      settings: "Settings",
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
      fileSystem: "File system",
      googleDocs: "Google docs",
      urlEndpointJSON: "URL endpoint (JSON)",
      jsonDataBlob: "JSON data blob",
      studentAssignment: "{student}'s assignment {assignment}",
      additionalCriteriaFeedback: "Additional {criteria} feedback",
      outOfPoints: "/ {points} pts",
      downloadPDF: "Download PDF",
      feedbackReport: "Feedback report",
      criteriaDetails: "Criteria details",
      yourFeedback: "Your feedback",
      additionalCriteriaFeedbackHeading: "Additional Criteria feedback",
      yourTotalScore: "Your total Score",
      scoreOutOfPoints: "{score} / {points} pts",
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
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(GradeBookStore.activeStudent);
        Promise.resolve().then(() => {
          this.activeStudent = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(GradeBookStore.activeAssignment);
        Promise.resolve().then(() => {
          this.activeAssignment = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(GradeBookStore.database) || {};
        Promise.resolve().then(() => {
          this.database = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(GradeBookStore.activeSubmission);
        Promise.resolve().then(() => {
          this.activeSubmission = _mobx_val_0;
        });
      }),
    );
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__resizeObserver = new ResizeObserver((entries) => {
      clearTimeout(this.__resizer);
      this.__resizer = setTimeout(() => {
        let pixels = 0;
        for (let entry of entries) {
          if (entry.contentBoxSize) {
            pixels = Math.round(
              globalThis.innerHeight -
                entry.contentBoxSize[0].blockSize -
                this.toolbarOffset(122),
            );
          } else {
            pixels = Math.round(
              globalThis.innerHeight -
                entry.contentRect.height -
                this.toolbarOffset(122),
            );
          }
        }
        this.shadowRoot
          .querySelector("#studentassessment")
          .shadowRoot.querySelector("[part='content']").style.height =
          pixels + "px";
      }, 50);
    });
    this.__resizeObserver.observe(
      this.shadowRoot.querySelector("#studentgrid"),
    );
    // see if we have a previous file reference
    setTimeout(async () => {
      const stored = await get("grade-book-prev-file");
      // the lookup is async; do not clobber a reference that was set while
      // it was pending (a file picked, or restored, in the meantime)
      if (!this.prevLocalFileReference) {
        this.prevLocalFileReference = stored;
      }
      this.requestUpdate();
    }, 0);
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
          if (this.displayMode == 2) {
            this.renderSubmissionInWindow();
          }
        }, 0);
        this.maintainScrollPosition();
      }
      // source will have to fetch ALL the pages and slowly load data as it rolls through (shared in GradeBookShared.js)
      if (["sourceData", "source"].includes(propName)) {
        this.loadSourceData();
      }
    });
  }

  static get properties() {
    return {
      ...super.properties,
      displayMode: { type: Number },
      settings: { type: Object },
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
      /**
       * Course reference emitted as oer:forCourse on each Assessment.
       */
      forCourse: { type: String, attribute: "for-course" },
    };
  }
  // render submission; guessing game really :)
  renderSubmission(data) {
    const height = parseInt(
      this.shadowRoot.querySelector("#studentgrid").getBoundingClientRect()
        .height,
    );
    this.shadowRoot
      .querySelector("#studentassessment")
      .shadowRoot.querySelector("[part='content']").style.height =
      Math.round(globalThis.innerHeight - height - this.toolbarOffset(104)) +
      "px";
    // @todo make this actually be the submitted time, right now it's due relative time'd
    let pre = html`<h3>${this.t.studentSubmission}</h3>
      ${this.t.submitted}
      <relative-time
        .datetime="${
          this.database.assignments[this.activeAssignment]._ISODueDate
        }"
      ></relative-time> `;
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
        import("@haxtheweb/video-player/video-player.js");
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
      import("@haxtheweb/md-block/md-block.js");
      return html`${pre}
        <div class="active-submission">
          <md-block .markdown="${data}"></md-block>
        </div>`;
    }
  }
  settingChanged(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    this.settings[e.detail.name] = e.detail.value;
    this.settings = { ...this.settings };
  }
  checkTabHeight(_e) {
    // toggle between height
    const height = parseInt(
      this.shadowRoot.querySelector("#studentgrid").getBoundingClientRect()
        .height,
    );
    // ensure small heights are expanded because it's impossible to leverage overwise
    if (height / globalThis.innerHeight > 0.65) {
      this.shadowRoot.querySelector("#studentgrid").style.height = null;
    }
  }
  studentreportClick(_e) {
    ESGlobalBridgeStore.import(
      "jspdf",
      new URL(`./lib/grade-book.js`, import.meta.url).href + "/../jspdf.min.js",
    ).then(() => {
      let pdf = new jsPDF();
      pdf.fromHTML(
        this.shadowRoot.querySelector("#studentreport").outerHTML,
        15,
        15,
      );
      const cd = new Date();
      const dateTime = `${cd.getFullYear()}-${cd.getMonth() + 1}-${cd.getDate()}__${cd.getHours()}-${cd.getMinutes()}-${cd.getSeconds()}`;
      const fname = `${this.database.roster[this.activeStudent].student}--${
        this.database.assignments[this.activeAssignment].shortName
      }--${dateTime}.pdf`;
      pdf.save(fname);
    });
  }
  // open extra window and then render content
  openWindow(_e) {
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
    this.renderSubmissionInWindow();
  }
  // render submission in window area
  renderSubmissionInWindow() {
    if (this.__openWindow && this.displayMode === 2) {
      this.__openWindow.document.body.style.margin = "0";
      render(
        html` ${
          this.database.assignments.length &&
          this.database.assignments[this.activeAssignment]
            ? html`<grade-book-pop-up></grade-book-pop-up>`
            : html`${this.t.noSubmission}`
        }`,
        this.__openWindow.document.body,
      );
    }
  }
  /**
   * Emit OER Schema Assessment metadata for each graded assignment.
   * Each assignment in the database becomes an oer:Assessment resource
   * with gradingFormat (points) and forCourse (when set) properties.
   */
  renderAssessmentSchema() {
    if (
      !this.database ||
      !this.database.assignments ||
      !this.database.assignments.length
    ) {
      return nothing;
    }
    return html`
      <div class="oer-assessment-schema" hidden>
        ${this.database.assignments.map(
          (_a) => html`
            <span typeof="oer:Assessment">
              <meta property="oer:gradingFormat" content="points" />
              ${
                this.forCourse
                  ? html`<meta
                      property="oer:forCourse"
                      content="${this.forCourse}"
                    />`
                  : nothing
              }
            </span>
          `,
        )}
      </div>
    `;
  }
  /**
   * LitElement render method
   */
  render() {
    return html`
      <loading-indicator full ?loading="${this.loading}"></loading-indicator>
      ${this.renderAssessmentSchema()}
      <div class="gb-frame ddd-block">
        ${this.renderToolbar({
          student: true,
          settings: true,
          label: html`<slot name="app-name"></slot>`,
        })}
        ${this.renderSourcePicker()} ${this.renderRosterGrid()}
      </div>
      <a11y-tabs
        id="studentassessment"
        full-width
        @click="${this.checkTabHeight}"
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
          ${
            this.activeRubric[0]
              ? html`
                  <grid-plate
                    disable-responsive
                    layout="${this.displayModeData()[this.displayMode].layout}"
                  >
                    <div slot="col-1" class="tag-group">
                      ${this.renderDisplayModeBtn()}
                      ${
                        this.database.tags.categories.length > 0
                          ? html`
                              <a11y-collapse-group heading-button>
                                ${this.database.tags.categories.map(
                                  (category, i) => html`
                                    <a11y-collapse>
                                      ${this.renderTagCategoryHeading(category, i)}
                                      <div slot="content">
                                        ${this.database.tags.data
                                          .filter((item) => {
                                            return item.category.includes(
                                              category,
                                            );
                                          })
                                          .map(
                                            (term) =>
                                              // @todo add support for keyboard based assignment of tag to criteria
                                              html`<simple-tag
                                                draggable="true"
                                                tabindex="0"
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
                          : nothing
                      }
                    </div>
                    <div slot="col-2">
                      <h3>${this.activeRubric[0].name}</h3>
                      ${this.activeRubric.map(
                        (rubric, index) => html`
                          ${this.renderRubricInfoBtn(
                            index,
                            rubric.criteria,
                            rubric.description,
                          )}
                          <letter-grade-picker></letter-grade-picker>

                          <editable-table-display
                            hide-block-header
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
                          <h4>
                            ${this.t.additionalCriteriaFeedback.replace(
                              "{criteria}",
                              () => rubric.criteria,
                            )}
                          </h4>
                          <simple-fields-field
                            type="textarea"
                            data-rubric-written
                            data-criteria="${rubric.criteria}"
                          ></simple-fields-field>
                        `,
                      )}
                      <div class="student-feedback-wrap">
                        <div class="student-feedback-text">
                          <h3 class="heading">${this.t.overallFeedback}</h3>
                          <simple-fields-field
                            type="textarea"
                            data-criteria="overall"
                            data-rubric-written
                          ></simple-fields-field>
                        </div>
                        ${this.renderTotalScore()}
                      </div>
                    </div>
                    ${
                      this.displayMode != 2
                        ? html`
                            <div slot="col-3">
                              ${
                                this.database.assignments.length &&
                                this.database.assignments[this.activeAssignment]
                                  ? html`${
                                      this.activeSubmission
                                        ? this.renderSubmission(
                                            this.activeSubmission,
                                          )
                                        : html`${this.t.noSubmission}`
                                    }`
                                  : nothing
                              }
                            </div>
                          `
                        : nothing
                    }
                  </grid-plate>
                `
              : nothing
          }
        </a11y-tab>
        <a11y-tab
          id="studentreporttab"
          icon="assignment"
          label="${this.t.studentReportView}"
        >
          <simple-icon-button-lite
            @click="${this.studentreportClick}"
            title="${this.t.downloadPDF}"
            icon="image:picture-as-pdf"
          >
            <span class="hide-900" value="prev">${this.t.downloadPDF}</span>
          </simple-icon-button-lite>
          <div id="studentreport">
            ${
              !this.loading &&
              this.database.assignments &&
              this.database.assignments[this.activeAssignment]
                ? html`
                    <letter-grade
                      class="student-report-score"
                      show-scale
                      total="${
                        this.database.assignments[this.activeAssignment].points
                      }"
                      score="${this.totalScore}"
                    ></letter-grade>
                    <h2>${this.t.feedbackReport}</h2>
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
                                      ${this.getCriteriaScore(rubric.criteria)}
                                      /
                                      ${Math.round(
                                        (rubric.percentage / 100) *
                                          this.database.assignments[
                                            this.activeAssignment
                                          ].points,
                                      )}
                                    </div>
                                    <h3>${this.t.criteriaDetails}</h3>
                                  </div>
                                  <p>${rubric.description}</p>
                                  <h3>${this.t.yourFeedback}</h3>
                                  <ul>
                                    ${rubric.qualitative.map(
                                      (cat) => html`
                                        <h4>${cat}</h4>
                                        <ul>
                                          ${
                                            this.activeGrading[rubric.criteria]
                                              ? html`${this.activeGrading[
                                                  rubric.criteria
                                                ][cat].map(
                                                  (tag) =>
                                                    html` <li>
                                                      <span>${tag.term}</span>${
                                                        tag.description
                                                          ? html` -
                                                            ${tag.description}`
                                                          : ``
                                                      }
                                                      ${
                                                        tag.associatedMaterial
                                                          ? html`
                                                              <ul>
                                                                ${tag.associatedMaterial.map(
                                                                  (
                                                                    material,
                                                                  ) => html`
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
                                                          : ``
                                                      }
                                                    </li>`,
                                                )}`
                                              : ``
                                          }
                                        </ul>
                                      `,
                                    )}
                                  </ul>
                                  <h3>
                                    ${this.t.additionalCriteriaFeedbackHeading}
                                  </h3>
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
                            <h2>${this.t.yourTotalScore}</h2>
                            <div class="score-display">
                              ${this.t.scoreOutOfPoints
                                .replace("{score}", () => this.totalScore)
                                .replace(
                                  "{points}",
                                  () =>
                                    this.database.assignments[
                                      this.activeAssignment
                                    ].points,
                                )}
                            </div>
                          </div>
                        </a11y-collapse>
                      </a11y-collapse-group>
                    </div>
                  `
                : nothing
            }
          </div>
        </a11y-tab>
      </a11y-tabs>
    `;
  }
  // drag and drop events stay in the element itself: they are part of
  // its documented surface (simple-tag-dragstart / simple-tag-drop)
  // ensure when we drop a tag onto the UI that it removes all the outlines
  // of fields that can have items dropped into them
  _handleDragDrop(_e) {
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
    return "grade-book";
  }
  static get haxProperties() {
    return {
      canScale: false,
      gizmo: {
        title: "Grade Book",
        description:
          "A headless gradebook that supports multiple backends with rubrics.",
        icon: "icons:assignment",
        color: "green",
        tags: ["Instructional", "gradebook", "grading", "assessment", "rubric"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "source",
            title: "Source",
            description:
              "Data source type (googledocs, url, json, filesystem).",
            inputMethod: "select",
            options: {
              googledocs: "Google Docs",
              url: "URL endpoint (JSON)",
              json: "JSON data blob",
              filesystem: "File system",
            },
          },
          {
            property: "sourceData",
            title: "Source Data",
            description: "URL or JSON data for the gradebook.",
            inputMethod: "textfield",
          },
          {
            property: "forCourse",
            title: "Course Reference",
            description:
              "Course identifier emitted as oer:forCourse on each Assessment resource.",
            inputMethod: "textfield",
          },
        ],
      },
    };
  }
}
globalThis.customElements.define(GradeBook.tag, GradeBook);
export { GradeBook };
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
      if (globalThis.document && globalThis.document.body) {
        globalThis.document.body.appendChild(globalThis.GradeBook.instance);
      }
    }
  }
  return globalThis.GradeBook.instance;
};
