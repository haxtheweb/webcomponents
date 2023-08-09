/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@shoelace-style/shoelace/dist/components/carousel/carousel.js";
import "@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js";
import "@lrnwebcomponents/video-player/video-player.js";
import { generateStyleLinkEls } from "./lib/SLStyleManager.js";

/**
 * `play-list`
 * `scrollable component that accepts lightDom or data driven lists and generates a content player`
 * @demo demo/index.html
 * @element play-list
 */
class PlayList extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    // handles SL styles link elements
    generateStyleLinkEls();
    this.items = [
      {
        src: "https://shoelace.style/assets/examples/carousel/mountains.jpg",
        alt: "A picture of a cat",
      },
      {
        src: "https://shoelace.style/assets/examples/carousel/mountains.jpg",
        alt: "A picture of a mountain",
      }
    ];
    this.navigation = true;
    this.pagination = true;
    this.aspectRatio = "16:9";
    this.slide = 0;
    this.orientation = "horizontal";
    // @todo add a mutation observer to watch for changes to the light dom
    // and then use that to update the items array so that we can translate
    // we have to do this so that we can ensure quality control of the light dom
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  disconnectedCallback() {
    if (this._linkEls) {
      document.head.removeChild(this._linkEls[0]);
      document.head.removeChild(this._linkEls[1]);
    }
    super.disconnectedCallback();
  }

  static get properties() {
    return {
      items: { type: Array },
      navigation: { type: Boolean, reflect: true },
      pagination: { type: Boolean, reflect: true },
      aspectRatio: { type: String, reflect: true, attribute: 'aspect-ratio' },
      orientation: { type: String, reflect: true },
      slide: { type: Number, reflect: true },
    }
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
      ...styles,
      css`
        :host {
          display: block;
        }
        :host([orientation="vertical"]),
        :host([orientation="vertical"]) .carousel,
        :host([orientation="vertical"]) .carousel .item {
          max-height: 400px;
        }
        :host([orientation="vertical"]) .carousel .item video-player {
          max-height: 400px;
          width: 500px;
        }

        :host .carousel .item * {
          width: 100%;
        }
        

        :host([orientation="vertical"]) .carousel::part(base) {
          grid-template-areas: 'slides slides pagination';
        }

        :host([orientation="vertical"]) .carousel::part(pagination) {
          flex-direction: column;
        }

        :host([orientation="vertical"]) .carousel::part(navigation) {
          transform: rotate(90deg);
          display: flex;
        }


      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <sl-carousel
      ?navigation="${this.navigation && this.orientation === 'horizontal'}"
      ?pagination="${this.pagination}"
      orientation="${this.orientation}"
      @sl-slide-change="${this.slideIndexChanged}"
      class="carousel"
      style="--aspect-ratio: ${this.aspectRatio};">
      ${this.items.map((item) => html`
        <sl-carousel-item class="item">
          <img
          class="item"
            alt="${item.alt}"
            src="${item.src}"
          />
        </sl-carousel-item>      
      `)}
        <sl-carousel-item class="item">
          <video-player source="https://www.youtube.com/watch?v=LrS7dqokTLE" media-title="Why do I need to go anywhere?" >  <track src="files/HAXshort.vtt" kind="subtitles" label="English" slot="track">
          </video-player>
        </sl-carousel-item>
      </sl-carousel>
    `;
  }

  slideIndexChanged(e) {
    this.slide = e.detail.index;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "play-list";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
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
      // sync slide index with changes in the carousel
      if (propName == 'slide' && this.shadowRoot && typeof oldValue !== typeof undefined) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
        if (this.shadowRoot.querySelector('.carousel').activeSlide !== this[propName]) {
          this.shadowRoot.querySelector('.carousel').goToSlide(parseInt(this[propName]));
        }
      }
    });
  }
}
customElements.define(PlayList.tag, PlayList);
export { PlayList };
