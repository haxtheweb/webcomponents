export class PageBreakManagerEl extends HTMLElement {
  constructor() {
    super();
    this.breaks = [];
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
      "page-break-registration",
      this.registerPageBreak.bind(this)
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      "page-break-registration",
      this.registerPageBreak.bind(this)
    );
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
