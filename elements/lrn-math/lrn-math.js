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
  // Ensure the element renders once the MathJax controller is wired up.
  // We intentionally do NOT clone-and-replace the node here (the old
  // refresh() hack). Replacing the node after HAX has already applied
  // activation state (data-hax-active, data-hax-ray, drag/drop handlers,
  // and the activeNode reference) drops all of that state, which is why
  // a freshly inserted <lrn-math> would not appear active until the user
  // clicked away and clicked back. It also created a "replacement of a
  // replacement" race: the clone's connectedCallback would re-set mathtext
  // and trigger another innerHTML wipe while the original's was still
  // settling. updateMath() re-typesets in place via the controller queue,
  // so re-rendering does not require node replacement.
  setTimeout(() => {
    el.updateMath();
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
      // Sync the real math text into mathtext so the HAX form field is
      // populated on initial inline creation from highlighted text.
      //
      // We deliberately read textContent (not innerHTML) here: a HAX
      // source-view / double-click capture can write this element's own
      // outerHTML back into its light DOM innerHTML, producing a
      // self-referential blob like
      //   <lrn-math ...><lrn-math ...>understandf</lrn-math></lrn-math>
      // innerHTML would adopt that whole blob as the "math text" and then
      // render it escaped into itself (a replacement of a replacement).
      // textContent strips the nested tags and yields just the real LaTeX
      // ("understandf"), so the self-reference is normalized away on the
      // very first connectedCallback pass. The attributeChangedCallback
      // wipe then rebuilds a clean <span> from it.
      //
      // Previously this was gated on _haxstate, but that flag is not set
      // yet when connectedCallback fires on a freshly inserted node.
      if (!this.getAttribute("mathtext")) {
        const text = (this.textContent || "").trim();
        if (text) {
          this.mathtext = text;
        }
      }
      this.updateMath();
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
   * Reflected `processing` flag (much like a `loading` attribute) that is
   * true while the element is actively replacing its light DOM innards in
   * response to a mathtext change. Used internally as a re-entrancy guard
   * and reflected so HAX / CSS can observe the busy state.
   */
  get processing() {
    return this.hasAttribute("processing");
  }

  set processing(val) {
    if (val) {
      this.setAttribute("processing", "processing");
    } else {
      this.removeAttribute("processing");
    }
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
        // Self-reference guard. A HAX source-view / double-click capture
        // can serialize this element's own outerHTML (including HAX state
        // attributes like data-hax-active, data-hax-ray, role=textbox) and
        // write it back INTO the mathtext attribute. Without this guard the
        // normalization below would set innerText to that outerHTML string,
        // rendering escaped HTML "into itself" and nesting a copy of the
        // tag inside the tag. If the incoming value contains our own tag,
        // it is not valid LaTeX — rebuild mathtext from the real textContent
        // and let the re-triggered callback run the normal clean path.
        if (
          newValue &&
          newValue.indexOf("<lrn-math") !== -1
        ) {
          const real = (this.textContent || "").trim();
          // bypass the setter to avoid a redundant change event pair; the
          // setAttribute here re-triggers attributeChangedCallback with the
          // clean value, which is the path we want.
          this.setAttribute("mathtext", real || "");
          return;
        }
        if (newValue !== "" && newValue !== null) {
          clearTimeout(this._typingTimeout);
          this._typingTimeout = setTimeout(() => {
            // Re-entrancy guard: if we are already mid-replacement of the
            // light DOM innards, do not start another replacement. This
            // prevents a "replacement of a replacement" when mathtext
            // changes land while a prior normalization (or a HAX source
            // capture) is still in flight. processing is reflected as an
            // attribute so HAX / CSS can also see the element is busy,
            // much like a `loading` flag.
            if (this.processing) {
              return;
            }
            this.processing = true;
            const container = globalThis.document.createElement("span");
            container.innerText = newValue;
            this.innerHTML = "";
            this.appendChild(container);
            // Re-typeset from the normalized textContent. updateMath is
            // idempotent (cached by content check) so this is safe even if
            // the MutationObserver already queued one.
            this.updateMath();
            this.processing = false;
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
            math: "mathtext",
          },
          {
            type: "inline",
            text: "mathtext",
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
}

globalThis.customElements.define("lrn-math", LrnMath);
export { LrnMath };

globalThis.customElements.define("lrn-math-controller", LrnMathController);
export { LrnMathController };
