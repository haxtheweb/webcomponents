import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `hax-source`
 * `An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that hax-manager can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.`
 */
class HaxAppSearchResult extends LitElement {
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-styles/paper-styles.js");
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          width: 50%;
          background-color: var(--hax-color-bg-accent);
          color: var(--hax-color-text);
        }
        paper-button.button {
          margin: 0;
          padding: 7px;
          height: 168px;
          border-radius: 0;
          width: 100%;
          border: 1px solid var(--hax-color-border-outline);
          justify-content: flex-start;
          background-image: none;
          text-align: unset;
          display: flex;
        }
        paper-button:hover,
        paper-button:focus,
        paper-button:active {
          outline: 2px solid var(--hax-color-bg-accent1);
        }
        .detail-wrapper {
          padding: 0 8px;
          display: inline-block;
          height: 100%;
          width: calc(80% - 16px);
          overflow: hidden;
          font-family: "Noto Serif", serif;
        }
        .title {
          font-size: 16px;
          font-weight: bold;
          text-transform: none;
          padding-bottom: 4px;
        }
        .details {
          height: 100px;
          overflow: hidden;
          font-size: 12px;
          line-height: 16px;
          padding: 0;
          margin: 0;
          text-transform: none;
        }
        .image {
          display: inline-flex;
          height: 152px;
          width: 20%;
          background-color: lightgray;
        }
        @media screen and (max-width: 1000px) {
          :host {
            width: 100%;
          }
          .title {
            font-size: 12px;
          }
          .image {
            min-width: 160px;
            width: 160px;
          }
          .details {
            font-size: 10px;
          }
        }
        @media screen and (max-width: 600px) {
          .details {
            font-size: 8px;
          }
        }
      `
    ];
  }

  render() {
    return html`
      <paper-button @click="${this._itemSelected}" class="button">
        <iron-image
          alt=""
          class="image"
          src="${this.resultData.image}"
          preload=""
          fade=""
          sizing="cover"
        ></iron-image>
        <div class="detail-wrapper">
          <div class="title">${this.resultData.title}</div>
          <div class="details">${this.resultData.details}</div>
        </div>
      </paper-button>
    `;
  }
  static get tag() {
    return "hax-app-search-result";
  }
  static get properties() {
    return {
      /**
       * Preview object from hax-app originally.
       */
      resultData: {
        type: Object,
        attribute: "result-data"
      }
    };
  }

  /**
   * Handle media item selected.
   */
  _itemSelected(e) {
    var map = this.resultData.map;
    var gizmoType = this.resultData.type;
    // sanity check as well as guessing based on type if we absolutely have to
    if (
      (gizmoType === null || gizmoType === "") &&
      typeof map.source !== typeof undefined
    ) {
      gizmoType = window.HaxStore.guessGizmoType(map.source);
    }
    let haxElements = window.HaxStore.guessGizmo(gizmoType, map);
    // see if we got anything
    if (haxElements.length > 0) {
      if (haxElements.length === 1) {
        if (typeof haxElements[0].tag !== typeof undefined) {
          window.HaxStore.write("activeHaxElement", haxElements[0], this);
        }
      } else {
        // hand off to hax-app-picker to deal with the rest of this
        window.HaxStore.instance.haxAppPicker.presentOptions(
          haxElements,
          gizmoType,
          "How would you like to display this " + gizmoType + "?",
          "gizmo"
        );
      }
    } else {
      window.HaxStore.toast("Sorry, I don't know how to handle that link yet.");
    }
  }
}
window.customElements.define(HaxAppSearchResult.tag, HaxAppSearchResult);
export { HaxAppSearchResult };
