import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `hax-map`
 * @element hax-map
 * `Export dialog with all export options and settings provided.`
 */
class HaxMap extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
        iron-icon:not(:defined),
        paper-button:not(:defined),
        paper-dialog:not(:defined) {
          display: none;
        }
        #dialog {
          z-index: 100000;
          margin-top: 56px;
        }
        #closedialog {
          top: 6px;
          right: 0;
          position: absolute;
          padding: 8px;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          width: 40px;
          height: 40px;
          min-width: unset;
        }
        .title {
          position: relative;
          padding: 16px;
          outline: 0;
          font-weight: 600;
          text-align: left;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
        }
        .container {
          text-align: left;
          padding: 16px;
          min-width: 300px;
          overflow-y: scroll;
          max-height: 50vh;
        }
        #reportghissue {
          color: #81a3a9;
          font-size: 18px;
          padding: 16px;
          font-style: italic;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul iron-icon {
          padding: 0 4px;
        }
        a {
          font-size: 30px;
          line-height: 30px;
          text-decoration: none;
          color: black;
          padding: 4px;
        }
        a:focus,
        a:hover,
        a:active {
          cursor: pointer;
          font-weight: bold;
        }
      `
    ];
  }
  constructor() {
    super();
    this.elementList = [];
    this.title = "Content map";
    setTimeout(() => {
      import("@polymer/iron-icon/iron-icon.js");
      import("@polymer/paper-button/paper-button.js");
      import("@polymer/paper-dialog/paper-dialog.js");
    }, 0);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // notify when any of these change
      if (propName === "opened") {
        let list = window.HaxStore.htmlToHaxElements(
          window.HaxStore.instance.activeHaxBody.haxToContent()
        );
        let elements = [];
        for (var i = 0; i < list.length; i++) {
          let def = window.HaxStore.instance.haxSchemaFromTag(list[i].tag);
          elements.push({
            icon: def.gizmo.icon,
            name: def.gizmo.title
          });
        }
        this.elementList = [...elements];
      }
    });
  }
  render() {
    return html`
      <paper-dialog
        id="dialog"
        ?opened="${this.opened}"
        @opened-changed="${this.openedChanged}"
      >
        <h3 class="title">
          <iron-icon icon="maps:map"></iron-icon> ${this.title}
        </h3>
        <paper-button id="closedialog" @click="${this.closeEvent}">
          <iron-icon icon="icons:cancel" title="Close dialog"></iron-icon>
        </paper-button>
        <div class="container">
          <ul>
            ${this.elementList.map((element, index) => {
              return html`
                <li>
                  <a @click="${this.scrollInMap}" data-index="${index}"
                    ><iron-icon
                      data-index="${index}"
                      icon="${element.icon}"
                    ></iron-icon
                    >${element.name}</a
                  >
                </li>
              `;
            })}
          </ul>
        </div>
      </paper-dialog>
    `;
  }
  scrollInMap(e) {
    var target = null;
    if (e.path && e.path[0]) {
      target = e.path[0];
    } else {
      target = e.target;
    }
    if (target.getAttribute("data-index")) {
      let activeChild =
        window.HaxStore.instance.activeHaxBody.children[
          parseInt(target.getAttribute("data-index"))
        ];
      activeChild.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "center"
      });
      activeChild.classList.add("blinkfocus");
      setTimeout(() => {
        activeChild.classList.remove("blinkfocus");
      }, 800);
    }
  }
  openedChanged(e) {
    // force close event to align data model if clicking away
    if (!e.detail.value && window.HaxStore.instance.openDrawer === this) {
      window.HaxStore.write("openDrawer", false, this);
    }
  }
  closeEvent(e) {
    this.opened = false;
  }
  static get tag() {
    return "hax-map";
  }
  static get properties() {
    return {
      /**
       * Title when open.
       */
      title: {
        type: String
      },
      opened: {
        type: Boolean
      },
      elementList: {
        type: Array
      }
    };
  }

  firstUpdated(changedProperties) {
    // fire an event that this is a core piece of the system
    this.dispatchEvent(
      new CustomEvent("hax-register-core-piece", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          piece: "haxMap",
          object: this
        }
      })
    );
  }

  /**
   * open the dialog
   */
  open() {
    this.opened = true;
  }
  /**
   * close the dialog
   */
  close() {
    this.opened = false;
  }
}
window.customElements.define(HaxMap.tag, HaxMap);
export { HaxMap };
