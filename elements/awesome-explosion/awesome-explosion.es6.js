import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";Polymer({_template:html`
    <custom-style>
    <style is="custom-style">
      :host {
        display: inline-block;
      }
      :host([size="tiny"]) #image {
        width: 80px;
        height: 80px;
      }
      :host([size="small"]) #image {
        width: 160px;
        height: 160px;
      }
      :host([size="medium"]) #image {
        width: 240px;
        height: 240px;
      }
      :host([size="large"]) #image {
        width: 320px;
        height: 320px;
      }
      :host([size="epic"]) #image {
        width: 720px;
        height: 720px;
      }

      :host([color="red"]) #image {
        filter: sepia() saturate(10000%) hue-rotate(30deg);
      }
      :host([color="purple"]) #image {
        filter: sepia() saturate(10000%) hue-rotate(290deg);
      }
      :host([color="blue"]) #image {
        filter: sepia() saturate(10000%) hue-rotate(210deg);
      }
      :host([color="orange"]) #image {
        filter: sepia() saturate(10000%) hue-rotate(320deg);
      }
      :host([color="yellow"]) #image {
        filter: sepia() saturate(10000%) hue-rotate(70deg);
      }
      #image {
        width: 240px;
        height: 240px;
      }
    </style>
    </custom-style>
    <img src="[[image]]" id="image" class="image-tag" alt="" />
`,is:"awesome-explosion",listeners:{tap:"_setPlaySound",mouseover:"_setPlaySound",mouseout:"_setStopSound"},properties:{state:{type:String,value:"stop",reflectToAttribute:!0},stopped:{type:Boolean,computed:"_calculateStopped(state)"},playing:{type:Boolean,computed:"_calculatePlaying(state)"},paused:{type:Boolean,computed:"_calculatePaused(state)"},image:{type:String,value:"assets/explode.gif",reflectToAttribute:!0},sound:{type:String,value:"assets/273320__clagnut__fireworks.mp3",reflectToAttribute:!0},size:{type:String,value:"medium",reflectToAttribute:!0},color:{type:String,value:"",reflectToAttribute:!0},resetSound:{type:Boolean,value:!1,reflectToAttribute:!0}},_calculateStopped:function(newValue,oldValue){if("stop"==newValue){this.stopped=!0;if(typeof window.audio!==typeof void 0){window.audio.currentTime=0}this._stopSound();this.fire("awesome-event",{message:"Sound stopped"})}else{this.stopped=!1}},_calculatePlaying:function(newValue,oldValue){if("play"==newValue){this.playing=!0;this._playSound();this.fire("awesome-event",{message:"Sound played"})}else{this.playing=!1}},_calculatePaused:function(newValue,oldValue){if("pause"==newValue){this.paused=!0;this._stopSound();this.fire("awesome-event",{message:"Sound paused"})}else{this.paused=!1}},_stopSound:function(){if(typeof window.audio!==typeof void 0){window.audio.pause();if(this.resetSound){window.audio.currentTime=0}}},_setPlaySound:function(e){this.state="play"},_setStopSound:function(e){this.state="pause"},_playSound:function(){if(typeof window.audio===typeof void 0){window.audio=new Audio(this.sound)}window.audio.play()}});