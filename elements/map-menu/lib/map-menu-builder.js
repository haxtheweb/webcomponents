import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/map-menu/lib/map-menu-submenu.js";
import "@lrnwebcomponents/map-menu/lib/map-menu-item.js";
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
                      avatar-label="${item.metadata && item.metadata.avatarLabel
                        ? item.metadata.avatarLabel
                        : ""}"
                      selected="${this.selected}"
                      ?published="${item.metadata.published}"
                    >
                      <map-menu-builder
                        .items="${item.children}"
                        selected="${this.selected}"
                      ></map-menu-builder>
                    </map-menu-submenu>
                  `
                : html`
                    <map-menu-item
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
                      ?published="${item.metadata.published}"
                      ?locked="${item.metadata.locked}"
                      status="${item.metadata.status}"
                    ></map-menu-item>
                  `}
            `
          )
        : ""}
    `;
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
    };
  }
  createRenderRoot() {
    return this;
  }
}
customElements.define(MapMenuBuilder.tag, MapMenuBuilder);
export { MapMenuBuilder };
