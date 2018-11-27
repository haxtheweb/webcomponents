import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-checkbox/paper-checkbox.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/paper-toast/paper-toast.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";Polymer({_template:html`
    <style include="materializecss-styles">
      :host {
        display: block;
        padding: 16px 16px 54px 16px;
      }
      h3 {
        margin: 8px;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      ul li {
        padding: 8px;
      }
      paper-checkbox {
        padding: 8px;
      }
      iron-icon {
        display: inline-flex;
      }
    </style>
    <meta property="oer:assessing" content\$="[[relatedResource]]">
    <h3 hidden\$="[[hideTitle]]"><span property="oer:name">[[title]]</span></h3>
    <div>[[question]]</div>
    <ul>
      <template is="dom-repeat" items="[[displayedAnswers]]" as="answer">
        <li><paper-checkbox disabled\$="[[disabled]]" property="oer:answer" checked="{{answer.userGuess}}">[[answer.label]]</paper-checkbox></li>
      </template>
    </ul>
    <div hidden\$="[[hideButtons]]">
      <paper-button disabled\$="[[disabled]]" raised="" on-tap="_verifyAnswers">[[checkLabel]]</paper-button>
      <paper-button disabled\$="[[disabled]]" raised="" on-tap="_resetAnswers">[[resetLabel]]</paper-button>
    </div>
    <paper-toast id="toast" duration="6000" class\$="fit-bottom [[__toastColor]]">
    [[__toastText]]
    <iron-icon icon="[[__toastIcon]]" style="margin-left:16px;"></iron-icon>
    </paper-toast>
`,is:"multiple-choice",hostAttributes:{typeof:"oer:Assessment"},behaviors:[HAXBehaviors.PropertiesBehaviors,MaterializeCSSBehaviors.ColorBehaviors,SchemaBehaviors.Schema],observers:["_valueChanged(displayedAnswers.*)"],properties:{title:{type:String,value:""},disabled:{type:Boolean,value:!1},checkLabel:{type:String,value:"Check answer"},resetLabel:{type:String,value:"Reset"},relatedResource:{type:String},hideTitle:{type:Boolean,value:!1},question:{type:String,value:""},answers:{type:Array,value:[],notify:!0},displayedAnswers:{type:Array,computed:"_computeDisplayedAnswers(answers, randomize)",notify:!0},correctText:{type:String,value:"Great job!"},incorrectText:{type:String,value:"Better luck next time!"},randomize:{type:Boolean,value:!1,reflectToAttribute:!0},hideButtons:{type:Boolean,value:!1}},_valueChanged:function(e){for(var i in e.base){for(var j in e.base[i]){this.notifyPath("displayedAnswers."+i+"."+j)}}},_resetAnswers:function(e){this.$.toast.hide();for(var i in this.displayedAnswers){if(this.displayedAnswers[i].userGuess){this.displayedAnswers[i].userGuess=!1}}setTimeout(()=>{const answers=this.answers;this.set("answers",[]);this.set("answers",answers)},100)},checkAnswers:function(){let gotRight=!0;for(var i in this.displayedAnswers){if(!1!=gotRight&&this.displayedAnswers[i].correct&&this.displayedAnswers[i].userGuess){gotRight=!0}else if(this.displayedAnswers[i].correct&&!this.displayedAnswers[i].userGuess){gotRight=!1}else if(!this.displayedAnswers[i].correct&&this.displayedAnswers[i].userGuess){gotRight=!1}}return gotRight},_verifyAnswers:function(e){let gotRight=this.checkAnswers();if(gotRight){this.$.toast.hide();this.__toastColor="green darken-4";this.__toastIcon="thumb-up";this.__toastText=this.correctText;this.$.toast.show()}else{this.$.toast.hide();this.__toastColor="red darken-4";this.__toastIcon="thumb-down";this.__toastText=this.incorrectText;this.$.toast.show()}},_computeDisplayedAnswers:function(answers,randomize){if(typeof answers!==typeof void 0&&null!=answers&&0<answers.length&&randomize){let random=answers;var currentIndex=random.length,temporaryValue,randomIndex;while(0!==currentIndex){randomIndex=Math.floor(Math.random()*currentIndex);currentIndex-=1;temporaryValue=random[currentIndex];random[currentIndex]=random[randomIndex];random[randomIndex]=temporaryValue}return random}else{return answers}},attached:function(){this.$.toast.fitInto=this;let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Multiple choice",description:"Multiple choice self check",icon:"icons:list",color:"purple",groups:["Instructional"],handles:[],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"question",title:"Question",description:"Question for users to respond to.",inputMethod:"textfield",icon:"icons:help"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield"},{property:"hideTitle",title:"Hide title",description:"Whether or not to display the title",inputMethod:"boolean"},{property:"question",title:"Question",description:"Question for users to respond to.",inputMethod:"textfield"},{property:"randomize",title:"Randomize",description:"Randomize the answers dynamically",inputMethod:"boolean"},{property:"answers",title:"Answer set",description:"Answers in a multiple choice",inputMethod:"array",properties:[{property:"correct",title:"Correct",description:"If this is correct or not",inputMethod:"boolean"},{property:"label",title:"Answer",description:"Possible answer to the question",inputMethod:"textfield",required:!0}]},{property:"correctText",title:"Correct feedback",description:"Feedback when they get it right",inputMethod:"textfield"},{property:"incorrectText",title:"Incorrect feedback",description:"Feedback when they get it wrong",inputMethod:"textfield"}],advanced:[{property:"checkLabel",title:"Check answers label",description:"Label for getting solution feedback",inputMethod:"textfield"},{property:"resetLabel",title:"Reset label",description:"label for the reset button",inputMethod:"textfield"}]},saveOptions:{unsetAttributes:["displayed-answers"]}};this.setHaxProperties(props)}});