/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, nothing } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
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
import "@github/relative-time-element";
import { autorun, toJS } from "mobx";
import { get } from "idb-keyval";
import { SimpleFilterMixin } from "@haxtheweb/simple-filter/simple-filter.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { b64toBlob } from "@haxtheweb/utils/utils.js";

import { UIRenderPieces } from "./GradeBookUIPieces.js";
import { GradeBookShared } from "./GradeBookShared.js";
import { GradeBookStore } from "./grade-book-store.js";
import "./grade-book-pop-up.js";
import "./letter-grade.js";
import "./letter-grade-picker.js";
import { stripHtmlComments } from "@haxtheweb/utils/lib/safe-html.js";

/**
 * `grade-book`
 * `A headless gradebook that supports multiple backends with rubrics`
 * @demo demo/index.html Grade book
 * @element grade-book
 */
class GradeBookLite extends UIRenderPieces(
  GradeBookShared(I18NMixin(SimpleFilterMixin(SimpleColors))),
) {
  constructor() {
    super();
    this.__disposer = [];
    // the first render can run before the autorun below hands over the store data
    this.database = toJS(GradeBookStore.database) || {};
    this.__resizeObserver = null;
    this.__xlsxFileSystemDataHandler = null;
    this.__pdfLoading = false;
    enableServices(["core"]);
    // on-prem PDF support: @core/htmlToPdf is not part of the core
    // microservice bundle, so register it against the same-origin system
    // endpoint (never an external API address) so the PDF button works in
    // the shipped default state
    if (!MicroFrontendRegistry.has("@core/htmlToPdf")) {
      MicroFrontendRegistry.add({
        name: "@core/htmlToPdf",
        endpoint: "/system/api/v1/actions/html-to-pdf",
        title: "HTML to PDF",
        description: "Convert HTML string to PDF",
        params: {
          base: "base URL to resolve relative links in the content against",
          html: "HTML to convert to PDF",
        },
      });
    }
    this.where = "term";
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
    this.disabled = false;
    // shows progress indicator as it loads
    this.loading = false;
    // translatable text
    this.t = {
      ...this.t,
      downloadingPdfPleaseWait: "Downloading PDF, please wait...",
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
      loadingFilePleaseWait: "Loading file, please wait...",
      fileSystem: "File system",
      googleDocs: "Google docs",
      urlEndpointJSON: "URL endpoint (JSON)",
      jsonDataBlob: "JSON data blob",
      filter: "Filter",
      tagSearch: "Tag search",
      collapseAll: "Collapse all",
      expandAll: "Expand all",
      additionalCriteriaFeedback: "Additional {criteria} feedback",
      outOfPoints: "/ {points} pts",
      feedbackReport: "Feedback report",
      criteriaDetails: "Criteria details",
      yourFeedback: "Your feedback",
      additionalCriteriaFeedbackHeading: "Additional Criteria feedback",
      yourTotalScore: "Your total Score",
      scoreOutOfPoints: "{score} / {points} pts",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
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
    if (this.shadowRoot.querySelector("#studentgrid")) {
      this.__resizeObserver.observe(
        this.shadowRoot.querySelector("#studentgrid"),
      );
    }
    // see if we have a previous file reference
    setTimeout(async () => {
      this.prevLocalFileReference = await get("grade-book-prev-file");
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
          if (this.database.tags && this.database.tags.data) {
            this.items = this.database.tags.data;
          }
        }, 0);
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
      __pdfLoading: { type: Boolean },
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
  // PDF page button for the student report view. The hash link button that
  // used to render next to it was removed: it called the external crypto
  // microservice and opened the hardcoded external feedback viewer, neither
  // of which can be reached from on-premises deployments.
  PDFPageButton(position = "auto") {
    return html`
      ${
        MicroFrontendRegistry.has("@core/htmlToPdf")
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
                ${
                  this.__pdfLoading
                    ? this.t.downloadingPdfPleaseWait
                    : this.t.downloadPdf
                }
              </simple-tooltip>
            </div>`
          : ``
      }
    `;
  }
  /**
   * Download PDF, via microservice
   */
  async downloadPDFviaMicro(_e) {
    this.__pdfLoading = true;
    // active dom, but remove the Lit comments from response
    // stripHtmlComments also closes on the "--!>" form browsers accept
    let htmlContent = stripHtmlComments(
      this.shadowRoot.querySelector("#studentreport").innerHTML,
    )
      .replace(/\s+/g, " ")
      .trim();
    // base helps w/ calculating URLs in content
    let base = "";
    if (globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    const response = await MicroFrontendRegistry.call("@core/htmlToPdf", {
      base: base,
      html: htmlContent,
    });
    // an unregistered service or a failed request leaves no usable
    // response; degrade gracefully instead of reading properties off null
    if (response && response.status == 200 && response.data) {
      const link = globalThis.document.createElement("a");
      // click link to download file
      // @todo this downloads but claims to be corrupt.
      const objectUrl = globalThis.URL.createObjectURL(
        b64toBlob(response.data, "application/pdf"),
      );
      link.href = objectUrl;
      link.download = `StudentReport.pdf`;
      link.target = "_blank";
      this.appendChild(link);
      link.click();
      this.removeChild(link);
      globalThis.URL.revokeObjectURL(objectUrl);
    }
    this.__pdfLoading = false;
  }
  // createHashLink was removed: it called the external crypto microservice
  // and opened the hardcoded external secure-feedback viewer, neither of
  // which can be reached from on-premises deployments
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
  }
  /**
   * LitElement render method
   */
  render() {
    return html`
      <loading-indicator full ?loading="${this.loading}"></loading-indicator>
      <div class="gb-frame ddd-block">
        ${this.renderToolbar({
          label: html`<slot name="app-name"></slot>`,
        })}
        ${this.renderSourcePicker()}
      </div>
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
          ${
            this.activeRubric[0]
              ? html`
                  <grid-plate disable-responsive layout="1-1">
                    <div slot="col-1" class="tag-group">
                      <simple-fields-field
                        id="inputfilter"
                        @value-changed="${this.inputfilterChanged}"
                        .value="${this.like}"
                        label="${this.t.filter}"
                        placeholder="${this.t.tagSearch}"
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
                        >${this.t.collapseAll}</simple-icon-button-lite
                      >
                      <simple-icon-button-lite
                        @click="${this.expandAll}"
                        icon="hardware:keyboard-arrow-down"
                        class="control"
                        value=""
                        >${this.t.expandAll}</simple-icon-button-lite
                      >
                      ${
                        this.database.tags.categories.length > 0
                          ? html`
                              <a11y-collapse-group
                                heading-button
                                id="categoriesgroup"
                                global-options='{"expanded": true}'
                              >
                                ${this.database.tags.categories.map(
                                  (category, i) => html`
                                    <a11y-collapse>
                                      ${this.renderTagCategoryHeading(category, i)}
                                      <div slot="content">
                                        ${this.filtered
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
                      ${this.PDFPageButton()}
                      ${this.activeRubric.map(
                        (rubric, _index) => html`
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
  inputfilterChanged(e) {
    if (e.detail.value !== "") {
      this.expandAll();
    }
    this.like = e.target.value;
  }
  expandAll(_e) {
    this.shadowRoot
      .querySelectorAll("#categoriesgroup a11y-collapse")
      .forEach((item) => {
        item.expanded = true;
      });
  }
  collapseAll(_e) {
    this.shadowRoot
      .querySelectorAll("#categoriesgroup a11y-collapse")
      .forEach((item) => {
        item.expanded = false;
      });
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
      if (globalThis.document && globalThis.document.body) {
        globalThis.document.body.appendChild(globalThis.GradeBook.instance);
      }
    }
  }
  return globalThis.GradeBook.instance;
};
