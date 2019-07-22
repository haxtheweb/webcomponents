define([
  "exports",
  "require",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@polymer/polymer/lib/mixins/mutable-data.js",
  "./node_modules/@polymer/polymer/lib/utils/render-status.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/hax-body/lib/haxutils.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@lrnwebcomponents/simple-toast/simple-toast.js",
  "./node_modules/@polymer/iron-ajax/iron-ajax.js",
  "./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "./node_modules/@vaadin/vaadin-split-layout/vaadin-split-layout.js",
  "./node_modules/@lrnwebcomponents/multiple-choice/multiple-choice.js",
  "./lib/game-show-quiz-modal.js"
], function(
  _exports,
  _require,
  _polymerElement,
  _mutableData,
  _renderStatus,
  _polymerDom,
  _HAXWiring,
  _haxutils,
  _paperButton,
  _simpleToast,
  _ironAjax,
  _simpleColors,
  _vaadinSplitLayout,
  _multipleChoice,
  _gameShowQuizModal
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.GameShowQuiz = void 0;
  _require = babelHelpers.interopRequireWildcard(_require);
  function _templateObject_ad348000ab1611e9be6cc36ee328ec59() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n      <style>\n        :host {\n          display: block;\n          --game-show-bg-color: var(--simple-colors-default-theme-blue-11);\n          --game-show-text-color: var(--simple-colors-default-theme-blue-1);\n        }\n        chartist-render#piechart {\n          width: 300px;\n          height: 300px;\n          display: inline-block;\n        }\n        chartist-render.mini-chart {\n          width: 132px;\n          height: 132px;\n          display: inline-block;\n          --chartist-color-1: green;\n          --chartist-color-2: red;\n        }\n        app-toolbar {\n          background-color: var(--game-show-bg-color);\n          color: var(--game-show-text-color);\n          font-size: 24px;\n          display: flex;\n        }\n        iron-icon {\n          display: inline-block;\n        }\n        table {\n          width: 90%;\n        }\n        tr {\n          outline: 1px solid black;\n        }\n        td {\n          border-left: 1px solid black;\n          padding: 16px;\n          text-align: center;\n        }\n        .chart-row td {\n          padding: 0;\n        }\n\n        paper-button {\n          --paper-button-ink-color: var(--game-show-bg-color);\n          text-transform: none;\n          display: block;\n        }\n        #helpbutton {\n          text-align: center;\n          padding: 8px;\n          font-size: 12px;\n          vertical-align: middle;\n          display: inline-flex;\n        }\n        paper-button + [main-title] {\n          margin-left: 24px;\n          display: inline-flex;\n        }\n        app-header {\n          color: var(--game-show-text-color);\n          --app-header-background-rear-layer: {\n            background-color: #ef6c00;\n          }\n        }\n        responsive-grid-row {\n          --responsive-grid-row-inner: {\n            margin-left: 0;\n            margin-right: 0;\n          }\n        }\n        responsive-grid-col {\n          --responsive-grid-col-inner: {\n            padding-left: 0;\n            padding-right: 0;\n          }\n        }\n        #contentcontainer {\n          margin: 0 auto;\n          font-size: 16px;\n        }\n        .grid-button {\n          width: 100%;\n          height: 80px;\n          font-size: 24px;\n          text-align: center;\n          min-width: unset;\n          padding: 0;\n          margin: 0;\n          align-items: center;\n          display: flex;\n        }\n        .status-icon {\n          border-radius: 50%;\n          width: 48px;\n          height: 48px;\n          opacity: 0.5;\n          right: 0;\n          bottom: 0;\n          position: absolute;\n        }\n        .correct {\n          color: var(--simple-colors-default-theme-green-6);\n          background-color: var(--simple-colors-default-theme-green-11);\n        }\n        .incorrect {\n          color: var(--simple-colors-default-theme-red-6);\n          background-color: var(--simple-colors-default-theme-red-11);\n        }\n        .row-0 paper-button[disabled] {\n          font-weight: bold;\n          font-size: 16px;\n        }\n        .grid-button[data-type="bonus"] {\n          display: inline-flex;\n          position: absolute;\n          outline: 1px solid #dddddd;\n        }\n        .grid-button[data-type="bonus"][data-display-points="1"] {\n          height: 320px;\n        }\n        .grid-button[data-type="bonus"][data-display-points="2"] {\n          height: 160px;\n        }\n        @media screen and (max-width: 600px) {\n          app-toolbar {\n            font-size: 14px;\n          }\n          paper-button {\n            padding: 0;\n            margin: 0;\n            width: 16px;\n            height: 16px;\n            min-width: unset;\n          }\n          game-show-quiz-modal paper-button {\n            height: 48px;\n            width: 100%;\n          }\n          .grid-button {\n            font-size: 14px;\n          }\n          .status-icon {\n            width: 24px;\n            height: 24px;\n            opacity: 1;\n            display: inline-block;\n          }\n          .row-0 paper-button[disabled] {\n            font-weight: bold;\n            font-size: 10px;\n          }\n        }\n      </style>\n      <app-header>\n        <app-toolbar>\n          <paper-button id="scorebutton" on-click="scoreBoardToggle">\n            <iron-icon icon="editor:pie-chart"></iron-icon\n            ><label for="scorebutton">Score board</label>\n          </paper-button>\n          <div main-title>[[title]]</div>\n          <paper-button id="helpbutton" on-click="directionsToggle">\n            <iron-icon icon="help"></iron-icon\n            ><label for="helpbutton">Directions</label>\n          </paper-button>\n        </app-toolbar>\n      </app-header>\n      <div id="contentcontainer">\n        <div style="font-size: 24px;" hidden$="[[!remainingAttempts]]">\n          Points Remaining to Attempt:\n          <strong>[[remainingAttempts]]</strong>\n        </div>\n        <template is="dom-repeat" items="[[gameBoard]]" as="row" mutable-data>\n          <responsive-grid-row gutter="0" class$="row row-[[index]]">\n            <template\n              is="dom-repeat"\n              items="[[row.cols]]"\n              as="col"\n              mutable-data\n            >\n              <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2">\n                <paper-button\n                  class="grid-button"\n                  raised="[[!col.notRaised]]"\n                  data-question-uuid$="[[col.uuid]]"\n                  data-value$="[[col.points]]"\n                  data-display-points$="[[col.displayPoints]]"\n                  data-is-bonus$="[[col.isBonus]]"\n                  data-type$="[[col.type]]"\n                  disabled$="[[col.disabled]]"\n                  >[[col.title]]<br />[[col.displayPoints]]</paper-button\n                >\n              </responsive-grid-col>\n            </template>\n          </responsive-grid-row>\n        </template>\n      </div>\n      <game-show-quiz-modal id="scoreboard" title="Score board">\n        <div slot="content">\n          <div style="padding: 32px;">\n            <chartist-render\n              id="piechart"\n              chart-title="Breakdown of attempts"\n              data="[[attemptsData.overall]]"\n              type="pie"\n              scale="ct-square"\n            >\n            </chartist-render>\n            <table style="margin: 16px auto;">\n              <tbody>\n                <tr>\n                  <th></th>\n                  <th>Slide ID</th>\n                  <th>Terms</th>\n                  <th>Reading</th>\n                  <th>Lecture</th>\n                  <th>Total</th>\n                </tr>\n                <tr>\n                  <th>Points Earned</th>\n                  <td>[[points.slideid.earned]]</td>\n                  <td>[[points.terminology.earned]]</td>\n                  <td>[[points.reading.earned]]</td>\n                  <td>[[points.lecture.earned]]</td>\n                  <td>[[points.total.earned]]</td>\n                </tr>\n                <tr>\n                  <th>Points Attempted</th>\n                  <td>[[points.slideid.attempted]]</td>\n                  <td>[[points.terminology.attempted]]</td>\n                  <td>[[points.reading.attempted]]</td>\n                  <td>[[points.lecture.attempted]]</td>\n                  <td>[[points.total.attempted]]</td>\n                </tr>\n                <tr>\n                  <th>Category Percentage</th>\n                  <td>[[points.slideid.percent]]</td>\n                  <td>[[points.terminology.percent]]</td>\n                  <td>[[points.reading.percent]]</td>\n                  <td>[[points.lecture.percent]]</td>\n                  <td>[[points.total.percent]]</td>\n                </tr>\n                <tr class="chart-row">\n                  <th>Pie chart</th>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Slide ID percentage"\n                      data="[[attemptsData.slideid]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Terminology percentage"\n                      data="[[attemptsData.terminology]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Reading percentage"\n                      data="[[attemptsData.reading]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Lecture percentage"\n                      data="[[attemptsData.lecture]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Total percentage"\n                      data="[[attemptsData.total]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n            <div style="font-size: 24px;" hidden$="[[!remainingAttempts]]">\n              Points Remaining to Attempt:\n              <strong>[[remainingAttempts]]</strong>\n            </div>\n          </div>\n        </div>\n        <paper-button\n          aria-label="Close score board and return to game"\n          slot="buttons"\n          id="dismiss"\n          dialog-confirm\n          raised\n          >Return to game board</paper-button\n        >\n      </game-show-quiz-modal>\n      <game-show-quiz-modal id="directions" title="[[directionsTitle]]">\n        <div slot="content"><slot></slot></div>\n        <paper-button\n          aria-label="Close directions dialog and return to game"\n          slot="buttons"\n          id="dismiss"\n          dialog-confirm\n          raised\n          >Good luck!</paper-button\n        >\n      </game-show-quiz-modal>\n      <game-show-quiz-modal\n        id="dialog"\n        title="[[questionTitle]] [[__activeQuestionDetails.points]] point, [[__activeQuestionDetails.type]] question."\n      >\n        <vaadin-split-layout slot="content" style="height:80vh;">\n          <div id="col1" style="width:70%;min-width: 30%;">\n            <iron-image\n              style="min-width:100px; width:100%; min-height:50vh; height:75vh;"\n              sizing="contain"\n              preload=""\n              src$="[[activeQuestion.image]]"\n            ></iron-image>\n          </div>\n          <div id="col2" style="width:30%;min-width: 30%;">\n            <multiple-choice\n              randomize\n              single-option\n              id="question"\n              hide-buttons\n              title="[[activeQuestion.title]]"\n              answers="[[activeQuestion.data]]"\n            ></multiple-choice>\n            <div hidden$="[[!activeQuestion.wrong]]" aria-hidden="true">\n              <h3>Feedback</h3>\n              <p>[[activeQuestion.feedback]]</p>\n            </div>\n          </div>\n        </vaadin-split-layout>\n        <paper-button\n          slot="buttons"\n          hidden$="[[activeQuestion.submitted]]"\n          id="submit"\n          raised=""\n          disabled$="[[__submitDisabled]]"\n          >Submit answer\n          <iron-icon\n            hidden$="[[__submitDisabled]]"\n            icon="icons:touch-app"\n          ></iron-icon\n        ></paper-button>\n        <paper-button\n          slot="buttons"\n          id="continue"\n          hidden$="[[!activeQuestion.submitted]]"\n          dialog-confirm\n          raised\n          aria-disabled$="[[activeQuestion.submitted]]"\n          aria-label="Return to game board"\n          >Continue <iron-icon icon="icons:arrow-forward"></iron-icon\n        ></paper-button>\n      </game-show-quiz-modal>\n      <iron-ajax\n        auto\n        id="gamedata"\n        url="[[gameData]]"\n        handle-as="json"\n        last-response="{{gameBoardData}}"\n      ></iron-ajax>\n      <iron-ajax\n        auto\n        id="gamedirections"\n        url="[[gameDirectionsData]]"\n        handle-as="text"\n        last-response="{{gameDirections}}"\n      ></iron-ajax>\n      <iron-ajax id="gamebackend" hand-as="json"></iron-ajax>\n    '
      ],
      [
        '\n      <style>\n        :host {\n          display: block;\n          --game-show-bg-color: var(--simple-colors-default-theme-blue-11);\n          --game-show-text-color: var(--simple-colors-default-theme-blue-1);\n        }\n        chartist-render#piechart {\n          width: 300px;\n          height: 300px;\n          display: inline-block;\n        }\n        chartist-render.mini-chart {\n          width: 132px;\n          height: 132px;\n          display: inline-block;\n          --chartist-color-1: green;\n          --chartist-color-2: red;\n        }\n        app-toolbar {\n          background-color: var(--game-show-bg-color);\n          color: var(--game-show-text-color);\n          font-size: 24px;\n          display: flex;\n        }\n        iron-icon {\n          display: inline-block;\n        }\n        table {\n          width: 90%;\n        }\n        tr {\n          outline: 1px solid black;\n        }\n        td {\n          border-left: 1px solid black;\n          padding: 16px;\n          text-align: center;\n        }\n        .chart-row td {\n          padding: 0;\n        }\n\n        paper-button {\n          --paper-button-ink-color: var(--game-show-bg-color);\n          text-transform: none;\n          display: block;\n        }\n        #helpbutton {\n          text-align: center;\n          padding: 8px;\n          font-size: 12px;\n          vertical-align: middle;\n          display: inline-flex;\n        }\n        paper-button + [main-title] {\n          margin-left: 24px;\n          display: inline-flex;\n        }\n        app-header {\n          color: var(--game-show-text-color);\n          --app-header-background-rear-layer: {\n            background-color: #ef6c00;\n          }\n        }\n        responsive-grid-row {\n          --responsive-grid-row-inner: {\n            margin-left: 0;\n            margin-right: 0;\n          }\n        }\n        responsive-grid-col {\n          --responsive-grid-col-inner: {\n            padding-left: 0;\n            padding-right: 0;\n          }\n        }\n        #contentcontainer {\n          margin: 0 auto;\n          font-size: 16px;\n        }\n        .grid-button {\n          width: 100%;\n          height: 80px;\n          font-size: 24px;\n          text-align: center;\n          min-width: unset;\n          padding: 0;\n          margin: 0;\n          align-items: center;\n          display: flex;\n        }\n        .status-icon {\n          border-radius: 50%;\n          width: 48px;\n          height: 48px;\n          opacity: 0.5;\n          right: 0;\n          bottom: 0;\n          position: absolute;\n        }\n        .correct {\n          color: var(--simple-colors-default-theme-green-6);\n          background-color: var(--simple-colors-default-theme-green-11);\n        }\n        .incorrect {\n          color: var(--simple-colors-default-theme-red-6);\n          background-color: var(--simple-colors-default-theme-red-11);\n        }\n        .row-0 paper-button[disabled] {\n          font-weight: bold;\n          font-size: 16px;\n        }\n        .grid-button[data-type="bonus"] {\n          display: inline-flex;\n          position: absolute;\n          outline: 1px solid #dddddd;\n        }\n        .grid-button[data-type="bonus"][data-display-points="1"] {\n          height: 320px;\n        }\n        .grid-button[data-type="bonus"][data-display-points="2"] {\n          height: 160px;\n        }\n        @media screen and (max-width: 600px) {\n          app-toolbar {\n            font-size: 14px;\n          }\n          paper-button {\n            padding: 0;\n            margin: 0;\n            width: 16px;\n            height: 16px;\n            min-width: unset;\n          }\n          game-show-quiz-modal paper-button {\n            height: 48px;\n            width: 100%;\n          }\n          .grid-button {\n            font-size: 14px;\n          }\n          .status-icon {\n            width: 24px;\n            height: 24px;\n            opacity: 1;\n            display: inline-block;\n          }\n          .row-0 paper-button[disabled] {\n            font-weight: bold;\n            font-size: 10px;\n          }\n        }\n      </style>\n      <app-header>\n        <app-toolbar>\n          <paper-button id="scorebutton" on-click="scoreBoardToggle">\n            <iron-icon icon="editor:pie-chart"></iron-icon\n            ><label for="scorebutton">Score board</label>\n          </paper-button>\n          <div main-title>[[title]]</div>\n          <paper-button id="helpbutton" on-click="directionsToggle">\n            <iron-icon icon="help"></iron-icon\n            ><label for="helpbutton">Directions</label>\n          </paper-button>\n        </app-toolbar>\n      </app-header>\n      <div id="contentcontainer">\n        <div style="font-size: 24px;" hidden$="[[!remainingAttempts]]">\n          Points Remaining to Attempt:\n          <strong>[[remainingAttempts]]</strong>\n        </div>\n        <template is="dom-repeat" items="[[gameBoard]]" as="row" mutable-data>\n          <responsive-grid-row gutter="0" class\\$="row row-[[index]]">\n            <template\n              is="dom-repeat"\n              items="[[row.cols]]"\n              as="col"\n              mutable-data\n            >\n              <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2">\n                <paper-button\n                  class="grid-button"\n                  raised="[[!col.notRaised]]"\n                  data-question-uuid\\$="[[col.uuid]]"\n                  data-value\\$="[[col.points]]"\n                  data-display-points\\$="[[col.displayPoints]]"\n                  data-is-bonus\\$="[[col.isBonus]]"\n                  data-type\\$="[[col.type]]"\n                  disabled\\$="[[col.disabled]]"\n                  >[[col.title]]<br />[[col.displayPoints]]</paper-button\n                >\n              </responsive-grid-col>\n            </template>\n          </responsive-grid-row>\n        </template>\n      </div>\n      <game-show-quiz-modal id="scoreboard" title="Score board">\n        <div slot="content">\n          <div style="padding: 32px;">\n            <chartist-render\n              id="piechart"\n              chart-title="Breakdown of attempts"\n              data="[[attemptsData.overall]]"\n              type="pie"\n              scale="ct-square"\n            >\n            </chartist-render>\n            <table style="margin: 16px auto;">\n              <tbody>\n                <tr>\n                  <th></th>\n                  <th>Slide ID</th>\n                  <th>Terms</th>\n                  <th>Reading</th>\n                  <th>Lecture</th>\n                  <th>Total</th>\n                </tr>\n                <tr>\n                  <th>Points Earned</th>\n                  <td>[[points.slideid.earned]]</td>\n                  <td>[[points.terminology.earned]]</td>\n                  <td>[[points.reading.earned]]</td>\n                  <td>[[points.lecture.earned]]</td>\n                  <td>[[points.total.earned]]</td>\n                </tr>\n                <tr>\n                  <th>Points Attempted</th>\n                  <td>[[points.slideid.attempted]]</td>\n                  <td>[[points.terminology.attempted]]</td>\n                  <td>[[points.reading.attempted]]</td>\n                  <td>[[points.lecture.attempted]]</td>\n                  <td>[[points.total.attempted]]</td>\n                </tr>\n                <tr>\n                  <th>Category Percentage</th>\n                  <td>[[points.slideid.percent]]</td>\n                  <td>[[points.terminology.percent]]</td>\n                  <td>[[points.reading.percent]]</td>\n                  <td>[[points.lecture.percent]]</td>\n                  <td>[[points.total.percent]]</td>\n                </tr>\n                <tr class="chart-row">\n                  <th>Pie chart</th>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Slide ID percentage"\n                      data="[[attemptsData.slideid]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Terminology percentage"\n                      data="[[attemptsData.terminology]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Reading percentage"\n                      data="[[attemptsData.reading]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Lecture percentage"\n                      data="[[attemptsData.lecture]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                  <td>\n                    <chartist-render\n                      class="mini-chart"\n                      chart-title="Total percentage"\n                      data="[[attemptsData.total]]"\n                      type="pie"\n                      scale="ct-square"\n                    ></chartist-render>\n                  </td>\n                </tr>\n              </tbody>\n            </table>\n            <div style="font-size: 24px;" hidden$="[[!remainingAttempts]]">\n              Points Remaining to Attempt:\n              <strong>[[remainingAttempts]]</strong>\n            </div>\n          </div>\n        </div>\n        <paper-button\n          aria-label="Close score board and return to game"\n          slot="buttons"\n          id="dismiss"\n          dialog-confirm\n          raised\n          >Return to game board</paper-button\n        >\n      </game-show-quiz-modal>\n      <game-show-quiz-modal id="directions" title="[[directionsTitle]]">\n        <div slot="content"><slot></slot></div>\n        <paper-button\n          aria-label="Close directions dialog and return to game"\n          slot="buttons"\n          id="dismiss"\n          dialog-confirm\n          raised\n          >Good luck!</paper-button\n        >\n      </game-show-quiz-modal>\n      <game-show-quiz-modal\n        id="dialog"\n        title="[[questionTitle]] [[__activeQuestionDetails.points]] point, [[__activeQuestionDetails.type]] question."\n      >\n        <vaadin-split-layout slot="content" style="height:80vh;">\n          <div id="col1" style="width:70%;min-width: 30%;">\n            <iron-image\n              style="min-width:100px; width:100%; min-height:50vh; height:75vh;"\n              sizing="contain"\n              preload=""\n              src\\$="[[activeQuestion.image]]"\n            ></iron-image>\n          </div>\n          <div id="col2" style="width:30%;min-width: 30%;">\n            <multiple-choice\n              randomize\n              single-option\n              id="question"\n              hide-buttons\n              title="[[activeQuestion.title]]"\n              answers="[[activeQuestion.data]]"\n            ></multiple-choice>\n            <div hidden\\$="[[!activeQuestion.wrong]]" aria-hidden="true">\n              <h3>Feedback</h3>\n              <p>[[activeQuestion.feedback]]</p>\n            </div>\n          </div>\n        </vaadin-split-layout>\n        <paper-button\n          slot="buttons"\n          hidden\\$="[[activeQuestion.submitted]]"\n          id="submit"\n          raised=""\n          disabled\\$="[[__submitDisabled]]"\n          >Submit answer\n          <iron-icon\n            hidden$="[[__submitDisabled]]"\n            icon="icons:touch-app"\n          ></iron-icon\n        ></paper-button>\n        <paper-button\n          slot="buttons"\n          id="continue"\n          hidden\\$="[[!activeQuestion.submitted]]"\n          dialog-confirm\n          raised\n          aria-disabled\\$="[[activeQuestion.submitted]]"\n          aria-label="Return to game board"\n          >Continue <iron-icon icon="icons:arrow-forward"></iron-icon\n        ></paper-button>\n      </game-show-quiz-modal>\n      <iron-ajax\n        auto\n        id="gamedata"\n        url="[[gameData]]"\n        handle-as="json"\n        last-response="{{gameBoardData}}"\n      ></iron-ajax>\n      <iron-ajax\n        auto\n        id="gamedirections"\n        url="[[gameDirectionsData]]"\n        handle-as="text"\n        last-response="{{gameDirections}}"\n      ></iron-ajax>\n      <iron-ajax id="gamebackend" hand-as="json"></iron-ajax>\n    '
      ]
    );
    _templateObject_ad348000ab1611e9be6cc36ee328ec59 = function _templateObject_ad348000ab1611e9be6cc36ee328ec59() {
      return data;
    };
    return data;
  }
  /**
   * `game-show-quiz`
   * `Simple game show with questions and answers`
   * @demo demo/index.html
   * @microcopy - the mental model for this element
   * - game show - a display board in the style of Jeopardy
   */ var GameShowQuiz = /*#__PURE__*/ (function(_MutableData) {
    babelHelpers.inherits(GameShowQuiz, _MutableData);
    babelHelpers.createClass(GameShowQuiz, null, [
      {
        key: "tag",
        get: function get() {
          return "game-show-quiz";
        }
      }
    ]);
    function GameShowQuiz() {
      var _this;
      babelHelpers.classCallCheck(this, GameShowQuiz);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(GameShowQuiz).call(this)
      );
      new Promise(function(res, rej) {
        return _require.default(
          ["./node_modules/@polymer/iron-image/iron-image.js"],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          [
            "./node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js"
          ],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          [
            "./node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js"
          ],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          ["./node_modules/@polymer/app-layout/app-drawer/app-drawer.js"],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          ["./node_modules/@polymer/app-layout/app-header/app-header.js"],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          ["./node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js"],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          ["./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js"],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          ["./node_modules/@polymer/iron-icon/iron-icon.js"],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          ["./node_modules/@polymer/iron-icons/iron-icons.js"],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          ["./node_modules/@polymer/iron-icons/editor-icons.js"],
          res,
          rej
        );
      });
      new Promise(function(res, rej) {
        return _require.default(
          [
            "./node_modules/@lrnwebcomponents/chartist-render/chartist-render.js"
          ],
          res,
          rej
        );
      });
      return _this;
    }
    babelHelpers.createClass(
      GameShowQuiz,
      [
        {
          key: "_gameDirectionsChanged",
          /**
           * Support loading directions from a URL / end point
           */ value: function _gameDirectionsChanged(newValue) {
            if (newValue) {
              (0, _haxutils.wipeSlot)(this);
              var div = document.createElement("div");
              div.style = "padding: 16px;";
              div.innerHTML = newValue;
              this.appendChild(div.cloneNode(!0));
            }
          }
        },
        {
          key: "directionsToggle",
          /**
           * Toggle the directions to appear
           */ value: function directionsToggle(e) {
            this.shadowRoot.querySelector("#directions").toggle();
          }
          /**
           * Toggle the directions to appear
           */
        },
        {
          key: "scoreBoardToggle",
          value: function scoreBoardToggle(e) {
            this.shadowRoot.querySelector("#scoreboard").toggle();
          }
          /**
           * Continue button pressed.
           */
        },
        {
          key: "continueGameTap",
          value: function continueGameTap(e) {
            // destroy this so it rebuilds every time for correct target element
            // while focusing on the next item just to place keyboard focus more
            // logically
            if (
              babelHelpers.typeof(this.__activeTap) !==
                ("undefined" === typeof void 0
                  ? "undefined"
                  : babelHelpers.typeof(void 0)) &&
              null !=
                (0, _polymerDom.dom)(this.__activeTap).parentNode
                  .nextElementSibling.firstElementChild
            ) {
              (0, _polymerDom.dom)(
                this.__activeTap
              ).parentNode.nextElementSibling.firstElementChild.focus();
              delete this.__activeTap;
            }
          }
          /**
           * Register a tap on the board.
           */
        },
        {
          key: "registerTap",
          value: function registerTap(e) {
            var found = !0;
            for (var i in this.shadowRoot.querySelector("#question").answers) {
              if (
                this.shadowRoot.querySelector("#question").answers[i].userGuess
              ) {
                found = !1;
              }
            } // ensure they touch the board before ability to submit
            this.__submitDisabled = found;
          }
          /**
           * Submit answer to see what they got.
           */
        },
        {
          key: "submitAnswer",
          value: function submitAnswer(e) {
            var _this2 = this,
              attemptsData = this.attemptsData; // flip submitted status
            this.set("activeQuestion.submitted", !0);
            this.notifyPath("activeQuestion.submitted");
            this.shadowRoot.querySelector("#continue").focus(); // maker this disabled on the board
            this.__activeTap.disabled = !0; // start to build a status icon
            var icon = document.createElement("iron-icon");
            icon.classList.add("status-icon");
            var total = 0;
            if (
              "bonus" != this.__activeType &&
              !this.__activeQuestionDetails.isBonus
            ) {
              // update attempts for the category
              var num =
                parseInt(this.points[this.__activeType].attempted) +
                parseInt(this.__activeValue);
              this.set("points." + this.__activeType + ".attempted", num);
              this.notifyPath("points." + this.__activeType + ".attempted");
              total =
                parseInt(this.points.total.attempted) +
                parseInt(this.__activeValue); // update the global totals for attempt
              this.set("points.total.attempted", total);
              this.notifyPath("points.total.attempted"); // update remaining attempts
              this.remainingAttempts =
                this.remainingAttempts - parseInt(this.__activeValue);
            } // do a detection for per value type level being filled in to unlock the assoicated bonus question
            if (!this.__activeQuestionDetails.isBonus) {
              var unlockCheck = 0,
                unlockThreashold = 100,
                boardCol = 0;
              for (var t in this._gameBoardFlat) {
                // only count things that are disabled
                if (
                  !this._gameBoardFlat[t].isBonus &&
                  this._gameBoardFlat[t].question.submitted &&
                  this._gameBoardFlat[t].points ===
                    this.__activeQuestionDetails.points
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
              } // unlock the bonus point question per level if the entire level is cleared
              if (unlockCheck === unlockThreashold) {
                this.shadowRoot
                  .querySelectorAll(
                    'responsive-grid-col paper-button[data-type="bonus"][data-display-points="' +
                      this.__activeQuestionDetails.points +
                      '"]'
                  )
                  .forEach(function(item) {
                    item.removeAttribute("disabled");
                    var uuid = item.getAttribute("data-question-uuid"); // bonus always last row, make data match the operation
                    _this2.gameBoard[boardCol].cols.find(function(i) {
                      return i.uuid == uuid;
                    }).disabled = !1; // keep flat in sync
                    _this2._gameBoardFlat[uuid].disabled = !1;
                  });
              }
            } // test for completing an entire column so we need to activate a bonus chance
            if (
              11 == this.points[this.__activeType].attempted &&
              !this.__activeQuestionDetails.isBonus
            ) {
              // get last row
              this.shadowRoot
                .querySelectorAll(
                  'responsive-grid-col paper-button[data-is-bonus][data-type="' +
                    this.__activeType +
                    '"]'
                )
                .forEach(function(item) {
                  item.removeAttribute("disabled");
                  var uuid = item.getAttribute("data-question-uuid"); // bonus always last row, make data match the operation
                  _this2.gameBoard[_this2.gameBoard.length - 1].cols.find(
                    function(i) {
                      return i.uuid == uuid;
                    }
                  ).disabled = !1; // keep flat in sync
                  _this2._gameBoardFlat[uuid].disabled = !1;
                });
            } // if current answer is correct
            if (this.shadowRoot.querySelector("#question").checkAnswers()) {
              // show correct
              var evt = new CustomEvent("simple-toast-show", {
                bubbles: !0,
                cancelable: !0,
                composed: !0,
                detail: { text: "Correct!", duration: 4e3 }
              });
              this.dispatchEvent(evt); // @todo need an area for placing feedback
              // update the earned column
              var _num =
                parseInt(this.points[this.__activeType].earned) +
                parseInt(this.__activeValue);
              this.set("points." + this.__activeType + ".earned", _num);
              this.notifyPath("points." + this.__activeType + ".earned"); // set icon to correct
              icon.icon = "icons:check-circle";
              icon.classList.add("correct"); // update total column
              total =
                parseInt(this.points.total.earned) +
                parseInt(this.__activeValue);
              this.set("points.total.earned", total);
              this.notifyPath("points.total.earned");
            } else {
              this.set("activeQuestion.wrong", !0); // show wrong
              var _evt = new CustomEvent("simple-toast-show", {
                bubbles: !0,
                cancelable: !0,
                composed: !0,
                detail: { text: ":( You got it wrong", duration: 4e3 }
              });
              this.dispatchEvent(_evt); // @todo show feedback for wrong answer as to why
              // set icon to incorrect
              icon.icon = "icons:cancel";
              icon.classList.add("incorrect");
            } // update the percent for this column
            var percent = (
              100 *
              (parseInt(this.points[this.__activeType].earned) /
                parseInt(this.points[this.__activeType].attempted))
            ).toFixed(1);
            this.set("points." + this.__activeType + ".percent", percent);
            this.notifyPath("points." + this.__activeType + ".percent"); // update the percent
            total = (
              100 *
              (parseInt(this.points.total.earned) /
                parseInt(this.points.total.attempted))
            ).toFixed(1);
            this.set("points.total.percent", total);
            this.notifyPath("points.total.percent");
            attemptsData[this.__activeType].series = [
              this.points[this.__activeType].earned,
              this.points[this.__activeType].attempted -
                this.points[this.__activeType].earned
            ]; // beyond edge case as bonus can make this negative
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
            ]; // beyond edge case as bonus can make this negative
            if (this.points.total.attempted < this.points.total.earned) {
              attemptsData.total.series = [this.points.total.earned, 0];
            } // update the charts
            attemptsData.overall.series = [
              this.points.slideid.attempted,
              this.points.terminology.attempted,
              this.points.reading.attempted,
              this.points.lecture.attempted
            ];
            this.set("attemptsData", {});
            this.set("attemptsData", attemptsData); // append child via polymer so we can style it correctly in shadow dom
            (0, _polymerDom.dom)(this.__activeTap).appendChild(icon); // check for 2 points remaining
            if (2 === this.remainingAttempts) {
              this.shadowRoot
                .querySelectorAll(
                  "responsive-grid-col paper-button[data-value='3']:not([disabled]):not([data-is-bonus])"
                )
                .forEach(function(item) {
                  item.setAttribute("disabled", "disabled");
                });
            }
            if (1 === this.remainingAttempts) {
              this.shadowRoot
                .querySelectorAll(
                  "responsive-grid-col paper-button[data-value='2']:not([disabled]):not([data-is-bonus])"
                )
                .forEach(function(item) {
                  item.setAttribute("disabled", "disabled");
                });
              this.shadowRoot
                .querySelectorAll(
                  'responsive-grid-col paper-button[data-value="3"]:not([disabled]):not([data-is-bonus])'
                )
                .forEach(function(item) {
                  item.setAttribute("disabled", "disabled");
                });
            } // check for if we have any attempts remaining
            if (0 >= this.remainingAttempts) {
              this.shadowRoot
                .querySelectorAll(
                  "responsive-grid-col paper-button:not([disabled]):not([data-is-bonus])"
                )
                .forEach(function(item) {
                  item.setAttribute("disabled", "disabled");
                });
              this.remainingAttempts = 0; // trap for bonus questions still being available
              if (
                0 ===
                this.shadowRoot.querySelectorAll(
                  "responsive-grid-col paper-button[data-is-bonus]:not([disabled])"
                ).length
              ) {
                // open score report in a modal now
                this.shadowRoot.querySelector("#dialog").toggle();
                this.scoreBoardToggle({});
                var _evt2 = new CustomEvent("simple-toast-show", {
                  bubbles: !0,
                  cancelable: !0,
                  composed: !0,
                  detail: { text: "Game over!", duration: 5e3 }
                });
                this.dispatchEvent(_evt2); // fire in case anyone else cares
                this.dispatchEvent(
                  new CustomEvent("game-show-quiz-game-over", {
                    bubbles: !0,
                    cancelable: !0,
                    composed: !0,
                    detail: {
                      game: this.title,
                      score: this.points.total.earned
                    }
                  })
                ); // ship to backend if we have one
                if (this.gameScoreBoardBackend) {
                  this.$.gamebackend.url = ""
                    .concat(this.gameScoreBoardBackend, "/")
                    .concat(this.title, "/")
                    .concat(this.points.total.earned, "?token=")
                    .concat(this.token);
                  this.$.gamebackend.generateRequest();
                }
              }
            }
          }
          /**
           * Notice that something was tapped, resolve what it was.
           */
        },
        {
          key: "_gameBoardTap",
          value: function _gameBoardTap(e) {
            var _this3 = this,
              normalizedEvent = (0, _polymerDom.dom)(e),
              local = normalizedEvent.localTarget;
            if (null != local.getAttribute("data-question-uuid")) {
              this.__submitDisabled = !0;
              this.__activeTap = local;
              this.__activeType = local.getAttribute("data-type");
              this.__activeValue = local.getAttribute("data-value");
              var uuid = local.getAttribute("data-question-uuid");
              this.__activeQuestionDetails = this._gameBoardFlat[uuid]; // debug
              //console.log(this.__activeQuestionDetails.question.data.find((currentValue, index, arr)=>{if(currentValue.correct){return currentValue;}}));
              this.set("activeQuestion", {});
              this.set("activeQuestion", this.__activeQuestionDetails.question);
              this.notifyPath("activeQuestion.*");
              this.notifyPath("activeQuestion.data.*"); // reset the layout on open
              this.shadowRoot.querySelector("#col1").style.flex = "";
              this.shadowRoot.querySelector("#col2").style.flex = "";
              this.shadowRoot.querySelector("#question").resetAnswers();
              setTimeout(function() {
                _this3.shadowRoot.querySelector("#dialog").toggle();
              }, 100);
            }
          }
          /**
           * Notice the game board has changed from the backend loading it most likely.
           */
        },
        {
          key: "_gameBoardDataChanged",
          value: function _gameBoardDataChanged(newValue, oldvalue) {
            var _this4 = this;
            if (newValue) {
              this._gameBoardFlat = {}; // @todo this needs to come in via settings some how
              var gameBoard = [
                  {
                    cols: [
                      {
                        title: "Slide id",
                        points: "",
                        notRaised: !0,
                        disabled: !0
                      },
                      {
                        title: "Terms",
                        points: "",
                        notRaised: !0,
                        disabled: !0
                      },
                      {
                        title: "Reading",
                        points: "",
                        notRaised: !0,
                        disabled: !0
                      },
                      {
                        title: "Lecture",
                        points: "",
                        notRaised: !0,
                        disabled: !0
                      },
                      {
                        title: "Bonus",
                        points: "",
                        notRaised: !0,
                        disabled: !0
                      }
                    ]
                  }
                ],
                row = {},
                gameData = Object.assign({}, newValue),
                keys = Object.keys(gameData),
                count = 0,
                pointMap = { 1: 4, 2: 2, 3: 1, bonus: 1 }; // row prototype
              // 4 iterations for 1 points
              for (var pointLevel in pointMap) {
                count = 0;
                while (count < pointMap[pointLevel]) {
                  count++; // reset the row
                  row = { cols: [] }; // loop over the keys coming in so we can build each row across
                  for (var type in keys) {
                    var level = gameData[keys[type]][pointLevel];
                    if (level && 0 < level.questions.length) {
                      // get a random key based on what hasn't been used here previously
                      var qKey = Math.floor(
                          Math.random() * level.questions.length
                        ),
                        questionObject = {
                          uuid: this.generateUUID(),
                          type: level.type,
                          title: level.title,
                          points: level.points,
                          displayPoints: level.points,
                          isBonus: !1,
                          question: Object.assign({}, level.questions[qKey])
                        }; // remove this record
                      gameData[keys[type]][pointLevel].questions.splice(
                        qKey,
                        1
                      );
                      if ("bonus" === keys[type]) {
                        gameData[keys[type]][pointLevel].questions = [];
                        questionObject.disabled = !0;
                        questionObject.isBonus = !0;
                        questionObject.points = pointLevel;
                        questionObject.displayPoints = pointLevel;
                      } else if ("bonus" === pointLevel) {
                        questionObject.disabled = !0;
                        questionObject.isBonus = !0;
                      }
                      row.cols.push(questionObject);
                      this._gameBoardFlat[questionObject.uuid] = questionObject;
                    }
                  }
                  gameBoard.push(row);
                }
              } // this delay helps with updating the board after the fact
              this.set("gameBoard", []);
              setTimeout(function() {
                _this4.set("gameBoard", gameBoard);
                _this4.notifyPath("gameBoard.*");
              }, 100);
            }
          }
        },
        {
          key: "generateUUID",
          value: function generateUUID() {
            return "item-sss-ss-ss".replace(/s/g, this._uuidPart);
          }
        },
        {
          key: "_uuidPart",
          value: function _uuidPart() {
            return Math.floor(65536 * (1 + Math.random()))
              .toString(16)
              .substring(1);
          }
          /**
           * Reset focus on close back to the help button
           */
        },
        {
          key: "resetFocus",
          value: function resetFocus(e) {
            this.shadowRoot.querySelector("#helpbutton").focus();
          }
          /**
           * HAX bindings
           */
        },
        {
          key: "connectedCallback",
          /**
           * Attached to the DOM
           */ value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(GameShowQuiz.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            window.SimpleToast.requestAvailability();
            (0, _renderStatus.afterNextRender)(this, function() {
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
              this.HAXWiring = new _HAXWiring.HAXWiring();
              this.HAXWiring.setup(
                GameShowQuiz.haxProperties,
                GameShowQuiz.tag,
                this
              );
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
            });
          }
          /**
           * detached life cycke
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
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
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(GameShowQuiz.prototype),
                "disconnectedCallback",
                this
              )
              .call(this);
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_ad348000ab1611e9be6cc36ee328ec59()
            );
          }
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Title
               */ title: { type: String },
              gameDirectionsData: { type: String },
              gameDirections: {
                type: String,
                observer: "_gameDirectionsChanged"
              },
              token: { type: String },
              attemptsData: {
                type: Object,
                value: {
                  overall: {
                    labels: ["Slide ID", "Terminology", "Reading", "Lecture"],
                    series: [0, 0, 0, 0]
                  },
                  slideid: { labels: ["Correct", "Incorrect"], series: [0, 0] },
                  terminology: {
                    labels: ["Correct", "Incorrect"],
                    series: [0, 0]
                  },
                  reading: { labels: ["Correct", "Incorrect"], series: [0, 0] },
                  lecture: { labels: ["Correct", "Incorrect"], series: [0, 0] },
                  bonus: { labels: ["Correct", "Incorrect"], series: [0, 0] },
                  total: { labels: ["Correct", "Incorrect"], series: [0, 0] }
                }
              },
              /**
               * Points object
               */ points: {
                type: Object,
                value: {
                  slideid: { attempted: 0, earned: 0, percent: 0 },
                  terminology: { attempted: 0, earned: 0, percent: 0 },
                  reading: { attempted: 0, earned: 0, percent: 0 },
                  lecture: { attempted: 0, earned: 0, percent: 0 },
                  bonus: { attempted: 0, earned: 0, percent: 0 },
                  total: { attempted: 0, earned: 0, percent: 0 }
                }
              },
              /**
               * Remaining attempts for the user
               */ remainingAttempts: { type: Number, value: 30 },
              /**
               * Title to use on the directions dialog.
               */ directionsTitle: { type: String, value: "Directions" },
              /**
               * Title to use on the question dialog.
               */ questionTitle: {
                type: String,
                value: "Answer the following"
              },
              /**
               * Rows on the gameshow board
               */ gameBoard: { type: Array },
              gameBoardData: {
                type: Object,
                observer: "_gameBoardDataChanged"
              },
              /**
               * URL to load data for the game.
               */ gameData: { type: String },
              gameScoreBoardBackend: { type: String },
              /**
               * Active item that is in the modal.
               */ activeQuestion: { type: Object }
            };
          }
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
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
        }
      ]
    );
    return GameShowQuiz;
  })((0, _mutableData.MutableData)(_polymerElement.PolymerElement));
  _exports.GameShowQuiz = GameShowQuiz;
  window.customElements.define(GameShowQuiz.tag, GameShowQuiz);
});
