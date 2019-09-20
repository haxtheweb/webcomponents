import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
class HaxToolbar extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-slider/paper-slider.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");
    import("@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
    this.addEventListener(
      "hax-context-item-selected",
      this._haxContextOperation.bind(this)
    );
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles hax-shared-styles">
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
          border: 1px solid var(--hax-color-border-outline, black);
          color: #222222;
          background-color: #ffffff;
          height: 35px;
          align-items: center;
          padding: 1px;
          margin-top: -2px;
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
          background-color: var(--hax-color-bg-accent);
          color: #ffffff;
          font-weight: bold;
          height: 36px;
          min-width: 100px;
          --paper-slider-font-color: white;
          --paper-slider-active-color: var(--hax-color-accent1);
          --paper-slider-knob-color: var(--hax-color-accent1);
          --paper-slider-pin-start-color: var(--hax-color-accent1);
          --paper-slider-pin-color: var(--hax-color-accent1);
        }
        .convert-button {
          border-top: 1px solid var(--hax-color-bg-accent);
        }
      </style>
      <hax-context-item
        hidden$="[[inline]]"
        mini
        light
        icon="close"
        label="Close"
        event-name="close-menu"
        class="close-cap"
        direction="left"
      ></hax-context-item>
      <div class="wrapper">
        <hax-context-item-menu
          hidden$="[[!haxProperties.canPosition]]"
          selected-value="{{justifyValue}}"
          id="justify"
          icon="[[justifyIcon]]"
          label="Alignment"
        >
          <hax-context-item
            menu
            icon="editor:format-align-left"
            event-name="hax-align-left"
            >Left</hax-context-item
          >
          <hax-context-item
            menu
            icon="editor:format-align-center"
            event-name="hax-align-center"
            >Center</hax-context-item
          >
        </hax-context-item-menu>
        <paper-slider
          hidden$="[[!haxProperties.canScale]]"
          id="slider"
          pin=""
          min="25"
          step="25"
          max="100"
          value="{{size}}"
        ></paper-slider>
        <paper-tooltip
          hidden$="[[inline]]"
          for="slider"
          position="top"
          offset="10"
        >
          Resize
        </paper-tooltip>
        <slot name="primary"></slot>
        <hax-context-item
          hidden$="[[inline]]"
          icon="delete"
          icon-class="red-text text-darken-1"
          label="Remove"
          event-name="grid-plate-delete"
        ></hax-context-item>
        <hax-context-item-menu
          hidden$="[[hideMore]]"
          icon="more-vert"
          label="More"
          id="moremenu"
          event-name="grid-plate-op"
          reset-on-select=""
        >
          <paper-item value="" hidden></paper-item>
          <slot name="more"></slot>
          <hax-context-item
            menu
            icon="icons:content-copy"
            icon-class="green-text"
            event-name="grid-plate-duplicate"
            >Duplicate</hax-context-item
          >
          <hax-context-item
            hidden$="[[hideTransform]]"
            menu
            icon="image:transform"
            class="convert-button"
            icon-class="orange-text"
            event-name="grid-plate-convert"
            >Transform to..</hax-context-item
          >
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
        value: false
      },
      /**
       * See what's selected
       */
      selected: {
        type: Boolean,
        value: false,
        reflectToAttritue: true
      },
      /**
       * Selected value to match ce direction currently.
       */
      haxProperties: {
        type: Object,
        value: {},
        observer: "_haxPropertiesChanged"
      },
      /**
       * Hide the more menu.
       */
      hideMore: {
        type: Boolean,
        value: false
      },
      /**
       * size of the slider if it exists.
       */
      size: {
        type: Number,
        value: 100,
        notify: true
      },
      /**
       * Justify icon to reflect state.
       */
      justifyIcon: {
        type: String,
        value: "editor:format-align-left"
      },
      /**
       * This is an inline context menu
       */
      inline: {
        type: Boolean,
        value: false,
        reflectToAttritue: true
      },
      /**
       * Selected value to match ce direction currently.
       */
      justifyValue: {
        type: String,
        value: "",
        notify: true
      }
    };
  }
  /**
   * If hax properties changes, let's see what the initial state
   * of the buttons should be.
   */
  _haxPropertiesChanged(newValue, oldValue) {
    // value doesn't matter, just look at what's active
    if (typeof window.HaxStore.instance.activeNode !== typeof undefined) {
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
