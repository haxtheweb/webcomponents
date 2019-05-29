/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./lib/absolute-position-state-manager.js";/**
 * `absolute-position-behavior`
 * `Abstracting the positioning behavior from paper-tooltip to be resusable in other elements`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class AbsolutePositionBehavior extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}// properties available to the custom element for data binding
static get properties(){return{/**
   * Element is positioned from connected to disconnected?
   * Otherwise setPosition and unsetPosition must be called manually.
   */auto:{type:"Boolean",value:!1},/**
   * If true, no parts of the tooltip will ever be shown offscreen.
   */fitToVisibleBounds:{type:"Boolean",value:!1,observer:"updatePosition"},/**
   * The id of the element that the tooltip is anchored to. This element
   * must be a sibling of the tooltip. If this property is not set,
   * then the tooltip will be centered to the parent node containing it.
   */for:{type:"String",observer:"updatePosition",reflectToAttribute:!0},/**
   * The spacing between the top of the tooltip and the element it is
   * anchored to.
   */offset:{type:"Number",value:0,observer:"updatePosition"},/**
   * Positions the tooltip to the top, right, bottom, left of its content.
   */position:{type:"String",value:"bottom",observer:"updatePosition",reflectToAttribute:!0},/**
   * The actual target element
   */target:{type:"Object",observer:"updatePosition"},/**
   * The element's style
   */__positions:{type:"Object"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"absolute-position-behavior"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();let root=this;root.__observe=!1;root.__manager=window.AbsolutePositionStateManager.requestAvailability();if(!1!==root.auto)root.setPosition()}/**
   * life cycle, element is ready
   */ready(){super.ready()}/**
   * Registers the element with AbsolutePositionStateManager
   */setPosition(){let root=this;root.__observe=!0;root.__manager.loadElement(root)}/**
   * Unregisters the element with AbsolutePositionStateManager
   */unsetPosition(){let root=this;root.__observe=!1;root.__manager.unloadElement(root)}/**
   * Updates  the element's position
   */updatePosition(){let root=this;if(!0===root.__observe){root.__manager.positionElement(root)}}/**
   * life cycle, element is removed from the DOM
   */disconnectedCallback(){this.unsetPosition();super.disconnectedCallback()}}window.customElements.define(AbsolutePositionBehavior.tag,AbsolutePositionBehavior);export{AbsolutePositionBehavior};