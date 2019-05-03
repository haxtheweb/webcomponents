define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/elements/dom-if.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@polymer/polymer/lib/utils/flush.js","./lib/a11y-collapse-accordion-button.js","./lib/a11y-collapse-icon-button.js"],function(_exports,_polymerElement,_domIf,_renderStatus,_HAXWiring,_flush2,_a11yCollapseAccordionButton,_a11yCollapseIconButton){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.A11yCollapse=void 0;function _templateObject_852c3a606d6a11e9bb84a72609756494(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n          margin: var(--a11y-collapse-margin, 15px 0);\n          border: var(--a11y-collapse-border, 1px solid);\n          transition: all 0.5s;\n          @apply --a11y-collapse;\n        }\n        :host #content {\n          max-height: 0;\n          overflow: hidden;\n          padding: 0 var(--a11y-collapse-horizontal-padding, 16px);\n          border-top: 0px solid rgba(255, 255, 255, 0);\n          transition: all 0.5s ease-in-out;\n          @apply --a11y-collapse-content;\n        }\n        :host(:not(:first-of-type)) {\n          border-top: var(\n            --a11y-collapse-border-between,\n            var(--a11y-collapse-border, 1px solid)\n          );\n        }\n        :host([disabled]) {\n          opacity: 0.5;\n          @apply --a11y-collapse-disabled;\n        }\n        :host([disabled]:not([accordion])) #expand,\n        :host([disabled][accordion]) #heading {\n          cursor: not-allowed;\n        }\n        :host([expanded]) {\n          @apply --a11y-collapse-expanded;\n        }\n        :host([expanded]) #content {\n          max-height: unset;\n          overflow: hidden;\n          padding: var(--a11y-collapse-vertical-padding, 16px)\n            var(--a11y-collapse-horizontal-padding, 16px);\n          border-top: var(--a11y-collapse-border, 1px solid);\n          @apply --a11y-collapse-content-expanded;\n        }\n        :host(:not([expanded])) #content-inner {\n          overflow: hidden;\n        }\n      </style>\n      <template is=\"dom-if\" if=\"[[!accordion]]\" restamp>\n        <a11y-collapse-icon-button\n          id=\"iconbutton\"\n          disabled$=\"[[disabled]]\"\n          expanded$=\"[[_setAriaExpanded(expanded)]]\"\n          label$=\"[[_getExpandCollapse(expanded,label,labelExpanded)]]\"\n          icon$=\"[[_getExpandCollapse(expanded,icon,iconExpanded)]]\"\n          rotated$=\"[[__rotateIcon]]\"\n          tooltip$=\"[[_getExpandCollapse(expanded,tooltip,tooltipExpanded)]]\"\n        >\n          <slot name=\"heading\"></slot>\n        </a11y-collapse-icon-button>\n      </template>\n      <template is=\"dom-if\" if=\"[[accordion]]\" restamp>\n        <a11y-collapse-accordion-button\n          id=\"accordionbutton\"\n          disabled$=\"[[disabled]]\"\n          expanded$=\"[[_setAriaExpanded(expanded)]]\"\n          label$=\"[[_getExpandCollapse(expanded,label,labelExpanded)]]\"\n          icon$=\"[[_getExpandCollapse(expanded,icon,iconExpanded)]]\"\n          rotated$=\"[[__rotateIcon]]\"\n          tooltip$=\"[[_getExpandCollapse(expanded,tooltip,tooltipExpanded)]]\"\n        >\n          <slot name=\"heading\"></slot>\n        </a11y-collapse-accordion-button>\n      </template>\n      <div\n        id=\"content\"\n        aria-hidden$=\"{{!expanded}}\"\n        aria-labelledby=\"heading\"\n        aria-live=\"polite\"\n      >\n        <div id=\"content-inner\"><slot name=\"content\"></slot><slot></slot></div>\n      </div>\n    "],["\n      <style>\n        :host {\n          display: block;\n          margin: var(--a11y-collapse-margin, 15px 0);\n          border: var(--a11y-collapse-border, 1px solid);\n          transition: all 0.5s;\n          @apply --a11y-collapse;\n        }\n        :host #content {\n          max-height: 0;\n          overflow: hidden;\n          padding: 0 var(--a11y-collapse-horizontal-padding, 16px);\n          border-top: 0px solid rgba(255, 255, 255, 0);\n          transition: all 0.5s ease-in-out;\n          @apply --a11y-collapse-content;\n        }\n        :host(:not(:first-of-type)) {\n          border-top: var(\n            --a11y-collapse-border-between,\n            var(--a11y-collapse-border, 1px solid)\n          );\n        }\n        :host([disabled]) {\n          opacity: 0.5;\n          @apply --a11y-collapse-disabled;\n        }\n        :host([disabled]:not([accordion])) #expand,\n        :host([disabled][accordion]) #heading {\n          cursor: not-allowed;\n        }\n        :host([expanded]) {\n          @apply --a11y-collapse-expanded;\n        }\n        :host([expanded]) #content {\n          max-height: unset;\n          overflow: hidden;\n          padding: var(--a11y-collapse-vertical-padding, 16px)\n            var(--a11y-collapse-horizontal-padding, 16px);\n          border-top: var(--a11y-collapse-border, 1px solid);\n          @apply --a11y-collapse-content-expanded;\n        }\n        :host(:not([expanded])) #content-inner {\n          overflow: hidden;\n        }\n      </style>\n      <template is=\"dom-if\" if=\"[[!accordion]]\" restamp>\n        <a11y-collapse-icon-button\n          id=\"iconbutton\"\n          disabled$=\"[[disabled]]\"\n          expanded$=\"[[_setAriaExpanded(expanded)]]\"\n          label$=\"[[_getExpandCollapse(expanded,label,labelExpanded)]]\"\n          icon$=\"[[_getExpandCollapse(expanded,icon,iconExpanded)]]\"\n          rotated$=\"[[__rotateIcon]]\"\n          tooltip$=\"[[_getExpandCollapse(expanded,tooltip,tooltipExpanded)]]\"\n        >\n          <slot name=\"heading\"></slot>\n        </a11y-collapse-icon-button>\n      </template>\n      <template is=\"dom-if\" if=\"[[accordion]]\" restamp>\n        <a11y-collapse-accordion-button\n          id=\"accordionbutton\"\n          disabled$=\"[[disabled]]\"\n          expanded$=\"[[_setAriaExpanded(expanded)]]\"\n          label$=\"[[_getExpandCollapse(expanded,label,labelExpanded)]]\"\n          icon$=\"[[_getExpandCollapse(expanded,icon,iconExpanded)]]\"\n          rotated$=\"[[__rotateIcon]]\"\n          tooltip$=\"[[_getExpandCollapse(expanded,tooltip,tooltipExpanded)]]\"\n        >\n          <slot name=\"heading\"></slot>\n        </a11y-collapse-accordion-button>\n      </template>\n      <div\n        id=\"content\"\n        aria-hidden\\$=\"{{!expanded}}\"\n        aria-labelledby=\"heading\"\n        aria-live=\"polite\"\n      >\n        <div id=\"content-inner\"><slot name=\"content\"></slot><slot></slot></div>\n      </div>\n    "]);_templateObject_852c3a606d6a11e9bb84a72609756494=function _templateObject_852c3a606d6a11e9bb84a72609756494(){return data};return data}/**
 * `a11y-collapse`
 * An accessible expand collapse.
 * 
 * @microcopy - the mental model for this element```
  <a11y-collapse 
    accordion 
    disabled
    icon=""                         //The expand/collapse icon. Default is "icons:expand-more"
    icon-expanded=""                //The expand/collapse icon when expanded. Default is the same as when collapsed.
    label=""                        //The expand/collapse label. Default is "expand/collapse"
    label-expanded=""               //The expand/collapse label when expanded. Default is the same as when collapsed.
    tooltip=""                      //The expand/collapse tooltip. Default is "toggle expand/collapse"
    tooltip-expanded=""             //The expand/collapse tooltip when expanded. Default is the same as when collapsed.
    <p slot="heading">...</p>       //Named slot for a heading.
    ...                             //Unnamed slot for a collapsible content.
  </a11y-collapse>

  CSS Variables: 
  --a11y-collapse-horizontal-padding               //sets the horizontal padding (left and right) inside the a11y-collapse
  --a11y-collapse-vertical-padding                 //sets the horizontal padding (top and bottom) inside the a11y-collapse
  --a11y-collapse-border                           //sets the border style. Default is 0px solid black

  CSS Mixins: 
  --a11y-collapse: { ... };                        //sets CSS for the a11y-collapse container
  --a11y-collapse-disabled: { ... };               //sets CSS for the a11y-collapse container when disabled
  --a11y-collapse-expanded: { ... };               //sets CSS for the a11y-collapse container when expanded
  --a11y-collapse-heading: { ... };                //sets CSS for the a11y-collapse heading
  --a11y-collapse-heading-expanded: { ... };       //sets CSS for the a11y-collapse heading when expanded
  --a11y-collapse-heading-focus: { ... };          //sets CSS for the a11y-collapse heading when focused or hovered
  --a11y-collapse-heading-text: { ... };           //sets CSS for the a11y-collapse heading text
  --a11y-collapse-heading-text-expanded: { ... };  //sets CSS for the a11y-collapse heading text when expanded
  --a11y-collapse-heading-text-focus: { ... };     //sets CSS for the a11y-collapse heading text when heading is focused or hovered
  --a11y-collapse-icon: { ... };                   //sets CSS for the a11y-collapse icon
  --a11y-collapse-icon-expanded: { ... };          //sets CSS for the a11y-collapse icon when expanded
  --a11y-collapse-icon-focus: { ... };             //sets CSS for the a11y-collapse icon when button is focused or hovered
  --a11y-collapse-icon-rotated: { ... };           //sets CSS for the a11y-collapse icon when rotated
  --a11y-collapse-content: { ... };                //sets CSS for the a11y-collapse expanded/collapsed content
  --a11y-collapse-content-expanded: { ... };       //sets CSS for the a11y-collapse expanded/collapsed content when expanded
```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 */var A11yCollapse=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(A11yCollapse,_PolymerElement);function A11yCollapse(){babelHelpers.classCallCheck(this,A11yCollapse);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(A11yCollapse).apply(this,arguments))}babelHelpers.createClass(A11yCollapse,[{key:"_flush",value:function _flush(newValue){(0,_flush2.flush)()}/**
   * Attached to the DOM, now fire.
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(A11yCollapse.prototype),"connectedCallback",this).call(this);this.dispatchEvent(new CustomEvent("a11y-collapse-attached",{bubbles:!0,cancelable:!0,composed:!0,detail:this}));(0,_renderStatus.afterNextRender)(this,function(){this.addEventListener("a11y-collapse-tap",this._onTap.bind(this));this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(A11yCollapse.haxProperties,A11yCollapse.tag,this)})}},{key:"collapse",/**
   * Collapses the content
   */value:function collapse(){this.toggle(!1)}/**
   * Let the group know that this is gone.
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){this.dispatchEvent(new CustomEvent("a11y-collapse-detached",{bubbles:!0,cancelable:!0,composed:!0,detail:this}));this.removeEventListener("a11y-collapse-tap",this._onTap.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(A11yCollapse.prototype),"disconnectedCallback",this).call(this)}/**
   * Expands the content
   */},{key:"expand",value:function expand(){this.toggle(!0)}/**
   * Toggles based on mode
   */},{key:"toggle",value:function toggle(mode){this.expanded=mode!==void 0?mode:!this.expanded}/**
   * Fires toggling events
   */},{key:"_fireToggleEvents",value:function _fireToggleEvents(){this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,cancelable:!0,composed:!0,detail:this}));//supports legacy version
this.dispatchEvent(new CustomEvent("a11y-collapse-toggle",{bubbles:!0,cancelable:!0,composed:!0,detail:this}));if(this.expanded){this.dispatchEvent(new CustomEvent("expand",{bubbles:!0,cancelable:!0,composed:!0,detail:this}))}else{this.dispatchEvent(new CustomEvent("collapse",{bubbles:!0,cancelable:!0,composed:!0,detail:this}))}}/**
   * If no expanded value is set, the default will be same as collapsed
   */},{key:"_overrideProp",value:function _overrideProp(prop,val){this[prop]=val}/**
   * If no expanded value is set, the default will be same as collapsed
   */},{key:"_getExpandCollapse",value:function _getExpandCollapse(expanded,ifFalse,ifTrue){return expanded&&null!==ifTrue?ifTrue:ifFalse}/**
   * If no expanded icon is set, the default icon will rotate when expanded
   */},{key:"_isRotated",value:function _isRotated(expanded,iconExpanded){return!expanded&&null===iconExpanded}/**
   * Handle tap
   */},{key:"_onTap",value:function _onTap(e){if(!this.disabled){this.toggle();this.dispatchEvent(new CustomEvent("a11y-collapse-click",{bubbles:!0,cancelable:!0,composed:!0,detail:this}))}}/**
   * Attached to the DOM, now fire.
   */},{key:"_setAriaExpanded",value:function _setAriaExpanded(expanded){return""+expanded}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_852c3a606d6a11e9bb84a72609756494())}},{key:"tag",get:function get(){return"a11y-collapse"}},{key:"properties",get:function get(){return{/**
       * accordion-style: whole header acts as button? default is just icon.
       */accordion:{name:"accordion",type:Boolean,value:!1,observer:"_flush",reflectToAttribute:!0},/**
       * is disabled?
       */disabled:{name:"disabled",type:Boolean,value:!1,reflectToAttribute:!0},/**
       * icon when expanded
       */expanded:{name:"expanded",type:Boolean,value:!1,reflectToAttribute:!0,observer:"_fireToggleEvents"},/**
       * icon for the button
       */icon:{name:"icon",type:String,value:"expand-more"},/**
       * icon when expanded
       */iconExpanded:{name:"iconExpanded",type:String,value:null},/**
       * label for the button
       */label:{name:"label",type:String,value:"expand/collapse"},/**
       * optional label for the button when expanded
       */labelExpanded:{name:"labelExpanded",type:String,value:null},/**
       * tooltip for the button
       */tooltip:{name:"tooltip",type:String,value:"toggle expand/collapse"},/**
       * optional tooltip for the button when expanded
       */tooltipExpanded:{name:"tooltipExpanded",type:String,value:null},/**
       * If no expanded icon is set, the default icon will rotate when expanded
       */__rotateIcon:{name:"__rotateIcon",type:Boolean,computed:"_isRotated(expanded,iconExpanded)"}}}},{key:"haxProperties",get:function get(){return{canScale:!1,canPosition:!0,canEditSource:!1,gizmo:{title:"Single Expand Collapse",description:"A single instance of an expand collapse.",icon:"view-day",color:"grey",groups:["Text"],meta:{author:"Your organization on github"}},settings:{quick:[],configure:[{property:"expanded",title:"Expanded",description:"Expand by default",inputMethod:"boolean"},{property:"label",title:"Label",description:"The label of the toggle expand/collapse button",inputMethod:"textfield",icon:"editor:title"},{property:"tooltip",title:"Tooltip",description:"The tooltip for the toggle expand/collapse button",inputMethod:"textfield",icon:"editor:title"},{property:"icon",title:"Icon",description:"The icon for the toggle expand/collapse button",inputMethod:"textfield",icon:"editor:title"},{property:"iconExpanded",title:"Expanded Icon",description:"Optional: The icon for the toggle expand/collapse button when expanded",inputMethod:"textfield",icon:"editor:title"}],advanced:[]}}}}]);return A11yCollapse}(_polymerElement.PolymerElement);_exports.A11yCollapse=A11yCollapse;window.customElements.define(A11yCollapse.tag,A11yCollapse)});