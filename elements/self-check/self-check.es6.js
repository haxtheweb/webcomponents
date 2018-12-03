import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@polymer/paper-card/paper-card.js";import"./node_modules/@polymer/paper-icon-button/paper-icon-button.js";import"./node_modules/@polymer/iron-icons/editor-icons.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/paper-tooltip/paper-tooltip.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";let SelfCheck=Polymer({_template:html`
    <style include="materializecss-styles">
      :host {
        display: block;
      }

      paper-card {
        overflow: hidden;
      }

      paper-icon-button#checkBtn {
        width: 50px;
        height: 50px;
        position: relative;
        left: 16px;
        bottom: -10px;
      }

      .check_button {
        display: flex;
        justify-content: flex-end;
      }

      paper-icon-button#closeBtn {
        width: 50px;
        height: 50px;
        position: relative;
        left: 16px;
        bottom: -16px;
      }

      .close_button {
        display: flex;
        justify-content: flex-end;
      }

      iron-icon#questionmark {
        width: 35px;
        height: 35px;
        padding: 5px;
      }

      .heading {
        text-transform: uppercase;
        font-size: 22px;
        margin: 10px;
      }

      #header_wrap {
        display: inline-flex;
        width: 100%;
        margin: -20px 0 0;
      }

      #question_wrap {
        position: relative;
      }

      .question {
        font-size: 16px;
        padding: 15px 15px;
      }

      :host([correct]) .question {
        display: none;
      }

      #answer_wrap {
        visibility: hidden;
        opacity: 0;
        background-color: #66bb6a;
        border-top: 2px solid #fff;
        width: 100%;
        top: 0;
        transition: all 0.2s ease;
        left: calc(100%);
        position: absolute;
      }

      :host([correct]) #answer_wrap {
        visibility: visible;
        opacity: 1;
        position: relative;
        left: 0;
      }

      .answer {
        color: #fff;
        font-size: 16px;
        padding: 15px;
        line-height: 19.2px;
      }

      #quote_start {
        display: inline-flex;
        transform: rotateY(180deg);
      }

      #quote_end {
        display: inline-flex;
      }

      .triangle {
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
        border-bottom: 20px solid;
        position: relative;
        top: -20px;
        left: -1px;
      }

      .more_info {
        display: inline;
      }

      .more_info a {
        text-decoration: none;
        color: #fff;
      }

      .more_info a:hover {
        color: #1976d2;
      }
    </style>

    <paper-card image="[[image]]" alt="[[alt]]">
      <div
        class="triangle"
        style\$="border-bottom-color:[[backgroundColor]];"
      ></div>
      <div
        id="header_wrap"
        class\$="[[backgroundColorClass]] [[textColorClass]]"
      >
        <iron-icon id="questionmark" icon="icons:help"></iron-icon>
        <div class="heading">[[title]]</div>
      </div>
      <div id="question_wrap">
        <div class="question">
          <slot name="question"></slot>
          <div class="check_button">
            <paper-icon-button
              id="checkBtn"
              icon="icons:check-circle"
              on-click="openAnswer"
              noink=""
            ></paper-icon-button>
            <paper-tooltip for="checkBtn" position="left"
              >Reveal Answer</paper-tooltip
            >
          </div>
        </div>

        <div id="answer_wrap">
          <div class="answer">
            <slot></slot>
            <div class="more_info">
              <a href="[[link]]" target="_blank">More info...</a>
            </div>
            <div class="close_button">
              <paper-icon-button
                id="closeBtn"
                icon="icons:close"
                on-click="openAnswer"
                noink=""
              ></paper-icon-button>
            </div>
          </div>
        </div>
      </div>
    </paper-card>
  `,is:"self-check",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema,A11yBehaviors.A11y,MaterializeCSSBehaviors.ColorBehaviors],properties:{title:{type:String,value:"Self-Check"},question:{type:String,value:""},image:{type:String,value:"",reflectToAttribute:!0},alt:{type:String,value:"",reflectToAttribute:!0},link:{type:String,value:"",reflectToAttribute:!0},correct:{type:Boolean,value:!1,reflectToAttribute:!0},textColor:{type:String,value:"#ffffff",reflectToAttribute:!0},textColorClass:{type:String,value:null,reflectToAttribute:!0,computed:"_computeColorClass(textColor)"},backgroundColor:{type:String,value:"#1976d2",reflectToAttribute:!0,observer:"_backgroundColorChanged"},backgroundColorClass:{type:String,reflectToAttribute:!0,computed:"_computeColorClass(backgroundColor)"}},openAnswer:function(){this.correct=!this.correct},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Self-Check",description:"The user will be able to complete a self-check.",icon:"icons:check-circle",color:"orange",groups:["Image","Assessment"],handles:[{type:"image",source:"image",title:"question",description:"answer"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"image",title:"Image",description:"The image of the element",inputMethod:"textfield",icon:"editor:insert-photo"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield"},{property:"image",title:"Image",description:"The image of the element",inputMethod:"textfield"},{property:"alt",title:"Alt Text",description:"Add alt text to the image",inputMethod:"alt"},{slot:"question",title:"Question to ask",description:"This is where you enter a question for the self-check.",inputMethod:"code-editor",required:!0},{slot:"",title:"Answer",description:"This is where you enter a question for the self-check.",inputMethod:"code-editor",required:!0},{property:"backgroundColor",title:"Background color",description:"Select the background color used",inputMethod:"colorpicker"}],advanced:[]}};this.setHaxProperties(props)},_backgroundColorChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0&&null!=newValue){this.computeTextPropContrast("textColor","backgroundColor")}},_primaryColorChanged:function(newValue,oldValue){if(null!=newValue&&typeof this.source!==typeof void 0){this.videoColor=newValue.substring(1);var source=this.source;this.set("source","");this.set("source",source)}},_computeColorClass:function(color){if(null!=color&&"#ffffff"==color.toLowerCase()){return"white-text"}else if(null!=color&&"#000000"==color){return"black-text"}else if(null!=color&&"#"==color.substring(0,1)){return this._colorTransform(color.toLowerCase(),"","")}}});export{SelfCheck};