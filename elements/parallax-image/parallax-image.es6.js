import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";/**
`parallax-image`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/let ParallaxImage=Polymer({_template:html`
    <style>
      :host {
        display: block;
        --parallax-image-background: "";
        --parallax-title-background: rgba(0, 0, 0, 0.3);
        --parallax-title-font: #fff;
      }

      .parallax_container {
        height: 400px;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
      }

      .parallax {
        background-image: var(--parallax-image-background);
        background-attachment: fixed;
        background-position: top center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 100%;
        justify-content: center;
      }

      #bgParallax {
        display: flex;
        align-items: center;
      }

      .title {
        background: var(--parallax-title-background);
        display: block;
        padding: 20px 15px;
        text-align: center;
        width: 40%;
        color: var(--parallax-title-font);
        font-size: 32px;
        position: absolute;
        margin-top: 120px;
      }

      @media screen and (max-width: 900px) {
        .title {
          font-size: 16px;
        }
      }
    </style>

    <a href="[[url]]" target$="[[_urlTarget(url)]]">
      <div class="parallax_container">
        <div id="bgParallax" class="parallax">
          <div class="title" id="titleParallax">
            <slot name="parallax_heading"></slot>
          </div>
        </div>
      </div>
    </a>
  `,is:"parallax-image",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{/**
     * Image
     */imageBg:{type:String,value:"",reflectToAttribute:!0},/**
     * Url
     */url:{type:String,value:"",reflectToAttribute:!0}},observers:["__updateStyles(imageBg)"],_urlTarget:function(url){if(url){const external=this._outsideLink(url);if(external){return"_blank"}}return!1},/**
   * Internal function to check if a url is external
   */_outsideLink:function(url){if(0!=url.indexOf("http"))return!1;var loc=location.href,path=location.pathname,root=loc.substring(0,loc.indexOf(path));return 0!=url.indexOf(root)},/**
   * Attached to the DOM, now fire.
   */attached:function(){// Establish hax property binding
let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Sample gizmo",description:"The user will be able to see this for selection in a UI.",icon:"av:play-circle-filled",color:"grey",groups:["Video","Media"],handles:[{type:"video",url:"source"}],meta:{author:"Your organization on github"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"}],advanced:[]}};this.setHaxProperties(props)},__updateStyles:function(imageBg){this.updateStyles({"--parallax-image-background":`url(${imageBg})`})},ready:function(){const bgParallax=this.$.bgParallax,titleParallax=this.$.titleParallax;window.addEventListener("scroll",e=>{const yParallaxPosition=-.2*window.scrollY,yParallaxPositionTitle=1.4*yParallaxPosition;bgParallax.style.backgroundPosition=`center ${yParallaxPosition}px`;titleParallax.style.transform=`translate3D(0, ${yParallaxPositionTitle}px, 0)`})}});export{ParallaxImage};