import { LitElement, html, css } from "lit-element/lit-element.js";
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
      `
    ];
  }
  constructor() {
    super();
    this.items = [];
    import("@lrnwebcomponents/map-menu/lib/map-menu-submenu.js");
    import("@lrnwebcomponents/map-menu/lib/map-menu-item.js");
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    return html`
      ${this.items
        ? this.items.map(
            item => html`
              ${item.children.length > 0
                ? html`
                    <map-menu-submenu
                      title="${item.title}"
                      id="${item.id}"
                      url="${item.slug}"
                      icon="${item.metadata && item.metadata.icon
                        ? item.metadata.icon
                        : ""}"
                      open="${item.metadata && item.metadata.active
                        ? item.metadata.active
                        : false}"
                      avatar-label="${item.metadata && item.metadata.avatarLabel
                        ? item.metadata.avatarLabel
                        : ""}"
                      selected="${this.selected}"
                    >
                      <map-menu-builder
                        .items="${item.children}"
                        selected="${this.selected}"
                      ></map-menu-builder>
                    </map-menu-submenu>
                  `
                : html`
                    <map-menu-item
                      title="${item.title}"
                      id="${item.id}"
                      url="${item.slug}"
                      icon="${item.metadata && item.metadata.icon
                        ? item.metadata.icon
                        : ""}"
                      track-icon="${item.metadata &&
                      item.metadata.accessData &&
                      item.metadata.accessData.trackIcon
                        ? item.metadata.accessData.trackIcon
                        : ""}"
                      active-path="${this.activePath}"
                      selected="${this.selected}"
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
        type: Array
      },
      selected: {
        type: String
      }
    };
  }
}
window.customElements.define(MapMenuBuilder.tag, MapMenuBuilder);
export { MapMenuBuilder };
