import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import * as async from "./node_modules/@polymer/polymer/lib/utils/async.js";
import { IronA11yKeysBehavior } from "./node_modules/@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/iron-localstorage/iron-localstorage.js";
import "./node_modules/@polymer/neon-animation/neon-animated-pages.js";
import "./node_modules/@polymer/neon-animation/animations/slide-from-right-animation.js";
import "./node_modules/@polymer/neon-animation/animations/slide-from-left-animation.js";
import "./node_modules/@polymer/neon-animation/animations/slide-right-animation.js";
import "./node_modules/@polymer/neon-animation/animations/slide-left-animation.js";
import "./node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js";
import "./node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "./node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/paper-dialog/paper-dialog.js";
import "./node_modules/@polymer/paper-fab/paper-fab.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "./node_modules/@polymer/paper-listbox/paper-listbox.js";
import "./node_modules/@polymer/paper-item/paper-item.js";
import "./lib/layout-style.js";
import "./lib/contentsequencer-style.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="lrndesign-contentsequencer">
  <template strip-whitespace="">
    <style include="layout-style"></style>
    <style include="contentsequencer-style"></style>

    <iron-localstorage name="{{title}}" value="{{state}}" hidden="" on-iron-localstorage-load-empty="_stateInit" on-iron-localstorage-load="_stateLoaded">
    </iron-localstorage>

    <app-drawer-layout fullbleed="" narrow="{{_narrow}}">
      <app-drawer id="drawer" swipe-open="">

        <div class="drawer-content-wrapper layout vertical" style="height:100%">

          <div class="flex" style="overflow: auto;">
            <div title="Time remaining" hidden\$="{{!_isPositiveNum(duration)}}" class="countdown layout horizontal">
              <iron-icon icon="schedule"></iron-icon> <span>[[remaining]]</span>
            </div>

            <paper-dropdown-menu id="toc" class="flex" on-iron-select="_allowcontentsequencerComplete">
              <paper-listbox slot="dropdown-content" selected="{{selected}}">
              <template is="dom-repeat" items="{{steps}}" strip-whitespace="">
                <paper-item class\$="{{_tocItemClass(selected, index)}}">
                  <i>{{item.step}}</i><span>{{item.label}}</span>
                </paper-item>
              </template>
              </paper-listbox>
            </paper-dropdown-menu>
          </div>

        </div>

      </app-drawer>

      <app-header-layout fullbleed="">

        <div id="headerpanel" fixed="" narrow\$="[[_narrow]]">
          <div id="main-toolbar" hidden\$="[[noToolbar]]">
            <h3 class="title">[[title]]</h3>
            <div title="Time remaining" hidden\$="{{!_isPositiveNum(duration)}}" class="countdown layout horizontal">
              <iron-icon icon="schedule"></iron-icon> <span>{{remaining}}</span>
            </div>
          </div>
        </div>

        <div id="main-content">

          <neon-animated-pages id="pages" selected="{{selected}}" on-iron-deselect="_onStepLeave" on-iron-items-changed="_onStepsChanged">
            <slot select="lrndesign-contentsequencer-step"></slot>
          </neon-animated-pages>

          <footer id="controls" hidden\$="[[noArrows]]" narrow\$="[[_narrow]]">
            <div class="fabs layout horizontal justified">
              <paper-fab raised="" class="navbutton prevbutton" icon="chevron-left" on-tap="selectPrevious" title="Previous step" disabled\$="{{_isFirstStep(selected)}}">
              </paper-fab>

              <div>
                <template is="dom-if" if="{{_showNextFab(selected, steps)}}" strip-whitespace="">
                  <paper-fab icon="chevron-right" raised="" class="navbutton nextbutton" title="{{_nextFabTitle(selected)}}" on-tap="selectNext">
                  </paper-fab>
                </template>

                <template is="dom-if" if="{{_showDoneFab(selected, steps)}}" strip-whitespace="">
                  <paper-fab icon="done" raised="" class="navbutton donebutton" on-tap="_goToDoneLink" title="Complete contentsequencer">
                  </paper-fab>
                </template>
              </div>
            </div>
          </footer>
        </div>

      </app-header-layout>
    </app-drawer-layout>

    <paper-dialog id="resumeDialog" modal="">
      <h2>Would you like to resume where you left off?</h2>
      <p>Step <span>{{_storedStep.step}}</span>: <span>{{_storedStep.label}}</span></p>
      <div class="buttons">
        <paper-button dialog-dismiss="" on-click="_stateInit">Cancel</paper-button>
        <paper-button dialog-confirm="" on-click="_resume" autofocus="">Resume</paper-button>
      </div>
    </paper-dialog>

  </template>
  
</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "lrndesign-contentsequencer",
  behaviors: [IronA11yKeysBehavior],
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
      value: function() {
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
  ready: function() {
    this.keyEventTarget = document.body;
    this._updateStepIndexFromUrl();
  },
  _onStepsChanged: function() {
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
  selectNext: function() {
    this.$.pages.entryAnimation = "slide-from-right-animation";
    this.$.pages.exitAnimation = "slide-left-animation";
    this.select(this.selected + 1);
  },
  selectPrevious: function() {
    this.$.pages.entryAnimation = "slide-from-left-animation";
    this.$.pages.exitAnimation = "slide-right-animation";
    this.select(this.selected - 1);
  },
  select: function(stepIndex) {
    if (0 > stepIndex || stepIndex > this.steps.length - 1) {
      return;
    }
    this._allowcontentsequencerComplete();
    this.selected = stepIndex;
  },
  _selectedChanged: function() {
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
  _onStepLeave: function(e, detail) {
    var prev = detail.item;
    prev.active = !1;
    this._scrollToTopOfStep();
  },
  _stateInit: function() {
    this.state = { stepIndex: this.selected };
  },
  _stateLoaded: function() {
    async.microTask.run(() => {
      this._storedStep = this.steps[this.state.stepIndex];
      if (0 === this.selected && 0 < this.state.stepIndex) {
        this.$.resumeDialog.open();
      }
    });
  },
  _updateStepIndexFromUrl: function() {
    var step = parseInt(location.hash.slice(1), 10);
    if (isNaN(step) || 0 > step) {
      step = 0;
    }
    if (this.steps && this.steps.length && step > this.steps.length - 1) {
      step = this.steps.length - 1;
    }
    this.selected = step;
  },
  _allowcontentsequencerComplete: function() {
    this._set_userHasNavigated(!0);
  },
  _updateRemaining: function() {
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
  _resume: function() {
    this._resumed = !0;
    this.select(this.state.stepIndex);
    this._resumed = !1;
  },
  _goToDoneLink: function() {
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
  _tocItemClass: function(selected, i) {
    var cls = ["toc-item"];
    if (i < selected) {
      cls.push("completed");
    }
    return cls.join(" ");
  },
  _scrollToTopOfStep: function() {
    document.body.scrollTop = 0;
  },
  _isPositiveNum: function(duration) {
    return 0 < duration;
  },
  _isFirstStep: function(stepIndex) {
    return isNaN(stepIndex) || 0 == stepIndex;
  },
  _isLastStep: function(stepIndex) {
    if (!this.steps.length) {
      return !1;
    }
    return stepIndex >= this.steps.length - 1;
  },
  _showDoneFab: function(stepIndex) {
    return this._isLastStep(stepIndex);
  },
  _showNextFab: function(stepIndex) {
    return !this._isLastStep(stepIndex);
  },
  _nextFabTitle: function(stepIndex) {
    return 0 < stepIndex ? "Next step" : "Start contentsequencer";
  }
});
