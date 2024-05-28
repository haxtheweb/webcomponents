import { LitElement, html, render } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import "@haxtheweb/simple-toolbar/simple-toolbar.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "./simple-popover-manager.js";

class SimpleTour extends LitElement {
  constructor() {
    super();
    this.stacks = {};
    this.orientation = "lr";
    this.active = null;
    this.tourInfo = {};
    this.activeElementDelay = 500;
    this.stop = -1;
    globalThis.addEventListener(
      "simple-tour-register",
      this.registerNewTourEvent.bind(this),
    );
    globalThis.addEventListener(
      "simple-tour-create-tour-stop",
      this.createTourStopEvent.bind(this),
    );
  }
  registerNewTourEvent(e) {
    this.registerNewTour(e.detail);
  }
  registerNewTour(newTour) {
    if (!this.stacks[newTour.key]) {
      this.stacks[newTour.key] = [];
    }
    if (!this.tourInfo[newTour.key]) {
      this.tourInfo[newTour.key] = newTour;
    }
    return this.stacks[newTour.key];
  }
  /**
   * create tour stop via events
   */
  createTourStopEvent(e) {
    this.createTourStop(
      e.detail.name,
      e.detail.target,
      e.detail.title,
      e.detail.description,
      e.detail.mode,
    );
  }
  /**
   * Create a tour stop, add to the stack, then return the stop object
   */
  createTourStop(name, target, title, description, mode) {
    let s = new TourStop();
    s.target = target;
    s.title = title;
    s.description = description;
    s.mode = mode;
    this.addStops(name, [s]);
    return s;
  }
  /**
   * It's possible we drop a target from the DOM and then
   * have to remove it from the tour
   */
  removeTarget(name, target) {
    let dropList = [];
    this.stacks[name].forEach((item, index) => {
      if (item.target === target) {
        dropList.push(index);
      }
    });
    dropList.forEach((i) => {
      this.stacks[name].splice(i, 1);
    });
  }
  /**
   * Add stops to the tour
   */
  addStops(name, stops) {
    if (!this.stacks[name]) {
      this.stacks[name] = [];
    }
    this.stacks[name] = this.stacks[name].concat(stops);
  }
  hasNext() {
    return this.stop < this.stacks[this.active].length - 1;
  }

  hasPrev() {
    return this.stop > 0;
  }
  /**
   * Move ahead or back in the stack
   */
  nextStop(e) {
    if (this.stop < this.stacks[this.active].length - 1) {
      this.stop += 1;
    }
  }
  prevStop(e) {
    if (this.stop > 0) {
      this.stop -= 1;
    }
  }
  startTour(name) {
    this.active = name;

    this.dispatchEvent(
      new CustomEvent("tour-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
  }
  stopTour(e) {
    globalThis.SimplePopoverManager.requestAvailability().setPopover(
      this,
      this,
      false,
      this.orientation,
    );
    this.stop = -1;
    this.active = null;

    this.dispatchEvent(
      new CustomEvent("tour-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
  }
  /**
   * Render tour buttons as block
   */
  tourButtons() {
    return html`<h1 class="title" slot="heading">
        ${this.tourInfo[this.active].name},
        <span class="xofy"
          >${this.stop + 1}/${this.stacks[this.active].length}</span
        >
      </h1>
      <simple-icon-button-lite
        id="close"
        slot="heading"
        @click="${this.stopTour.bind(this)}"
        label="Stop Tour"
        icon="close"
      >
      </simple-icon-button-lite>
      <simple-icon-button-lite
        id="prev"
        slot="nav"
        @click="${this.prevStop.bind(this)}"
        ?disabled="${!this.hasPrev()}"
        label="Prev"
        title="Prev"
        icon="arrow-back"
        show-text-label
      >
      </simple-icon-button-lite>
      <simple-icon-button-lite
        id="next"
        slot="nav"
        @click="${this.nextStop.bind(this)}"
        ?disabled="${!this.hasNext()}"
        title="Next"
        label="Next"
        icon="arrow-forward"
        show-text-label
      >
      </simple-icon-button-lite>`;
  }
  /**
   * Simple utility to do nice scrolling or only scroll if we can't see it
   * as that is better behavior but not in all browsers
   */
  scrollHere(node) {
    // scroll to it
    if (typeof node.scrollIntoViewIfNeeded === "function") {
      node.scrollIntoViewIfNeeded(true);
    } else {
      node.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }
  /**
   * The manager was called and he's pissed. Do not cross Go, do not collect $200 in tips.
   * You're fired. Me, you, every body. We're fired because someone just asked for the manager
   * to do something else and we were already taking people on a tour and now the kitchen
   * is on fire and someone must be blamed.
   *
   * Also, global calls this to clean up local state when global is hijacked by another project
   * that also leverages the singleton and wants to ensure everyone cleans up after themselves
   * instead of flipping tables on their way out the door. We'll call this function pack up
   * on a Friday to avoid incidents.
   */
  managerReset() {
    this.stopTour();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "active" && this.active) {
        this.stop = 0;
      }
      if (
        (propName == "stop" && this.stop != -1) ||
        (propName == "active" && this.active)
      ) {
        render(
          globalThis.document.createElement("div"),
          globalThis.SimplePopoverManager.requestAvailability(),
        );
        let title = this.stacks[this.active][this.stop].title;
        let description = this.stacks[this.active][this.stop].description;
        // support for live rendering of the tour info to allow the DOM
        // to translate or dynamicallly set this based on other stateful details
        if (this.stacks[this.active][this.stop].mode == "live") {
          let el = this.stacks[this.active][this.stop].target;
          if (
            el.getAttribute("data-stop-title") &&
            el.getAttribute(el.getAttribute("data-stop-title"))
          ) {
            title = el.getAttribute(el.getAttribute("data-stop-title"));
          } else if (el.querySelector("[data-stop-title]")) {
            title = el.querySelector("[data-stop-title]").innerHTML;
          }
          description = el.querySelector("[data-stop-content]").innerHTML
            ? el.querySelector("[data-stop-content]").innerHTML
            : "";
        }
        let content = html`${this.tourButtons()}
          <h2 class="subheading" slot="body">
            ${unsafeHTML("<span>" + title + "</span>")}
          </h2>
          ${unsafeHTML('<p slot="body">' + description + "</p>")}${this
            .tourInfo[this.active].style
            ? unsafeHTML(
                "<style>" + this.tourInfo[this.active].style + "</style>",
              )
            : ""}`;
        render(content, globalThis.SimplePopoverManager.requestAvailability());
        globalThis.SimplePopoverManager.requestAvailability().setPopover(
          this,
          this.stacks[this.active][this.stop].target,
          true,
          this.orientation,
          this.active,
        );
        this.scrollHere(this.stacks[this.active][this.stop].target);
        let target = this.stacks[this.active][this.stop].target;
        let part =
          this.stacks[this.active][this.stop].target.getAttribute("part");
        target.setAttribute("part", "simple-tour-active");
        setTimeout(() => {
          if (part == null || part == "simple-tour-active") {
            target.removeAttribute("part");
          } else {
            target.setAttribute("part", part);
          }
        }, this.activeElementDelay);
      }
    });
  }
  static get properties() {
    return {
      stop: {
        type: Number,
      },
      active: {
        type: String,
      },
      stacks: {
        type: Object,
      },
      activeElementDelay: {
        type: Number,
      },
    };
  }
}

/**
 * Simple Tour Stop object for consistency
 */
class TourStop {
  constructor() {
    this.target = null;
    this.title = "Title";
    this.description = "<p>Description</p>";
  }
}

customElements.define("simple-tour", SimpleTour);
export { SimpleTour, TourStop };

// register globally so we can make sure there is only one
globalThis.SimpleTourManager = globalThis.SimpleTourManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.SimpleTourManager.requestAvailability = () => {
  if (!globalThis.SimpleTourManager.instance) {
    globalThis.SimpleTourManager.instance =
      globalThis.document.createElement("simple-tour");
    globalThis.document.body.appendChild(globalThis.SimpleTourManager.instance);
  }
  return globalThis.SimpleTourManager.instance;
};
// self append
export const SimpleTourManager =
  globalThis.SimpleTourManager.requestAvailability();
