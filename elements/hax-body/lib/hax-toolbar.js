import { LitElement, html, css } from "lit-element/lit-element.js";
class HaxToolbar extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          justify-content: flex-start;
          visibility: visible;
          transition: 0.3s all ease;
          box-sizing: border-box;
          pointer-events: all;
        }
        :host *[hidden] {
          display: none;
        }
        .wrapper {
          display: flex;
          align-items: center;
        }
        :host .wrapper ::slotted(*) {
          pointer-events: all;
        }
        .close-cap {
          margin: 10px 10px 0 8px;
          display: flex;
          padding: 0;
        }
        :host * ::slotted(hax-context-item:hover),
        :host * ::slotted(hax-context-item-textop:hover),
        :host * ::slotted(hax-context-item-menu:hover),
        hax-context-item:hover,
        hax-context-item-textop:hover,
        hax-context-item-menu:hover {
          z-index: 2;
        }
        #moremenu hax-context-item,
        #moremenu ::slotted(paper-item),
        paper-item {
          height: 32px;
          padding: 0;
          min-width: 100px;
        }

        #moremenu hax-context-item:hover,
        :host #moremenu ::slotted(paper-item:hover),
        paper-item:hover {
          cursor: pointer;
        }
        .convert-button {
          border-top: 1px solid var(--hax-color-bg-accent);
        }
      `
    ];
  }
  constructor() {
    super();
    this.hideTransform = false;
    this.selected = false;
    this.haxProperties = {};
    this.hideMore = false;
    this.inline = false;
    setTimeout(() => {
      import("@polymer/paper-item/paper-item.js");
      import("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");
      import("@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js");
      import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
      import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
      );
    }, 0);
  }
  render() {
    return html`
      <div class="wrapper">
        <slot name="prefix"></slot>
        <slot name="primary"></slot>
        <hax-context-item-menu
          mini
          action
          ?hidden="${this.hideMore}"
          icon="icons:more-horiz"
          label="More options"
          id="moremenu"
          event-name="hax-plate-op"
          reset-on-select
        >
          <paper-item value="" hidden></paper-item>
          <slot name="more"></slot>
        </hax-context-item-menu>
      </div>
    `;
  }
  static get tag() {
    return "hax-toolbar";
  }

  static get properties() {
    return {
      /**
       * Hide the transform button as its not supported
       */
      hideTransform: {
        type: Boolean,
        attribute: "hide-transform"
      },
      /**
       * See what's selected
       */
      selected: {
        type: Boolean,
        reflect: true
      },
      /**
       * Selected value to match ce direction currently.
       */
      haxProperties: {
        type: Object
      },
      /**
       * Hide the more menu.
       */
      hideMore: {
        type: Boolean,
        attribute: "hide-more"
      },
      /**
       * This is an inline context menu
       */
      inline: {
        type: Boolean,
        reflect: true
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "haxProperties") {
        this._haxPropertiesChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * If hax properties changes, let's see what the initial state
   * of the buttons should be.
   */
  _haxPropertiesChanged(newValue, oldValue) {
    // value doesn't matter, just look at what's active
    if (window.HaxStore.instance.activeNode) {
      if (
        window.HaxStore.instance.isTextElement(
          window.HaxStore.instance.activeNode
        ) ||
        window.HaxStore.instance.activeNode.tagName == "HR"
      ) {
        this.hideTransform = true;
      } else {
        this.hideTransform = false;
      }
    }
  }

  /**
   * Respond to simple modifications.
   */
  _haxContextOperation(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "close-menu":
        setTimeout(() => {
          this.shadowRoot
            .querySelector("#moremenu")
            .shadowRoot.querySelector("#menu")
            .hideMenu();
          this.shadowRoot
            .querySelector("#justify")
            .shadowRoot.querySelector("#menu")
            .hideMenu();
        }, 200);
        break;
    }
  }
}
window.customElements.define(HaxToolbar.tag, HaxToolbar);
export { HaxToolbar };
