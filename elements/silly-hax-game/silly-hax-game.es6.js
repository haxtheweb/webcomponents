import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/simple-timer/simple-timer.js";import"./node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog-modal.js";import"./node_modules/@lrnwebcomponents/to-do/to-do.js";import"./node_modules/@polymer/paper-card/paper-card.js";import"./node_modules/@polymer/paper-button/paper-button.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-card heading="[[haxText]]" elevation="1">
      <simple-timer id="timer" start-time="60" count-up="" hidden="" current-time="{{timer}}"></simple-timer>
      <div class="card-content">
        <to-do items="{{tasks}}" hide-form="" id="todo" name="Hax Challenge"></to-do>
      </div>
      <div class="card-actions">
        <paper-button raised="" on-tap="_playButton">Play</paper-button>
        <paper-button raised="" on-tap="_resetTimer">Reset</paper-button>
      </div>
    </paper-card>

    <lrnsys-dialog-modal id="modal" body-append="">
      <h3 slot="header">HAX Challenge score</h3>
      <div slot="primary">
        <p>[[__successText]]
          <a href="https://github.com/LRNWebComponents/hax-body/issues/new" target="_blank" style="text-decoration: none;text-transform: none;"><paper-button raised="">Give us feedback to improve</paper-button></a>
          <a href\$="[[tweet]]" target="_blank" style="text-decoration: none;text-transform: none;"><paper-button raised="">Tweet your score</paper-button></a>
      	</p>
        <to-do name="Report card" hide-form="" items="{{__score}}"></to-do>
      </div>
    </lrnsys-dialog-modal>
`,is:"silly-hax-game",properties:{tasks:{type:Array,value:[]},haxText:{type:String,computed:"_haxTextValue(timer)"},__score:{type:Array,value:[]},tweet:{type:String},timer:{type:Number},playing:{type:Boolean,value:!1,observer:"_playGame",reflectToAttribute:!0}},_playButton:function(){if(!this.playing){this.playing=!0;this.$.timer.start()}},_playGame:function(newValue){if(newValue){this.__started=!0;this.set("tasks",[]);this.push("tasks",{value:!1,label:"Start to edit with HAX",disabled:!0,id:"play"},{value:!1,label:"Embed a video by Searching for it",disabled:!0,id:"youtube"},{value:!1,label:"Turn a NASA image into a meme",disabled:!0,id:"nasa"},{value:!1,label:"Saved content!!!",disabled:!0,id:"saved"})}},_resetTimer:function(){this.$.timer.pause();this.playing=!1;this.timer=0;this.set("tasks",[])},_haxTextValue:function(time){if(typeof time===typeof void 0||60==time){return"Take the HAX challenge"}else{return time.toFixed(2)}},attached:function(){document.body.addEventListener("hax-body-tag-added",this._verifyAction.bind(this));document.body.addEventListener("hax-store-property-updated",this._propertyUpdated.bind(this))},_propertyUpdated:function(e){switch(e.detail.property){case"editMode":if(this.playing&&this.__started&&e.detail.value&&typeof this.tasks[0].label!==typeof void 0){this.set("tasks.0.value",!0);this.set("tasks.0.label",this.tasks[0].label+" - "+this.timer.toFixed(2)+" seconds")}else if(!1===e.detail.value&&this.__started&&this.playing){this.set("tasks."+(parseInt(this.tasks.length)-1)+".value",!0);this.set("tasks."+(parseInt(this.tasks.length)-1)+".label",this.tasks[parseInt(this.tasks.length)-1].label+" - "+this.timer.toFixed(2)+" seconds");this.$.timer.pause();this._verifyWin()}break;}},_verifyWin:function(){let win=!0,winning=0;this.set("__score",this.tasks);for(var i in this.tasks){if(!this.tasks[i].value){win=!1}else{winning++}}if(0===this.timer){win=!1;this.push("__score",{value:!1,label:"You ran out of time :(",disabled:!0,id:"time"})}else if(!win){this.push("__score",{value:!1,label:"You didn't complete everything. CHEATER!",disabled:!0,id:"cheater"})}else{this.push("__score",{value:!0,label:"You did it!!! <(:) Much Success!",disabled:!0,id:"time"});winning++}this.$.modal.opened=!0;if(!win){this.__successText=":( You have much sadness by only completing "+winning+" of the available "+this.tasks.length+" challenges. If you experienced confusion when using the interface for certain tasks please let us know! We want everyone to be able to master HAX.";this.tweet="http://twitter.com/home?status="+encodeURIComponent("I took the #HaxtheWeb Challenge and finished "+winning+" challenges! Take the challenge at http://haxtheweb.org/ !")}else{this.__successText="YOU ARE A HAX MASTER! YOU BEAT ALL "+this.tasks.length+" CHALLENGES. AM I USING ENOUGH CAPSLOCK!? YOU BET I AM! TWEET YOUR SUCCESS NOW!";this.tweet="http://twitter.com/home?status="+encodeURIComponent("I are winning! I beat the #HaxtheWeb Challenge in "+this.timer.toFixed(2)+" seconds. Now I drink more coffee and code less! Take the challenge at http://haxtheweb.org/ !")}},_verifyAction:function(e){if(this.playing&&this.__started){if("VIDEO-PLAYER"===e.detail.node.tagName){this.set("tasks.1.value",!0);this.set("tasks.1.label",this.tasks[1].label+" - "+this.timer.toFixed(2)+" seconds")}else if("MEME-MAKER"===e.detail.node.tagName){this.set("tasks.2.value",!0);this.set("tasks.2.label",this.tasks[2].label+" - "+this.timer.toFixed(2)+" seconds")}}}});