import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import{IronResizableBehavior}from"./node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js";window.ResponsiveUtility={};window.ResponsiveUtility.instance=null;let ResponsiveUtility=Polymer({_template:html`
    <style>
      :host {
        display: inline;
      }
    </style>
    <slot></slot>
  `,is:"responsive-utility",behaviors:[IronResizableBehavior],listeners:{"iron-resize":"_onIronResize"},properties:{/**
     * Stores
     */details:{type:Array,value:[]}},/**
   * An array of objects. Each object is contains data about an element
   * that will be updated with responsive values.
   *
   * To add an element to this array, fire a 'responsive-element' event
   * with the following data:
   *
   * {
   *   "element": (the element itself),
   *   "attribute": (the attribute that will be set with the size),
   *   "relativeToParent": (true for @element query instead of @media query),
   *   "sm": (optional custom sm breakpoint, default is 600),
   *   "md": (optional custom md breakpoint, default is 900),
   *   "lg": (optional custom lg breakpoint, default is 1200),
   *   "xl": (optional custom xl breakpoint, default is 1500),
   * }
   *
   */ /**
   * Makes sure there is a utility ready and listening for elements.
   */created:function(){let root=this;if(null==window.ResponsiveUtility.instance){window.ResponsiveUtility.instance=root}/* handle element registration */window.addEventListener("responsive-element",function(e){let detail={element:e.detail.element,attribute:e.detail.attribute!==void 0&&null!==e.detail.attribute?e.detail.attribute:"responsive-size",relativeToParent:e.detail.relativeToParent!==void 0&&null!==e.detail.relativeToParent?e.detail.relativeToParent:!0,sm:e.detail.sm!==void 0&&null!==e.detail.sm?e.detail.sm:900,md:e.detail.md!==void 0&&null!==e.detail.md?e.detail.md:1200,lg:e.detail.lg!==void 0&&null!==e.detail.lg?e.detail.lg:1500,xl:e.detail.xl!==void 0&&null!==e.detail.xl?e.detail.lg:1800};if("ResizeObserver"in window&&!0===detail.relativeToParent){let resize=new ResizeObserver(function(){window.ResponsiveUtility.setSize(detail)}),observable=e.detail.parentNode!==void 0&&null!==e.detail.parentNode?e.detail.parentNode.nodeType===Node.DOCUMENT_FRAGMENT_NODE?e.detail.element.parentNode.host:e.detail.element.parentNode:e.detail.element;resize.observe(observable)}root.push("details",detail);window.ResponsiveUtility.setSize(detail)});/* handle element deregistration */window.addEventListener("delete-responsive-element",function(e){for(let i=0;i<this.details.length;i++){if(e.detail===detail[i])root.splice("details",i,1)}})},/**
   * On resize, sets sizes of any detail element that has changed.
   */_onIronResize:function(){for(let i=0;i<this.details.length;i++){window.ResponsiveUtility.setSize(this.details[i])}}});/**
 * Checks to see if there is an instance available, and if not appends one
 */window.ResponsiveUtility.requestAvailability=function(){if(null==window.ResponsiveUtility.instance){window.ResponsiveUtility.instance=document.createElement("responsive-utility")}document.body.appendChild(window.ResponsiveUtility.instance)};/**
 * Sets responsive size of detail.
 */window.ResponsiveUtility.setSize=function(detail){let size,width=window.ResponsiveUtility._getWidth(detail);if(width<detail.sm){size="xs"}else if(width<detail.md){size="sm"}else if(width<detail.lg){size="md"}else if(width<detail.xl){size="lg"}else{size="xl"}if(detail.element.getAttribute(detail.attribute)===void 0||size!==detail.element.getAttribute(detail.attribute)){detail.element.setAttribute(detail.attribute,size)}};/**
 * Returns width of detail.
 *
 * @param {object} the HTML element to check
 * @returns {number} the width of the element or its parent node
 */window.ResponsiveUtility._getWidth=function(detail){let el=detail.element;if(!0===detail.relativeToParent){if(el.offsetWidth!==void 0&&null!==el.offsetWidth&&0<el.offsetWidth){return el.offsetWidth}else if(null!==el.parentNode){return el.parentNode.nodeType===Node.DOCUMENT_FRAGMENT_NODE?el.parentNode.host.offsetWidth:el.parentNode.offsetWidth}}return window.outerWidth};export{ResponsiveUtility};