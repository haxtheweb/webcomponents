import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";import"./node_modules/@polymer/iron-image/iron-image.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";let A11yGifPlayer=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
      :host #gifbutton > * {
        position: relative;
      }
      :host #svg {
        position: absolute;
        top: 35%;
        left: 35%;
      }
      :host #gifbutton:active,
      :host #gifbutton:focus,
      :host #gifbutton:hover {
        cursor: pointer;
        outline: 1px solid blue;
      }
      :host #preload {
        display: none;
      }
    </style>
    <div id="gifbutton" aria-role="button" aria-controls="gif" tabindex="0">
      <div>
        <img
          id="gif"
          alt\$="[[alt]]"
          src\$="[[srcWithoutAnimation]]"
          style="width:100%;height:100%;"
        />
        <svg
          id="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="30%"
          height="30%"
        >
          <g opacity=".5">
            <polygon
              points="30,20 30,180 170,100"
              fill="#000000"
              stroke="#ffffff"
              stroke-width="15px"
            ></polygon>
            <text x="50" y="115" fill="#ffffff" font-size="40px">GIF</text>
          </g>
        </svg>
      </div>
    </div>
    <iron-image id="preload" src\$="[[src]]" hidden=""></iron-image>
    <iron-a11y-keys
      id="a11y"
      keys="enter space"
      on-keys-pressed="toggleAnimation"
    ></iron-a11y-keys>
  `,is:"a11y-gif-player",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],listeners:{tap:"toggleAnimation"},properties:{src:{type:String,value:null},srcWithoutAnimation:{type:String,value:null},alt:{type:String,value:null}},ready:function(){this.stop();this.$.a11y.target=this.$.gifbutton},play:function(){this.__stopped=!0;this.toggleAnimation()},stop:function(){this.__stopped=!1;this.toggleAnimation()},toggleAnimation:function(){if(this.__stopped){this.__stopped=!1;this.$.svg.style.visibility="hidden";if(null!=this.src){this.$.gif.src=this.src}this.$.gif.alt=this.alt+" (Stop animation.)"}else{this.__stopped=!0;this.$.svg.style.visibility="visible";if(null!=this.srcWithoutAnimation){this.$.gif.src=this.srcWithoutAnimation}this.$.gif.alt=this.alt+" (Play animation.)"}},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Accessible GIF",description:"Makes animated GIFs accessible.",icon:"gif",color:"grey",groups:["Images","Media"],handles:[{type:"image",source:"src",source2:"srcWithoutAnimation",alt:"alt"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"src",title:"Animated GIF",description:"The URL to your animated GIF.",inputMethod:"textfield",icon:"link",validationType:"url",required:!0},{property:"srcWithoutAnimation",title:"Still Image",description:"The URL to a still image version of your GIF.",inputMethod:"textfield",icon:"link",validationType:"url",required:!0},{property:"alt",title:"Alt Text",description:"Alternative text for the image.",inputMethod:"textfield",icon:"accessibility",required:!0}],configure:[{property:"src",title:"Animated GIF",description:"The URL to your animated GIF.",inputMethod:"textfield",icon:"link",validationType:"url",required:!0},{property:"srcWithoutAnimation",title:"Still Image",description:"The URL to a still image version of your GIF.",inputMethod:"textfield",icon:"link",validationType:"url",required:!0},{property:"alt",title:"Alt Text",description:"Alternative text for the image.",inputMethod:"textfield",icon:"accessibility",required:!0}],advanced:[]}};this.setHaxProperties(props)}});export{A11yGifPlayer};