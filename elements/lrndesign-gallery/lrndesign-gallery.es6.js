import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{LrndesignGalleryBehaviors}from"./lib/lrndesign-gallery-behaviors.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./lib/lrndesign-gallery-carousel.js";import"./lib/lrndesign-gallery-grid.js";export{LrndesignGallery};class LrndesignGallery extends LrndesignGalleryBehaviors{static get tag(){return"lrndesign-gallery"}static get behaviors(){return[LrndesignGalleryBehaviors]}static get template(){return html`
      <style is="custom-style" include="simple-colors-shared-styles">
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
      </style>
      <div id="gallery">
        <template is="dom-if" if="[[!grid]]" restamp>
          <lrndesign-gallery-carousel
            accent-color$="[[accentColor]]"
            aspect-ratio$="[[aspectRatio]]"
            title$="[[title]]"
            dark$="[[dark]]"
            gallery-id$="[[id]]"
            responsive-size$="[[responsiveSize]]"
            sizing$="[[sizing]]"
            sources="[[sources]]"
            title$="[[title]]"
          >
            <div slot="description"></div>
          </lrndesign-gallery-carousel>
        </template>
        <template is="dom-if" if="[[grid]]">
          <lrndesign-gallery-grid
            accent-color$="[[accentColor]]"
            aspect-ratio$="[[aspectRatio]]"
            dark$="[[dark]]"
            gallery-id$="[[id]]"
            responsive-size$="[[responsiveSize]]"
            sizing$="[[sizing]]"
            sources="[[sources]]"
            title$="[[title]]"
          >
            <div slot="description"></div>
          </lrndesign-gallery-grid>
        </template>
      </div>
    `}static get haxProperties(){return{canScale:!1,canPosition:!1,canEditSource:!0,gizmo:{title:"Image Gallery",description:"An image gallery displayed as a carousel or a grid",icon:"image:collections",color:"cyan",groups:["Content","Instructional","Media","Image"],handles:[{type:"image",source:"image"}],meta:{author:"LRNWebComponents"}},settings:{quick:[],configure:[{property:"title",title:"Gallery Title",description:"A title for the gallery.",inputMethod:"textfield",icon:"editor:title"},{property:"accentColor",title:"Accent Color",description:"An optional accent color.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark Theme",description:"Enable Dark Theme",inputMethod:"boolean",icon:"icons:invert-colors"},{property:"grid",title:"Grid View",description:"Display as grid?",inputMethod:"boolean",icon:"icons:view-module"},{slot:"description",title:"Gallery Description",description:"An optional description for the gallery.",inputMethod:"textfield"},{property:"sources",title:"Gallery Images",description:"The images for the gallery.",inputMethod:"array",properties:[{property:"title",title:"Image Title",description:"The heading for the image.",inputMethod:"textfield"},{property:"details",title:"Image Details",description:"The body text with details for the image.",inputMethod:"textfield"},{property:"src",title:"Image Source",description:"The path of the image.",inputMethod:"textfield"},{property:"thumbnail",title:"Image Thumbnail Source",description:"The path of an optional thumbnail version of the image.",inputMethod:"textfield"},{property:"large",title:"Image Full Size Source",description:"The path of an optional large version of the image for zooming.",inputMethod:"textfield"}]}],advanced:[{property:"aspectRatio",title:"Aspect Ratio",description:"Custom aspect ratio, default is calculated based on the first image's aspect ratio",inputMethod:"textfield"},{property:"sizing",title:"Fit to Aspect Ratio",description:"Fit images to aspect ratio",inputMethod:"select",options:{cover:"crop",contain:"letterbox"}}]}};this.setHaxProperties(props)}static get properties(){return{}}connectedCallback(){let root=this;super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(LrndesignGallery.haxProperties,LrndesignGallery.tag,this);root.__gallery=root.$.gallery;root.anchorData=root._getAnchorData();window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0}}))}ready(){super.ready()}}window.customElements.define(LrndesignGallery.tag,LrndesignGallery);