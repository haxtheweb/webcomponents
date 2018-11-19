import"./lib/hex-a-gon.js";export{HexagonLoader};class HexagonLoader extends HTMLElement{get html(){return`
<style>:host {
  display: block;
   --hexagon-loader-color: orange;
}

:host([hidden]) {
  display: none;
}

.loader {
  position: relative;
  width: 255px;
  height: 232.5px;
  margin: 0 auto;
}

hex-a-gon:nth-of-type(1) {
  display: block;
  margin-left: -56.25px;
  margin-top: -97.875px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0s;
          animation-delay: 0s;
}
hex-a-gon:nth-of-type(2) {
  display: block;
  margin-left: -18.75px;
  margin-top: -97.875px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
}
hex-a-gon:nth-of-type(3) {
  display: block;
  margin-left: 18.75px;
  margin-top: -97.875px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
}
hex-a-gon:nth-of-type(4) {
  display: block;
  margin-left: 56.25px;
  margin-top: -97.875px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
}
hex-a-gon:nth-of-type(5) {
  display: block;
  margin-left: -75px;
  margin-top: -65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0s;
          animation-delay: 0s;
}
hex-a-gon:nth-of-type(6) {
  display: block;
  margin-left: -37.5px;
  margin-top: -65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
}
hex-a-gon:nth-of-type(7) {
  display: block;
  margin-left: 0px;
  margin-top: -65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
}
hex-a-gon:nth-of-type(8) {
  display: block;
  margin-left: 37.5px;
  margin-top: -65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
}
hex-a-gon:nth-of-type(9) {
  display: block;
  margin-left: 75px;
  margin-top: -65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
}
hex-a-gon:nth-of-type(10) {
  display: block;
  margin-left: -93.75px;
  margin-top: -32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0s;
          animation-delay: 0s;
}
hex-a-gon:nth-of-type(11) {
  display: block;
  margin-left: -56.25px;
  margin-top: -32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
}
hex-a-gon:nth-of-type(12) {
  display: block;
  margin-left: -18.75px;
  margin-top: -32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
}
hex-a-gon:nth-of-type(13) {
  display: block;
  margin-left: 18.75px;
  margin-top: -32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
}
hex-a-gon:nth-of-type(14) {
  display: block;
  margin-left: 56.25px;
  margin-top: -32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
}
hex-a-gon:nth-of-type(15) {
  display: block;
  margin-left: 93.75px;
  margin-top: -32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
}
hex-a-gon:nth-of-type(16) {
  display: block;
  margin-left: -112.5px;
  margin-top: 0px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0s;
          animation-delay: 0s;
}
hex-a-gon:nth-of-type(17) {
  display: block;
  margin-left: -75px;
  margin-top: 0px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
}
hex-a-gon:nth-of-type(18) {
  display: block;
  margin-left: -37.5px;
  margin-top: 0px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
}
hex-a-gon:nth-of-type(19) {
  display: block;
  margin-left: 0px;
  margin-top: 0px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
}
hex-a-gon:nth-of-type(20) {
  display: block;
  margin-left: 37.5px;
  margin-top: 0px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
}
hex-a-gon:nth-of-type(21) {
  display: block;
  margin-left: 75px;
  margin-top: 0px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
}
hex-a-gon:nth-of-type(22) {
  display: block;
  margin-left: 112.5px;
  margin-top: 0px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s;
}
hex-a-gon:nth-of-type(23) {
  display: block;
  margin-left: -93.75px;
  margin-top: 32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0s;
          animation-delay: 0s;
}
hex-a-gon:nth-of-type(24) {
  display: block;
  margin-left: -56.25px;
  margin-top: 32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
}
hex-a-gon:nth-of-type(25) {
  display: block;
  margin-left: -18.75px;
  margin-top: 32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
}
hex-a-gon:nth-of-type(26) {
  display: block;
  margin-left: 18.75px;
  margin-top: 32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
}
hex-a-gon:nth-of-type(27) {
  display: block;
  margin-left: 56.25px;
  margin-top: 32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
}
hex-a-gon:nth-of-type(28) {
  display: block;
  margin-left: 93.75px;
  margin-top: 32.625px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
}
hex-a-gon:nth-of-type(29) {
  display: block;
  margin-left: -75px;
  margin-top: 65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0s;
          animation-delay: 0s;
}
hex-a-gon:nth-of-type(30) {
  display: block;
  margin-left: -37.5px;
  margin-top: 65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
}
hex-a-gon:nth-of-type(31) {
  display: block;
  margin-left: 0px;
  margin-top: 65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
}
hex-a-gon:nth-of-type(32) {
  display: block;
  margin-left: 37.5px;
  margin-top: 65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
}
hex-a-gon:nth-of-type(33) {
  display: block;
  margin-left: 75px;
  margin-top: 65.25px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
}
hex-a-gon:nth-of-type(34) {
  display: block;
  margin-left: -56.25px;
  margin-top: 97.875px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0s;
          animation-delay: 0s;
}
hex-a-gon:nth-of-type(35) {
  display: block;
  margin-left: -18.75px;
  margin-top: 97.875px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
}
hex-a-gon:nth-of-type(36) {
  display: block;
  margin-left: 18.75px;
  margin-top: 97.875px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
}
hex-a-gon:nth-of-type(37) {
  display: block;
  margin-left: 56.25px;
  margin-top: 97.875px;
  -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
  -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
}

@-webkit-keyframes scaleIt {
  25%,100% {
    -webkit-transform: scale(1) translate(-50%, -50%);
            transform: scale(1) translate(-50%, -50%);
  }
  50% {
    -webkit-transform: scale(0) translate(-50%, -50%);
            transform: scale(0) translate(-50%, -50%);
  }
}

@keyframes scaleIt {
  25%,100% {
    -webkit-transform: scale(1) translate(-50%, -50%);
            transform: scale(1) translate(-50%, -50%);
  }
  50% {
    -webkit-transform: scale(0) translate(-50%, -50%);
            transform: scale(0) translate(-50%, -50%);
  }
}</style>
<div class="loader">
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
</div>`}static get properties(){return{color:{name:"color",type:"String",value:"orange"},size:{name:"size",type:"String",value:"medium"}}}static get tag(){return"hexagon-loader"}constructor(delayRender=!1){super();this.tag=HexagonLoader.tag;let obj=HexagonLoader.properties;for(let p in obj){if(obj.hasOwnProperty(p)){if(this.hasAttribute(p)){this[p]=this.getAttribute(p)}else{this.setAttribute(p,obj[p].value);this[p]=obj[p].value}}}this._queue=[];this.template=document.createElement("template");this.attachShadow({mode:"open"});if(!delayRender){this.render()}}connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}if(this._queue.length){this._processQueue()}}_copyAttribute(name,to){const recipients=this.shadowRoot.querySelectorAll(to),value=this.getAttribute(name),fname=null==value?"removeAttribute":"setAttribute";for(const node of recipients){node[fname](name,value)}}_queueAction(action){this._queue.push(action)}_processQueue(){this._queue.forEach(action=>{this[`_${action.type}`](action.data)});this._queue=[]}_setProperty({name,value}){this[name]=value}render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}}window.customElements.define(HexagonLoader.tag,HexagonLoader);