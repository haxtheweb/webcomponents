import { html, css } from "lit";
import { remoteLinkBehavior } from "@haxtheweb/utils/lib/remoteLinkBehavior.js";
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDMarginPadding,
  DDDBorders,
} from "@haxtheweb/d-d-d/lib/DDDStyles.js";

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
};

class StopNote extends I18NMixin(remoteLinkBehavior(DDD)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      DDDBorders,
      DDDMarginPadding,
      css`
        :host {
          display: block;
          color: black;
          width: auto;
          --background-color: var(
            --ddd-component-stop-note-icon-background,
            var(--ddd-theme-default-errorLight)
          );
          --accent-color: var(
            --ddd-component-stop-note-text-background,
            var(--ddd-theme-default-error)
          );
          margin: var(--ddd-spacing-5) 0;
        }

        simple-icon {
          --simple-icon-height: var(--ddd-icon-4xl);
          --simple-icon-width: var(--ddd-icon-4xl);
        }

        :host([icon="stopnoteicons:stop-icon"]) {
          --accent-color: var(--ddd-theme-default-original87Pink);
          --background-color: var(--ddd-theme-default-errorLight);
        }
        :host([status="stop"]) {
          --accent-color: var(--ddd-theme-default-original87Pink);
          --background-color: var(--ddd-theme-default-errorLight);
        }

        :host([icon="stopnoteicons:warning-icon"]) {
          --accent-color: var(--ddd-theme-default-keystoneYellow);
          --background-color: var(--ddd-theme-default-warningLight);
        }
        :host([status="warning"]) {
          --accent-color: var(--ddd-theme-default-keystoneYellow);
          --background-color: var(--ddd-theme-default-warningLight);
        }

        :host([icon="stopnoteicons:confirm-icon"]) {
          --accent-color: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-opportunityGreen)
          );
          --background-color: var(--ddd-theme-default-successLight);
        }
        :host([status="success"]) {
          --accent-color: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-opportunityGreen)
          );
          --background-color: var(--ddd-theme-default-successLight);

        }

        :host([icon="stopnoteicons:book-icon"]) {
          --accent-color: light-dark(
            var(--ddd-theme-default-info),
            var(--ddd-theme-default-skyBlue)
          );
          --background-color: var(--ddd-theme-default-infoLight);
        }
        :host([status="info"]) {
          --accent-color: light-dark(
            var(--ddd-theme-default-info),
            var(--ddd-theme-default-skyBlue)
          );
          --background-color: var(--ddd-theme-default-infoLight);
        }

        .container {
          display: flex;
          width: auto;
        }

        .message_wrap {
          padding: var(--ddd-spacing-1) var(--ddd-spacing-6);
          flex: 1 1 auto;
          transition: background-color 0.3s ease-in-out;
          background-color: var(
            --ddd-component-stop-note-text-background,
            var(--background-color)
          );
          border-right: var(--ddd-border-lg);
          border-color: var(
            --ddd-component-stop-note-border,
            var(--accent-color)
          );
        }

        .message_wrap > * {
          margin-bottom: var(--ddd-spacing-2);
        }

        .main_message {
          padding-bottom: 0;
        }

        :host([title=""]) .secondary_message {
          display: flex;
          height: 60%;
          align-items: center;
          margin-top: auto;
          font-size: var(--ddd-font-size-s);
          width: 100%;
          font-weight: var(--ddd-font-weight-bold);
        }

        .secondary_message {
          width: 100%;
          font-weight: var(--ddd-font-weight-regular);
        }

        a:-webkit-any-link {
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }

        .svg {
          display: flex;
          justify-content: center;
        }

        .svg_wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease-in-out;
          background-color: var(
            --ddd-component-stop-note-icon-background,
            var(--accent-color)
          );
          padding: var(--ddd-spacing-2);
          width: auto;
        }

        .mt-2 {
          margin-top: var(--ddd-spacing-2);
        }

        .mt-5 {
          margin-top: var(--ddd-spacing-5);
        }

        .link {
          margin-bottom: var(--ddd-spacing-1);
        }
      `,
    ];
  }
  render() {
    return html`
      <div class="container">
        <div class="svg_wrap">
          <div class="svg">
            <simple-icon icon="${this.icon}" no-colorize></simple-icon>
          </div>
        </div>
        <div class="message_wrap">
          <h3 class="main_message ${this.url ? "mt-2" : "mt-5"}" id="title">
            ${this.title}
          </h3>
          <div class="secondary_message">
            <slot></slot>
            <slot name="message"></slot>
          </div>
          ${this.url
            ? html`
                <div class="link">
                  <a href="${this.url}" id="link">
                    ${this.t.moreInformation} &gt;
                  </a>
                </div>
              `
            : ``}
        </div>
      </div>
    `;
  }
  static get tag() {
    return "stop-note";
  }
  constructor() {
    super();
    this.url = null;
    this.title = "";
    this.status = null;
    this.accentColor = "grey";
    this.icon = "stopnoteicons:stop-icon";
    this.t = {
      moreInformation: "More Information",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
      locales: ["es"],
    });
  }
  static get properties() {
    return {
      ...super.properties,
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
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "url") {
        this.remoteLinkURL = this[propName];
      }
      if (
        propName == "status" &&
        this[propName] &&
        StopNoteIconList[this[propName]]
      ) {
        this.icon = StopNoteIconList[this[propName]];
      }
    });
  }
  /**
   * life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.remoteLinkTarget = this.shadowRoot.querySelector("#link");
    // if we have no status BUT icon was supplied; this is to support legacy implementations
    // where the icon was the thing dictating the status
    if (this.status === null && this.icon) {
      Object.keys(StopNoteIconList).map((value) => {
        if (StopNoteIconList[value] === this.icon) {
          this.status = value;
        }
      });
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
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    if (super.haxeditModeChanged) super.haxeditModeChanged(val);
    this._haxstate = val;
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
customElements.define(StopNote.tag, StopNote);
export { StopNote };
