define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "./node_modules/@polymer/app-layout/app-header/app-header.js",
  "./node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js",
  "./node_modules/@polymer/iron-icons/iron-icons.js",
  "./node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@polymer/paper-toast/paper-toast.js",
  "./node_modules/@polymer/iron-ajax/iron-ajax.js",
  "./node_modules/@polymer/iron-image/iron-image.js",
  "../../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "../../node_modules/@lrnwebcomponents/multiple-choice/multiple-choice.js",
  "../../node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js",
  "../../node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js",
  "./lib/game-show-quiz-modal.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_a649bb10d94911e888f20515953808cf() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        --game-show-bg-color: #4285f4;\n        --game-show-text-color: #ffffff;\n      }\n      app-toolbar {\n        background-color: #4285f4;\n        color: #fff;\n        font-size: 24px;\n      }\n\n      paper-icon-button {\n        --paper-icon-button-ink-color: white;\n      }\n      paper-icon-button + [main-title] {\n        margin-left: 24px;\n      }\n      app-header {\n        color: #fff;\n        --app-header-background-rear-layer: {\n          background-color: #ef6c00;\n        };\n      }\n      responsive-grid-row {\n        --responsive-grid-row-inner: {\n          margin-left: 0;\n          margin-right: 0;\n        }\n      }\n      responsive-grid-col {\n        --responsive-grid-col-inner: {\n          padding-left: 0;\n          padding-right: 0;\n        }\n      }\n      #contentcontainer {\n        margin: 0 auto;\n        font-size: 16px;\n      }\n      .grid-button {\n        width: 100%;\n        height: 80px;\n        text-align: center;\n        min-width: unset;\n        padding: 0;\n        margin: 0;\n      }\n      .status-icon {\n        width: 64px;\n        height: 64px;\n        opacity: .25;\n        position: absolute;\n      }\n      .correct {\n        color: green;\n      }\n      .incorrect {\n        color: red;\n      }\n      .row-0 paper-button[disabled] {\n        font-weight: bold;\n        font-size: 16px;\n      }\n      @media screen and (max-width: 600px) {\n        app-toolbar {\n          font-size: 14px;\n        }\n        paper-icon-button {\n          padding: 0;\n          margin: 0;\n          width: 16px;\n          height: 16px;\n        }\n        .grid-button {\n          font-size: 9px;\n        }\n        .status-icon {\n          width: 24px;\n          height: 24px;\n          opacity: 1;\n        }\n        .row-0 paper-button[disabled] {\n          font-weight: bold;\n          font-size: 10px;\n        }\n      }\n    </style>\n    <app-header>\n      <app-toolbar>\n        <paper-icon-button id="helpbutton" icon="help" onclick="directions.toggle()"></paper-icon-button>\n        <div main-title="">[[title]]</div>\n      </app-toolbar>\n    </app-header>\n    <div id="contentcontainer">\n      <template is="dom-repeat" items="[[gameBoard]]" as="row">\n        <responsive-grid-row gutter="0" class$="row row-[[index]]">\n        <template is="dom-repeat" items="[[row.cols]]" as="col">\n          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3">\n            <paper-button class="grid-button" raised="[[!col.notRaised]]" data-question-data$="[[col.question]]" data-value$="[[col.points]]" data-type$="[[col.type]]" disabled$="[[col.disabled]]">[[col.title]]<br>[[col.points]]</paper-button>\n          </responsive-grid-col>\n        </template>\n      </responsive-grid-row>\n      </template>\n      <div>\n        <h3>Scoreboard</h3>\n        <table>\n          <tbody><tr>\n            <th></th>\n            <th>Slide ID</th>\n            <th>Terms</th>\n            <th>Reading</th>\n            <th>Lecture</th>\n            <th>Bonus</th>\n            <th>Total</th>\n          </tr>\n          <tr>\n            <th>Points Attempted</th>\n            <td>[[points.slide.attempted]]</td>\n            <td>[[points.terms.attempted]]</td>\n            <td>[[points.reading.attempted]]</td>\n            <td>[[points.lecture.attempted]]</td>\n            <td>[[points.bonus.attempted]]</td>\n            <td>[[points.total.attempted]]</td>\n          </tr>\n          <tr>\n            <th>Points Earned</th>\n            <td>[[points.slide.earned]]</td>\n            <td>[[points.terms.earned]]</td>\n            <td>[[points.reading.earned]]</td>\n            <td>[[points.lecture.earned]]</td>\n            <td>[[points.bonus.earned]]</td>\n            <td>[[points.total.earned]]</td>\n          </tr>\n          <tr>\n            <th>Category Percentage</th>\n            <td>[[points.slide.percent]]</td>\n            <td>[[points.terms.percent]]</td>\n            <td>[[points.reading.percent]]</td>\n            <td>[[points.lecture.percent]]</td>\n            <td>[[points.bonus.percent]]</td>\n            <td>[[points.total.percent]]</td>\n          </tr>\n        </tbody></table>\n      <div>Points Remaining to Attempt: [[remainingAttempts]]</div>\n      </div>\n    </div>\n    <paper-toast id="toast"></paper-toast>\n    <game-show-quiz-modal id="directions" title="[[directionsTitle]]">\n      <div slot="content"><slot name="directions"></slot></div>\n      <paper-button slot="buttons" id="dismiss" dialog-confirm="" raised="">Good luck!</paper-button>\n    </game-show-quiz-modal>\n    <game-show-quiz-modal id="dialog" title="[[activeQuestion.title]]">\n      <iron-image slot="content" style="min-width:100px; width:100%; min-height:25vh; height:40vh; background-color: lightgray;" sizing="contain" preload="" src$="[[activeQuestion.image]]"></iron-image>\n      <multiple-choice disabled$="[[activeQuestion.submitted]]" slot="content" id="question" hide-buttons="" title="[[activeQuestion.title]]" answers="[[activeQuestion.data]]"></multiple-choice>\n      <paper-button slot="buttons" hidden$="[[activeQuestion.submitted]]" id="submit" raised="" disabled$="[[__submitDisabled]]">Submit answer <iron-icon hidden$="[[__submitDisabled]]" icon="icons:touch-app"></iron-icon></paper-button>\n      <paper-button slot="buttons" id="continue" hidden$="[[!activeQuestion.submitted]]" dialog-confirm="" raised="">Continue <iron-icon icon="icons:arrow-forward"></iron-icon></paper-button>\n    </game-show-quiz-modal>\n    <iron-ajax auto="" id="gamedata" url="[[gameData]]" handle-as="json" last-response="{{gameBoard}}"></iron-ajax>\n    <iron-ajax id="questiondata" url="[[__questionEndpoint]]" handle-as="json" last-response="{{activeQuestion}}"></iron-ajax>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        --game-show-bg-color: #4285f4;\n        --game-show-text-color: #ffffff;\n      }\n      app-toolbar {\n        background-color: #4285f4;\n        color: #fff;\n        font-size: 24px;\n      }\n\n      paper-icon-button {\n        --paper-icon-button-ink-color: white;\n      }\n      paper-icon-button + [main-title] {\n        margin-left: 24px;\n      }\n      app-header {\n        color: #fff;\n        --app-header-background-rear-layer: {\n          background-color: #ef6c00;\n        };\n      }\n      responsive-grid-row {\n        --responsive-grid-row-inner: {\n          margin-left: 0;\n          margin-right: 0;\n        }\n      }\n      responsive-grid-col {\n        --responsive-grid-col-inner: {\n          padding-left: 0;\n          padding-right: 0;\n        }\n      }\n      #contentcontainer {\n        margin: 0 auto;\n        font-size: 16px;\n      }\n      .grid-button {\n        width: 100%;\n        height: 80px;\n        text-align: center;\n        min-width: unset;\n        padding: 0;\n        margin: 0;\n      }\n      .status-icon {\n        width: 64px;\n        height: 64px;\n        opacity: .25;\n        position: absolute;\n      }\n      .correct {\n        color: green;\n      }\n      .incorrect {\n        color: red;\n      }\n      .row-0 paper-button[disabled] {\n        font-weight: bold;\n        font-size: 16px;\n      }\n      @media screen and (max-width: 600px) {\n        app-toolbar {\n          font-size: 14px;\n        }\n        paper-icon-button {\n          padding: 0;\n          margin: 0;\n          width: 16px;\n          height: 16px;\n        }\n        .grid-button {\n          font-size: 9px;\n        }\n        .status-icon {\n          width: 24px;\n          height: 24px;\n          opacity: 1;\n        }\n        .row-0 paper-button[disabled] {\n          font-weight: bold;\n          font-size: 10px;\n        }\n      }\n    </style>\n    <app-header>\n      <app-toolbar>\n        <paper-icon-button id="helpbutton" icon="help" onclick="directions.toggle()"></paper-icon-button>\n        <div main-title="">[[title]]</div>\n      </app-toolbar>\n    </app-header>\n    <div id="contentcontainer">\n      <template is="dom-repeat" items="[[gameBoard]]" as="row">\n        <responsive-grid-row gutter="0" class\\$="row row-[[index]]">\n        <template is="dom-repeat" items="[[row.cols]]" as="col">\n          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3">\n            <paper-button class="grid-button" raised="[[!col.notRaised]]" data-question-data\\$="[[col.question]]" data-value\\$="[[col.points]]" data-type\\$="[[col.type]]" disabled\\$="[[col.disabled]]">[[col.title]]<br>[[col.points]]</paper-button>\n          </responsive-grid-col>\n        </template>\n      </responsive-grid-row>\n      </template>\n      <div>\n        <h3>Scoreboard</h3>\n        <table>\n          <tbody><tr>\n            <th></th>\n            <th>Slide ID</th>\n            <th>Terms</th>\n            <th>Reading</th>\n            <th>Lecture</th>\n            <th>Bonus</th>\n            <th>Total</th>\n          </tr>\n          <tr>\n            <th>Points Attempted</th>\n            <td>[[points.slide.attempted]]</td>\n            <td>[[points.terms.attempted]]</td>\n            <td>[[points.reading.attempted]]</td>\n            <td>[[points.lecture.attempted]]</td>\n            <td>[[points.bonus.attempted]]</td>\n            <td>[[points.total.attempted]]</td>\n          </tr>\n          <tr>\n            <th>Points Earned</th>\n            <td>[[points.slide.earned]]</td>\n            <td>[[points.terms.earned]]</td>\n            <td>[[points.reading.earned]]</td>\n            <td>[[points.lecture.earned]]</td>\n            <td>[[points.bonus.earned]]</td>\n            <td>[[points.total.earned]]</td>\n          </tr>\n          <tr>\n            <th>Category Percentage</th>\n            <td>[[points.slide.percent]]</td>\n            <td>[[points.terms.percent]]</td>\n            <td>[[points.reading.percent]]</td>\n            <td>[[points.lecture.percent]]</td>\n            <td>[[points.bonus.percent]]</td>\n            <td>[[points.total.percent]]</td>\n          </tr>\n        </tbody></table>\n      <div>Points Remaining to Attempt: [[remainingAttempts]]</div>\n      </div>\n    </div>\n    <paper-toast id="toast"></paper-toast>\n    <game-show-quiz-modal id="directions" title="[[directionsTitle]]">\n      <div slot="content"><slot name="directions"></slot></div>\n      <paper-button slot="buttons" id="dismiss" dialog-confirm="" raised="">Good luck!</paper-button>\n    </game-show-quiz-modal>\n    <game-show-quiz-modal id="dialog" title="[[activeQuestion.title]]">\n      <iron-image slot="content" style="min-width:100px; width:100%; min-height:25vh; height:40vh; background-color: lightgray;" sizing="contain" preload="" src\\$="[[activeQuestion.image]]"></iron-image>\n      <multiple-choice disabled\\$="[[activeQuestion.submitted]]" slot="content" id="question" hide-buttons="" title="[[activeQuestion.title]]" answers="[[activeQuestion.data]]"></multiple-choice>\n      <paper-button slot="buttons" hidden\\$="[[activeQuestion.submitted]]" id="submit" raised="" disabled\\$="[[__submitDisabled]]">Submit answer <iron-icon hidden\\$="[[__submitDisabled]]" icon="icons:touch-app"></iron-icon></paper-button>\n      <paper-button slot="buttons" id="continue" hidden\\$="[[!activeQuestion.submitted]]" dialog-confirm="" raised="">Continue <iron-icon icon="icons:arrow-forward"></iron-icon></paper-button>\n    </game-show-quiz-modal>\n    <iron-ajax auto="" id="gamedata" url="[[gameData]]" handle-as="json" last-response="{{gameBoard}}"></iron-ajax>\n    <iron-ajax id="questiondata" url="[[__questionEndpoint]]" handle-as="json" last-response="{{activeQuestion}}"></iron-ajax>\n'
      ]
    );
    _templateObject_a649bb10d94911e888f20515953808cf = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a649bb10d94911e888f20515953808cf()
    ),
    is: "game-show-quiz",
    listeners: {
      "dismiss.tap": "resetFocus",
      "contentcontainer.tap": "_gameBoardTap",
      "submit.tap": "submitAnswer",
      "continue.tap": "continueGameTap",
      "question.tap": "registerTap"
    },
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
    continueGameTap: function continueGameTap() {
      if (
        babelHelpers.typeof(this.__activeTap) !== "undefined" &&
        null !=
          (0, _polymerDom.dom)(this.__activeTap).parentNode.nextElementSibling
            .firstElementChild
      ) {
        (0, _polymerDom.dom)(
          this.__activeTap
        ).parentNode.nextElementSibling.firstElementChild.firstElementChild.focus();
        delete this.__activeTap;
      } else if (
        babelHelpers.typeof(this.__activeTap) !== "undefined" &&
        null ==
          (0, _polymerDom.dom)(this.__activeTap).parentNode.nextElementSibling
            .firstElementChild
      ) {
        this.__activeTap.focus();
        delete this.__activeTap;
      }
    },
    registerTap: function registerTap() {
      this.__submitDisabled = !1;
    },
    submitAnswer: function submitAnswer() {
      this.set("activeQuestion.submitted", !0);
      this.$.continue.focus();
      this.__activeTap.disabled = !0;
      var icon = document.createElement("iron-icon");
      icon.classList.add("status-icon");
      var num =
        parseInt(this.points[this.__activeType].attempted) +
        parseInt(this.__activeValue);
      this.set("points." + this.__activeType + ".attempted", num);
      var total =
        parseInt(this.points.total.attempted) + parseInt(this.__activeValue);
      this.set("points.total.attempted", total);
      this.remainingAttempts =
        this.remainingAttempts - parseInt(this.__activeValue);
      if (this.$.question.checkAnswers()) {
        this.$.toast.show("Correct!");
        var _num =
          parseInt(this.points[this.__activeType].earned) +
          parseInt(this.__activeValue);
        this.set("points." + this.__activeType + ".earned", _num);
        icon.icon = "icons:check-circle";
        icon.classList.add("correct");
        var _total =
          parseInt(this.points.total.earned) + parseInt(this.__activeValue);
        this.set("points.total.earned", _total);
      } else {
        this.$.toast.show(":( You got it wrong");
        icon.icon = "icons:cancel";
        icon.classList.add("incorrect");
      }
      var percent = (
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
      (0, _polymerDom.dom)(this.__activeTap).appendChild(icon);
    },
    _gameBoardTap: function _gameBoardTap(e) {
      var _this = this,
        normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget;
      if (null != local.getAttribute("data-question-data")) {
        this.__submitDisabled = !0;
        this.__questionEndpoint = local.getAttribute("data-question-data");
        this.__activeTap = local;
        this.__activeType = local.getAttribute("data-type");
        this.__activeValue = local.getAttribute("data-value");
        this.$.questiondata.answers = [];
        setTimeout(function() {
          _this.$.questiondata.generateRequest();
          _this.$.dialog.toggle();
        }, 100);
      }
    },
    _gameBoardChanged: function _gameBoardChanged() {},
    resetFocus: function resetFocus() {
      this.$.helpbutton.focus();
    },
    attached: function attached() {
      document.body.appendChild(this.$.dialog);
      document.body.appendChild(this.$.directions);
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
    }
  });
});
