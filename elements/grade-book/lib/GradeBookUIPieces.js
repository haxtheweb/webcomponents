import { html, css, nothing } from "lit";
export const UIRenderPieces = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.hideGradeScale = true;
      this.hideActiveStudentOverview = true;
      this.hideActiveAssignment = true;
      this.hideSettings = true;
      this.hideRubricInfo = [];
      import("@lrnwebcomponents/simple-popover/simple-popover.js");
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
      return [
        ...super.styles,
        css`
          .top-controls simple-icon-button-lite {
            margin: 0;
            border-radius: 0;
            height: 36px;
          }
          .top-controls simple-icon-button-lite:not([disabled])::part(button) {
            outline: none;
            height: 36px;
            border-radius: 0;
            padding: 0 8px;
          }
          .top-controls
            simple-icon-button-lite:not([disabled])::part(button):focus,
          .top-controls
            simple-icon-button-lite:not([disabled])::part(button):hover {
            background-color: var(--simple-colors-default-theme-accent-11);
            outline: 2px solid var(--simple-colors-default-theme-accent-1);
            outline-offset: -2px;
            color: var(--simple-colors-default-theme-accent-1);
          }
          #activestudentbtn img,
          #activestudentbtn simple-icon-lite {
            --simple-icon-width: 32px;
            --simple-icon-height: 32px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 4px;
          }
        `,
      ];
    }
    // render the active student as a button that opens a popover
    renderActiveStudentBtn() {
      return html`<simple-icon-button-lite
          @click="${this.toggleActiveStudentOverview}"
          id="activestudentbtn"
          ?disabled="${!this.ready}"
        >
          ${this.database.roster[this.activeStudent] &&
          this.database.roster[this.activeStudent].photo
            ? html`<img
                src="${this.database.roster[this.activeStudent].photo}"
                loading="lazy"
              />`
            : html`<simple-icon-lite icon="social:person"></simple-icon-lite>`}
          <span class="hide-900">${this.t.activeStudent}</span>
        </simple-icon-button-lite>
        <simple-popover
          ?hidden="${this.hideActiveStudentOverview}"
          for="activestudentbtn"
          auto
        >
          <div>
            ${this.database.roster[this.activeStudent]
              ? html` <grade-book-student-block
                  .student="${this.database.roster[this.activeStudent]}"
                ></grade-book-student-block>`
              : nothing}

            <div class="active-student-grade-history">
              ${this.activeStudentSubmissions.map(
                (sRecord) => html`
                  <button
                    .value="${sRecord.assignmentIndex}"
                    @click="${this.studentLetterGradeHistoryClick}"
                    class="${this.activeAssignment === sRecord.assignmentIndex
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
          </div>
        </simple-popover>`;
    }
    // toggle logic for active student
    toggleActiveStudentOverview(e) {
      this.hideActiveStudentOverview = !this.hideActiveStudentOverview;
      if (!this.hideActiveStudentOverview) {
        this.hideSettings = true;
        this.hideActiveAssignment = true;
        this.hideGradeScale = true;
      }
    }
    // render grading scale in a popover
    renderGradeScaleBtn() {
      return html` <simple-icon-button-lite
          icon="list"
          @click="${this.toggleGradeScale}"
          id="gradescalebtn"
          ?disabled="${!this.ready}"
        >
          <span class="hide-900">${this.t.gradingScale}</span>
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
        </simple-popover>`;
    }
    // toggle logic for button
    toggleGradeScale(e) {
      this.hideGradeScale = !this.hideGradeScale;
      if (!this.hideGradeScale) {
        this.hideSettings = true;
        this.hideActiveAssignment = true;
        this.hideActiveStudentOverview = true;
      }
    }
    // render grading scale in a popover
    renderSettingsBtn() {
      return html` <simple-icon-button-lite
          icon="settings"
          @click="${this.toggleSettings}"
          id="settings"
          ?disabled="${!this.ready}"
          class="divider-left"
        >
          <span class="hide-900">${this.t.settings}</span>
        </simple-icon-button-lite>
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
    toggleSettings(e) {
      this.hideSettings = !this.hideSettings;
      if (!this.hideSettings) {
        this.hideGradeScale = true;
        this.hideActiveAssignment = true;
        this.hideActiveStudentOverview = true;
      }
    }
    // render active assignment in a popover
    renderActiveAssignmentBtn() {
      return html`<simple-icon-button-lite
          icon="assignment"
          @click="${this.toggleActiveAssignment}"
          id="activeassignmentbtn"
          ?disabled="${!this.ready}"
        >
          <span class="hide-900">${this.t.activeAssignment}</span>
        </simple-icon-button-lite>
        <simple-popover
          ?hidden="${this.hideActiveAssignment}"
          for="activeassignmentbtn"
          auto
        >
          ${this.database.assignments[this.activeAssignment]
            ? html`
                <h3>
                  ${this.database.assignments[this.activeAssignment].name}
                </h3>
                ${this.t.dueDate}:
                <local-time
                  .datetime="${this.database.assignments[this.activeAssignment]
                    ._ISODueDate}"
                  month="short"
                  day="numeric"
                  year="numeric"
                  hour="numeric"
                  minute="numeric"
                  time-zone-name="short"
                >
                </local-time>
              `
            : nothing}
        </simple-popover>`;
    }
    // toggle logic for button
    toggleActiveAssignment(e) {
      this.hideActiveAssignment = !this.hideActiveAssignment;
      if (!this.hideActiveAssignment) {
        this.hideSettings = true;
        this.hideGradeScale = true;
        this.hideActiveStudentOverview = true;
      }
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
        `
      )}`;
    }
    displayModeData() {
      return [
        { label: "Mode 1", icon: "view-array", layout: "1-1-2" },
        { label: "Mode 2", icon: "view-carousel", layout: "1-2-1" },
        { label: "Two windows", icon: "open-in-new", layout: "1-2" },
      ];
    }

    toggleDisplayMode(e) {
      this.displayMode = parseInt(e.target.getAttribute("data-id"));
      // open in new window and drop the assignment display panel
      if (this.displayMode == 2) {
        this.openWindow();
      }
    }
  };
};
