import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-body/lib/hax-toolbar-item.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import {
  normalizeEventPath,
  nodeToHaxElement,
} from "@haxtheweb/utils/utils.js";
import { HaxTrayDetailHeadings } from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

/**
 * `hax-map`
 * @element hax-map
 * `Export dialog with all export options and settings provided.`
 */
class HaxMap extends I18NMixin(SimpleColors) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      ...HaxTrayDetailHeadings,
      css`
        :host {
          display: block;
        }
        .container {
          text-align: left;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        /* HAX UI tree rows, as outline-designer draws them: 32px, the block
           type in bold, a muted excerpt of its text, and the row's own
           actions on hover or focus */
        ul li {
          margin: 0;
          padding: 0 var(--hax-ui-gap-md, 8px) 0 var(--hax-ui-gap-md, 8px);
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          min-height: var(--hax-ui-row-height, 32px);
          font-size: var(--hax-ui-admin-font-size, 14px);
          color: var(--hax-ui-text, var(--hax-ui-color));
        }
        ul li:hover,
        ul li:focus-within {
          background-color: var(--hax-ui-hover, transparent);
        }
        li hax-toolbar-item {
          display: inline-flex;
          flex: 0 0 auto;
          max-width: 60%;
          height: var(--hax-ui-row-height, 32px);
          overflow: hidden;
          --simple-toolbar-button-height: var(--hax-ui-icon, 16px);
          --simple-toolbar-button-width: var(--hax-ui-icon, 16px);
        }
        li hax-toolbar-item::part(button) {
          gap: var(--hax-ui-gap-md, 8px);
          padding: 0;
          border-color: transparent;
          background-color: transparent;
          color: var(--hax-ui-text, var(--hax-ui-color));
          font-size: var(--hax-ui-admin-font-size, 14px);
          font-weight: 700;
        }
        li hax-toolbar-item::part(icon) {
          color: var(--hax-ui-text-muted, currentColor);
        }
        li hax-toolbar-item::part(label) {
          margin: 0;
        }
        li .excerpt {
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: var(--hax-ui-text-muted, currentColor);
          cursor: pointer;
        }
        /* a row's actions take no room until the row is hovered or has
           focus, so the excerpt can use the width */
        li simple-icon-button-lite {
          display: none;
          flex: 0 0 auto;
          opacity: 0;
          visibility: hidden;
          --simple-icon-width: var(--hax-ui-icon, 16px);
          --simple-icon-height: var(--hax-ui-icon, 16px);
          --simple-icon-button-border-radius: var(--hax-ui-radius, 4px);
          --simple-icon-button-padding: 0;
          box-sizing: border-box;
          width: var(--hax-ui-target, 24px);
          height: var(--hax-ui-target, 24px);
          border-radius: var(--hax-ui-radius, 4px);
          margin: 0;
          padding: 0;
          color: var(--hax-ui-text, var(--hax-ui-color));
          background-color: var(
            --hax-ui-surface,
            var(--hax-ui-background-color)
          );
          border: 1px solid
            var(--hax-ui-line-strong, var(--hax-ui-border-color));
          transition:
            background-color var(--hax-ui-duration, 150ms) ease,
            opacity var(--hax-ui-duration, 150ms) ease;
        }
        li simple-icon-button-lite:hover,
        li simple-icon-button-lite:focus,
        li simple-icon-button-lite:focus-within {
          background-color: var(
            --hax-ui-hover,
            var(--hax-ui-background-color-secondary)
          );
          opacity: 1;
        }
        li simple-icon-button-lite.del {
          color: var(--hax-ui-danger, var(--hax-ui-color-danger));
          border-color: var(--hax-ui-danger, var(--hax-ui-color-danger));
        }
        li:hover simple-icon-button-lite,
        li:focus-within simple-icon-button-lite {
          display: inline-flex;
          visibility: visible;
          opacity: 1;
        }
        li hax-toolbar-item {
          max-width: none;
        }
        li:has(hax-toolbar-item[data-active-item]) {
          background-color: var(
            --hax-ui-selected,
            var(--hax-ui-background-color-accent)
          );
          box-shadow: inset var(--ddd-border-size-md, 3px) 0 0
            var(--hax-ui-accent-strong, var(--hax-ui-color-accent));
        }
        @media (prefers-reduced-motion: reduce) {
          li simple-icon-button-lite {
            transition: none;
          }
        }
        li.is-child {
          margin-left: 8px;
        }

        li hax-toolbar-item,
        li.parent-h2 hax-toolbar-item[icon="hax:h2"] {
          margin-left: 0px;
          cursor: pointer;
        }
        li.parent-h2 hax-toolbar-item,
        li.parent-h2 + li.is-child hax-toolbar-item,
        li.parent-h2 + li.is-child ~ li.is-child hax-toolbar-item,
        li.parent-h3 hax-toolbar-item[icon="hax:h3"] {
          margin-left: 8px;
        }
        li.parent-h3 hax-toolbar-item,
        li.parent-h3 + li.is-child hax-toolbar-item,
        li.parent-h3 + li.is-child ~ li.is-child hax-toolbar-item,
        li.parent-h4 hax-toolbar-item[icon="hax:h4"] {
          margin-left: 8px;
        }
        li.parent-h4 hax-toolbar-item,
        li.parent-h4 + li.is-child hax-toolbar-item,
        li.parent-h4 + li.is-child ~ li.is-child hax-toolbar-item,
        li.parent-h5 hax-toolbar-item[icon="hax:h5"] {
          margin-left: 12px;
        }
        li.parent-h5 hax-toolbar-item,
        li.parent-h5 + li.is-child hax-toolbar-item,
        li.parent-h5 + li.is-child ~ li.is-child hax-toolbar-item,
        li.parent-h6 hax-toolbar-item[icon="hax:h6"],
        li.parent-h6 hax-toolbar-item,
        li.parent-h6 + li.is-child hax-toolbar-item,
        li.parent-h6 + li.is-child ~ li.is-child hax-toolbar-item {
          margin-left: 12px;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.elementList = [];
    this.dark = false;
    this.__mapMutationObserver = null;
    this.__mapMutationObserverTarget = null;
    this.__mapRefreshDebounce = null;
    this.t = {
      lockUnlock: "Lock / Unlock",
      moveUp: "Move up",
      moveDown: "Move down",
      delete: "Delete",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeNode);
      Promise.resolve().then(() => {
        if (HAXStore.editMode) {
          this.activeNode = _mobx_val_0;
          this.requestUpdate();
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.globalPreferences);
      Promise.resolve().then(() => {
        const globalPreferences = _mobx_val_0;
        const haxUiTheme = (globalPreferences || {}).haxUiTheme || "hax";
        this.dark = haxUiTheme === "haxdark";
      });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hidden) {
      this._connectBodyObserver();
      this._scheduleMapRefresh(0);
    }
  }
  disconnectedCallback() {
    this._disconnectBodyObserver();
    clearTimeout(this.__mapRefreshDebounce);
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("hidden")) {
      if (this.hidden) {
        this._disconnectBodyObserver();
      } else {
        this._connectBodyObserver();
        this._scheduleMapRefresh(0);
      }
    }
  }
  _scheduleMapRefresh(delay = 75) {
    if (this.hidden) {
      return;
    }
    clearTimeout(this.__mapRefreshDebounce);
    this.__mapRefreshDebounce = setTimeout(() => {
      this.updateHAXMap();
    }, delay);
  }
  _disconnectBodyObserver() {
    if (this.__mapMutationObserver) {
      this.__mapMutationObserver.disconnect();
    }
    this.__mapMutationObserver = null;
    this.__mapMutationObserverTarget = null;
  }
  _connectBodyObserver() {
    const activeBody = HAXStore.activeHaxBody;
    if (!this.isConnected || this.hidden || !activeBody) {
      this._disconnectBodyObserver();
      return;
    }
    if (
      this.__mapMutationObserver &&
      this.__mapMutationObserverTarget === activeBody
    ) {
      return;
    }
    this._disconnectBodyObserver();
    this.__mapMutationObserverTarget = activeBody;
    this.__mapMutationObserver = new MutationObserver((mutations) => {
      if (this.hidden) {
        return;
      }
      let shouldRefresh = false;
      for (const mutation of mutations) {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          shouldRefresh = true;
          break;
        }
        if (
          mutation.type === "attributes" &&
          mutation.attributeName &&
          ["slot", "data-hax-lock", "class", "id"].includes(
            mutation.attributeName,
          )
        ) {
          shouldRefresh = true;
          break;
        }
      }
      if (shouldRefresh) {
        this._scheduleMapRefresh(40);
      }
    });
    this.__mapMutationObserver.observe(activeBody, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["slot", "data-hax-lock", "class", "id"],
    });
  }
  async updateHAXMap(_e) {
    this._connectBodyObserver();
    const activeBody = HAXStore.activeHaxBody;
    if (!activeBody || !activeBody.childNodes) {
      this.elementList = [];
      return;
    }
    let list = [];
    for (let i = 0; i < activeBody.childNodes.length; i++) {
      const node = activeBody.childNodes[i];
      if (!node || !node.tagName || node.tagName.toLowerCase() === "br") {
        continue;
      }
      let tmpNode = await nodeToHaxElement(node, null);
      if (!tmpNode || !tmpNode.tag || tmpNode.tag.toLowerCase() === "br") {
        continue;
      }
      tmpNode.parent = null;
      tmpNode.node = node;
      list.push(tmpNode);
      if (node.children && node.children.length > 0) {
        for (let j = 0; j < node.children.length; j++) {
          if (
            !node.children[j] ||
            !node.children[j].tagName ||
            node.children[j].tagName.toLowerCase() === "br"
          ) {
            continue;
          }
          let tmpNodeChild = await nodeToHaxElement(node.children[j], null);
          if (
            !tmpNodeChild ||
            !tmpNodeChild.tag ||
            tmpNodeChild.tag.toLowerCase() === "br"
          ) {
            continue;
          }
          tmpNodeChild.parent = tmpNode.tag;
          tmpNodeChild.node = node.children[j];
          // ignore certain tags we don't need a deep selection of
          if (
            ![
              "br",
              "span",
              "strong",
              "b",
              "sup",
              "sub",
              "i",
              "em",
              "div",
              "strike",
            ].includes(tmpNodeChild.tag)
          ) {
            list.push(tmpNodeChild);
          }
        }
      }
    }
    let elements = [];
    for (let i = 0; i < list.length; i++) {
      if (!list[i] || !list[i].tag || list[i].tag.toLowerCase() === "br") {
        continue;
      }
      let def = HAXStore.haxSchemaFromTag(list[i].tag);
      if (def.gizmo) {
        elements.push({
          node: list[i].node,
          tag: list[i].tag,
          parent: list[i].parent,
          icon: def.gizmo.icon,
          name: def.gizmo.title,
          excerpt: this.excerptFor(list[i].node),
        });
      } else {
        if (list[i].tag && list[i].tag.includes("-")) {
          elements.push({
            tag: list[i].tag,
            parent: list[i].parent,
            icon: "hax:templates",
            name: "Widget",
          });
        } else {
          elements.push({
            tag: list[i].tag,
            parent: list[i].parent,
            icon: "hax:paragraph",
            name: "HTML block",
          });
        }
      }
    }
    this.elementList = [...elements];
  }
  render() {
    return html`${
      this.hidden
        ? ``
        : html` <ul>
            ${this.indentedElements(this.elementList).map((element, index) => {
              return html`
                <li
                  class="${
                    element.parent ? `parent-${element.parent}` : "no-parent"
                  } ${
                    ["h1", "h2", "h3", "h4", "h5", "h6", element.tag].includes(
                      element.parent,
                    )
                      ? ""
                      : "is-child"
                  }"
                >
                  <hax-toolbar-item
                    align-horizontal="left"
                    @click="${(_e) => this.goToItem(index)}"
                    @dblclick="${(_e) => this.editItem(index)}"
                    data-index="${index}"
                    ?data-active-item="${element.node === this.activeNode}"
                    icon="${element.icon}"
                    label="${element.name}"
                    show-text-label
                  >
                  </hax-toolbar-item>
                  <span
                    class="excerpt"
                    aria-hidden="true"
                    @click="${(_e) => this.goToItem(index)}"
                    >${element.excerpt || ""}</span
                  >
                  ${
                    element.tag != "page-break"
                      ? html`
                          <simple-icon-button-lite
                            icon="${
                              this.isLocked(index)
                                ? "hax:admin-lock"
                                : "hax:admin-unlock"
                            }"
                            @click="${(_e) => this.itemOp(index, "lock")}"
                            title="${this.t.lockUnlock}"
                          ></simple-icon-button-lite>
                          <simple-icon-button-lite
                            icon="hax:admin-move-up"
                            @click="${(_e) => this.itemOp(index, "up")}"
                            title="${this.t.moveUp}"
                            ?disabled="${this.isLocked(index)}"
                          ></simple-icon-button-lite>
                          <simple-icon-button-lite
                            icon="hax:admin-move-down"
                            @click="${(_e) => this.itemOp(index, "down")}"
                            title="${this.t.moveDown}"
                            ?disabled="${this.isLocked(index)}"
                          ></simple-icon-button-lite>
                          <simple-icon-button-lite
                            class="del"
                            icon="hax:admin-delete"
                            @click="${(_e) => this.itemOp(index, "delete")}"
                            title="${this.t.delete}"
                            ?disabled="${this.isLocked(index)}"
                          ></simple-icon-button-lite>
                        `
                      : ``
                  }
                </li>
              `;
            })}
          </ul>`
    } `;
  }
  editItem(index) {
    if (index !== false && this.elementList[index].node) {
      this.dispatchEvent(
        new CustomEvent("hax-context-item-selected", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            target: this.elementList[index].node,
            eventName: "content-edit",
            value: true,
          },
        }),
      );
    }
  }
  isLocked(index) {
    if (index !== false && this.elementList[index].node) {
      let node = this.elementList[index].node;
      if (
        node.getAttribute("data-hax-lock") != null ||
        (node.parentNode &&
          node.parentNode.getAttribute("data-hax-lock") != null)
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
  itemOp(index, action) {
    if (index !== false && this.elementList[index].node && action) {
      let node = this.elementList[index].node;
      // verify this is not locked
      if (
        node.getAttribute("data-hax-lock") == null &&
        node.parentNode &&
        node.parentNode.getAttribute("data-hax-lock") == null
      ) {
        switch (action) {
          case "lock":
            node.setAttribute("data-hax-lock", "data-hax-lock");
            this.dispatchEvent(
              new CustomEvent("hax-toggle-active-node-lock", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                  lock: true,
                  node: node,
                },
              }),
            );
            break;
          case "delete":
            HAXStore.activeHaxBody.haxDeleteNode(node);
            break;
          case "down":
            if (node.nextElementSibling) {
              HAXStore.activeHaxBody.haxMoveGridPlate(node);
            }
            break;
          case "up":
            if (
              node.previousElementSibling &&
              node.previousElementSibling.tagName !== "PAGE-BREAK"
            ) {
              HAXStore.activeHaxBody.haxMoveGridPlate(node, -1);
            }
            break;
        }
      } else if (action === "lock") {
        node.removeAttribute("data-hax-lock");
        this.dispatchEvent(
          new CustomEvent("hax-toggle-active-node-lock", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              lock: false,
              node: node,
            },
          }),
        );
      }
      this._scheduleMapRefresh(50);
      setTimeout(() => {
        this.requestUpdate();
      }, 0);
    }
  }
  /**
   * A short plain-text excerpt of a block, so rows of the same type (three
   * Headings) can be told apart. Text only, read from the page; a page
   * break shows its title.
   */
  excerptFor(node) {
    if (!node || !node.getAttribute) {
      return "";
    }
    let text =
      node.tagName === "PAGE-BREAK"
        ? node.getAttribute("title") || ""
        : node.innerText || node.textContent || "";
    text = text.replace(/\s+/g, " ").trim();
    return text.length > 80 ? `${text.substring(0, 80)}…` : text;
  }
  indentedElements(elementList) {
    let prev = "h1";
    return elementList.map((element) => {
      let el = element;
      if (el.parent === null) {
        el.parent = prev;
      }
      if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(el.tag)) {
        el.parent = el.tag;
        prev = el.tag;
      }
      return el;
    });
  }
  goToItem(index) {
    if (index !== false && this.elementList[index].node) {
      // find based on index position
      let activeChild = this.elementList[index].node;
      HAXStore.activeNode = activeChild;
      activeChild.classList.add("blinkfocus");
      if (typeof activeChild.scrollIntoViewIfNeeded === "function") {
        activeChild.scrollIntoViewIfNeeded(false);
      } else {
        activeChild.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "center",
        });
      }
      setTimeout(() => {
        activeChild.classList.remove("blinkfocus");
      }, 500);
    }
  }
  scrollInMap(e) {
    let target = normalizeEventPath(e)[0];
    this.goToItem(target.getAttribute("data-index"));
  }
  static get tag() {
    return "hax-map";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Title when open.
       */
      opened: {
        type: Boolean,
      },
      hidden: {
        type: Boolean,
        reflect: true,
      },
      dark: {
        type: Boolean,
        reflect: true,
      },
      elementList: {
        type: Array,
      },
      activeNode: {
        type: Object,
      },
    };
  }
}
globalThis.customElements.define(HaxMap.tag, HaxMap);
export { HaxMap };
