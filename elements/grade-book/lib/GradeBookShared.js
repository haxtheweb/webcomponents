/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Code shared by grade-book and grade-book-lite so a fix lands once:
 * - GradeBookSharedStyles: the one stylesheet both elements use (DDD
 *   surface that follows the page light / dark scheme, toolbar, roster grid,
 *   popovers, tabs, score area)
 * - GradeBookShared: the data, loading and interaction methods both
 *   elements had as copies (source loading, sheet processing, navigation,
 *   roster grid keyboard support and announcements, scoring)
 * Pure helpers live in GradeBookHelpers.js (re-exported here); rendering
 * for the toolbar, roster grid and score area lives in GradeBookUIPieces.js.
 * The tag drag and drop event methods stay in each element, since those
 * events are part of the element's own documented surface.
 */
import { css } from "lit";
import { toJS } from "mobx";
import { set } from "idb-keyval";
import { gSheetInterface } from "@haxtheweb/utils/lib/gSheetsInterface.js";
import {
  normalizeEventPath,
  isElementInViewport,
} from "@haxtheweb/utils/utils.js";
import { XLSXFileSystemBrokerSingleton } from "@haxtheweb/file-system-broker/lib/xlsx-file-system-broker.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDTableStyles } from "@haxtheweb/d-d-d/lib/DDDTable.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { DDDChartStyles } from "@haxtheweb/d-d-d/lib/DDDChart.js";
import { GradeBookStore } from "./grade-book-store.js";

import {
  isGraded,
  gradeBookLetter,
  studentDisplayName,
  GradeBookTagColors,
  gradeBookSeriesIndex,
} from "./GradeBookHelpers.js";
export {
  isGraded,
  gradeBookLetter,
  gradeBookLetterIndex,
  studentDisplayName,
  GradeBookTagColors,
  gradeBookSeriesIndex,
} from "./GradeBookHelpers.js";

export const GradeBookSharedStyles = [
  DDDBlockStyles,
  DDDTableStyles,
  DDDAccentStyles,
  DDDChartStyles,
  css`
    :host {
      display: block;
      --grade-book-surface: light-dark(
        var(--ddd-theme-default-white),
        var(--ddd-theme-default-potentialMidnight)
      );
      --grade-book-ink: light-dark(
        var(--ddd-theme-default-coalyGray),
        var(--ddd-theme-default-white)
      );
      --grade-book-heading: light-dark(
        var(--ddd-theme-default-nittanyNavy),
        var(--ddd-theme-default-white)
      );
      --grade-book-muted: light-dark(
        var(--ddd-theme-default-slateGray),
        var(--ddd-theme-default-limestoneLight)
      );
      --grade-book-line: light-dark(
        var(--ddd-theme-default-limestoneLight),
        var(--ddd-theme-default-slateGray)
      );
      --grade-book-tint: light-dark(
        var(--ddd-theme-default-limestoneMaxLight),
        var(--ddd-theme-default-coalyGray)
      );
      --grade-book-accent: var(
        --ddd-accent-color,
        light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-linkLight)
        )
      );
      --grade-book-accent-tint: var(
        --ddd-accent-color-tint,
        light-dark(
          var(--ddd-theme-default-slateMaxLight),
          var(--ddd-theme-default-nittanyNavy)
        )
      );
      --grade-book-accent-ink: var(
        --ddd-accent-color-ink,
        light-dark(
          var(--ddd-theme-default-white),
          var(--ddd-theme-default-potentialMidnight)
        )
      );
      color: var(--grade-book-ink);
      background-color: var(--grade-book-surface);
      font-family: var(--ddd-font-primary);
    }
    :host([dark]) {
      color-scheme: dark;
    }
    :host [hidden] {
      display: none !important;
    }
    @media (max-width: 900px) {
      .hide-900 {
        display: none;
      }
    }
    .gb-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }
    loading-indicator {
      --loading-indicator-background-color: var(--grade-book-tint);
      --loading-indicator-color: var(--grade-book-accent);
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
      color: var(--grade-book-heading);
    }
    grid-plate {
      --hax-layout-container-transition: none;
      --grid-plate-col-transition: none;
      --grid-plate-item-margin: 0px;
      --grid-plate-item-padding: var(--ddd-spacing-2);
    }
    simple-popover {
      --simple-popover-background-color: var(--grade-book-surface);
      --simple-popover-border-color: var(--grade-book-line);
      --simple-popover-color: var(--grade-book-ink);
      --simple-popover-border-radius: var(--ddd-radius-sm);
    }

    /* frame: toolbar, source picker and roster grid in one DDD block */
    .gb-frame.ddd-block {
      overflow: visible;
      background-color: var(--grade-book-surface);
    }
    .top-controls .ddd-block-header {
      flex-wrap: wrap;
      padding-inline: var(--ddd-spacing-3);
    }
    .top-controls .ddd-block-title {
      font-size: var(--ddd-font-size-4xs);
    }
    .top-controls .ddd-block-label ::slotted(*) {
      margin: 0;
      font: inherit;
    }
    /* the actions shrink and wrap inside the header instead of pushing
       the settings and save buttons out of the element when labels get
       longer (translations) or the block is narrow */
    .top-controls .ddd-block-actions {
      flex: 0 1 auto;
      min-width: 0;
      max-width: 100%;
    }
    .top-controls .ddd-block-action {
      white-space: nowrap;
      max-width: 100%;
    }
    .top-controls .ddd-block-action simple-icon-lite {
      flex: none;
    }
    /* previous/next assignment arrows point along the reading direction;
       simple-icon never mirrors on its own, so flip them in right-to-left
       (the up/down student arrows stay as they are) */
    :host(:dir(rtl)) simple-icon-lite[icon="arrow-back"],
    :host(:dir(rtl)) simple-icon-lite[icon="arrow-forward"] {
      transform: scaleX(-1);
    }
    .ddd-block-action.gb-primary {
      border-color: var(--grade-book-accent);
      background-color: var(--grade-book-accent);
      color: var(--grade-book-accent-ink);
    }
    .ddd-block-action.gb-primary:hover {
      border-color: var(--grade-book-heading);
    }
    .gb-toolbar-nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ddd-spacing-2) var(--ddd-spacing-6);
      padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      border-bottom: var(--ddd-border-xs);
      border-color: var(--grade-book-line);
    }
    .gb-nav-group {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ddd-spacing-2);
      min-width: 0;
    }
    /* the caption box is as wide as the table; keep its text in view */
    #studentgrid .gb-caption-text {
      position: sticky;
      inset-inline-start: var(--ddd-spacing-3);
      display: inline-block;
      max-width: calc(100vw - var(--ddd-spacing-12));
    }
    .gb-nav-current {
      font-weight: var(--ddd-font-weight-bold);
      color: var(--grade-book-heading);
      font-variant-numeric: tabular-nums;
      overflow-wrap: anywhere;
      padding-inline: var(--ddd-spacing-1);
    }
    #activestudentbtn img,
    #activestudentbtn simple-icon-lite {
      --simple-icon-width: var(--ddd-icon-xxs);
      --simple-icon-height: var(--ddd-icon-xxs);
      width: var(--ddd-icon-xxs);
      height: var(--ddd-icon-xxs);
      border-radius: var(--ddd-radius-circle);
      object-fit: cover;
    }
    @media (max-width: 640px) {
      .top-controls .ddd-block-actions {
        flex: 1 1 100%;
        justify-content: flex-start;
      }
      .gb-toolbar-nav {
        gap: var(--ddd-spacing-2);
      }
      .gb-nav-group {
        gap: var(--ddd-spacing-1);
      }
      .gb-nav-current {
        order: -1;
        flex-basis: 100%;
      }
      .top-controls .ddd-block-action.has-text {
        padding-inline: var(--ddd-spacing-2);
      }
    }

    /* roster grid */
    #studentgrid {
      display: block;
      width: 100%;
      height: 52vh;
      max-height: 90vh;
      min-height: 140px; /** about a header row and a student row */
      resize: vertical;
      overflow: auto;
      scroll-padding-block-start: var(--ddd-spacing-16);
      scroll-padding-inline-start: 220px;
      scrollbar-color: var(--grade-book-muted) transparent;
      scrollbar-width: thin;
      border-collapse: separate;
      border-spacing: 0;
    }
    #studentgrid caption {
      padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      font-family: var(--ddd-font-navigation);
      font-weight: var(--ddd-font-weight-medium);
      color: var(--grade-book-muted);
    }
    #studentgrid thead th {
      position: sticky;
      top: 0;
      z-index: 2;
      padding: var(--ddd-spacing-2);
      vertical-align: bottom;
      font-family: var(--ddd-font-navigation);
      text-align: center;
    }
    #studentgrid thead th.student-table-label {
      inset-inline-start: 0;
      z-index: 3;
      text-align: start;
      padding-inline: var(--ddd-spacing-3);
      white-space: nowrap;
    }
    #studentgrid tbody th {
      position: sticky;
      inset-inline-start: 0;
      z-index: 1;
      padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
      vertical-align: middle;
      background-color: var(--grade-book-surface);
      border-inline-end: var(--ddd-border-xs);
      border-inline-end-color: var(--grade-book-line);
    }
    #studentgrid .assignment-name {
      min-width: 88px;
    }
    #studentgrid .gb-col-points {
      display: block;
      font-weight: var(--ddd-font-weight-medium);
      font-size: 0.8em;
      color: var(--grade-book-muted);
      white-space: nowrap;
    }
    #studentgrid td {
      padding: 0;
      text-align: center;
      vertical-align: middle;
    }
    #studentgrid td button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 100%;
      min-width: 88px;
      height: 48px;
      margin: 0;
      padding: 0 var(--ddd-spacing-2);
      border: 0;
      border-radius: 0;
      background-color: transparent;
      color: inherit;
      font: inherit;
      line-height: var(--ddd-lh-120);
      cursor: pointer;
    }
    #studentgrid td button {
      position: relative;
    }
    #studentgrid td button > span {
      pointer-events: none;
    }
    #studentgrid .gb-score {
      font-weight: var(--ddd-font-weight-bold);
      font-variant-numeric: tabular-nums;
      color: var(--grade-book-heading);
    }
    #studentgrid .gb-letter {
      font-family: var(--ddd-font-navigation);
      font-size: 0.75em;
      font-weight: var(--ddd-font-weight-medium);
      color: var(--grade-book-muted);
    }
    #studentgrid .gb-ungraded {
      color: var(--grade-book-muted);
    }
    #studentgrid .col-highlight,
    #studentgrid tbody tr:hover > th,
    #studentgrid tbody tr:hover > td {
      background-color: var(--grade-book-tint);
    }
    #studentgrid td button:hover {
      background-color: var(--grade-book-accent-tint);
    }
    #studentgrid td[data-active] {
      background-color: var(--grade-book-accent-tint);
    }
    #studentgrid td button[aria-current="true"] {
      outline: 2px solid var(--grade-book-accent);
      outline-offset: -3px;
      background-color: var(--grade-book-accent-tint);
    }
    #studentgrid td button:focus-visible {
      outline: 3px solid var(--grade-book-accent);
      outline-offset: -4px;
      box-shadow: inset 0 0 0 5px var(--grade-book-surface);
    }
    #studentgrid tbody tr[data-current] > th {
      background-color: var(--grade-book-accent-tint);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: var(--ddd-spacing-2);
      min-width: 180px;
      font-weight: var(--ddd-font-weight-regular);
    }
    .user-left {
      display: inline-flex;
      flex: none;
    }
    .user-right {
      display: flex;
      flex-wrap: wrap;
      column-gap: 0.3em;
      min-width: 0;
      line-height: var(--ddd-lh-120);
    }
    .user-right .gb-fname,
    .user-right .gb-surname {
      font-weight: var(--ddd-font-weight-bold);
      color: var(--grade-book-heading);
    }
    .user-right .gb-email {
      flex-basis: 100%;
      font-size: 0.8em;
    }
    .user-right div a {
      color: var(--grade-book-muted);
      text-decoration: none;
    }
    .user-right div a:hover,
    .user-right div a:focus,
    .user-right div a:active {
      color: var(--grade-book-heading);
      text-decoration: underline;
    }
    .user-photo {
      --simple-icon-height: var(--ddd-icon-xs);
      --simple-icon-width: var(--ddd-icon-xs);
      --simple-icon-color: var(--grade-book-muted);
      width: var(--ddd-icon-xs);
      height: var(--ddd-icon-xs);
      border-radius: var(--ddd-radius-circle);
      object-fit: cover;
    }

    /* tabs and grading area */
    #studentassessment {
      --a11y-tabs-border-color: var(--grade-book-line);
      --a11y-tabs-color: var(--grade-book-heading);
      --a11y-tabs-focus-color: var(--grade-book-heading);
      --a11y-tabs-faded-color: var(--grade-book-muted);
      --a11y-tabs-faded-background: var(--grade-book-tint);
      --a11y-tabs-border-accent: var(--grade-book-accent);
      --a11y-tabs-content-background: var(--grade-book-surface);
      --a11y-tabs-horizontal-background: var(--grade-book-surface);
      color: var(--grade-book-ink);
      background-color: var(--grade-book-surface);
    }
    #studentassessment::part(content) {
      overflow: auto;
    }
    a11y-collapse {
      --a11y-collapse-border-color: var(--grade-book-line);
      --a11y-collapse-horizontal-padding: var(--ddd-spacing-2);
      --a11y-collapse-vertical-padding: var(--ddd-spacing-1);
      color: var(--grade-book-ink);
    }
    a11y-collapse:not([expanded]):hover {
      background-color: var(--grade-book-tint);
    }
    a11y-collapse div[slot="heading"] {
      font-size: var(--ddd-font-size-4xs);
      font-weight: var(--ddd-font-weight-regular);
      cursor: pointer;
      line-height: var(--ddd-lh-140);
      display: flex;
      align-items: center;
      color: var(--grade-book-heading);
    }
    a11y-collapse[expanded] div[slot="heading"] {
      font-weight: var(--ddd-font-weight-bold);
    }
    .gb-cat-dot {
      display: inline-block;
      flex: none;
      width: 12px;
      height: 12px;
      margin-inline-end: var(--ddd-spacing-2);
      border-radius: var(--ddd-radius-circle);
      background-color: var(--grade-book-dot, var(--ddd-chart-1));
    }
    .active-student-grade-history {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ddd-spacing-1);
      padding-top: var(--ddd-spacing-2);
    }
    .active-student-grade-history letter-grade {
      display: inline-flex;
      margin: 2px;
    }
    .active-student-grade-history button {
      opacity: 0.7;
      background-color: transparent;
      border: 0;
      border-radius: var(--ddd-radius-xs);
      padding: 0;
      margin: 0;
      color: inherit;
      cursor: pointer;
    }
    .active-student-grade-history button.activeAssignment {
      opacity: 1;
      outline: 2px solid var(--grade-book-accent);
      outline-offset: 1px;
      background-color: var(--grade-book-accent-tint);
    }
    .active-student-grade-history button:focus-visible,
    .active-student-grade-history button:hover {
      opacity: 1;
      outline: var(--ddd-focus-ring);
      outline-offset: var(--ddd-focus-offset);
    }
    simple-fields-tag-list {
      --simple-fields-tag-list-possible: var(--grade-book-tint);
      --simple-fields-tag-list-focus: var(--grade-book-accent);
    }
    simple-fields-field[type="textarea"] {
      --simple-fields-font-size: var(--ddd-font-size-4xs);
    }
    simple-tag {
      margin: 2px;
    }
    simple-tag:focus,
    simple-tag:hover {
      --simple-fields-fieldset-border-color: var(--grade-book-accent);
    }

    /* source picker */
    .source-selection {
      text-align: center;
      margin-top: 30vh;
      font-size: var(--ddd-font-size-s);
    }
    .source-selection label {
      display: block;
    }
    .source-selection select {
      font-size: var(--ddd-font-size-4xs);
    }
    #sourcedata,
    #sourcedatablob {
      display: block;
      margin: var(--ddd-spacing-4) auto;
      font-size: var(--ddd-font-size-4xs);
    }

    /* score area: field, out of, letter and lock lay out on one line and
       wrap as a group instead of one character per line */
    .student-feedback-wrap {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: var(--ddd-spacing-4);
    }
    .student-feedback-wrap > .student-feedback-text {
      flex: 1 1 260px;
      min-width: 0;
      margin: 0;
    }
    .student-feedback-text div.heading {
      padding: var(--ddd-spacing-5);
    }
    .student-feedback-wrap .student-feedback-score {
      display: flex;
      flex: 0 1 auto;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ddd-spacing-2);
      min-width: 0;
      padding: var(--ddd-spacing-2) 0;
      font-size: var(--ddd-font-size-4xs);
    }
    .student-feedback-score .gb-out-of {
      white-space: nowrap;
      color: var(--grade-book-muted);
    }
    .student-feedback-score .ddd-block-action[aria-pressed="true"] {
      border-color: var(--grade-book-line);
      background-color: transparent;
      color: var(--grade-book-heading);
    }
    #totalpts {
      flex: none;
      width: auto;
      margin: 0;
      --simple-fields-font-size: var(--ddd-font-size-xs);
    }
    #totalpts::part(label) {
      white-space: nowrap;
      padding-inline-end: var(--ddd-spacing-2);
    }
    #totalpts::part(option-input) {
      box-sizing: border-box;
      width: 4.5em;
      font-variant-numeric: tabular-nums;
    }
    .active-submission a {
      color: light-dark(
        var(--ddd-theme-default-link),
        var(--ddd-theme-default-linkLight)
      );
    }
    .student-feedback-score letter-grade {
      flex: none;
      --letter-grade-wrap-height: 28px;
      --letter-grade-wrap-width: 28px;
      --letter-grade-wrap-padding: 6px;
      --letter-grade-wrap-border: 2px solid var(--grade-book-line);
      --letter-grade-letter-font-size: var(--ddd-font-size-4xs);
      --letter-grade-letter-line-height: 28px;
    }
    .student-feedback-score-heading {
      display: flex;
      font-size: var(--ddd-font-size-s);
      font-weight: var(--ddd-font-weight-bold);
      line-height: var(--ddd-lh-120);
      padding: var(--ddd-spacing-2);
    }
    .student-feedback-score-heading h3 {
      margin-block: 0;
      margin-inline: var(--ddd-spacing-2) 0;
      padding: 0;
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
      inset-inline-end: 40px;
      margin-top: -20px;
    }
    editable-table-display::part(td),
    editable-table-display::part(th) {
      text-align: center;
      vertical-align: top;
      max-width: 250px;
    }
    editable-table-display::part(simple-fields-field) {
      --simple-fields-font-size: var(--ddd-font-size-l);
      --simple-fields-text-align: center;
      background-color: transparent;
      max-width: 100px;
      padding: 0 0 28px 0;
      margin: 0;
    }
  `,
];

export const GradeBookShared = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      // roster grid: the cell holding the single tab stop when it is not
      // the active cell (null = follow the active cell)
      this.__gridFocus = null;
    }
    willUpdate(changedProperties) {
      if (super.willUpdate) {
        super.willUpdate(changedProperties);
      }
      // the tab stop follows the active cell whenever that changes
      if (
        changedProperties.has("activeStudent") ||
        changedProperties.has("activeAssignment")
      ) {
        this.__gridFocus = null;
      }
    }
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      // announce a change of student / assignment, not the first load
      const moved =
        (changedProperties.has("activeStudent") &&
          changedProperties.get("activeStudent") !== undefined) ||
        (changedProperties.has("activeAssignment") &&
          changedProperties.get("activeAssignment") !== undefined);
      if (moved && this.ready) {
        this.announceActiveSelection();
      }
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
      for (let i in this.database.submissions) {
        let row = this.database.submissions[i];
        // look for student, need a match before we render anything;
        // the roster / the active student's roster row can be missing
        // entirely while sheet data is still streaming in (mid-pipeline
        // loads and failed sheet fetches), so resolve the row before
        // reading it (see the activeSubmission guard in the store)
        if (
          this.database.roster &&
          this.database.roster[activeStudent] &&
          row.student === this.database.roster[activeStudent].student
        ) {
          for (let j in row) {
            if (j !== "student") {
              let a = this.getAssignmentByShortName(j);
              if (a) {
                response.push({
                  // a missing, empty or non-numeric grade is "not graded"
                  // (null), never undefined, which letter-grade read as an F
                  studentScore:
                    this.database.grades &&
                    this.database.grades[activeStudent] &&
                    isGraded(this.database.grades[activeStudent][j])
                      ? this.database.grades[activeStudent][j]
                      : null,
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
          String(item.shortName) ===
          String(this.database.assignments[this.activeAssignment].rubric)
        );
      });
    }
    disconnectedCallback() {
      if (this.__resizeObserver) {
        this.__resizeObserver.disconnect();
        this.__resizeObserver = null;
      }
      if (this.__resizer) {
        clearTimeout(this.__resizer);
        this.__resizer = null;
      }
      if (this.__xlsxFileSystemDataHandler) {
        globalThis.removeEventListener(
          "xlsx-file-system-data",
          this.__xlsxFileSystemDataHandler,
        );
        this.__xlsxFileSystemDataHandler = null;
        this.__applied = false;
      }
      for (let i in this.__disposer) {
        const disposer = this.__disposer[i];
        if (typeof disposer === "function") {
          disposer();
        } else if (disposer && typeof disposer.dispose === "function") {
          disposer.dispose();
        }
      }
      this.__disposer = [];
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }
    /**
     * Finish an import. database is what the source just loaded; it is read
     * directly because this.database only receives the store's copy a
     * microtask later (through the autorun), so reading this.database here
     * missed the grade scale for json / url sources and left every letter
     * grade and letter grade picker empty.
     */
    importStateCleanup(database) {
      this.loading = false;
      const candidates = [
        database,
        toJS(GradeBookStore.database),
        this.database,
      ];
      for (let i = 0; i < candidates.length; i++) {
        const db = candidates[i];
        if (db && db.gradeScale && db.gradeScale.length > 0) {
          GradeBookStore.gradeScale = toJS(db.gradeScale);
          break;
        }
      }
      this.requestUpdate();
      this.ready = true;
    }
    transformTable(table) {
      let tmp = table.shift();
      let headings = {};
      let data = [];
      for (let i in tmp) {
        headings[tmp[i]] = i;
      }
      for (let i in table) {
        let item = {};
        for (let j in headings) {
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
      for (let i in data) {
        if (data[i].dueDate !== "") {
          try {
            const event = new Date(`${data[i].dueDate} ${data[i].dueTime}`);
            data[i]._ISODueDate = event.toISOString();
          } catch {
            // intentionally empty
          }
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
      for (let i in data) {
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
      for (let i in data) {
        data[i].qualitative = data[i].qualitative
          ? data[i].qualitative.split(",")
          : [];
      }
      return data;
    }
    processrosterData(data) {
      for (let i in data) {
        data[i].interests = data[i].interests
          ? data[i].interests.split(",")
          : [];
      }
      return data;
    }
    processsettingsData(data) {
      let d = {};
      for (let i in data) {
        d[data[i].key] = data[i].value;
      }
      return d;
    }
    /**
     * prev / next value of the control that was clicked; a click can land on
     * the icon or the text inside the button, so resolve the element that
     * carries the value
     */
    _navValue(e) {
      const nodes = [e.currentTarget, ...normalizeEventPath(e)];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node && node.getAttribute && node.getAttribute("value")) {
          return node.getAttribute("value");
        }
      }
      return null;
    }
    async changeStudent(e) {
      this.shadowRoot
        .querySelectorAll("#studentgrid .th-or-td")
        .forEach((el) => {
          el.classList.remove("col-highlight");
        });
      const value = this._navValue(e);
      if (value === "prev" && 0 !== this.activeStudent) {
        GradeBookStore.activeStudent--;
      } else if (
        value === "next" &&
        this.database.roster.length - 1 !== this.activeStudent
      ) {
        GradeBookStore.activeStudent++;
      }
      await this.requestUpdate();
    }
    async changeAssignment(e) {
      this.shadowRoot
        .querySelectorAll("#studentgrid .th-or-td")
        .forEach((el) => {
          el.classList.remove("col-highlight");
        });
      const value = this._navValue(e);
      if (value === "prev" && 0 !== this.activeAssignment) {
        GradeBookStore.activeAssignment--;
      } else if (
        value === "next" &&
        this.database.assignments.length - 1 !== GradeBookStore.activeAssignment
      ) {
        GradeBookStore.activeAssignment++;
      }
      await this.requestUpdate();
    }
    studentLetterGradeHistoryClick(e) {
      // ensure this is numeric
      GradeBookStore.activeAssignment = parseInt(e.target.value);
      this.requestUpdate();
    }
    /**
     * First node in the event path carrying the attribute; clicks and
     * pointer moves can land on the score / letter inside a grid cell
     */
    _gridTarget(e, attr) {
      const path = normalizeEventPath(e) || [];
      for (let i = 0; i < path.length; i++) {
        const node = path[i];
        if (node && node.getAttribute && node.getAttribute(attr) !== null) {
          return node;
        }
        if (node && node.id === "studentgrid") {
          return null;
        }
      }
      return null;
    }
    activateOption(e) {
      const target = this._gridTarget(e, "data-student");
      if (
        target &&
        target.getAttribute("data-student") &&
        target.getAttribute("data-assignment")
      ) {
        GradeBookStore.activeAssignment = parseInt(
          target.getAttribute("data-assignment"),
        );
        GradeBookStore.activeStudent = parseInt(
          target.getAttribute("data-student"),
        );
        // if we collapsed this but then select a specific assignment / student
        // then let's focus the user on this
        const grid = this.shadowRoot.querySelector("#studentgrid");
        if (grid) {
          grid.style.height = "140px";
          this.maintainScrollPosition();
        }
      }
    }
    mouseHighlight(e) {
      let active = this._gridTarget(e, "data-assignment");
      clearTimeout(this.__mdebounce);
      this.__mdebounce = setTimeout(() => {
        if (
          active &&
          active.getAttribute("data-assignment") !==
            this.__activeHoverAssignment
        ) {
          this.shadowRoot
            .querySelectorAll(
              '#studentgrid .th-or-td[data-assignment="' +
                this.__activeHoverAssignment +
                '"]',
            )
            .forEach((el) => {
              el.classList.remove("col-highlight");
            });
          // set active so we can clear it on previous
          this.__activeHoverAssignment = active.getAttribute("data-assignment");
          this.shadowRoot
            .querySelectorAll(
              '#studentgrid .th-or-td[data-assignment="' +
                this.__activeHoverAssignment +
                '"]',
            )
            .forEach((el) => {
              el.classList.add("col-highlight");
            });
        }
      }, 10);
    }
    mouseLeave(_e) {
      clearTimeout(this.__mdebounce);
      this.__mdebounce = setTimeout(() => {
        this.shadowRoot
          .querySelectorAll("#studentgrid .th-or-td")
          .forEach((el) => {
            el.classList.remove("col-highlight");
          });
      }, 100);
    }
    handleGridScaling(e) {
      let paths = normalizeEventPath(e);
      if (paths[0].tagName === "TABLE") {
        // toggle between height
        if (paths[0].style.height !== "") {
          paths[0].style.height = null;
        } else {
          paths[0].style.height = "90vh";
        }
      }
    }
    /**
     * maintain scroll position within the table overflow scroll whenever assignment or student changes
     */
    maintainScrollPosition() {
      // ensure we maintain visibility of the active student / assignment
      // in our studentgrid; delay to ensure paints before visibility
      if (
        this.shadowRoot &&
        this.shadowRoot.querySelector("#studentgrid [data-active]")
      ) {
        setTimeout(() => {
          // re-query: the grid can re-render (or the element can be torn
          // down) between scheduling this and it running, e.g. while a
          // source import swaps the database, which left [data-active]
          // null here and threw on getBoundingClientRect
          const grid = this.shadowRoot
            ? this.shadowRoot.querySelector("#studentgrid")
            : null;
          const active = grid ? grid.querySelector("[data-active]") : null;
          if (!grid || !active) {
            return;
          }
          let offset = 192;
          let isVisible = isElementInViewport(active, {
            top: 0,
            right: globalThis.innerWidth,
            bottom: grid.getBoundingClientRect().height + 20,
            left: offset,
          });
          if (GradeBookStore.activeStudent === 0) {
            grid.scrollTop = 0;
          } else if (!isVisible) {
            grid.scrollTop = active.offsetTop - grid.offsetTop;
          }
          // left to right
          if (GradeBookStore.activeAssignment === 0) {
            grid.scrollLeft = 0;
          } else if (!isVisible) {
            grid.scrollLeft = active.offsetLeft - offset - grid.offsetLeft;
          }
        }, 0);
      }
    }
    selectSource(_e) {
      this.source = this.shadowRoot.querySelector("#source").value;
    }
    loadFromSource(_e) {
      this.source = this.shadowRoot.querySelector("#source").value;
      if (this.source === "json") {
        this.sourceData =
          this.shadowRoot.querySelector("#sourcedatablob").value;
      } else if (this.source === "filesystem") {
        this.loadFromFilesystem();
      } else {
        this.sourceData = this.shadowRoot.querySelector("#sourcedata").value;
      }
    }
    loadFromExistingSource(_e) {
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
    async saveToFilesystem(_e) {
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
      for (let i in Array.from(tables)) {
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
    toggleLock(_e) {
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
      for (let i in Array.from(tables)) {
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
      this.activeGrading[e.detail.getAttribute("data-criteria")][
        e.detail.label
      ] = e.detail.tagList;
      this.requestUpdate();
    }
    // accent-color name for a tag category by its index. The names follow
    // the DDD chart series order (see GradeBookTagColors) so the category
    // dot (--ddd-chart-N) and the tag colour agree; still a name, so the
    // tag data model (tag.color) is unchanged
    pickColor(val) {
      return GradeBookTagColors[gradeBookSeriesIndex(val)];
    }
    // CSS colour of the DDD chart series for a tag category index
    pickChartColor(val) {
      return `var(--ddd-chart-${gradeBookSeriesIndex(val) + 1})`;
    }
    /**
     * Score stored for a student / assignment, or null when not graded
     */
    gradeFor(studentIndex, assignment) {
      const grades = this.database ? this.database.grades : null;
      if (!assignment || !grades || !grades[studentIndex]) {
        return null;
      }
      const value = grades[studentIndex][assignment.shortName];
      return isGraded(value) ? value : null;
    }
    // letter for a score on the current grade scale ("" when not graded)
    letterFor(score, points) {
      return gradeBookLetter(score, points, toJS(GradeBookStore.gradeScale));
    }
    // "17 of 20, B+" / "Not graded"; pass letter when already known
    gradeValueText(score, points, letter) {
      if (!isGraded(score)) {
        return this.t.notGraded;
      }
      const value = this.t.gradeValue
        .replace("{score}", () => score)
        .replace("{points}", () => points);
      const l = letter === undefined ? this.letterFor(score, points) : letter;
      return l ? `${value}, ${l}` : value;
    }
    /**
     * "Yet more, docProp, 17 of 20, B+" for the active student / assignment
     */
    activeSelectionText() {
      const db = this.database || {};
      const student = db.roster ? db.roster[this.activeStudent] : null;
      const assignment = db.assignments
        ? db.assignments[this.activeAssignment]
        : null;
      if (!student || !assignment) {
        return "";
      }
      return [
        studentDisplayName(student),
        assignment.shortName,
        this.gradeValueText(
          this.gradeFor(this.activeStudent, assignment),
          assignment.points,
        ),
      ].join(", ");
    }
    // write the selection into the polite live region
    announceActiveSelection() {
      const region =
        this.shadowRoot && this.shadowRoot.querySelector("#gbannounce");
      if (region) {
        region.textContent = this.activeSelectionText();
      }
    }
    /**
     * Roster grid keyboard support: the grid is one tab stop (roving
     * tabindex). Arrow keys move between cells, Home / End go to the ends
     * of the row, Ctrl+Home / Ctrl+End to the first / last cell. Enter and
     * Space are the cell button's own click, so they activate the cell the
     * same way a mouse click does.
     */
    async gridKeydown(e) {
      const cell = this._gridTarget(e, "data-student");
      const db = this.database || {};
      if (!cell || !db.roster || !db.assignments) {
        return;
      }
      const rows = db.roster.length;
      const cols = db.assignments.length;
      let s = parseInt(cell.getAttribute("data-student"));
      let a = parseInt(cell.getAttribute("data-assignment"));
      const rtl = globalThis.getComputedStyle(this).direction === "rtl";
      const ctrl = e.ctrlKey || e.metaKey;
      switch (e.key) {
        case "ArrowUp":
          s--;
          break;
        case "ArrowDown":
          s++;
          break;
        case "ArrowLeft":
          a = rtl ? a + 1 : a - 1;
          break;
        case "ArrowRight":
          a = rtl ? a - 1 : a + 1;
          break;
        case "Home":
          a = 0;
          if (ctrl) {
            s = 0;
          }
          break;
        case "End":
          a = cols - 1;
          if (ctrl) {
            s = rows - 1;
          }
          break;
        default:
          return;
      }
      e.preventDefault();
      s = Math.max(0, Math.min(rows - 1, s));
      a = Math.max(0, Math.min(cols - 1, a));
      this.__gridFocus = { student: s, assignment: a };
      this.requestUpdate();
      await this.updateComplete;
      this.focusGridCell(s, a);
    }
    // put focus on a roster grid cell and scroll it into view
    focusGridCell(s, a) {
      const button = this.shadowRoot.querySelector(
        `#studentgrid button[data-student="${s}"][data-assignment="${a}"]`,
      );
      if (button) {
        button.focus({ preventScroll: true });
        button.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }
    /**
     * Window height maths for the grading tabs used to assume a 36px
     * toolbar; add however much taller the toolbar is now (it wraps on
     * small screens)
     */
    toolbarOffset(base) {
      const bar =
        this.shadowRoot && this.shadowRoot.querySelector(".top-controls");
      const extra = bar ? Math.max(0, bar.offsetHeight - 36) : 0;
      return base + extra;
    }
    // the cell that holds the grid's single tab stop
    gridTabStop() {
      if (this.__gridFocus) {
        return this.__gridFocus;
      }
      return {
        student: this.activeStudent || 0,
        assignment: this.activeAssignment || 0,
      };
    }
    /**
     * Load the gradebook from the current source / sourceData. Every source
     * ends in importStateCleanup(database) with the database it just loaded.
     */
    loadSourceData() {
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
              for (let i in this.gSheet.sheetGids) {
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
              this.importStateCleanup(this.database);
            }, 0);
            break;
          case "url":
            this.loading = true;
            fetch(this.sourceData)
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                // a non-ok response has no database to parse; warn and
                // leave the store untouched instead of writing undefined
                // into it and corrupting every autorun downstream
                console.warn(
                  `${this.tagName.toLowerCase()} URL source request failed: ${response.status}`,
                );
                return null;
              })
              .then((json) => {
                if (json) {
                  GradeBookStore.database = json;
                  this.importStateCleanup(json);
                }
              })
              .catch((error) => {
                console.warn(error);
              });
            break;
          case "json": {
            const json = JSON.parse(this.sourceData);
            GradeBookStore.database = json;
            this.importStateCleanup(json);
            break;
          }
        }
      } else if (this.source === "filesystem") {
        if (!this.__applied) {
          this.__applied = true;
          // this listener gets the event from the service worker
          this.__xlsxFileSystemDataHandler = (e) => {
            let database = e.detail.data;
            for (let i in database) {
              let loadedData = this.transformTable(database[i]);
              if (typeof this[`process${i}Data`] === "function") {
                loadedData = this[`process${i}Data`](loadedData);
              }
              GradeBookStore.database[i] = loadedData;
            }
            this.importStateCleanup(GradeBookStore.database);
          };
          globalThis.addEventListener(
            "xlsx-file-system-data",
            this.__xlsxFileSystemDataHandler,
          );
        }
      }
    }
  };
};
