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
        .stats {
          display: flex;
          align-items: stretch;
          flex-wrap: wrap;
        }
        .stat {
          flex: 1 1 auto;
          text-align: center;
          border: 1px solid var(--hax-ui-border-color);
          font-weight: normal;
          font-size: var(--hax-ui-font-size-xs);
          line-height: 140%;
          padding: var(--hax-ui-spacing-sm);
        }
        .stat > * {
          display: block;
        }
        .stat *:first-child {
          font-weight: bold;
          font-size: 150%;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul li {
          margin: 0;
          padding: 0;
          display: flex;
          height: 38px;
        }
        li hax-toolbar-item {
          display: inline-flex;
          max-width: 60%;
          height: 38px;
          margin-right: 8px;
          overflow: hidden;
        }
        li simple-icon-button-lite {
          display: inline-flex;
          opacity: 0;
          visibility: hidden;
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          height: 38px;
          margin: 0 4px;
          color: var(--simple-colors-default-theme-grey-12, black);
          background-color: var(--simple-colors-default-theme-grey-1, white);
        }
        li simple-icon-button:hover {
          background-color: var(--simple-colors-default-theme-grey-2, white);
        }
        li simple-icon-button.del {
          margin-left: 16px;
        }
        li:hover simple-icon-button-lite {
          visibility: visible;
          opacity: 1;
        }
        hax-toolbar-item[data-active-item]::part(button) {
          color: var(--hax-ui-color);
          background-color: var(--hax-ui-background-color-accent);
          border-color: var(--hax-ui-color-accent);
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
    this.t = {
      contentStatistics: "Content Statistics",
      words: "Words",
      headings: "Headings",
      paragraphs: "Paragraphs",
      widgets: "Widgets",
      characters: "Characters",
      listView: "List view",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    autorun(() => {
      if (HAXStore.editMode) {
        this.activeNode = toJS(HAXStore.activeNode);
        setTimeout(() => {
          this.requestUpdate();
        }, 0);
      }
    });
  }
  async updateHAXMap(e) {
    let list = [];
    for (var i = 0; i < HAXStore.activeHaxBody.childNodes.length; i++) {
      const node = HAXStore.activeHaxBody.childNodes[i];
      let tmpNode = await nodeToHaxElement(node, null);
      tmpNode.parent = null;
      tmpNode.node = node;
      list.push(tmpNode);
      if (node.children && node.children.length > 0) {
        for (var j = 0; j < node.children.length; j++) {
          let tmpNodeChild = await nodeToHaxElement(node.children[j], null);
          tmpNodeChild.parent = tmpNode.tag;
          tmpNodeChild.node = node.children[j];
          // ignore certain tags we don't need a deep selection of
          if (
            ![
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
    this.calcStats(list);
    let elements = [];
    for (var i = 0; i < list.length; i++) {
      let def = HAXStore.haxSchemaFromTag(list[i].tag);
      if (def.gizmo) {
        elements.push({
          node: list[i].node,
          tag: list[i].tag,
          parent: list[i].parent,
          icon: def.gizmo.icon,
          name: def.gizmo.title,
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
  /**
   * Calculate statistics from the array of hax elements
   */
  calcStats(elements) {
    if (elements && HAXStore.activeHaxBody.innerText) {
      let counts = {
        c: HAXStore.activeHaxBody.innerText.length,
        w: parseInt(HAXStore.activeHaxBody.innerText.split(/\s+/g).length - 1),
        h: 0,
        b: 0,
        p: 0,
        e: 0,
      };
      elements.forEach((el) => {
        switch (el.tag) {
          case "blockquote":
          case "div":
          case "span":
          case "p":
          case "ul":
          case "ol":
          case "strong":
          case "em":
            counts.p++;
            break;
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            counts.h++;
            break;
          default:
            counts.e++;
            break;
        }
      });
      for (var i in counts) {
        this[`${i}Count`] = counts[i];
      }
    }
  }
  render() {
    return html`${this.hidden
      ? ``
      : html` <h5>${this.t.contentStatistics}</h5>
          <div class="stats">
            <div class="stat">
              <span>${this.wCount}</span>
              <span>${this.t.words}</span>
            </div>
            <div class="stat">
              <span>${this.pCount}</span>
              <span>${this.t.paragraphs}</span>
            </div>
            <div class="stat">
              <span>${this.cCount}</span>
              <span>${this.t.characters}</span>
            </div>
            <div class="stat">
              <span>${this.hCount}</span>
              <span>${this.t.headings}</span>
            </div>
            <div class="stat">
              <span>${this.eCount}</span>
              <span>${this.t.widgets}</span>
            </div>
          </div>
          <h5>${this.t.listView}</h5>
          <ul>
            ${this.indentedElements(this.elementList).map((element, index) => {
              return html`
                <li
                  class="${element.parent
                    ? `parent-${element.parent}`
                    : "no-parent"} ${[
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    element.tag,
                  ].includes(element.parent)
                    ? ""
                    : "is-child"}"
                >
                  <hax-toolbar-item
                    align-horizontal="left"
                    @click="${(e) => this.goToItem(index)}"
                    @dblclick="${(e) => this.editItem(index)}"
                    data-index="${index}"
                    ?data-active-item="${element.node === this.activeNode}"
                    icon="${element.icon}"
                    label="${element.name}"
                    show-text-label
                  >
                  </hax-toolbar-item>
                  ${element.tag != "page-break"
                    ? html`
                        <simple-icon-button-lite
                          icon="${this.isLocked(index)
                            ? "icons:lock"
                            : "icons:lock-open"}"
                          @click="${(e) => this.itemOp(index, "lock")}"
                          title="Lock / Unlock"
                        ></simple-icon-button-lite>
                        <simple-icon-button-lite
                          icon="hax:keyboard-arrow-up"
                          @click="${(e) => this.itemOp(index, "up")}"
                          title="Move up"
                          ?disabled="${this.isLocked(index)}"
                        ></simple-icon-button-lite>
                        <simple-icon-button-lite
                          icon="hax:keyboard-arrow-down"
                          @click="${(e) => this.itemOp(index, "down")}"
                          title="Move down"
                          ?disabled="${this.isLocked(index)}"
                        ></simple-icon-button-lite>
                        <simple-icon-button-lite
                          class="del"
                          icon="delete"
                          @click="${(e) => this.itemOp(index, "delete")}"
                          title="Delete"
                          ?disabled="${this.isLocked(index)}"
                        ></simple-icon-button-lite>
                      `
                    : ``}
                </li>
              `;
            })}
          </ul>`} `;
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
      }
      setTimeout(() => {
        this.requestUpdate();
      }, 0);
    }
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
        });
      }
      setTimeout(() => {
        activeChild.classList.remove("blinkfocus");
      }, 500);
    }
  }
  scrollInMap() {
    var target = normalizeEventPath(e)[0];
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
      elementList: {
        type: Array,
      },
      cCount: {
        type: String,
      },
      wCount: {
        type: String,
      },
      bCount: {
        type: String,
      },
      hCount: {
        type: String,
      },
      pCount: {
        type: String,
      },
      eCount: {
        type: String,
      },
      activeNode: {
        type: Object,
      },
    };
  }
}
customElements.define(HaxMap.tag, HaxMap);
export { HaxMap };
