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
          display: block;
          margin: 15px 0;
        }
        ::slotted(figure) {
          margin: 15px auto;
        }
        :host([hidden]),
        ::slotted(figure:not([active])) {
          display: none !important;
        }
      `
    ];
  }
  render() {
    return html`
        <slot></slot>`;
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
  get _selectEvent(){
    return "select-carousel-item";
  }
  
  firstUpdated(changedProperties){
    if(super.firstUpdated) super.firstUpdated(changedProperties);
    this._handleSelectionChange();
  }

  /**
   * shows or hides items based on selection
   */
  _handleSelectionChange(){
    super._handleSelectionChange();
    this._updateItemData();
    let image = this.querySelector(`figure#${this.selection}[active] > img, figure > img`), 
      buttons = this.querySelectorAll(`a11y-carousel-button`),
      first = this.itemData && this.itemData[0] ? this.itemData[0].id : undefined,
      last = this.itemData && this.itemData[this.itemData.length-1] ? this.itemData[this.itemData.length-1].id : undefined, 
      prev = this.itemData[this.selectedIndex-1] ? this.itemData[this.selectedIndex-1].id : first,
      next = this.itemData[this.selectedIndex+1] ? this.itemData[this.selectedIndex+1].id : last;
    
      this.style.setProperty('--a11y-carousel-bg-image', `url(${image.src})`);
    Object.keys(buttons || {}).forEach(key=>{
      let button = buttons[key];
      if(button.buttonType === "first") button.controls = first; 
      if(button.buttonType === "prev") button.controls = prev; 
      if(button.buttonType === "next") button.controls = next; 
      if(button.buttonType === "last") button.controls = last; 
      button.active = button.controls === this.selection;
    });
  }
}
window.customElements.define(a11yCarousel.tag, a11yCarousel);
export { a11yCarousel };
