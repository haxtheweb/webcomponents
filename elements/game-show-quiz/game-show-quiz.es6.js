/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import "@vaadin/vaadin-split-layout/vaadin-split-layout.js";
import "@lrnwebcomponents/multiple-choice/multiple-choice.js";
import "./lib/game-show-quiz-modal.js";
/**
 * `game-show-quiz`
 * `Simple game show with questions and answers`
 * @microcopy - the mental model for this element
 * - game show - a display board in the style of Jeopardy
 * @demo demo/index.html
 * @customElement game-show-quiz
 */
class GameShowQuiz extends MutableData(PolymerElement) {
  static get tag() {
    return "game-show-quiz";
  }
  constructor() {
    super();
    window.SimpleToast.requestAvailability();
    import("@polymer/iron-image/iron-image.js");
    import("@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js");
    import("@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js");
    import("@polymer/app-layout/app-drawer/app-drawer.js");
    import("@polymer/app-layout/app-header/app-header.js");
    import("@polymer/app-layout/app-toolbar/app-toolbar.js");
    import("@polymer/iron-flex-layout/iron-flex-layout.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@lrnwebcomponents/chartist-render/chartist-render.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --game-show-bg-color: var(--simple-colors-default-theme-blue-11);
          --game-show-text-color: var(--simple-colors-default-theme-blue-1);
        }
        chartist-render#piechart {
          width: 300px;
          height: 300px;
          display: inline-block;
        }
        chartist-render.mini-chart {
          width: 132px;
          height: 132px;
          display: inline-block;
          --chartist-color-1: green;
          --chartist-color-2: red;
        }
        app-toolbar {
          background-color: var(--game-show-bg-color);
          color: var(--game-show-text-color);
          font-size: 24px;
          display: flex;
        }
        iron-icon {
          display: inline-block;
        }
        table {
          width: 90%;
        }
        tr {
          outline: 1px solid black;
        }
        td {
          border-left: 1px solid black;
          padding: 16px;
          text-align: center;
        }
        .chart-row td {
          padding: 0;
        }

        paper-button {
          --paper-button-ink-color: var(--game-show-bg-color);
          text-transform: none;
          display: block;
        }
        #helpbutton {
          text-align: center;
          padding: 8px;
          font-size: 12px;
          vertical-align: middle;
          display: inline-flex;
        }
        paper-button + [main-title] {
          margin-left: 24px;
          display: inline-flex;
        }
        app-header {
          color: var(--game-show-text-color);
          --app-header-background-rear-layer: {
            background-color: #ef6c00;
          }
        }
        responsive-grid-row {
          --responsive-grid-row-inner-margin-left: 0;
          --responsive-grid-row-inner-margin-right: 0;
        }
        responsive-grid-col {
          --responsive-grid-col-inner-padding-left: 0;
          --responsive-grid-col-inner-padding-right: 0;
        }
        #contentcontainer {
          margin: 0 auto;
          font-size: 16px;
        }
        .grid-button {
          width: 100%;
          height: 80px;
          font-size: 24px;
          text-align: center;
          min-width: unset;
          padding: 0;
          margin: 0;
          align-items: center;
          display: flex;
        }
        .status-icon {
          border-radius: 50%;
          width: 48px;
          height: 48px;
          opacity: 0.5;
          right: 0;
          bottom: 0;
          position: absolute;
        }
        .correct {
          color: var(--simple-colors-default-theme-green-6);
          background-color: var(--simple-colors-default-theme-green-11);
        }
        .incorrect {
          color: var(--simple-colors-default-theme-red-6);
          background-color: var(--simple-colors-default-theme-red-11);
        }
        .row-0 paper-button[disabled] {
          font-weight: bold;
          font-size: 16px;
        }
        .grid-button[data-type="bonus"] {
          display: inline-flex;
          position: absolute;
          outline: 1px solid #dddddd;
        }
        .grid-button[data-type="bonus"][data-display-points="1"] {
          height: 320px;
        }
        .grid-button[data-type="bonus"][data-display-points="2"] {
          height: 160px;
        }
        @media screen and (max-width: 600px) {
          app-toolbar {
            font-size: 14px;
          }
          paper-button {
            padding: 0;
            margin: 0;
            width: 16px;
            height: 16px;
            min-width: unset;
          }
          game-show-quiz-modal paper-button {
            height: 48px;
            width: 100%;
          }
          .grid-button {
            font-size: 14px;
          }
          .status-icon {
            width: 24px;
            height: 24px;
            opacity: 1;
            display: inline-block;
          }
          .row-0 paper-button[disabled] {
            font-weight: bold;
            font-size: 10px;
          }
        }
      </style>
      <app-header>
        <app-toolbar>
          <paper-button id="scorebutton" on-click="scoreBoardToggle">
            <iron-icon icon="editor:pie-chart"></iron-icon
            ><label for="scorebutton">Score board</label>
          </paper-button>
          <div main-title>[[title]]</div>
          <paper-button id="helpbutton" on-click="directionsToggle">
            <iron-icon icon="help"></iron-icon
            ><label for="helpbutton">Directions</label>
          </paper-button>
        </app-toolbar>
      </app-header>
      <div id="contentcontainer">
        <div style="font-size: 24px;" hidden$="[[!remainingAttempts]]">
          Points Remaining to Attempt:
          <strong>[[remainingAttempts]]</strong>
        </div>
        <template is="dom-repeat" items="[[gameBoard]]" as="row" mutable-data>
          <responsive-grid-row gutter="0" class\$="row row-[[index]]">
            <template
              is="dom-repeat"
              items="[[row.cols]]"
              as="col"
              mutable-data
            >
              <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2">
                <paper-button
                  class="grid-button"
                  raised="[[!col.notRaised]]"
                  data-question-uuid\$="[[col.uuid]]"
                  data-value\$="[[col.points]]"
                  data-display-points\$="[[col.displayPoints]]"
                  data-is-bonus\$="[[col.isBonus]]"
                  data-type\$="[[col.type]]"
                  disabled\$="[[col.disabled]]"
                  >[[col.title]]<br />[[col.displayPoints]]</paper-button
                >
              </responsive-grid-col>
            </template>
          </responsive-grid-row>
        </template>
      </div>
      <game-show-quiz-modal id="scoreboard" title="Score board">
        <div slot="content">
          <div style="padding: 32px;">
            <chartist-render
              id="piechart"
              chart-title="Breakdown of attempts"
              data="[[attemptsData.overall]]"
              type="pie"
              scale="ct-square"
            >
            </chartist-render>
            <table style="margin: 16px auto;">
              <tbody>
                <tr>
                  <th></th>
                  <th>Slide ID</th>
                  <th>Terms</th>
                  <th>Reading</th>
                  <th>Lecture</th>
                  <th>Total</th>
                </tr>
                <tr>
                  <th>Points Earned</th>
                  <td>[[points.slideid.earned]]</td>
                  <td>[[points.terminology.earned]]</td>
                  <td>[[points.reading.earned]]</td>
                  <td>[[points.lecture.earned]]</td>
                  <td>[[points.total.earned]]</td>
                </tr>
                <tr>
                  <th>Points Attempted</th>
                  <td>[[points.slideid.attempted]]</td>
                  <td>[[points.terminology.attempted]]</td>
                  <td>[[points.reading.attempted]]</td>
                  <td>[[points.lecture.attempted]]</td>
                  <td>[[points.total.attempted]]</td>
                </tr>
                <tr>
                  <th>Category Percentage</th>
                  <td>[[points.slideid.percent]]</td>
                  <td>[[points.terminology.percent]]</td>
                  <td>[[points.reading.percent]]</td>
                  <td>[[points.lecture.percent]]</td>
                  <td>[[points.total.percent]]</td>
                </tr>
                <tr class="chart-row">
                  <th>Pie chart</th>
                  <td>
                    <chartist-render
                      class="mini-chart"
                      chart-title="Slide ID percentage"
                      data="[[attemptsData.slideid]]"
                      type="pie"
                      scale="ct-square"
                    ></chartist-render>
                  </td>
                  <td>
                    <chartist-render
                      class="mini-chart"
                      chart-title="Terminology percentage"
                      data="[[attemptsData.terminology]]"
                      type="pie"
                      scale="ct-square"
                    ></chartist-render>
                  </td>
                  <td>
                    <chartist-render
                      class="mini-chart"
                      chart-title="Reading percentage"
                      data="[[attemptsData.reading]]"
                      type="pie"
                      scale="ct-square"
                    ></chartist-render>
                  </td>
                  <td>
                    <chartist-render
                      class="mini-chart"
                      chart-title="Lecture percentage"
                      data="[[attemptsData.lecture]]"
                      type="pie"
                      scale="ct-square"
                    ></chartist-render>
                  </td>
                  <td>
                    <chartist-render
                      class="mini-chart"
                      chart-title="Total percentage"
                      data="[[attemptsData.total]]"
                      type="pie"
                      scale="ct-square"
                    ></chartist-render>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="font-size: 24px;" hidden$="[[!remainingAttempts]]">
              Points Remaining to Attempt:
              <strong>[[remainingAttempts]]</strong>
            </div>
          </div>
        </div>
        <paper-button
          aria-label="Close score board and return to game"
          slot="buttons"
          id="dismiss"
          dialog-confirm
          raised
          >Return to game board</paper-button
        >
      </game-show-quiz-modal>
      <game-show-quiz-modal id="directions" title="[[directionsTitle]]">
        <div slot="content"><slot></slot></div>
        <paper-button
          aria-label="Close directions dialog and return to game"
          slot="buttons"
          id="dismiss"
          dialog-confirm
          raised
          >Good luck!</paper-button
        >
      </game-show-quiz-modal>
      <game-show-quiz-modal
        id="dialog"
        title="[[questionTitle]] [[__activeQuestionDetails.points]] point, [[__activeQuestionDetails.type]] question."
      >
        <vaadin-split-layout slot="content" style="height:80vh;">
          <div id="col1" style="width:70%;min-width: 30%;">
            <iron-image
              style="min-width:100px; width:100%; min-height:50vh; height:75vh;"
              sizing="contain"
              preload=""
              src\$="[[activeQuestion.image]]"
            ></iron-image>
          </div>
          <div id="col2" style="width:30%;min-width: 30%;">
            <multiple-choice
              randomize
              single-option
              id="question"
              hide-buttons
              title="[[activeQuestion.title]]"
              answers="[[activeQuestion.data]]"
            ></multiple-choice>
            <div hidden\$="[[!activeQuestion.wrong]]" aria-hidden="true">
              <h3>Feedback</h3>
              <p>[[activeQuestion.feedback]]</p>
            </div>
          </div>
        </vaadin-split-layout>
        <paper-button
          slot="buttons"
          hidden\$="[[activeQuestion.submitted]]"
          id="submit"
          raised=""
          disabled\$="[[__submitDisabled]]"
          >Submit answer
          <iron-icon
            hidden$="[[__submitDisabled]]"
            icon="icons:touch-app"
          ></iron-icon
        ></paper-button>
        <paper-button
          slot="buttons"
          id="continue"
          hidden\$="[[!activeQuestion.submitted]]"
          dialog-confirm
          raised
          aria-disabled\$="[[activeQuestion.submitted]]"
          aria-label="Return to game board"
          >Continue <iron-icon icon="icons:arrow-forward"></iron-icon
        ></paper-button>
      </game-show-quiz-modal>
      <iron-ajax
        auto
        id="gamedata"
        url="[[gameData]]"
        handle-as="json"
        last-response="{{gameBoardData}}"
      ></iron-ajax>
      <iron-ajax
        auto
        id="gamedirections"
        url="[[gameDirectionsData]]"
        handle-as="text"
        last-response="{{gameDirections}}"
      ></iron-ajax>
      <iron-ajax id="gamebackend" hand-as="json"></iron-ajax>
    `;
  }
  /**
   * Support loading directions from a URL / end point
   */
  _gameDirectionsChanged(newValue) {
    if (newValue) {
      wipeSlot(this);
      let div = document.createElement("div");
      div.style = "padding: 16px;";
      div.innerHTML = newValue;
      this.appendChild(div.cloneNode(true));
    }
  }
  static get properties() {
    return {
      /**
       * Title
       */
      title: {
        type: String
      },
      gameDirectionsData: {
        type: String
      },
      gameDirections: {
        type: String,
        observer: "_gameDirectionsChanged"
      },
      token: {
        type: String
      },
      attemptsData: {
        type: Object,
        value: {
          overall: {
            labels: ["Slide ID", "Terminology", "Reading", "Lecture"],
            series: [0, 0, 0, 0]
          },
          slideid: {
            labels: ["Correct", "Incorrect"],
            series: [0, 0]
          },
          terminology: {
            labels: ["Correct", "Incorrect"],
            series: [0, 0]
          },
          reading: {
            labels: ["Correct", "Incorrect"],
            series: [0, 0]
          },
          lecture: {
            labels: ["Correct", "Incorrect"],
            series: [0, 0]
          },
          bonus: {
            labels: ["Correct", "Incorrect"],
            series: [0, 0]
          },
          total: {
            labels: ["Correct", "Incorrect"],
            series: [0, 0]
          }
        }
      },
      /**
       * Points object
       */
      points: {
        type: Object,
        value: {
          slideid: {
            attempted: 0,
            earned: 0,
            percent: 0
          },
          terminology: {
            attempted: 0,
            earned: 0,
            percent: 0
          },
          reading: {
            attempted: 0,
            earned: 0,
            percent: 0
          },
          lecture: {
            attempted: 0,
            earned: 0,
            percent: 0
          },
          bonus: {
            attempted: 0,
            earned: 0,
            percent: 0
          },
          total: {
            attempted: 0,
            earned: 0,
            percent: 0
          }
        }
      },
      /**
       * Remaining attempts for the user
       */
      remainingAttempts: {
        type: Number,
        value: 30
      },
      /**
       * Title to use on the directions dialog.
       */
      directionsTitle: {
        type: String,
        value: "Directions"
      },
      /**
       * Title to use on the question dialog.
       */
      questionTitle: {
        type: String,
        value: "Answer the following"
      },
      /**
       * Rows on the gameshow board
       */
      gameBoard: {
        type: Array
      },
      gameBoardData: {
        type: Object,
        observer: "_gameBoardDataChanged"
      },
      /**
       * URL to load data for the game.
       */
      gameData: {
        type: String
      },
      gameScoreBoardBackend: {
        type: String
      },
      /**
       * Active item that is in the modal.
       */
      activeQuestion: {
        type: Object
      }
    };
  }
  /**
   * Toggle the directions to appear
   */
  directionsToggle(e) {
    this.shadowRoot.querySelector("#directions").toggle();
  }
  /**
   * Toggle the directions to appear
   */
  scoreBoardToggle(e) {
    this.shadowRoot.querySelector("#scoreboard").toggle();
  }
  /**
   * Continue button pressed.
   */
  continueGameTap(e) {
    // destroy this so it rebuilds every time for correct target element
    // while focusing on the next item just to place keyboard focus more
    // logically
    if (
      typeof this.__activeTap !== typeof undefined &&
      this.__activeTap.parentNode.nextElementSibling.firstElementChild != null
    ) {
      this.__activeTap.parentNode.nextElementSibling.firstElementChild.focus();
      delete this.__activeTap;
    }
  }
  /**
   * Register a tap on the board.
   */
  registerTap(e) {
    var found = true;
    for (var i in this.shadowRoot.querySelector("#question").answers) {
      if (this.shadowRoot.querySelector("#question").answers[i].userGuess) {
        found = false;
      }
    }
    // ensure they touch the board before ability to submit
    this.__submitDisabled = found;
  }
  /**
   * Submit answer to see what they got.
   */
  submitAnswer(e) {
    // reset attemptsData for chartist and rebuild fully throughout
    let attemptsData = this.attemptsData;
    // flip submitted status
    this.set("activeQuestion.submitted", true);
    this.notifyPath("activeQuestion.submitted");
    this.shadowRoot.querySelector("#continue").focus();
    // maker this disabled on the board
    this.__activeTap.disabled = true;
    // start to build a status icon
    let icon = document.createElement("iron-icon");
    icon.classList.add("status-icon");
    var total = 0;
    if (this.__activeType != "bonus" && !this.__activeQuestionDetails.isBonus) {
      // update attempts for the category
      let num =
        parseInt(this.points[this.__activeType].attempted) +
        parseInt(this.__activeValue);
      this.set("points." + this.__activeType + ".attempted", num);
      this.notifyPath("points." + this.__activeType + ".attempted");
      total =
        parseInt(this.points.total.attempted) + parseInt(this.__activeValue);
      // update the global totals for attempt
      this.set("points.total.attempted", total);
      this.notifyPath("points.total.attempted");
      // update remaining attempts
      this.remainingAttempts =
        this.remainingAttempts - parseInt(this.__activeValue);
    }
    // do a detection for per value type level being filled in to unlock the assoicated bonus question
    if (!this.__activeQuestionDetails.isBonus) {
      let unlockCheck = 0;
      let unlockThreashold = 100;
      let boardCol = 0;
      for (var t in this._gameBoardFlat) {
        // only count things that are disabled
        if (
          !this._gameBoardFlat[t].isBonus &&
          this._gameBoardFlat[t].question.submitted &&
          this._gameBoardFlat[t].points === this.__activeQuestionDetails.points
        ) {
          unlockCheck += this.__activeQuestionDetails.points;
        }
      }
      switch (this.__activeQuestionDetails.points) {
        case 1:
          unlockThreashold = 16;
          boardCol = 1;
          break;
        case 2:
          unlockThreashold = 16;
          boardCol = 5;
          break;
        case 3:
          unlockThreashold = 12;
          boardCol = 7;
          break;
      }
      // unlock the bonus point question per level if the entire level is cleared
      if (unlockCheck === unlockThreashold) {
        this.shadowRoot
          .querySelectorAll(
            'responsive-grid-col paper-button[data-type="bonus"][data-display-points="' +
              this.__activeQuestionDetails.points +
              '"]'
          )
          .forEach(item => {
            item.removeAttribute("disabled");
            let uuid = item.getAttribute("data-question-uuid");
            // bonus always last row, make data match the operation
            this.gameBoard[boardCol].cols.find(
              i => i.uuid == uuid
            ).disabled = false;
            // keep flat in sync
            this._gameBoardFlat[uuid].disabled = false;
          });
      }
    }
    // test for completing an entire column so we need to activate a bonus chance
    if (
      this.points[this.__activeType].attempted == 11 &&
      !this.__activeQuestionDetails.isBonus
    ) {
      // get last row
      this.shadowRoot
        .querySelectorAll(
          'responsive-grid-col paper-button[data-is-bonus][data-type="' +
            this.__activeType +
            '"]'
        )
        .forEach(item => {
          item.removeAttribute("disabled");
          let uuid = item.getAttribute("data-question-uuid");
          // bonus always last row, make data match the operation
          this.gameBoard[this.gameBoard.length - 1].cols.find(
            i => i.uuid == uuid
          ).disabled = false;
          // keep flat in sync
          this._gameBoardFlat[uuid].disabled = false;
        });
    }
    // if current answer is correct
    if (this.shadowRoot.querySelector("#question").checkAnswers()) {
      // show correct
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          text: "Correct!",
          duration: 4000
        }
      });
      this.dispatchEvent(evt);
      // @todo need an area for placing feedback
      // update the earned column
      let num =
        parseInt(this.points[this.__activeType].earned) +
        parseInt(this.__activeValue);
      this.set("points." + this.__activeType + ".earned", num);
      this.notifyPath("points." + this.__activeType + ".earned");
      // set icon to correct
      icon.icon = "icons:check-circle";
      icon.classList.add("correct");
      // update total column
      total = parseInt(this.points.total.earned) + parseInt(this.__activeValue);
      this.set("points.total.earned", total);
      this.notifyPath("points.total.earned");
    } else {
      this.set("activeQuestion.wrong", true);
      // show wrong
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          text: ":( You got it wrong",
          duration: 4000
        }
      });
      this.dispatchEvent(evt);
      // @todo show feedback for wrong answer as to why
      // set icon to incorrect
      icon.icon = "icons:cancel";
      icon.classList.add("incorrect");
    }
    // update the percent for this column
    let percent = (
      (parseInt(this.points[this.__activeType].earned) /
        parseInt(this.points[this.__activeType].attempted)) *
      100
    ).toFixed(1);
    this.set("points." + this.__activeType + ".percent", percent);
    this.notifyPath("points." + this.__activeType + ".percent");
    // update the percent
    total = (
      (parseInt(this.points.total.earned) /
        parseInt(this.points.total.attempted)) *
      100
    ).toFixed(1);
    this.set("points.total.percent", total);
    this.notifyPath("points.total.percent");
    attemptsData[this.__activeType].series = [
      this.points[this.__activeType].earned,
      this.points[this.__activeType].attempted -
        this.points[this.__activeType].earned
    ];
    // beyond edge case as bonus can make this negative
    if (
      this.points[this.__activeType].attempted <
      this.points[this.__activeType].earned
    ) {
      attemptsData[this.__activeType].series = [
        this.points[this.__activeType].earned,
        0
      ];
    }
    attemptsData.total.series = [
      this.points.total.earned,
      this.points.total.attempted - this.points.total.earned
    ];
    // beyond edge case as bonus can make this negative
    if (this.points.total.attempted < this.points.total.earned) {
      attemptsData.total.series = [this.points.total.earned, 0];
    }
    // update the charts
    attemptsData.overall.series = [
      this.points.slideid.attempted,
      this.points.terminology.attempted,
      this.points.reading.attempted,
      this.points.lecture.attempted
    ];
    this.set("attemptsData", {});
    this.set("attemptsData", attemptsData);
    // append child via polymer so we can style it correctly in shadow dom
    this.__activeTap.appendChild(icon);
    // check for 2 points remaining
    if (this.remainingAttempts === 2) {
      this.shadowRoot
        .querySelectorAll(
          "responsive-grid-col paper-button[data-value='3']:not([disabled]):not([data-is-bonus])"
        )
        .forEach(item => {
          item.setAttribute("disabled", "disabled");
        });
    }
    if (this.remainingAttempts === 1) {
      this.shadowRoot
        .querySelectorAll(
          "responsive-grid-col paper-button[data-value='2']:not([disabled]):not([data-is-bonus])"
        )
        .forEach(item => {
          item.setAttribute("disabled", "disabled");
        });
      this.shadowRoot
        .querySelectorAll(
          'responsive-grid-col paper-button[data-value="3"]:not([disabled]):not([data-is-bonus])'
        )
        .forEach(item => {
          item.setAttribute("disabled", "disabled");
        });
    }
    // check for if we have any attempts remaining
    if (this.remainingAttempts <= 0) {
      this.shadowRoot
        .querySelectorAll(
          "responsive-grid-col paper-button:not([disabled]):not([data-is-bonus])"
        )
        .forEach(item => {
          item.setAttribute("disabled", "disabled");
        });
      this.remainingAttempts = 0;
      // trap for bonus questions still being available
      if (
        this.shadowRoot.querySelectorAll(
          "responsive-grid-col paper-button[data-is-bonus]:not([disabled])"
        ).length === 0
      ) {
        // open score report in a modal now
        this.shadowRoot.querySelector("#dialog").toggle();
        this.shadowRoot.querySelector("#scoreboard").title =
          "Your final score for the game";
        this.scoreBoardToggle({});
        const evt = new CustomEvent("simple-toast-show", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            text: "Game over!",
            duration: 5000
          }
        });
        this.dispatchEvent(evt);
        // fire in case anyone else cares
        this.dispatchEvent(
          new CustomEvent("game-show-quiz-game-over", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              game: this.title,
              score: this.points.total.earned
            }
          })
        );
        // ship to backend if we have one
        if (this.gameScoreBoardBackend) {
          this.shadowRoot.querySelector("#gamebackend").url = `${
            this.gameScoreBoardBackend
          }/${this.title}/${this.points.total.earned}?token=${this.token}`;
          this.shadowRoot.querySelector("#gamebackend").generateRequest();
        }
      }
    }
  }
  /**
   * Notice that something was tapped, resolve what it was.
   */
  _gameBoardTap(e) {
    var local = e.target;
    if (local.getAttribute("data-question-uuid") != null) {
      this.__submitDisabled = true;
      this.__activeTap = local;
      this.__activeType = local.getAttribute("data-type");
      this.__activeValue = local.getAttribute("data-value");
      let uuid = local.getAttribute("data-question-uuid");
      this.__activeQuestionDetails = this._gameBoardFlat[uuid];
      // debug
      //console.log(this.__activeQuestionDetails.question.data.find((currentValue, index, arr)=>{if(currentValue.correct){return currentValue;}}));
      this.set("activeQuestion", {});
      this.set("activeQuestion", this.__activeQuestionDetails.question);
      this.notifyPath("activeQuestion.*");
      this.notifyPath("activeQuestion.data.*");
      // reset the layout on open
      this.shadowRoot.querySelector("#col1").style.flex = "";
      this.shadowRoot.querySelector("#col2").style.flex = "";
      this.shadowRoot.querySelector("#question").resetAnswers();
      setTimeout(() => {
        this.shadowRoot.querySelector("#dialog").toggle();
      }, 100);
    }
  }
  /**
   * Notice the game board has changed from the backend loading it most likely.
   */
  _gameBoardDataChanged(newValue, oldvalue) {
    if (newValue) {
      this._gameBoardFlat = {};
      // @todo this needs to come in via settings some how
      var gameBoard = [
        {
          cols: [
            {
              title: "Slide id",
              points: "",
              notRaised: true,
              disabled: true
            },
            {
              title: "Terms",
              points: "",
              notRaised: true,
              disabled: true
            },
            {
              title: "Reading",
              points: "",
              notRaised: true,
              disabled: true
            },
            {
              title: "Lecture",
              points: "",
              notRaised: true,
              disabled: true
            },
            {
              title: "Bonus",
              points: "",
              notRaised: true,
              disabled: true
            }
          ]
        }
      ];
      // row prototype
      var row = {};
      var gameData = Object.assign({}, newValue);
      const keys = Object.keys(gameData);
      var count = 0;
      // we want 4 1 pt questions, 2 2pts, and 1 3 pts
      var pointMap = {
        1: 4,
        2: 2,
        3: 1,
        bonus: 1
      };
      // 4 iterations for 1 points
      for (var pointLevel in pointMap) {
        count = 0;
        while (count < pointMap[pointLevel]) {
          count++;
          // reset the row
          row = {
            cols: []
          };
          // loop over the keys coming in so we can build each row across
          for (var type in keys) {
            var level = gameData[keys[type]][pointLevel];
            if (level && level.questions.length > 0) {
              // get a random key based on what hasn't been used here previously
              let qKey = Math.floor(Math.random() * level.questions.length);
              var questionObject = {
                uuid: this.generateUUID(),
                type: level.type,
                title: level.title,
                points: level.points,
                displayPoints: level.points,
                isBonus: false,
                question: Object.assign({}, level.questions[qKey])
              };
              // remove this record
              gameData[keys[type]][pointLevel].questions.splice(qKey, 1);
              if (keys[type] === "bonus") {
                gameData[keys[type]][pointLevel].questions = [];
                questionObject.disabled = true;
                questionObject.isBonus = true;
                questionObject.points = pointLevel;
                questionObject.displayPoints = pointLevel;
              } else if (pointLevel === "bonus") {
                questionObject.disabled = true;
                questionObject.isBonus = true;
              }
              row.cols.push(questionObject);
              this._gameBoardFlat[questionObject.uuid] = questionObject;
            }
          }
          gameBoard.push(row);
        }
      }
      // this delay helps with updating the board after the fact
      this.set("gameBoard", []);
      setTimeout(() => {
        this.set("gameBoard", gameBoard);
        this.notifyPath("gameBoard.*");
      }, 100);
    }
  }
  generateUUID() {
    return "item-sss-ss-ss".replace(/s/g, this._uuidPart);
  }
  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  /**
   * Reset focus on close back to the help button
   */
  resetFocus(e) {
    this.shadowRoot.querySelector("#helpbutton").focus();
  }
  /**
   * HAX bindings
   */
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Game show",
        description: "Tweak the game show options",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            url: "source"
          }
        ],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the game",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the game",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "gameData",
            title: "Source of the game data data",
            description: "The title of the game",
            inputMethod: "textfield",
            icon: "icons:link"
          }
        ],
        advanced: []
      },
      saveOptions: {
        unsetAttributes: [
          "attempts-data",
          "points",
          "game-board",
          "question-title",
          "remaining-attempts"
        ]
      }
    };
  }
  /**
   * Attached to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      // punch a basic hole for elms:ln to make life easier for IDs
      if (
        window.Drupal &&
        window.Drupal.settings &&
        window.Drupal.settings.elmslnCore &&
        window.Drupal.settings.elmslnCore.uname
      ) {
        this.gameScoreBoardBackend =
          window.Drupal.settings.basePath +
          "apps/game-show-scoreboard/save-score";
        this.token = btoa(window.Drupal.settings.elmslnCore.uname);
        this.gameDirectionsData =
          window.Drupal.settings.basePath +
          "apps/game-show-scoreboard/load-directions";
      }
      this.shadowRoot
        .querySelector("#dismiss")
        .addEventListener("click", this.resetFocus.bind(this));
      this.shadowRoot
        .querySelector("#contentcontainer")
        .addEventListener("click", this._gameBoardTap.bind(this));
      this.shadowRoot
        .querySelector("#submit")
        .addEventListener("click", this.submitAnswer.bind(this));
      this.shadowRoot
        .querySelector("#continue")
        .addEventListener("click", this.continueGameTap.bind(this));
      this.shadowRoot
        .querySelector("#question")
        .addEventListener("click", this.registerTap.bind(this));
    }, 0);
  }
  /**
   * detached life cycke
   */
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#dismiss")
      .removeEventListener("click", this.resetFocus.bind(this));
    this.shadowRoot
      .querySelector("#contentcontainer")
      .removeEventListener("click", this._gameBoardTap.bind(this));
    this.shadowRoot
      .querySelector("#submit")
      .removeEventListener("click", this.submitAnswer.bind(this));
    this.shadowRoot
      .querySelector("#continue")
      .removeEventListener("click", this.continueGameTap.bind(this));
    this.shadowRoot
      .querySelector("#question")
      .removeEventListener("click", this.registerTap.bind(this));
    super.disconnectedCallback();
  }
}
window.customElements.define(GameShowQuiz.tag, GameShowQuiz);
export { GameShowQuiz };
