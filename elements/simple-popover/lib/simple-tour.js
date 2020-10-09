import { html, LitElement } from "lit-element/lit-element.js";
import { render } from "lit-html/lib/render.js";
import { unsafeHTML } from "lit-html/directives/unsafe-html.js";
import "./simple-popover-manager.js";

class SimpleTour extends LitElement {
  constructor() {
    super();
    this.stacks = {};
    this.active = null;
    this.tourInfo = {};
    this.activeElementDelay = 500;
    this.stop = -1;
    window.addEventListener(
      "simple-tour-register",
      this.registerNewTourEvent.bind(this)
    );
    window.addEventListener(
      "simple-tour-create-tour-stop",
      this.createTourStopEvent.bind(this)
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
      e.detail.position,
      e.detail.title,
      e.detail.description
    );
  }
  /**
   * Create a tour stop, add to the stack, then return the stop object
   */
  createTourStop(name, target, position, title, description) {
    let s = new TourStop();
    s.target = target;
    if (position) {
      s.position = position;
    }
    s.title = title;
    s.description = description;
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
    if (this.stop < this.stacks[this.active].length) {
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
  }
  stopTour(e) {
    window.SimplePopoverManager.requestAvailability().setPopover(
      this,
      this.stacks[this.active][this.stop].target,
      false
    );
    this.stop = -1;
    this.active = null;
  }
  /**
   * Render tour buttons as block
   */
  tourButtons() {
    return html` <h3>
        ${this.tourInfo[this.active].name}
        <span style="margin-left:16px"
          >${this.stop + 1}/${this.stacks[this.active].length}</span
        >
      </h3>
      <button
        @click="${this.prevStop.bind(this)}"
        ?disabled="${!this.hasPrev()}"
      >
        Previous
      </button>
      <button
        @click="${this.nextStop.bind(this)}"
        ?disabled="${!this.hasNext()}"
      >
        Next</button
      ><button @click="${this.stopTour.bind(this)}">Stop tour</button>`;
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
    this.stop = -1;
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
          document.createElement("div"),
          window.SimplePopoverManager.requestAvailability()
        );
        let content = html`${this.tourButtons()}
          <h3>
            ${unsafeHTML(
              "<span>" + this.stacks[this.active][this.stop].title + "</span>"
            )}
          </h3>
          ${unsafeHTML(
            "<p>" + this.stacks[this.active][this.stop].description + "</p>"
          )}${this.tourInfo[this.active].style
            ? unsafeHTML(
                "<style>" + this.tourInfo[this.active].style + "</style>"
              )
            : ""}`;
        render(content, window.SimplePopoverManager.requestAvailability());
        window.SimplePopoverManager.requestAvailability().setPopover(
          this,
          this.stacks[this.active][this.stop].target,
          true,
          this.stacks[this.active][this.stop].position
        );
        this.scrollHere(this.stacks[this.active][this.stop].target);
        let target = this.stacks[this.active][this.stop].target;
        let part = this.stacks[this.active][this.stop].target.getAttribute(
          "part"
        );
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
    this.position = "bottom";
    this.title = "Title";
    this.description = "<p>Description</p>";
  }
}

customElements.define("simple-tour", SimpleTour);
export { SimpleTour, TourStop };

// register globally so we can make sure there is only one
window.SimpleTourManager = window.SimpleTourManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.SimpleTourManager.requestAvailability = () => {
  if (!window.SimpleTourManager.instance) {
    window.SimpleTourManager.instance = document.createElement("simple-tour");
    document.body.appendChild(window.SimpleTourManager.instance);
  }
  return window.SimpleTourManager.instance;
};
// self append
export const SimpleTourManager = window.SimpleTourManager.requestAvailability();
