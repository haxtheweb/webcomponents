/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
/**
 * `page-section`
 * `A well designed section of a page with many options for marketing purposes`
 * @demo demo/index.html
 * @element page-section
 */
class PageSection extends DDD {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.AbortControllers = new AbortController();
    this.filter = false;
    this.fold = false;
    this.full = false;
    this.scroller = false;
    this.bg = null;
    this.image = null;
    this.accentColor = "blue";
    this.scrollerLabel = "Scroll to reveal content";
    this.preset = null;
    this.anchor = null;
  }

  static get properties() {
    return {
      ...super.properties,
      anchor: { type: String },
      scrollerLabel: { type: String, attribute: "scroller-label" },
      filter: { type: Boolean, reflect: true },
      fold: { type: Boolean, reflect: true },
      full: { type: Boolean, reflect: true },
      scroller: { type: Boolean, reflect: true },
      bg: { type: String },
      image: { type: String, reflect: true },
      preset: { type: String, reflect: true },
    };
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: block;
        }

        /** presets */
        :host([preset="antihero"]) section div.text ::slotted(h1),
        :host([preset="antihero"]) section div.text ::slotted(h2),
        :host([preset="antihero"]) section div.text ::slotted(h3) {
          color: var(--ddd-theme-default-beaverBlue);
        }
        :host([image][preset="antihero"]) .scroller,
        :host([image][preset="antihero"]) section div ::slotted(p) {
          color: var(--ddd-theme-default-beaverBlue);
        }
        /** lines add texture to blank bg */
        :host([preset="lines"]) section div.text ::slotted(h1),
        :host([preset="lines"]) section div.text ::slotted(h2),
        :host([preset="lines"]) section div.text ::slotted(h3) {
          color: var(--ddd-theme-default-lines);
        }
        :host([image][preset="lines"]) .scroller,
        :host([image][preset="lines"]) section div ::slotted(p) {
          color: var(--ddd-theme-default-lines);
        }
        /** video can allow visualization to go beyond readability limit bc its watching */

        :host([preset="video"]) .content {
          max-width: 1440px;
        }

        :host([preset="video"]) section div.text ::slotted(video-player) {
          --video-player-color: var(--ddd-theme-default-white);
          --video-player-bg-color: var(--ddd-theme-default-nittanyNavy);
          --video-player-border-color: var(--ddd-theme-default-limestoneLight);
          --video-player-caption-color: var(--ddd-theme-default-white);
          --video-player-hover-color: var(--ddd-theme-default-inventOrange);
          --video-player-hover-bg-color: var(--ddd-theme-default-beaver80);
          --video-player-accent-color: var(--ddd-theme-default-inventOrange);
          --video-player-faded-accent-color: var(--ddd-theme-default-beaver80);
          --video-player-disabled-color: var(--ddd-theme-default-disabled);

          color: var(--ddd-theme-default-beaverBlue);
          font-family: var(--ddd-font-navigation);
        }

        .section {
          height: var(--page-section-height, 100%);
          padding: var(--page-section-padding, 0 var(--ddd-spacing-25));
          position: relative;
          background-position: 50%;
          background-size: cover;
          transition: background-color 1s linear;
        }
        :host([full]) .section {
          height: 100vh;
        }

        .content {
          display: flex;
          flex-flow: column;
          justify-content: center;
          height: 100%;
          position: relative;
          z-index: 3;
          padding: var(--page-section-content-padding, 0 15%);
          width: var(--page-section-content-width, 70%);
          max-width: var(--page-section-content-max-width, 1080px);
          margin: 0 auto;
        }

        :host([image]) .scroller {
          color: var(--simple-colors-default-theme-accent-1);
        }
        :host([image][dark]) .scroller {
          color: var(--simple-colors-default-theme-accent-12);
        }
        :host([fold]) .scroller {
          margin-top: calc(var(--ddd-spacing-20) * -1);
        }
        .scroller {
          position: relative;
          margin: 0 auto;
          --simple-icon-width: var(--ddd-icon-lg);
          --simple-icon-height: var(--ddd-icon-lg);
          color: var(--simple-colors-default-theme-accent-12);
          display: flex;
          width: var(--ddd-icon-xl);
          height: var(--ddd-icon-xl);
          margin-top: calc(var(--ddd-icon-xl) * -1);
          z-index: 11;
          animation: fullwidth-header-bounce 2.8s ease-out infinite;
        }
        .scroller:focus-within::part(icon),
        .scroller:focus::part(icon),
        .scroller:hover::part(icon) {
          transition: 0.3s all ease-in-out;
          --simple-icon-width: var(--ddd-icon-xl);
          --simple-icon-height: var(--ddd-icon-xl);
        }

        @keyframes fullwidth-header-bounce {
          0% {
            transform: translateY(0%);
          }
          12.5% {
            transform: translateY(20%);
          }
          25% {
            transform: translateY(0%);
          }
        }

        simple-tooltip {
          --simple-tooltip-font-size: var(
            --page-section-tooltip-font-size,
            var(--ddd-font-size-s, 16px)
          );
          --simple-tooltip-background: var(
            --page-section-tooltip-background,
            #000000
          );
          --simple-tooltip-opacity: var(--page-section-tooltip-opacity, 0.8);
          --simple-tooltip-text-color: var(
            --page-section-tooltip-text-color,
            white
          );
          --simple-tooltip-delay-in: var(--page-section-tooltip-delay-in, 300);
          --simple-tooltip-delay-out: var(--page-section-tooltip-delay-out, 0);
          --simple-tooltip-duration-in: var(
            --page-section-tooltip-duration-in,
            300
          );
          --simple-tooltip-duration-out: var(
            --page-section-tooltip-duration-out,
            0
          );
        }

        .fold {
          background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNGRkZGRkYiPjxwYXRoIGQ9Ik02NDAgMTM5TDAgMHYxNDBoMTI4MFYwTDY0MCAxMzl6Ii8+PC9nPjwvc3ZnPg==");
          background-size: 100% var(--ddd-spacing-25);
          background-repeat: no-repeat;
          bottom: -1px; /* ensures no line clip on smaller devices */
          height: var(--ddd-spacing-25);
          z-index: 10;
          transform: scale(1, 1);
          display: block;
          position: absolute;
          pointer-events: none;
          width: 100%;
          left: 0;
          right: 0;
          margin: 0;
          padding: 0;
          border: 0;
          outline: 0;
          background-color: transparent;
        }

        :host(:not([full])) .section {
          padding-top: var(--ddd-spacing-8);
        }

        :host([fold]:not([full])) .section {
          padding-bottom: var(--ddd-spacing-25);
        }
        :host([scroller]:not([full])) .content {
          padding-bottom: var(--ddd-spacing-25);
        }

        /* Hero styles / types */
        /* @todo add a variable for 'type' of section and to enforce it via reflection here */
        /* specific tag support to react to light dom and force setting */
        :host([large]) section div.text ::slotted(p) {
          font-size: var(--ddd-font-size-m) !important;
        }
        :host([large]) section div.text ::slotted(h1),
        :host([large]) section div.text ::slotted(h2),
        :host([large]) section div.text ::slotted(h3) {
          font-size: var(--ddd-font-size-xxl) !important;
        }

        :host section div.buttons ::slotted(*) {
          margin: 0;
          padding: 0;
        }

        :host section div ::slotted(p) {
          font-size: var(--ddd-font-size-s) !important;
        }
        :host section div ::slotted(hr) {
          border-top-color: var(--ddd-theme-default-skyBlue) !important;
          width: var(--ddd-spacing-21) !important;
        }
        :host section div ::slotted(h1),
        :host section div ::slotted(h2),
        :host section div ::slotted(h3) {
          font-size: var(--ddd-font-size-xl) !important;
          font-style: normal;
          text-transform: none;
          text-decoration: none;
          padding-bottom: var(--ddd-spacing-2) !important;
          margin: 0 !important;
          margin-top: var(--ddd-spacing-4) !important;
          margin-bottom: var(--ddd-spacing-2) !important;
        }
        :host([image]) section div ::slotted(p),
        :host([image]) section div ::slotted(h1) {
          color: var(--simple-colors-default-theme-accent-1);
        }
        :host([image][dark]) section div ::slotted(p),
        :host([image][dark]) section div ::slotted(h1) {
          color: var(--simple-colors-default-theme-accent-12);
        }

        :host section div.entice {
          display: flex;
        }
        :host section div.entice ::slotted(*) {
          padding: var(--ddd-spacing-2);
          background-color: rgba(0, 0, 0, 0.533);
          color: black;
          margin: 0 !important;
          margin-bottom: var(--ddd-spacing-4) !important;
          font-size: var(--ddd-font-size-3xs) !important;
        }

        :host section div ::slotted(grid-plate) {
          --grid-plate-item-margin: var(--ddd-spacing-4);
          --grid-plate-item-padding: var(--ddd-spacing-4);
        }

        @media (max-width: 768px) {
          .section {
            padding: var(--page-section-padding, 0 var(--ddd-spacing-5));
          }
          .content {
            padding: var(--page-section-content-padding, 0 5%);
            width: var(--page-section-content-width, 90%);
          }
          :host([large]) section div.text ::slotted(p) {
            font-size: var(--ddd-font-size-s) !important;
          }
          :host([large]) section div.text ::slotted(h1),
          :host([large]) section div.text ::slotted(h2),
          :host([large]) section div.text ::slotted(h3) {
            font-size: var(--ddd-font-size-l) !important;
          }

          :host section div.buttons ::slotted(*) {
            margin: 0;
            padding: 0;
          }

          :host section div ::slotted(grid-plate) {
            --grid-plate-item-margin: var(--ddd-spacing-1);
            --grid-plate-item-padding: var(--ddd-spacing-1);
          }

          :host section div.entice ::slotted(*) {
            padding: var(--ddd-spacing-1);
            margin-bottom: var(--ddd-spacing-2) !important;
            font-size: var(--ddd-font-size-4xs) !important;
          }

          :host section div ::slotted(h1),
          :host section div ::slotted(h2),
          :host section div ::slotted(h3) {
            font-size: var(--ddd-font-size-m) !important;
          }

          :host section div ::slotted(p) {
            font-size: var(--ddd-font-size-xs) !important;
          }

          :host section div ::slotted(hr) {
            border-top-color: var(--ddd-theme-default-skyBlue) !important;
            width: var(--ddd-spacing-10) !important;
          }
          :host([fold]:not([full])) .section {
            padding-bottom: var(--ddd-spacing-20);
          }
          :host([scroller]:not([full])) .content {
            padding-bottom: var(--ddd-spacing-20);
          }
        }
        @media (max-width: 900px) and (orientation: landscape) {
          .fold {
            height: var(--ddd-spacing-22);
          }
          .scroller {
            --simple-icon-width: var(--ddd-icon-sm);
            --simple-icon-height: var(--ddd-icon-sm);
            width: var(--ddd-icon-md);
            height: var(--ddd-icon-md);
            margin-top: calc(var(--ddd-icon-md) * -1);
          }
          .scroller:focus-within::part(icon),
          .scroller:focus::part(icon),
          .scroller:hover::part(icon) {
            --simple-icon-width: var(--ddd-icon-md);
            --simple-icon-height: var(--ddd-icon-md);
          }
          :host([fold]) .scroller {
            margin-top: calc(var(--ddd-spacing-15) * -1);
          }
        }
      `,
    ];
  }

  cleanAnchor(anchor) {
    return anchor ? anchor.replace(/[^a-zA-Z]+/g, "").toLowerCase() : "";
  }

  videoPlay(e) {
    this.bg = "var(--ddd-theme-default-coalyGray)";
  }

  videoPause(e) {
    this.bg = "var(--ddd-theme-default-limestoneLight)";
  }

  updated(changedProperties) {
    // presets force certain design consistency
    if (changedProperties.has("preset") && this.preset) {
      switch (this.preset) {
        case "antihero":
          this.bg = "var(--ddd-theme-default-limestoneLight)";
          this.image = new URL(
            "./lib/assets/geo-bkg.png",
            import.meta.url,
          ).href;
          break;
        case "video":
          this.bg = "var(--ddd-theme-default-limestoneLight)";
          this.image = null;
          // force all previous to be lost if set
          this.AbortControllers.abort();
          this.AbortControllers = new AbortController();
          this.addEventListener("play", this.videoPlay.bind(this), {
            signal: this.AbortControllers.signal,
          });
          this.addEventListener("pause", this.videoPause.bind(this), {
            signal: this.AbortControllers.signal,
          });
          break;
        case "antihero-light":
          this.bg = "var(--ddd-theme-default-slateMaxLight)";
          this.image = null;
          break;
        case "lines":
          this.bg = "var(--ddd-theme-default-white)";
          this.image = new URL(
            "./lib/assets/texture-lines.svg",
            import.meta.url,
          ).href;
          break;
      }
    }
    // support for setting ID via an anchor prop which can be used in some designs
    if (
      changedProperties.has("anchor") &&
      this.anchor &&
      this.shadowRoot &&
      !this.getAttribute("id")
    ) {
      this.setAttribute("id", this.cleanAnchor(this.anchor));
    }
  }

  bgStyle(bg, filter, image) {
    if (filter) {
      return `background-color: ${bg};background-image:var(--ddd-theme-default-gradient-antihero),url("${image}");`;
    } else {
      return `background-color: ${bg};background-image: url("${image}");`;
    }
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <section
        class="section"
        style="${this.bgStyle(this.bg, this.filter, this.image)}"
      >
        <div class="content" part="content">
          <div class="text">
            <slot></slot>
          </div>
          <div class="entice">
            <slot name="entice"></slot>
          </div>
          <div class="buttons">
            <slot name="buttons"></slot>
          </div>
        </div>
        ${this.scroller
          ? html`<simple-icon-button-lite
                class="scroller"
                icon="icons:arrow-downward"
                id="scroller"
                @click="${this.scrollToNextTarget}"
                label="${this.scrollerLabel}"
              ></simple-icon-button-lite
              ><simple-tooltip for="scroller" position="top"
                >${this.scrollerLabel}</simple-tooltip
              >`
          : ``}
        ${this.fold ? html`<div class="fold"></div>` : ``}
      </section>
    `;
  }

  scrollToNextTarget(e) {
    const nextTarget = this.nextElementSibling;
    if (nextTarget && nextTarget.scrollIntoView) {
      nextTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "page-section";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
  // implement haxHook to be able to inject the style guide things needed
  // if we can do this on the visualized preset selector then this means
  // we can create a pattern in core for the other core attributes
  /*haxHooks() {
    return {
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }*/
  /**
   * @note if we ever wanted to show a preview of the preset, this code would
   * help make that possible
   */
  /*  haxsetupActiveElementForm(props) {
      // get the index of the preset key
      let presetKey = props.settings.configure.findIndex(j => j.property === "preset");
      props.settings.configure[presetKey].itemsList.map(item => {
        item.html = html`<strong>${item.text}</strong>`;
      })
    }
  */
}
customElements.define(PageSection.tag, PageSection);
export { PageSection };
