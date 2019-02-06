import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js";export{LrndesignTimeline};class LrndesignTimeline extends SimpleColors{static get template(){return html`
<style>:host {
  font-size: 14px;
  font-weight: 100;
  line-height: 160%;
  display: block;
  --lrndesign-timeline-color: var(--simple-colors-default-theme-grey-8, #444);
  --lrndesign-timeline-color-print: #000;
  --lrndesign-timeline-background: #f4f4f4;
  --lrndesign-timeline-background-print: #fff;
  --lrndesign-timeline-border: var(--simple-colors-default-theme-grey-5, #bbb);
  --lrndesign-timeline-border-print: var(--simple-colors-light-theme-grey-5, #bbb);
  --lrndesign-timeline-accent: #000;
  --lrndesign-timeline-accent-background: #fff;
  --lrndesign-timeline-accent-border: var(--simple-colors-default-theme-accent-8, #444);
  --lrndesign-timeline-header: var(--simple-colors-default-theme-accent-1, #fff);
  --lrndesign-timeline-header-accent: var(--simple-colors-default-theme-accent-8, #444);
  --lrndesign-timeline-accent-print: var(--simple-colors-light-theme-accent-8, #444);
}
:host([dark]){
  --lrndesign-timeline-background: #1b1b1b;
}
:host([hidden]) {
  display: none;
}
:host #timeline {
  display: block;
  border-radius: 3px;
  border: 1px solid var(--lrndesign-timeline-border-print);
  border-left: 3px solid var(--lrndesign-timeline-accent-print);
  background-color: var(--lrndesign-timeline-background-print);
  color: var(--lrndesign-timeline-color-print);
}
:host #events {
  padding: 0;
  width: 100%;
  min-height: 300px;
}
:host .heading {
  margin: 0;
  color: var(--lrndesign-timeline-accent-print);
}
:host .heading h2 {
  font-size: 24px;
  font-weight: 300;
}
:host .heading h2,
:host .details,
:host .media {
  padding: 0 40px;
}
:host .details {
  margin: 15px 0; 
}
:host .media { 
  opacity: 1;
  transition: opacity 0.5s;
}
:host .media, 
:host .media * { 
  margin: 0 auto;
  max-width: 100%;
  max-height: 260px;
}
@media screen {
  :host #timeline {
    color: var(--lrndesign-timeline-color);
    background-color: var(--lrndesign-accent-background);
    border: 1px solid var(--lrndesign-timeline-border);
    border-left: 3px solid var(--lrndesign-timeline-accent-border);
  }
  :host([dark]) #timeline {
    background-color: var(--lrndesign-timeline-background);
  }
  :host h2 {
    color:  var(--lrndesign-timeline-header-accent);
  }
  :host(:not([timeline-size="xs"])) #timeline {
    background-color: var(--lrndesign-timeline-background);
  }
  :host(:not([timeline-size="xs"])) h2 {
    color: var(--lrndesign-timeline-header-accent);
  }
  :host(:not([timeline-size="xs"])) #events {
    height: 300px;
    position: relative;
    overflow-y: scroll;
  }
  :host(:not([timeline-size="xs"])) .event {
    position: static;
    top: 0;
  }
  :host(:not([timeline-size="xs"])) .event-overview {
    padding: 0;
    position: sticky;
    top: 0;
  }
  :host(:not([timeline-size="xs"])) .heading {
    position: absolute;
    top: 0;
    padding: 10px 0;
    overflow: hidden;
    background-color: transparent;
    width: calc(55% + 30px);
  }
  :host(:not([timeline-size="xs"])) .event[has-media][selected] .heading {
    z-index: 2;
  }
  :host(:not([timeline-size="xs"])) .event[has-media] .heading:after {
    content: ' ';
    z-index: 200;
    position: absolute;
    top: 42px;
    right: 30px;
    width: 0; 
    padding: 0; 
    border-top: 0px solid transparent;
    border-bottom: 0px solid transparent;
    border-left: 0px solid transparent;
    transition: all 0.3s;
    transition-delay: 0.2s;
  }
  :host(:not([timeline-size="xs"])) .event[has-media][selected] .heading:after {
    top: 7px;
    right: 0px;
    border-top: 35px solid transparent;
    border-bottom: 35px solid transparent; 
    border-left: 35px solid var(--lrndesign-timeline-header-accent);
  }
  :host(:not([timeline-size="xs"])) .heading h2 {
    margin: 7px 48px 0 20px;
    padding: 0 20px;
    line-height: 50px;
    height: 50px;
    color: var(--lrndesign-timeline-color);
    background-color: var(--lrndesign-timeline-background);
    transition: background-color 0.3s;
  }
  :host(:not([timeline-size="xs"])) .event[selected] .heading h2 {
    background-color: var(--lrndesign-timeline-header-accent);
    color:  var(--lrndesign-timeline-header);
  }
  :host(:not([timeline-size="xs"])) .event[has-media] .heading h2:after {
    content: '';
    position: absolute;
    left: calc(100% - 48px);
    top: 17px;
    height: 50px;
    width: 0px;
    transition: all 0.3s;
    background-color: var(--lrndesign-timeline-background);
  }
  :host(:not([timeline-size="xs"])) .event[has-media][selected] .heading h2:after {
    width: 13px;
    background-color: var(--lrndesign-timeline-header-accent);
  }
  :host(:not([timeline-size="xs"])) .media-outer {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    width: 45%;
    height: 300px;
  }
  :host(:not([timeline-size="xs"])) .media {
    display: flex;
    padding: 20px 20px 20px 50px;
    opacity: 0;
    transition: opacity 0.3s delay 0.3s;
  }
  :host(:not([timeline-size="xs"])) .event[selected] .media {
    opacity: 1;
    transition-delay: 0s;
  }
  :host(:not([timeline-size="xs"])) .details {
    padding: 67px 20px 20px;
    margin: 0 20px;
    width: calc(55% - 80px);
    color: var(--lrndesign-timeline-color);
    background-color: var(--lrndesign-timeline-background);
    border: 1px solid var(--lrndesign-timeline-background);
    border-radius: 3px;
    transition: all 0.5s;
  }
  :host(:not([timeline-size="xs"])) .event:last-of-type .details {
    min-height: 180px;
  }
  :host(:not([timeline-size="xs"])) .event[selected] .details {
    color: var(--lrndesign-timeline-accent);
    background-color:  var(--lrndesign-timeline-accent-background);
    border: 1px solid var(--lrndesign-timeline-border);
    box-shadow: 0 2px 2px var(--lrndesign-timeline-border);
  }
  :host(:not([timeline-size="xs"])) .event:first-of-type[selected] .details {
    border-top: 1px solid var(--lrndesign-timeline-background);
  }
  :host(:not([timeline-size="xs"])) .event:last-of-type[selected] .details {
    border-bottom: 1px solid var(--lrndesign-timeline-background);
  }
}</style>
<style is="custom-style" include="simple-colors"></style>
<article>
  <h1 id="title">[[title]]</h1>
  <slot></slot>
  <div id="timeline">
      <div id="events" on-scroll="_onScroll">
        <template id="repeat" is="dom-repeat" items="[[events]]" as="event" index-as="index" restamp>
          <section class="event" has-media$="[[_isSet(event.imagesrc)]]">
            <div class="event-overview">
              <div class="heading"><h2>[[event.heading]]</h2></div>
              <div class="media-outer">
                <template is="dom-if" if="[[_isSet(event.imagesrc)]]" restamp>
                  <div class="media">
                    <div><image alt$="[[event.imagealt]]" src$="[[event.imagesrc]]"/></div>
                  </div>
                </template>
              </div>
            </div>
            <div class="details">[[event.details]]</div>
          </section>
        </template>
    </div>
  </div>
</article>`}static get haxProperties(){return{canScale:!1,canPosition:!1,canEditSource:!0,gizmo:{title:"Timeline",description:"A timeline of events with images and text",icon:"icons:timeline",color:"indigo",groups:["Content","Instructional","Media","Image"],handles:[{type:"image",source:"image"}],meta:{author:"LRNWebComponents"}},settings:{quick:[],configure:[{property:"title",title:"Timeline Title",description:"A title for the timeline.",inputMethod:"textfield"},{property:"accentColor",title:"Accent Color",description:"An optional accent color.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark Theme",description:"Enable Dark Theme",inputMethod:"boolean",icon:"icons:invert-colors"},{slot:"",title:"Timeline Description",description:"Optional text describing the timeline.",inputMethod:"textfield"},{property:"events",title:"Timeline Events",description:"The events in the timeline",inputMethod:"array",properties:[{property:"heading",title:"Event Heading",description:"The heading for the event.",inputMethod:"textfield",icon:"editor:title"},{property:"details",title:"Event Details",description:"The body text with details for the event.",inputMethod:"textfield",icon:"editor:title"},{property:"imagesrc",title:"Event Image",description:"The path of the image.",inputMethod:"textfield",icon:"editor:title"},{property:"imagealt",title:"Event Image Alt Text",description:"The alt text of the image (for accessibility).",inputMethod:"textfield",icon:"editor:title"}]}],advanced:[]}}}static get properties(){return{title:{type:"String",value:null},events:{type:"Array",value:[],notify:!0},timelineSize:{type:"String",value:"xs",reflectToAttribute:!0}}}static get tag(){return"lrndesign-timeline"}static get behaviors(){return[SimpleColors]}static get observers(){return["_updateEvents(events.*)"]}connectedCallback(){let root=this;super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(LrndesignTimeline.haxProperties,LrndesignTimeline.tag,this);window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"timeline-size",relativeToParent:!0,sm:600,md:900,lg:1200,xl:1600}}));this._checkScroll()}_checkScroll(){let root=this,events=root.shadowRoot.querySelectorAll(".event");if(1>events.length)root.$.repeat.render();events=root.shadowRoot.querySelectorAll(".event");events.forEach(event=>{let top=event.offsetTop,target=events[0].offsetTop+50+event.parentNode.scrollTop,bottom=event.offsetTop+event.offsetHeight;if(target>top&&target<bottom){event.setAttribute("selected",!0)}else{event.removeAttribute("selected")}})}_isMediaType(event,type){return this._isSet(event.media)&&this._isSet(event.media.type)?event.media.type===type:!1}_isSet(prop){return prop!==void 0&&null!==prop}_updateEvents(e){for(var i in e.base){for(var j in e.base[i]){this.notifyPath("events."+i+"."+j)}}}_onScroll(e){this._checkScroll()}}window.customElements.define(LrndesignTimeline.tag,LrndesignTimeline);