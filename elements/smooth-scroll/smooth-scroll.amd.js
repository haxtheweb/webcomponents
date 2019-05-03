define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SmoothScroll=void 0;/**
 * `smooth-scroll`
 * @demo demo/index.html
 * @microcopy - this is element provides methods to be called for smooth scrolling
 * - scroll()
 */var SmoothScroll=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SmoothScroll,_PolymerElement);function SmoothScroll(){babelHelpers.classCallCheck(this,SmoothScroll);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SmoothScroll).apply(this,arguments))}babelHelpers.createClass(SmoothScroll,[{key:"scroll",/**
   * Smooth scroll an elment into view
   * @target {Node} DOM node object
   * @options {object}
   *           - align (top, center, bottom)
   *           - delay
   *           - duration
   *           - scrollElement
   */value:function scroll(target,options){// define default options
var defaultOptions={align:"top",delay:0,duration:300,scrollElement:window},_options=Object.assign({},defaultOptions,options),targetPosition=target.getBoundingClientRect(),scrollElementPosition=_options.scrollElement.getBoundingClientRect(),scrollElementHeight=_options.scrollElement.getBoundingClientRect().bottom-_options.scrollElement.getBoundingClientRect().top,targetHeight=targetPosition.bottom-targetPosition.top,startPosition=_options.scrollElement.scrollTop,distance=target.getBoundingClientRect().top-_options.scrollElement.getBoundingClientRect().top;// combine default and user defined options
/**
     * @todo weird trick to position the scroll over the target
     * I'm still not sure why this works :)
     */distance=distance-scrollElementHeight/2;// see where the user wants to align the scroll
switch(_options.align){case"center":distance=distance+targetHeight/2;break;case"bottom":distance=distance+targetHeight;break;default:break;}// record start time
var startTime=null;// internal animation function
function animation(currentTime){if(null===startTime)startTime=currentTime;var timeElapsed=currentTime-startTime,run=ease(timeElapsed,startPosition,distance,_options.duration);_options.scrollElement.scrollTop=run;if(timeElapsed<_options.duration)requestAnimationFrame(animation)}// define a ease-in-out
function ease(t,b,c,d){if(1>(t/=d/2))return c/2*t*t+b;return-c/2*(--t*(t-2)-1)+b}// start animation
requestAnimationFrame(animation)}}],[{key:"tag",get:function get(){return"smooth-scroll"}}]);return SmoothScroll}(_polymerElement.PolymerElement);_exports.SmoothScroll=SmoothScroll;window.customElements.define(SmoothScroll.tag,SmoothScroll)});