import { LitElement, html, css } from "lit";
import "@haxtheweb/map-menu/lib/map-menu-submenu.js";
import "@haxtheweb/map-menu/lib/map-menu-item.js";
class MapMenuBuilder extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.editControls = false;
    this.items = [];
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      ${this.items
        ? this.items.map(
            (item) => html`
              ${item.children.length > 0
                ? html`
                    <map-menu-submenu
                      itemtitle="${item.title}"
                      id="${item.id}"
                      url="${item.slug}"
                      icon="${item.metadata && item.metadata.icon
                        ? item.metadata.icon
                        : null}"
                      icon-label="${item.metadata && item.metadata.pageType
                        ? item.metadata.pageType
                        : ""}"
                      ?edit-controls="${this.editControls}"
                      selected="${this.selected}"
                      ?published="${this.getPublishedStatus(item)}"
                      ?hide-in-menu="${this.hideInMenuStatus(item)}"
                    >
                      <map-menu-builder
                        .items="${item.children}"
                        ?edit-controls="${this.editControls}"
                        selected="${this.selected}"
                      ></map-menu-builder>
                    </map-menu-submenu>
                  `
                : html`
                    <map-menu-item
                      ?edit-controls="${this.editControls}"
                      itemtitle="${item.title}"
                      id="${item.id}"
                      url="${item.slug}"
                      icon="${item.metadata && item.metadata.icon
                        ? item.metadata.icon
                        : ""}"
                      icon-label="${item.metadata && item.metadata.pageType
                        ? item.metadata.pageType
                        : ""}"
                      selected="${this.selected}"
                      ?published="${this.getPublishedStatus(item)}"
                      ?hide-in-menu="${this.hideInMenuStatus(item)}"
                      ?locked="${item.metadata.locked}"
                      status="${item.metadata.status}"
                    ></map-menu-item>
                  `}
            `,
          )
        : ""}
    `;
  }

  hideInMenuStatus(item) {
    if (item.metadata && item.metadata.hideInMenu == true) {
      return true;
    }
    return false;
  }

  getPublishedStatus(item) {
    if (
      item.metadata &&
      (item.metadata.published == false || item.metadata.published === "false")
    ) {
      return false;
    }
    return true;
  }

  static get tag() {
    return "map-menu-builder";
  }

  static get properties() {
    return {
      items: {
        type: Array,
      },
      selected: {
        type: String,
      },
      editControls: {
        type: Boolean,
        attribute: "edit-controls",
      },
    };
  }
  createRenderRoot() {
    return this;
  }
}
customElements.define(MapMenuBuilder.tag, MapMenuBuilder);
export { MapMenuBuilder };
