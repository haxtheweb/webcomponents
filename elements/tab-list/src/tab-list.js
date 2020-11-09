import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "@lrnwebcomponents/a11y-tabs/lib/a11y-tab.js";
/**
 * `tab-list`
 * @element tab-list
 * `A simple listing of tabed links / items`
 * @demo demo/index.html
 */
class TabList extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 0 auto;
          list-style: none;
          display: block;
          padding: 16px;
          border-bottom: 1px solid black;
        }
        a11y-tabs {
          align-items: center;
          justify-items: center;
        }
        a11y-tab a {
          text-decoration: none;
          flex: unset;
          height: unset;
          width: 100%;
          text-align: center;
        }
        button {
          text-transform: unset;
          width: 100%;
          display: block;
          min-width: unset;
          margin: 0;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        @media screen and (max-width: 600px) {
          a11y-tab {
            display: block;
          }
        }
      `,
    ];
  }
  constructor() {
    super();
    this.tabs = [];
  }
  render() {
    return html`
      <a11y-tabs>
        ${this.tabs.map(
          (tab) => html`
            <a11y-tab label="${tab.label}">
              <a
                target="_blank"
                href="${tab.link}"
                tabindex="-1"
                rel="noopener noreferrer"
              >
                <button raised>${tab.label}</button>
              </a>
            </a11y-tab>
          `
        )}
      </a11y-tabs>
    `;
  }
  static get tag() {
    return "tab-list";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "tabs") {
        // fire an event that this is a core piece of the system
        this.dispatchEvent(
          new CustomEvent("tabs-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this[propName],
          })
        );
      }
    });
  }
  static get properties() {
    return {
      /**
       * List of tabs
       */
      tabs: {
        type: Array,
      },
    };
  }
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Tabs",
        description: "A list of links as tabs.",
        icon: "icons:tab",
        color: "grey",
        groups: ["Presentation", "Links"],
        handles: [],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "tabs",
            title: "Tabs",
            description: "Listing of tabs",
            inputMethod: "array",
            itemLabel: "label",
            properties: [
              {
                property: "link",
                title: "Link",
                description: "link to go to",
                inputMethod: "textfield",
                required: true,
              },
              {
                property: "label",
                title: "Label",
                description: "text to place on the tab",
                inputMethod: "textfield",
                required: true,
              },
            ],
          },
        ],
        advanced: [],
      },
    };
  }
}
window.customElements.define(TabList.tag, TabList);
export { TabList };
