import{Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";/**
`smooth-scroll`

* @demo demo/index.html
Smooth scroll an element

@microcopy - this is element provides methods to be called for smooth scrolling
 - scroll()
*/let SmoothScroll=Polymer({is:"smooth-scroll",properties:{},/**
   * Smooth scroll an elment into view
   * @target {Node} DOM node object
   * @options {object}
   *           - align (top, center, bottom)
   *           - delay
   *           - duration
   *           - scrollElement
   */scroll:function(target,options){// define default options
const defaultOptions={align:"top",delay:0,duration:300,scrollElement:window},_options=Object.assign({},defaultOptions,options),targetPosition=target.getBoundingClientRect(),scrollElementPosition=_options.scrollElement.getBoundingClientRect(),scrollElementHeight=_options.scrollElement.getBoundingClientRect().bottom-_options.scrollElement.getBoundingClientRect().top,targetHeight=targetPosition.bottom-targetPosition.top,startPosition=_options.scrollElement.scrollTop;// combine default and user defined options
// get the distance between the top of the scroll and the top of the bounding rectangles
let distance=target.getBoundingClientRect().top-_options.scrollElement.getBoundingClientRect().top;/**
     * @todo weird trick to position the scroll over the target
     * I'm still not sure why this works :)
     */distance=distance-scrollElementHeight/2;// see where the user wants to align the scroll
switch(_options.align){case"center":distance=distance+targetHeight/2;break;case"bottom":distance=distance+targetHeight;break;default:break;}// record start time
let startTime=null;// internal animation function
function animation(currentTime){if(null===startTime)startTime=currentTime;let timeElapsed=currentTime-startTime,run=ease(timeElapsed,startPosition,distance,_options.duration);_options.scrollElement.scrollTop=run;if(timeElapsed<_options.duration)requestAnimationFrame(animation)}// define a ease-in-out
function ease(t,b,c,d){if(1>(t/=d/2))return c/2*t*t+b;return-c/2*(--t*(t-2)-1)+b}// start animation
requestAnimationFrame(animation)}});export{SmoothScroll};