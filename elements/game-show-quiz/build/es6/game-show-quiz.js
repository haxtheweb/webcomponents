import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "./node_modules/@polymer/app-layout/app-header/app-header.js";
import "./node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/iron-icon/iron-icon.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/paper-toast/paper-toast.js";
import "./node_modules/@polymer/iron-ajax/iron-ajax.js";
import "./node_modules/@polymer/iron-image/iron-image.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/multiple-choice/multiple-choice.js";
import "./node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js";
import "./node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js";
import "./lib/game-show-quiz-modal.js";
Polymer({
  _template: html`
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
        };
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
        opacity: .25;
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
        <paper-button id="helpbutton" on-tap="directionsToggle"><iron-icon icon="help"></iron-icon> Directions</paper-button>
        <div main-title="">[[title]]</div>
      </app-toolbar>
    </app-header>
    <div id="contentcontainer">
      <template is="dom-repeat" items="[[gameBoard]]" as="row">
        <responsive-grid-row gutter="0" class\$="row row-[[index]]">
        <template is="dom-repeat" items="[[row.cols]]" as="col">
          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3">
            <paper-button class="grid-button" raised="[[!col.notRaised]]" data-question-data\$="[[col.question]]" data-value\$="[[col.points]]" data-type\$="[[col.type]]" disabled\$="[[col.disabled]]">[[col.title]]<br>[[col.points]]</paper-button>
          </responsive-grid-col>
        </template>
      </responsive-grid-row>
      </template>
      <div>
        <h3>Scoreboard</h3>
        <table>
          <tbody><tr>
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
        </tbody></table>
      <div>Points Remaining to Attempt: [[remainingAttempts]]</div>
      </div>
    </div>
    <paper-toast id="toast"></paper-toast>
    <game-show-quiz-modal id="directions" title="[[directionsTitle]]">
      <div slot="content"><slot name="directions"></slot></div>
      <paper-button slot="buttons" id="dismiss" dialog-confirm="" raised="">Good luck!</paper-button>
    </game-show-quiz-modal>
    <game-show-quiz-modal id="dialog" title="[[activeQuestion.title]]">
      <iron-image slot="content" style="min-width:100px; width:100%; min-height:25vh; height:40vh; background-color: lightgray;" sizing="contain" preload="" src\$="[[activeQuestion.image]]"></iron-image>
      <multiple-choice disabled\$="[[activeQuestion.submitted]]" slot="content" id="question" hide-buttons="" title="[[activeQuestion.title]]" answers="[[activeQuestion.data]]"></multiple-choice>
      <paper-button slot="buttons" hidden\$="[[activeQuestion.submitted]]" id="submit" raised="" disabled\$="[[__submitDisabled]]">Submit answer <iron-icon hidden$="[[__submitDisabled]]" icon="icons:touch-app"></iron-icon></paper-button>
      <paper-button slot="buttons" id="continue" hidden\$="[[!activeQuestion.submitted]]" dialog-confirm="" raised="">Continue <iron-icon icon="icons:arrow-forward"></iron-icon></paper-button>
    </game-show-quiz-modal>
    <iron-ajax auto="" id="gamedata" url="[[gameData]]" handle-as="json" last-response="{{gameBoard}}"></iron-ajax>
    <iron-ajax id="questiondata" url="[[__questionEndpoint]]" handle-as="json" last-response="{{activeQuestion}}"></iron-ajax>
`,
  is: "game-show-quiz",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    title: { type: String },
    points: {
      type: Object,
      value: {
        slide: { attempted: 0, earned: 0, percent: 0 },
        terms: { attempted: 0, earned: 0, percent: 0 },
        reading: { attempted: 0, earned: 0, percent: 0 },
        lecture: { attempted: 0, earned: 0, percent: 0 },
        bonus: { attempted: 0, earned: 0, percent: 0 },
        total: { attempted: 0, earned: 0, percent: 0 }
      }
    },
    remainingAttempts: { type: Number, value: 30 },
    directionsTitle: { type: String, value: "Directions" },
    gameBoard: { type: Array, observer: "_gameBoardChanged" },
    gameData: { type: String },
    activeQuestion: { type: Object }
  },
  directionsToggle: function() {
    this.$.directions.toggle();
  },
  continueGameTap: function() {
    if (
      typeof this.__activeTap !== typeof void 0 &&
      null !=
        dom(this.__activeTap).parentNode.nextElementSibling.firstElementChild
    ) {
      dom(
        this.__activeTap
      ).parentNode.nextElementSibling.firstElementChild.firstElementChild.focus();
      delete this.__activeTap;
    } else if (
      typeof this.__activeTap !== typeof void 0 &&
      null ==
        dom(this.__activeTap).parentNode.nextElementSibling.firstElementChild
    ) {
      this.__activeTap.focus();
      delete this.__activeTap;
    }
  },
  registerTap: function() {
    this.__submitDisabled = !1;
  },
  submitAnswer: function() {
    this.set("activeQuestion.submitted", !0);
    this.$.continue.focus();
    this.__activeTap.disabled = !0;
    let icon = document.createElement("iron-icon");
    icon.classList.add("status-icon");
    let num =
      parseInt(this.points[this.__activeType].attempted) +
      parseInt(this.__activeValue);
    this.set("points." + this.__activeType + ".attempted", num);
    let total =
      parseInt(this.points.total.attempted) + parseInt(this.__activeValue);
    this.set("points.total.attempted", total);
    this.remainingAttempts =
      this.remainingAttempts - parseInt(this.__activeValue);
    if (this.$.question.checkAnswers()) {
      this.$.toast.show("Correct!");
      let num =
        parseInt(this.points[this.__activeType].earned) +
        parseInt(this.__activeValue);
      this.set("points." + this.__activeType + ".earned", num);
      icon.icon = "icons:check-circle";
      icon.classList.add("correct");
      let total =
        parseInt(this.points.total.earned) + parseInt(this.__activeValue);
      this.set("points.total.earned", total);
    } else {
      this.$.toast.show(":( You got it wrong");
      icon.icon = "icons:cancel";
      icon.classList.add("incorrect");
    }
    let percent = (
      100 *
      (parseInt(this.points[this.__activeType].earned) /
        parseInt(this.points[this.__activeType].attempted))
    ).toFixed(1);
    this.set("points." + this.__activeType + ".percent", percent);
    total = (
      100 *
      (parseInt(this.points.total.earned) /
        parseInt(this.points.total.attempted))
    ).toFixed(1);
    this.set("points.total.percent", total);
    dom(this.__activeTap).appendChild(icon);
  },
  _gameBoardTap: function(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget;
    if (null != local.getAttribute("data-question-data")) {
      this.__submitDisabled = !0;
      this.__questionEndpoint = local.getAttribute("data-question-data");
      this.__activeTap = local;
      this.__activeType = local.getAttribute("data-type");
      this.__activeValue = local.getAttribute("data-value");
      this.$.questiondata.answers = [];
      setTimeout(() => {
        this.$.questiondata.generateRequest();
        this.$.dialog.toggle();
      }, 100);
    }
  },
  _gameBoardChanged: function() {},
  resetFocus: function() {
    this.$.helpbutton.focus();
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Game show",
        description: "Tweak the game show options",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [{ type: "video", url: "source" }],
        meta: { author: "Your organization on github" }
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
    });
    this.$.dismiss.addEventListener("tap", this.resetFocus.bind(this));
    this.$.contentcontainer.addEventListener(
      "tap",
      this._gameBoardTap.bind(this)
    );
    this.$.submit.addEventListener("tap", this.submitAnswer.bind(this));
    this.$.continue.addEventListener("tap", this.continueGameTap.bind(this));
    this.$.question.addEventListener("tap", this.registerTap.bind(this));
  },
  detached: function() {
    this.$.dismiss.removeEventListener("tap", this.resetFocus.bind(this));
    this.$.contentcontainer.removeEventListener(
      "tap",
      this._gameBoardTap.bind(this)
    );
    this.$.submit.removeEventListener("tap", this.submitAnswer.bind(this));
    this.$.continue.removeEventListener("tap", this.continueGameTap.bind(this));
    this.$.question.removeEventListener("tap", this.registerTap.bind(this));
  }
});
