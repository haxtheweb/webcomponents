/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { remoteLinkBehavior } from "@haxtheweb/utils/lib/remoteLinkBehavior.js";
import { activeStateBehavior } from "@haxtheweb/utils/lib/activeStateBehavior.js";
import { DDD, DDDPulseEffectSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
/**
 * `simple-cta`
 * `Simple call to action button`
 * @demo demo/index.html
 * @element simple-cta
 */
class SimpleCta extends DDDPulseEffectSuper(
  activeStateBehavior(remoteLinkBehavior(DDD)),
) {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        /* With data-primary & data-accent applied, abstract to just
        * hidden (display: none)
        * transparent (no background) 
        * light (invert primary & accent)
        * hotline (uppercase, italic)
        */

        :host {
          display: inline-block;
          width: fit-content;
          height: fit-content;
          margin: var(--ddd-spacing-4) 0 0;
          border-radius: var(--ddd-radius-xs);
          --component-color: var(
            --lowContrast-override,
            var(
              --ddd-theme-accent,
              var(--ddd-theme-bgContrast, var(--ddd-theme-default-white))
            )
          );
          --component-background-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-link)
          );
          --component-border-color: var(--component-color);
        }

        :host(:not([saturate]):hover),
        :host(:not([saturate]):focus-within),
        :host(:not([saturate]):active) {
          --component-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-link)
          );
          --component-border-color: var(--component-color);
          --component-background-color: var(
            --lowContrast-override,
            var(--ddd-theme-accent, var(--ddd-theme-bgContrast, white))
          );
        }

        :host([hidden]) {
          display: none;
        }

        :host([light]) {
          --component-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-link)
          );
          --component-border-color: var(--component-color);
          --component-background-color: var(
            --lowContrast-override,
            var(
              --ddd-theme-accent,
              var(--ddd-theme-bgContrast, var(--ddd-theme-default-white))
            )
          );
        }
        :host([light]:focus-within),
        :host([light]) a:hover,
        :host([light]) a:active {
          --component-color: var(
            --lowContrast-override,
            var(--ddd-theme-accent, var(--ddd-theme-bgContrast, white))
          );
          --component-border-color: var(--component-color);
          --component-background-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-link)
          );
        }

        :host([hotline]) .btn {
          text-transform: uppercase;
          font-style: italic;
          font-weight: var(--ddd-font-weight-black);
        }

        a,
        a:any-link,
        a:link,
        a:visited {
          display: block;
          text-decoration: none;
          box-sizing: border-box;
        }

        :host(:focus-within),
        a:hover,
        a:active {
          text-decoration: none;
        }

        .btn {
          justify-content: center;
          align-items: center;
          cursor: pointer;
          display: flex;
          text-decoration: none;
          height: fit-content;
          width: max-content;
          border-radius: var(--ddd-radius-xs);
          color: var(--component-color, var(--ddd-theme-default-link));
          border: var(--ddd-border-sm);
          border-color: var(
            --component-border-color,
            var(--ddd-theme-default-link)
          );
          padding: var(
            --simple-cta-button-padding,
            0.75rem 0.75rem 0.75rem 1.5rem
          );
          transition: all 0.3s ease-in-out;
          transition-delay: 0.1s;
          background-color: var(--component-background-color, transparent);
          font-weight: var(--ddd-font-weight-black);
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

        label {
          font-weight: var(--ddd-font-weight-black);
        }

        :host([saturate]:hover) .btn,
        :host([saturate]:focus-within) .btn,
        :host([saturate]:active) .btn {
          filter: saturate(200%);
        }

        :host([data-primary="19"][data-accent="11"]) .btn,
        :host([data-primary="11"][data-accent="11"]) .btn {
          --ddd-theme-accent: black;
        }
      `,
    ];
  }

  // Template return function
  render() {
    return html` <a
      href="${this.link ? this.link : "#"}"
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
      light: {
        type: Boolean,
        reflect: true,
      },
      hotline: {
        type: Boolean,
        reflect: true,
      },
      saturate: {
        type: Boolean,
        reflect: true,
      },
      disabled: {
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
    this.hotline = null;
    this.large = null;
    this.light = null;
    this.disabled = false;
    this.saturate = null;
    // progressive enhancement support
    if (this.querySelector && this.querySelector("a")) {
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
