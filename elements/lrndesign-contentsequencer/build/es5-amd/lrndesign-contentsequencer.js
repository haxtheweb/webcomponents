define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/utils/async.js",
  "./node_modules/@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js",
  "./node_modules/@polymer/iron-icons/iron-icons.js",
  "./node_modules/@polymer/iron-localstorage/iron-localstorage.js",
  "./node_modules/@polymer/neon-animation/neon-animated-pages.js",
  "./node_modules/@polymer/neon-animation/animations/slide-from-right-animation.js",
  "./node_modules/@polymer/neon-animation/animations/slide-from-left-animation.js",
  "./node_modules/@polymer/neon-animation/animations/slide-right-animation.js",
  "./node_modules/@polymer/neon-animation/animations/slide-left-animation.js",
  "./node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js",
  "./node_modules/@polymer/app-layout/app-drawer/app-drawer.js",
  "./node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@polymer/paper-dialog/paper-dialog.js",
  "./node_modules/@polymer/paper-fab/paper-fab.js",
  "./node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js",
  "./node_modules/@polymer/paper-listbox/paper-listbox.js",
  "./node_modules/@polymer/paper-item/paper-item.js",
  "./lib/layout-style.js",
  "./lib/contentsequencer-style.js"
], function(_polymerLegacy, async, _ironA11yKeysBehavior) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="lrndesign-contentsequencer">\n  <template strip-whitespace="">\n    <style include="layout-style"></style>\n    <style include="contentsequencer-style"></style>\n\n    <iron-localstorage name="{{title}}" value="{{state}}" hidden="" on-iron-localstorage-load-empty="_stateInit" on-iron-localstorage-load="_stateLoaded">\n    </iron-localstorage>\n\n    <app-drawer-layout fullbleed="" narrow="{{_narrow}}">\n      <app-drawer id="drawer" swipe-open="">\n\n        <div class="drawer-content-wrapper layout vertical" style="height:100%">\n\n          <div class="flex" style="overflow: auto;">\n            <div title="Time remaining" hidden$="{{!_isPositiveNum(duration)}}" class="countdown layout horizontal">\n              <iron-icon icon="schedule"></iron-icon> <span>[[remaining]]</span>\n            </div>\n\n            <paper-dropdown-menu id="toc" class="flex" on-iron-select="_allowcontentsequencerComplete">\n              <paper-listbox slot="dropdown-content" selected="{{selected}}">\n              <template is="dom-repeat" items="{{steps}}" strip-whitespace="">\n                <paper-item class$="{{_tocItemClass(selected, index)}}">\n                  <i>{{item.step}}</i><span>{{item.label}}</span>\n                </paper-item>\n              </template>\n              </paper-listbox>\n            </paper-dropdown-menu>\n          </div>\n\n        </div>\n\n      </app-drawer>\n\n      <app-header-layout fullbleed="">\n\n        <div id="headerpanel" fixed="" narrow$="[[_narrow]]">\n          <div id="main-toolbar" hidden$="[[noToolbar]]">\n            <h3 class="title">[[title]]</h3>\n            <div title="Time remaining" hidden$="{{!_isPositiveNum(duration)}}" class="countdown layout horizontal">\n              <iron-icon icon="schedule"></iron-icon> <span>{{remaining}}</span>\n            </div>\n          </div>\n        </div>\n\n        <div id="main-content">\n\n          <neon-animated-pages id="pages" selected="{{selected}}" on-iron-deselect="_onStepLeave" on-iron-items-changed="_onStepsChanged">\n            <slot select="lrndesign-contentsequencer-step"></slot>\n          </neon-animated-pages>\n\n          <footer id="controls" hidden$="[[noArrows]]" narrow$="[[_narrow]]">\n            <div class="fabs layout horizontal justified">\n              <paper-fab raised="" class="navbutton prevbutton" icon="chevron-left" on-tap="selectPrevious" title="Previous step" disabled$="{{_isFirstStep(selected)}}">\n              </paper-fab>\n\n              <div>\n                <template is="dom-if" if="{{_showNextFab(selected, steps)}}" strip-whitespace="">\n                  <paper-fab icon="chevron-right" raised="" class="navbutton nextbutton" title="{{_nextFabTitle(selected)}}" on-tap="selectNext">\n                  </paper-fab>\n                </template>\n\n                <template is="dom-if" if="{{_showDoneFab(selected, steps)}}" strip-whitespace="">\n                  <paper-fab icon="done" raised="" class="navbutton donebutton" on-tap="_goToDoneLink" title="Complete contentsequencer">\n                  </paper-fab>\n                </template>\n              </div>\n            </div>\n          </footer>\n        </div>\n\n      </app-header-layout>\n    </app-drawer-layout>\n\n    <paper-dialog id="resumeDialog" modal="">\n      <h2>Would you like to resume where you left off?</h2>\n      <p>Step <span>{{_storedStep.step}}</span>: <span>{{_storedStep.label}}</span></p>\n      <div class="buttons">\n        <paper-button dialog-dismiss="" on-click="_stateInit">Cancel</paper-button>\n        <paper-button dialog-confirm="" on-click="_resume" autofocus="">Resume</paper-button>\n      </div>\n    </paper-dialog>\n\n  </template>\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "lrndesign-contentsequencer",
    behaviors: [_ironA11yKeysBehavior.IronA11yKeysBehavior],
    properties: {
      title: { type: String, value: "" },
      category: { type: String, value: null },
      environment: { type: String, value: null },
      feedbackLink: { type: String, value: "" },
      selected: { type: Number, value: 0 },
      duration: { type: Number, value: 0, readOnly: !0 },
      remaining: { type: String, value: "", readOnly: !0 },
      lastUpdated: { type: String, value: "" },
      doneLink: { type: String, value: "/" },
      steps: {
        type: Array,
        value: function value() {
          return [];
        },
        readOnly: !0
      },
      state: { type: Object, value: null },
      noToolbar: { type: Boolean, value: !1 },
      noArrows: { type: Boolean, value: !1 },
      noHighlight: { type: Boolean, value: !1, reflectToAttribute: !0 },
      _storedStep: { type: Object, value: null },
      _resumed: { type: Boolean, value: !1 },
      _userHasNavigated: { type: Boolean, value: !1, readOnly: !0 }
    },
    observers: ["_selectedChanged(steps, selected)"],
    keyBindings: { left: "selectPrevious", right: "selectNext" },
    ready: function ready() {
      this.keyEventTarget = document.body;
      this._updateStepIndexFromUrl();
    },
    _onStepsChanged: function _onStepsChanged() {
      var duration = 0,
        steps = this.$.pages.items.map(
          function(item, i) {
            duration += item.duration;
            item.step = i + 1;
            return item;
          }.bind(this)
        );
      this._setSteps(steps);
      this._setDuration(duration);
      this._updateRemaining();
      this.fire("lrndesign-contentsequencer-ready", { steps: this.steps });
    },
    selectNext: function selectNext() {
      this.$.pages.entryAnimation = "slide-from-right-animation";
      this.$.pages.exitAnimation = "slide-left-animation";
      this.select(this.selected + 1);
    },
    selectPrevious: function selectPrevious() {
      this.$.pages.entryAnimation = "slide-from-left-animation";
      this.$.pages.exitAnimation = "slide-right-animation";
      this.select(this.selected - 1);
    },
    select: function select(stepIndex) {
      if (0 > stepIndex || stepIndex > this.steps.length - 1) {
        return;
      }
      this._allowcontentsequencerComplete();
      this.selected = stepIndex;
    },
    _selectedChanged: function _selectedChanged() {
      this.set("state.stepIndex", this.selected);
      this._updateRemaining();
      if (!this.steps.length) {
        return;
      }
      var step = this.steps[this.selected];
      step.active = !0;
      location.hash = this.selected.toString();
      this.fire("lrndesign-contentsequencer-step", {
        index: this.selected,
        step: step
      });
      if (
        this.selected === this.steps.length - 1 &&
        !this._resumed &&
        this._userHasNavigated
      ) {
        this.fire("lrndesign-contentsequencer-complete");
      }
    },
    _onStepLeave: function _onStepLeave(e, detail) {
      var prev = detail.item;
      prev.active = !1;
      this._scrollToTopOfStep();
    },
    _stateInit: function _stateInit() {
      this.state = { stepIndex: this.selected };
    },
    _stateLoaded: function _stateLoaded() {
      var _this = this;
      async.microTask.run(function() {
        _this._storedStep = _this.steps[_this.state.stepIndex];
        if (0 === _this.selected && 0 < _this.state.stepIndex) {
          _this.$.resumeDialog.open();
        }
      });
    },
    _updateStepIndexFromUrl: function _updateStepIndexFromUrl() {
      var step = parseInt(location.hash.slice(1), 10);
      if (isNaN(step) || 0 > step) {
        step = 0;
      }
      if (this.steps && this.steps.length && step > this.steps.length - 1) {
        step = this.steps.length - 1;
      }
      this.selected = step;
    },
    _allowcontentsequencerComplete: function _allowcontentsequencerComplete() {
      this._set_userHasNavigated(!0);
    },
    _updateRemaining: function _updateRemaining() {
      if (!this.steps) {
        return;
      }
      var remain = 0;
      this.steps.slice(this.selected).forEach(function(item) {
        remain += item.duration || 0;
      });
      var str = this._narrow ? "" : " remaining";
      this._setRemaining(remain + " min" + str);
    },
    _resume: function _resume() {
      this._resumed = !0;
      this.select(this.state.stepIndex);
      this._resumed = !1;
    },
    _goToDoneLink: function _goToDoneLink() {
      if ("" != this.doneLink) {
        window.location.href = this.doneLink;
      } else {
        for (
          var index,
            parts = location.search.substring(1).split("&"),
            i = 0,
            param;
          i < parts.length;
          i++
        ) {
          param = parts[i].split("=");
          if ("index" === param[0]) {
            index = param[1];
            break;
          }
        }
        index = index ? decodeURIComponent(index) : "";
        index = index.replace(/[^a-z0-9\-]+/gi, "");
        if ("index" === index) {
          index = "";
        }
        window.location.href = "/" + index;
      }
    },
    _tocItemClass: function _tocItemClass(selected, i) {
      var cls = ["toc-item"];
      if (i < selected) {
        cls.push("completed");
      }
      return cls.join(" ");
    },
    _scrollToTopOfStep: function _scrollToTopOfStep() {
      document.body.scrollTop = 0;
    },
    _isPositiveNum: function _isPositiveNum(duration) {
      return 0 < duration;
    },
    _isFirstStep: function _isFirstStep(stepIndex) {
      return isNaN(stepIndex) || 0 == stepIndex;
    },
    _isLastStep: function _isLastStep(stepIndex) {
      if (!this.steps.length) {
        return !1;
      }
      return stepIndex >= this.steps.length - 1;
    },
    _showDoneFab: function _showDoneFab(stepIndex) {
      return this._isLastStep(stepIndex);
    },
    _showNextFab: function _showNextFab(stepIndex) {
      return !this._isLastStep(stepIndex);
    },
    _nextFabTitle: function _nextFabTitle(stepIndex) {
      return 0 < stepIndex ? "Next step" : "Start contentsequencer";
    }
  });
});
