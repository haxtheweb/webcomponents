import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/jarallax/src/jarallax.esm.js";import"./node_modules/jarallax/src/jarallax-video.esm.js";import"./node_modules/jarallax/src/jarallax-element.esm.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }

      .jarallax {
        position: relative;
        z-index: 0;
        height: 400px;
        overflow: hidden;
      }

      .jarallax>.jarallax-img {
        position: absolute;
        object-fit: cover;
        /* support for plugin https://github.com/bfred-it/object-fit-images */
        font-family: 'object-fit: cover;';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }

      #title_contain {
        display: flex;
        /* flex-direction: column; */
        justify-content: center;
        padding-top: 170px;
      }

      .title {
        background: rgba(0, 0, 0, 0.3);
        display: block;
        padding: 20px 15px;
        text-align: center;
        width: 40%;
        color: #fff;
        font-size: 2em;
        position: absolute;
        border: solid 1px;
      }

      @media screen and (max-width: 900px) {
        .title {
          font-size: 18px;
        }
      }

      @media screen and (max-width: 600px) {
        .title {
          font-size: 14px;
        }
      }
    </style>

    <a href="[[url]]" target\$="[[_urlTarget(url)]]">
      <div class="parallax_contain">
        <div class="jarallax">
          <template is="dom-if" if="[[title]]">
            <div id="title_contain">
              <div class="title">[[title]]</div>
            </div>
          </template>
        </div>
      </div>
    </a>
`,is:"parallax-effect",properties:{type:{type:String,value:"image",reflectToAttribute:!0},src:{type:String,value:"",reflectToAttribute:!0},alt:{type:String,value:"",reflectToAttribute:!0},title:{type:String,value:"",reflectToAttribute:!0},url:{type:String,value:"",reflectToAttribute:!0}},attached:function(){const targets=this.querySelectorAll(".jarallax"),options={speed:.2,videoStartTime:6,videoEndTime:23};switch(this.type){case"image":options.imgSrc=this.src;break;case"video":options.videoSrc=this.src;break;default:options.imgSrc=this.src;break;}new Jarallax(targets,options)},_outsideLink:function(url){if(0!=url.indexOf("http"))return!1;var loc=location.href,path=location.pathname,root=loc.substring(0,loc.indexOf(path));return 0!=url.indexOf(root)},_urlTarget:function(url){if(url){const external=this._outsideLink(url);if(external){return"_blank"}}return!1}});