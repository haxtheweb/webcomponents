/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-popover/simple-popover.js";
import "@haxtheweb/simple-modal/lib/simple-modal-template.js";

/**
 * `vocab-term`
 * `a vocabulary term visualized in the page`
 * @demo demo/index.html
 * @element vocab-term
 * #### Styling
Custom property | Description | Default
----------------|-------------|----------
`--vocab-term-bottom-border` | Underline of the vocab term. | 1px dashed gray
`--vocab-term-color` | Color of the vocab term. | black
 */
class VocabTerm extends LitElement {
  static get properties() {
    return {
      popoverMode: { type: Boolean, reflect: true, attribute: "popover-mode" },
      detailsOpen: { type: Boolean },
      links: {
        type: Array,
        converter: {
          fromAttribute: (val) => {
            return val.split(/\r?\n/).map((p) => {
              let ary = p.split(",");
              return {
                title: ary[0],
                href: ary[1],
              };
            });
          },
          toAttribute: (val) => {
            let ary = val.map((p) => `${p.title},${p.href}`);
            return ary.join("\n");
          },
        },
      },
      information: { type: String },
      term: { type: String },
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this._haxstate = false;
    this.popoverMode = false;
    this.term = null;
    this.information = null;
    this.links = [];
    this.detailsOpen = false;
    if (this.querySelector("summary")) {
      this.term = this.querySelector("summary").textContent;
    }
    if (this.querySelector(`[slot="information"]`)) {
      this.information = this.querySelector(`[slot="information"]`).textContent;
    }
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
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: inline-flex;
        }
        simple-modal-template {
          --simple-modal-resize: both;
          --simple-modal-width: 300px;
          --simple-modal-height: 300px;
          --simple-modal-min-width: 300px;
          --simple-modal-min-height: 300px;
        }
        summary {
          list-style: none;
          border-bottom: var(--vocab-term-border-bottom, 1px dashed gray);
          color: var(--vocab-term-color, black);
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html` ${!this.popoverMode
      ? html`
          <div>
            <div part="term">
              <summary id="summary">${this.term}</summary>
            </div>
            <simple-modal-template title="${this.term ? this.term : ""}">
              <p slot="content">${this.information}</p>
              ${this.links && this.links.length > 0 && this.links.map
                ? html` <ul slot="content">
                    ${this.links.map(
                      (el) => html`
                        <li>
                          <a
                            href="${el.href}"
                            target="_blank"
                            rel="noopener noreferrer"
                            >${el.title}</a
                          >
                        </li>
                      `,
                    )}
                  </ul>`
                : ``}
            </simple-modal-template>
          </div>
        `
      : html`
          <details>
            <summary id="summary">${this.term}</summary>
            <div part="information">
              <simple-popover for="summary" position="top" auto>
                <p>${this.information}</p>
                <div part="links">
                  ${this.links && this.links.length > 0 && this.links.map
                    ? html`
                        <ul>
                          ${this.links.map(
                            (el) => html`
                              <li>
                                <a
                                  href="${el.href}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  >${el.title}</a
                                >
                              </li>
                            `,
                          )}
                        </ul>
                      `
                    : ``}
                </div>
              </simple-popover>
            </div>
          </details>
        `}`;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "vocab-term";
  }
  /*
   * provides click for keyboard if open property is not supported by browser
   */
  _handleClick(e) {
    // When editing in HAX, block click behavior so the element can be selected
    // and edited via the HAX UI instead of triggering the popover/details.
    if (this._haxstate) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }
    if (this.details && typeof this.detailsOpen === "undefined") {
      this.requestUpdate();
      this.toggleOpen();
    }
  }
  /**
   * provides support for keyboard if open property is not supported by browser
   */
  _handleKeyup(e) {
    if (!this._haxstate) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
    if (
      (this.details &&
        typeof this.detailsOpen === "undefined" &&
        e.keyCode == 13) ||
      e.keyCode == 32
    ) {
      this.toggleOpen();
    }
  }
  /**
   * toggles the element
   */
  toggleOpen() {
    if (!this._haxstate) {
      console.log(this._haxstate);
      if (this.details.hasAttribute("open")) {
        this.details.removeAttribute("open");
        if (this.detailsOpen) this.detailsOpen = false;
      } else {
        this.details.setAttribute("open", "open");
        if (this.detailsOpen) this.detailsOpen = true;
      }
    }
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (!this.term && this.innerHTML) {
      this.term = this.innerHTML;
    }
    if (this.popoverMode === false) {
      const summaryEl = this.shadowRoot.querySelector("summary");
      this.shadowRoot
        .querySelector(`simple-modal-template`)
        .associateEvents(summaryEl);
      summaryEl.addEventListener("focus", this.detailsFocusOut.bind(this));
      // When editing in HAX, prevent clicks on the summary from opening
      // the definition modal so the element can be edited instead.
      summaryEl.addEventListener("click", (e) => {
        if (this._haxstate) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      });
    } else {
      this.details = this.shadowRoot.querySelector(`details`);
    }
    // ensure this gets noticed
    if (this.querySelector(".links a")) {
      this.querySelectorAll(".links a").forEach((el) => {
        this.links.push({
          title: el.textContent,
          href: el.getAttribute("href"),
        });
      });
    }
    this.links = [...this.links];
  }

  /**
   *
   */
  detailsFocusOut() {
    this.shadowRoot.querySelector("details").removeAttribute("open");
    this.shadowRoot
      .querySelector("summary")
      .removeEventListener("focus", this.detailsFocusOut.bind(this));
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "popoverMode") {
        if (this[propName]) {
          this.detailsOpen = false;
          if (this.shadowRoot) {
            this.details = this.shadowRoot.querySelector(`details`);
          }
          this.addEventListener("click", this._handleClick);
        } else {
          this.removeEventListener("click", this._handleClick);
        }
      }
    });
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(VocabTerm.tag, VocabTerm);
export { VocabTerm };
