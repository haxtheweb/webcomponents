/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { remoteLinkBehavior } from "@haxtheweb/utils/lib/remoteLinkBehavior.js";
import { activeStateBehavior } from "@haxtheweb/utils/lib/activeStateBehavior.js";
import { DDD, DDDPulseEffectSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDVocabulary } from "@haxtheweb/d-d-d/lib/DDDVocabulary.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
/**
 * `simple-cta`
 * `Simple call to action button`
 * @demo demo/index.html
 * @element simple-cta
 */
class SimpleCta extends DDDVocabulary(
  DDDPulseEffectSuper(activeStateBehavior(remoteLinkBehavior(DDD))),
) {
  /**
   * Shared DDD vocabulary: the existing light and large attributes keep
   * working and read as appearance="outlined" and size="l".
   */
  static get dddVocabulary() {
    return {
      appearance: {
        from: "light",
        values: { true: "outlined" },
        default: "filled",
      },
      size: { from: "large", values: { true: "l" }, default: "m" },
    };
  }
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
          margin: var(--ddd-stack-gap, var(--ddd-spacing-4)) 0 0;
          border-radius: var(--ddd-control-radius, var(--ddd-radius-xs));
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

        :host([light]:not([appearance])) {
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
        :host([light]:not([appearance]):focus-within),
        :host([light]:not([appearance])) a:hover,
        :host([light]:not([appearance])) a:active {
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

        /* shared vocabulary (DDDVocabulary): appearance as a custom state,
           so the existing light attribute and appearance="outlined" draw
           the same thing */
        :host(:state(appearance-outlined)) {
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
        :host(:state(appearance-outlined):focus-within),
        :host(:state(appearance-outlined)) a:hover,
        :host(:state(appearance-outlined)) a:active {
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

        /* tonal: a soft fill of the button color */
        :host(:state(appearance-tonal)) {
          --component-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --component-border-color: transparent;
          --component-background-color: color-mix(
            in srgb,
            var(--ddd-theme-primary, var(--ddd-theme-default-link)) 16%,
            transparent
          );
        }
        /* plain: text only */
        :host(:state(appearance-plain)) {
          --component-color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --component-border-color: transparent;
          --component-background-color: transparent;
        }
        :host(:state(appearance-tonal):hover),
        :host(:state(appearance-tonal):focus-within),
        :host(:state(appearance-plain):hover),
        :host(:state(appearance-plain):focus-within) {
          --component-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --component-border-color: transparent;
          --component-background-color: color-mix(
            in srgb,
            var(--ddd-theme-primary, var(--ddd-theme-default-link)) 28%,
            transparent
          );
        }
        /* size: l matches the existing large attribute */
        :host(:state(size-s)) .btn {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3)
            var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-4xs);
        }
        :host(:state(size-s)) .hideIcon {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
        }
        :host(:state(size-l)) .btn {
          padding-block: 1rem;
          padding-inline: 3.25rem 2.75rem;
        }
        :host(:state(size-l)) .hideIcon {
          padding: 1rem 3.25rem;
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
          border-radius: var(--ddd-control-radius, var(--ddd-radius-xs));
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
          transition: all var(--ddd-duration-normal, 0.3s) ease-in-out;
          background-color: var(--component-background-color, transparent);
          font-weight: var(--ddd-font-weight-black);
        }

        .hideIcon {
          padding: 0.75rem 1.5rem;
        }

        .large {
          padding-block: 1rem;
          padding-inline: 3.25rem 2.75rem;
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
      aria-label="${this._computeAriaLabel()}"
      aria-disabled="${this.disabled}"
      part="simple-cta-link"
      @click="${this._clickCard}"
    >
      <span
        class="btn ${this.large ? "large" : ""} ${
          this.hideIcon ? "hideIcon" : ""
        } "
        ><span class="label">${this.label}</span><slot></slot>${
          !this.hideIcon
            ? html`<simple-icon-lite
                class="icon"
                icon="${this.icon}"
              ></simple-icon-lite>`
            : ``
        }</span
      >
    </a>`;
  }

  /**
   * Compute an accessible name for the rendered anchor.
   *
   * Priority: explicit `label` property, then the host element's `title`
   * attribute (the most common fallback consumers already supply), then the
   * target URL so the link is at least self-describing. An empty `link="#"`
   * placeholder falls through to a generic call-to-action string.
   *
   * @returns {string | undefined}
   */
  _computeAriaLabel() {
    if (this.label && String(this.label).trim() !== "") {
      return String(this.label).trim();
    }
    const hostTitle = this.getAttribute("title");
    if (hostTitle && hostTitle.trim() !== "") {
      return hostTitle.trim();
    }
    if (this.link && this.link !== "#") {
      return this.link;
    }
    return "Call to action";
  }

  // haxProperty definition
  static get haxProperties() {
    return new URL("./lib/simple-cta.haxProperties.json", import.meta.url).href;
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
   * special support for HAX since the whole card is selectable; also honor
   * the declared/reflected disabled property so a disabled CTA cannot be
   * activated (haxtheweb/issues#3102 #36)
   */
  _clickCard(e) {
    if (this.editMode || this.disabled) {
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
   * LitElement life cycle - property changed. Mirror link to remoteLinkURL
   * (remoteLinkURL is reactive via the remoteLinkBehavior mixin) in
   * willUpdate so the set batches into the current update cycle. Setting it
   * in updated() scheduled a redundant second update (Lit change-in-update
   * warning).
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("link")) {
      this.remoteLinkURL = this.link;
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
  }
}
globalThis.customElements.define(SimpleCta.tag, SimpleCta);
export { SimpleCta };
