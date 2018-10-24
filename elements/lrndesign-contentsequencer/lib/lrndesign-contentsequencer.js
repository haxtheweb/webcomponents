import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-localstorage/iron-localstorage.js";
import "@polymer/neon-animation/neon-animated-pages.js";
import "@polymer/neon-animation/animations/slide-from-right-animation.js";
import "@polymer/neon-animation/animations/slide-from-left-animation.js";
import "@polymer/neon-animation/animations/slide-right-animation.js";
import "@polymer/neon-animation/animations/slide-left-animation.js";
import "@polymer/app-layout/app-header-layout/app-header-layout.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-fab/paper-fab.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
import "./layout-style.js";
import "./contentsequencer-style.js";
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
            <content select="lrndesign-contentsequencer-step"></content>
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
/*
Copyright (c) 2015 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
/**
This is the top level component of lrndesign-contentsequencer elements.
It expects to find one or more `lrndesign-contentsequencer-step` elements in its content.

Example:

    <lrndesign-contentsequencer title="Awesome contentsequencer" feedback-link="http://example.org"
                    last-updated="2015-01-28">
      <lrndesign-contentsequencer-step label="One" step="1" duration="10">
        ...
      </lrndesign-contentsequencer-step>
      <lrndesign-contentsequencer-step label="Two" step="2" duration="15">
        ...
      </lrndesign-contentsequencer-step>
    </lrndesign-contentsequencer>

The element can also be used in a minimalistic mode where less styling is
applied. Use the `theme="minimal"` attribute and combine with the
`noToolbar`, `noArrows`, and `noHighlight` properties to turn off the top nav and
prevent syntax highlighting code blocks, respectively:

    <lrndesign-contentsequencer theme="minimal" no-toolbar no-arrows no-highlight>

@demo demo/contentsequencer.html
@demo demo/embed.html
*/
Polymer({
  is: "lrndesign-contentsequencer",

  /**
   * Fired when the contentsequencer steps have been fully initialized.
   * @event lrndesign-contentsequencer-ready
   */

  /**
   * Fired when user advances a contentsequencer step or goes backwards.
   * @event lrndesign-contentsequencer-step
   * detail {{step: Object, index: Number}}
   */

  /**
   * Fired when user reaches the last step of the contentsequencer.
   * @event lrndesign-contentsequencer-complete
   */

  behaviors: [Polymer.IronA11yKeysBehavior],

  properties: {
    /**
     * contentsequencer title
     */
    title: {
      type: String,
      value: ""
    },

    /**
     * Main category, e.g. 'Android'
     */
    category: {
      type: String,
      value: null
    },

    /**
     * contentsequencer environment, e.g. 'web'
     */
    environment: {
      type: String,
      value: null
    },

    /**
     * Feedback URL for the contentsequencer bug repors.
     */
    feedbackLink: {
      type: String,
      value: ""
    },

    /**
     * Current step index, 0-based.
     * `location.hash` is synced with this number.
     */
    selected: {
      type: Number,
      value: 0
    },

    /**
     * Total duration of the contentsequencer, in minutes.
     */
    duration: {
      type: Number,
      value: 0,
      readOnly: true
    },

    /**
     * UI string for remaining tie to completion. Example: "5 min remaining".
     */
    remaining: {
      type: String,
      value: "",
      readOnly: true
    },

    /**
     * Last date the contentsequencer was updated, in YYYY-MM-DD format.
     */
    lastUpdated: {
      type: String,
      value: ""
    },

    /**
     * Link to go to when finished
     */
    doneLink: {
      type: String,
      value: "/"
    },

    /**
     * Step elements of the contentsequencer. Currently, only `<lrndesign-contentsequencer-step>`
     * elements are supported.
     * The steps are populated on 'attached': callback for distributed children
     * changes is still being worked on https://github.com/Polymer/polymer/issues/1773
     */
    steps: {
      type: Array,
      value: function() {
        return [];
      },
      readOnly: true
    },

    /**
     * contentsequencer state, synced with `localStorage`.
     * See `_stateInit` for object properties.
     */
    state: {
      type: Object,
      value: null
    },

    /**
     * Hides the topnav toolbar.
     */
    noToolbar: {
      type: Boolean,
      value: false
    },

    /**
     * Hides the forward/background navigation arrows.
     */
    noArrows: {
      type: Boolean,
      value: false
    },

    /**
     * Property determines whether the toolbar is hidden.
     */
    noHighlight: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    /**
     * Last selected step before leaving the contentsequencer.
     * Used in the $.resumeDialog to prompt a user to resume the contentsequencer
     * where the left off.
     *
     * It is synced with the `state.stepIndex` one time only, when the storage
     * is loaded.
     */
    _storedStep: {
      type: Object,
      value: null
    },

    /**
     * When true, indicates that the current step change was initiated
     * from the $.resumeDialog by the user clicking on 'resume' button.
     * This is mainly to prevent firing 'contentsequencer-complete' event
     * every time users return to a contentsequencer they've actually already done.
     */
    _resumed: {
      type: Boolean,
      value: false
    },

    /**
     * True once the user has navigated to another page.
     */
    _userHasNavigated: {
      type: Boolean,
      value: false,
      readOnly: true
    }
  },

  observers: ["_selectedChanged(steps, selected)"],

  keyBindings: {
    left: "selectPrevious",
    right: "selectNext"
  },

  ready: function() {
    // TODO: cannot be done on prototype.
    // SEe https://github.com/PolymerElements/iron-a11y-keys-behavior/issues/19
    this.keyEventTarget = /** @type {!HTMLBodyElement} */ (document.body);

    // select the step early, before localStorage is loaded
    this._updateStepIndexFromUrl();
  },

  _onStepsChanged: function() {
    var duration = 0;
    var steps = this.$.pages.items.map(
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

  /**
   * Advance one step of the contentsequencer.
   */
  selectNext: function() {
    this.$.pages.entryAnimation = "slide-from-right-animation";
    this.$.pages.exitAnimation = "slide-left-animation";
    this.select(this.selected + 1);
  },

  /**
   * Go one step backwards.
   */
  selectPrevious: function() {
    this.$.pages.entryAnimation = "slide-from-left-animation";
    this.$.pages.exitAnimation = "slide-right-animation";
    this.select(this.selected - 1);
  },

  /**
   * Select an arbitrary step of the contentsequencer.
   */
  select: function(stepIndex) {
    if (stepIndex < 0 || stepIndex > this.steps.length - 1) {
      return;
    }

    this._allowcontentsequencerComplete();
    this.selected = stepIndex;
  },

  _selectedChanged: function(steps, selected) {
    this.set("state.stepIndex", this.selected);
    this._updateRemaining();

    if (!this.steps.length) {
      return;
    }

    var step = this.steps[this.selected];
    step.active = true;

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
    prev.active = false;
    this._scrollToTopOfStep();
  },

  _stateInit: function() {
    this.state = { stepIndex: this.selected };
  },

  _stateLoaded: function() {
    // allow everything render and initialize,
    // especially this.steps which runs at the same init level
    // as iron-localstorage (on attached).
    this.async(function() {
      this._storedStep = this.steps[this.state.stepIndex];
      // resume dialog is shown only when all 3 conditions hold:
      // 1. user has already visited the contentsequencer in the past
      // 2. has made at least 1 step
      // 3. user is landed on the first step
      if (this.selected === 0 && this.state.stepIndex > 0) {
        this.$.resumeDialog.open();
      }
    }, 500);
  },

  _updateStepIndexFromUrl: function() {
    var step = parseInt(location.hash.slice(1), 10);
    if (isNaN(step) || step < 0) {
      step = 0;
    }
    if (this.steps && this.steps.length && step > this.steps.length - 1) {
      step = this.steps.length - 1;
    }
    this.selected = step;
  },

  _allowcontentsequencerComplete: function() {
    this._set_userHasNavigated(true);
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
    this._resumed = true;
    this.select(this.state.stepIndex);
    this._resumed = false;
  },

  _goToDoneLink: function() {
    // if there isn't a done link, default to fallback behavior
    // of finding an index link
    if (this.doneLink != "") {
      window.location.href = this.doneLink;
    } else {
      // extract 'index' search param
      var index;
      var parts = location.search.substring(1).split("&");
      for (var i = 0; i < parts.length; i++) {
        var param = parts[i].split("=");
        if (param[0] === "index") {
          index = param[1];
          break;
        }
      }
      // decode and extract index name from the search param
      // default index is 'index'
      index = index ? decodeURIComponent(index) : "";
      index = index.replace(/[^a-z0-9\-]+/gi, "");
      if (index === "index") {
        index = "";
      }
      // navigate away to the index page
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
    return duration > 0;
  },

  _isFirstStep: function(stepIndex) {
    return isNaN(stepIndex) || stepIndex == 0;
  },

  _isLastStep: function(stepIndex) {
    if (!this.steps.length) {
      return false;
    }
    return stepIndex >= this.steps.length - 1;
  },

  _showDoneFab: function(stepIndex, steps) {
    return this._isLastStep(stepIndex);
  },

  _showNextFab: function(stepIndex, steps) {
    return !this._isLastStep(stepIndex);
  },

  _nextFabTitle: function(stepIndex) {
    return stepIndex > 0 ? "Next step" : "Start contentsequencer";
  }
});
