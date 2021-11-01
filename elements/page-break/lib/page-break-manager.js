export class PageBreakManagerEl extends HTMLElement {
  constructor() {
    super();
    this.target = null;
    this.breaks = [];
    this._timer = 0;
  }
  // return current parent node, or the node that would happen
  // on indent or outdent
  // @todo these detections need audited in the context of real material
  // in order to figure out which states are incorrect
  // indent and outdent are inconsistent at best
  getParent(el, rel = null) {
    var prevNode = null,
      targetNode = null;
    if (this.target) {
      if (rel === "indent") {
        // get prev sibling
        this.target.querySelectorAll("page-break").forEach((node) => {
          if (node === el) {
            targetNode = prevNode;
          }
          prevNode = node;
        });
      } else if (rel === "outdent") {
        // get parent
        if (this.target.querySelector(`page-break[path="${el.parent}"]`)) {
          targetNode = this.target.querySelector(
            `page-break[path="${el.parent}"]`
          );
          // get parent of parent
          if (
            this.target.querySelector(`page-break[path="${targetNode.parent}"]`)
          ) {
            targetNode = this.target.querySelector(
              `page-break[path="${targetNode.parent}"]`
            );
          }
          {
            targetNode = null;
          }
        }
      } else {
        // get parent
        if (this.target.querySelector(`page-break[path="${el.parent}"]`)) {
          targetNode = this.target.querySelector(
            `page-break[path="${el.parent}"]`
          );
        }
      }
    }
    return targetNode;
  }
  /**
   * get all elements between a target and a selector; inspired by
   * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
   */
  elementsBetween(elem, selector = "page-break", filter) {
    // Setup siblings array
    var siblings = [];
    // Get the next sibling element
    elem = elem.nextElementSibling;
    // As long as a sibling exists
    while (elem) {
      // If we've reached our match, bail
      if (elem.matches(selector)) break;
      // If filtering by a selector, check if the sibling matches
      if (filter && !elem.matches(filter)) {
        elem = elem.nextElementSibling;
        continue;
      }
      // Otherwise, push it to the siblings array
      siblings.push(elem);
      // Get the next sibling element
      elem = elem.nextElementSibling;
    }
    return siblings;
  }

  // common between element queries
  betweenElementsQuery(type = "all") {
    var allEl = [];
    switch (type) {
      case "headings":
        this.breaks.forEach((element) => {
          allEl = [
            ...allEl,
            ...this.elementsBetween(element, "page-break", "h1,h2,h3,h4,h5,h6"),
          ];
        });
        break;
      case "noheadings":
        this.breaks.forEach((element) => {
          allEl = [
            ...allEl,
            ...this.elementsBetween(
              element,
              "page-break",
              ":not(h1,h2,h3,h4,h5,h6)"
            ),
          ];
        });
        break;
      case "titles":
        this.breaks.forEach((element) => {
          allEl = [
            ...allEl,
            ...this.elementsBetween(
              element,
              "page-break",
              "[data-page-break-title]"
            ),
          ];
        });
        break;
      case "notitles":
        this.breaks.forEach((element) => {
          allEl = [
            ...allEl,
            ...this.elementsBetween(
              element,
              "page-break",
              ":not([data-page-break-title])"
            ),
          ];
        });
        break;
      case "all":
        this.breaks.forEach((element) => {
          allEl = [...allEl, ...this.elementsBetween(element)];
        });
        break;
    }
    return allEl;
  }

  connectedCallback() {
    window.addEventListener(
      "vaadin-router-location-changed",
      this.routeChanged.bind(this)
    );
    window.addEventListener(
      "page-break-registration",
      this.registerPageBreak.bind(this)
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      "vaadin-router-location-changed",
      this.routeChanged.bind(this)
    );
    window.removeEventListener(
      "page-break-registration",
      this.registerPageBreak.bind(this)
    );
  }
  // push an item into history from a page-break's path based on visibility
  // the elements will self report their visibility status and then this callback
  // will just pick the top most visible item and claim it is the route
  updateVisibleAsActive() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      if (document.querySelector("page-break[element-visible]")) {
        window.history.pushState(
          {},
          null,
          document.querySelector("page-break[element-visible]").path
        );
      }
    }, 500);
  }
  // vaadin route changed
  routeChanged(e) {
    console.log(e.detail);
  }
  registerPageBreak(e) {
    if (e.detail.action === "add") {
      // ensure this isn't already in there
      if (!this.breaks.find((value) => value === e.detail.value)) {
        this.breaks.push(e.detail.value);
      }
    } else {
      this.breaks.map((value, index) => {
        if (value === e.detail.value) {
          this.breaks.splice(index, 1);
        }
      });
    }
    if (this.breaks.length === 1) {
      this.target = e.detail.value.parentNode;
    } else if (this.breaks.length === 0) {
      this.target = null;
    }
    if (!this.__lock) {
      this.__lock = true;
      setTimeout(() => {
        // breaks updated, so we need to recalculate all headings we find
        this.breaks.forEach((element) => {
          this.elementsBetween(
            element,
            "page-break",
            "h1,h2,h3,h4,h5,h6"
          ).forEach((el) => {
            let tagNumber =
              (el.getAttribute("data-original-level")
                ? new Number(
                    el.getAttribute("data-original-level").replace("H", "")
                  )
                : new Number(el.tagName.replace("H", ""))) + element.depth;
            tagNumber = tagNumber > 6 ? 6 : tagNumber;
            const newH = document.createElement(`h${tagNumber}`);
            newH.setAttribute("data-original-level", el.tagName);
            for (var i = 0, l = el.attributes.length; i < l; ++i) {
              newH.setAttribute(
                el.attributes.item(i).nodeName,
                el.attributes.item(i).nodeValue
              );
            }
            newH.innerHTML = el.innerHTML;
            el.parentNode.replaceChild(newH, el);
            element.target = newH;
          });
        });
        // update the depth values based on building a "tree"
        if (
          this.target &&
          this.target.children &&
          this.target.children.length > 0
        ) {
          // wipe inner
          var parents = [];
          // loop children
          const kids = this.target.querySelectorAll("page-break");
          for (let i = 0; i < kids.length; i++) {
            let el = kids[i];
            // see if our parent is the active parent
            if (parents.length > 0) {
              if (el.parent && parents.indexOf(el.parent) !== -1) {
                while (parents.indexOf(el.parent) !== -1) {
                  parents.shift();
                }
              }
              // missing parent in the hierarchy
              else if (el.parent && parents.indexOf(el.parent) === -1) {
                // do nothing; something messed up so let's act like it
                // didn't happen and just render as we have been
              } else {
                // no parent, shift all the way down to nothing
                while (parents.length > 0) {
                  parents.shift();
                }
              }
              let depth = 0;
              if (
                i !== 0 &&
                el.parent &&
                this.target.querySelector(`page-break[path="${el.parent}"]`)
              ) {
                depth =
                  this.target.querySelector(`page-break[path="${el.parent}"]`)
                    .depth + 1;
              }
              // set back into the element how deep it is; weird I know but the element doesn't
              // know this, the tree builder would though
              el.depth = depth;
              // see if WE have children
              if (
                i != kids.length &&
                kids[i + 1] &&
                kids[i + 1].parent === el.path
              ) {
                if (el.parent) {
                  parents.unshift(el.parent);
                }
              }
            }
          }
        }
        this.__lock = false;
      }, 10);
    }
  }
}

// register globally so we can make sure there is only one
window.PageBreakManager = window.PageBreakManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.PageBreakManager.requestAvailability = () => {
  if (!window.PageBreakManager.instance) {
    window.PageBreakManager.instance = document.createElement(
      "page-break-manager"
    );
    document.body.appendChild(window.PageBreakManager.instance);
  }
  return window.PageBreakManager.instance;
};
window.customElements.define("page-break-manager", PageBreakManagerEl);
export const pageBreakManager = window.PageBreakManager.requestAvailability();
