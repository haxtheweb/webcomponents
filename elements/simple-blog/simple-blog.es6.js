import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@polymer/iron-pages/iron-pages.js";import"./node_modules/@polymer/paper-icon-button/paper-icon-button.js";import{HAXCMSThemeWiring}from"./node_modules/@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";import{store}from"./node_modules/@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";import{autorun,toJS}from"./node_modules/mobx/lib/mobx.module.js";import"./lib/simple-blog-listing.js";import"./lib/simple-blog-header.js";import"./lib/simple-blog-footer.js";import"./lib/simple-blog-post.js";let SimpleBlog=Polymer({_template:html`
    <style include="simple-colors">
      :host {
        display: block;
        font-family: "Roboto", "Noto", sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        margin: 0;
        padding: 24px;
        background-color: #fafafa;
        font-family: "Open Sans", "MundoSans", helvetica neue, Arial, Helvetica,
          sans-serif;
        margin: 0;
        padding: 0;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-font-feature-settings: "liga=1, dlig=1";
        -ms-font-feature-settings: "liga", "dlig";
        -webkit-font-feature-settings: "liga", "dlig";
        -o-font-feature-settings: "liga", "dlig";
        font-feature-settings: "liga", "dlig";
      }
      #backbutton {
        position: fixed;
        top: 0px;
        left: 0px;
        padding: 2px;
        width: 40px;
        height: 40px;
        margin: 8px;
        z-index: 1000;
        color: black;
        background-color: rgba(250, 250, 250, 0.5);
        opacity: 0.5;
        border-radius: 50%;
        transition: all 0.6s linear;
      }
      #backbutton:focus,
      #backbutton:hover {
        opacity: 1;
        color: white;
        background-color: var(--haxcms-color, black);
      }
      iron-pages,
      iron-pages section {
        width: 100vw;
        height: 100vh;
      }
      #post {
        transition: all 0.6s ease-in-out;
        visibility: hidden;
      }
      :host([selected-page="0"]) #post {
        visibility: visible;
        opacity: 0;
        visibility: hidden;
      }
      :host([selected-page="1"]) #post {
        visibility: visible;
        opacity: 1;
      }
      a, a:* {
        color: inherit;
      }
    </style>
    <iron-pages selected="[[selectedPage]]">
      <section>
        <simple-blog-header manifest="[[manifest]]"></simple-blog-header>
        <simple-blog-listing
          id="listing"
          items="[[manifest.items]]"
        ></simple-blog-listing>
      </section>
      <section>
        <paper-icon-button
          id="backbutton"
          icon="icons:arrow-back"
          on-tap="_goBack"
        ></paper-icon-button>
        <paper-tooltip
          for="backbutton"
          position="right"
          offset="14"
          animation-delay="100"
        >
          Back to main site
        </paper-tooltip>
        <simple-blog-post
          id="post"
          active-item="[[activeItem]]"
          edit-mode="[[editMode]]"
          ><slot></slot
        ></simple-blog-post>
        <simple-blog-footer
          id="footer"
          manifest="[[manifest]]"
        ></simple-blog-footer>
      </section>
    </iron-pages>
  `,is:"simple-blog",behaviors:[SchemaBehaviors.Schema],properties:{selectedPage:{type:Number,reflectToAttribute:!0,value:0},editMode:{type:Boolean,reflectToAttribute:!0},activeItem:{type:Object},manifest:{type:Object}},created:function(){this.HAXCMSThemeWiring=new HAXCMSThemeWiring(this)},ready:function(){this.HAXCMSThemeWiring.connect(this,this.$.post.$.contentcontainer)},attached:function(){this.__disposer=autorun(()=>{this.manifest=toJS(store.routerManifest);this._locationChanged(store.location)})},detached:function(){this.HAXCMSThemeWiring.disconnect(this);this.__disposer()},_locationChanged:function(location){if(!location||"undefined"===typeof location.route)return;const name=location.route.name;if("home"===name||"404"===name){this.selectedPage=0}else{this.selectedPage=1;window.scrollTo(0,0)}},_goBack:function(e){window.history.pushState(null,null,store.location.baseUrl);window.dispatchEvent(new PopStateEvent("popstate"))}});export{SimpleBlog};