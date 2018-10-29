import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/iron-image/iron-image.js";import"./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";Polymer({_template:html`
    <style include="materializecss-styles">
      :host {
        display: block;
        width: 100%;
        min-height: 600px;
        height: 100%;
        max-height: 600px;
        overflow: hidden;
        position: relative;
      }
      .image {
        position: absolute;
        left: 0;
        right: 0;
      }
      .itemwrapper {
        position: absolute;
        bottom: 10%;
        left: 10%;
        width: 50%;
      }
      .title {
        background-color: rgba(0,0,0,0.5);
        padding: 10px 16px;
        font-size: 32px;
        color: #FFFFFF;
        margin: 4px 0;
        font-family: 'Roboto';
        font-weight: 500;
      }
      .details {
        background-color: rgba(0,0,0,0.5);
        padding: 10px 16px;
        font-size: 16px;
        color: #FFFFFF;
        margin: 4px 0;
        font-family: 'Roboto';
      }
      .linkbutton {
        padding: 0;
        margin: 8px 0;
        color: #FFFFFF;
        text-decoration: none;
        font-family: 'Roboto';
      }
      .linkbutton paper-button {
        text-transform: none;
        font-weight: bold;
      }
      @media screen and (max-width: 720px) {
        .title {
          font-size: 20px;
        }
        .details {
          font-size: 12px;
        }
        .itemwrapper {
          left: 5%;
          width: 50%;
        }
      }
      @media screen and (max-width: 500px) {
        .title {
          font-size: 16px;
        }
        .details {
          display: none;
        }
        .itemwrapper {
          left: 0;
          width: 300px;
        }
      }

    </style>
    <iron-image class="image" src\$="[[image]]" fade="" preload="" sizing="cover" style="background-color:grey;width: 100%;height: 100%;"></iron-image>
    <div class="itemwrapper">
      <div class="title">[[title]]</div>
      <div class="details">[[details]]</div>
      <a class="linkbutton" href\$="[[buttonLink]]"><paper-button raised="" class\$="[[buttonColorClass]] [[textColorClass]]">[[buttonText]]</paper-button></a>
    </div>
`,is:"hero-banner",behaviors:[HAXBehaviors.PropertiesBehaviors,A11yBehaviors.A11y,MaterializeCSSBehaviors.ColorBehaviors],properties:{title:{type:String,value:"Title"},image:{type:String},details:{type:String,value:"Details"},buttonText:{type:String,value:"Find out more"},buttonColor:{type:String,value:"red darken-4",observer:"_buttonColorChanged"},buttonColorClass:{type:String,reflectToAttribute:!0,computed:"_computeColorClass(buttonColor)"},buttonLink:{type:String},textColor:{type:String,value:"#FFFFFF",reflectToAttribute:!0},textColorClass:{type:String,value:null,reflectToAttribute:!0,computed:"_computeColorClass(textColor)"}},_buttonColorChanged:function(newValue){if(typeof newValue!==typeof void 0&&null!=newValue){this.computeTextPropContrast("textColor","buttonColor")}},_computeColorClass:function(color){if(null!=color&&"#ffffff"==color.toLowerCase()){return"white-text"}else if(null!=color&&"#000000"==color){return"black-text"}else if(null!=color&&"#"==color.substring(0,1)){return this._colorTransform(color.toLowerCase(),"","")}},attached:function(){this.setHaxProperties({canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"Hero image",description:"Typically fancy banner image calling your attention to something.",icon:"image:panorama",color:"red",groups:["Image","Media"],handles:[{type:"image",source:"image",title:"title",description:"details",link:"buttonLink"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"image",title:"Image",description:"URL of the image",inputMethod:"textfield",icon:"image:panorama"},{property:"details",title:"Details",description:"Additional text detail / teaser data",inputMethod:"textfield",icon:"editor:text-fields"},{property:"buttonText",title:"Button",description:"Label of the button",inputMethod:"textfield",icon:"icons:radio-button-unchecked"},{property:"buttonColor",title:"Button - Color",description:"Color of the button",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"buttonLink",title:"Button - Link",description:"Label of the button",inputMethod:"textfield",validationType:"url",icon:"icons:link"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"image",title:"Image",description:"URL of the image",inputMethod:"textfield",icon:"image:panorama"},{property:"details",title:"Details",description:"Additional text detail / teaser data",inputMethod:"textfield",icon:"editor:text-fields"},{property:"buttonText",title:"Button",description:"Label of the button",inputMethod:"textfield",icon:"icons:radio-button-unchecked"},{property:"buttonColor",title:"Button - Color",description:"Color of the button",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"buttonLink",title:"Button - Link",description:"Label of the button",inputMethod:"textfield",validationType:"url",icon:"icons:link"}],advanced:[]}})}});