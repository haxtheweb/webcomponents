import { LitElement, html, css } from "lit-element/lit-element.js";
import { ImgPanZoom } from "@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
/**
 * `img-view-modal`
 * Combines img-pan-zoom and simple-modal for an easy image zoom solution
 * @demo demo/index.html
 * @element img-view-modal
 */
class imgViewModal extends ImgPanZoom {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        } 
        :host([hidden]),
        *[hidden] {
          display: none !important;
        }
        .sr-only {
          position: absolute;
          left: -9999999px;
          width: 0;
          overflow: hidden;
        }
        #container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-between;
          height: 100%;
        } 
        #container > * {
          flex: 1 1 auto;
          border: 1px solid #ddd;
        }  
        .button-group {
          display: flex;
          align-items: stretch;
          justify-content: center;
        }
        #top, 
        #bottom {
          margin: 0;
          flex: 0 0 auto;
        }
        #top > *, 
        #bottom > * {
          margin: 0;
        }
        #top > *:not(:first-child), 
        #bottom > *:not(:first-child) {
          border-left: 1px solid #ddd;
        }

        button {
          border: none;
          background-color: transparent;
        }
        button.flex-grow {
          flex: 1 0 auto;
        }
        button p {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        button.icon-right p {
          flex-direction: row-reverse;
          justify-content: end;
        }
        button:focus,
        button:hover,
        #viewer:focus-within {
          outline: 1px solid blue;
          z-index: 2;
        }
      `
    ];
  }
  constructor() {
    super();
    this.src = "";
    this.minZoomImageRatio = 1;
    this.maxZoomPixelRatio = 3;
    import ("@polymer/iron-icon/iron-icon.js");
    import ("@polymer/iron-icons/iron-icons.js");
    import ("@polymer/iron-icons/image-icons.js");
  }
  render() {
    return html`
      <!-- Only preload regular images -->
      ${!this.dzi
        ? html`
            ${this.hideSpinner || this.loaded
              ? ``
              : html`
                  <hexagon-loader
                    ?loading=${this.loading || !this.loaded}
                    item-count="4"
                    size="small"
                  ></hexagon-loader>
                `}
            <img-loader
              loaded="${this.loaded}"
              @loaded-changed="${this.loadedChangedEvent}"
              ?loading="${this.loading}"
              @loading-changed="${this.loadingChangedEvent}"
              @page="${e=>this.currentImage = e.page}"
              src="${this.src}"
              described-by="${this.describedBy || ""}"
            ></img-loader>
          `
        : ""}

      <!-- Openseadragon -->
      <div id="container">
        ${this.getToolbars(this.defaultToolbars,this.toolbars,"top")}
        <div><div id="viewer"></div></div>
        ${this.getToolbars(this.defaultToolbars,this.toolbars,"bottom")}
      </div>
    `;
  }

  static get tag() {
    return "img-view-modal";
  }
static get properties() {
    return {
      ...super.properties,
      
      /**
       * whether fullscreen mode is toggled
       */
      fullscreenMode: { type: Boolean, attribute: "fullscreen-mode", reflect: true },
      /**
       * whether info mode is toggled
       */
      infoMode: { type: Boolean, attribute: "info-mode", reflect: true },
      /**
       * whether keyboard shortcuts help mode is toggled
       */
      keyboardHelpMode: { type: Boolean, attribute: "keyboard-help-mode", reflect: true },
      /**
       * whether navigator window mode is toggled
       */
      navigatorToggled: { type: Boolean, attribute: "navigator-toggled", reflect: true },
      /**
       * if used with multiple images and paged navigation, index of current item
       */
      currentImage: { type: Number , attribute: "current-image", reflect: true},
      /**
       * if used with multiple images and paged navigation, index of current item
       */
      toolbars: { type: Number , attribute: "toolbars", reflect: true},

      /* https://openseadragon.github.io/examples/ui-reference-strip/ */
      referenceStripScroll: { type: String },
      sequenceMode: { type: Boolean },
      showReferenceStrip: { type: Boolean },

      /* 
      https://openseadragon.github.io/examples/tilesource-collection/
      https://openseadragon.github.io/examples/multi-image/ 
      */
      collectionMode: { type: Boolean },
      collectionRows: { type: Number },
      collectionTileSize: { type: Number },
      collectionTileMargin: { type: Number },
      collectionLayout: { type: String },

      /* https://openseadragon.github.io/examples/tilesource-sequence/ */
      tileSources: { type: Array },
      preserveViewport: { type: Array },    
      defaultZoomLevel: { type: Number },

      //TODO https://openseadragon.github.io/examples/ui-tiledimage-polygon-cropping/
      previousTooltip: { type: String },
      nextTooltip: { type: String },
      zoomOutTooltip: { type: String },
      zoomInTooltip: { type: String },
      homeTooltip: { type: String },
      fullPageTooltip: { type: String }
      /* TODO 
      https://openseadragon.github.io/examples/ui-overlays/ 
      https://openseadragon.github.io/examples/ui-tiledimage-polygon-cropping/
      */
    };
  }
  /* TODO https://openseadragon.github.io/examples/ui-keyboard-navigation/ */
  getToolbars(defaultToolbars,customToolbars,topOrBottom = "bottom"){
    let toolbars = customToolbars || defaultToolbars,
      toolbar = toolbars && toolbars[topOrBottom] 
        ? toolbars[topOrBottom] 
        : { id: topOrBottom, contents: '' },
      div = this._item(toolbar);
    return div;
  }
  /**
   * default home button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get homebutton(){
    return {
      id:"homebutton",
      icon: "home",
      text: "return image to home position"
    };
  }
  /**
   * default toggle fullscreen button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get fullscreenbutton(){
    return {
      id:"fullscreenbutton",
      icon: "fullscreen",
      toggleProp: "fullscreenMode",
      text: html`toggle fullscreen (<kbd>ESC</kbd> to exit)`
    };
  }
  /**
   * default toggle navigate window button configuration
   * Uses <a href="https://openseadragon.github.io/examples/ui-viewport-navigator/">Viewport Navigator</a>
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get navigatorbutton(){
    return {
      id:"navigatorbutton",
      icon: "picture-in-picture",
      toggleProp: "navigatorToggled",
      text: "toggle nav window"
    };
  }
  /**
   * default toggle info button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get infobutton(){
    return {
      id:"infoMode",
      icon: "info",
      toggleProp: "infoMode",
      text: "toggle information"
    };
  }
  /**
   * default toggle keyboard shorcuts help button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get kbdbutton(){
    return {
      id:"kbdbutton",
      icon: "info",
      toggleProp: "keyboardHelpMode",
      text: "toggle keyboard shorcuts help"
    };
  }
  /**
   * default rotate button group configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get rotategroup(){
    return {
      id: 'rotategroup',
      type: 'toolbar-group',
      contents: [
        this.rotateccwbutton,
        this.rotatecwbutton
      ]
    };
  }
  /**
   * default rotate counterclockwise button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get rotateccwbutton(){
    return {
      id:"rotateccwbutton",
      icon: "image:rotate-left",
      text: "rotate counterclockwise"
    };
  }
  /**
   * default rotate counter button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get rotatecwbutton(){
    return {
      id:"rotatecwbutton",
      icon: "image:rotate-right",
      text: "rotate clockwise"
    };
  }
  /**
   * default pan button group configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get pangroup(){
    return {
      id: 'pangroup',
      type: 'toolbar-group',
      contents: [
        this.panleftbutton,
        this.panupbutton,
        this.pandownbutton,
        this.panrightbutton
      ]
    };
  }
  /**
   * default pan left button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get panleftbutton(){
    return {
      id:"panleftbutton",
      icon: "arrow-back",
      text: "pan left"
    };
  }
  /**
   * default pan up button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get panupbutton(){
    return {
      id:"panupbutton",
      icon: "arrow-upward",
      text: "pan up"
    };
  }
  /**
   * default pan down button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get pandownbutton(){
    return {
      id:"pandownbutton",
      icon: "arrow-downward",
      text: "pan down"
    };
  }
  /**
   * default pan right button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get panrightbutton(){
    return {
      id:"panrightbutton",
      icon: "arrow-forward",
      text: "pan right"
    };
  }
  /**
   * default zoom button group configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get zoomgroup(){
    return {
      id: 'zoomgroup',
      type: 'toolbar-group',
      contents: [
        this.zoominbutton,
        this.zoomoutbutton
      ]
    };
  }
  /**
   * default zoom in button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get zoominbutton(){
    return {
      id:"zoominbutton",
      icon: "zoom-in",
      text: "zoom in"
    };
  }
  /**
   * default zoom out button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get zoomoutbutton(){
    return {
      id:"zoomoutbutton",
      icon: "zoom-out",
      text: "zoom out"
    };
  }
  /**
   * default prev button configuration
   * @return {object} 
   * @readonly
   * @memberof imgViewModal
   */
  get prevbutton(){
    return {
      id: "prevbutton",
      showText: true,
      icon: "chevron-left",
      text: "prev",
      flexGrow: true
    }
  }
  /**
   * default next button configuration
   * @return {object} as { id, icon, iconRight, text, and showText }
   * @readonly
   * @memberof imgViewModal
   */
  get nextbutton(){
    return {
      id: "nextbutton",
      icon: "chevron-right",
      iconRight: true,
      text: "next",
      showText: true,
      flexGrow: true
    }
  }
  /**
   * default x of y text for toolbar
   * @returns {string} 'x of y'
   * @readonly
   * @memberof imgViewModal
   */
  get pageXofY(){
    return !this.currentImage ? '' : `${this.currentImage} of ${this.totalImage}`;
  }
  /**
   * default toolbar config object, 
   * where "top" contains config for toolbar above image(s),
   * and "bottom" contains config for toolbar above image(s)
   * @return {object} as { top: { id="top", contents:[]},  id="bottom", contents:[]}, }
   *
   * @readonly
   * @memberof imgViewModal
   */
  get defaultToolbars(){
    return {
      bottom: {
        id: "bottom",
        type: 'toolbar-group',
        contents: [
          "prevbutton", 
          "rotategroup",
          "zoomgroup",
          "homebutton",
          "pangroup",
          "nextbutton"
        ]
      }
    }
  }
  /**
   * makes a toolbar item from config
   *  TOOLBAR CONFIG SCHEMA: { 
   *    id : {{itemid / certain ids have default configs and bindings that can be used or overridden}}, 
   *    config: {{if item is a button, button config}}, 
   *    contents: {{if item is a group, string of text or array of items}}, 
   *  }
   * @param {*} [config={}]
   * @memberof imgViewModal
   */
  _item(config = {}){
    if(typeof config === "string" && this[config]) config = this[config];
    if(config && typeof config.contents === typeof undefined){
      return this._button(config);
    } else {
      return this._group(config)
    }
  }
  /**
   * makes a toolbar group from config
   *  GROUP CONFIG SCHEMA: { 
   *    id : {{groupid / certain ids have default item groupings that can be used or overridden}}, 
   *    type: {{group type to add to classlist}}, 
   *    contents: {{sting of text content or array of items in the group}}
   *  }
   * @param {object} [config={}]
   * @param {string} [id='']
   * @returns toolbar group html template
   * @memberof imgViewModal
   */
  _group(config = {}){
    if(typeof config === "string" && this[config]) config = this[config];
    return !config ? '' : html`
    <div .id="${config.id || undefined}" class="button-group ${config.type || ''}">
      ${typeof config.contents === "string" 
        ? config.contents 
        : (config.contents || []).map(item=>this._item(item))}
    </div>
    `;
  }
  /**
   * makes a toolbar button from config
   *  BUTTON CONFIG SCHEMA: { 
   *    toggleProp : {{if button toggles, property button toggles}}, 
   *    icon: {{button icon}}, 
   *    iconRight: {{show icon to the right of text intead of left}}, 
   *    text: {{button text / default tooltip}}, 
   *    showText: {{show button text even if button has an icon}},
   *    tooltip: {{override button text as tooltip}}
   *  }
   * @param {object} [config={}]
   * @param {string} id
   * @returns button html template
   * @memberof imgViewModal
   */
  _button(config = {}){
    if(typeof config === "string" && this[config]) config = this[config];
    if(config) this._bindButton(config.id,config.tooltip || config.text);
    return !config ? '' : html`
      <button 
        .id="${config.id || undefined}" 
        .aria-pressed="${!config.toggleProp || !this[config.toggleProp] ? undefined : this[config.toggleProp] ? "true" : "false"}"
        class="${config.iconRight ? 'icon-right' : ''} ${config.flexGrow ? 'flex-grow' : ''}"
        @click="${e=>this._toolbarButtonClick(config.id,e)}">
        <p>
          <iron-icon aria-hidden="true" icon="${config.icon}"></iron-icon>
          <span class="${config.icon && !config.showText ? 'sr-only' : ''}">${config.text}</span>
        </p>
      </button>
    `;
  }
  /**
   * binds a button to img viewer
   * <a href="https://openseadragon.github.io/examples/ui-binding-custom-buttons/">Binding</a>
   * @param {string} [id=""] button id
   * @param {string} [text=""] tooltip text
   * @memberof imgViewModal
   */
  _bindButton(id="",text=""){
    let bindings = {
      "prevbutton": {
        prop: "previousButton",
        tooltip: "PreviousPageTooltip"
      },
      "nextbutton": {
        prop: "nextButton",
        tooltip: "NextPageTooltip"
      },
      "zoomoutbutton": {
        prop: "zoomOutButton",
        tooltip: "ZoomOutTooltip"
      },
      "zoominbutton": {
        prop: "zoomInButton",
        tooltip: "ZoomInTooltip"
      },
      "homebutton": {
        prop: "homeButton",
        tooltip: "HomeTooltip"
      },
      "fullscreenbutton": {
        prop: "fullPageButton",
        tooltip: "FullPageTooltip"
      }
    }, binding = bindings[id];
    if(binding){
      this[binding.prop] = id;
      this[binding.tooltip] = text;
    }
  }

  updated(changedProperties) {
    if(super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
    });
  }
  firstUpdated() {
    if(super.firstUpdated) super.firstUpdated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
    });
  }
  _toolbarButtonClick(buttonId,eventType) {
    /**
     * Fires when constructed, so that parent radio group can listen for it.
     *
     * @event toolbar-button-click
     */
    this.dispatchEvent(
      new CustomEvent("toolbar-button-click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          buttonId: buttonId,
          eventType: eventType,
          viewer: this
        }
      })
    );
    if(buttonId === "panupbutton") this.pan(0,0.2);
    if(buttonId === "pandownbutton") this.pan(0,-0.2);
    if(buttonId === "panleftbutton") this.pan(0.2,0);
    if(buttonId === "panrightbutton") this.pan(-0.2,0);
    if(buttonId === "zoominbutton") this.zoomIn(0.2);
    if(buttonId === "zoomoutbutton") this.zoomOut(0.2);
    if(buttonId === "rotateccwbutton") this.rotate(-90);
    if(buttonId === "rotatecwbutton") this.rotate(90);
  }
}
window.customElements.define(imgViewModal.tag, imgViewModal);
export { imgViewModal };
