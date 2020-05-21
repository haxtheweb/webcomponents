/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element';
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
/**
 * `a11y-details`
 * `accessible progressive disclosure with detail and summary`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class A11YDetails extends LitElement {
  
      //styles function
      static get styles() {
        return  [
          
          css`
    :host {
  display: inline-flex;
}
:host(:defined) {
  --a11y-details-more-less-slot-display: inline;
}
:host([hidden]) {
  display: none;
}
summary {
  cursor: pointer;
  font-size: var(--a11y-details-summary-fontSize, 0.8em);
  color: var(--a11y-details-summary-color, #000);
  background-color: var(--a11y-details-summary-backgroundColor, #fff);
  border-color: var(--a11y-details-summary-borderColor, #000);
  border-width: var(--a11y-details-summary-borderWidth, 1px);
  border-style: var(--a11y-details-summary-borderStyle, solid);
  border-radius: var(--a11y-details-summary-borderRadius, 3px);
  padding: var(--a11y-details-summary-padding, 0.5em);
}
summary:focus {
  outline: var(--a11y-details-summary-focus-outline,1px solid #006688);
  color: var(--a11y-details-summary-focus-color, var(--a11y-details-summary-color,#000));
  background-color: var(--a11y-details-summary-focus-backgroundColor, var(--a11y-details-summary-backgroundColor,#fff));
  border-color: var(--a11y-details-summary-focus-borderColor, var(--a11y-details-borderColor,#000));
  border-width: var(--a11y-details-summary-focus-borderWidth, var(--a11y-details-summary-borderWidth,1px));
  border-style: var(--a11y-details-summary-focus-borderStyle, var(--a11y-details-summary-borderStyle, dotted));
  border-radius: var(--a11y-details-summary-focus-borderRadius, var(--a11y-details-summary-borderRadius, 3px));
}
absolute-position-behavior {
  overflow: hidden;
  max-height: 0px;
  transition: all 0.7s ease-in-out 0.2s;
  padding: 0;
  font-size: var(--a11y-details-fontSize, 0.8em);
  color: var(--a11y-details-color,#000);
  background-color: var(--a11y-details-backgroundColor, rgba(255,255,255,0.8));
  border-color: var(--a11y-details-borderColor,#000);
  border-width: var(--a11y-details-borderWidth,1px);
  border-style: var(--a11y-details-borderStyle, solid);
  border-radius: var(--a11y-details-borderRadius, 3px);
}
::slotted(*) {
  display: none;
}
::slotted([slot="summary"]){
  display: inline;
}
details ::slotted([slot="less"]),
details[open] ::slotted([slot="more"])  {
  --a11y-details-more-less-slot-display: none;
}
details[open] ::slotted([slot="less"]) {
  --a11y-details-more-less-slot-display: inline;
}
::slotted([slot="details"]) {
  display: block;
  height:auto;
  max-height: 0;
  overflow-y: auto;
  transition: all 0.7s ease-in-out 0.2s;
}
details[open] ::slotted([slot="details"]) {
  max-height: var(--a11y-details-maxHeight,400px);
  transition: all 0.7s ease-in-out 0.2s;
}
details[open] absolute-position-behavior {
  padding: var(--a11y-details-padding, 0.5em);
  max-height: var(--a11y-details-maxHeight,400px);
  padding: var(--a11y-details-padding, 0.5em);
  transition: all 0.7s ease-in-out 0.2s;
}
          `
        ];
      }
    
    // render function
      render() {
        return html`
    
    <details id="details">
  <summary 
    @click="${this._handleClick}"  
    @keyup="${this._handleKeyup}" 
    tabindex="0"
    role="button">
    <slot name="more"></slot>
    <slot name="less"></slot>
    <slot name="summary"></slot>
  </summary>
  <absolute-position-behavior ?auto="${this.open}" for="details" .position="${this.position || undefined}">
    <slot name="details" ?aria-hidden="${!this.open}"></slot>
  </absolute-position-behavior>
</details>
<slot hidden></slot>`;
      }

        // haxProperty definition
        static get haxProperties() {
          return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Accessible Details Button",
    "description": "Accessible progressive disclosure with detail and summary",
    "icon": "icons:android",
    "color": "green",
    "groups": [
      "11"
    ],
    "handles": [
      {
        "type": ""
      }
    ],
    "meta": {
      "author": "nikkimk",
      "owner": "The Pennsylvania State University"
    }
  },
  "settings": {
    "quick": [],
    "configure": [
      {
        "slot": "summary",
        "title": "Button", 
        "description": "Summary of the content that if concealed, eg. \"info\", \"medatadata\", etc. ",
        "inputMethod": "code-editor"
      },
      {
        "slot": "details",
        "title": "Content", 
        "description": "Detailed content that can be hidden or shown",
        "inputMethod": "code-editor"
      }
    ],
    "advanced": [
      {
        "property": "open",
        "title": "Open", 
        "inputMethod": "boolean",
        "required": false
      },
      {
        "property": "position",
        "title": "Position", 
        "description": "Content position relative to button",
        "inputMethod": "select",
        "options": {
          "top": "top",
          "bottom": "bottom",
          "left": "left",
          "right": "right"
        },
        "required": false
      }
    ]
  },
  "demoSchema": [
    {
      "tag": "a11y-details",
      "properties": {
        "position": "bottom"
      },
      "content": "<details>\n<summary>Aenean</summary>\nAenean eget nisl volutpat, molestie purus eget, bibendum metus. Pellentesque magna velit, tincidunt quis pharetra id, gravida placerat erat. Maecenas id dui pretium risus pulvinar feugiat vel nec leo. Praesent non congue tellus. Suspendisse ac tincidunt purus. Donec eu dui a metus vehicula bibendum sed nec tortor. Nunc convallis justo sed nibh consectetur, at pharetra nulla accumsan.\n</details>"
    }
  ]
};
        }
  // properties available to the custom element for data binding
  static get properties() {
    return {
  
  ...super.properties,
  
  "open": {
    "type": Boolean,
    "attribute": "open",
    "reflect": true
  },
  "position": {
    "type": Boolean,
    "attribute": "position",
    "reflect": true
  }
};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "a11y-details";
  }

  // life cycle
  constructor() {
    super();
    this.tag = A11YDetails.tag;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(A11YDetails.haxProperties, A11YDetails.tag, this);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    super.disconnectedCallback();
  }
  firstUpdated(){
    if(super.firstUpdated) super.firstUpdated();
    this._updateElement();
    this.observer.observe(this, { childList: true, subtree: true });
  }
  get details(){
    return this && this.shadowRoot && this.shadowRoot.querySelector('details') 
      ? this.shadowRoot.querySelector('details') 
      : undefined;
  }

  attributeChangedCallback(name, oldval, newval) {
    super.attributeChangedCallback(name, oldval, newval);
    if(name === 'open') this.open = newval;
  }

  /**
   * mutation observer for a11y-details
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = (mutationsList) => this._watchChildren(mutationsList);
    return new MutationObserver(callback);
  }

  /**
   * mutation observer for <details/> in unnamed slot
   * @readonly
   * @returns {object}
   */
  get detailsObserver() {
    let callback = () => this._updateElement();
    return new MutationObserver(callback);
  }
  _handleClick(e){
    if(this.details && typeof this.details.open === "undefined"){
      this._toggleOpen();
      e.preventDefault();
      e.stopPropagation();
    }
  }
  _handleKeyup(e){
    if(this.details && typeof this.details.open === "undefined" && e.keyCode == 13 || e.keyCode == 32) {
      this._toggleOpen();	
      e.preventDefault();
      e.stopPropagation();
    }
  }
  _toggleOpen() {
    if (this.details.hasAttribute("open")) {
      this.details.removeAttribute("open");
    } else {
      this.details.setAttribute("open", "");
    }
  }
  _updateElement(){
    let details = this.querySelector('* > details'),
      summary = details ? details.querySelector('* > summary') : undefined;
    console.log('_updateElement',details,summary);
    if(summary) this._copyToSlot('summary',summary.cloneNode(true));
    if(details) {
      let clone = details.cloneNode(true), 
        filtered = clone.querySelectorAll('* > summary');
      Object.keys(filtered || {}).forEach(i=>filtered[i].remove());
      this._copyToSlot('details',clone);
      console.log('details',clone,filtered);
    }
  }
  _watchChildren(mutationsList){
    if(this._searchMutations(mutationsList)){
      this._updateElement();
      this.detailsObserver.observe(
        this.querySelector('* > details'), 
        { childList: true, subtree: true, characterData: true }
      );
    } else if(
      this._searchMutations(mutationsList,"removedNodes") 
      && this.detailsObserver.disconnect
    ){
      this.detailsObserver.disconnect();
    }
  }
  _searchMutations(mutationsList,nodeListType="addedNodes"){
    return Object.keys(mutationsList || {}).filter(i=> {
      let nodes = mutationsList[i][nodeListType];
      return Object.keys(nodes || {}).filter(j=>{
        let nodeName = nodes[j].tagName;
        return nodeName === "DETAILS"
      }).length > 0;
    }).length > 0
  }
  _copyToSlot(slotName,clone){
    let slot = this._getSlot(slotName);
    slot.innerHTML = clone.innerHTML;
    console.log('_copyToSlot',slot,clone);
    clone.remove();
  }
  _getSlot(slotName,inline=true){
    let slot = this.querySelector(`[slot=${slotName}]`);
    if(!slot) {
      slot = inline ? document.createElement('span') : document.createElement('div');
      slot.slot = slotName
      this.append(slot);
    }
    return slot;
  }
}
customElements.define("a11y-details", A11YDetails);
export { A11YDetails };
