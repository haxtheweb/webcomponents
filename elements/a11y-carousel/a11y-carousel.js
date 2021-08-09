import { LitElement, html, css } from "lit";
import { RadioBehaviors } from "@lrnwebcomponents/radio-behaviors/radio-behaviors.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "./lib/a11y-carousel-button.js";
/**
 * `a11y-carousel`
 * Layers images over each other with a slider interface to compare them
 * @demo demo/index.html
 * @element a11y-carousel
 */
class a11yCarousel extends RadioBehaviors(LitElement) {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          margin: 15px 0;
          --a11y-carousel-background-image: none;
        }
        ::slotted(figure) {
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        :host([hidden]),
        ::slotted(figure:not([active])) {
          display: none !important;
        }
        .sr-only {
          position: absolute;
          left: -99999px;
          width: 0;
          overflow: hidden;
        }
        @media screen {
          #inner {
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
          }
          .buttons {
            display: flex;
            align-items: stretch;
            justify-content: center;
            z-index: 200;
          }
          a11y-carousel-button.prevnext {
            position: absolute;
            margin: 0;
            padding: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;
            border: 0px solid transparent;
            width: 50%;
          }
          a11y-carousel-button.prevnext simple-icon-lite {
            opacity: 0;
            --simple-icon-width: 30%;
            --simple-icon-height: 30%;
            transition: 0.5s all ease-in-out;
          }
          a11y-carousel-button.prevnext:focus,
          a11y-carousel-button.prevnext:hover {
            outline: none;
          }
          a11y-carousel-button.prevnext:focus simple-icon-lite,
          a11y-carousel-button.prevnext:hover simple-icon-lite {
            opacity: 1;
            color: var(--a11y-carousel-button-background-color, black);
          }
          a11y-carousel-button[button-type="prev"] {
            left: 0;
            right: 50%;
          }
          a11y-carousel-button[button-type="next"] {
            right: 0;
            left: 50%;
            align-items: flex-end;
          }
          a11y-carousel-button.button {
            flex: 0 0 var(--a11y-carousel-button-width, 40px);
            height: var(--a11y-carousel-button-height, 10px);
            margin: var(--a11y-carousel-button-margin, 5px);
            padding: var(--a11y-carousel-button-padding, 0px);
            background-color: var(
              --a11y-carousel-button-background-color,
              black
            );
            border: var(--a11y-carousel-button-border, 1px solid black);
            border-radius: var(
              --a11y-carousel-button-border-radius,
              1px solid black
            );
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <div><slot name="above"></slot></div>
      <div id="inner">
        <slot name="img"></slot>
        <slot></slot>
        ${this.noPrevNext
          ? ``
          : html`
              <a11y-carousel-button
                class="prevnext"
                button-type="prev"
                controls="${this.prev}"
                title="${this.prevLabel}"
              >
                <span class="sr-only">${this.nextLabel}</span>
                <simple-icon-lite icon="icons:chevron-left"></simple-icon-lite>
              </a11y-carousel-button>
              <a11y-carousel-button
                class="prevnext"
                button-type="next"
                controls="${this.next}"
                title="${this.nextLabel}"
              >
                <span class="sr-only">${this.nextLabel}</span>
                <simple-icon-lite icon="icons:chevron-right"></simple-icon-lite>
              </a11y-carousel-button>
            `}
      </div>
      ${this.noButtons
        ? ``
        : html`
            <div class="buttons">
              ${(this.itemData || []).map(
                (item) => html`
                  <a11y-carousel-button class="button" controls="${item.id}">
                    <span class="sr-only">${item.index + 1}</span>
                  </a11y-carousel-button>
                `
              )}
            </div>
          `}
      <div><slot name="below"></slot></div>
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      nextLabel: {
        type: String,
      },
      noPrevNext: {
        type: Boolean,
        attribute: "no-prev-next",
      },
      noButtons: {
        type: Boolean,
        attribute: "no-buttons",
      },
      prevLabel: {
        type: String,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-carousel";
  }
  constructor() {
    super();
    this.noButtons = false;
    this.noPrevNext = false;
    this.prevLabel = "previous";
    this.nextLabel = "next";
  }
  /**
   * overrides query selector for slotted children
   * @readonly
   */
  get __query() {
    return "figure";
  }
  /**
   *
   * overrides attribute to apply to selected item
   * @readonly
   */
  get __selected() {
    return "active";
  }
  /**
   * overrides name of event that selects item
   * @readonly
   */
  get __selectEvent() {
    return "select-carousel-item";
  }
  /**
   * gets id for first figure
   *
   * @readonly
   * @memberof a11yCarousel
   */
  get first() {
    return this.itemData && this.itemData[0] ? this.itemData[0].id : undefined;
  }

  /**
   * gets id for previous figure
   *
   * @readonly
   * @memberof a11yCarousel
   */
  get prev() {
    return this.itemData && this.itemData[this.selectedIndex - 1]
      ? this.itemData[this.selectedIndex - 1].id
      : this.first;
  }

  /**
   * gets id for last figure
   *
   * @readonly
   * @memberof a11yCarousel
   */
  get last() {
    return this.itemData && this.itemData[this.itemData.length - 1]
      ? this.itemData[this.itemData.length - 1].id
      : undefined;
  }

  /**
   * gets id for next figure
   *
   * @readonly
   * @memberof a11yCarousel
   */
  get next() {
    return this.itemData && this.itemData[this.selectedIndex + 1]
      ? this.itemData[this.selectedIndex + 1].id
      : this.last;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this._handleSelectionChange();
  }
  /**
   * gets image css for selected image
   *
   * @returns
   * @memberof a11yCarousel
   */
  _getImage() {
    let img =
      this.querySelector(`figure#${this.selection} > img`) ||
      this.querySelector(`figure > img`);
    return img ? `url("${img.src}")` : undefined;
  }

  /**
   * shows or hides items based on selection
   */
  _handleSelectionChange() {
    super._handleSelectionChange();
    this._updateItemData();
    let buttons = this.querySelectorAll(`a11y-carousel-button`);
    this.style.setProperty(
      "--a11y-carousel-background-image",
      this._getImage()
    );
    Object.keys(buttons || {}).forEach((key) => {
      let button = buttons[key];
      if (button.buttonType === "first") button.controls = this.first;
      if (button.buttonType === "prev") button.controls = this.prev;
      if (button.buttonType === "next") button.controls = this.next;
      if (button.buttonType === "last") button.controls = this.last;
      button.active = button.controls === this.selection;
    });
  }
}
window.customElements.define(a11yCarousel.tag, a11yCarousel);
export { a11yCarousel };
