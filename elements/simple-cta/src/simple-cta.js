/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { remoteLinkBehavior } from "@lrnwebcomponents/utils/lib/remoteLinkBehavior.js";
import { activeStateBehavior } from "@lrnwebcomponents/utils/lib/activeStateBehavior.js";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
/**
 * `simple-cta`
 * `Simple call to action button`
 * @demo demo/index.html
 * @element simple-cta
 */
class SimpleCta extends activeStateBehavior(remoteLinkBehavior(DDD)) {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          width: fit-content;
          height: fit-content;
          margin: var(--ddd-spacing-4) 0 0;
          border-radius: var(--ddd-radius-xs);
          --component-color: var(--ddd-theme-default-link);
          --component-background-color: transparent;
          --component-border-color: var(--ddd-theme-default-link);
        }

        :host([hidden]) {
          display: none;
        }

        :host([filled]) {
          --component-color: var(--ddd-theme-default-white);
          --component-background-color: var(--ddd-theme-default-link);
        }
        :host([filled]:focus-within),
        :host([filled]) a:hover,
        :host([filled]) a:active {
          --component-background-color: var(--ddd-theme-default-nittanyNavy);
          --component-border-color: var(--component-background-color);
        }

        :host([light]) {
          --component-color: var(--ddd-theme-default-linkLight);
          --component-background-color: transparent;
          --component-border-color: var(--ddd-theme-default-linkLight);
        }
        :host([light]:focus-within),
        :host([light]) a:hover,
        :host([light]) a:active {
          --component-background-color: var(--ddd-theme-default-linkLight);
          --component-color: var(--ddd-theme-default-nittanyNavy);
          --component-border-color: var(--component-background-color);
        }

        :host([light][filled]) {
          --component-color: var(--ddd-theme-default-nittanyNavy);
          --component-background-color: var(--ddd-theme-default-linkLight);
        }
        :host([light][filled]:focus-within),
        :host([light][filled]) a:hover,
        :host([light][filled]) a:active {
          --component-background-color: var(--ddd-theme-default-white);
          --component-border-color: var(--component-background-color);
        }

        :host([white]) {
          --component-color: var(--ddd-theme-default-white);
          --component-background-color: transparent;
          --component-border-color: var(--component-color);
        }
        :host([white]:focus-within),
        :host([white]) a:hover,
        :host([white]) a:active {
          --component-background-color: var(--ddd-theme-default-white);
          --component-color: var(--ddd-theme-default-potentialMidnight);
        }

        :host([white][filled]) {
          --component-color: var(--ddd-theme-default-potentialMidnight);
          --component-background-color: var(--ddd-theme-default-white);
          --component-border-color: var(--ddd-theme-default-potentialMidnight);
        }
        :host([white][filled]:focus-within),
        :host([white][filled]) a:hover,
        :host([white][filled]) a:active {
          --component-background-color: var(--ddd-theme-default-linkLight);
          --component-border-color: var(--ddd-theme-default-potentialMidnight);
        }

        :host([hotline]) .btn {
          text-transform: uppercase;
          font-style: italic;
          font-weight: var(--ddd-font-primary-black);
        }

        a {
          display: block;
          text-decoration: none;
          box-sizing: border-box;
        }
        :host(:focus-within),
        a:hover,
        a:active {
          text-decoration: none;
          --component-background-color: var(--ddd-theme-default-link);
          --component-color: var(--ddd-theme-default-white);
        }

        .btn {
          justify-content: center;
          align-items: center;
          cursor: pointer;
          display: flex;
          text-decoration: none;
          height: fit-content;
          width: fit-content;
          border-radius: var(--ddd-radius-xs);
          color: var(--component-color, var(--ddd-theme-default-link));
          border: var(--ddd-border-sm);
          border-color: var(
            --component-border-color,
            var(--ddd-theme-default-link)
          );
          padding: 0.75rem 0.75rem 0.75rem 1.5rem;
          transition: all 0.2s ease-out;
          background-color: var(--component-background-color, transparent);
          font-weight: var(--ddd-font-primary-medium);
        }

        .hideIcon {
          padding: 0.75rem 1.5rem;
        }

        .large {
          padding: 1rem 2.75rem 1rem 3.25rem;
        }
        .large.hideIcon {
          padding: 1rem 3.25rem;
        }

        .icon {
          display: inline-flex;
          --simple-icon-width: var(--simple-cta-font-size, var(--ddd-icon-3xs));
          --simple-icon-height: var(
            --simple-cta-font-size,
            var(--ddd-icon-3xs)
          );
        }
      `,
    ];
  }

  // Template return function
  render() {
    return html` <a
      href="${this.link}"
      role="button"
      part="simple-cta-link"
      @click="${this._clickCard}"
    >
      <span
        class="btn ${this.large ? "large" : ""} ${this.hideIcon
          ? "hideIcon"
          : ""} "
        ><span class="label">${this.label}</span><slot></slot>${!this.hideIcon
          ? html`<simple-icon-lite
              class="icon"
              icon="${this.icon}"
            ></simple-icon-lite>`
          : ``}</span
      >
    </a>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      type: "element",
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Call to action",
        description: "A simple button with a link to take action.",
        icon: "image:crop-16-9",
        color: "orange",
        tags: ["Layout", "marketing", "button", "link", "url", "design", "cta"],
        handles: [
          {
            type: "link",
            source: "link",
            title: "label",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "label",
            title: "Label",
            description: "Link label",
            inputMethod: "textfield",
            required: true,
          },
          {
            property: "link",
            title: "Link",
            description: "Enter a link to any resource",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            noCamera: true,
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
          },
          {
            property: "hideIcon",
            title: "Hide icon",
            description: "Hide the icon used to accent text",
            inputMethod: "boolean",
          },
        ],
        advanced: [
          {
            property: "icon",
            title: "Icon",
            description: "Action link icon",
            inputMethod: "iconpicker",
          },
        ],
      },
      saveOptions: {
        unsetAttributes: ["colors", "element-visible"],
      },
      demoSchema: [
        {
          tag: "simple-cta",
          properties: {
            label: "Click to learn more",
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
      label: {
        type: String,
      },
      icon: {
        type: String,
      },
      editMode: {
        type: Boolean,
      },
      hideIcon: {
        type: Boolean,
        attribute: "hide-icon",
      },
      large: {
        type: Boolean,
        reflect: true,
      },
      filled: {
        type: Boolean,
        reflect: true,
      },
      light: {
        type: Boolean,
        reflect: true,
      },
      hotline: {
        type: Boolean,
        reflect: true,
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
    this.link = null;
    this.icon = "icons:chevron-right";
    this.hideIcon = false;
    this.label = null;
    this.color = "primary";
    this.outlined = null;
    this.hotline = null;
    this.large = null;
    // progressive enhancement support
    if (this.querySelector("a")) {
      this.link = this.querySelector("a").getAttribute("href");
      this.label = this.querySelector("a").innerText;
      this.innerHTML = null;
    }
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this.editMode = val;
  }
  /**
   * special support for HAX since the whole card is selectable
   */
  _clickCard(e) {
    if (this.editMode) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    // flag for HAX to not trigger active on changes
    this.editMode = val;
    return false;
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
    });
  }
}
customElements.define(SimpleCta.tag, SimpleCta);
export { SimpleCta };
