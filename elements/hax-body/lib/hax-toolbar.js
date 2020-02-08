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
          height: 36px;
          pointer-events: all;
        }
        :host *[hidden] {
          display: none;
        }
        .wrapper {
          display: flex;
          height: 38px;
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
          background-color: var(--hax-color-menu-heading-bg);
          cursor: pointer;
        }
        paper-slider {
          background-color: var(--hax-contextual-action-color);
          color: #ffffff;
          font-weight: bold;
          height: 36px;
          min-width: 100px;
          --paper-slider-font-color: black;
          --paper-slider-active-color: #ffffff;
          --paper-slider-knob-color: #ffffff;
          --paper-slider-pin-start-color: #ffffff;
          --paper-slider-pin-color: #ffffff;
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
    this.size = 100;
    this.justifyIcon = "editor:format-align-left";
    this.inline = false;
    this.justifyValue = "";
    import("@polymer/paper-slider/paper-slider.js");
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");
    import("@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
    setTimeout(() => {
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
      );
    }, 0);
  }
  render() {
    return html`
      <div class="wrapper">
        <hax-context-item-menu
          action
          ?hidden="${!this.haxProperties.canPosition}"
          @selected-value-changed="${this.justifyValueChanged}"
          id="justify"
          icon="${this.justifyIcon}"
          label="Alignment"
        >
          <hax-context-item
            action
            menu
            icon="editor:format-align-left"
            event-name="hax-align-left"
            >Left</hax-context-item
          >
          <hax-context-item
            action
            menu
            icon="editor:format-align-center"
            event-name="hax-align-center"
            >Center</hax-context-item
          >
        </hax-context-item-menu>
        <paper-slider
          ?hidden="${!this.haxProperties.canScale}"
          id="slider"
          pin
          min="${this.haxProperties.canScale && this.haxProperties.canScale.min
            ? this.haxProperties.canScale.min
            : 12.5}"
          step="${this.haxProperties.canScale &&
          this.haxProperties.canScale.step
            ? this.haxProperties.canScale.step
            : 12.5}"
          max="${this.haxProperties.canScale && this.haxProperties.canScale.max
            ? this.haxProperties.canScale.max
            : 100}"
          value="${this.size}"
          @immediate-value-changed="${this.sizeChanged}"
          @value-changed="${this.sizeChanged}"
        ></paper-slider>
        <simple-tooltip
          ?hidden="${this.inline}"
          for="slider"
          position="top"
          offset="10"
        >
          Resize
        </simple-tooltip>
        <slot name="primary"></slot>
        <hax-context-item-menu
          action
          ?hidden="${this.hideMore}"
          icon="more-vert"
          label="More operations"
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
  sizeChanged(e) {
    this.size = e.detail.value;
  }
  justifyValueChanged(e) {
    this.justifyValue = e.detail;
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
        type: Object,
        attribute: "hax-properties"
      },
      /**
       * Hide the more menu.
       */
      hideMore: {
        type: Boolean,
        attribute: "hide-more"
      },
      /**
       * size of the slider if it exists.
       */
      size: {
        type: Number
      },
      /**
       * Justify icon to reflect state.
       */
      justifyIcon: {
        type: String,
        attribute: "justify-icon"
      },
      /**
       * This is an inline context menu
       */
      inline: {
        type: Boolean,
        reflect: true
      },
      /**
       * Selected value to match ce direction currently.
       */
      justifyValue: {
        type: String,
        attribute: "justify-value"
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "haxProperties") {
        this._haxPropertiesChanged(this[propName], oldValue);
      }
      if (propName == "size") {
        // notify
        this.dispatchEvent(
          new CustomEvent("size-changed", {
            detail: this[propName]
          })
        );
      }
      if (propName == "justifyValue") {
        // notify
        this.dispatchEvent(
          new CustomEvent("justify-value-changed", {
            detail: this[propName]
          })
        );
      }
    });
  }
  /**
   * If hax properties changes, let's see what the initial state
   * of the buttons should be.
   */
  _haxPropertiesChanged(newValue, oldValue) {
    // value doesn't matter, just look at what's active
    if (typeof window.HaxStore.instance.activeNode !== typeof undefined) {
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
      if (window.HaxStore.instance.activeNode.style.width != "") {
        this.size = window.HaxStore.instance.activeNode.style.width.replace(
          "%",
          ""
        );
      } else {
        this.size = 100;
      }

      if (
        window.HaxStore.instance.activeNode.style.margin == "0px auto" &&
        window.HaxStore.instance.activeNode.style.display == "block"
      ) {
        this.justifyValue = "hax-align-center";
        this.justifyIcon = "editor:format-align-center";
      } else {
        this.justifyValue = "hax-align-left";
        this.justifyIcon = "editor:format-align-left";
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
      case "hax-align-left":
      case "hax-align-center":
        this.justifyIcon = detail.target.icon;
        break;
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
