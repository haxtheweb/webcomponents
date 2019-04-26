/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@vaadin/vaadin-split-layout/vaadin-split-layout.js";
import "@lrnwebcomponents/multiple-choice/multiple-choice.js";
import "./lib/game-show-quiz-modal.js";
/**
 * `game-show-quiz`
 * `Simple game show with questions and answers`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - game show - a display board in the style of Jeopardy
 */
class GameShowQuiz extends MutableData(PolymerElement) {
  static get tag() {
    return "game-show-quiz";
  }
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
    import("@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js");
    import("@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js");
    import("@polymer/app-layout/app-drawer/app-drawer.js");
    import("@polymer/app-layout/app-header/app-header.js");
    import("@polymer/app-layout/app-toolbar/app-toolbar.js");
    import("@polymer/iron-flex-layout/iron-flex-layout.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
  }
  static get template() {
    return html`
      <style include="simple-colors">
        :host {
          display: block;
          --game-show-bg-color: var(--simple-colors-default-theme-blue-11);
          --game-show-text-color: var(--simple-colors-default-theme-blue-1);
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
          --responsive-grid-row-inner: {
            margin-left: 0;
            margin-right: 0;
          }
        }
        responsive-grid-col {
          --responsive-grid-col-inner: {
            padding-left: 0;
            padding-right: 0;
          }
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
          <paper-button id="helpbutton" on-tap="directionsToggle">
            <iron-icon icon="help"></iron-icon
            ><label for="helpbutton">Directions</label>
          </paper-button>
          <div main-title>[[title]]</div>
        </app-toolbar>
      </app-header>
      <div id="contentcontainer">
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
                  data-type\$="[[col.type]]"
                  disabled\$="[[col.disabled]]"
                  >[[col.title]]<br />[[col.displayPoints]]</paper-button
                >
              </responsive-grid-col>
            </template>
          </responsive-grid-row>
        </template>
        <div>
          <h3>Scoreboard</h3>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>Slide ID</th>
                <th>Terms</th>
                <th>Reading</th>
                <th>Lecture</th>
                <th>Bonus</th>
                <th>Total</th>
              </tr>
              <tr>
                <th>Points Attempted</th>
                <td>[[points.slideid.attempted]]</td>
                <td>[[points.terminology.attempted]]</td>
                <td>[[points.reading.attempted]]</td>
                <td>[[points.lecture.attempted]]</td>
                <td>[[points.bonus.attempted]]</td>
                <td>[[points.total.attempted]]</td>
              </tr>
              <tr>
                <th>Points Earned</th>
                <td>[[points.slideid.earned]]</td>
                <td>[[points.terminology.earned]]</td>
                <td>[[points.reading.earned]]</td>
                <td>[[points.lecture.earned]]</td>
                <td>[[points.bonus.earned]]</td>
                <td>[[points.total.earned]]</td>
              </tr>
              <tr>
                <th>Category Percentage</th>
                <td>[[points.slideid.percent]]</td>
                <td>[[points.terminology.percent]]</td>
                <td>[[points.reading.percent]]</td>
                <td>[[points.lecture.percent]]</td>
                <td>[[points.bonus.percent]]</td>
                <td>[[points.total.percent]]</td>
              </tr>
            </tbody>
          </table>
          <div>Points Remaining to Attempt: [[remainingAttempts]]</div>
        </div>
      </div>
      <game-show-quiz-modal id="directions" title="[[directionsTitle]]">
        <div slot="content"><slot name="directions"></slot></div>
        <paper-button
          aria-label="Close directions dialog and return to game"
          slot="buttons"
          id="dismiss"
          dialog-confirm
          raised
          >Good luck!</paper-button
        >
      </game-show-quiz-modal>
      <game-show-quiz-modal id="dialog" title="[[questionTitle]]">
        <vaadin-split-layout slot="content" style="height:80vh;">
          <iron-image
            style="min-width:100px; width:100%; min-height:50vh; height:75vh; background-color: lightgray;"
            sizing="contain"
            preload=""
            src\$="[[activeQuestion.image]]"
          ></iron-image>
          <multiple-choice
            randomize
            single-option
            id="question"
            hide-buttons
            title="[[activeQuestion.title]]"
            answers="[[activeQuestion.data]]"
          ></multiple-choice>
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
    `;
  }

  static get properties() {
    return {
      /**
       * Title
       */
      title: {
        type: String
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
        value: "Answer the following question"
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
    this.$.directions.toggle();
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
      dom(this.__activeTap).parentNode.nextElementSibling.firstElementChild !=
        null
    ) {
      dom(
        this.__activeTap
      ).parentNode.nextElementSibling.firstElementChild.focus();
      delete this.__activeTap;
    }
  }
  /**
   * Register a tap on the board.
   */
  registerTap(e) {
    var found = true;
    for (var i in this.$.question.answers) {
      if (this.$.question.answers[i].userGuess) {
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
    // flip submitted status
    this.set("activeQuestion.submitted", true);
    this.notifyPath("activeQuestion.submitted");
    this.$.continue.focus();
    // maker this disabled on the board
    this.__activeTap.disabled = true;
    // start to build a status icon
    let icon = document.createElement("iron-icon");
    icon.classList.add("status-icon");
    // update attempts for the category
    let num =
      parseInt(this.points[this.__activeType].attempted) +
      parseInt(this.__activeValue);
    this.set("points." + this.__activeType + ".attempted", num);
    this.notifyPath("points." + this.__activeType + ".attempted");
    // update the global totals for attempt
    let total =
      parseInt(this.points.total.attempted) + parseInt(this.__activeValue);
    this.set("points.total.attempted", total);
    this.notifyPath("points.total.attempted");
    // update remaining attempts
    this.remainingAttempts =
      this.remainingAttempts - parseInt(this.__activeValue);
    // if current answer is correct
    if (this.$.question.checkAnswers()) {
      // show correct
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        cancelable: true,
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
      let total =
        parseInt(this.points.total.earned) + parseInt(this.__activeValue);
      this.set("points.total.earned", total);
      this.notifyPath("points.total.earned");
    } else {
      // show wrong
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        cancelable: true,
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
    // append child via polymer so we can style it correctly in shadow dom
    dom(this.__activeTap).appendChild(icon);
  }
  /**
   * Notice that something was tapped, resolve what it was.
   */
  _gameBoardTap(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    if (local.getAttribute("data-question-uuid") != null) {
      this.__submitDisabled = true;
      this.__activeTap = local;
      this.__activeType = local.getAttribute("data-type");
      this.__activeValue = local.getAttribute("data-value");
      let uuid = local.getAttribute("data-question-uuid");
      this.set("activeQuestion", {});
      this.set("activeQuestion", this._gameBoardFlat[uuid].question);
      this.notifyPath("activeQuestion.*");
      this.notifyPath("activeQuestion.data.*");
      this.$.question.resetAnswers();
      setTimeout(() => {
        this.$.dialog.toggle();
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
                question: Object.assign({}, level.questions[qKey])
              };
              // remove this record
              gameData[keys[type]][pointLevel].questions.splice(qKey, 1);
              if (keys[type] === "bonus") {
                gameData[keys[type]][pointLevel].questions = [];
                questionObject.disabled = true;
                questionObject.displayPoints = pointLevel;
              } else if (pointLevel === "bonus") {
                questionObject.disabled = true;
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
    this.$.helpbutton.focus();
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
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
  }
  /**
   * Attached to the DOM, now fire.
   */
  connectedCallback() {
    super.connectedCallback();
    window.SimpleToast.requestAvailability();
    afterNextRender(this, function() {
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(GameShowQuiz.haxProperties, GameShowQuiz.tag, this);
      this.$.dismiss.addEventListener("tap", this.resetFocus.bind(this));
      this.$.contentcontainer.addEventListener(
        "tap",
        this._gameBoardTap.bind(this)
      );
      this.$.submit.addEventListener("tap", this.submitAnswer.bind(this));
      this.$.continue.addEventListener("tap", this.continueGameTap.bind(this));
      this.$.question.addEventListener("click", this.registerTap.bind(this));
    });
  }
  /**
   * detached life cycke
   */
  disconnectedCallback() {
    this.$.dismiss.removeEventListener("tap", this.resetFocus.bind(this));
    this.$.contentcontainer.removeEventListener(
      "tap",
      this._gameBoardTap.bind(this)
    );
    this.$.submit.removeEventListener("tap", this.submitAnswer.bind(this));
    this.$.continue.removeEventListener("tap", this.continueGameTap.bind(this));
    this.$.question.removeEventListener("click", this.registerTap.bind(this));
    super.disconnectedCallback();
  }
}
window.customElements.define(GameShowQuiz.tag, GameShowQuiz);
export { GameShowQuiz };
