/*
`page-scroll-position`
A Web Component that hold the current scroll value relative to the entire document.
*/class PageScrollPosition extends HTMLElement{attachedCallback(){// start off at 0
this.value=0;let element=document,valueChangedEvent=new CustomEvent("value-changed",{detail:{value:0}});this.dispatchEvent(valueChangedEvent);element.addEventListener("scroll",()=>{// get the height to the top
let a=document.documentElement.scrollTop,b=document.documentElement.scrollHeight-document.documentElement.clientHeight,c=100*(a/b);// get how far down the page they have scrolled
// set value to the percent of the way through
this.value=c;valueChangedEvent=new CustomEvent("value-changed",{detail:{value:this.value}});this.dispatchEvent(valueChangedEvent)})}}window.customElements.define("page-scroll-position",PageScrollPosition);