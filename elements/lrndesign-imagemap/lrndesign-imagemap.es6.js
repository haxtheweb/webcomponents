import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";import"./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";import"./node_modules/@polymer/paper-dialog/paper-dialog.js";import"./node_modules/@lrnwebcomponents/relative-heading/relative-heading.js";import"./lib/lrndesign-imagemap-hotspot.js";Polymer({_template:html`
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
      :host paper-dialog {
        border: 1px solid #000;
        border-radius: 0.25em;
      }
      :host paper-dialog > #title, 
      :host paper-dialog > #desc {
        padding: 15px;
        margin: 0;
      }
      :host paper-dialog > #title {
        position: absolute;
        left: -9999px;
        overflow: hidden;
        height: 0;
        width: 0;
      }
      :host paper-dialog > #title > * {
        margin: 0;
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
    <paper-dialog id="hdetails">
      <div id="title"></div>
      <div id="desc"></div>
    </paper-dialog>
    <iron-ajax auto="" id="get_svg" url="[[src]]" handle-as="text" on-response="_getSVGHandler"></iron-ajax>
`,is:"lrndesign-imagemap",properties:{label:{type:String,value:null},src:{type:String,value:null},hotspotDetails:{type:Array,value:[]},subtopicOf:{type:String,value:null,reflectToAttribute:!0},tag:{type:String,value:null,reflectToAttribute:!0}},ready:function(){let root=this;this.$.hdetails.addEventListener("blur",function(){root.closeHotspot()});this.$.hdetails.addEventListener("mouseout",function(){root.closeHotspot()});this.$.hdetails.addEventListener("keyup",function(e){if(13===e.keyCode||32===e.keyCode){root.closeHotspot()}})},_getSVGHandler:function(e){let root=this,temp=document.createElement("div"),getID=function(element,alt){if(null===element.getAttribute("id"))element.setAttribute("id",alt);return element.getAttribute("id")},setAriaLabelledBy=function(source,target,prefix){let svgElem=function(nodename){source=null!==source?source:root;let attr="title"===nodename?"label":nodename,query=source.querySelector("#"+attr);var label=target.querySelector(nodename);if(null===label){label=document.createElement(nodename);target.prepend(label)}if(null!==source.getAttribute(attr)){label.innerHTML=source.getAttribute(attr)}else if(null!==query&&""!==query.innerHTML){label.innerHTML=query.innerHTML}return getID(label,prefix+"-"+attr)};target.setAttribute("aria-labelledby",svgElem("desc")+" "+svgElem("label"))};temp.innerHTML=e.detail.response;let svg=temp.querySelector("svg"),svgid=getID(svg,"svg-"+Date.now()),hdata=dom(root).querySelectorAll("lrndesign-imagemap-hotspot");setAriaLabelledBy(root,svg,svgid);this.$.svg.appendChild(svg);for(let i=0;i<hdata.length;i++){let hid=hdata[i].getAttribute("hotspot-id"),hotspot=svg.querySelector("#"+hid),clone=svg.cloneNode(!0);setAriaLabelledBy(hdata[i],clone,hid);hdata[i].appendChild(clone);hdata[i].querySelector("#"+hid).classList.add("selected");hdata[i].setParentHeading(root.$.heading);for(let j=0;j<hdata.length;j++){hdata[i].querySelector("#"+hdata[j].getAttribute("hotspot-id")).classList.add("hotspot")}let hbutton=document.createElement("button");hbutton.setAttribute("aria-controls","hdetails");hbutton.setAttribute("tabindex",0);hbutton.setAttribute("aria-label",hdata[i].label);root.$.buttons.appendChild(hbutton);hbutton.addEventListener("focus",function(){console.log("focus",i,hotspot);hotspot.classList.add("focus")});hbutton.addEventListener("blur",function(){hotspot.classList.remove("focus")});hotspot.classList.add("hotspot");hotspot.addEventListener("click",function(){root.openHotspot(hotspot,hdata[i])});hbutton.addEventListener("keyup",function(e){if(13===e.keyCode||32===e.keyCode){if(!hotspot.classList.contains("selected")){root.openHotspot(hotspot,hdata[i])}}})}},openHotspot:function(hotspot,details){let root=this,node=dom(root).querySelector("lrndesign-imagemap-hotspot[hotspot-id=\""+hotspot.getAttribute("id")+"\"]");this.$.hdetails.querySelector("#title").innerHTML=details.getAttribute("label");this.$.hdetails.querySelector("#desc").innerHTML=details.querySelector("#desc").innerHTML;this.$.hdetails.positionTarget=hotspot;this.__activeHotspot=hotspot;this.$.hdetails.open();this.resetHotspots();hotspot.classList.add("selected")},closeHotspot:function(){this.$.hdetails.querySelector("#title").innerHTML="";this.$.hdetails.querySelector("#desc").innerHTML="";this.resetHotspots();this.$.hdetails.close();this.__activeHotspot.focus()},resetHotspots:function(){let hotspots=this.querySelectorAll(".hotspot[role=\"button\"]");for(let i=0;i<hotspots.length;i++){hotspots[i].classList.remove("selected")}}});