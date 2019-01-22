import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/paper-input/paper-input.js";import"./node_modules/@polymer/paper-tooltip/paper-tooltip.js";import"./lib/simple-search-content.js";export{SimpleSearch};class SimpleSearch extends PolymerElement{static get is(){return"simple-search"}static get properties(){return{alwaysFloatLabel:{type:Boolean,value:!1},caseSensitive:{type:Boolean,value:null},controls:{type:String,value:null},nextButtonDisabled:{type:Boolean,computed:"_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,1)"},nextButtonIcon:{type:String,value:"arrow-forward"},nextButtonLabel:{type:String,value:"next result"},noLabelFloat:{type:Boolean,value:!1},noResults:{type:Boolean,computed:"_hasNoResults(resultCount)"},noSearch:{type:Boolean,computed:"_hasNoSearch(searchTerms)"},prevButtonDisabled:{type:Boolean,computed:"_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,-1)"},prevButtonIcon:{type:String,value:"arrow-back"},prevButtonLabel:{type:String,value:"previous result"},resultCount:{type:Number,value:0},resultPointer:{type:Number,value:0},resultsSpan:{type:String,computed:"_getResultsSpan(noSearch,resultPointer,resultCount)"},searchInputIcon:{type:String,value:"search"},searchInputLabel:{type:String,value:"search"},searchTerms:{type:Array,value:[]},target:{type:Object,value:null}}}static get template(){return html`
      <style is="custom-style">
        :host {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
        }
        :host #input {
          flex-grow: 2;
          margin-right: 4px;
          --paper-input-container-input-color: var(
            --simple-search-input-text-color,
            #000
          );
          --paper-input-container-shared-input-style_-_color: var(
            --simple-search-input-text-color,
            #000
          );
          --paper-input-container-focus-color: var(
            --simple-search-input-line-color,
            #000
          );
          --paper-input-container-color: var(
            --simple-search-input-placeholder-color,
            #222
          );
          color: var(--simple-search-input-placeholder-color, #222);
          @apply --simple-search-container;
        }
        :host #xofy {
          margin: 8px;
        }
        :host button {
          margin: 8px 0 8px;
          color: var(--simple-search-button-color, #111);
          background-color: var(--simple-search-button-bg-color, #eee);
          border-color: var(--simple-search-button-border-color, #ccc);
          @apply --simple-search-button;
        }
        :host button:not([disabled]):focus,
        :host button:not([disabled]):hover {
          cursor: pointer;
          color: var(--simple-search-button-hover-color, #000);
          background-color: var(--simple-search-button-hover-bg-color, #fff);
          border-color: var(--simple-search-button-hover-border-color, #ddd);
          @apply --simple-search-button-hover;
        }
        :host button[disabled] {
          cursor: not-allowed;
          color: var(--simple-search-button-disabled-color, #999);
          background-color: var(--simple-search-button-disabled-bg-color, #eee);
          border-color: var(--simple-search-button-disabled-border-color, #ccc);
          @apply --simple-search-button-disabled;
        }
        :host button:not([controls]) {
          display: none;
        }
        :host [shrink-hide] {
          display: none;
        }
      </style>
      <paper-input
        id="input"
        always-float-label\$="[[alwaysFloatLabel]]"
        label="[[searchInputLabel]]"
        no-label-float\$="[[noLabelFloat]]"
        on-change="_handleChange"
      >
        <iron-icon icon="[[searchInputIcon]]" slot="prefix"></iron-icon>
      </paper-input>
      <div id="xofy" shrink-hide\$="[[noSearch]]"></div>
      <div shrink-hide\$="[[noResults]]">
        <button
          id="prev"
          aria-label="[[prevButtonLabel]]"
          aria-role="button"
          controls\$="[[controls]]"
          disabled\$="[[prevButtonDisabled]]"
          on-tap="_navigateResults"
          tabindex="0"
        >
          <iron-icon icon="[[prevButtonIcon]]"></iron-icon>
        </button>
        <paper-tooltip for="prev">[[prevButtonLabel]]</paper-tooltip>
        <button
          id="next"
          aria-label="[[nextButtonLabel]]"
          aria-role="button"
          controls\$="[[controls]]"
          disabled\$="[[nextButtonDisabled]]"
          on-tap="_navigateResults"
          tabindex="0"
        >
          <iron-icon icon\$="[[nextButtonIcon]]"></iron-icon>
        </button>
        <paper-tooltip for="next">[[nextButtonLabel]]</paper-tooltip>
      </div>
    `}ready(){super.ready();let root=this,search=root.$.input;root._getSearchText(search.value)}_handleChange(e){let root=this;root._getSearchText(root.$.input.value);root.resultCount=0;root.resultPointer=0;root.dispatchEvent(new CustomEvent("simple-search",{detail:{search:root,content:e}}))}_hasNoResults(resultCount){return 1>resultCount}_hasNoSearch(searchTerms){return 1>searchTerms.length}_getResultsSpan(noSearch,resultPointer,resultCount){let html="";if(0<resultCount&&0<resultPointer){html=resultPointer+"/"+resultCount}else{html=" "+resultCount}this.$.xofy.innerHTML=html;return this.$.xofy.innerHTML}_navigateResults(e){let root=this,increment="next"===e.currentTarget.id?1:-1;if(0<this.resultPointer+increment&&this.resultPointer+increment<=this.resultCount){this.resultPointer+=increment;this.dispatchEvent(new CustomEvent("goto-result",{detail:this.resultPointer}))}}_isNavButtonDisabled(pointer,count,span,inc){return""==span||0>=pointer+inc||pointer+inc>count}_getSearchText(find){let temp=[];if(find!==void 0&&null!==find){temp=find.split(/[\"\']/gm);for(let i=0;i<temp.length;i++){temp[i]=temp[i].trim();if(""===temp[i])temp.splice(i,1)}}this.set("searchTerms",[]);this.set("searchTerms",temp.slice(0))}findMatches(content){let root=this,terms=root.searchTerms,modifier=this.caseSensitive?"gm":"gim",results=content.slice(0),updateResults=function(find){for(let i=0;i<results.length;i++){if(!1===results[i].matched){let regex=new RegExp("\\b"+find+"\\b",modifier),text=results[i].text,start=text.search(regex),end=start+find.length;if(-1<start){root.resultCount+=1;let pre=text.slice(0,start),match=text.slice(start,end),post=text.slice(end,text.length),update=results.splice(i,1,{matched:!1,text:pre,searchObject:root},{matched:!0,matchNumber:root.resultCount,text:match,searchObject:root},{matched:!1,text:post,searchObject:root})}}}};for(let i=0;i<terms.length;i++){updateResults(terms[i])}root.resultPointer=0;return results}}customElements.define(SimpleSearch.is,SimpleSearch);