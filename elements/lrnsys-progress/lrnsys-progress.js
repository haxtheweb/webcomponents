/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-progress/paper-progress.js";
import "./lib/lrnsys-progress-circle.js";
/**
 * `lrnsys-progress`
 * `track progression as a circle and series of circles`
 *
 * @demo demo/index.html
 * @microcopy
 *  - node / circle - A progress circle on the line
 *  - nodes / items - the list of items in the progress bar
 *  - bubble - reserved for when events fire out of an element or value is tracking events
 *  - percentage - amount complete either in the bar or the nodes themselves
 *  - bar - the underlayed bar that's tracking overall progression
 */
class LrnsysProgress extends PolymerElement {
  static get template() {
    return html`
      <style include="paper-material-styles">
        :host {
          display: block;
          margin-top: 24px;
        }
        :host([size="tiny"]) {
          font-size: 12.8px;
        }
        :host([size="small"]) {
          font-size: 19.2px;
        }
        :host([size="medium"]) {
          font-size: 25.6px;
        }
        :host([size="large"]) {
          font-size: 44.8px;
        }
        :host([size="x-large"]) {
          font-size: 64px;
        }
        :host([size="epic"]) {
          font-size: 96px;
        }
        #circle-container {
          display: flex;
          justify-content: space-between;
          margin: -24px 0 0 0;
          padding: 0;
          list-style: none;
        }
        .progress-title {
          position: absolute !important;
          clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
          clip: rect(1px, 1px, 1px, 1px);
          overflow: hidden;
          height: 1px;
        }
        paper-progress {
          --paper-progress-height: 8px;
          --paper-progress-transition-duration: 0.5s;
          --paper-progress-transition-timing-function: ease;
          --paper-progress-transition-delay: 0.4s;
          width: 100%;
        }
        /* required to get the box shadow above the progress bar */
        .circle-node {
          z-index: 1;
        }
        ul#circle-container li.circle-node {
          list-style-type: none;
        }

        :host([vertical]) {
          width: max-content;
        }
        :host([vertical]) #circle-container {
          display: block;
        }
        :host([vertical]) paper-progress {
          display: none !important;
        }
        :host([vertical]) lrnsys-progress-circle {
          margin: 16px 0;
          padding: 0;
          width: 100%;
        }

        lrnsys-progress-circle {
          width: 40px;
          height: 40px;
          --lrnsys-progress-circle-size: 40px;
          --lrnsys-progress-spinner-size: 32px;
          --lrnsys-progress-icon-size: 24px;
          --paper-spinner-stroke-width: 1.2px;
        }
      </style>

      <iron-ajax
        id="ajax"
        url="[[activeNodeURL]]"
        handle-as="json"
        last-error="{{nodeDataError}}"
        on-response="handleNodeResponse"
      ></iron-ajax>
      <h3 class="progress-title">[[title]]</h3>
      <paper-progress
        id="progress"
        value="[[overallPercentage]]"
      ></paper-progress>
      <ul id="circle-container">
        <template is="dom-repeat" items="[[items]]" as="item">
          <li class="circle-node">
            <lrnsys-progress-circle
              play-finish-sound="[[soundFinish]]"
              play-sound="[[sound]]"
              complete-sound="[[completeSound]]"
              finished-sound="[[finishedSound]]"
              active="[[_isActive(index, active)]]"
              step="[[index]]"
              label="[[item.title]]"
              icon="[[item.metadata.icon]]"
              icon-complete="[[item.metadata.iconComplete]]"
              data-url="[[item.metadata.dataUrl]]"
              url="[[item.location]]"
              status="[[item.metadata.status]]"
              value="[[item.metadata.value]]"
              max="[[item.metadata.max]]"
              stroke-width="[[strokeWidth]]"
              tool-tip="[[!vertical]]"
              list-view="[[vertical]]"
              class\$="[[size]]"
            >
              <span slot="description">[[item.description]]</span>
            </lrnsys-progress-circle>
          </li>
        </template>
      </ul>
    `;
  }
  static get tag() {
    return "lrnsys-progress";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener(
        "node-is-active",
        this._bubbleUpChangeActive.bind(this)
      );
      this.addEventListener(
        "node-status-change",
        this._statusChanged.bind(this)
      );
    });
  }
  disconnectedCallback() {
    this.removeEventListener(
      "node-is-active",
      this._bubbleUpChangeActive.bind(this)
    );
    this.removeEventListener(
      "node-status-change",
      this._statusChanged.bind(this)
    );
    super.disconnectedCallback();
  }
  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }
  static get properties() {
    return {
      /**
       * Disable internal ajax calls as something is handling them above.
       */
      disableAjaxCalls: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Items to display to visualize the progression.
       */
      items: {
        type: Array,
        value: [],
        notify: true,
        observer: "_itemsChanged"
      },
      /**
       * Play sounds whenever an item is complete.
       * This can get pretty annoying though unless the items
       * won't be completed for awhile.
       */
      sound: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Play sound when the user finishes the progression. This
       * could also be annoying but far less so :)
       */
      soundFinish: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Play sound on complete.
       */
      completeSound: {
        type: String,
        value:
          this.pathFromUrl(decodeURIComponent(import.meta.url)) +
          "lib/assets/complete.mp3",
        reflectToAttribute: true
      },
      /**
       * Play sound on complete.
       */
      finishedSound: {
        type: String,
        value:
          this.pathFromUrl(decodeURIComponent(import.meta.url)) +
          "lib/assets/finished.mp3",
        reflectToAttribute: true
      },
      /**
       * Title of this progression, primarily for accessibility.
       */
      title: {
        type: String,
        value: "Steps to completion",
        reflectToAttribute: true
      },
      /**
       * Items displayed at specific points on the progression.
       * These aren't filled up but place points along the progression
       * which can help people see where they are relative to other
       * factors such as % complete as a tick mark or icon.
       */
      keyItems: {
        type: Array,
        value: [],
        notify: true
      },
      /**
       * ID of the active item.
       */
      active: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true,
        observer: "_activeChanged"
      },
      /**
       * Whether to automatically make disabled items available
       * or not when the previous one was just complete.
       */
      progressiveUnlock: {
        type: Boolean,
        value: true,
        reflectToAttribute: true,
        notify: true
      },
      /**
       * State of progress in the current progression
       */
      state: {
        type: String,
        value: null,
        reflectToAttribute: true,
        observer: "_reportState"
      },
      /**
       * How far is the user through this series of items.
       */
      overallPercentage: {
        type: Number,
        computed: "_overallPercentageCompute(items, active)",
        reflectToAttribute: true
      },
      /**
       * Responses for each item.
       */
      _responseList: {
        type: Array,
        value: []
      },
      /**
       * Active response from the node selected.
       */
      activeNodeResponse: {
        type: String,
        value: "",
        observer: "_activeResponseChanged"
      },
      /**
       * Active response from the node selected.
       */
      manifest: {
        type: Object,
        value: {},
        notify: true,
        observer: "_manifestChanged"
      },
      /**
       * Error.
       */
      nodeDataError: {
        type: Object,
        value: [],
        observer: "_handleNodeError"
      },
      /**
       * Flag to be vertical instead of horizontal.
       */
      vertical: {
        type: Boolean,
        value: false
      },
      /**
       * Size to make everything, small, medium, large, and epic
       * are available class names; default medium.
       */
      size: {
        type: String,
        value: "medium",
        notify: true,
        reflectToAttribute: true
      },
      /**
       * Calculate width based on the size since we have to convert em to px.
       */
      strokeWidth: {
        type: Number,
        computed: "_getStrokeWidth(size)"
      }
    };
  }
  /**
   * Set an appropriate stroke width based on size of the element.
   * This is because it's a hard pixel value when the rest of our
   * sizing is based on em's
   */
  _getStrokeWidth(size) {
    var width = 4;
    if (size == "tiny") {
      width = 3;
    } else if (size == "small") {
      width = 4;
    } else if (size == "medium") {
      width = 5;
    } else if (size == "large") {
      width = 6;
    } else if (size == "x-large") {
      width = 7;
    } else if (size == "epic") {
      width = 8;
    }

    return width;
  }

  /**
   * Fire event that state has changed with what the statement is.
   * This gives a readable name to what the state is of the progress bar
   * as well as access to the full item that triggered the state change.
   */
  _reportState(newValue, oldValue) {
    // help avoid initial ready state being null
    if (newValue != null && this.items.length > 0) {
      this.dispatchEvent(
        new CustomEvent("progress-state-change", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            state: this.state,
            active: this.items[this.active]
          }
        })
      );
    }
  }

  /**
   * Notice items have changed; only worry about if the count changes
   * though since other oberservers handle downstream mutation
   */
  _itemsChanged(newValue, oldValue) {
    // strange but this is effectively the same as "ready" except the ready
    // state invokes potentially without items while this one will only
    // match a case where there was no values and now we have one
    if (
      typeof oldValue !== typeof undefined &&
      typeof newValue !== typeof undefined &&
      newValue.length != oldValue.length &&
      typeof this._responseList[this.active] === typeof undefined
    ) {
      newValue[this.active].metadata.status = "loading";
      this.set("items." + this.active + ".metadata.status", "loading");
      this.notifyPath("items." + this.active + ".metadata.status");
      // becasue this is so early in bootstrap of the element we
      // won't be able to detect the initial loading event
      if (
        typeof newValue[this.active].dataUrl !== typeof undefined &&
        !this.disableAjaxCalls
      ) {
        this.shadowRoot.querySelector("#ajax").url =
          newValue[this.active].dataUrl;
        this.shadowRoot.querySelector("#ajax").generateRequest();
      } else {
        setTimeout(() => {
          newValue[this.active].metadata.status = "available";
          this.set("items." + this.active + ".metadata.status", "available");
          this.notifyPath("items." + this.active + ".metadata.status");
          this._responseList[this.active] = {};
          this.activeNodeResponse = this._responseList[this.active];
        }, 1200);
      }
    }
  }

  /**
   * Simple boolean for whatever is active currently.
   */
  _isActive(index, active) {
    return index === active;
  }

  /**
   * Active Response changed; bubble it up.
   */
  _activeResponseChanged(value) {
    this.dispatchEvent(
      new CustomEvent("progress-response-loaded", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { response: value }
      })
    );
  }

  /**
   * Notice event from the nodes themselves
   * and set active based on a node bubbling up an event
   * that says "Hey I am active now!"
   */
  _bubbleUpChangeActive(e) {
    // changing active will kick off events internally
    this.active = e.detail.target.step;
    this.dispatchEvent(
      new CustomEvent("json-outline-schema-active-item-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this.items[this.active]
      })
    );
  }
  /**
   * Allow for JSON Outline Schema manifest structure changes
   */
  _manifestChanged(newValue, oldValue) {
    if (newValue) {
      this.set("items", newValue.items);
      this.notifyPath("items.*");
    }
  }
  /**
   * Active item has changed, set the rest of the data to match.
   */
  _activeChanged(newValue, oldValue) {
    // bubble up event from state being set
    this.state = "active item is " + this.active;
    this.items.forEach((element, index, array) => {
      // if the current item is disabled, check the 1 prior to it if we can
      if (this.items[index].metadata.status == "disabled") {
        // do nothing, it's disabled unless....
        if (
          index != 0 &&
          this.progressiveUnlock &&
          this.items[index - 1].metadata.status == "complete"
        ) {
          this.items[index].metadata.status = "loading";
          this.set("items." + index + ".metadata.status", "loading");
          this.notifyPath("items." + index + ".metadata.status");
        }
      }
      // or if our value is at max AND it's the last item in the list
      else if (
        this.items[index].metadata.value >= this.items[index].metadata.max &&
        index == this.items.length - 1
      ) {
        this.items[index].metadata.status = "finished";
        this.set("items." + index + ".metadata.status", "finished");
        this.notifyPath("items." + index + ".metadata.status");
      }
      // or if we're just at max then mark us complete
      else if (
        this.items[index].metadata.value >= this.items[index].metadata.max
      ) {
        this.items[index].metadata.status = "complete";
        this.set("items." + index + ".metadata.status", "complete");
        this.notifyPath("items." + index + ".metadata.status");
      }
      // or if the index is the currently active item
      else if (index == this.active) {
        // see if we have the data for it already otherwise trigger loading
        if (typeof this._responseList[index] === typeof undefined) {
          this.items[index].metadata.status = "loading";
          this.set("items." + index + ".metadata.status", "loading");
          this.notifyPath("items." + index + ".metadata.status");
        }
        // if we already had a response, then mark available
        else {
          this.activeNodeResponse = this._responseList[index];
          this.items[index].metadata.status = "available";
          this.set("items." + index + ".metadata.status", "available");
          this.notifyPath("items." + index + ".metadata.status");
        }
      } else {
        // we didn't match any cases, just leave it active
        this.items[index].metadata.status = "available";
        this.set("items." + index + ".metadata.status", "available");
        this.notifyPath("items." + index + ".metadata.status");
      }
    });
  }

  /**
   * Listen for the state of anything below to change.
   */
  _statusChanged(e) {
    // we are in loading state so go load data and let the response
    // dictate what state we reach after that
    if (e.target.status == "loading") {
      if (
        typeof this.items[this.active].metadata.dataUrl !== typeof undefined &&
        !this.disableAjaxCalls
      ) {
        this.shadowRoot.querySelector("#ajax").url = this.items[
          this.active
        ].metadata.dataUrl;
        this.shadowRoot.querySelector("#ajax").generateRequest();
      } else {
        setTimeout(() => {
          this.items[this.active].metadata.status = "available";
          this.set("items." + this.active + ".metadata.status", "available");
          this.notifyPath("items." + this.active + ".metadata.status");
          this._responseList[this.active] = {};
          this.activeNodeResponse = this._responseList[this.active];
        }, 1500);
      }
    } else if (
      e.target.status == "complete" &&
      this.items.length === this.active + 1
    ) {
      setTimeout(() => {
        this.items[this.active].metadata.status = "finished";
        this.set("items." + this.active + ".metadata.status", "finished");
        this.notifyPath("items." + this.active + ".metadata.status");
      }, 100);
    }
  }

  /**
   * Response returned from triggering the Node's URL to fire to get a response.
   */
  handleNodeResponse(e) {
    const detail = e.detail;
    // this means that it was an internal path, fake "loading"
    if (typeof detail.response === typeof null) {
      setTimeout(() => {
        this.items[this.active].metadata.status = "available";
        this.set("items." + this.active + ".metadata.status", "available");
        this.notifyPath("items." + this.active + ".metadata.status");
        this._responseList[this.active] = detail.response;
        this.activeNodeResponse = this._responseList[this.active];
      }, 1500);
    }
    // valid response, pass it along for other things to use
    else {
      this.items[this.active].metadata.status = "available";
      this.set("items." + this.active + ".metadata.status", "available");
      this.notifyPath("items." + this.active + ".metadata.status");
      this._responseList[this.active] = detail.response;
      this.activeNodeResponse = this._responseList[this.active];
    }
  }

  /**
   * Weak support for error code being found
   */
  _handleNodeError(newValue, oldValue) {
    if (
      typeof oldValue !== typeof undefined &&
      newValue != null &&
      newValue.length != 0
    ) {
      // @todo, need support for a failed to load state; could be useful
      // if we go into an offline capability in the future
      this._responseList[this.active] = newValue;
      this.activeNodeResponse = this._responseList[this.active];
      // set available because we don't have a failed state
      this.items[this.active].metadata.status = "available";
      this.set("items." + this.active + ".metadata.status", "available");
      this.notifyPath("items." + this.active + ".metadata.status");
      // fire an event that this isn't really available so we know an issue occured
      this.dispatchEvent(
        new CustomEvent("node-load-failed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this.items[this.active]
        })
      );
    }
  }

  /**
   * Calculate the overall percentage competed.
   * This forms the line that's connecting the steps.
   */
  _overallPercentageCompute(items, active) {
    if (typeof items !== typeof undefined) {
      this.shadowRoot.querySelector("#progress").classList.add("transiting");
      return (active / (items.length - 1)) * 100;
    }
    return 0;
  }

  /**
   * Change the percentage for the active item.
   */
  changePercentage(percentage, mode) {
    var newp = 0;
    // support for adding and removing percentage as well as setting
    if (mode == "add") {
      newp = this.items[this.active].metadata.value + percentage;
    } else if (mode == "subtract") {
      newp = this.items[this.active].metadata.value - percentage;
    } else {
      newp = percentage;
    }
    // after establishing the new percentage, make sure it's less then max
    // if it's at or over max then we need to trigger events and state to change
    if (newp >= this.items[this.active].metadata.max) {
      if (this.items.length == this.active + 1) {
        // fire an event change to indicate that this happened
        this.state = "finished";
        this.items[this.active].metadata.status = "finished";
        this.set("items." + this.active + ".metadata.status", "finished");
        this.notifyPath("items." + this.active + ".metadata.status");
        // need to make sure finished happens prior to value set to 100
        // otherwise this will kick off the circle to complete itself
        this.items[this.active].metadata.value = this.items[
          this.active
        ].metadata.max;
        this.set(
          "items." + this.active + ".metadata.value",
          this.items[this.active].metadata.max
        );
        this.notifyPath("items." + this.active + ".metadata.value");
      } else {
        // set value = max which will automatically trigger complete in the circle
        this.items[this.active].metadata.value = this.items[
          this.active
        ].metadata.max;
        this.set(
          "items." + this.active + ".metadata.value",
          this.items[this.active].metadata.max
        );
        this.notifyPath("items." + this.active + ".metadata.value");
      }
      // ensure we still have more items to go in the list
      if (this.items.length > this.active + 1) {
        // if we have progressive unlocking then set the next thing available
        // assuming that the next thing is currently disabled and that we're not
        // on the first item. OR, if we don't have a response for the current
        // item in local storage then let's mark loading to kick off the calls
        if (
          (this.progressiveUnlock &&
            this.items[this.active].metadata.status == "complete" &&
            this.items[this.active + 1].metadata.status == "disabled") ||
          typeof this._responseList[this.active + 1] === typeof undefined
        ) {
          this.items[this.active + 1].metadata.status = "loading";
          this.set(
            "items." + (this.active + 1) + ".metadata.status",
            "loading"
          );
          this.notifyPath("items." + (this.active + 1) + ".metadata.status");
        }
        // set state so it gets reported upstream in events
        this.state = "active item is " + (this.active + 1);
        // bump active ahead 1 because we still have more items in the list
        this.active = this.active + 1;
      }
    } else {
      this.items[this.active].metadata.value = newp;
      this.set("items." + this.active + ".metadata.value", newp);
      this.notifyPath("items." + this.active + ".metadata.value");
    }
  }

  /**
   * Modify items and update template binding correctly.
   */
  updateItems(op, item) {
    var response = false;
    if (op == "push") {
      this.push("items", item);
      response = true;
    } else if (op == "pop") {
      response = this.pop("items");
    } else if (op == "splice") {
      this.splice("items", this.items.length, 0, item);
      response = true;
    }
    // force active to reprocess
    const active = this.active;
    this.set("active", 0);
    this.set("active", active);
    this.notifyPath("active");
    return response;
  }
}
window.customElements.define(LrnsysProgress.tag, LrnsysProgress);
export { LrnsysProgress };
