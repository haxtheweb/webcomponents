import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";import{IronResizableBehavior}from"./node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js";import"./node_modules/@polymer/paper-styles/paper-styles.js";Polymer({_template:html`
  <custom-style>
        <style is="custom-style">
            :host {
                @apply(--layout-vertical);
                @apply(--layout-center-center);
                position: relative;
                width: var(--circle-progress-width, 64px);
                height: var(--circle-progress-height, 64px);
                margin: 24px;
                border-radius: 50%;
            }

            svg {
                position: absolute;
                top: 0;
                left: 0;
                display: none;
            }
            .circle-background {
                stroke: var(--circle-progress-bg-stroke-color, --paper-grey-100);
            }

            .circle-foreground {
                transition: stroke-dashoffset var(--circle-progress-transition, 150ms);

                stroke: var(--circle-progress-stroke-color, blue);
                stroke-linecap: var(--circle-progress-stroke-linecap, round);
            }

        </style>
  </custom-style>
        <svg id="circle" width="100%" height="100%">
            <circle class="circle-background" r\$="[[_radius]]" cx\$="[[_cx]]" cy\$="[[_cy]]" fill="transparent" stroke-width\$="[[strokeWidth]]"></circle>
            <circle class="circle-foreground" r\$="[[_radius]]" cx\$="[[_cx]]" cy\$="[[_cy]]" fill="transparent" stroke-width\$="[[strokeWidth]]" stroke-dasharray\$="[[_dasharray]]" stroke-dashoffset\$="[[_dashoffset]]" transform\$="[[_transform]]"></circle>
        </svg>

        <slot></slot>
`,is:"circle-progress",behaviors:[IronResizableBehavior],properties:{value:{type:Number,value:0},max:{type:Number,value:100},strokeWidth:{type:Number,value:4},angle:{type:Number,value:-90},_cx:{type:Number,value:null},_cy:{type:Number,value:null},_radius:{type:Number,computed:"_computeRadius(_cx, _cy, strokeWidth)"},_transform:{type:String,computed:"_computeTransform(angle, _cx, _cy)"},_dasharray:{type:Number,computed:"_computeDashArray(_radius)"},_dashoffset:{type:Number,computed:"_computeDashOffset(value, max, _dasharray)"}},listeners:{"iron-resize":"_onIronResize"},_computeDashArray:function(radius){return 2*Math.PI*radius},_computeDashOffset:function(value,max,dasharray){return(1-value/max)*dasharray},_computeRadius:function(cx,cy,strokeWidth){return cx&&cy?Math.max(0,Math.min(cx,cy)-strokeWidth/2):0},_computeTransform:function(angle,cx,cy){return cx&&cy?"rotate("+angle+", "+cx+", "+cy+")":""},_onIronResize:function(){console.log(this.offsetHeight);if(this.offsetWidth&&this.offsetHeight){this._cx=this.offsetWidth/2;this._cy=this.offsetHeight/2;this.$.circle.style.display="block"}}});