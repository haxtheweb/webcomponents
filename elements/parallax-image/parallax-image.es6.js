import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{SchemaBehaviors}from"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";/**
 * `parallax-image`
 * @demo demo/index.html
 */class ParallaxImage extends SchemaBehaviors(PolymerElement){constructor(){super();afterNextRender(this,function(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(ParallaxImage.haxProperties,ParallaxImage.tag,this)})}static get template(){return html`
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
    `}static get tag(){return"parallax-image"}static get properties(){let props={/**
       * Image
       */imageBg:{type:String,value:"",reflectToAttribute:!0},/**
       * Url
       */url:{type:String,value:"",reflectToAttribute:!0}};if(super.properties){props=Object.assign(props,super.properties)}return props}static get observers(){return["__updateStyles(imageBg)"]}_urlTarget(url){if(url){const external=this._outsideLink(url);if(external){return"_blank"}}return!1}/**
   * Internal function to check if a url is external
   */_outsideLink(url){if(0!=url.indexOf("http"))return!1;var loc=location.href,path=location.pathname,root=loc.substring(0,loc.indexOf(path));return 0!=url.indexOf(root)}__updateStyles(imageBg){this.updateStyles({"--parallax-image-background":`url(${imageBg})`})}ready(){super.ready();const bgParallax=this.$.bgParallax,titleParallax=this.$.titleParallax;window.addEventListener("scroll",e=>{const yParallaxPosition=-.2*window.scrollY,yParallaxPositionTitle=1.4*yParallaxPosition;bgParallax.style.backgroundPosition=`center ${yParallaxPosition}px`;titleParallax.style.transform=`translate3D(0, ${yParallaxPositionTitle}px, 0)`})}disconnectedCallback(){window.removeEventListener("scroll",e=>{const yParallaxPosition=-.2*window.scrollY,yParallaxPositionTitle=1.4*yParallaxPosition;bgParallax.style.backgroundPosition=`center ${yParallaxPosition}px`;titleParallax.style.transform=`translate3D(0, ${yParallaxPositionTitle}px, 0)`});super.disconnectedCallback()}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Sample gizmo",description:"The user will be able to see this for selection in a UI.",icon:"av:play-circle-filled",color:"grey",groups:["Video","Media"],handles:[{type:"video",url:"source"}],meta:{author:"Your organization on github"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"}],advanced:[]}}}}window.customElements.define(ParallaxImage.tag,ParallaxImage);export{ParallaxImage};