/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element';
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
/**
 * `a11y-details`
 * `accessible progressive disclosure with detail and summary`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class A11YDetails extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "a11y-details";
  }

  // life cycle
  constructor() {
    super();
    this.tag = A11YDetails.tag;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(A11YDetails.haxProperties, A11YDetails.tag, this);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    super.disconnectedCallback();
  }
  firstUpdated(){
    if(super.firstUpdated) super.firstUpdated();
    this._updateElement();
    this.observer.observe(this, { childList: true, subtree: true });
  }
  get details(){
    return this && this.shadowRoot && this.shadowRoot.querySelector('details') 
      ? this.shadowRoot.querySelector('details') 
      : undefined;
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    if(name === 'open') this.open = newval;
  }

  /**
   * mutation observer for a11y-details
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = (mutationsList) => this._watchChildren(mutationsList);
    return new MutationObserver(callback);
  }

  /**
   * mutation observer for <details/> in unnamed slot
   * @readonly
   * @returns {object}
   */
  get detailsObserver() {
    let callback = () => this._updateElement();
    return new MutationObserver(callback);
  }
  _handleClick(e){
    if(this.details && typeof this.details.open === "undefined"){
      this._toggleOpen();
      e.preventDefault();
      e.stopPropagation();
    }
  }
  _handleKeyup(e){
    if(this.details && typeof this.details.open === "undefined" && e.keyCode == 13 || e.keyCode == 32) {
      this._toggleOpen();	
      e.preventDefault();
      e.stopPropagation();
    }
  }
  _toggleOpen() {
    if (this.details.hasAttribute("open")) {
      this.details.removeAttribute("open");
    } else {
      this.details.setAttribute("open", "");
    }
  }
  _updateElement(){
    let details = this.querySelector('* > details'),
      summary = details ? details.querySelector('* > summary') : undefined;
    console.log('_updateElement',details,summary);
    if(summary) this._copyToSlot('summary',summary.cloneNode(true));
    if(details) {
      let clone = details.cloneNode(true), 
        filtered = clone.querySelectorAll('* > summary');
      Object.keys(filtered || {}).forEach(i=>filtered[i].remove());
      this._copyToSlot('details',clone);
      console.log('details',clone,filtered);
    }
  }
  _watchChildren(mutationsList){
    if(this._searchMutations(mutationsList)){
      this._updateElement();
      this.detailsObserver.observe(
        this.querySelector('* > details'), 
        { childList: true, subtree: true, characterData: true }
      );
    } else if(
      this._searchMutations(mutationsList,"removedNodes") 
      && this.detailsObserver.disconnect
    ){
      this.detailsObserver.disconnect();
    }
  }
  _searchMutations(mutationsList,nodeListType="addedNodes"){
    return Object.keys(mutationsList || {}).filter(i=> {
      let nodes = mutationsList[i][nodeListType];
      return Object.keys(nodes || {}).filter(j=>{
        let nodeName = nodes[j].tagName;
        return nodeName === "DETAILS"
      }).length > 0;
    }).length > 0
  }
  _copyToSlot(slotName,clone){
    let slot = this._getSlot(slotName);
    slot.innerHTML = clone.innerHTML;
    console.log('_copyToSlot',slot,clone);
    clone.remove();
  }
  _getSlot(slotName,inline=true){
    let slot = this.querySelector(`[slot=${slotName}]`);
    if(!slot) {
      slot = inline ? document.createElement('span') : document.createElement('div');
      slot.slot = slotName
      this.append(slot);
    }
    return slot;
  }
}
customElements.define("a11y-details", A11YDetails);
export { A11YDetails };
