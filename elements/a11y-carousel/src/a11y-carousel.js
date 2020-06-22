import { LitElement, html, css } from "lit-element/lit-element.js";
import { RadioBehaviors } from "@lrnwebcomponents/radio-behaviors/radio-behaviors.js";
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
        }
        ::slotted(figure) {
          margin: 0 auto;
        }
        #inner {
          position: relative;
        }
        a11y-carousel-button {
          border: 1px solid red;
          position: absolute;
          margin: 0;
          padding: 0;
          top: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          width: 50%;
        }
        a11y-carousel-button[button-type=prev] {
          left: 0;
          right: 50%;
        }
        a11y-carousel-button[button-type=next]{
          right: 0;
          left: 50%;
        }
        :host([hidden]),
        ::slotted(figure:not([active])) {
          display: none !important;
        }
        ::part(img){
          border: 4px solid green;
        }
        ::part(fig) img{
          border: 4px solid green;
        }
      `
    ];
  }
  render() {
    return html`
      <slot name="top-buttons"></slot>
      <div id="inner">
        <slot name="img"></slot>
        <slot></slot>
        <a11y-carousel-button button-type="prev" controls="${this.prev}">
          <slot name="prev"></slot>
        </a11y-carousel-button>
        <a11y-carousel-button button-type="next" controls="${this.next}">
          <slot name="next"></slot>
        </a11y-carousel-button>
      </div>
      <slot name="bottom-buttons"></slot>
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      figures: {
        type: Array
      }
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
  }
  /**
   * overrides query selector for slotted children
   * @readonly
   */
  get _query() {
    return "figure";
  }
  /**
   *
   * overrides attribute to apply to selected item
   * @readonly
   */
  get _selected() {
    return "active";
  }
  /**
   * overrides name of event that selects item
   * @readonly
   */
  get _selectEvent() {
    return "select-carousel-item";
  }

  get first(){
    return this.itemData  && this.itemData[0] ? this.itemData[0].id : undefined;
  }

  get prev(){
    return this.itemData && this.itemData[this.selectedIndex - 1]
    ? this.itemData[this.selectedIndex - 1].id
    : this.first;
  }

  get last(){
    return this.itemData && this.itemData[this.itemData.length-1] 
    ? this.itemData[this.itemData.length-1].id 
    : undefined;
  }

  get next(){
    return this.itemData && this.itemData[this.selectedIndex + 1]
    ? this.itemData[this.selectedIndex + 1].id
    : this.last;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this._handleSelectionChange();
  }

  /**
   * shows or hides items based on selection
   */
  _handleSelectionChange() {
    super._handleSelectionChange();
    this._updateItemData();
    let image = this.querySelector(
        `figure#${this.selection}[active] > img, figure > img`
      ),
      buttons = this.querySelectorAll(`a11y-carousel-button`),
      first =
        this.itemData && this.itemData[0] ? this.itemData[0].id : undefined,
      last =
        this.itemData && this.itemData[this.itemData.length - 1]
          ? this.itemData[this.itemData.length - 1].id
          : undefined,
      prev = this.itemData[this.selectedIndex - 1]
        ? this.itemData[this.selectedIndex - 1].id
        : first,
      next = this.itemData[this.selectedIndex + 1]
        ? this.itemData[this.selectedIndex + 1].id
        : last;

    this.style.setProperty("--a11y-carousel-bg-image", `url(${image.src})`);
    Object.keys(buttons || {}).forEach(key => {
      let button = buttons[key];
      if (button.buttonType === "first") button.controls = first;
      if (button.buttonType === "prev") button.controls = prev;
      if (button.buttonType === "next") button.controls = next;
      if (button.buttonType === "last") button.controls = last;
      button.active = button.controls === this.selection;
    });
  }
}
window.customElements.define(a11yCarousel.tag, a11yCarousel);
export { a11yCarousel };
