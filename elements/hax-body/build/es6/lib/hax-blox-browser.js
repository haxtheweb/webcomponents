import{html,Polymer}from"../node_modules/@polymer/polymer/polymer-legacy.js";import"../node_modules/@polymer/iron-list/iron-list.js";import"./hax-blox-browser-item.js";import"./hax-icons.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
      hax-blox-browser-item {
        margin: 10px;
        -webkit-transition: .3s all linear;
        transition: .3s all linear;
      }
      #ironlist {
        min-height: 50vh;
      }
    </style>
    <iron-list id="ironlist" items="[[__bloxList]]" as="blox" grid="">
      <template>
        <div class="blox-container">
          <hax-blox-browser-item index="[[blox.index]]" layout="[[blox.details.layout]]" title="[[blox.details.title]]" tag="[[blox.details.tag]]" icon="[[blox.details.icon]]" author="[[blox.details.author]]" teaser="[[blox.details.teaser]]" description="[[blox.details.description]]" examples="[[blox.details.examples]]" status="[[blox.details.status]]" blox="[[blox.blox]]"></hax-blox-browser-item>
        </div>
      </template>
    </iron-list>
`,is:"hax-blox-browser",properties:{bloxList:{type:Array,observer:"_bloxListChanged"}},ready:function(){document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this))},attached:function(){this.resetBrowser()},detached:function(){document.body.removeEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this))},_haxStorePropertyUpdated:function(e){if(e.detail&&typeof e.detail.value!==typeof void 0&&e.detail.property){if(typeof this[e.detail.property]!==typeof void 0&&null!=this[e.detail.property]&&typeof this[e.detail.property].length!==typeof void 0){this.set(e.detail.property,[])}this.set(e.detail.property,e.detail.value)}},_bloxListChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0){this.set("__bloxList",newValue)}},resetBrowser:function(){setTimeout(()=>{this.$.ironlist.fire("iron-resize");window.dispatchEvent(new Event("resize"))},100)}});