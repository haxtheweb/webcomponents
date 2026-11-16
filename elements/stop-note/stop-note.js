/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { remoteLinkBehavior } from "@haxtheweb/utils/lib/remoteLinkBehavior.js";
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDVocabulary } from "@haxtheweb/d-d-d/lib/DDDVocabulary.js";

// register the iconset
SimpleIconsetStore.registerIconset(
  "stopnoteicons",
  `${
    new URL("./stop-note.js", import.meta.url).href
  }/../lib/svgs/stopnoteicons/`,
);

/**
 * `stop-note`
 * `A note that directs people to an action item of different warning levels`
 * @demo demo/index.html
 * @element stop-note
 */

export const StopNoteIconList = {
  stop: "stopnoteicons:stop-icon",
  warning: "stopnoteicons:warning-icon",
  success: "stopnoteicons:confirm-icon",
  info: "stopnoteicons:book-icon",
  tip: "stopnoteicons:tip-icon",
  new: "stopnoteicons:new-icon",
};

class StopNote extends DDDVocabulary(
  SchemaBehaviors(I18NMixin(remoteLinkBehavior(DDD))),
) {
  /**
   * Shared DDD vocabulary, as names only: variant="danger" is read as
   * status="stop" and so on, and the note draws exactly what that status
   * draws. The icon, header cap and status word are this element's design
   * and no shared word changes them. tip and new have no shared meaning and
   * stay statuses.
   */
  static get dddVocabulary() {
    return {
      variant: {
        from: "status",
        values: {
          stop: "danger",
          warning: "warning",
          success: "success",
          info: "brand",
        },
      },
    };
  }
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          /* the raw black never flipped with the scheme; the --text-color
            token chain below is the real source of truth so inheritors stay
            scheme-safe too */
          color: var(--text-color);
          width: auto;
          --text-color: var(
            --ddd-component-stop-note-text-color,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          /* tint behind the header strip (and the whole note when it has no
             title) */
          --background-color: var(
            --ddd-component-stop-note-text-background,
            var(--ddd-theme-default-errorLight)
          );
          /* signal colour: header rule and status word fallback */
          --accent-color: var(
            --ddd-component-stop-note-border,
            var(--ddd-theme-default-error)
          );
          /* readable ink for the status word on the tint */
          --status-ink: var(--ddd-theme-default-error);
          margin: var(--ddd-spacing-5) 0;
        }
        :host([icon="stopnoteicons:stop-icon"]),
        :host([status="stop"]) {
          --accent-color: var(
            --ddd-component-stop-note-border,
            var(--ddd-theme-default-original87Pink)
          );
          --background-color: var(
            --ddd-component-stop-note-text-background,
            var(--ddd-theme-default-errorLight)
          );
          --status-ink: var(--ddd-theme-default-original87Pink);
        }
        :host([icon="stopnoteicons:warning-icon"]),
        :host([status="warning"]) {
          --accent-color: var(
            --ddd-component-stop-note-border,
            var(--ddd-theme-default-keystoneYellow)
          );
          --background-color: var(
            --ddd-component-stop-note-text-background,
            var(--ddd-theme-default-warningLight)
          );
          --status-ink: var(--ddd-theme-default-warning);
        }
        :host([icon="stopnoteicons:confirm-icon"]),
        :host([status="success"]) {
          --accent-color: var(
            --ddd-component-stop-note-border,
            light-dark(
              var(--ddd-theme-default-success),
              var(--ddd-theme-default-opportunityGreen)
            )
          );
          --background-color: var(
            --ddd-component-stop-note-text-background,
            var(--ddd-theme-default-successLight)
          );
          --status-ink: var(--ddd-theme-default-success);
        }
        :host([icon="stopnoteicons:book-icon"]),
        :host([status="info"]) {
          --accent-color: var(
            --ddd-component-stop-note-border,
            light-dark(
              var(--ddd-theme-default-info),
              var(--ddd-theme-default-skyBlue)
            )
          );
          --background-color: var(
            --ddd-component-stop-note-text-background,
            var(--ddd-theme-default-infoLight)
          );
          --status-ink: var(--ddd-theme-default-info);
        }
        /* a helpful idea: teal band, the Future Traveler's lightbulb */
        :host([icon="stopnoteicons:tip-icon"]),
        :host([status="tip"]) {
          --accent-color: var(
            --ddd-component-stop-note-border,
            light-dark(
              var(--ddd-theme-default-creekTeal),
              var(--ddd-theme-default-creekLight)
            )
          );
          --background-color: var(
            --ddd-component-stop-note-text-background,
            var(--ddd-theme-default-creekMaxLight)
          );
          --status-ink: var(--ddd-theme-default-coalyGray);
        }
        /* a recent change: orange band, sparkle */
        :host([icon="stopnoteicons:new-icon"]),
        :host([status="new"]) {
          --accent-color: var(
            --ddd-component-stop-note-border,
            var(--ddd-theme-default-inventOrange)
          );
          --background-color: var(
            --ddd-component-stop-note-text-background,
            var(--ddd-theme-default-roarMaxlight)
          );
          --status-ink: var(--ddd-theme-default-landgrantBrown);
        }
        .ddd-block {
          display: flex;
          flex-direction: column;
          width: auto;
          --ddd-block-background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --ddd-block-accent: var(--accent-color);
          /* the top rule is drawn here rather than with data-accent: inside
             a DDD element, DDDStyles also styles div[data-accent] */
          border-top: var(--ddd-border-size-md) solid var(--ddd-block-accent);
          --ddd-block-chip-background: var(
            --ddd-component-stop-note-icon-background,
            light-dark(transparent, var(--ddd-theme-default-white))
          );
          /* status colour is meaning: pin the chip ink so a palette never
             reaches it */
          --ddd-block-chip-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .ddd-block-header {
          /* the end padding leaves room for controls laid over the header,
            such as the pager of stop-note-group */
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4))
            var(
              --stop-note-header-end,
              var(--ddd-surface-padding, var(--ddd-spacing-4))
            );
          min-width: 0;
          background-color: light-dark(
            var(--background-color),
            var(--ddd-theme-default-potentialMidnight)
          );
          transition: background-color var(--ddd-duration-normal, 0.3s)
            ease-in-out;
        }
        /* the status icon is a full colour badge, not a tinted glyph */
        .ddd-block-chip simple-icon {
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
        }
        .status-label {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(var(--status-ink), var(--ddd-theme-default-white));
        }
        .message_wrap {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          padding-block: var(--ddd-spacing-3) var(--ddd-spacing-4);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
          color: var(--text-color);
        }
        .message_wrap > * {
          margin: 0;
        }
        .main_message {
          padding: 0;
          margin: 0;
          font-size: var(--ddd-theme-h5-font-size);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .main_message[hidden] {
          display: none;
        }
        .secondary_message {
          width: 100%;
          color: var(--text-color);
          font-weight: var(--ddd-font-weight-regular);
        }
        .secondary_message ::slotted(*) {
          color: inherit;
          margin-block: 0;
        }
        .secondary_message ::slotted(a) {
          color: inherit;
        }
        /* message only: one tinted row, the status word leading the text */
        .ddd-block.compact {
          flex-direction: row;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4))
            var(
              --stop-note-header-end,
              var(--ddd-surface-padding, var(--ddd-spacing-4))
            );
          background-color: light-dark(
            var(--background-color),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .ddd-block.compact .ddd-block-header {
          display: contents;
        }
        .ddd-block.compact .status-label {
          flex: none;
        }
        /* on a narrow row the message moves under the status word rather
          than squeezing into a thin column */
        .ddd-block.compact {
          flex-wrap: wrap;
        }
        .ddd-block.compact .message_wrap {
          padding: 0;
          flex: 1 1 12ch;
          min-width: 0;
        }
        .ddd-block.compact .secondary_message {
          font-size: var(--ddd-theme-body-font-size);
        }
        a:-webkit-any-link {
          text-decoration: none;
          color: inherit;
        }
        a:hover {
          text-decoration: underline;
        }
        .link a {
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        .link {
          margin-bottom: var(--ddd-spacing-1);
        }
      `,
    ];
  }
  render() {
    const statusLabel =
      this.status && this.t[`status_${this.status}`]
        ? this.t[`status_${this.status}`]
        : "";
    const compact = !this.title && !this.url && !this._haxstate;
    return html`
      <div class="ddd-block ${compact ? "compact" : ""}">
        <div class="ddd-block-header">
          <span class="ddd-block-chip" aria-hidden="true"
            ><simple-icon
              icon="${this.icon}"
              no-colorize
              aria-hidden="true"
            ></simple-icon
          ></span>
          ${
            statusLabel
              ? html`<span class="ddd-block-label status-label"
                  >${statusLabel}</span
                >`
              : ``
          }
        </div>
        <div class="ddd-block-body message_wrap">
          <h3
            class="main_message"
            id="title"
            property="oer:mainContent"
            ?hidden="${!this.title && !this._haxstate}"
          >
            ${this.title}
          </h3>
          <div class="secondary_message">
            <slot @slotchange="${this._handleSlotChange}"></slot>
            <slot name="message" @slotchange="${this._handleSlotChange}"></slot>
          </div>
          ${
            this.url
              ? html`
                  <div class="link">
                    <a href="${this.url}" id="link">
                      ${this.t.moreInformation} &gt;
                    </a>
                  </div>
                `
              : ``
          }
        </div>
      </div>
    `;
  }
  _handleSlotChange() {
    this._syncSlottedLinkColor();
  }
  _syncSlottedLinkColor() {
    if (!this.shadowRoot) {
      return;
    }
    this.shadowRoot.querySelectorAll("slot").forEach((slot) => {
      slot.assignedElements({ flatten: true }).forEach((element) => {
        this._applySlottedLinkColor(element);
      });
    });
  }
  _applySlottedLinkColor(element) {
    if (!element || !element.querySelectorAll) {
      return;
    }
    if (
      element.tagName &&
      element.tagName.toLowerCase() === "a" &&
      element.style &&
      !element.style.color
    ) {
      element.style.color = "inherit";
    }
    element.querySelectorAll("a").forEach((link) => {
      if (link.style && !link.style.color) {
        link.style.color = "inherit";
      }
    });
  }
  static get tag() {
    return "stop-note";
  }
  constructor() {
    super();
    this.typeof = "oer:LearningComponent";
    this.url = null;
    this.title = "";
    this.status = null;
    this.accentColor = "grey";
    this.icon = "stopnoteicons:stop-icon";
    this.t = {
      moreInformation: "More Information",
      status_stop: "Stop",
      status_warning: "Warning",
      status_success: "Success",
      status_info: "Note",
      status_tip: "Did you know?",
      status_new: "What's new",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      /**
       * Title Message
       */
      title: {
        type: String,
        reflect: true,
      },
      /**
       * url to additional resources
       */
      url: {
        type: String,
      },
      /**
       * Icon selected
       */
      icon: {
        type: String,
        reflect: true,
      },
      status: {
        type: String,
        reflect: true,
      },
    };
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive icon from status, reverse-lookup status from icon, and mirror
    // url to remoteLinkURL in willUpdate so reactive sets batch into the
    // current update cycle. Setting them in updated()/firstUpdated scheduled
    // a redundant second update (Lit change-in-update warning).
    // a shared-vocabulary variant is another way to name a status
    if (changedProperties.has("variant") && this.variant) {
      const status = this.dddLegacy("variant");
      if (status && StopNoteIconList[status] && status !== this.status) {
        this.status = status;
        this.icon = StopNoteIconList[status];
      }
    }
    if (
      changedProperties.has("status") &&
      this.status &&
      StopNoteIconList[this.status]
    ) {
      this.icon = StopNoteIconList[this.status];
    }
    // reverse-lookup: if no status but icon supplied (legacy), derive status
    if (!this.hasUpdated && this.status === null && this.icon) {
      Object.keys(StopNoteIconList).map((value) => {
        if (StopNoteIconList[value] === this.icon) {
          this.status = value;
        }
      });
    }
    // mirror url -> remoteLinkURL (remoteLinkURL is reactive via
    // remoteLinkBehavior mixin)
    if (changedProperties.has("url")) {
      this.remoteLinkURL = this.url;
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
  }
  /**
   * life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.remoteLinkTarget = this.shadowRoot.querySelector("#link");
    this._syncSlottedLinkColor();
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
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    if (super.haxeditModeChanged) super.haxeditModeChanged(val);
    this._haxstate = val;
    // the title row stays available to type into while editing
    this.requestUpdate();
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (super.haxactiveElementChanged) super.haxactiveElementChanged(el, val);
    // flag for HAX to not trigger active on changes but only when not locked
    let container = this.shadowRoot.querySelector("#title");
    if (val && this.getAttribute("data-hax-lock") === null) {
      container.setAttribute("contenteditable", true);
    } else {
      container.removeAttribute("contenteditable");
      this.title = container.innerText;
    }
    return false;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(StopNote.tag, StopNote);
export { StopNote };
