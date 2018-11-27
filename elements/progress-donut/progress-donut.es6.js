import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@lrnwebcomponents/chartist-render/chartist-render.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";Polymer({_template:html`
    <style is="custom-style">
      :host {
        background-color: var(--simple-colors-background1, #ffffff);
        overflow: visible;
        display: block;
      }
      :host #wrapper {
        margin: 0 auto;
        position: relative;
      }
      :host #wrapper > * {
        position: absolute;
      }
      :host #wrapper #chart {
        left: 0;
        top: 0;
      }
      :host #wrapper,
      :host #wrapper #chart {
        width: 250px;
        height: 250px;
      }
      :host([size="xs"]) #wrapper,
      :host([size="xs"]) #wrapper #chart {
        width: 150px;
        height: 150px;
      }
      :host([size="sm"]) #wrapper,
      :host([size="sm"]) #wrapper #chart {
        width: 200px;
        height: 200px;
      }
      :host([size="lg"]) #wrapper,
      :host([size="lg"]) #wrapper #chart {
        width: 300px;
        height: 300px;
      }
      :host([size="xl"]) #wrapper,
      :host([size="xl"]) #wrapper #chart {
        width: 400px;
        height: 400px;
      }
      :host #wrapper > #image {
        left: 20%;
        top: 20%;
        width: 60%;
        height: 60%;
        -webkit-clip-path: circle(50% at 50% 50%);
        clip-path: circle(50% at 50% 50%);
      }
    </style>
    <div id="wrapper">
      <img id="image" alt\$="[[imageAlt]]" aria-hidden="true" hidden\$="[[!imageSrc]]" src\$="[[imageSrc]]" style\$="[[imageStyle]]">
      <chartist-render id="chart" data\$="[[data]]" chart-desc\$="[[desc]]" chart-title="[[title]]" scale="ct-square" options\$="[[options]]" title\$="[[title]]" type="pie">
      </chartist-render>
    </div>
`,is:"progress-donut",behaviors:[HAXBehaviors.PropertiesBehaviors,simpleColorsBehaviors,SchemaBehaviors.Schema],listeners:{"chartist-render-draw":"_onCreated"},properties:{complete:{type:Array,value:[]},donutThickness:{type:Number},colors:{type:Array,value:null},data:{type:Array,computed:"_getData(complete)"},desc:{type:String,value:null},options:{type:Array,computed:"_getOptions(complete,total,size,colors,accentColor,dark)"},imageSrc:{type:String,value:null,reflectToAttribute:!0},imageAlt:{type:String,value:null,reflectToAttribute:!0},imageStyle:{type:String,computed:"_getImageStyle(size)"},size:{type:String,value:"md"},title:{type:String},total:{type:Number,value:100}},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Sample gizmo",description:"The user will be able to see this for selection in a UI.",icon:"av:play-circle-filled",color:"grey",groups:["Video","Media"],handles:[{type:"video",url:"source"}],meta:{author:"Your organization on github"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"}],advanced:[]}};this.setHaxProperties(props)},_getData:function(complete){return{series:complete}},_getImageStyle:function(size){let offset="22%",diameter="56%";if("xs"===this.size){offset="32%";diameter="36%"}else if("sm"===this.size){offset="26%";diameter="48%"}else if("lg"===this.size){offset="20%";diameter="60%"}else if("xl"===this.size){offset="17%";diameter="66%"}return"left: "+offset+"; top: "+offset+"; width: "+diameter+"; height: "+diameter+";"},_getOptions:function(complete,total,size,colors,accentColor,dark){let sum=0;for(let i=0;i<complete.length;i++){sum+=parseFloat(complete[i])}return{donut:!0,showLabel:!1,startAngle:0,total:Math.max(sum,total)}},_onCreated:function(e){this.__chart=e.detail;this.makeChart(this.__chart)},makeChart:function(chart){if(chart!==void 0){let colors=this.colors,strokeWidth="10%",hex=window.SimpleColorsUtility.hexCodes,accent=null!==this.accentColor?this.accentColor.replace(/-([a-z])/g,function(g){return g[1].toUpperCase()}):null;if(colors===void 0||null===colors||0===colors.length){if(null!==accent&&null!==hex[accent]){colors=this.dark?[hex[accent][9],hex[accent][6],hex[accent][3],hex[accent][7],hex[accent][4]]:[hex[accent][0],hex[accent][3],hex[accent][5],hex[accent][2],hex[accent][4]]}else{colors=this.dark?[hex.orange[6],hex.pink[4],hex.purple[5],hex.cyan[6],hex.lime[5]]:[hex.pink[5],hex.deepPurple[4],hex.blue[3],hex.teal[4],hex.yellow[5]]}}if("xs"===this.size){strokeWidth="8%"}else if("sm"===this.size){strokeWidth="9%"}else if("lg"===this.size){strokeWidth="11%"}else if("xl"===this.size){strokeWidth="12%"}chart.on("draw",function(data){data.element._node.style.strokeWidth=strokeWidth;data.element._node.style.stroke=colors[data.index%colors.length];if("slice"===data.type){var pathLength=data.element._node.getTotalLength();data.element.attr({"stroke-dasharray":pathLength+"px "+pathLength+"px"});var animationDefinition={"stroke-dashoffset":{id:"anim"+data.index,dur:500,from:-pathLength+"px",to:"0px",easing:Chartist.Svg.Easing.easeOutQuint,fill:"freeze"}};if(0!==data.index){animationDefinition["stroke-dashoffset"].begin="anim"+(data.index-1)+".end"}data.element.attr({"stroke-dashoffset":-pathLength+"px"});data.element.animate(animationDefinition,!1)}});return chart}}});