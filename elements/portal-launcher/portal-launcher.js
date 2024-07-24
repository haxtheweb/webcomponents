/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `portal-launcher`
 * @element portal-launcher
 * `silly thing to play with portal tag and progressive enhancement`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @demo demo/index.html
 */
class PortalLauncher extends HTMLElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "portal-launcher";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    // set tag for later use
    this.tag = PortalLauncher.tag;
    // ensure there's at least 1 link in here somewhere...
    if (this.querySelectorAll("a")) {
      this.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", this.click.bind(this));
      });
    }
  }
  normalizeEventPath(e) {
    if (e.composed && e.composedPath) {
      return e.composedPath();
    } else if (e.path) {
      return e.path;
    } else if (e.originalTarget) {
      return [e.originalTarget];
    } else {
      return [e.target];
    }
  }
  /**
   * Basic feature detecting event handler
   */
  click(e) {
    let target = e.target;
    var eventPath = this.normalizeEventPath(e);
    // support walking the path in order to find the link clicked
    if (target.tagName !== "A") {
      eventPath.forEach((item) => {
        if (item.tagName === "A") {
          target = item;
        }
      });
    }

    if (target && target.getAttribute("href") != null) {
      // progressive enhancement, if this class exists, can the link click
      if ("HTMLPortalElement" in window) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Adding some styles with transitions
        const style = globalThis.document.createElement("style");
        const initialScale = 0.2;
        style.innerHTML = `
          portal {
            position:fixed;
            width: 100%;
            height: 100%;
            opacity: 0;
            box-shadow: 0 0 20px 10px #999;
            transform: scale(${initialScale});
            bottom: calc(20px + 50% * ${initialScale} - 50%);
            right: calc(20px + 50% * ${initialScale} - 50%);
            z-index: 10000;
          }
          .portal-transition {
            transition:
              transform 0.4s,
              bottom 0.7s,
              left 0.7s,
              opacity 1.0s;
          }
          @media (prefers-reduced-motion: reduce) {
            .portal-transition {
              transition: all 0.001s;
            }
          }
          .portal-reveal {
            transform: scale(1.0);
            bottom: 0px;
            left: 0px;
          }
          .fade-in {
            opacity: 1.0;
          }
        `;
        const portal = globalThis.document.createElement("portal");
        // Let's navigate into the WICG Portals spec page
        portal.src = target.getAttribute("href");
        // Add a class that defines the transition. Consider using
        // `prefers-reduced-motion` media query to control the animation.
        // https://developers.google.com/web/updates/2019/03/prefers-reduced-motion
        portal.classList.add("portal-transition");
        portal.addEventListener("transitionend", (evt) => {
          if (evt.propertyName == "bottom") {
            // Activate the portal once the transition has completed
            portal.activate();
          }
        });
        globalThis.document.body.appendChild(style, portal);
        // Waiting for the page to load.
        // using setTimeout is a suboptimal way and it's best to fade-in
        // when receiving a load complete message from the portal via postMessage
        setTimeout((_) => portal.classList.add("fade-in"), 250);
        setTimeout((_) => portal.classList.add("portal-reveal"), 500);
      }
    }
  }
}
customElements.define(PortalLauncher.tag, PortalLauncher);
export { PortalLauncher };
