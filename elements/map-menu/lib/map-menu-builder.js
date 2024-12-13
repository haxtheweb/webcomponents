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
    this.depthCount = 1;
    this.maxDepth = 5;
    this.isFlex = false;
    this.isNested = false;
    this.isHorizontal = false;
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    if(this.depthCount<=this.maxDepth){
      return html`
      <div class="wrapper">      
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
                        ?opened="${this.depthCount > 1 && this.isHorizontal}"
                        ?is-flex="${this.isFlex}"
                        ?is-nested="${this.depthCount > 1}"
                        ?is-horizontal="${this.isHorizontal}"
                        ?published="${this.getPublishedStatus(item)}"
                        ?hide-in-menu="${this.hideInMenuStatus(item)}"
                      >
                        <map-menu-builder
                          .items="${item.children}"
                          ?edit-controls="${this.editControls}"
                          selected="${this.selected}"
                          depth-count="${this.depthCount+1}"
                          max-depth="${this.maxDepth}"
                          ?is-flex="${this.isFlex}"
                          ?is-horizontal="${this.isHorizontal}"
                          ?is-nested="${true}"
                        ></map-menu-builder>
                      </map-menu-submenu>
                    `
                  : html`
                      <map-menu-item
                        ?edit-controls="${this.editControls}"
                        ?is-nested="${this.depthCount > 1}"
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
      </div>
    `;
    }
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
      maxDepth: {
        type: Number,
        attribute: "max-depth",
        reflect: true
      },
      depthCount: {
        type: Number,
        attribute: "depth-count",
      },
      isFlex: {
        type: Boolean,
        attribute: "is-flex"
      },
      isHorizontal: {
        type: Boolean,
        attribute: "is-horizontal"
      }
    };
  }
  createRenderRoot() {
    return this;
  }
}
customElements.define(MapMenuBuilder.tag, MapMenuBuilder);
export { MapMenuBuilder };
