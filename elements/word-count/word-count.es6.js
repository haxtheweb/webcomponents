import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import{FlattenedNodesObserver}from"./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";let WordCount=Polymer({_template:html`
    <style>
      :host {
        display: block;
        --word-count-color: #888888;
        --word-count-color-hover: #000000;
      }
      :host:after {
        content: attr(words-text);
        font-size: 10px;
        position: relative;
        transition: 0.3s font-size, color ease;
        display: flex;
        line-height: 16px;
        flex-direction: row-reverse;
        margin: 12px;
        color: var(--word-count-color);
        @apply --word-count-text;
      }
      :host(:hover):after {
        font-size: 12px;
        font-weight: bold;
        color: var(--word-count-color-hover);
        @apply --word-count-text-hover;
      }
      :host(:focus):after {
        font-size: 12px;
        font-weight: bold;
        color: var(--word-count-color-hover);
        @apply --word-count-text-hover;
      }
      :host(:active):after {
        font-size: 12px;
        font-weight: bold;
        color: var(--word-count-color-hover);
        @apply --word-count-text-hover;
      }
    </style>
    <slot></slot>
  `,is:"word-count",hostAttributes:{tabindex:"0"},properties:{words:{type:Number},wordsPrefix:{type:String,value:"Words:"},wordsText:{type:String,computed:"_computeWordsText(words, wordsPrefix)",reflectToAttribute:!0}},ready:function(){this._observer=new FlattenedNodesObserver(this,info=>{if(0<info.addedNodes.length||0<info.removedNodes.length){this._updateWords()}})},_updateWords:function(){if(""!==dom(this).textContent){this.words=parseInt(dom(this).textContent.split(/\s+/g).length-1)}else{this.words=0}},_computeWordsText:function(words,prefix){return prefix+" "+words}});export{WordCount};