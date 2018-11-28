import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";import"./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";import"./node_modules/@lrnwebcomponents/simple-modal/simple-modal.js";import"./node_modules/@lrnwebcomponents/relative-heading/relative-heading.js";import"./lib/lrndesign-imagemap-hotspot.js";let LrndesignImagemap=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
      :host #buttons {
        position: absolute;
        left: -999999px;
        top: 0;
        overflow: hidden;
        opacity: 0;
      }
      /*::slotted([hotspot]) {
        display: none;
      }*/
      @media print {
        :host > #svg {
          display: none;
        }
        /*::slotted(#screen-only) {
          display: none;
        }
        ::slotted([hotspot]) {
          display: block;
        }*/
      }
    </style>
    <relative-heading hidden\$="[[!label]]" id="heading" subtopic-of\$="[[subtopicOf]]" tag\$="[[tag]]" text\$="[[label]]">
    </relative-heading>
    <div id="desc"><slot name="desc"></slot></div>
    <div id="svg"></div>
    <div id="buttons"></div>
    <slot></slot>
    <iron-ajax auto="" id="get_svg" url="[[src]]" handle-as="text" on-response="_getSVGHandler"></iron-ajax>
`,is:"lrndesign-imagemap",properties:{label:{type:String,value:null},src:{type:String,value:null},hotspotDetails:{type:Array,value:[]},subtopicOf:{type:String,value:null,reflectToAttribute:!0},tag:{type:String,value:null,reflectToAttribute:!0}},attached:function(){window.simpleModal.requestAvailability();window.addEventListener("simple-modal-closed",e=>{if(e.detail.invokedBy===this){this.closeHotspot()}})},detached:function(){window.removeEventListener("simple-modal-closed",e=>{if(e.detail.invokedBy===this){this.closeHotspot()}})},_getSVGHandler:function(e){let root=this,temp=document.createElement("div"),getID=function(element,alt){if(null===element.getAttribute("id"))element.setAttribute("id",alt);return element.getAttribute("id")},setAriaLabelledBy=function(source,target,prefix){let svgElem=function(nodename){source=null!==source?source:root;let attr="title"===nodename?"label":nodename,query=source.querySelector("#"+attr);var label=target.querySelector(nodename);if(null===label){label=document.createElement(nodename);target.prepend(label)}if(null!==source.getAttribute(attr)){label.innerHTML=source.getAttribute(attr)}else if(null!==query&&""!==query.innerHTML){label.innerHTML=query.innerHTML}return getID(label,prefix+"-"+attr)};target.setAttribute("aria-labelledby",svgElem("desc")+" "+svgElem("label"))};temp.innerHTML=e.detail.response;let svg=temp.querySelector("svg"),svgid=getID(svg,"svg-"+Date.now()),hdata=dom(root).querySelectorAll("lrndesign-imagemap-hotspot");setAriaLabelledBy(root,svg,svgid);this.$.svg.appendChild(svg);for(let i=0;i<hdata.length;i++){let hid=hdata[i].getAttribute("hotspot-id"),hotspot=svg.querySelector("#"+hid),clone=svg.cloneNode(!0);setAriaLabelledBy(hdata[i],clone,hid);hdata[i].appendChild(clone);hdata[i].querySelector("#"+hid).classList.add("selected");hdata[i].setParentHeading(root.$.heading);for(let j=0;j<hdata.length;j++){hdata[i].querySelector("#"+hdata[j].getAttribute("hotspot-id")).classList.add("hotspot")}let hbutton=document.createElement("button");hbutton.setAttribute("tabindex",0);hbutton.setAttribute("aria-label",hdata[i].label);root.$.buttons.appendChild(hbutton);hbutton.addEventListener("focus",function(){console.log("focus",i,hotspot);hotspot.classList.add("focus")});hbutton.addEventListener("blur",function(){hotspot.classList.remove("focus")});hotspot.classList.add("hotspot");hotspot.addEventListener("click",e=>{this.openHotspot(hotspot,hdata[i])});hbutton.addEventListener("keyup",e=>{if(13===e.keyCode||32===e.keyCode){if(!hotspot.classList.contains("selected")){this.openHotspot(hotspot,hdata[i])}}})}},openHotspot:function(hotspot,details){var children=details.$.desc.querySelector("slot").assignedNodes({flatten:!0});let c=document.createElement("div");for(var child in children){c.appendChild(children[child].cloneNode(!0))}const evt=new CustomEvent("simple-modal-show",{bubbles:!0,cancelable:!0,detail:{title:details.getAttribute("label"),elements:{content:c},invokedBy:this,clone:!1}});this.dispatchEvent(evt);this.__activeHotspot=hotspot;this.resetHotspots();hotspot.classList.add("selected")},closeHotspot:function(){this.resetHotspots();this.__activeHotspot.focus()},resetHotspots:function(){let hotspots=this.querySelectorAll(".hotspot[role=\"button\"]");for(let i=0;i<hotspots.length;i++){hotspots[i].classList.remove("selected")}}});export{LrndesignImagemap};