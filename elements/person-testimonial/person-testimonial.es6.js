import{html}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";/**
 * `person-testimonial`
 * `Leaving a testimonial from a person to say your company rocks!`
 * @demo demo/index.html
 */class PersonTestimonial extends SimpleColors{constructor(){super();import("./node_modules/@polymer/paper-card/paper-card.js");import("./node_modules/@polymer/iron-image/iron-image.js");import("./node_modules/@polymer/iron-icon/iron-icon.js");import("./node_modules/@lrnwebcomponents/person-testimonial/lib/person-testimonial-icon.js");afterNextRender(this,function(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(PersonTestimonial.haxProperties,PersonTestimonial.tag,this)})}static get template(){return html`
      <style>
        :host {
          display: block;
          --person-testimonial-font-family: sans-serif;
          --person-testimonial-bg: var(--simple-colors-default-theme-grey-1);
          --person-testimonial-color: var(
            --simple-colors-default-theme-accent-7
          );
          --person-testimonial-text: var(--simple-colors-default-theme-grey-12);
        }

        paper-card {
          display: inline-flex;
          background-color: var(--person-testimonial-bg);
          color: var(--person-testimonial-text);
          font-family: var(--person-testimonial-font-family);
        }

        iron-image {
          display: block;
          width: 150px;
          height: 100%;
        }
        .image {
          padding-right: 5px;
          background-color: var(--person-testimonial-color);
        }

        iron-icon {
          --iron-icon-height: 24px;
          --iron-icon-width: 24px;
          --iron-icon-fill-color: var(--person-testimonial-color);
        }

        .wrap {
          margin: 15px;
        }

        .testimonial {
          line-height: 24px;
          font-size: 16px;
          font-style: italic;
        }

        .name {
          font-size: 21px;
          text-transform: uppercase;
          font-weight: bold;
          margin-top: 20px;
        }

        .position {
          font-size: 14px;
          margin-top: 5px;
        }

        .arrow_right {
          width: 0;
          height: 0;
          border-top: 15px solid var(--person-testimonial-bg);
          border-bottom: 15px solid var(--person-testimonial-bg);
          border-left: solid 15px transparent;
          background-color: var(--person-testimonial-color);
          position: relative;
          top: 55px;
        }

        #quotestart {
          display: inline-flex;
          transform: rotateY(180deg);
        }

        #quoteend {
          display: inline-flex;
        }

        @media screen and (max-width: 850px) {
          paper-card {
            display: flex;
            flex-wrap: wrap;
          }
          iron-image {
            display: block;
            border-radius: 50%;
            width: 200px;
            height: 200px;
          }
          .image {
            margin-top: 25px;
            border-radius: 50%;
            padding: 5px;
            margin-left: auto;
            margin-right: auto;
          }
          .arrow_right {
            display: none;
          }
          .name,
          .position {
            text-align: center;
          }
        }
      </style>
      <paper-card elevation="[[elevation]]">
        <div class="image">
          <iron-image
            src="[[image]]"
            sizing="cover"
            preload=""
            fade=""
          ></iron-image>
        </div>
        <div class="arrow_right"></div>
        <div class="wrap">
          <div class="testimonial">
            <iron-icon
              id="quotestart"
              icon="persontestimonial:format-quote"
            ></iron-icon>
            <slot></slot>
            <iron-icon
              id="quoteend"
              icon="persontestimonial:format-quote"
            ></iron-icon>
          </div>
          <div class="name">[[name]]</div>
          <div class="position">[[position]]</div>
        </div>
      </paper-card>
    `}static get tag(){return"person-testimonial"}static get properties(){let props={/**
       * Visual height of the card.
       */elevation:{type:Number,value:1,reflectToAttribute:!0},/**
       * The profile image to display to the left of the quote.
       */image:{type:String},/**
       * Name of the person making the quote.
       */name:{type:String},/**
       * The title / position of the person in question.
       */position:{type:String}};if(super.properties){props=Object.assign(props,super.properties)}return props}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!0,gizmo:{title:"Testimonial",description:"A person saying a nice thing about us",icon:"editor:format-quote",color:"orange",groups:["Content","Presentation"],handles:[{type:"image",source:"image",title:"name",caption:"position"}],meta:{author:"EberlyODL / LRNWebComponents"}},settings:{quick:[{property:"image",title:"Image",description:"Adds image to this testimonial",inputMethod:"textfield",icon:"editor:insert-photo"},{property:"name",title:"Full Name",description:"Credit the person making the testimonial",inputMethod:"textfield",icon:"account-circle"},{property:"position",title:"Position or Job Title",description:"List the position and job title",inputMethod:"textfield",icon:"icons:work"},{property:"accentColor",title:"Accent color",description:"Select the accent color use",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark",description:"Use dark theme",inputMethod:"boolean",icon:"invert-colors"}],configure:[{property:"image",title:"Image",description:"Adds image to testimonial",inputMethod:"haxupload",icon:"editor:insert-photo"},{property:"accentColor",title:"Accent color",description:"Select the accent color use",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark",description:"Use dark theme",inputMethod:"boolean",icon:"invert-colors"},{slot:"",title:"User's testimonial:",description:"This is where you enter your testimonial.",inputMethod:"code-editor",required:!0},{property:"name",title:"Full Name",description:"Credit the person making the testimonial",inputMethod:"textfield",icon:"account-circle"},{property:"position",title:"Position or Job Title",description:"List the position and job title",inputMethod:"textfield",icon:"icons:work"}],advanced:[]}}}}window.customElements.define(PersonTestimonial.tag,PersonTestimonial);export{PersonTestimonial};