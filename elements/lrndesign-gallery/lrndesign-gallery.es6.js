import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js";import"./lib/lrndesign-gallery-details.js";import"./lib/lrndesign-gallery-carousel.js";import"./lib/lrndesign-gallery-grid.js";export{LrndesignGallery};class LrndesignGallery extends SimpleColors{static get tag(){return"lrndesign-gallery"}static get behaviors(){return[SimpleColors]}static get template(){return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
        }
        :host {
          --lrndesign-gallery-color: var(--simple-colors-default-theme-grey-12);
          --lrndesign-gallery-background-color: var(
            --simple-colors-default-theme-grey-2
          );
          --lrndesign-gallery-focus-color: var(
            --simple-colors-default-theme-accent-9
          );
          --lrndesign-gallery-border-color: var(
            --simple-colors-default-theme-grey-4
          );
          --lrndesign-gallery-thumbnail-outline: 1px solid
            var(--simple-colors-default-theme-grey-12);
          --lrndesign-gallery-carousel-next-bg: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.7) 70%,
            rgba(255, 255, 255, 0.9) 90%
          );
          --lrndesign-gallery-carousel-prev-bg: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.9) 10%,
            rgba(255, 255, 255, 0.7) 30%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          --lrndesign-gallery-thumbnail-size: 100px;
          --lrndesign-gallery-thumbnail-size-sm: 150px;
          --lrndesign-gallery-thumbnail-size-md: 200px;
          --lrndesign-gallery-thumbnail-size-lg: 250px;
          --lrndesign-gallery-thumbnail-size-xl: 300px;
          --lrndesign-gallery-thumbnail-image: {
            display: block;
            border-radius: 3px;
            border: 2px solid transparent;
          }
          --lrndesign-gallery-thumbnail-image-focus: {
            opacity: 0.7;
            border: 2px solid var(--lrndesign-gallery-focus-color);
          }
          --lrndesign-gallery-thumbnail-image-selected: {
            opacity: 0.5;
            cursor: default;
          }
        }
        :host([dark]) {
          --lrndesign-gallery-border-color: var(
            --simple-colors-default-theme-grey-1
          );
          --lrndesign-gallery-carousel-next-bg: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.7) 70%,
            rgba(0, 0, 0, 0.9) 90%
          );
          --lrndesign-gallery-carousel-prev-bg: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.9) 10%,
            rgba(0, 0, 0, 0.7) 30%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0) 100%
          );
        }
        :host .gallery-print {
          display: none;
        }
        @media print {
          :host .gallery-print {
            margin-top: 15px;
            margin-bottom: 15px;
            display: block;
          }
          :host .gallery-print .print-image {
            max-width: 400px;
            max-height: 400px;
            display: block;
            border: 1px solid #ddd;
            page-break-inside: avoid;
          }
        }
      </style>
      <article>
        <template is="dom-if" if="[[_isAttrSet(title)]]">
          <h1 id="gallery-title">[[title]]</h1>
        </template>
        <div id="gallery-description"><slot name="description"></slot></div>
        <template is="dom-if" if="[[grid]]">
          <lrndesign-gallery-grid
            aspect$="[[aspect]]"
            class="gallery-type"
            id="gallery-grid"
            items$="[[__items]]"
            modal-open$="[[__modalOpen]]"
            responsive-size$="[[responsiveSize]]"
            selected$="[[selected]]"
            sizing$="[[sizing]]"
          >
          </lrndesign-gallery-grid>
        </template>
        <template is="dom-if" if="[[!grid]]">
          <lrndesign-gallery-carousel
            aspect$="[[aspect]]"
            class="gallery-type"
            hide-navigation$="[[__hideNav]]"
            id="gallery-carousel"
            items$="[[__items]]"
            modal-open$="[[__modalOpen]]"
            responsive-size$="[[responsiveSize]]"
            selected$="[[selected]]"
            sizing$="[[sizing]]"
          >
          </lrndesign-gallery-carousel>
        </template>

        <template id="printlist" is="dom-repeat" items="[[items]]" as="item">
          <section class="gallery-print">
            <template is="dom-if" if="[[hasTitle]]">
              <h2>[[item.title]]</h2>
            </template>
            <lrndesign-gallery-details
              details$="[[item.details]]"
            ></lrndesign-gallery-details>
            <img class="print-image" alt$="[[item.alt]]" src$="[[item.src]]" />
          </section>
        </template>
      </article>
    `}static get properties(){return{grid:{type:Boolean,value:!1},sources:{type:Array,value:[]},items:{type:Array,computed:"_itemsLoaded(sources,sizing)"},responsiveSize:{type:String,value:"xs",reflectToAttribute:!0},selected:{type:Object,value:{},notify:!0,reflectToAttribute:!0},sizing:{type:String,value:"cover"},title:{type:String,value:null},__modalOpen:{type:Boolean,value:!1}}}connectedCallback(){super.connectedCallback();let root=this;window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0}}))}_itemsLoaded(sources,sizing){let temp=sources.slice(),anchor=window.location.hash,index=sources.findIndex(i=>"#"+i.id===anchor.replace("-zoom",""));if(sources!==void 0&&null!==this.items&&0<sources.length){for(var i in temp){temp[i].index=parseInt(i);temp[i].large=temp[i].large!==void 0?temp[i].large:temp[i].src;temp[i].next=parseInt(i)+1<sources.length?parseInt(i)+1:-1;temp[i].prev=-1<parseInt(i)-1?parseInt(i)-1:-1;temp[i].sizing=temp[i].sizing!==void 0?temp[i].sizing:sizing;temp[i].tooltip=temp[i].title!==void 0?"Zoom In":temp[i].title+" Zoom";temp[i].thumbnail=temp[i].thumbnail!==void 0?temp[i].thumbnail:temp[i].src;temp[i].zoom=temp[i].zoom!==void 0?temp[i].zoom:!0;if(!temp[i].zoom){temp[i].heading=temp[i].title===void 0?"Image Information":temp[i].title;temp[i].tooltip=temp[i].title===void 0?"View Image Information":temp[i].title+" Information"}else{temp[i].heading=temp[i].title===void 0?"Image Zoom":temp[i].title+" (Image Zoom)";temp[i].tooltip=temp[i].title===void 0?"Zoom In":temp[i].title+" Zoom"}}this.__items=temp;this.selected=-1<index?this.__items[index]:this.__items[0];return this.__items}}_isAttrSet(attr){return null!==attr&&attr!==void 0}}window.customElements.define(LrndesignGallery.tag,LrndesignGallery);