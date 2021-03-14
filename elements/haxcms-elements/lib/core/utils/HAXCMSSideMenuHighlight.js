/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
const HAXCMSSideMenuHighlight = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
    }

    static get properties() {
      let props = {};
      if (super.properties) {
        props = super.properties;
      }
      return {
        ...props,
      };
    }

    /*
     * returns all nodes under theme element
     */
    getThemeNodes() {
      let siteBuilder = document.querySelector("haxcms-site-builder");
      let themeElement = siteBuilder.firstElementChild;
      this.elements = themeElement.children;
      let themeShadow = themeElement.shadowRoot;
      let sideMenuElements = themeShadow.querySelectorAll(
        "site-menu-content, li, .item"
      );
      this.sideMenuItems = new Map();
      sideMenuElements.forEach((item) => {
        this.sideMenuItems.set(item.getAttribute("href"), item);
      });
    }

    /*
     * wraps all heading
     */
    wrapElements(elements) {
      for (let i = 0; i < elements.length; i++) {
        if (["H2", "H3", "H4", "H5", "H6"].includes(element[i].tagName)) {
          let wrapper = document.createElement("div");
          wrapper.id = element[i].id;
          element[i].parentNode.insertBefore(wrapper, element[i]);
          wrapper.appendChild(element[i]);
          let j = i + 1;
          while (j < elements.length) {
            if (!["H2", "H3", "H4", "H5", "H6"].includes(element[i].tagName)) {
              wrapper.appendChild(elements[j]);
              j++;
            } else {
              break;
            }
          }
        }
      }
    }

    createIntersectionObserver() {
      this.observer = new IntersectionObserver((entries) => {
        for (let entry in entries) {
          if (entry.isIntersecting) {
            this.sideMenuItems
              .get(`#${entry.target.id}`)
              .classList.add("active");
          } else {
            this.sideMenuItems
              .get(`#${entry.target.id}`)
              .classList.remove("active");
          }
        }
      });
    }

    applyIntersectionObservers() {
      let siteBuilder = document.querySelector("haxcms-site-builder");
      let themeElement = siteBuilder.firstElementChild;
      let elements = themeElement.children;
      for (let element in elements) {
        if (
          element.tagName === "div" &&
          this.sideMenuItems.has(`#${element.id}`)
        ) {
          this.observer.observe(element);
        }
      }
    }

    removeIntersectionObservers() {
      let siteBuilder = document.querySelector("haxcms-site-builder");
      let themeElement = siteBuilder.firstElementChild;
      let elements = themeElement.children;
      for (let element in elements) {
        if (
          element.tagName === "div" &&
          this.sideMenuItems.has(`#${element.id}`)
        ) {
          this.observer.unobserve(element);
        }
      }
    }

    scrollDetect() {
      let bodyElement = document.querySelector("body");
      console.log(bodyElement);
      bodyElement.addEventListener("scroll", (event) => {
        console.log("i am scrolling");
        var scrollTimer = -1;
        if (scrollTimer != -1) {
          clearTimeout(scrollTimer);
        }

        scrollTimer = setTimeout(this.scrollFinished(), 500);
      });
    }

    scrollFinished() {
      console.log("I am finished scrolling");
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      setTimeout(this.getThemeNodes(), 10);
      setTimeout(this.wrapElements(this.elements), 20);
      setTimeout(this.scrollDetect, 20);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      this.removeIntersectionObservers();
    }
  };
};

export { HAXCMSSideMenuHighlight };
