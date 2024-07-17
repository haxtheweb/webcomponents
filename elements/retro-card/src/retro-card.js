/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
/**
 * `retro-card`
 * `Simple card in a cool retro design`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element retro-card
 */
class RetroCard extends SimpleColors {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --retro-card-level-2: var(
            --simple-colors-default-theme-accent-7,
            #b8a515
          );
          --retro-card-level-1: var(
            --simple-colors-default-theme-accent-6,
            #e5cd1b
          );
          --retro-card-level-3: var(
            --simple-colors-default-theme-accent-5,
            #ead749
          );
          --retro-card-shadow: var(
            --simple-colors-default-theme-accent-8,
            rgba(229, 205, 27, 0.2)
          );
          --retro-card-light-color: #f4f1d0;
          --retro-card-dark-color: #212121;
        }

        :host([dark]) {
          --retro-card-dark-color: #f4f1d0;
          --retro-card-light-color: #212121;
        }

        :host([hidden]) {
          display: none;
        }

        :host([hover-state]) .link:nth-child(1n + 0) {
          box-shadow: 16px 16px 0px 0px var(--retro-card-shadow);
          border: 16px solid var(--retro-card-level-2);
          background-color: var(--retro-card-level-1);
        }

        :host([hover-state]) .link {
          color: var(--retro-card-light-color);
          text-decoration: underline;
          padding: 1.25rem;
          border: 16px var(--retro-card-level-1) solid;
          box-shadow: 16px 16px 0px 0px var(--retro-card-shadow);
          transition:
            background-color 0.2s ease-in-out 0s,
            padding 0.4s ease-in-out 0s,
            border 0.4s ease-in-out 0s,
            box-shadow 0.2s ease-in-out 0s;
        }

        .link:nth-child(1n + 0) {
          background-color: var(--retro-card-level-3);
          box-shadow: 8px 8px 0px 0px var(--retro-card-level-1);
          border: 4px var(--retro-card-level-1) solid;
        }

        .link {
          display: block;
          background-color: var(--retro-card-level-3);
          border: 4px var(--retro-card-level-1) solid;
          padding: var(--retro-card-padding, 2rem);
          box-shadow: 8px 8px 0px 0px var(--retro-card-level-1);
          transition:
            padding 0.4s ease-in-out 0s,
            border 0.4s ease-in-out 0s,
            box-shadow 0.2s ease-in-out 0s;
          text-align: center;
          color: var(--retro-card-dark-color);
          text-decoration: none;
          line-height: inherit;
          cursor: pointer;
          font-family: "Roboto Mono", Consolas, Monospace;
        }

        .img {
          -webkit-filter: grayscale(1);
          filter: grayscale(1);
          mix-blend-mode: screen;
          border: 0;
          max-width: 100%;
          height: auto;
          -ms-interpolation-mode: bicubic;
          display: inline-block;
          vertical-align: middle;
          max-height: 200px;
        }

        .title {
          display: block;
          font-size: 1.5rem;
          padding: 2rem 0 0 0;
          text-transform: uppercase;
          font-weight: 700;
          text-align: center;
        }

        .description {
          display: block;
          font-size: 0.9rem;
          padding: 0.75rem 1rem 0;
        }

        .card-tags {
          line-height: 1.6;
          text-align: center;
          margin-bottom: 1rem;
          text-rendering: optimizeLegibility;
          font-weight: 300;
        }

        .project-tag {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          font-style: italic;
          font-weight: 600;
          color: var(--retro-card-light-color);
          background: var(--retro-card-dark-color);
          word-wrap: break-word;
          padding: 0 0.5rem;
          text-transform: uppercase;
          margin-bottom: 2rem;
          margin: 0 0.25rem 2rem 0;
        }

        hr {
          border-bottom: 1px solid var(--retro-card-dark-color);
          max-width: 75rem;
          height: 0;
          border-right: 0;
          border-top: 0;
          border-left: 0;
          margin: 1.25rem auto;
          clear: both;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` ${!this.nosource
      ? html`
   <a tabindex="-1" class="link ${this.color}" href="${this.url}" @click="${
     this._clickCard
   }">
     ${
       this.__source
         ? html`<img
             class="img"
             loading="lazy"
             src="${this.__source}"
             alt=""
           />`
         : ``
     }
     <div class="title" part="title"><slot name="title"></slot>${
       this.title
     }</slot></div>
     <div class="subtitle" part="subtitle"><slot name="subtitle">${
       this.subtitle
     }</slot></div>
     <div class="description" part="description"><slot></slot></div>
     ${
       this.__cardTags
         ? html`<hr />
             <div class="card-tags" part="card-tags">
               ${this.__cardTags.map(
                 (tag) =>
                   html`<span class="project-tag" part="project-tag"
                     >${tag.trim()}</span
                   >`,
               )}
             </div>`
         : ``
     }
 </a>
 `
      : html`
 <div class="link ${this.color}">
   ${
     this.__source
       ? html`<img class="img" loading="lazy" src="${this.__source}" alt="" />`
       : ``
   }
   <div class="title" part="title"><slot name="title"></slot>${
     this.title
   }</slot></div>
   <div class="subtitle" part="subtitle"><slot name="subtitle">${
     this.subtitle
   }</slot></div>
   <div class="description" part="description"><slot></slot></div>
   ${
     this.__cardTags
       ? html`<hr />
           <div class="card-tags" part="card-tags">
             ${this.__cardTags.map(
               (tag) =>
                 html`<span class="project-tag" part="project-tag"
                   >${tag.trim()}</span
                 >`,
             )}
           </div>`
       : ``
   }
 </div>`}`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: true,
      gizmo: {
        title: "Retro card",
        description: "Simple card in a cool retro design",
        icon: "icons:credit-card",
        color: "purple",
        tags: ["Layout", "card", "layout"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            title: "Title",
            description: "Main title of card",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "url",
            description: "Link to go to when clicking the card",
            inputMethod: "textfield",
            required: false,
            validationType: "url",
          },
          {
            property: "subtitle",
            title: "Sub-title",
            description: "Sub heading",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "tags",
            title: "Tags",
            description: "Comma separated tags",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "mediaSource",
            title: "Media source",
            description: "Primary media source",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            required: true,
            validationType: "url",
          },
          {
            property: "hoverSource",
            description: "When user hovers / activates the card",
            title: "Source on hover",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            required: false,
            validationType: "url",
          },
          {
            property: "accentColor",
            description: "An accent to apply evenly to the card",
            title: "Accent Color",
            inputMethod: "colorpicker",
            required: false,
          },
          {
            property: "dark",
            title: "Dark",
            description: "Sets base color to be dark mode",
            inputMethod: "boolean",
            required: false,
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["colors"],
      },
      demoSchema: [
        {
          tag: "video-player",
          properties: {
            title: "HAX Camp",
            subtitle: "btopro dreaming reality",
            tags: "dreams, hax, camp",
            accentColor: "pink",
            url: "https://btopro.com",
            "media-source": "https://btopro.com/files/IMG_20190716_102855.jpg",
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

      title: {
        type: String,
      },
      subtitle: {
        type: String,
      },
      tags: {
        type: String,
      },
      mediaSource: {
        type: String,
        attribute: "media-source",
      },
      url: {
        type: String,
      },
      hoverSource: {
        type: String,
        attribute: "hover-source",
      },
      hoverState: {
        type: Boolean,
        attribute: "hover-state",
        reflect: true,
      },
      __cardTags: {
        type: Array,
      },
      nosource: {
        type: Boolean,
      },
      __source: {
        type: String,
      },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "retro-card";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__cardTags = [];
    this.hoverState = false;
    this.nosource = false;
  }
  /**
   * A11y because we are delegating keyboard function to hit the link when enter pressed
   */
  _keyPress(e) {
    switch (e.key) {
      case "Enter":
        // simulate click to go to whatever link / action it has
        this.shadowRoot.querySelector("a").click();
        break;
    }
  }
  _hoverStateOff(e) {
    this.hoverState = false;
  }
  _hoverStateOn(e) {
    this.hoverState = true;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.addEventListener("mouseover", this._hoverStateOn.bind(this));
    this.addEventListener("mouseout", this._hoverStateOff.bind(this));
    // makes this focusable and we normalize the hover / focus state
    // between CSS, JS and keyboard actions this way
    if (!this.nosource) {
      this.setAttribute("tabindex", 0);
      this.addEventListener("keypress", this._keyPress.bind(this));
      this.addEventListener("focusin", this._hoverStateOn.bind(this));
      this.addEventListener("focusout", this._hoverStateOff.bind(this));
    }
    // optional support for hoverSource being the default source
    if (!this.hoverSource) {
      this.hoverSource = this.mediaSource;
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
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this._haxstate = val;
  }
  /**
   * special support for HAX since the whole card is selectable
   */
  _clickCard(e) {
    if (this._haxstate && !this.nosource) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "tags") {
        this._tagsChanged(this[propName]);
      }
      if (propName == "source") {
        this.__source = this.mediaSource;
      }
      if (propName == "hoverState") {
        this.__source = this[propName] ? this.hoverSource : this.mediaSource;
      }
    });
  }
  /**
   * Convert string based tags into array
   */
  _tagsChanged(tags) {
    let ary = tags.split(",");
    this.__cardTags = [...ary];
  }
}
customElements.define(RetroCard.tag, RetroCard);
export { RetroCard };
