import { LitElement, html, css } from "lit";
import { remoteLinkBehavior } from "@lrnwebcomponents/utils/lib/remoteLinkBehavior.js";
import { SimpleIconsetStore } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";

// register the iconset
SimpleIconsetStore.registerIconset(
  "stopnoteicons",
  `${
    new URL("./stop-note.js", import.meta.url).href
  }/../lib/svgs/stopnoteicons/`
);
/**
 * `stop-note`
 * `A note that directs people to an action item of different warning levels`
 * @demo demo/index.html
 * @element stop-note
 */
class StopNote extends I18NMixin(remoteLinkBehavior(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: auto;
          --background-color: #f7f7f7;
          --accent-color: #d32f2f;
          margin-bottom: 20px;
        }

        simple-icon {
          --simple-icon-height: 100px;
          --simple-icon-width: 100px;
        }

        :host([icon="stopnoteicons:stop-icon"]) {
          --accent-color: #d8261c;
        }

        :host([icon="stopnoteicons:warning-icon"]) {
          --accent-color: #ffeb3b;
        }

        :host([icon="stopnoteicons:confirm-icon"]) {
          --accent-color: #81c784;
        }

        :host([icon="stopnoteicons:book-icon"]) {
          --accent-color: #21a3db;
        }

        .container {
          display: flex;
          width: auto;
        }

        .message_wrap {
          border-right: 7px solid var(--accent-color);
          padding: 10px 25px;
          flex: 1 1 auto;
          background-color: var(--background-color);
        }

        .main_message {
          font-size: 32px;
          margin-top: 10px;
        }

        .secondary_message {
          margin-top: 5px;
          font-size: 19.2px;
          width: 100%;
        }

        .link a {
          margin-top: 5px;
          font-size: 19.2px;
          float: left;
          clear: left;
          text-decoration: none;
        }

        .svg {
          display: flex;
          justify-content: center;
        }

        .svg_wrap {
          background-color: var(--accent-color);
          padding: 5px;
          width: auto;
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
          <div class="main_message" id="title">${this.title}</div>
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
      ...(super.properties || {}),
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
    });
  }
  /**
   * life cycle
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.remoteLinkTarget = this.shadowRoot.querySelector("#link");
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
  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "image:style",
        callback: "haxtoggleIcon",
        label: "Toggle icon",
      },
    ];
  }
  haxtoggleIcon(e) {
    const iconAry = [
      "stopnoteicons:stop-icon",
      "stopnoteicons:warning-icon",
      "stopnoteicons:confirm-icon",
      "stopnoteicons:book-icon",
    ];
    let icon = iconAry[0];
    if (iconAry.lastIndexOf(this.icon) != iconAry.length - 1) {
      icon = iconAry[iconAry.lastIndexOf(this.icon) + 1];
    }
    this.icon = icon;
    return true;
  }
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
window.customElements.define(StopNote.tag, StopNote);
export { StopNote };
