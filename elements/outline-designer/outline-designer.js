/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

import { LitElement, css, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXStore } from "@lrnwebcomponents/hax-body/lib/hax-store.js";
import { HaxTrayDetailHeadings } from "@lrnwebcomponents/hax-body/lib/hax-ui-styles.js";
import { toJS } from "mobx";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";

/**
  * `outline-designer`
  * @element outline-designer
  * `tools to modify and visualize JSON Outline Schema for editing`
  * @demo demo/index.html
  */
export class OutlineDesigner extends I18NMixin(LitElement) {
  static get styles() {
    return [
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
        ul li {
          margin: 0;
          padding: 0;
        }
        li hax-toolbar-item {
          display: inline-flex;
          width: 50%;
          max-width: 60%;
        }
        li simple-icon-button {
          display: inline-flex;
          opacity: 0;
          visibility: hidden;
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          height: 38px;
          float: right;
        }
        li simple-icon-button:hover {
          background-color: #f5f5f5;
        }
        li simple-icon-button.del {
          margin-left: 8px;
        }
        li:hover simple-icon-button {
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

        li hax-toolbar-item::part(button),
        li.parent-h2 hax-toolbar-item[icon="hax:h2"]::part(button) {
          margin-left: 0px;
          cursor: pointer;
        }
        li.parent-h2 hax-toolbar-item::part(button),
        li.parent-h2 + li.is-child hax-toolbar-item::part(button),
        li.parent-h2 + li.is-child ~ li.is-child hax-toolbar-item::part(button),
        li.parent-h3 hax-toolbar-item[icon="hax:h3"]::part(button) {
          margin-left: 8px;
        }
        li.parent-h3 hax-toolbar-item::part(button),
        li.parent-h3 + li.is-child hax-toolbar-item::part(button),
        li.parent-h3 + li.is-child ~ li.is-child hax-toolbar-item::part(button),
        li.parent-h4 hax-toolbar-item[icon="hax:h4"]::part(button) {
          margin-left: 8px;
        }
        li.parent-h4 hax-toolbar-item::part(button),
        li.parent-h4 + li.is-child hax-toolbar-item::part(button),
        li.parent-h4 + li.is-child ~ li.is-child hax-toolbar-item::part(button),
        li.parent-h5 hax-toolbar-item[icon="hax:h5"]::part(button) {
          margin-left: 12px;
        }
        li.parent-h5 hax-toolbar-item::part(button),
        li.parent-h5 + li.is-child hax-toolbar-item::part(button),
        li.parent-h5 + li.is-child ~ li.is-child hax-toolbar-item::part(button),
        li.parent-h6 hax-toolbar-item[icon="hax:h6"]::part(button),
        li.parent-h6 hax-toolbar-item::part(button),
        li.parent-h6 + li.is-child hax-toolbar-item::part(button),
        li.parent-h6
          + li.is-child
          ~ li.is-child
          hax-toolbar-item::part(button) {
          margin-left: 12px;
        }
      .item {
        border: 1px solid grey;
        margin: 0;
        padding: 8px;
      }
      ul {
        list-style: none;
      }
      .item .label {
        font-size: 14px;
        font-weight: bold;
      }
      .indent-1 {
        padding-left: 0px;
      }
      .indent-2 {
        padding-left: 16px;
      }
      .indent-3,
      .indent-4,
      .indent-5,
      .indent-6 {
        padding-left: 32px;
      }
    `];
  }
  constructor() {
    super();
    this.items = [];
    this.eventData = {};
    this.t = {
      selectParent: "Select target",
      importContentUnderThisPage: "Import content under this page",
      importThisContent: "Import this content",
      thisPage: "this page",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    // so we can prepopulate the parent options menu
    this.activeId = toJS(store.activeId);
    this.addEventListener('click', (e) => {
      // clean up if something is active
      if (this.activePreview) {
        this.shadowRoot.querySelectorAll('simple-popover').forEach((item) => item.setAttribute('hidden','hidden'));
        this.activePreview = false;
      }
    })
  }
  // selectable list of items in the current HAXcms site
  getSiteItems() {
    // default to null parent as the whole site
    var items = [
      {
        text: this.t.selectParent,
        value: null,
      },
    ];
    const rawItemList = store.getManifestItems(true);
    rawItemList.forEach((el) => {
      if (el.id != this.itemId) {
        // calculate -- depth so it looks like a tree
        let itemBuilder = el;
        // walk back through parent tree
        let distance = "- ";
        while (itemBuilder && itemBuilder.parent != null) {
          itemBuilder = rawItemList.find((i) => i.id == itemBuilder.parent);
          // double check structure is sound
          if (itemBuilder) {
            distance = "--" + distance;
          }
        }
        items.push({
          text: distance + el.title,
          value: el.id,
        });
      }
    });
    return items;
  }
  // render function
  render() {
    return html`
    <label for="targetselector">${this.t.importThisContent}</label>
    <simple-fields-field id="targetselector" type="select" value="children" .itemsList="${[
      {
        text: "as children of",
        value: "children",
      },
      {
        text: "Above",
        value: "above",
      },
      {
        text: "Below",
        value: "below",
      },
    ]}"></simple-fields-field>
    ${this.t.thisPage}:
    <simple-fields-field id="itemselector" type="select" value="${this.activeId}" .itemsList="${this.getSiteItems()}"></simple-fields-field>
    <label for="itemselector">${this.t.importContentUnderThisPage}</label>
    <ul>
      ${this.items.map((item) => this.renderItem(item))}
    </ul>`;
  }

  toggleContent(e) {
    this.activePreview = e.target;
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.shadowRoot.querySelectorAll('simple-popover').forEach((item) => item.setAttribute('hidden','hidden'));
    this.shadowRoot.querySelector(`[for="${e.target.id}"]`).removeAttribute('hidden');
  }

  renderItem(item) {
    return html`
    <li class="item indent-${item.indent}">
      <simple-icon-button-lite @click="${this.toggleContent}" id="od-item-${item.id}" icon="editor:insert-drive-file"></simple-icon-button-lite><span class="label">${item.title}</span>
      <simple-popover for="od-item-${item.id}" hidden
            fit-to-visible-bounds
            auto>${unsafeHTML(item.contents)}</simple-popover>
    </li>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      eventData: { type: Object },
      items: { type: Array },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "outline-designer";
  }

  /**
   * Return all data associated with the current tree
   * @note this makes more sense when we allow manipulation via this object and its options
   */
  async getData() {
    const parentId = this.shadowRoot.querySelector("#itemselector").value;
    const targetSelector = this.shadowRoot.querySelector("#targetselector").value;
    let eventData = this.eventData;
    eventData.items = [...this.items];
    let count = 0;
    await eventData.items.map(async (item, index) => {
      if (parentId && item.parent == null) {
        // helps in supporting multiple imports at a time
        count++;
        let parentItem = await store.findItemAsObject(parentId);
        switch (targetSelector) {
          case 'below':
            eventData.items[index].parent = parentItem.parent;
            eventData.items[index].order = parseInt(parentItem.order) + count;  
          break;
          case 'above':
            eventData.items[index].parent = parentItem.parent;
            // @todo this is currently the reverse order desired if
            // multiple top level children existed on the import
            eventData.items[index].order = parseInt(parentItem.order) - count;
          break;
          case 'children':
            eventData.items[index].parent = parentId;
          break;
        }
      }
    })
    return eventData;
  }
  // @todo this needs to get worked into the renderer somehow
  // w/ sub-content
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
  
  __render() {
    return html`
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
                data-index="${index}"
                icon="${element.icon}"
                label="${element.name}"
                show-text-label
              >
              </hax-toolbar-item>
              ${element.tag != "page-break"
                ? html`
                    <simple-icon-button
                      class="del"
                      icon="delete"
                      @click="${(e) => this.itemOp(index, "delete")}"
                      title="Delete"
                      ?disabled="${this.isLocked(index)}"
                    ></simple-icon-button>
                    <simple-icon-button
                      icon="hax:keyboard-arrow-up"
                      @click="${(e) => this.itemOp(index, "up")}"
                      title="Move up"
                      ?disabled="${this.isLocked(index)}"
                    ></simple-icon-button>
                    <simple-icon-button
                      icon="hax:keyboard-arrow-down"
                      @click="${(e) => this.itemOp(index, "down")}"
                      title="Move down"
                      ?disabled="${this.isLocked(index)}"
                    ></simple-icon-button>
                    ${HAXStore.isTextElement(element.node) ||
                    element.tag == "grid-plate"
                      ? html``
                      : html`
                          <simple-icon-button
                            icon="image:transform"
                            @click="${(e) => this.itemOp(index, "transform")}"
                            title="Change to.."
                          ></simple-icon-button>
                        `}
                    <simple-icon-button
                      icon="${this.isLocked(index)
                        ? "icons:lock"
                        : "icons:lock-open"}"
                      @click="${(e) => this.itemOp(index, "lock")}"
                      title="Lock / Unlock"
                    ></simple-icon-button>
                  `
                : ``}
            </li>
          `;
        })}
      </ul>
    `;
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
          case "transform":
            this.dispatchEvent(
              new CustomEvent("hax-context-item-selected", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  target: node,
                  eventName: "hax-transform-node",
                  value: true,
                },
              })
            );
            break;
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
}
customElements.define(OutlineDesigner.tag, OutlineDesigner);