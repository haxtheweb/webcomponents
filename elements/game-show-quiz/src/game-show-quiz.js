/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { DynamicImporter } from "@lrnwebcomponents/dynamic-importer/dynamic-importer.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/multiple-choice/multiple-choice.js";
import "./lib/game-show-quiz-modal.js";
/**
 * `game-show-quiz`
 * `Simple game show with questions and answers`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - game show - a display board in the style of Jeopardy
 */
class GameShowQuiz extends DynamicImporter(PolymerElement) {
  static get tag() {
    return "game-show-quiz";
  }
  /**
   * Dynamically import these late so we can load faster
   */
  dynamicImports() {
    return {
      "iron-image": "@polymer/iron-image/iron-image.js",
      "responsive-grid-row":
        "@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js",
      "responsive-grid-col":
        "@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js",
      "app-drawer": "@polymer/app-layout/app-drawer/app-drawer.js",
      "app-header": "@polymer/app-layout/app-header/app-header.js",
      "app-toolbar": "@polymer/app-layout/app-toolbar/app-toolbar.js",
      "iron-flex-layout": "@polymer/iron-flex-layout/iron-flex-layout.js",
      "iron-icon": "@polymer/iron-icon/iron-icon.js",
      "iron-icons": "@polymer/iron-icons/iron-icons.js"
    };
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --game-show-bg-color: #4285f4;
          --game-show-text-color: #ffffff;
        }
        app-toolbar {
          background-color: var(--game-show-bg-color, blue);
          color: var(--game-show-text-color, white);
          font-size: 24px;
          display: flex;
        }
        iron-icon {
          display: inline-block;
        }

        paper-button {
          --paper-button-ink-color: var(--game-show-bg-color, blue);
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
          color: var(--game-show-text-color, white);
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
          text-align: center;
          min-width: unset;
          padding: 0;
          margin: 0;
        }
        .status-icon {
          width: 64px;
          height: 64px;
          opacity: 0.25;
          position: absolute;
        }
        .correct {
          color: green;
        }
        .incorrect {
          color: red;
        }
        .row-0 paper-button[disabled] {
          font-weight: bold;
          font-size: 16px;
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
          .grid-button {
            font-size: 9px;
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
            <iron-icon icon="help"></iron-icon>Directions
          </paper-button>
          <div main-title>[[title]]</div>
        </app-toolbar>
      </app-header>
      <div id="contentcontainer">
        <template is="dom-repeat" items="[[gameBoard]]" as="row">
          <responsive-grid-row gutter="0" class\$="row row-[[index]]">
            <template is="dom-repeat" items="[[row.cols]]" as="col">
              <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3">
                <paper-button
                  class="grid-button"
                  raised="[[!col.notRaised]]"
                  data-question-data\$="[[col.question]]"
                  data-value\$="[[col.points]]"
                  data-type\$="[[col.type]]"
                  disabled\$="[[col.disabled]]"
                  >[[col.title]]<br />[[col.points]]</paper-button
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
                <td>[[points.slide.attempted]]</td>
                <td>[[points.terms.attempted]]</td>
                <td>[[points.reading.attempted]]</td>
                <td>[[points.lecture.attempted]]</td>
                <td>[[points.bonus.attempted]]</td>
                <td>[[points.total.attempted]]</td>
              </tr>
              <tr>
                <th>Points Earned</th>
                <td>[[points.slide.earned]]</td>
                <td>[[points.terms.earned]]</td>
                <td>[[points.reading.earned]]</td>
                <td>[[points.lecture.earned]]</td>
                <td>[[points.bonus.earned]]</td>
                <td>[[points.total.earned]]</td>
              </tr>
              <tr>
                <th>Category Percentage</th>
                <td>[[points.slide.percent]]</td>
                <td>[[points.terms.percent]]</td>
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
        <paper-button slot="buttons" id="dismiss" dialog-confirm="" raised=""
          >Good luck!</paper-button
        >
      </game-show-quiz-modal>
      <game-show-quiz-modal id="dialog" title="[[activeQuestion.title]]">
        <iron-image
          slot="content"
          style="min-width:100px; width:100%; min-height:25vh; height:40vh; background-color: lightgray;"
          sizing="contain"
          preload=""
          src\$="[[activeQuestion.image]]"
        ></iron-image>
        <multiple-choice
          disabled\$="[[activeQuestion.submitted]]"
          slot="content"
          id="question"
          hide-buttons=""
          title="[[activeQuestion.title]]"
          answers="[[activeQuestion.data]]"
        ></multiple-choice>
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
          dialog-confirm=""
          raised=""
          >Continue <iron-icon icon="icons:arrow-forward"></iron-icon
        ></paper-button>
      </game-show-quiz-modal>
      <iron-ajax
        auto
        id="gamedata"
        url="[[gameData]]"
        handle-as="json"
        last-response="{{gameBoard}}"
      ></iron-ajax>
      <iron-ajax
        id="questiondata"
        url="[[__questionEndpoint]]"
        handle-as="json"
        last-response="{{activeQuestion}}"
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
          slide: {
            attempted: 0,
            earned: 0,
            percent: 0
          },
          terms: {
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
       * Title to use on the directions area.
       */
      directionsTitle: {
        type: String,
        value: "Directions"
      },
      /**
       * Rows on the gameshow board
       */
      gameBoard: {
        type: Array,
        observer: "_gameBoardChanged"
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
      ).parentNode.nextElementSibling.firstElementChild.firstElementChild.focus();
      delete this.__activeTap;
    } else if (
      typeof this.__activeTap !== typeof undefined &&
      dom(this.__activeTap).parentNode.nextElementSibling.firstElementChild ==
        null
    ) {
      this.__activeTap.focus();
      delete this.__activeTap;
    }
  }
  /**
   * Register a tap on the board.
   */
  registerTap(e) {
    // ensure they touch the board before ability to submit
    this.__submitDisabled = false;
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
    if (local.getAttribute("data-question-data") != null) {
      this.__submitDisabled = true;
      this.__questionEndpoint = local.getAttribute("data-question-data");
      this.__activeTap = local;
      this.__activeType = local.getAttribute("data-type");
      this.__activeValue = local.getAttribute("data-value");
      this.$.questiondata.answers = [];
      // @todo need to get these to reset correctly
      setTimeout(() => {
        this.$.questiondata.generateRequest();
        this.$.dialog.toggle();
      }, 100);
    }
  }
  /**
   * Notice the game board has changed from the backend loading it most likely.
   */
  _gameBoardChanged(newValue, oldvalue) {}
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
      this.$.question.addEventListener("tap", this.registerTap.bind(this));
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
    this.$.question.removeEventListener("tap", this.registerTap.bind(this));
    super.disconnectedCallback();
  }
}
window.customElements.define(GameShowQuiz.tag, GameShowQuiz);
export { GameShowQuiz };
