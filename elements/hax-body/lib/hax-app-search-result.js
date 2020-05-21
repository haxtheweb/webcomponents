import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `hax-source`
 * @element hax-source
 * `An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that we can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.`
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
          width: 49%;
          height: 220px;
          background-color: var(--hax-color-bg-accent);
          color: var(--hax-color-text);
        }
        paper-button.button {
          margin: 0;
          padding: 7px;
          display: block;
          border-radius: 0;
          border: none;
          width: 100%;
          outline: 2px solid black;
          background-image: none;
          text-align: unset;
        }
        paper-button:hover,
        paper-button:focus,
        paper-button:active {
          background-color: #eeeeee;
          outline: 2px solid var(--hax-color-bg-accent);
        }
        .detail-wrapper {
          padding: 0 8px;
          overflow: hidden;
          font-family: "Noto Serif", serif;
        }
        .title {
          font-size: 14px;
          overflow: hidden;
          font-weight: bold;
          text-transform: none;
          padding-bottom: 4px;
          text-align: center;
        }
        .image {
          height: 152px;
          width: 100%;
          background-color: var(--simple-colors-default-theme-cyan-7, #009dc7);
        }
        @media screen and (max-width: 1000px) {
          :host {
            width: 100%;
          }
          .title {
            font-size: 12px;
          }
        }
      `
    ];
  }

  render() {
    return html`
      <paper-button
        draggable="true"
        @click="${this._itemSelected}"
        @dragstart="${this._dragStart}"
        @dragend="${this._dragEnd}"
        class="button"
        title="${this.details}"
      >
        <iron-image
          alt=""
          class="image"
          src="${this.image}"
          preload=""
          fade=""
          sizing="cover"
        ></iron-image>
        <div class="detail-wrapper">
          <div class="title">${this.title.substr(0, 40)}</div>
        </div>
      </paper-button>
    `;
  }
  static get tag() {
    return "hax-app-search-result";
  }
  static get properties() {
    return {
      image: {
        type: String
      },
      title: {
        type: String
      },
      details: {
        type: String
      },
      map: {
        type: Object
      },
      type: {
        type: String
      }
    };
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    // create the tag
    let target = this.cloneNode(true);
    window.HaxStore.instance.__dragTarget = target;
    if (e.dataTransfer) {
      this.crt = target;
      this.crt.style.position = "absolute";
      this.crt.style.top = "-1000px";
      this.crt.style.right = "-1000px";
      this.crt.style.transform = "scale(0.25)";
      this.crt.style.opacity = ".8";
      e.dataTransfer.dropEffect = "move";
      document.body.appendChild(this.crt);
      e.dataTransfer.setDragImage(this.crt, 0, 0);
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
    // show where things can be dropped only during the drag
    if (
      !window.HaxStore.instance.activeHaxBody.openDrawer &&
      window.HaxStore.instance.editMode
    ) {
      let children = window.HaxStore.instance.activeHaxBody.children;
      // walk the children and apply the draggable state needed
      for (var i in children) {
        if (children[i].classList && target !== children[i]) {
          children[i].classList.add("hax-mover");
        }
      }
    }
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    this.crt.remove();
    setTimeout(() => {
      let children = window.HaxStore.instance.activeHaxBody.querySelectorAll(
        ".hax-mover, .hax-hovered, .hax-moving, .grid-plate-active-item"
      );
      // walk the children and apply the draggable state needed
      for (var i in children) {
        if (typeof children[i].classList !== typeof undefined) {
          children[i].classList.remove(
            "hax-mover",
            "hax-hovered",
            "hax-moving",
            "grid-plate-active-item"
          );
        }
      }
      setTimeout(() => {
        this._itemSelected(e);
      }, 100);
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
        gizmoType === null ||
        gizmoType === "" ||
        gizmoType === "undefined") &&
      map.source
    ) {
      gizmoType = window.HaxStore.guessGizmoType(map.source);
    }
    let haxElements = window.HaxStore.guessGizmo(gizmoType, map, false, true);
    // see if we got anything
    if (haxElements.length > 0) {
      if (haxElements.length === 1) {
        if (typeof haxElements[0].tag !== typeof undefined) {
          this.dispatchEvent(
            new CustomEvent("hax-insert-content", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: haxElements[0]
            })
          );
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
      window.HaxStore.toast("Sorry, HAX can't handle that link yet.");
    }
  }
}
window.customElements.define(HaxAppSearchResult.tag, HaxAppSearchResult);
export { HaxAppSearchResult };
