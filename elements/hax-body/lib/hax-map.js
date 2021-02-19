import { html, css, LitElement } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import { HAXStore } from "@lrnwebcomponents/hax-body/lib/hax-store.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";
import { HaxTrayDetailHeadings } from "@lrnwebcomponents/hax-body/lib/hax-ui-styles.js";

/**
 * `hax-map`
 * @element hax-map
 * `Export dialog with all export options and settings provided.`
 */
class HaxMap extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
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
        table {
          font-size: var(--hax-tray-font-size-sm);
          border-collapse: collapse;
          width: 100%;
        }
        table,
        th,
        td {
          text-align: center;
          border: 1px solid var(--hax-tray-border-color);
        }
        th {
          font-weight: normal;
        }
        td {
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
        }
        li > hax-toolbar-item {
          width: 100%;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.elementList = [];
    this.title = "Content map";
  }
  updateHAXMap() {
    let list = HAXStore.htmlToHaxElements(
      HAXStore.activeHaxBody.haxToContent()
    );
    this.calcStats(list);
    let elements = [];
    for (var i = 0; i < list.length; i++) {
      let def = HAXStore.haxSchemaFromTag(list[i].tag);
      if (def.gizmo) {
        elements.push({
          icon: def.gizmo.icon,
          name: def.gizmo.title,
        });
      } else {
        if (list[i].tag && list[i].tag.includes("-")) {
          elements.push({
            icon: "hax:templates",
            name: "Widget",
          });
        } else {
          elements.push({
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
        p: 0,
        e: 0,
      };
      elements.forEach((el) => {
        switch (el.tag) {
          case "blockquote":
          case "div":
          case "span":
          case "p":
            counts.p++;
            break;
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
          case "relative-heading": // special support for our own heading tag
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
    return html`
      <div class="container">
        <table>
          <caption>
            Content Statistics
          </caption>
          <thead>
            <tr>
              <th scope="col">Words</th>
              <th scope="col">Headings</th>
              <th scope="col">Paragraphs</th>
              <th scope="col">Widgets</th>
              <th scope="col">Characters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${this.wCount}</td>
              <td>${this.hCount}</td>
              <td>${this.pCount}</td>
              <td>${this.eCount}</td>
              <td>${this.cCount}</td>
            </tr>
          </tbody>
        </table>
        <h5>List View</h5>
        <ul>
          ${this.elementList.map((element, index) => {
            return html`
              <li>
                <hax-toolbar-item
                  align-horizontal="left"
                  @click="${(e) => this.goToItem(index)}"
                  data-index="${index}"
                  icon="${element.icon}"
                  label="${element.name}"
                  show-text-label
                >
                </hax-toolbar-item>
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }
  goToItem(index) {
    if (index) {
      let activeChild = HAXStore.activeHaxBody.children[parseInt(index)];
      activeChild.classList.add("blinkfocus");
      if (typeof activeChild.scrollIntoViewIfNeeded === "function") {
        activeChild.scrollIntoViewIfNeeded(true);
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
      /**
       * Title when open.
       */
      title: {
        type: String,
      },
      opened: {
        type: Boolean,
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
      hCount: {
        type: String,
      },
      pCount: {
        type: String,
      },
      eCount: {
        type: String,
      },
    };
  }
}
window.customElements.define(HaxMap.tag, HaxMap);
export { HaxMap };
