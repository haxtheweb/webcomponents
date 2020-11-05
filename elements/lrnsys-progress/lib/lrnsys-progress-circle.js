/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/circle-progress/circle-progress.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/paper-styles/paper-styles.js";
import "@polymer/paper-spinner/paper-spinner.js";
import "@polymer/neon-animation/neon-animation.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `lrnsys-progress-circle`
 * @element lrnsys-progress-circle
 * `circle that the outline grows as the percentage ticks up`
 *
 */
class LrnsysProgressCircle extends PolymerElement {
  static get template() {
    return html`
      <custom-style>
        <style is="custom-style" include="paper-material-styles">
          :host {
            display: block;
            transition: box-shadow
                var(--lrnsys-progress-circle-transition, 0.5s) linear,
              color var(--lrnsys-progress-circle-transition, 0.5s) ease-in-out,
              background-color var(--lrnsys-progress-circle-transition, 0.5s)
                ease-in-out;
          }
          :host([status="complete"]) .circle-wrapper {
            box-shadow: 0px 0px 0px 0.16px
              var(--lrnsys-progress-complete-color, var(--paper-green-900));
          }
          :host([status="disabled"]) .circle-wrapper {
            box-shadow: none;
          }
          :host([status="available"]) .circle-wrapper {
            box-shadow: none;
          }
          :host([active]) .circle-wrapper {
            box-shadow: 0px 0px 0px 0.16px var(--google-grey-500, #555555);
          }
          .circle-wrapper {
            border-radius: 100%;
          }
          .button {
            margin: 0;
            padding: 0;
            display: flex;
            min-width: 40px;
            border-radius: 100%;
          }
          button {
            width: var(--lrnsys-progress-circle-size, 40px);
            height: var(--lrnsys-progress-circle-size, 40px);
          }
          circle-progress {
            margin: 0;
            --circle-progress-width: var(--lrnsys-progress-circle-size, 40px);
            --circle-progress-height: var(--lrnsys-progress-circle-size, 40px);
            --circle-progress-stroke-color: var(
              --lrnsys-progress-color,
              var(--paper-green-500)
            );
            --circle-progress-bg-stroke-color: var(
              --lrnsys-progress-container-color,
              var(--google-grey-300)
            );
            --circle-progress-transition: 0.5s;
            --circle-progress-stroke-linecap: square;
            transition: color 0.5s ease-in-out,
              background-color 0.5s ease-in-out;
          }
          paper-spinner {
            display: block;
            font-size: 16px;
            width: var(--lrnsys-progress-spinner-size, 32px);
            height: var(--lrnsys-progress-spinner-size, 32px);
            position: absolute;
            z-index: 1;
            margin: 4px;
            padding: 0;
            visibility: visible;
            opacity: 1;
            transition: visibility 0.4s, opacity 0.4s ease;
          }
          paper-spinner.multi {
            --paper-spinner-layer-1-color: var(--paper-purple-500);
            --paper-spinner-layer-2-color: var(--paper-cyan-500);
            --paper-spinner-layer-3-color: var(--paper-blue-grey-500);
            --paper-spinner-layer-4-color: var(--paper-amber-500);
          }
          .transition {
            opacity: 0.4;
            width: calc(var(--lrnsys-progress-icon-size, 24px) - 8px);
            height: calc(var(--lrnsys-progress-icon-size, 24px) - 8px);
          }
          simple-icon {
            visibility: visible;
            opacity: 1;
            transition: width 0.1s linear, height 0.1s linear,
              visibility 0.4s ease, opacity 0.4s ease;
            --simple-icon-width: var(--lrnsys-progress-icon-size, 24px);
            --simple-icon-height: var(--lrnsys-progress-icon-size, 24px);
          }
          .disabled {
            background-color: var(
              --lrnsys-progress-disabled-color,
              var(--google-grey-500)
            );
            color: white;
          }
          .loading {
            background-color: white;
            color: black;
          }
          .finished simple-icon:not(.activeIcon) {
            --simple-icon-width: calc(
              var(--lrnsys-progress-icon-size, 24px) - 8px
            );
            --simple-icon-height: calc(
              var(--lrnsys-progress-icon-size, 24px) - 8px
            );
          }
          .available {
            background-color: var(
              --lrnsys-progress-active-color,
              var(--google-grey-300)
            );
            color: var(
              --lrnsys-progress-active-text-color,
              var(--google-grey-500)
            );
          }
          .activeIcon {
            color: black;
          }
          .complete .activeIcon {
            color: white;
          }
          :host([active]) .complete .activeIcon,
          :host([active]) .finished .activeIcon {
            color: black;
          }
          .complete,
          .finished {
            background-color: var(
              --lrnsys-progress-container-color,
              var(--paper-green-500)
            );
            color: white;
          }
          :host([active]) circle-progress {
            background-color: white;
            color: black;
          }
          .listview-title {
            font-size: 16px;
            padding: 0;
            margin: 0;
          }
          .description-content {
            font-size: 8px;
            font-style: italic;
          }
          .circle-wrapper {
            display: inline-block;
          }
          .listview {
            height: 32px;
            padding: 4px 0;
            margin: 0;
            vertical-align: top;
          }
          .link {
            height: 40px;
            width: 100%;
          }
          :host([list-view]) .button {
            margin: 0;
            padding: 0;
            display: block;
            min-width: 40px;
            border-radius: 0;
          }
        </style>
      </custom-style>
      <simple-tooltip
        hidden$="[[!toolTip]]"
        for="button"
        position="bottom"
        offset="8"
        animation-delay="0"
      >
        [[label]]
      </simple-tooltip>
      <button
        id="button"
        class="button"
        disabled$="[[disabled]]"
        title="[[label]]"
      >
        <span class="circle-wrapper">
          <paper-spinner
            active$="[[loading]]"
            hidden$="[[!loading]]"
            class="multi"
            alt$="Loading content for [[label]]"
          ></paper-spinner>
          <circle-progress
            class$="[[status]]"
            value="[[value]]"
            max="[[max]]"
            stroke-width="[[strokeWidth]]"
            angle="180"
          >
            <simple-icon
              id="icon"
              icon="[[activeIcon]]"
              hidden$="[[!activeIcon]]"
            ></simple-icon>
            <slot name="image"></slot>
          </circle-progress>
        </span>
        <span hidden$="[[!listView]]" id="listview" class="listview">
          <h3 class="listview-title">[[label]]</h3>
          <div class="description-content">
            <slot name="description"></slot> <slot></slot>
          </div>
        </span>
      </button>
    `;
  }
  static get tag() {
    return "lrnsys-progress-circle";
  }
  static get properties() {
    return {
      /**
       * Current value.
       */
      value: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true,
        observer: "_testValueComplete",
      },
      /**
       * Whether to add a tooltip on hover.
       */
      toolTip: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
      },
      /**
       * If this is in a list view, expand the output.
       */
      listView: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
      },
      /**
       * Icon.
       */
      icon: {
        type: String,
        value: "icons:description",
        reflectToAttribute: true,
      },
      /**
       * Special icon to use when the item has been completed.
       */
      iconComplete: {
        type: String,
        value: "icons:description",
        reflectToAttribute: true,
      },
      /**
       * Loading icon
       */
      loadingIcon: {
        type: String,
        value: "hourglass-full",
        reflectToAttribute: true,
      },
      /**
       * Finished icon
       */
      finishedIcon: {
        type: String,
        value: "thumb-up",
        reflectToAttribute: true,
      },
      /**
       * Current value.
       */
      activeIcon: {
        type: String,
        notify: true,
        computed: "_getActiveIcon(icon, iconComplete, status)",
      },
      /**
       * Array position within a larger body of items.
       */
      step: {
        type: Number,
        value: 0,
        reflectToAttribute: true,
      },
      /**
       * If this item is active or not in the larger list
       */
      active: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * Status of the progression.
       * Possible values are disabled, loading, available, complete
       */
      status: {
        type: String,
        value: "available",
        reflectToAttribute: true,
        notify: true,
        observer: "_statusChange",
      },
      /**
       * Correctly disable the button if it's status is such.
       */
      disabled: {
        type: Boolean,
        computed: "_disableStatus(status)",
      },
      /**
       * Calculate if something is in a loading status which invokes a swirl.
       */
      loading: {
        type: Boolean,
        computed: "_loadingStatus(status)",
      },
      /**
       * Boolean to invoke "finished" state. Useful for the last circle
       * in a series.
       */
      finished: {
        type: Boolean,
        computed: "_finishedStatus(status)",
      },
      /**
       * Max progression for doing math against.
       */
      max: {
        type: String,
        reflectToAttribute: true,
      },
      /**
       * Internal property to ensure we only ding 1x
       */
      __chimed: {
        type: Boolean,
        value: false,
      },
      /**
       * Internal property to ensure we only finish 1x
       */
      __finishchimed: {
        type: Boolean,
        value: false,
      },
      /**
       * URL to link to on click.
       */
      url: {
        type: String,
        value: "#",
        reflectToAttribute: true,
      },
      /**
       * Data url to bubble up for more advanced implementations.
       */
      dataUrl: {
        type: String,
        value: false,
        reflectToAttribute: true,
      },
      /**
       * Stroke width.
       */
      strokeWidth: {
        type: Number,
        value: 4,
      },
      /**
       * Tracks if focus state is applied for element consistency
       * when dealing with focus vs hover states.
       */
      focusState: {
        type: Boolean,
        value: false,
      },
      /**
       * Play sound status; if this should play sound
       * when it hits certain milestones or not.
       */
      playSound: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      /**
       * Play sound at end; if this should play sound
       * when it hits certain milestones or not.
       */
      playFinishSound: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      /**
       * Play sound on complete.
       */
      completeSound: {
        type: String,
        reflectToAttribute: true,
      },
      /**
       * Play sound on complete.
       */
      finishedSound: {
        type: String,
        reflectToAttribute: true,
      },
      /**
       * Fire and track milestones towards completion state.
       */
      _bubbleProgress: {
        type: Object,
        value: {
          25: false,
          50: false,
          75: false,
        },
      },
    };
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  /**
   * Ready state
   */
  ready() {
    super.ready();
    // seems odd but if we don't do this we can get issues with
    // this field being unified across all circles when really
    // we have to track this state per circle.
    this._bubbleProgress = {
      25: false,
      50: false,
      75: false,
    };
  }
  /**
   * Test if the value = max meaning that we hit complete from available
   */
  _testValueComplete(newValue, oldValue) {
    // ensure we were previously available before marking complete
    // this way we don't conflict with the finished state which can
    // only be set from outside the circle as the circle doesn't
    // know how many items are in the set
    if (newValue >= this.max && this.status == "available") {
      this.status = "complete";
    }
    // add events for certain mile stones; this has to be in reverse order
    // otherwise we could actuall be passing 75 but it was at 0. This allows
    // for jumping ahead and not triggering 25/50/75 all at once and preventing
    // over reported percentages upstream
    else if (newValue / this.max >= 0.75 && !this._bubbleProgress["75"]) {
      this.dispatchEvent(
        new CustomEvent("node-percent-milestone", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { percentage: 75 },
        })
      );
      this._bubbleProgress["75"] = true;
    } else if (newValue / this.max >= 0.5 && !this._bubbleProgress["50"]) {
      this.dispatchEvent(
        new CustomEvent("node-percent-milestone", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { percentage: 50 },
        })
      );
      this._bubbleProgress["50"] = true;
    } else if (newValue / this.max >= 0.25 && !this._bubbleProgress["25"]) {
      this.dispatchEvent(
        new CustomEvent("node-percent-milestone", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { percentage: 25 },
        })
      );
      this._bubbleProgress["25"] = true;
    }
  }
  constructor() {
    super();
    this.completeSound =
      this.pathFromUrl(decodeURIComponent(import.meta.url)) +
      "lib/assets/complete.mp3";
    this.finishedSound =
      this.pathFromUrl(decodeURIComponent(import.meta.url)) +
      "lib/assets/finished.mp3";
    setTimeout(() => {
      this.addEventListener("click", this.tapEventOn.bind(this));
      this.addEventListener("mouseover", this.focusOn.bind(this));
      this.addEventListener("mouseout", this.focusOff.bind(this));
      this.addEventListener("focused-changed", this.focusEvent.bind(this));
    }, 0);
  }
  /**
   * Focus event for UX consistency.
   */
  focusEvent(e) {
    // see if it has hover classes
    if (!this.disabled && this.status != "loading") {
      // focus shows focus
      if (this.focusState) {
        // force icon to be set to real one and class added
        this.shadowRoot.querySelector("#icon").icon = this.icon;
        this.shadowRoot.querySelector("#icon").classList.add("activeIcon");
      } else {
        // if complete set it back to what it was
        if (this.status == "complete" || this.status == "finished") {
          this.shadowRoot.querySelector("#icon").icon = this.activeIcon;
        }
        // drop the class for active step
        this.shadowRoot.querySelector("#icon").classList.remove("activeIcon");
      }
      this.focusState = !this.focusState;
    }
  }
  /**
   * Focus event for UX consistency.
   */
  focusOn(e) {
    // see if it has hover classes
    if (!this.disabled && this.status != "loading") {
      // force icon to be set to real one and class added
      this.shadowRoot.querySelector("#icon").icon = this.icon;
      this.shadowRoot.querySelector("#icon").classList.add("activeIcon");
    }
  }
  /**
   * Focus event for UX consistency.
   */
  focusOff(e) {
    // see if it has hover classes
    if (!this.disabled && this.status != "loading") {
      // if complete set it back to what it was
      if (this.status == "complete" || this.status == "finished") {
        this.shadowRoot.querySelector("#icon").icon = this.activeIcon;
      }
      // drop the class for active step
      this.shadowRoot.querySelector("#icon").classList.remove("activeIcon");
    }
  }
  /**
   * Tapped on the item.
   */
  tapEventOn(e) {
    let target = e.target;
    this.dispatchEvent(
      new CustomEvent("node-is-active", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { target },
      })
    );
  }
  /**
   * Calculate which icon to present.
   */
  _getActiveIcon(icon, iconComplete, status) {
    if (typeof icon !== typeof undefined) {
      var tmp = icon;
      // support for a loading icon while loading
      if (status == "loading") {
        tmp = this.loadingIcon;
        this.shadowRoot.querySelector("#icon").classList.add("transition");
      } else if (status == "finished") {
        tmp = this.finishedIcon;
      } else if (
        status == "complete" &&
        typeof iconComplete !== typeof undefined
      ) {
        if (this.playSound && !this.__chimed) {
          this._playSound();
        }
        tmp = iconComplete;
      } else {
        this.shadowRoot.querySelector("#icon").classList.remove("transition");
      }
      return tmp;
    }
    return false;
  }

  /**
   * Play the sound effect.
   */
  _playSound() {
    // calculate sound to use and ensure it only ever happens once
    // via the __chimed flag
    if (this.status == "complete") {
      window.audio = new Audio(this.completeSound);
      this.__chimed = true;
    } else if (this.status == "finished") {
      window.audio = new Audio(this.finishedSound);
      this.__finishchimed = true;
    } else {
      // shouldn't be possible
      window.audio = new Audio();
    }
    window.audio.play();
  }
  /**
   * Calculate loading based on the status of the item.
   */
  _loadingStatus(status) {
    if (status == "loading") {
      return true;
    }
    return false;
  }
  /**
   * Calculate loading based on the status of the item.
   */
  _finishedStatus(status) {
    if (status == "finished") {
      if (this.playFinishSound && !this.__finishchimed) {
        this._playSound();
      }
      return true;
    }
    return false;
  }
  /**
   * Notice when state changes to fire up an event for others to respond to.
   */
  _statusChange(newValue, oldValue) {
    // verify this isn't loading up
    if (typeof oldValue !== typeof undefined && newValue !== oldValue) {
      this.dispatchEvent(
        new CustomEvent("node-status-change", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: { status: newValue },
        })
      );
    }
  }
  /**
   * Calculate disable based on the status of the item.
   */
  _disableStatus(status) {
    if (status == "disabled") {
      return true;
    }
    return false;
  }
}
window.customElements.define(LrnsysProgressCircle.tag, LrnsysProgressCircle);
export { LrnsysProgressCircle };
