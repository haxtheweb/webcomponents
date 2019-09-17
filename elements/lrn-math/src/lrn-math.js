// forked from https://github.com/janmarthedal/math-tex
const document = window.document,
  states = { start: 1, loading: 2, ready: 3, typesetting: 4, error: 5 };
let mathjaxHub,
  typesets = [],
  state = states.start,
  styleNode,
  src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js";

function getStyleNode() {
  const styleNodes = document.querySelectorAll("style");
  const sn = Array.prototype.filter.call(styleNodes, function(n) {
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
  typesets.forEach(function(item) {
    const script = document.createElement("script"),
      div = document.createElement("div");
    script.type = item[1] ? "math/tex; mode=display" : "math/tex";
    script.text = item[0];
    div.style.position = "fixed";
    div.style.top = 0;
    div.style.left = "99999px";
    div.appendChild(script);
    document.body.appendChild(div);
    jaxs.push(script);
    items.push([div, item[2]]);
  });
  typesets = [];
  state = states.typesetting;
  mathjaxHub.Queue(["Typeset", mathjaxHub, jaxs]);
  mathjaxHub.Queue(function() {
    if (!styleNode) getStyleNode();
    items.forEach(function(item) {
      const div = item[0];
      const result =
        div.firstElementChild.tagName === "SPAN" ? div.firstElementChild : null;
      item[1](result, styleNode);
      document.body.removeChild(div);
    });
    state = states.ready;
    flush_typesets();
  });
}

function load_library() {
  state = states.loading;
  window.MathJax = {
    skipStartupTypeset: true,
    showMathMenu: false,
    jax: ["input/TeX", "output/CommonHTML"],
    TeX: {
      extensions: [
        "AMSmath.js",
        "AMSsymbols.js",
        "noErrors.js",
        "noUndefined.js"
      ]
    },
    AuthorInit() {
      mathjaxHub = window.MathJax.Hub;
      mathjaxHub.Register.StartupHook("End", function() {
        state = states.ready;
        flush_typesets();
      });
    }
  };
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  script.async = true;
  script.onerror = function() {
    console.warn("Error loading MathJax library " + src);
    state = states.error;
    typesets = [];
  };
  document.head.appendChild(script);
}

class MathTexController extends HTMLElement {
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

export { MathTexController };

window.customElements.define("math-tex-controller", MathTexController);
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
  CONTROLLER_TAG_NAME = "math-tex-controller",
  mutation_config = {
    childList: true,
    characterData: true,
    attributes: true,
    subtree: true
  };
let handler;

function check_handler() {
  if (handler) return;
  handler =
    document.querySelector(CONTROLLER_TAG_NAME) ||
    document.createElement(CONTROLLER_TAG_NAME);
  if (!handler || typeof handler.typeset !== "function") {
    console.warn(
      "no %s element defined; %s element will not work",
      CONTROLLER_TAG_NAME,
      TAG_NAME
    );
    handler = undefined;
  } else if (!document.contains(handler)) document.head.appendChild(handler);
}

function update(elem) {
  const sdom = elem.shadowRoot,
    math = elem.textContent.trim(),
    isBlock = elem.getAttribute("mode") === "display",
    check = (isBlock ? "D" : "I") + math;
  if (check !== elem._private.check) {
    while (sdom.firstChild) sdom.removeChild(sdom.firstChild);
    elem._private.check = check;
    if (math.length) {
      handler.typeset(math, isBlock, function(melem, styleNode) {
        sdom.appendChild(styleNode.cloneNode(true));
        sdom.appendChild(melem);
      });
    }
  }
}

class MathTex extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    check_handler();
  }
  static get tag() {
    return "lrn-math";
  }

  connectedCallback() {
    const elem = this;
    window.requestAnimationFrame(function() {
      elem._private = {
        check: "",
        observer: new MutationObserver(function() {
          update(elem);
        })
      };
      update(elem);
      elem._private.observer.observe(elem, mutation_config);
    });
  }

  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Math",
        description: "Present math in a nice looking way.",
        icon: "hax:pi",
        iconLib: "@lrnwebcomponents/hax-iconset/hax-iconset.js",
        color: "grey",
        groups: ["Content"],
        handles: [
          {
            type: "math",
            math: "mathText"
          },
          {
            type: "inline",
            text: "mathText"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            slot: "",
            title: "Math",
            description: "Enter equation as MathML",
            inputMethod: "code-editor",
            icon: "editor:format-quote"
          }
        ],
        advanced: []
      }
    };
  }
  /**
   * forces a refresh to prevent dom reattachment issue
   */
  refresh() {
    let root = this;
    let clone = document.createElement("lrn-math");
    root.parentNode.insertBefore(clone, root);
    clone.innerHTML = this.innerHTML;
    this.remove();
  }

  disconnectedCallback() {
    if (this._private) {
      this._private.observer.disconnect();
      delete this._private;
    }
  }
}

window.customElements.define(MathTex.tag, MathTex);
export { MathTex };
