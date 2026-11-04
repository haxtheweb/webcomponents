/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
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
`--vocab-term-border-bottom` | Extra bottom border on the vocab term (a DDD dotted underline is drawn either way). | none
`--vocab-term-color` | Color of the vocab term. | black
 */
class VocabTerm extends SchemaBehaviors(I18NMixin(LitElement)) {
  static get properties() {
    return {
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
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
    this.typeof = "oer:LearningComponent";
    this.t = {
      vocabulary: "Vocabulary",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
    this._haxstate = false;
    this.popoverMode = false;
    this.term = null;
    this.information = null;
    this.links = [];
    this.detailsOpen = false;
    this.__boundDetailsFocusOut = this.detailsFocusOut.bind(this);
    this.__boundSummaryClick = this._handleSummaryClick.bind(this);
    if (this.querySelector && this.querySelector("summary")) {
      this.term = this.querySelector("summary").textContent;
    }
    if (this.querySelector && this.querySelector(`[slot="information"]`)) {
      this.information = this.querySelector(`[slot="information"]`).textContent;
    }
    // progressive enhancement support; scan light DOM in the constructor so
    // the reactive term / links assignments batch into the first update
    // instead of scheduling a second one (Lit change-in-update warning)
    if (!this.term && this.innerHTML) {
      this.term = this.innerHTML;
    }
    if (this.querySelector && this.querySelector(".links a")) {
      this.querySelectorAll(".links a").forEach((el) => {
        this.links.push({
          title: el.textContent,
          href: el.getAttribute("href"),
        });
      });
    }
    this.links = [...this.links];
  }
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    // content that wrote the definition as text inside the tag, with the
    // term as an attribute, shows that text as the definition
    if (!this.information && this.term && this.textContent) {
      const text = this.textContent.trim();
      if (text && text !== String(this.term).trim()) {
        this.information = text;
      }
    }
  }
  // labels the definition so a reader knows what opened; inline styles
  // because the modal moves this content out of this shadow root
  renderLabel() {
    return html`<div
      class="vocab-label"
      style="display: flex; align-items: center; gap: var(--ddd-spacing-2, 8px); margin: 0 0 var(--ddd-spacing-2, 8px); font-family: var(--ddd-font-navigation, sans-serif); font-size: var(--ddd-font-size-4xs, 16px); font-weight: var(--ddd-font-weight-bold, 700); letter-spacing: 0.06em; text-transform: uppercase; color: light-dark(var(--ddd-theme-default-nittanyNavy, #001e44), var(--ddd-theme-default-linkLight, #cfeceb));"
    >
      <span
        aria-hidden="true"
        style="display: inline-flex; align-items: center; justify-content: center; flex: none; width: var(--ddd-icon-xxs, 24px); height: var(--ddd-icon-xxs, 24px); border-radius: 50%; background-color: light-dark(var(--ddd-theme-default-beaverBlue, #1e407c), var(--ddd-theme-default-skyBlue, #009cde)); color: light-dark(white, var(--ddd-theme-default-potentialMidnight, #000321)); --simple-icon-width: 14px; --simple-icon-height: 14px;"
        ><simple-icon-lite icon="icons:book"></simple-icon-lite
      ></span>
      <span>${this.t.vocabulary}</span>
    </div>`;
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
          color-scheme: light dark;
        }
        simple-popover {
          --simple-popover-max-width: 320px;
          --simple-popover-padding: var(--ddd-spacing-3);
          --simple-popover-border-radius: var(--ddd-radius-md);
          --simple-popover-border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --simple-popover-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-popover-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        simple-popover p {
          margin: 0 0 var(--ddd-spacing-2);
        }
        simple-popover .vocab-term-name {
          margin: 0 0 var(--ddd-spacing-1);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
        }
        simple-popover ul {
          margin: 0;
          padding-inline-start: var(--ddd-spacing-5);
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
          border-bottom: var(--vocab-term-border-bottom, none);
          color: var(
            --vocab-term-color,
            light-dark(
              var(--ddd-theme-default-black),
              var(--ddd-theme-default-white)
            )
          );
        }
        /* DDD dotted underline: the visible cue that the term opens its
           definition, in modal and popover mode alike */
        .vocab-term-trigger > summary {
          cursor: pointer;
          text-decoration-line: underline;
          text-decoration-style: dotted;
          text-decoration-thickness: var(--ddd-border-size-sm, 2px);
          text-underline-offset: 0.2em;
          text-decoration-color: light-dark(
            var(--ddd-theme-default-beaverBlue, #1e407c),
            var(--ddd-theme-default-pughBlue, #96bee6)
          );
        }
        .vocab-term-trigger > summary:hover {
          text-decoration-style: solid;
        }
        .vocab-term-trigger > summary:focus-visible {
          outline: var(--ddd-focus-ring, 2px solid #005fa9);
          outline-offset: var(--ddd-focus-offset, 2px);
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html` ${
      !this.popoverMode
        ? html`
            <div>
              <details
                part="term"
                class="vocab-term-trigger"
                ?hidden="${!this.term}"
              >
                <summary id="summary" property="oer:name">${this.term}</summary>
              </details>
              <simple-modal-template title="${this.term ? this.term : ""}">
                <div slot="content">${this.renderLabel()}</div>
                <p slot="content" property="oer:description">
                  ${this.information}
                </p>
                ${
                  this.links && this.links.length > 0 && this.links.map
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
                    : ``
                }
              </simple-modal-template>
            </div>
          `
        : html`
            <details class="vocab-term-trigger">
              <summary id="summary" property="oer:name">${this.term}</summary>
              <div part="information">
                <simple-popover for="summary" position="top" auto>
                  ${this.renderLabel()}
                  <p class="vocab-term-name">${this.term}</p>
                  <p property="oer:description">${this.information}</p>
                  <div part="links">
                    ${
                      this.links && this.links.length > 0 && this.links.map
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
                        : ``
                    }
                  </div>
                </simple-popover>
              </div>
            </details>
          `
    }`;
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
        e.keyCode === 13) ||
      e.keyCode === 32
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
  _handleSummaryClick(e) {
    if (this._haxstate) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.popoverMode === false) {
      const summaryEl = this.shadowRoot.querySelector("summary");
      this.shadowRoot
        .querySelector(`simple-modal-template`)
        .associateEvents(summaryEl);
      summaryEl.addEventListener("focus", this.__boundDetailsFocusOut);
      // When editing in HAX, prevent clicks on the summary from opening
      // the definition modal so the element can be edited instead.
      summaryEl.addEventListener("click", this.__boundSummaryClick);
    } else {
      this.details = this.shadowRoot.querySelector(`details`);
    }
  }

  /**
   *
   */
  detailsFocusOut() {
    let details = this.shadowRoot.querySelector("details");
    if (details) {
      details.removeAttribute("open");
    }
    let summary = this.shadowRoot.querySelector("summary");
    if (summary) {
      summary.removeEventListener("focus", this.__boundDetailsFocusOut);
    }
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // derive detailsOpen in willUpdate so the reactive set batches into
    // the current update cycle (Lit change-in-update warning); listener
    // wiring and the shadow DOM details query stay in updated() below
    if (changedProperties.has("popoverMode") && this.popoverMode) {
      this.detailsOpen = false;
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "popoverMode") {
        if (this[propName]) {
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
  disconnectedCallback() {
    if (this.shadowRoot) {
      let summary = this.shadowRoot.querySelector("summary");
      if (summary) {
        summary.removeEventListener("focus", this.__boundDetailsFocusOut);
        summary.removeEventListener("click", this.__boundSummaryClick);
      }
    }
    this.removeEventListener("click", this._handleClick);
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
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
