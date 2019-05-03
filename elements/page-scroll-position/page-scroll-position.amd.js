/*
`page-scroll-position`
A Web Component that hold the current scroll value relative to the entire document.
*/var PageScrollPosition=/*#__PURE__*/function(_HTMLElement){"use strict";babelHelpers.inherits(PageScrollPosition,_HTMLElement);function PageScrollPosition(){babelHelpers.classCallCheck(this,PageScrollPosition);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(PageScrollPosition).apply(this,arguments))}babelHelpers.createClass(PageScrollPosition,[{key:"attachedCallback",value:function attachedCallback(){var _this=this;// start off at 0
this.value=0;var element=document,valueChangedEvent=new CustomEvent("value-changed",{detail:{value:0}});this.dispatchEvent(valueChangedEvent);element.addEventListener("scroll",function(){// get the height to the top
var a=document.documentElement.scrollTop,b=document.documentElement.scrollHeight-document.documentElement.clientHeight,c=100*(a/b);// get how far down the page they have scrolled
// set value to the percent of the way through
_this.value=c;valueChangedEvent=new CustomEvent("value-changed",{detail:{value:_this.value}});_this.dispatchEvent(valueChangedEvent)})}}]);return PageScrollPosition}(babelHelpers.wrapNativeSuper(HTMLElement));window.customElements.define("page-scroll-position",PageScrollPosition);