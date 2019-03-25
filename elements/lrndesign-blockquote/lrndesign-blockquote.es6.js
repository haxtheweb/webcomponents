import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{pathFromUrl}from"./node_modules/@polymer/polymer/lib/utils/resolve-url.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@polymer/paper-styles/shadow.js";let LrndesignBlockquote=Polymer({_template:html`
    <custom-style>
      <style is="custom-style" include="simple-colors">
        :host {
          display: inline-block;
          position: relative;
          box-sizing: border-box;
          font-size: 16px;
          z-index: 0;
        }

        :host([display-mode="hypercard"]) ::slotted(*) {
          -webkit-filter: grayscale(1) contrast(300%);
          filter: grayscale(1) contrast(300%);
          font-family: Chikarego, Helvetica, sans-serif;
          transition: all 0.6s ease;
        }

        /* Let's set and reset some common styles */
        .mb-wrap {
          width: 300px;
          margin: 20px auto;
          padding: 20px;
          position: relative;
        }
        .mb-wrap p {
          margin: 0;
          padding: 0;
        }
        .mb-wrap blockquote {
          margin: 0;
          padding: 0;
          position: relative;
        }
        .mb-wrap cite {
          font-style: normal;
        }
        p ::slotted(*) {
          font-size: 16px;
        }
        :host([display-mode="default"]) .mb-wrap {
          background-color: #fff9c4;
          color: var(--lrndesign-blockquote-color, #222222);
        }
        :host([display-mode="default"]) .mb-wrap blockquote {
          font-size: 19.2px;
          font-style: italic;
          margin: 4px 0;
          padding: 24px 24px 24px 40px;
          line-height: 1.5;
          position: relative;
          color: var(--lrndesign-blockquote-color, #222222);
        }
        :host([display-mode="default"]) .mb-wrap cite {
          color: var(--lrndesign-blockquote-cite, #222222);
          font-size: 12.8px;
          display: block;
          margin-top: 4px;
          text-align: right;
        }

        :host([display-mode="leather"]) .mb-wrap {
          background: #363738 repeat top left;
          margin-top: 100px;
          padding-top: 100px;
          width: 400px;
          color: #fff;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
          border-top: 10px solid #fff;
        }
        :host([display-mode="leather"]) .mb-wrap .mb-thumb {
          display: block;
          width: 180px;
          height: 180px;
          border: 10px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          background-clip: padding-box !important;
          background-size: contain !important;
          position: absolute;
          left: 50%;
          top: -90px;
          margin: 0 0 0 -90px;
          box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.5),
            0 2px 3px rgba(0, 0, 0, 0.6);
        }
        :host([display-mode="leather"]) .mb-wrap blockquote:before,
        :host([display-mode="leather"]) .mb-wrap blockquote:after {
          position: absolute;
          font-size: 164px;
          top: -95px;
          color: #242526;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        :host([display-mode="leather"]) .mb-wrap blockquote:before {
          content: "“";
        }

        :host([display-mode="leather"]) .mb-wrap blockquote:after {
          right: 0px;
          content: "”";
        }
        :host([display-mode="leather"]) .mb-wrap blockquote p {
          font-family: Cambria, Georgia, serif;
          font-style: italic;
          font-size: 25px;
          font-weight: 400;
          border-bottom: 1px solid rgba(0, 0, 0, 0.5);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
          padding: 10px 10px 20px 10px;
          text-align: center;
          margin: 0 0 20px 0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
        }
        :host([display-mode="leather"]) .mb-wrap blockquote p ::slotted(*) {
          font-family: Cambria, Georgia, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 25px;
          text-align: center;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
        }

        :host([display-mode="leather"]) .mb-wrap .mb-attribution {
          text-align: right;
        }

        :host([display-mode="leather"]) .mb-wrap .mb-author {
          text-transform: uppercase;
          font-size: 20px;
          font-weight: bold;
          color: #cccccc;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        :host([display-mode="leather"]) .mb-wrap cite a {
          color: #f0f0f0;
          font-style: italic;
          font-weight: 400;
          font-family: Cambria, Georgia, serif;
          text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
        }

        :host([display-mode="leather"]) .mb-wrap cite a:hover {
          text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.9);
        }

        :host([display-mode="swoop"]) .mb-wrap blockquote {
          padding-top: 150px;
        }
        :host([display-mode="swoop"]) .mb-wrap blockquote:after {
          background: rgba(235, 150, 108, 0.8);
          width: 130px;
          height: 130px;
          border-radius: 50%;
          content: "”";
          position: absolute;
          font-size: 164px;
          line-height: 200px;
          text-align: center;
          top: 0px;
          left: 50%;
          margin-left: -65px;
          color: rgba(255, 255, 255, 0.5);
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
        }
        :host([display-mode="swoop"]) .mb-wrap blockquote:before {
          content: "";
          width: 500px;
          height: 500px;
          border-radius: 50%;
          border-left: 5px solid rgba(235, 150, 108, 0.1);
          position: absolute;
          top: 0px;
          left: -50px;
          z-index: -1;
        }
        :host([display-mode="swoop"]) .mb-wrap blockquote p {
          font-family: Baskerville, Georgia, serif;
          font-size: 28px;
          font-style: italic;
          background: rgba(255, 255, 255, 0.5);
          display: inline;
          color: rgba(235, 150, 108, 0.8);
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
          line-height: 46px;
          box-shadow: 0 -6px 0 rgba(235, 150, 108, 0.2);
        }
        :host([display-mode="swoop"]) .mb-wrap .mb-attribution {
          text-align: right;
        }

        :host([display-mode="swoop"]) .mb-wrap .mb-author {
          text-transform: uppercase;
          font-size: 18px;
          padding-top: 10px;
          font-weight: bold;
          color: #d48158;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        :host([display-mode="swoop"]) .mb-wrap cite a {
          color: #d7aa94;
          font-style: italic;
        }

        :host([display-mode="swoop"]) .mb-wrap cite a:hover {
          color: #d48158;
        }

        :host([display-mode="soft"]) .mb-wrap {
          width: 500px;
        }

        :host([display-mode="soft"]) .mb-wrap blockquote {
          background: #fff;
          padding: 30px;
          border-radius: 5px;
          box-shadow: inset 0 2px 0 rgba(188, 147, 200, 0.7),
            -5px -4px 25px rgba(0, 0, 0, 0.3);
        }
        :host([display-mode="soft"]) .mb-wrap blockquote:after,
        :host([display-mode="soft"]) .mb-wrap blockquote:before {
          top: 100%;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }

        :host([display-mode="soft"]) .mb-wrap blockquote:after {
          border-top-color: #ffffff;
          border-width: 10px;
          left: 65%;
          margin-left: -10px;
        }

        :host([display-mode="soft"]) .mb-wrap blockquote:before {
          border-top-color: rgba(0, 0, 0, 0.01);
          border-width: 11px;
          left: 65%;
          margin-left: -11px;
        }
        :host([display-mode="soft"]) .mb-wrap blockquote p {
          font-family: "Alegreya", serif;
          font-size: 24px;
          color: #b4b4b4;
          font-weight: 400;
          line-height: 40px;
          font-style: italic;
          text-indent: 100px;
          position: relative;
        }
        :host([display-mode="soft"]) .mb-wrap blockquote p:before {
          content: "“";
          font-family: serif;
          font-style: normal;
          font-weight: 700;
          position: absolute;
          font-size: 175px;
          top: 0px;
          left: -105px;
          color: rgba(188, 147, 200, 1);
          text-shadow: 7px 14px 10px rgba(0, 0, 0, 0.1);
        }
        :host([display-mode="soft"]) .mb-wrap .mb-attribution {
          text-align: right;
          padding: 20px 100px 20px 20px;
          position: relative;
        }
        :host([display-mode="soft"]) .mb-wrap .mb-thumb {
          display: block;
          width: 70px;
          height: 70px;
          border: 5px solid #fff;
          border-radius: 50%;
          background-clip: padding-box !important;
          background-size: contain !important;
          position: absolute;
          right: 10px;
          bottom: 5px;
          box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.5),
            0 2px 3px rgba(0, 0, 0, 0.6);
        }
        :host([display-mode="soft"]) .mb-wrap .mb-author {
          font-family: "Alegreya SC", serif;
          font-weight: 700;
          font-size: 18px;
          color: black;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
        }

        :host([display-mode="soft"]) .mb-wrap cite a {
          font-family: "Alegreya", serif;
          font-weight: 700;
          font-style: italic;
          color: black;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
        }

        :host([display-mode="soft"]) .mb-wrap cite a:hover {
          color: rgba(188, 147, 200, 1);
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
        }

        :host([display-mode="poster"]) .mb-wrap {
          width: 600px;
          padding: 20px 240px 50px 20px;
          overflow: hidden;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6);
        }
        :host([display-mode="poster"]) .mb-wrap blockquote p {
          color: rgba(255, 255, 255, 0.95);
          font-size: 21px;
          line-height: 26px;
          text-align: right;
          color: #999;
          text-transform: uppercase;
          font-weight: bold;
        }
        :host([display-mode="poster"]) .mb-wrap blockquote p ::slotted(span) {
          font-weight: 700;
          color: #fcf779;
          font-size: 58px;
          line-height: 58px;
          display: block;
          padding: 10px;
          text-shadow: 7px 7px 2px rgba(0, 0, 0, 0.2);
          transform: rotate(-7deg) translateY(10px);
        }
        :host([display-mode="poster"])
          .mb-wrap
          blockquote
          p
          ::slotted(span):before {
          content: "“";
          font-weight: normal;
          opacity: 0.1;
          font-size: 200px;
          position: absolute;
          color: #fff;
          top: -50px;
          left: -25px;
          transform: rotate(45deg);
        }
        :host([display-mode="poster"]) .mb-wrap .mb-attribution {
          text-align: right;
          text-transform: uppercase;
          font-weight: bold;
          background: #222;
          position: absolute;
          width: 100%;
          left: 0px;
          bottom: 0px;
          text-align: center;
          padding: 30px;
          transform: rotate(-40deg) translate(175px, 110px);
        }
        :host([display-mode="poster"]) .mb-wrap .mb-author {
          color: #fcf779;
        }
        :host([display-mode="poster"]) .mb-wrap .mb-author:before {
          content: "-";
          padding-right: 4px;
        }

        :host([display-mode="poster"]) .mb-wrap .mb-attribution cite a {
          color: #fcf779;
        }

        :host([display-mode="poster"]) .mb-wrap .mb-attribution cite a:hover {
          color: #fcf779;
        }

        :host([display-mode="fun"]) .mb-wrap {
          width: 390px;
        }

        :host([display-mode="fun"]) .mb-wrap blockquote {
          text-align: center;
          background: #333;
          width: 350px;
          height: 350px;
          padding: 60px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 10px #333,
            inset 0 0 0 12px rgba(255, 255, 255, 0.6),
            80px 0 0 rgba(255, 255, 255, 0.3),
            -80px 0 0 rgba(255, 255, 255, 0.3), 50px 0 0 rgba(60, 185, 145, 0.2),
            -50px 0 0 rgba(185, 60, 60, 0.2);
        }
        :host([display-mode="fun"]) .mb-wrap blockquote p {
          color: #fff;
          font-size: 20px;
          font-weight: 400;
          padding-top: 25px;
          text-transform: uppercase;
          text-shadow: 0 0 1px #fff, 0 1px 1px #000;
          font-family: "Annie Use Your Telescope", cursive;
        }
        :host([display-mode="fun"]) .mb-wrap blockquote p ::slotted(span) {
          display: block;
          position: relative;
          padding-top: 40px;
          margin-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }
        :host([display-mode="fun"])
          .mb-wrap
          blockquote
          p
          ::slotted(span):before {
          position: absolute;
          width: 50px;
          height: 50px;
          background: #ddd;
          content: "“";
          font-size: 40px;
          color: #333;
          top: 0px;
          left: 50%;
          margin: -25px 0 0 -25px;
          border-radius: 50%;
        }
        :host([display-mode="fun"]) .mb-wrap .mb-attribution {
          text-align: center;
          font-family: "Annie Use Your Telescope", cursive;
          padding: 20px;
          font-size: 16px;
        }
        :host([display-mode="fun"]) .mb-wrap cite a:hover {
          color: #000;
        }

        :host([display-mode="photo"]) .mb-wrap {
          width: 350px;
          background: #fff;
          border-radius: 4px;
        }
        /* Shadow style from Nicolas Gallagher: http://nicolasgallagher.com/css-drop-shadows-without-images/demo/ */
        :host([display-mode="photo"]) .mb-wrap:before,
        :host([display-mode="photo"]) .mb-wrap:after {
          content: " ";
          position: absolute;
          z-index: -1;
          transform: rotate(-3deg);
          bottom: 10px;
          box-shadow: 0 15px 10px rgba(0, 0, 0, 0.7);
          height: 20%;
          left: 2px;
          max-height: 100px;
          max-width: 300px;
          width: 50%;
        }
        :host([display-mode="photo"]) .mb-wrap:after {
          transform: rotate(3deg);
          left: auto;
          right: 2px;
        }
        :host([display-mode="photo"]) .mb-wrap blockquote {
          background: #333;
          height: 75%;
          padding: 30px;
          text-align: center;
        }
        :host([display-mode="photo"]) .mb-wrap blockquote:before {
          color: rgba(255, 255, 255, 0.2);
          position: absolute;
          content: "”";
          font-size: 150px;
          line-height: 130px;
          font-style: italic;
          top: 0px;
          right: 20px;
          font-family: Cambria, Georgia, serif;
        }
        :host([display-mode="photo"]) .mb-wrap blockquote p {
          color: #fff;
          font-family: "Abril Fatface", sans-serif;
          font-size: 24px;
          text-shadow: 1px 1px 1px #000;
        }
        :host([display-mode="photo"]) .mb-wrap .mb-attribution {
          padding: 20px;
        }
        :host([display-mode="photo"]) .mb-wrap .mb-author {
          font-size: 24px;
          font-family: "Dr Sugiyama", cursive;
          transform: rotate(-4deg);
          color: #070d5f;
          text-align: center;
          min-height: 40px;
          line-height: 40px;
        }
        :host([display-mode="photo"]) .mb-wrap cite {
          display: block;
          text-align: center;
        }
        :host([display-mode="photo"]) .mb-wrap cite a {
          color: #999;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 12px;
        }
        :host([display-mode="photo"]) .mb-wrap cite a:hover {
          color: #000;
        }
        :host([display-mode="photo"]) .mb-wrap .mb-thumb {
          display: block;
          width: 70px;
          height: 70px;
          border: 5px solid #fff;
          border-radius: 50%;
          background-clip: padding-box !important;
          background-size: contain !important;
          position: absolute;
          left: 30px;
          bottom: 30px;
          box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.5),
            0 2px 3px rgba(0, 0, 0, 0.6);
        }
        /* BEGIN HYPERCARDIFY, thanks @realdlnorman */
        :host([display-mode="hypercard"]) ::slotted(*) {
          -webkit-filter: grayscale(1) contrast(300%);
          filter: grayscale(1) contrast(300%);
          font-family: Chikarego, Helvetica, sans-serif;
          transition: all 0.6s ease;
        }
        /* Disable grayscale on hover */
        :host([display-mode="hypercard"]:hover) ::slotted(*) {
          -webkit-filter: grayscale(0);
          filter: none;
        }
      </style>
    </custom-style>
    <div id="wrap" class="mb-wrap">
      <div id="thumb" class="mb-thumb"></div>
      <blockquote cite$="[[sourceLink]]">
        <p><slot></slot></p>
      </blockquote>
      <div class="mb-attribution">
        <p class="mb-author">[[author]]</p>
        <cite><a href$="[[sourceLink]]">[[citation]]</a></cite>
      </div>
    </div>
  `,is:"lrndesign-blockquote",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{citation:{type:String,notify:!0},image:{type:String,notify:!0,observer:"_imageChanged"},author:{type:String,notify:!0},sourceLink:{type:String,notify:!0},displayMode:{type:String,reflectToAttribute:!0,notify:!0,value:"default",observer:"_displayModeChanged"}},_imageChanged:function(newValue,oldValue){if("hypercard"==this.displayMode){this.$.wrap.style.cssText="";this.$.thumb.style.cssText=""}else if("poster"==this.displayMode){this.$.wrap.style.cssText="background: #444 url("+newValue+") no-repeat 140% 25%";this.$.thumb.style.cssText=""}else{this.$.wrap.style.cssText="";this.$.thumb.style.cssText="background: url("+newValue+") no-repeat center center"}},_displayModeChanged:function(newValue,oldValue){if("hypercard"==newValue){this.$.wrap.style.cssText="";this.$.thumb.style.cssText="";let style=document.createElement("style"),basePath=pathFromUrl(decodeURIComponent(import.meta.url));style.innerHTML=`@font-face {
        font-family: 'Chikarego';
        font-display: swap;
        src: url('${basePath}lib/chikarego2-webfont.woff2') format('woff2'),
             url('${basePath}lib/chikarego2-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }`;document.head.appendChild(style)}else if("poster"==newValue){this.$.wrap.style.cssText="background: #444 url("+this.image+") no-repeat 140% 25%";this.$.thumb.style.cssText=""}else{this.$.wrap.style.cssText="";this.$.thumb.style.cssText="background: url("+this.image+") no-repeat center center"}},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!0,gizmo:{title:"Fancy quote",description:"Presents a famous quote with additional design options.",icon:"editor:format-quote",color:"grey",groups:["Content","Presentation"],handles:[{type:"image",source:"image",src:"image",author:"author",description:"",citation:"citation"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"displayMode",title:"Display style",description:"Style to present the quote with",inputMethod:"select",icon:"image:style",options:{default:"Default",leather:"Leather",swoop:"Swoop",soft:"Soft",poster:"Poster",fun:"Fun",photo:"Photo",hypercard:"Hypercard"}},{property:"image",title:"Image",description:"Picture of the author of this quote",inputMethod:"textfield",icon:"editor:short-text",required:!1,validationType:"text"}],configure:[{property:"displayMode",title:"Display style",description:"Style to present the quote with",inputMethod:"select",icon:"image:style",options:{default:"Default",leather:"Leather",swoop:"Swoop",soft:"Soft",poster:"Poster",fun:"Fun",photo:"Photo",hypercard:"Hypercard"}},{property:"image",title:"Image",description:"Picture of the author of this quote",inputMethod:"textfield",icon:"editor:short-text",required:!1,validationType:"text"},{property:"citation",title:"Citation",description:"",inputMethod:"textfield",icon:"editor:short-text",required:!1,validationType:"text"},{property:"author",title:"Author",description:"",inputMethod:"textfield",icon:"editor:short-text",required:!1,validationType:"text"},{slot:"",title:"Quote",description:"",inputMethod:"textfield",icon:"editor:format-quote",required:!0,validationType:"text"},{property:"sourceLink",title:"Source link",description:"Reference to the ",inputMethod:"textfield",icon:"editor:short-text",required:!1,validationType:"url"}],advanced:[]}};this.setHaxProperties(props)}});export{LrndesignBlockquote};