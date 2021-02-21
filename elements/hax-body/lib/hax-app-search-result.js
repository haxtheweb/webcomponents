import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXStore } from "./hax-store.js";
/**
 * `hax-source`
 * @element hax-source
 * `An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that we can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.`
 */
class HaxAppSearchResult extends LitElement {
  constructor() {
    super();
  }
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-evenly;
          height: 100%;
        }
        button {
          font-size: var(--hax-tray-font-size-xs);
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          border-radius: 0;
          border: none;
          width: 100%;
          outline: 1px solid var(--hax-toolbar-border-color);
          opacity: 0.8;
          background-color: var(--hax-toolbar-button-bg);
          transition: 0.2s opacity ease-in-out, 0.2s outline-color ease-in-out;
          flex: 1 0 auto;
        }
        button:hover,
        button:focus,
        button:active {
          outline-color: var(--hax-tray-accent-color);
          outline-width: 4px;
          outline-style: solid;
          opacity: 1;
        }
        .detail-wrapper {
          flex: 1 0 auto;
          max-height: 30px;
          overflow: hidden;
          text-align: center;
          text-overflow: ellipsis;
        }
        .image {
          flex: 0 0 auto;
          width: 100%;
          background-color: var(--hax-toolbar-border-color);
        }
        @media screen and (max-width: 1000px) {
          :host {
            width: 100%;
          }
          .title {
            font-size: 12px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <button
        draggable="true"
        @click="${this._itemSelected}"
        @dragstart="${this._dragStart}"
        @dragend="${this._dragEnd}"
        title="${this.details}"
      >
        <img loading="lazy" class="image" src="${this.image}" />
        <div class="detail-wrapper">${this.title.substr(0, 40)}</div>
      </button>
    `;
  }
  static get tag() {
    return "hax-app-search-result";
  }
  static get properties() {
    return {
      image: {
        type: String,
      },
      title: {
        type: String,
      },
      details: {
        type: String,
      },
      map: {
        type: Object,
      },
      type: {
        type: String,
      },
    };
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    // create the tag
    let target = this.cloneNode(true);
    HAXStore.__dragTarget = target;
    if (e.dataTransfer) {
      this.crt = target;
      this.crt.style.position = "absolute";
      this.crt.style.top = "-1000px";
      this.crt.style.right = "-1000px";
      this.crt.style.transform = "scale(0.25)";
      this.crt.style.opacity = ".8";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      document.body.appendChild(this.crt);
      e.dataTransfer.setDragImage(this.crt, 0, 0);
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    this.crt.remove();
    setTimeout(() => {
      this._itemSelected(e);
    }, 0);
  }

  /**
   * Handle media item selected.
   */
  _itemSelected(e) {
    var map = this.map;
    var gizmoType = this.type;
    // sanity check as well as guessing based on type if we absolutely have to
    if (
      (!gizmoType ||
        gizmoType == null ||
        gizmoType == "" ||
        gizmoType == "undefined") &&
      map.source
    ) {
      gizmoType = HAXStore.guessGizmoType(map);
    }
    let haxElements = HAXStore.guessGizmo(gizmoType, map, false, true);
    // see if we got anything
    if (haxElements.length > 0) {
      if (haxElements.length === 1) {
        if (typeof haxElements[0].tag !== typeof undefined) {
          haxElements[0].nextToActive = true;
          this.dispatchEvent(
            new CustomEvent("hax-insert-content", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: haxElements[0],
            })
          );
        }
      } else {
        // hand off to hax-app-picker to deal with the rest of this
        HAXStore.haxAppPicker.presentOptions(
          haxElements,
          gizmoType,
          "How would you like to display this " + gizmoType + "?",
          "gizmo"
        );
      }
    } else {
      HAXStore.toast("Sorry, HAX can't handle that link yet.");
    }
  }
}
window.customElements.define(HaxAppSearchResult.tag, HaxAppSearchResult);
export { HaxAppSearchResult };
