import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
        font-size: 16px;
        line-height: 32px;
        --license-text-color: #222222;
        --license-background-color: #F2F2F2;
        background-color: var(--license-background-color);
      }
      :host:after {
        content: 'License';
        position: relative;
        float: right;
        bottom: 36px;
        right: 8px;
        font-size: 28px;
        color: #DDDDDD;
        font-style: italic;
      }
      .license-body {
        padding: 32px;
        font-style: italic;
        background-color: var(--license-background-color);
        color: var(--license-text-color);
        @apply --license-body;
      }

      :host([display-method="footnote"]) {
        visibility: hidden;
        opacity: 0;
      }
      :host([display-method="popup"]) {
        display: block;
      }
      .license-link {
        font-style: italic;
        @apply --license-link;
      }
      .big-license-link img {
        margin-right: 8px;
        margin-bottom: 8px;
        width: 88px;
        height: 31px;
        vertical-align: middle;
      }
      .work-title {
        font-weight: bold;
      }
    </style>
    <meta rel="cc:license" href\$="[[licenseLink]]" content\$="License: [[licenseName]]">
    <div class="license-body" xmlns:cc\$="[[licenseLink]]" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <a class="big-license-link" target="_blank" href="[[licenseLink]]"><img alt="[[licenseName]] graphic" src="[[licenseImage]]" hidden\$="[[!licenseImage]]"></a>
        <span class="work-title" rel="dc:type" href="http://purl.org/dc/dcmitype/Text" property="dc:title">[[title]]</span> by <a rel="cc:attributionURL" property="cc:attributionName" href\$="[[source]]">[[creator]]</a> is licensed under a <a class="license-link" target="_blank" href="[[licenseLink]]">[[licenseName]]</a>.
        <span rel="dc:source" href\$="[[source]]"></span>

        <template is="dom-if" if="[[hasMore]]">
          <span>Permissions beyond the scope of this license are available <a rel="cc:morePermissions" target="_blank" href="[[moreLink]]">[[moreLabel]]</a>.</span>
        </template>
    </div>
`,is:"license-element",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{title:{type:String},creator:{type:String},source:{type:String},licenseName:{type:String},licenseLink:{type:String},license:{type:String,observer:"_licenseUpdated"},moreLabel:{type:String,value:"on the licensing details page"},moreLink:{type:String},hasMore:{type:Boolean,computed:"_computeHasMore(moreLink)"}},attached:function(){let props={canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"License",description:"Provide a license for you rwork",icon:"icons:theaters",color:"grey",groups:["Content","Copyright"],handles:[{type:"license",source:"source",title:"title",author:"creator",license:"license"},{type:"inline",text:"title"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the work being cited.",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"title",title:"Title",description:"The title of the work being cited.",inputMethod:"textfield",icon:"editor:title"},{property:"source",title:"Source link",description:"The source url for the element this is citing.",inputMethod:"textfield",icon:"link",validationType:"url"},{property:"license",title:"License",description:"The source url for the element this is citing.",inputMethod:"select",options:this.licenseList("select"),icon:"link"},{property:"creator",title:"Creator",description:"Who made or owns this.",inputMethod:"textfield",icon:"link"}],advanced:[{property:"moreLink",title:"Source link",description:"Link to additional licensing details",inputMethod:"textfield",validationType:"url"},{property:"moreLabel",title:"more label",description:"Label for more licensing details",inputMethod:"textfield"}]}};this.setHaxProperties(props)},_computeHasMore:function(link){if(typeof link!==typeof void 0&&""!==link){return!0}return!1},licenseList:function(mode="full"){let list={by:{name:"Creative Commons: Attribution",link:"https://creativecommons.org/licenses/by/4.0/",image:"https://i.creativecommons.org/l/by/4.0/88x31.png"},"by-sa":{name:"Creative Commons: Attribution Share a like",link:"https://creativecommons.org/licenses/by-sa/4.0/",image:"https://i.creativecommons.org/l/by-sa/4.0/88x31.png"},"by-nd":{name:"Creative Commons: Attribution No derivatives",link:"https://creativecommons.org/licenses/by-nd/4.0/",image:"https://i.creativecommons.org/l/by-nd/4.0/88x31.png"},"by-nc":{name:"Creative Commons: Attribution non-commercial",link:"https://creativecommons.org/licenses/by-nc/4.0/",image:"https://i.creativecommons.org/l/by-nc/4.0/88x31.png"},"by-nc-sa":{name:"Creative Commons: Attribution non-commercial share a like",link:"https://creativecommons.org/licenses/by-nc-sa/4.0/",image:"https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"},"by-nc-nd":{name:"Creative Commons: Attribution Non-commercial No derivatives",link:"https://creativecommons.org/licenses/by-nc-nd/4.0/",image:"https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"}};if("select"==mode){var select={};for(var i in list){select[i]=list[i].name}return select}return list},_licenseUpdated:function(newValue){if(typeof newValue!==typeof void 0){var list=this.licenseList();if(typeof list[newValue]!==typeof void 0){this.licenseName=list[newValue].name;this.licenseLink=list[newValue].link;this.licenseImage=list[newValue].image}}}});