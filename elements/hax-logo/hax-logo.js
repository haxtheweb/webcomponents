/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `hax-logo`
 * `logo element for hax, obviously as a hax capable element.`
 * @demo demo/index.html
 * @customElement hax-logo
 */
class HaxLogo extends HTMLElement {
  // render function
  get html() {
    return `
<style>
:host {
  display: block;
  --hax-logo-letter-spacing: -16px;
  --hax-logo-font-size: 64px;
  --hax-logo-inner-font-size: 48px;
  --hax-logo-innerslot-margin: 8px 4px 4px 4px;
  --hax-logo-inner-margin: 8px -4px 8px 8px;
}

:host([hidden]) {
  display: none;
}
:host([toupper]) {
  text-transform: uppercase;
}

:host([size="mini"]) {
  --hax-logo-letter-spacing: -6px;
  --hax-logo-font-size: 18px;
  --hax-logo-inner-font-size: 16px;
  --hax-logo-innerslot-margin: 0px 0px 2px 4px;
  --hax-logo-inner-margin: 0px 0px 2px 4px;
}

:host([size="small"]) {
  --hax-logo-font-size: 36px;
  --hax-logo-inner-font-size: 28px;
  --hax-logo-innerslot-margin: 4px 0px 4px 4px;
  --hax-logo-inner-margin: 4px -4px 4px 8px;
}

:host([size="large"]) {
  --hax-logo-font-size: 346px;
  --hax-logo-inner-font-size: 100px;
}
.the {
  display: none;
}
.web {
  display: none;
}
:host([size="large"]) .left {
  margin-right:-72px;
}
:host([size="large"]) .right {
  margin-left: -44px;
}
:host([hide-hax]) .inner,
:host([hide-hax]) .innerslot {
  display: none;
}
:host([size="large"]) .the {
  letter-spacing: 20px;
  margin-left: 20px;
  text-transform: uppercase;
  display: inline-block;
}
:host([size="large"]) .web {
  letter-spacing: 20px;
  margin-left: 20px;
  text-transform: uppercase;
  display: inline-block;
}

.wrap {
  font-family: 'Press Start 2P', cursive;
  font-size: var(--hax-logo-font-size);
  letter-spacing: var(--hax-logo-letter-spacing);
  text-align: center;
}
.inner {
  font-size: var(--hax-logo-inner-font-size);
  display: inline-block;
  vertical-align: text-top;
  margin: var(--hax-logo-inner-margin);
  letter-spacing: -2px;
}
.innerslot {
  font-size: var(--hax-logo-inner-font-size);
  display: inline-block;
  vertical-align: text-top;
  margin: var(--hax-logo-innerslot-margin);
  letter-spacing: -2px;
}
        </style>
<span class="wrap"><span class="left">&lt;</span><span class="innerslot"><slot name="pre"></slot></span><slot></slot><span class="inner">h-a-x<br><span class="the">the</span><br><span class="web">web</span></bt></span><span class="innerslot"><slot name="post"></slot></span><span class="right">&gt;</span></span>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Hax logo",
        description:
          "logo element for hax, obviously as a hax capable element.",
        icon: "icons:android",
        color: "green",
        groups: ["Logo"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            attribute: "size",
            description: "Size of the HAX logo to place",
            inputMethod: "select",
            options: {
              mini: "Mini",
              small: "Small",
              normal: "Normal",
              large: "Large"
            },
            required: false
          },
          {
            attribute: "toupper",
            description: "Whether to transform logo to upper case",
            inputMethod: "boolean",
            required: false
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return { ...super.properties };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hax-logo";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    if (!window.__haxLogoFontLoaded) {
      let link = document.createElement("link");
      link.setAttribute(
        "href",
        "https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap"
      );
      link.setAttribute("rel", "stylesheet");
      document.head.appendChild(link);
      window.__haxLogoFontLoaded = true;
    }
    // set tag for later use
    this.tag = HaxLogo.tag;
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });

    if (!delayRender) {
      this.render();
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
  }

  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
  get size() {
    return this.getAttribute("size");
  }
  set size(newValue) {
    if (newValue) {
      this.setAttribute("size", newValue);
    }
  }

  get toupper() {
    return this.getAttribute("toupper");
  }
  set toupper(newValue) {
    if (newValue) {
      this.setAttribute("toupper", "toupper");
    }
  }
}
window.customElements.define(HaxLogo.tag, HaxLogo);
export { HaxLogo };
