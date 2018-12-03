import{html,Polymer}from"../node_modules/@polymer/polymer/polymer-legacy.js";import"../node_modules/@polymer/app-layout/app-drawer/app-drawer.js";import"../node_modules/@polymer/paper-icon-button/paper-icon-button.js";import"../node_modules/@polymer/iron-icons/iron-icons.js";import"./simple-colors-picker.js";import"../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./hax-panel-item.js";import"./hax-preferences-dialog.js";import"./hax-stax-picker.js";import"./hax-blox-picker.js";Polymer({_template:html`
    <style include="simple-colors">
      :host {
        display: block;
        position: absolute;
        z-index: 1000000;
      }
      app-drawer {
        z-index: 100001;
        height: 64px;
        left: 0;
        top: 0;
        touch-action: auto;
        visibility: hidden;
        opacity: 0;
        display: flex;
        --app-drawer-width: 100%;
        --app-drawer-content-container: {
          --app-drawer-content-container_-_height: 64px;
          --app-drawer-content-container_-_padding: 0;
          width: 100%;
          left: 0;
          right: 0;
          background-color: #2e2e2e;
          padding: unset;
          display: flex;
          touch-action: auto;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          white-space: nowrap;
        }
      }
      :host([align="right"]) app-drawer {
        right: 0;
        left: unset;
      }
      :host([edit-mode]) app-drawer {
        visibility: visible;
        transition: 0.6s ease opacity;
        opacity: 0.9;
        right: 0;
        left: 0;
        top: 0;
      }
      app-drawer[opened]:hover {
        opacity: 1;
      }
      #button {
        position: fixed;
        top: 0;
        left: 0;
        visibility: visible;
        z-index: 10000;
        margin-left: 0;
        transition: all 0;
        opacity: 0.9;
        border-radius: 50%;
      }
      :host([edit-mode]) #button {
        visibility: hidden;
        opacity: 0;
        transition: all 0.8s ease;
      }
      #button:hover {
        opacity: 1;
      }
      :host([align="right"]) #button {
        right: 0;
        left: unset;
      }
      @media screen and (max-width: 550px) {
        app-drawer {
          height: 40px;
        }
      }
    </style>
    <div hidden$="[[hidePanelOps]]">
      <hax-panel-item
        light="[[light]]"
        data-opened$="[[editMode]]"
        on-tap="_clickEditButton"
        icon="create"
        id="button"
        edged="[[align]]"
        label="[[__tipText]]"
      ></hax-panel-item>
    </div>
    <app-drawer
      id="drawer"
      opened="{{editMode}}"
      disable-swipe
      persistent
      transition-duration="800"
      align="[[align]]"
    >
      <hax-panel-item
        hidden$="[[hidePanelOps]]"
        on-tap="_clickSaveButton"
        icon="save"
        id="haxsavebutton"
        label="[[__tipText]]"
        event-name="save"
        voice-command="save content"
      ></hax-panel-item>
      <hax-panel-item
        icon="image:add-to-photos"
        icon-class="amber-text"
        label="Add"
        event-name="hax-manager-open"
        value="0"
      ></hax-panel-item>
      <hax-panel-item
        icon="search"
        icon-class="amber-text"
        label="Find"
        event-name="hax-manager-open"
        value="1"
      ></hax-panel-item>
      <hax-panel-item
        icon="hardware:toys"
        icon-class="amber-text"
        label="Make"
        event-name="hax-manager-open"
        value="2"
      ></hax-panel-item>
      <hax-panel-item
        icon="view-quilt"
        icon-class="amber-text"
        label="Layouts"
        event-name="hax-blox-picker-open"
        voice-command="insert block"
      ></hax-panel-item>
      <hax-panel-item
        icon="view-agenda"
        icon-class="amber-text"
        label="Templates"
        event-name="hax-stax-picker-open"
        voice-command="insert stack"
      ></hax-panel-item>
      <hax-panel-item
        icon="editor:text-fields"
        icon-class="light-blue-text"
        label="Text"
        event-name="text"
        voice-command="insert text"
      ></hax-panel-item>
      <hax-panel-item
        icon="editor:title"
        icon-class="light-blue-text"
        label="Heading"
        event-name="header"
        voice-command="insert heading"
      ></hax-panel-item>
      <hax-panel-item
        icon="image:transform"
        icon-class="light-blue-text"
        label="Placeholder"
        event-name="placeholder"
        voice-command="insert placeholder"
      ></hax-panel-item>
      <hax-panel-item
        icon="editor:space-bar"
        icon-class="light-blue-text text-darken-1"
        label="Divider"
        event-name="divider"
        voice-command="insert divider"
      ></hax-panel-item>
      <slot></slot>
      <hax-panel-item
        hidden$="[[hidePreferencesButton]]"
        on-tap="_preferencesDialog"
        icon="settings"
        label="Preferences"
      ></hax-panel-item>
      <hax-panel-item
        hidden$="[[hideExportButton]]"
        on-tap="_htmlExportDialog"
        icon="code"
        label="Export"
      ></hax-panel-item>
      <hax-panel-item
        hidden$="[[hidePanelOps]]"
        icon="cancel"
        id="haxcancelbutton"
        label="Cancel"
        event-name="cancel"
        voice-command="cancel hax"
      ></hax-panel-item>
    </app-drawer>
    <hax-stax-picker></hax-stax-picker>
    <hax-blox-picker></hax-blox-picker>
    <hax-preferences-dialog></hax-preferences-dialog>
  `,is:"hax-panel",listeners:{"hax-item-selected":"_processItemEvent"},observers:["_globalPreferencesChanged(globalPreferences.*)"],properties:{light:{type:Boolean},align:{type:String,reflectToAttribute:!0,value:"left"},editMode:{type:Boolean,reflectToAttribute:!0,observer:"_editModeChanged"},hideExportButton:{type:Boolean,value:!1},haxDeveloperMode:{type:Boolean,value:!1},hidePreferencesButton:{type:Boolean,value:!1},hidePanelOps:{type:Boolean,value:!1},globalPreferences:{type:Object}},ready:function(){document.body.appendChild(this)},attached:function(){this.fire("hax-register-panel",this);document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this));document.body.addEventListener("hax-panel-operation",this._processItemEvent.bind(this))},detached:function(){document.body.removeEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this));document.body.removeEventListener("hax-panel-operation",this._processItemEvent.bind(this))},_globalPreferencesChanged:function(value){if(typeof value!==typeof void 0){if(null!=value.value&&typeof value.value.haxShowExportButton!==typeof void 0){this.hideExportButton=!value.value.haxShowExportButton}if(null!=value.value&&typeof value.value.haxDeveloperMode!==typeof void 0){this.haxDeveloperMode=value.value.haxDeveloperMode}}},_haxStorePropertyUpdated:function(e){if(e.detail&&typeof e.detail.value!==typeof void 0&&e.detail.property){if("object"===typeof e.detail.value){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value)}},_processItemEvent:function(e){let detail=e.detail;switch(detail.eventName){case"open-panel":this._clickButton();break;case"cancel":this.toggle();this.fire("hax-cancel",detail);break;case"text":detail.tag="p";detail.content="";this.fire("hax-insert-content",detail);break;case"divider":detail.tag="hr";detail.content="";detail.properties={style:"width:100%;"};this.fire("hax-insert-content",detail);break;case"header":detail.tag="h2";detail.content="Header";this.fire("hax-insert-content",detail);break;case"placeholder":detail.tag="place-holder";detail.content="";detail.properties={style:"width:50%;"};this.fire("hax-insert-content",detail);break;case"image":detail.tag="img";detail.content="";detail.properties={src:pathFromUrl(import.meta.url)+window.HaxStore.instance.defaults.image.src,alt:window.HaxStore.instance.defaults.image.alt,style:"width:100%;"};this.fire("hax-insert-content",detail);break;case"iframe":detail.tag="iframe";detail.content="";detail.properties={src:window.HaxStore.instance.defaults.iframe.src,height:"400px",width:"100%",style:"width:100%;"};this.fire("hax-insert-content",detail);break;case"blockquote":detail.tag="blockquote";detail.content="";this.fire("hax-insert-content",detail);break;case"hax-manager-open":window.HaxStore.write("activeHaxElement",{},this);window.HaxStore.instance.haxManager.resetManager(parseInt(detail.value));window.HaxStore.instance.haxManager.toggleDialog(!1);break;case"hax-stax-picker-open":window.HaxStore.instance.haxStaxPicker.toggleDialog();break;case"hax-blox-picker-open":window.HaxStore.instance.haxBloxPicker.toggleDialog();break;case"undo":document.execCommand("undo");break;case"redo":document.execCommand("redo");break;default:break;}},_editModeChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0&&newValue){this.__tipText="Save";this.$.button.icon="save"}else{this.__tipText="Edit";this.$.button.icon="create"}},_clickEditButton:function(e){this.toggle()},_clickSaveButton:function(e){this.toggle();this.fire("hax-save",e.detail)},_htmlExportDialog:function(e){window.HaxStore.instance.haxExport.toggleDialog()},_preferencesDialog:function(e){window.HaxStore.instance.haxPreferences.toggleDialog()},toggle:function(e){window.HaxStore.write("editMode",!this.editMode,this);this.$.drawer.opened=this.editMode;if(!this.$.drawer.opened){window.HaxStore.instance.closeAllDrawers()}}});