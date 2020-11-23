/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { remoteLinkBehavior } from "@lrnwebcomponents/utils/lib/remoteLinkBehavior.js";
import { activeStateBehavior } from "@lrnwebcomponents/utils/lib/activeStateBehavior.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `simple-cta`
 * `Simple call to action button`
 * @demo demo/index.html
 * @element simple-cta
 */
class SimpleCta extends activeStateBehavior(remoteLinkBehavior(SimpleColors)) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-block;
          --simple-cta-color: var(
            --simple-colors-default-theme-accent-1,
            white
          );
          --simple-cta-outline: var(
            --simple-colors-default-theme-accent-12,
            black
          );
          --simple-cta-bg-color-is-user-selected: var(
            --simple-colors-default-theme-accent-10,
            darkgreen
          );
          --simple-cta-bg-color: var(
            --simple-colors-default-theme-accent-7,
            green
          );
          margin: 60px 0 0;
        }

        :host([hidden]) {
          display: none;
        }

        :host([contenteditable]) a {
          pointer-events: none;
        }

        :host([is-user-selected]) a {
          background-color: var(--simple-cta-bg-color-is-user-selected);
          outline: 1px solid var(--simple-cta-outline);
        }

        a {
          display: block;
          color: var(--simple-cta-color);
          background-color: var(--simple-cta-bg-color);
          transition: background 0.3s linear, border 0.3s linear,
            border-radius 0.3s linear, box-shadow 0.3s linear;
          text-decoration: none;
          font-size: 1em;
          text-transform: uppercase;
          border-radius: 100px 100px 100px 100px;
          box-shadow: 0 6px 26px 0 rgba(0, 0, 0, 0.16);
          padding: 16px 40px;
          font-family: Sans-serif;
          font-weight: 500;
        }

        a span {
          display: flex;
          justify-content: center;
        }
      `,
    ];
  }

  // Template return function
  render() {
    return html` <a href="${this.link}" role="button" part="simple-cta-link">
      <span><slot>${this.title}</slot></span>
    </a>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Call to action",
        description: "A simple button with a link to take action.",
        icon: "image:crop-16-9",
        color: "orange",
        groups: ["Marketing", "Content"],
        handles: [
          {
            type: "link",
            source: "link",
            title: "title",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Enter title for stop-note.",
            inputMethod: "textfield",
            required: true,
          },
          {
            property: "link",
            title: "Link",
            description: "Enter a link to any resource",
            inputMethod: "haxupload",
            required: true,
          },
          {
            property: "accentColor",
            title: "Accent Color",
            description: "An optional accent color.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill",
          },
          {
            property: "dark",
            title: "Dark Theme",
            description: "Enable Dark Theme",
            inputMethod: "boolean",
            icon: "icons:invert-colors",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "simple-cta",
          properties: {
            title: "Click to learn more",
            link: "https://haxtheweb.org/",
          },
          content: "",
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      link: {
        type: String,
      },
      title: {
        type: String,
      },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "simple-cta";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.link = "#";
    this.title = null;
    this.accentColor = "green";
    if (this.querySelector("a")) {
      this.link = this.querySelector("a").getAttribute("href");
      this.title = this.querySelector("a").innerText;
      this.innerHTML = null;
    }
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.remoteLinkTarget = this.shadowRoot.querySelector("a");
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "link") {
        this.remoteLinkURL = this[propName];
      }
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
}
customElements.define(SimpleCta.tag, SimpleCta);
export { SimpleCta };
