import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-icon/iron-icon.js";
import { HAXStore } from "@lrnwebcomponents/hax-body/lib/hax-store.js";

/**
 * `hax-map`
 * @element hax-map
 * `Export dialog with all export options and settings provided.`
 */
class HaxMap extends SimpleColors {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
        .title {
          position: relative;
          padding: 16px;
          outline: 0;
          font-weight: 600;
          text-align: left;
          margin: 0;
          background-color: var(--hax-color-menu-heading-bg, #eeeeee);
          color: var(--hax-color-menu-heading-color, black);
          font-size: 18px;
          line-height: 18px;
          font-family: "Noto Serif", serif;
        }
        .container {
          text-align: left;
          padding: 16px;
          min-width: 300px;
          overflow-y: scroll;
          max-height: 50vh;
        }
        table {
          font-size: 13px;
        }
        table caption {
          font-weight: bold;
        }
        table tr th {
          padding: 2px;
        }
        table td {
          font-size: 21px;
          font-weight: bold;
          text-align: center;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul li {
          margin: 4px;
          padding: 0;
        }
        ul iron-icon {
          padding: 0 8px;
        }
        a {
          font-size: 24px;
          line-height: 24px;
          text-decoration: none;
          color: black;
          padding: 4px;
          display: block;
        }
        a:focus,
        a:hover,
        a:active {
          cursor: pointer;
          font-weight: bold;
          outline: 2px solid black;
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
      <h3 class="title">
        <iron-icon icon="maps:map"></iron-icon> ${this.title}
      </h3>
      <div class="container">
        <table>
          <caption>
            Content statistics
          </caption>
          <tr>
            <th>Words</th>
            <th>Headings</th>
            <th>Paragraphs</th>
            <th>Widgets</th>
            <th>Characters</th>
          </tr>
          <tr>
            <td>${this.wCount}</td>
            <td>${this.hCount}</td>
            <td>${this.pCount}</td>
            <td>${this.eCount}</td>
            <td>${this.cCount}</td>
          </tr>
        </table>
        <h4>List view</h4>
        <ul>
          ${this.elementList.map((element, index) => {
            return html`
              <li>
                <a @click="${this.scrollInMap}" data-index="${index}"
                  ><iron-icon
                    data-index="${index}"
                    icon="${element.icon}"
                  ></iron-icon
                  >${element.name}</a
                >
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }
  scrollInMap(e) {
    var target = null;
    if (e.path && e.path[0]) {
      target = e.path[0];
    } else if (e.originalTarget) {
      target = e.originalTarget;
    } else {
      target = e.target;
    }
    if (target.getAttribute("data-index")) {
      let activeChild =
        HAXStore.activeHaxBody.children[
          parseInt(target.getAttribute("data-index"))
        ];
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
