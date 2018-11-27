import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{pathFromUrl}from"./node_modules/@polymer/polymer/lib/utils/resolve-url.js";import"./node_modules/@polymer/paper-material/paper-material.js";import"./node_modules/@polymer/paper-fab/paper-fab.js";import"./node_modules/@polymer/paper-icon-button/paper-icon-button.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icons/av-icons.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js";Polymer({_template:html`
    <style>
      :host {
        height: 150px;
        background-color: var(--dark-primary-color);
        display: block;
      }

      paper-icon-button {
        position: absolute;
      }

      .title,
      .subtitle {
        transition: all .5s ease;
        padding: 10px 10px 10px 0;
        left: 160px;
        position: absolute;
      }

      .subtitle {
        bottom: 0;
      }

      .controls {
        height: 50px;
        width: 100%;
        top: 0;
        background: var(--accent-color);
        z-index: 20
      }

      paper-fab {
        transition: all .5s ease;
        top: -25px;
        z-index: 25;
        border-radius: 0;
      }

      .albuminfo {
        position: relative;
        transition: all .5s ease;
        top: -156px;
        margin-bottom: -150px;
        z-index: 20;
        height: 150px;
        background-color: rgba(0, 0, 0, .4);
        color: #fff;
        font-family: Roboto, sans-serif;
      }

      .albuminfoActive {
        top: -25;
        height: 25px;
        width: 100%;
        margin-bottom: -19px;
      }

      .waveContainer {
        top: -31px;
        transition: all .5s ease;
        background-color: var(--dark-primary-color);
        transform: scaleY(1.5)
      }

      .circleAnimation {
        border-radius: 50%;
        overflow: auto;
        -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .4);
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .4)
      }

      .circleAnimation:active {
        -moz-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, .2);
        box-shadow: 0 8px 17px 0 rgba(0, 0, 0, .2)
      }

      .playActive {
        top: 0;
        width: 100%;
        height: 50px
      }

      .waveActive {
        top: 0px;
        transform: scaleY(1)
      }

      .centred,
      .titleActive {
        transform: scaleY(0);
      }

      .titleActive {
        opacity: 0;
      }

      #playbutton {
        transition: all .5s ease
      }

      .coverart {
        transition: all .5s ease;
        width: 150px;
        height: 150px
      }

      .title {
        font-size: 24px;
      }

      .coverartActive {
        width: 25px;
        height: 25px
      }

      .nameActive {
        font-size: 19px;
        padding: 3px 3px 3px 0;
        left: 30px
      }

      .centred {
        top: calc(50% - 20px);
        left: calc(50% - 20px);
        transition: all .3s ease
      }

      .left,
      .middle,
      .right {
        transform: scale(1)
      }

      .left {
        left: calc(25% - 20px)
      }

      .right {
        left: calc(75% - 20px)
      }

      .hidden {
        display: none
      }

      @media only screen and (max-width: 500px) {
        .albuminfo {
          width: 100%;
        }
      }
    </style>
    <paper-fab id="playbutton" class="circleAnimation" disabled="" icon="av:play-arrow" on-click="togglePlay"></paper-fab>
    <paper-material id="controls" class="controls hidden" elevation="2">
      <paper-icon-button class="centred middle" style="color: white;" icon="av:pause" on-click="togglePlay"></paper-icon-button>
      <paper-icon-button id="replay" class="centred" style="color: white;" icon="av:replay-30" on-click="throwBack"></paper-icon-button>
      <paper-icon-button id="mute" class="centred" style="color: white;" icon="av:volume-up" on-click="toggleMute"></paper-icon-button>
    </paper-material>
    <div id="container" class="waveContainer" elevation="0"></div>
    <div id="albuminfo" class="albuminfo">
      <img class="coverart" src="[[coverart]]">
      <span class="title">[[title]]</span>
      <span class="subtitle">[[subtitle]]</span>
    </div>
`,is:"wave-player",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{src:{type:String,notify:!0,observer:"_srcChanged"},title:{type:String,value:"",notify:!0},subtitle:{type:String,value:"",notify:!0},coverart:{type:String,value:"",notify:!0},wavesurfer:{type:Object},lean:{type:String,value:"left",notify:!0},wavecolor:{type:String,value:"#ffffff",notify:!0},progresscolor:{type:String,value:"#CFD8DC",notify:!0}},_srcChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0&&this.__wavesurfer){window.wavesurferobject.load(newValue)}},created:function(){const name="wavesurfer",basePath=pathFromUrl(import.meta.url),location=`${basePath}lib/wavesurfer.js/dist/wavesurfer.js`;window.addEventListener(`es-bridge-${name}-loaded`,this._wavesurferLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load(name,location)},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Audio player",description:"Audio that is just like spotify.",icon:"av:play-circle-filled",color:"purple",groups:["Video","Media"],handles:[{type:"audio",source:"src",title:"title",caption:"subtitle"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"src",title:"Source",description:"The URL for this video.",inputMethod:"textfield",icon:"link",required:!0,validationType:"url"}],configure:[{property:"src",title:"Source",description:"The URL for this video.",inputMethod:"textfield",icon:"link",required:!0,validationType:"url"},{property:"title",title:"Title",description:"A simple title",inputMethod:"textfield",icon:"av:video-label",required:!1,validationType:"text"}],advanced:[]}};this.setHaxProperties(props)},ready:function(){if("right"===this.lean){this.$.playbutton.style.right="25";this.$.controls.style.right="0"}else{this.$.playbutton.style.left="25";this.$.controls.style.left="0"}if(""===this.name){this.$.albuminfo.classList.add("hidden")}if(""===this.coverart){const basePath=pathFromUrl(import.meta.url);this.coverart=`${basePath}lib/art.jpg`}},_wavesurferLoaded:function(){this.__wavesurfer=!0;this.initWaveSurfer()},activateAnimation:function(){var self=this,waveStyle=this.$.container,buttonStyle=this.$.playbutton,controlsStyle=this.$.controls,muteStyle=this.$.mute,replayStyle=this.$.replay,albumStyle=this.$.albuminfo,coverartStyle=albumStyle.querySelector(".coverart"),nameStyle=albumStyle.querySelector(".title"),titleStyle=albumStyle.querySelector(".subtitle");buttonStyle.setAttribute("icon","av:pause");buttonStyle.classList.remove("circleAnimation");buttonStyle.classList.add("playActive");albumStyle.classList.add("albuminfoActive");coverartStyle.classList.add("coverartActive");nameStyle.classList.add("nameActive");titleStyle.classList.add("titleActive");if("right"===self.lean){this.$.playbutton.style.right="0"}else{this.$.playbutton.style.left="0"}waveStyle.classList.add("waveActive");setTimeout(function(){controlsStyle.classList.remove("hidden");buttonStyle.classList.add("hidden")},500);setTimeout(function(){muteStyle.classList.add("right");replayStyle.classList.add("left")},600)},deactivateAnimation:function(){var self=this,waveStyle=this.$.container,buttonStyle=this.$.playbutton,controlsStyle=this.$.controls,muteStyle=this.$.mute,replayStyle=this.$.replay,albumStyle=this.$.albuminfo,coverartStyle=albumStyle.querySelector(".coverart"),nameStyle=albumStyle.querySelector(".title"),titleStyle=albumStyle.querySelector(".subtitle");muteStyle.classList.remove("right");replayStyle.classList.remove("left");setTimeout(function(){controlsStyle.classList.add("hidden");buttonStyle.classList.remove("hidden")},100);setTimeout(function(){buttonStyle.setAttribute("icon","av:play-arrow");buttonStyle.classList.add("circleAnimation");buttonStyle.classList.remove("playActive");albumStyle.classList.remove("albuminfoActive");coverartStyle.classList.remove("coverartActive");nameStyle.classList.remove("nameActive");titleStyle.classList.remove("titleActive");if("right"===self.lean){buttonStyle.style.right="25"}else{buttonStyle.style.left="25"}waveStyle.classList.remove("waveActive")},200)},initWaveSurfer:function(){window.wavesurferobject=new WaveSurfer({container:this.$.container,waveColor:this.wavecolor,progressColor:this.progresscolor,fillParent:!0,height:100});window.wavesurferobject.init();if(typeof this.src!==typeof void 0){window.wavesurferobject.load(this.src)}window.wavesurferobject.on("ready",()=>{this.$.playbutton.removeAttribute("disabled")});window.wavesurferobject.on("finish",()=>{this.deactivateAnimation()})},togglePlay:function(e){window.wavesurferobject.playPause();var iconType=this.$.playbutton.getAttribute("icon");if("av:play-arrow"===iconType){this.activateAnimation()}else{this.deactivateAnimation()}},toggleMute:function(e){var muteStyle=this.$.mute,iconType=muteStyle.getAttribute("icon");window.wavesurferobject.toggleMute();if("av:volume-up"===iconType){muteStyle.setAttribute("icon","av:volume-off")}else{muteStyle.setAttribute("icon","av:volume-up")}},throwBack:function(e){window.wavesurferobject.skipBackward(30)}});