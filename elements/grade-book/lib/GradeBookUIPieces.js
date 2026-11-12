/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, nothing } from "lit";
import { toJS } from "mobx";
import { renderDDDBlockHeader } from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { GradeBookStore } from "./grade-book-store.js";
import { GradeBookSharedStyles } from "./GradeBookShared.js";
import { gradeBookLetter, studentDisplayName } from "./GradeBookHelpers.js";

/**
 * Render pieces shared by grade-book and grade-book-lite: the toolbar (a
 * DDD block header), its popovers, the roster grid, the source picker, the
 * total score area and tag category headings. Styles come from
 * GradeBookSharedStyles so both elements look the same.
 */
export const UIRenderPieces = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.t = {
        ...this.t,
        displayMode1: "Mode 1",
        displayMode2: "Mode 2",
        twoWindows: "Two windows",
        notGraded: "Not graded",
        gradeValue: "{score} of {points}",
        studentPosition: "Student {current} / {total}",
        rosterCaption: "{students} students · {assignments} assignments",
        gridInstructions: "Arrow keys move between grades, Enter opens grading",
        totalScore: "Total score",
        lockTotalScore: "Lock total score",
      };
      this.hideGradeScale = true;
      this.hideActiveStudentOverview = true;
      this.hideActiveAssignment = true;
      this.hideSettings = true;
      this.hideRubricInfo = [];
      import("@haxtheweb/simple-popover/simple-popover.js");
      import("./grade-book-student-block.js");
    }
    static get properties() {
      return {
        ...super.properties,
        hideSettings: { type: Boolean },
        hideGradeScale: { type: Boolean },
        hideActiveStudentOverview: { type: Boolean },
        hideActiveAssignment: { type: Boolean },
        hideRubricInfo: { type: Array },
      };
    }
    static get styles() {
      return [super.styles, ...GradeBookSharedStyles];
    }

    // polite live region; announceActiveSelection() writes into it
    renderAnnouncer() {
      return html`<div
        id="gbannounce"
        class="gb-sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      ></div>`;
    }

    /**
     * Toolbar: a DDD block header (chip, app-name slot as the label, the
     * current student and assignment as the title, grading scale /
     * settings / save as actions) and a row with the student and the
     * assignment, each with previous / next. Labels stay visible at every
     * width; the rows wrap on small screens.
     * @param {Object} opts { label: the label (each element passes its
     *   app-name slot), student: show student navigation, settings: show
     *   the settings action }
     */
    renderToolbar(opts = {}) {
      const db = this.database || {};
      const roster = db.roster || [];
      const assignments = db.assignments || [];
      const student = roster[this.activeStudent];
      const assignment = assignments[this.activeAssignment];
      const names = [];
      if (opts.student && student) {
        names.push(studentDisplayName(student));
      }
      if (assignment) {
        names.push(assignment.shortName);
      }
      return html`<div class="top-controls" part="toolbar">
        ${renderDDDBlockHeader({
          id: "gbtoolbarlabel",
          icon: "icons:assignment",
          label: opts.label,
          title: names.join(" · "),
          actions: html`${this.renderGradeScaleBtn()}${
            opts.settings ? this.renderSettingsBtn() : nothing
          }${this.renderSaveBtn()}`,
        })}
        <div class="gb-toolbar-nav">
          ${
            opts.student
              ? html`<div
                  class="gb-nav-group"
                  role="group"
                  aria-label="${this.t.activeStudent}"
                >
                  ${this.renderActiveStudentBtn()}
                  ${
                    student
                      ? html`<span class="gb-nav-current"
                          >${this.t.studentPosition
                            .replace("{current}", () => this.activeStudent + 1)
                            .replace("{total}", () => roster.length)}
                          · ${studentDisplayName(student)}</span
                        >`
                      : nothing
                  }
                  ${this.renderNavButton(
                    "student",
                    "prev",
                    this.changeStudent,
                    this.t.previousStudent,
                    this.t.previous,
                    "arrow-upward",
                    0 === this.activeStudent || !this.ready,
                  )}
                  ${this.renderNavButton(
                    "student",
                    "next",
                    this.changeStudent,
                    this.t.nextStudent,
                    this.t.next,
                    "arrow-downward",
                    (roster.length ? roster.length - 1 : 0) ===
                      this.activeStudent || !this.ready,
                  )}
                </div>`
              : nothing
          }
          <div
            class="gb-nav-group"
            role="group"
            aria-label="${this.t.activeAssignment}"
          >
            ${this.renderActiveAssignmentBtn()}
            ${
              assignment
                ? html`<span class="gb-nav-current">${assignment.name}</span>`
                : nothing
            }
            ${this.renderNavButton(
              "assignment",
              "prev",
              this.changeAssignment,
              this.t.previousAssignment,
              this.t.previous,
              "arrow-back",
              0 === this.activeAssignment || !this.ready,
            )}
            ${this.renderNavButton(
              "assignment",
              "next",
              this.changeAssignment,
              this.t.nextAssignment,
              this.t.next,
              "arrow-forward",
              (assignments.length ? assignments.length - 1 : 0) ===
                this.activeAssignment || !this.ready,
            )}
          </div>
        </div>
        ${this.renderAnnouncer()}
      </div>`;
    }
    // round previous / next button; visible text plus a full name
    renderNavButton(nav, value, handler, name, text, icon, disabled) {
      return html`<button
        class="ddd-block-action has-text"
        data-nav="${nav}"
        value="${value}"
        title="${name}"
        aria-label="${name}"
        @click="${handler}"
        ?disabled="${disabled}"
      >
        <simple-icon-lite icon="${icon}" aria-hidden="true"></simple-icon-lite>
        <span>${text}</span>
      </button>`;
    }
    // the one filled action: only when a file system gradebook is loaded
    renderSaveBtn() {
      if (!(this.ready && this.source === "filesystem" && this.sourceData)) {
        return nothing;
      }
      return html`<button
        class="ddd-block-action has-text gb-primary"
        id="savegradebook"
        @click="${this.saveToFilesystem}"
        title="${this.t.saveGradebook}"
        ?disabled="${!this.sourceData}"
      >
        <simple-icon-lite icon="save" aria-hidden="true"></simple-icon-lite>
        <span>${this.t.saveGradebook}</span>
      </button>`;
    }
    // render the active student as a button that opens a popover
    renderActiveStudentBtn() {
      const db = this.database || {};
      const student = db.roster ? db.roster[this.activeStudent] : null;
      return html`<button
          class="ddd-block-action has-text"
          @click="${this.toggleActiveStudentOverview}"
          id="activestudentbtn"
          aria-expanded="${this.hideActiveStudentOverview ? "false" : "true"}"
          ?disabled="${!this.ready}"
        >
          ${
            student && student.photo
              ? html`<img src="${student.photo}" alt="" loading="lazy" />`
              : html`<simple-icon-lite
                  icon="social:person"
                  aria-hidden="true"
                ></simple-icon-lite>`
          }
          <span>${this.t.activeStudent}</span>
        </button>
        <simple-popover
          ?hidden="${this.hideActiveStudentOverview}"
          for="activestudentbtn"
          auto
        >
          <div>
            ${
              student
                ? html` <grade-book-student-block
                    .student="${student}"
                  ></grade-book-student-block>`
                : nothing
            }
            <div class="active-student-grade-history">
              ${(this.activeStudentSubmissions || []).map(
                (sRecord) => html`
                  <button
                    .value="${sRecord.assignmentIndex}"
                    @click="${this.studentLetterGradeHistoryClick}"
                    aria-label="${sRecord.assignmentName}, ${this.gradeValueText(
                      sRecord.studentScore,
                      sRecord.assignmentPoints,
                    )}"
                    aria-current="${
                      this.activeAssignment === sRecord.assignmentIndex
                        ? "true"
                        : nothing
                    }"
                    class="${
                      this.activeAssignment === sRecord.assignmentIndex
                        ? `activeAssignment`
                        : ``
                    }"
                  >
                    <letter-grade
                      mini
                      label="${
                        sRecord.studentScore === null
                          ? `${sRecord.assignmentName} · ${this.t.notGraded}`
                          : sRecord.assignmentName
                      }"
                      .total="${sRecord.assignmentPoints}"
                      .score="${sRecord.studentScore}"
                      .value="${sRecord.assignmentIndex}"
                    >
                    </letter-grade>
                  </button>
                `,
              )}
            </div>
          </div>
        </simple-popover>`;
    }
    // toggle logic for active student
    toggleActiveStudentOverview(_e) {
      this.hideActiveStudentOverview = !this.hideActiveStudentOverview;
      if (!this.hideActiveStudentOverview) {
        this.hideSettings = true;
        this.hideActiveAssignment = true;
        this.hideGradeScale = true;
      }
    }
    // render grading scale in a popover
    renderGradeScaleBtn() {
      return html` <button
          class="ddd-block-action has-text"
          @click="${this.toggleGradeScale}"
          id="gradescalebtn"
          aria-expanded="${this.hideGradeScale ? "false" : "true"}"
          ?disabled="${!this.ready}"
        >
          <simple-icon-lite icon="list" aria-hidden="true"></simple-icon-lite>
          <span>${this.t.gradingScale}</span>
        </button>
        <simple-popover
          ?hidden="${this.hideGradeScale}"
          for="gradescalebtn"
          auto
        >
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
                  <td>${this.t.letterGrade}</td>
                  <td>${this.t.highRange}</td>
                  <td>${this.t.lowRange}</td>
                </tr>
                ${((this.database && this.database.gradeScale) || []).map(
                  (scale) => html`
                    <tr>
                      <td>${scale.letter}</td>
                      <td>${scale.highRange}</td>
                      <td>${scale.lowRange}</td>
                    </tr>
                  `,
                )}
              </tbody>
            </table>
          </editable-table-display>
        </simple-popover>`;
    }
    // toggle logic for button
    toggleGradeScale(_e) {
      this.hideGradeScale = !this.hideGradeScale;
      if (!this.hideGradeScale) {
        this.hideSettings = true;
        this.hideActiveAssignment = true;
        this.hideActiveStudentOverview = true;
      }
    }
    // render settings in a popover
    renderSettingsBtn() {
      return html` <button
          class="ddd-block-action has-text"
          @click="${this.toggleSettings}"
          id="settings"
          aria-expanded="${this.hideSettings ? "false" : "true"}"
          ?disabled="${!this.ready}"
        >
          <simple-icon-lite
            icon="settings"
            aria-hidden="true"
          ></simple-icon-lite>
          <span>${this.t.settings}</span>
        </button>
        <simple-popover
          ?hidden="${this.hideSettings}"
          for="settings"
          auto
          @value-changed="${this.settingChanged}"
        >
          <simple-fields-field
            value="${this.settings.photo}"
            type="checkbox"
            label="${this.t.photo}"
            name="photo"
          ></simple-fields-field>
          <simple-fields-field
            value="${this.settings.email}"
            type="checkbox"
            label="${this.t.email}"
            name="email"
          ></simple-fields-field>
          <simple-fields-field
            value="${this.settings.fname}"
            type="checkbox"
            label="${this.t.firstName}"
            name="fname"
          ></simple-fields-field>
          <simple-fields-field
            value="${this.settings.surname}"
            type="checkbox"
            label="${this.t.surname}"
            name="surname"
          ></simple-fields-field>
        </simple-popover>`;
    }
    // toggle logic for button
    toggleSettings(_e) {
      this.hideSettings = !this.hideSettings;
      if (!this.hideSettings) {
        this.hideGradeScale = true;
        this.hideActiveAssignment = true;
        this.hideActiveStudentOverview = true;
      }
    }
    // render active assignment in a popover
    renderActiveAssignmentBtn() {
      return html`<button
          class="ddd-block-action has-text"
          @click="${this.toggleActiveAssignment}"
          id="activeassignmentbtn"
          aria-expanded="${this.hideActiveAssignment ? "false" : "true"}"
          ?disabled="${!this.ready}"
        >
          <simple-icon-lite
            icon="assignment"
            aria-hidden="true"
          ></simple-icon-lite>
          <span>${this.t.activeAssignment}</span>
        </button>
        <simple-popover
          ?hidden="${this.hideActiveAssignment}"
          for="activeassignmentbtn"
          auto
        >
          ${
            this.database &&
            this.database.assignments &&
            this.database.assignments[this.activeAssignment]
              ? html`
                  <h3>
                    ${this.database.assignments[this.activeAssignment].name}
                  </h3>
                  ${this.t.dueDate}:
                  <relative-time
                    threshold="PT0S"
                    .datetime="${
                      this.database.assignments[this.activeAssignment]
                        ._ISODueDate
                    }"
                    month="short"
                    day="numeric"
                    year="numeric"
                    hour="numeric"
                    minute="numeric"
                    time-zone-name="short"
                  >
                  </relative-time>
                `
              : nothing
          }
        </simple-popover>`;
    }
    // toggle logic for button
    toggleActiveAssignment(_e) {
      this.hideActiveAssignment = !this.hideActiveAssignment;
      if (!this.hideActiveAssignment) {
        this.hideSettings = true;
        this.hideGradeScale = true;
        this.hideActiveStudentOverview = true;
      }
    }

    // SOURCE PICKER

    renderSourcePicker() {
      return html`<div ?hidden="${this.sourceData}" class="source-selection">
          <label for="source">${this.t.selectGradebookSource}..</label>
          <select id="source" @change="${this.selectSource}">
            ${
              this.hasFilePicker
                ? html`<option
                    value="filesystem"
                    ?selected="${this.source === "filesystem"}"
                  >
                    ${this.t.fileSystem}
                  </option>`
                : nothing
            }
            <option
              value="googledocs"
              ?selected="${this.source === "googledocs"}"
            >
              ${this.t.googleDocs}
            </option>
            <option value="url">${this.t.urlEndpointJSON}</option>
            <option value="json">${this.t.jsonDataBlob}</option>
          </select>
          <simple-icon-button-lite
            @click="${this.loadFromSource}"
            title="${this.t.loadGradebook}"
            ?disabled="${this.sourceData}"
            icon="folder-shared"
          >
            <span class="hide-900">${this.t.loadGradebook}</span>
          </simple-icon-button-lite>
          ${
            this.source === "filesystem" && this.prevLocalFileReference
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
              : nothing
          }
          <input
            id="sourcedata"
            aria-label="${this.t.sourceData}"
            placeholder="${this.t.sourceData}"
            ?hidden="${!["googledocs", "url"].includes(this.source)}"
          />
          <textarea
            id="sourcedatablob"
            rows="10"
            cols="40"
            aria-label="${this.t.sourceData}"
            placeholder="${this.t.pasteValidJSONHere}"
            ?hidden="${this.source !== "json"}"
          ></textarea>
        </div>
        ${
          this.source === "filesystem" && this.loading
            ? html`<p class="source-selection">
                ${this.t.loadingFilePleaseWait}
              </p>`
            : nothing
        }`;
    }

    // ROSTER GRID

    /**
     * Roster grid in the DDD table look: caption, scoped headers, sticky
     * student column and header row, one tab stop (see gridKeydown), the
     * active cell marked with aria-current, a dash for ungraded work.
     */
    renderRosterGrid() {
      const db = this.database || {};
      const roster = db.roster || [];
      const assignments = db.assignments || [];
      const scale = toJS(GradeBookStore.gradeScale) || [];
      const stop = this.gridTabStop();
      return html`<table
        id="studentgrid"
        class="ddd-table"
        role="grid"
        @mousemove="${this.mouseHighlight}"
        @mouseleave="${this.mouseLeave}"
        @click="${this.activateOption}"
        @dblclick="${this.handleGridScaling}"
        @keydown="${this.gridKeydown}"
        ?hidden="${!assignments[this.activeAssignment]}"
      >
        ${
          roster.length && assignments.length
            ? html`
                <caption>
                  <span class="gb-caption-text"
                    >${this.t.rosterCaption
                      .replace("{students}", () => roster.length)
                      .replace("{assignments}", () => assignments.length)}
                    · ${this.t.gridInstructions}</span
                  >
                </caption>
                <thead class="thead">
                  <tr class="tr thead-tr" part="tr">
                    <th
                      scope="col"
                      class="th th-or-td student-table-label"
                      data-assignment="-1"
                    >
                      ${this.t.student} (${parseInt(this.activeStudent + 1)} /
                      ${roster.length})
                    </th>
                    ${assignments.map(
                      (a, h) =>
                        html`<th
                          scope="col"
                          class="th th-or-td assignment-name"
                          title="${a.name}"
                          data-assignment="${h}"
                        >
                          ${a.shortName}
                          <span class="gb-col-points"
                            >${this.t.outOfPoints.replace(
                              "{points}",
                              () => a.points,
                            )}</span
                          >
                        </th>`,
                    )}
                  </tr>
                </thead>
                <tbody class="tbody">
                  ${roster.map(
                    (s, i) =>
                      html`<tr
                        class="tr tbody-tr"
                        ?data-current="${this.activeStudent === i}"
                      >
                        <th
                          scope="row"
                          class="th th-or-td"
                          data-assignment="-1"
                        >
                          ${this.renderRosterStudent(s)}
                        </th>
                        ${assignments.map((a, h) =>
                          this.renderRosterCell(s, i, a, h, stop, scale),
                        )}
                      </tr>`,
                  )}
                </tbody>
              `
            : nothing
        }
      </table>`;
    }
    // student row header: photo, names and email per the settings
    renderRosterStudent(s) {
      const settings = this.settings || {};
      // the photo is decorative when the name is right next to it
      const nameShown = settings.fname || settings.surname;
      return html`<div class="user-info">
        <div class="user-left">
          ${
            settings.photo
              ? html`${
                  s.photo
                    ? html`<img
                        src="${s.photo}"
                        loading="lazy"
                        class="user-photo"
                        alt="${nameShown ? "" : studentDisplayName(s)}"
                      />`
                    : html`<simple-icon-lite
                        icon="social:person"
                        class="user-photo"
                        aria-hidden="true"
                      ></simple-icon-lite>`
                }`
              : nothing
          }
        </div>
        <div class="user-right">
          ${
            settings.fname
              ? html`<div class="gb-fname">${s.student}</div>`
              : nothing
          }
          ${
            settings.surname
              ? html`<div class="gb-surname">${s.surname}</div>`
              : nothing
          }
          ${
            settings.email
              ? html`<div class="gb-email">
                  <a href="mailto:${s.email}" target="_blank" tabindex="-1"
                    >${s.email}</a
                  >
                </div>`
              : nothing
          }
        </div>
      </div>`;
    }
    // one grade cell: score and small letter, or a dash when not graded
    renderRosterCell(s, i, a, h, stop, scale) {
      const score = this.gradeFor(i, a);
      const graded = score !== null;
      const letter = graded ? gradeBookLetter(score, a.points, scale) : "";
      const active = this.activeStudent === i && this.activeAssignment === h;
      const isStop = stop.student === i && stop.assignment === h;
      const label = this.t.studentAssignment
        .replace("{student}", () => s.student)
        .replace("{assignment}", () => a.name);
      // the button's name comes from its content so the visible score and
      // letter are part of it: "Alice's assignment Essay, 9 of 10, B"
      const parts = this.t.gradeValue.split("{score}");
      const before = parts[0] || "";
      const after = (parts[1] || "").replace("{points}", () => a.points);
      return html`<td
        class="td th-or-td"
        numeric
        data-student="${i}"
        data-assignment="${h}"
        ?data-active="${active}"
      >
        <button
          aria-current="${active ? "true" : nothing}"
          tabindex="${isStop ? "0" : "-1"}"
          data-student="${i}"
          data-assignment="${h}"
        >
          ${
            graded
              ? html`<span class="gb-sr-only">${label}, ${before}</span
                  ><span class="gb-score">${score}</span
                  ><span class="gb-sr-only">${after}${letter ? ", " : ""}</span
                  >${
                    letter
                      ? html`<span class="gb-letter">${letter}</span>`
                      : nothing
                  }`
              : html`<span class="gb-sr-only"
                    >${label}, ${this.t.notGraded}</span
                  ><span class="gb-ungraded" aria-hidden="true">–</span>`
          }
        </button>
      </td>`;
    }

    // SCORE

    /**
     * Total score: named lock toggle, labelled score field, "/ N pts" and
     * the letter grade, laid out as one group that wraps as a whole
     */
    renderTotalScore() {
      const db = this.database || {};
      const assignment = db.assignments
        ? db.assignments[this.activeAssignment]
        : null;
      const graded =
        this.gradeFor(this.activeStudent, assignment) !== null ||
        !!Number(this.totalScore);
      return html`<div class="student-feedback-score">
        <button
          class="ddd-block-action gb-lock"
          aria-label="${this.t.lockTotalScore}"
          aria-pressed="${this.scoreLock ? "true" : "false"}"
          @click="${this.toggleLock}"
        >
          <simple-icon-lite
            icon="${this.scoreLock ? `lock` : `lock-open`}"
            aria-hidden="true"
          ></simple-icon-lite>
        </button>
        <simple-fields-field
          ?disabled="${this.scoreLock}"
          type="number"
          min="0"
          id="totalpts"
          maxlength="10"
          label="${this.t.totalScore}"
          @value-changed="${this.totalScoreChangedEvent}"
        ></simple-fields-field>
        ${
          assignment
            ? html`<span class="gb-out-of"
                  >${this.t.outOfPoints.replace(
                    "{points}",
                    () => assignment.points,
                  )}</span
                >
                <letter-grade
                  total="${assignment.points}"
                  .score="${graded ? this.totalScore : null}"
                ></letter-grade>`
            : nothing
        }
      </div>`;
    }

    // TAGS

    // category heading: a DDD chart series dot next to the name, so the
    // colour is never the only cue
    renderTagCategoryHeading(category, i) {
      return html`<div slot="heading">
        <span
          class="gb-cat-dot"
          aria-hidden="true"
          style="--grade-book-dot: ${this.pickChartColor(i)}"
        ></span
        >${category}
      </div>`;
    }

    // RUBRICS

    // render grading scale in a popover
    renderRubricInfoBtn(index, criteria, details) {
      return html`<simple-icon-button-lite
          icon="info"
          @click="${this.toggleRubricInfo}"
          id="rubricinfo${index}"
          data-id="${index}"
        >
          <span class="hide-900" data-id="${index}">${criteria}</span>
        </simple-icon-button-lite>
        <simple-popover
          ?hidden="${!this.hideRubricInfo[index]}"
          for="rubricinfo${index}"
          auto
        >
          <p style="max-width:20vw;">${details}</p>
        </simple-popover>`;
    }
    // toggle logic for button
    toggleRubricInfo(e) {
      this.hideRubricInfo[parseInt(e.target.getAttribute("data-id"))] =
        !this.hideRubricInfo[parseInt(e.target.getAttribute("data-id"))];
      this.requestUpdate();
    }

    // displayMode toggle button
    renderDisplayModeBtn() {
      return html` ${this.displayModeData().map(
        (value, i) => html`
          <simple-icon-button-lite
            icon="${value.icon}"
            @click="${this.toggleDisplayMode}"
            data-id="${i}"
            ?disabled="${this.displayMode === i}"
          >
            <span class="hide-900" data-id="${i}">${value.label}</span>
          </simple-icon-button-lite>
        `,
      )}`;
    }
    displayModeData() {
      return [
        { label: this.t.displayMode1, icon: "view-array", layout: "1-1-2" },
        { label: this.t.displayMode2, icon: "view-carousel", layout: "1-2-1" },
        { label: this.t.twoWindows, icon: "open-in-new", layout: "1-2" },
      ];
    }

    toggleDisplayMode(e) {
      this.displayMode = parseInt(e.target.getAttribute("data-id"));
      // open in new window and drop the assignment display panel
      if (this.displayMode === 2) {
        this.openWindow();
      }
    }
  };
};
