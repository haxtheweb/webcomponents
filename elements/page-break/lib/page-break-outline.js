import { pageBreakManager } from "./page-break-manager.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

export class PageBreakOutline extends HTMLElement {
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.target = null;
    this.selector = null;
    this.div = globalThis.document.createElement("div");
    this.appendChild(this.div);
    this.basePath = "";
    this.addEventListener("click", this.clickHandler.bind(this));
  }
  static get tag() {
    return "page-break-outline";
  }
  static get observedAttributes() {
    return ["selector", "base-path"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "base-path" && newValue) {
      this.basePath = newValue;
    }
    if (name === "selector" && newValue) {
      this.selector = newValue;
      this.target = globalThis.document.querySelector(this.selector);
      this.render(this.div);
    }
  }
  connectedCallback() {
    setTimeout(() => {
      globalThis.addEventListener("page-break-change", this.rerender.bind(this), {
        signal: this.windowControllers.signal,
      });
    }, 0);
    // render on initial paint
    this.render(this.div);
  }

  disconnectedCallback() {
    this.windowControllers.abort();
  }
  clickHandler(e) {
    var target = normalizeEventPath(e)[0];
    if (target.tagName === "A") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      for (var i = 0; i < pageBreakManager.breaks.length; i++) {
        if (pageBreakManager.breaks[i].path === target.getAttribute("href")) {
          pageBreakManager.breaks[i].scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
          break;
        }
      }
    }
  }
  // oh.. you are a clever boy aren't you
  // well.. someone is clever, I'm just good at repurposing
  // source: https://ianopolous.github.io/javascript/innerHTML
  // this will check that we have a parentNode to avoid
  // really early calls for changes in our page break hierarchy
  // and then as long as we do have a parent, we can perform the replacement
  rerender() {
    // very simple debounce
    if (!this.__lock) {
      this.__lock = true;
      setTimeout(() => {
        let tmp = this.div.cloneNode(false);
        this.render(tmp);
        this.replaceChild(tmp, this.div);
        this.div = tmp;
        this.__lock = false;
      }, 0);
    }
  }
  // render a new mini outline of links based on discovering headings within a target
  render(container) {
    if (
      this.target &&
      this.target.children &&
      this.target.children.length > 0
    ) {
      // wipe inner
      var html = "<ul>" + "\n";
      var parents = [];
      // loop children
      const kids = this.target.querySelectorAll("page-break");
      for (let i = 0; i < kids.length; i++) {
        let el = kids[i];
        // see if our parent is the active parent
        if (parents.length > 0) {
          if (el.parent && parents.indexOf(el.parent) !== -1) {
            while (parents.indexOf(el.parent) !== -1) {
              html += "</ul></li>" + "\n";
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
              html += "</ul></li>" + "\n";
              parents.shift();
            }
            // ALLLL the way to 0
            html += "</ul></li>" + "\n";
          }
        }
        let depth = 0;
        if (
          i !== 0 &&
          el.parent &&
          this.target.querySelector(`page-break[path="${el.parent}"]`)
        ) {
          depth =
            this.target.querySelector(`page-break[path="${el.parent}"]`).depth +
            1;
        }
        html +=
          "<li>" +
          "\n" +
          `<a href="${this.basePath + el.path}" data-path="${
            el.path
          }" data-parent="${el.parent}" data-depth="${depth}">${el.title}</a>` +
          "\n";
        // set back into the element how deep it is; weird I know but the element doesn't
        // know this, the tree builder would though
        el.depth = depth;
        // see if WE have children
        if (i != kids.length && kids[i + 1] && kids[i + 1].parent === el.path) {
          html += "<ul>" + "\n";
          if (el.parent) {
            parents.unshift(el.parent);
          }
        } else {
          html += "</li>" + "\n";
        }
      }
      html += "</ul>" + "\n";
      container.innerHTML = html;
    }
  }
}

customElements.define(PageBreakOutline.tag, PageBreakOutline);
