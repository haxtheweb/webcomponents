import { SimpleTourManager } from "@haxtheweb/simple-popover/lib/simple-tour.js";

export const SimpleTourFinder = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.tourName = "default";
    }
    /**
     * Called every time the element is inserted into the DOM. Useful for
     * running setup code, such as fetching resources or rendering.
     * Generally, you should try to delay work until this time.
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      if (!super.firstUpdated) {
        this.discoverSimpleTourStops();
      }
    }
    /**
     * Called every time the element is removed from the DOM. Useful for
     * running clean up code (removing event listeners, etc.).
     */
    disconnectedCallback() {
      // @todo make sure we remove the items from the tour if the
      // element they are related to gets removed from the page
      super.disconnectedCallback();
    }
    /**
     * LitElement ready life cycle
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      this.discoverSimpleTourStops();
    }
    // find all items and automatically register with the tour
    discoverSimpleTourStops() {
      let items = this.shadowRoot.querySelectorAll("[data-simple-tour-stop]");
      items.forEach((el) => {
        try {
          // cascade title selection so it can be an already established attribute
          let title = "";
          if (
            el.getAttribute("data-stop-title") &&
            el.getAttribute(el.getAttribute("data-stop-title"))
          ) {
            title = el.getAttribute(el.getAttribute("data-stop-title"));
          } else if (el.querySelector("[data-stop-title]")) {
            title = el.querySelector("[data-stop-title]").innerHTML;
          }
          let content = el.querySelector("[data-stop-content]").innerHTML
            ? el.querySelector("[data-stop-content]").innerHTML
            : "";
          SimpleTourManager.createTourStop(
            this.tourName,
            el,
            title,
            content,
            "live",
          );
        } catch (e) {
          console.warn(e);
        }
      });
    }
  };
};
