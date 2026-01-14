// forked from https://github.com/janmarthedal/math-tex
const document = globalThis.document,
  states = { start: 1, loading: 2, ready: 3, typesetting: 4, error: 5 };
let mathjaxHub,
  typesets = [],
  state = states.start,
  styleNode,
  src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js";

function getStyleNode() {
  const styleNodes = globalThis.document.querySelectorAll("style");
  const sn = Array.prototype.filter.call(styleNodes, function (n) {
    return (
      n.sheet &&
      n.sheet.cssRules.length > 100 &&
      n.sheet.cssRules[0].selectorText === ".mjx-chtml"
    );
  });
  styleNode = sn[0];
}

// precondition: state === states.ready
function flush_typesets() {
  if (!typesets.length) return;
  const jaxs = [],
    items = [];
  typesets.forEach(function (item) {
    const script = globalThis.document.createElement("script"),
      div = globalThis.document.createElement("div");
    script.type = item[1] ? "math/tex; mode=display" : "math/tex";
    script.text = item[0];
    div.style.position = "fixed";
    div.style.top = 0;
    div.style.left = "99999px";
    div.appendChild(script);
    globalThis.document.body.appendChild(div);
    jaxs.push(script);
    items.push([div, item[2]]);
  });
  typesets = [];
  state = states.typesetting;
  mathjaxHub.Queue(["Typeset", mathjaxHub, jaxs]);
  mathjaxHub.Queue(function () {
    if (!styleNode) getStyleNode();
    items.forEach(function (item) {
      const div = item[0];
      const result =
        div.firstElementChild.tagName === "SPAN" ? div.firstElementChild : null;
      item[1](result, styleNode);
      globalThis.document.body.removeChild(div);
    });
    state = states.ready;
    flush_typesets();
  });
}

function load_library() {
  state = states.loading;
  globalThis.MathJax = {
    skipStartupTypeset: true,
    showMathMenu: false,
    jax: ["input/TeX", "output/CommonHTML"],
    TeX: {
      extensions: [
        "AMSmath.js",
        "AMSsymbols.js",
        "noErrors.js",
        "noUndefined.js",
      ],
    },
    AuthorInit() {
      mathjaxHub = globalThis.MathJax.Hub;
      mathjaxHub.Register.StartupHook("End", function () {
        state = states.ready;
        flush_typesets();
      });
    },
  };
  var script = globalThis.document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  script.async = true;
  script.onerror = function () {
    console.warn("Error loading MathJax library " + src);
    state = states.error;
    typesets = [];
  };
  globalThis.document.head.appendChild(script);
}

class LrnMathController extends HTMLElement {
  connectedCallback() {
    if (this.hasAttribute("src")) src = this.getAttribute("src");
    if (!this.hasAttribute("lazy")) load_library();
  }

  typeset(math, displayMode, cb) {
    if (state === states.error) return;
    typesets.push([math, displayMode, cb]);
    if (state === states.start) load_library();
    else if (state === states.ready) flush_typesets();
  }
}

/*
Typesets math written in (La)TeX, using [MathJax](http://mathjax.org).
##### Example
    <math-tex>c = \sqrt{a^2 + b^2}</math-tex>
##### Example
    <math-tex mode="display">\sum_{k=1}^n k = \frac{n (n + 1)}{2}</math-tex>
@element math-tex
@version 0.3.2
@homepage http://github.com/janmarthedal/math-tex/
*/
const TAG_NAME = "lrn-math",
  CONTROLLER_TAG_NAME = "lrn-math-controller",
  mutation_config = {
    childList: true,
    characterData: true,
    attributes: true,
    subtree: true,
  };
let handler;
function check_handler(el) {
  if (handler) return;
  handler =
    globalThis.document.querySelector(CONTROLLER_TAG_NAME) ||
    globalThis.document.createElement(CONTROLLER_TAG_NAME);
  if (
    !globalThis.document.contains(handler) &&
    globalThis.document &&
    globalThis.document.head
  ) {
    globalThis.document.head.appendChild(handler);
  }
  setTimeout(() => {
    el.refresh();
  }, 0);
}

/**
 * lrn-math
 * A mathjax wrapper tag in vanillaJS
 *
 * @demo demo/index.html
 */
class LrnMath extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._private = {
      check: "",
      observer: new MutationObserver(() => {
        this.updateMath();
      }),
    };
    this._private.observer.observe(this, mutation_config);
  }
  static get tag() {
    return "lrn-math";
  }

  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this._haxstate = val;
  }

  connectedCallback() {
    check_handler(this);
    setTimeout(() => {
      // if in hax and we have innerHTML, we always defer to it
      if (this._haxstate && this.innerHTML) {
        this.mathtext = this.innerHTML;
      } else {
        this.updateMath();
      }
    }, 0);
  }

  updateMath() {
    const sdom = this.shadowRoot,
      math = this.textContent.trim(),
      isBlock = this.getAttribute("mode") === "display",
      check = (isBlock ? "D" : "I") + math;
    if (this._private && check !== this._private.check) {
      this.shadowRoot.innerHTML = "";
      this._private.check = check;
      if (math.length && handler) {
        handler.typeset(math, isBlock, function (melem, styleNode) {
          sdom.appendChild(styleNode.cloneNode(true));
          sdom.appendChild(melem);
        });
      }
    }
  }

  get mathtext() {
    return this.getAttribute("mathtext");
  }

  set mathtext(val) {
    this.setAttribute("mathtext", val);
  }

  /**
   * Use mathtext as a method for transfering values
   * from hax inline text to the slot.
   */
  static get observedAttributes() {
    return ["mathtext"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "mathtext":
        if (newValue !== "" && newValue !== null) {
          clearTimeout(this._typingTimeout);
          this._typingTimeout = setTimeout(() => {
            const container = globalThis.document.createElement("span");
            container.innerText = newValue;
            this.innerHTML = "";
            this.appendChild(container);
          }, 300);
        } else {
          this.updateMath();
        }
        break;
    }
  }

  static get haxProperties() {
    return {
      canScale: false,
      canEditSource: true,
      gizmo: {
        title: "Math",
        description: "Present math in a nice looking way.",
        icon: "hax:pi",
        color: "grey",
        tags: ["Instructional", "math", "mathjax", "mathml", "latex", "mathml"],
        handles: [
          {
            type: "math",
            math: "mathText",
          },
          {
            type: "inline",
            text: "mathText",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
          inlineOnly: true,
          selectionRequired: false,
        },
      },
      settings: {
        inline: [],
        configure: [
          {
            property: "mathtext",
            title: "Math",
            description: "Enter equation as LaTeX",
            inputMethod: "textarea",
          },
        ],
        advanced: [],
      },
    };
  }
  /**
   * forces a refresh to prevent dom reattachment issue
   */
  refresh() {
    let root = this;
    let clone = globalThis.document.createElement("lrn-math");
    root.parentNode.insertBefore(clone, root);
    clone.innerHTML = this.innerHTML;
    this.remove();
  }
}

globalThis.customElements.define("lrn-math", LrnMath);
export { LrnMath };

globalThis.customElements.define("lrn-math-controller", LrnMathController);
export { LrnMathController };
