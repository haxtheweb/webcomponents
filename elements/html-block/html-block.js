/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { sanitizeHTMLString } from "@haxtheweb/utils/utils.js";
/**
 * `html-block`
 * @element html-block
 * `A basic HTML block that provides HAXschema wiring`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @demo demo/index.html
 */
class HtmlBlock extends HTMLElement {
  // render function
  get html() {
    return `
<style>

        </style>
<slot></slot>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "Html block",
        description: "A basic HTML block that provides HAXschema wiring",
        icon: "hax:html-code",
        color: "red",
        tags: ["Other", "developer", "html"],
        handles: [
          {
            type: "html",
            content: "slot",
          },
        ],
        meta: {
          author: "HAXTheWeb",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            slot: "",
            title: "HTML",
            description: "HTML code you want to present in content",
            inputMethod: "code-editor",
          },
        ],
        advanced: [],
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "html-block";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();

    // set tag for later use
    this.tag = HtmlBlock.tag;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    this.style.display = "block";
    // issues#3102 #26: read the author's allowscript intent BEFORE anything
    // else touches it and only force-sanitize when the attribute is absent.
    // Previously this set this.allowscript = false unconditionally, which
    // stripped a parse-time allowscript attribute and force-sanitized the
    // content regardless of author intent.
    if (this.allowscript == null && this.innerHTML !== "") {
      // issues#3102 #3 (security): sanitize any light DOM already present at
      // connect time and capture __rawHTML for it. Previously
      // connectedCallback only armed the MutationObserver, so pre-existing
      // markup kept live event-handler attributes (onclick= etc.) and script
      // nodes survived connection.
      this.__sanitizeHTML();
    }
    if (!this.__observer) {
      // issues#3102 #27: any sanitize pass above ran BEFORE the observer was
      // armed, so its write is never delivered back to us; clear the one-shot
      // ignore flag here (after sanitizing, before arming) so it cannot
      // swallow the next real mutation. Previously __ignoreChange was reset
      // AFTER the sanitize pass armed it, which let the observer deliver our
      // own write and run a second sanitize pass that stored already-escaped
      // content in __rawHTML.
      this.__ignoreChange = false;
      // ensure we keep applying sanitization as needed while monitoring the tree
      this.__observer = new MutationObserver(this.render.bind(this));
      this.__observer.observe(this, {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }
  render() {
    if (!this.__ignoreChange) {
      // issues#3102 #26: the attribute is boolean-ish; presence (even a bare
      // allowscript="") means the author allows script. Sanitize only when
      // the attribute is absent.
      if (this.allowscript == null) {
        this.__sanitizeHTML();
      }
    } else {
      this.__ignoreChange = false;
    }
  }

  static get observedAttributes() {
    return ["allowscript"];
  }
  get allowscript() {
    return this.getAttribute("allowscript");
  }
  set allowscript(value) {
    if (value) {
      this.setAttribute("allowscript", "allowscript");
    } else {
      this.removeAttribute("allowscript");
    }
  }
  // disconnectedCallback() {}
  attributeChangedCallback(attr, oldValue, newValue) {
    if (attr === "allowscript") {
      // issues#3102 #26: a bare allowscript attribute parses to the empty
      // string, which is the author saying "allow script"; only removal
      // (newValue == null) triggers sanitization.
      if (newValue == null) {
        // we should sanitize innerHTML but create a holding pen for the rawHTML first
        this.__sanitizeHTML();
      } else {
        // see if we had anything in the holding pen
        if (this.__rawHTML) {
          this.__ignoreChange = true;
          this.innerHTML = this.__rawHTML;
        }
      }
    }
  }
  __sanitizeHTML() {
    // security (F2/JS-XSS-001): route untrusted slotted HTML through the shared
    // sanitizer before writing back to innerHTML; preserve the raw value in
    // __rawHTML so toggling allowscript back on restores it (attributeChangedCallback).
    const rawHTML = this.innerHTML;
    // issues#3102 #27: capture raw once per content write, but skip the
    // recapture when innerHTML is already the escaped form of the stored pen.
    // A double sanitize pass (upgrade / attribute-reaction ordering) would
    // otherwise store escaped content in the pen and restoring allowscript
    // would give back escaped text instead of the author's original HTML.
    // Later, legitimate content writes still recapture the pen normally.
    if (
      this.__rawHTML == null ||
      rawHTML !== sanitizeHTMLString(this.__rawHTML)
    ) {
      this.__rawHTML = rawHTML;
    }
    // break the MutationObserver feedback loop: render() checks __ignoreChange
    // and resets it to false, preventing re-sanitization of our own write.
    this.__ignoreChange = true;
    this.innerHTML = sanitizeHTMLString(rawHTML);
  }
}
globalThis.customElements.define(HtmlBlock.tag, HtmlBlock);
export { HtmlBlock };
