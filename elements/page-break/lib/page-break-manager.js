export class PageBreakManager extends HTMLElement {
  constructor() {
    super();
    this.breaks = [];
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
      if (!this.breaks.find((node) => node === e.detail.node)) {
        this.breaks.push(e.detail.node);
      }
    } else {
      this.breaks.map((node, index) => {
        if (node === e.detail.node) {
          delete this.breaks[index];
        }
      });
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
