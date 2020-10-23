import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js";
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
          transition: 0.2s all ease-in-out;
          box-sizing: border-box;
          pointer-events: all;
          background-color: white;
        }

        :host *[hidden] {
          display: none;
        }
        .wrapper {
          display: flex;
          align-items: center;
          transition: 0.2s all ease-in-out;
          visibility: visible;
          opacity: 0.8;
        }
        .wrapper:hover {
          opacity: 1;
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
        #moremenu ::slotted(button),
        button {
          height: 32px;
          padding: 0;
          min-width: 100px;
          color: white !important;
          border: 0;
        }

        #moremenu hax-context-item:hover,
        :host #moremenu ::slotted(button:hover),
        button:hover {
          cursor: pointer;
        }
        .convert-button {
          border-top: 1px solid var(--hax-color-bg-accent);
        }
      `,
    ];
  }
  constructor() {
    super();
    this.selected = false;
    this.hideMore = false;
    this.inline = false;
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
       * See what's selected
       */
      selected: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Hide the more menu.
       */
      hideMore: {
        type: Boolean,
        attribute: "hide-more",
      },
      /**
       * This is an inline context menu
       */
      inline: {
        type: Boolean,
        reflect: true,
      },
    };
  }
}
window.customElements.define(HaxToolbar.tag, HaxToolbar);
export { HaxToolbar };
