import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-text-context.js";
import "@lrnwebcomponents/hax-body/lib/hax-ce-context.js";
import "@lrnwebcomponents/hax-body/lib/hax-plate-context.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";

class HaxContextToolbar extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          width: 100%;
        }
        :host *:not(:defined) {
          display: none !important;
        }
        :host(:not(.hax-visible)),
        .item {
          visibility: hidden;
          opacity: 0;
          z-index: 1000;
          pointer-events: none;
          transition: 0.2s top ease-in-out, 0.2s left ease-in-out;
        }
        :host(:hover),
        :host(:focus-within),
        .item:hover,
        .item:focus-within {
          z-index: var(--hax-ui-focus-z-index);
        }
        #top .menu {
          display: flex;
          width: 100%;
          align-items: bottom;
          justify-content: space-between;
        }
        #text,
        #ce {
          max-width: 280px;
          flex: 1 1 auto;
        }
        #plate,
        #add {
          flex: 0 0 auto;
        }
        .item-visible,
        .item-active {
          visibility: visible;
          pointer-events: all;
          opacity: 1;
        }
        .item-tracking {
          position: absolute;
        }
      `,
    ];
  }
  constructor() {
    super();
  }
  static get tag() {
    return "hax-context-toolbar";
  }

  render() {
    return html`
      <absolute-position-behavior
        id="top"
        auto
        justify
        position="top"
        .target="${this.target || document.body}"
      >
        <div class="menu">
          <hax-text-context
            id="text"
            class="item ${this.textContext ? "item-visible" : ""}"
            .target="${this.target}"
          ></hax-text-context>
          <hax-ce-context
            id="ce"
            class="item ${this.ceContext ? "item-visible" : ""}"
            .target="${this.target}"
          ></hax-ce-context>
          <hax-plate-context
            id="plate"
            class="item ${this.plateContext ? "item-visible" : ""}"
          ></hax-plate-context>
        </div>
      </absolute-position-behavior>
      <absolute-position-behavior
        auto
        justify
        position="bottom"
        .target="${this.target || document.body}"
      >
        <hax-context-item
          icon="icons:add"
          label="${this.addLabel}"
          show-text-label
          class="item ${this.addContext ? "item-visible" : ""} ${this.trackMouse
            ? "item-tracking"
            : ""}"
        >
        </hax-context-item>
      </absolute-position-behavior>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * See what's selected
       */
      target: {
        type: Object,
      },
      /**
       * This is an inline context menu
       */
      addLabel: {
        type: String,
      },
      /**
       * This is an inline context menu
       */
      addContext: {
        type: Boolean,
      },
      /**
       * This is an inline context menu
       */
      plateContext: {
        type: Boolean,
        reflect: true,
      },
      /**
       * This is an inline context menu
       */
      ceContext: {
        type: Boolean,
      },
      /**
       * This is an inline context menu
       */
      plateContext: {
        type: Boolean,
      },
      /**
       * This is an inline context menu
       */
      trackMouse: {
        type: Boolean,
      },
    };
  }
  get haxVisible() {
    let visible = this.target && (this.ceContext || this.topVisible);
    this.setAttribute("hax-visible", visible);
    return visible;
  }
  get topVisible() {
    return this.ceContext || this.plateContext || this.textContext;
  }
  get topToolbar() {
    return this.getToolbar("#top");
  }
  get bottomToolbar() {
    return this.getToolbar("#bottom");
  }
  getToolbar(id) {
    return this.shadowRoot && this.shadowRoot.querySelector(`#${id}`)
      ? this.shadowRoot.querySelector(`#${id}`)
      : undefined;
  }
}
/**
 *
 * @customElement
 * @extends HaxContextToolbar
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
window.customElements.define(HaxContextToolbar.tag, HaxContextToolbar);
export { HaxContextToolbar };
