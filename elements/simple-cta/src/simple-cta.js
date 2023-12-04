/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { remoteLinkBehavior } from "@lrnwebcomponents/utils/lib/remoteLinkBehavior.js";
import { activeStateBehavior } from "@lrnwebcomponents/utils/lib/activeStateBehavior.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
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
          margin: 24px 16px 0 0;
          margin-top: 20px;
          --simple-cta-color: var(--simple-colors-default-theme-accent-1);
          --simple-cta-outline: var(--simple-colors-default-theme-grey-12);
          --simple-cta-bg-color-is-user-selected: var(
            --simple-colors-default-theme-accent-3
          );
          --simple-cta-color-is-user-selected: var(
            --simple-colors-default-theme-accent-12
          );
          --simple-cta-bg-color: var(--simple-colors-default-theme-accent-8);
        }

        :host([hidden]) {
          display: none;
        }

        :host([is-user-selected]) .btn {
          background-color: var(--simple-cta-bg-color-is-user-selected);
          color: var(--simple-cta-color-is-user-selected);
        }

        :host([is-user-selected]) a {
          outline: 2px solid var(--simple-cta-outline);
        }

        a {
          display: block;
          text-decoration: none;
        }

        .btn {
          display: block;
          border-width: 2px;
          border-color: var(--simple-cta-bg-color);
          border-radius: 0px;
          font-size: var(--simple-cta-font-size, 21px);
          line-height: var(--simple-cta-line-height, 36px);
          background-color: var(--simple-cta-bg-color);
          padding: 10px 50px 10px 30px;
          text-transform: uppercase;
          color: var(--simple-cta-color);
          font-family: "Roboto", Helvetica, Arial, Lucida, sans-serif;
          font-style: italic;
          font-weight: 700;
          transition: color 300ms ease 0ms, background-color 300ms ease 0ms,
            border 300ms ease 0ms;
        }

        .icon {
          display: inline-flex;
          margin-left: 10px;
          line-height: var(--simple-cta-line-height, 36px);
          --simple-icon-width: var(--simple-cta-font-size, 36px);
          --simple-icon-height: var(--simple-cta-font-size, 36px);
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
      <span class="btn"
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
    this.accentColor = "grey";
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
