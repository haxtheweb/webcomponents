import { LitElement, html, css } from "lit-element/lit-element.js";
import { ImgPanZoom } from "@lrnwebcomponents/img-pan-zoom/img-pan-zoom.js";
import { FullscreenBehaviors } from "@lrnwebcomponents/fullscreen-behaviors/fullscreen-behaviors.js";
/**
 * `img-view-viewer`
 * Combines img-pan-zoom and simple-modal for an easy image zoom solution
 * 
### Styling

Custom property | Description | Default
----------------|-------------|----------
`--img-view-viewer-height` | viewer height | 500px
`--img-view-viewer-backgroundColor` | background color | white
`--img-view-viewer-color` | text color | black
`--img-view-viewer-borderColor` | border color | #ddd
`--img-view-viewer-toggled-backgroundColor` | background color of toggled buttons and kbd commands | #eee
 *
 * @demo demo/viewer.html
 * @element img-view-viewer
 * 
 */
class ImgViewViewer extends FullscreenBehaviors(ImgPanZoom) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          height: var(--img-view-viewer-height, 500px);
          --hexagon-color: var(--img-view-viewer-focus-borderColor, blue);
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
        #viewer {
          display: block;
          position: relative;
          height: 100%;
          width: 100%;
        }
        #loader {
          display: none;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          width: 100%;
          height: var(--img-view-viewer-height, 500px);
          margin-bottom: calc(0px - var(--img-view-viewer-height, 500px));
          z-index: 1;
        }
        hexagon-loader {
          position: absolute;
          opacity: 0;
          transition: opacity 700ms;
          margin: auto;
        }
        hexagon-loader[loading] {
          opacity: 1;
        }
        #container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-between;
          height: 100%;
          background-color: var(--img-view-viewer-backgroundColor, white);
          color: var(--img-view-viewer-color, black);
        }
        #container > * {
          flex: 1 1 auto;
          border: 1px solid var(--img-view-viewer-borderColor, #ddd);
        }
        .misc-item,
        .button-group {
          display: flex;
          align-items: stretch;
          justify-content: center;
        }
        .misc-item {
          align-items: center;
          padding: 5px;
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
          border-left: 1px solid var(--img-view-viewer-borderColor, #ddd);
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
        button[aria-pressed="true"] {
          --img-view-viewer-backgroundColor: var(
            --img-view-viewer-toggled-backgroundColor,
            #eee
          );
        }
      
        button:focus,
        button:hover,
        #viewer:focus-within {
          outline: 1px solid var(--img-view-viewer-focus-borderColor, blue);
          z-index: 2;
        }
        simple-tooltip:not(:defined) {
          display: none;
        }
        #placeholder {
          position: relative;
          max-height: 0;
          overflow: visible;
        }
        #info {
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 5px;
          background-color: var(--img-view-viewer-backgroundColor, white);
          border: 1px solid var(--img-view-viewer-borderColor, #ddd);
        }
        table {
          border-collapse: collapse;
        }
        th,
        td {
          padding: 2px 5px;
          line-height: 140%;
          border-top: 1px solid var(--img-view-viewer-borderColor, #ddd);
        }
        th {
          font-weight: normal;
          text-align: left;
        }
        kbd {
          border-radius: 2px;
          padding: 1px 3px;
          font-family: sans-serif;
          font-size: 80%;
          background: var(--img-view-viewer-toggled-backgroundColor, #eee);
          border: 1px solid var(--img-view-viewer-borderColor, #ddd);
        }
        input[type="number"] {
          border: 1px solid var(--img-view-viewer-borderColor, #ddd);
        }
      `
    ];
  }
  constructor() {
    super();
    this.minZoomImageRatio = 1;
    this.maxZoomPixelRatio = 3;
    this.__screenfullLoaded = false;
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/image-icons.js");
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
  }

  render() {
    return html`
      ${!this.dzi
        ? html`
            ${this.hideSpinner
              ? ``
              : html`
                  <div id="loader" ?hidden="${this.loaded}">
                    <hexagon-loader ?loading=${this.loading || !this.loaded}
                    item-count="4"
                  ></hexagon-loader>
                  </div>
                `}
          `
        : ""}
      <div id="container">
        ${this.getToolbars(this.defaultToolbars, this.toolbars, "top")}
        <div>
          <div id="viewer"></div>
        </div>
        <div id="placeholder">
          <div id="info" ?hidden="${!this.info}">
            ${this.info}
          </div>
        </div>
        ${this.getToolbars(this.defaultToolbars, this.toolbars, "bottom")}
      </div>
    `;
  }

  static get tag() {
    return "img-view-viewer";
  }
  static get properties() {
    return {
      ...super.properties,

      figures: {
        type: Array
      },
      /**
       * whether info mode is toggled
       */
      infoToggled: { type: Boolean, attribute: "info-mode", reflect: true },
      /**
       * whether keyboard shortcuts help mode is toggled
       */
      kbdToggled: {
        type: Boolean,
        attribute: "keyboard-help-mode",
        reflect: true
      },
      /**
       * if used with multiple images and paged navigation, index of current item
       */
      toolbars: { type: Object, attribute: "toolbars", reflect: true },
      __screenfullLoaded: { type: Boolean },
      __src: { type: String },
      __imageLoader: { type: Object }
    };
  }
  getToolbars(defaultToolbars, customToolbars, topOrBottom = "bottom") {
    let toolbars = customToolbars || defaultToolbars,
      toolbar =
        toolbars && toolbars[topOrBottom]
          ? toolbars[topOrBottom]
          : { id: topOrBottom, contents: "" },
      div = this._item(toolbar, topOrBottom === "top");
    return div;
  }
  /**
   * default home button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get homebutton() {
    return {
      id: "homebutton",
      icon: "home",
      text: "return image to home position"
    };
  }
  /**
   * default toggle fullscreen button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get fullscreenbutton() {
    return {
      id: "fullscreenbutton",
      icon: "fullscreen",
      toggleProp: "__fullscreen",
      enabledProp: "fullscreenEnabled",
      text: html`
        toggle fullscreen
      `
    };
  }
  /**
   * element to make fullscreen, can be overidden
   *
   * @readonly
   */
  get fullscreenTarget() {
    return this.shadowRoot && this.shadowRoot.querySelector("#container")
      ? this.shadowRoot.querySelector("#container")
      : this;
  }
  /**
   * default toggle navigate window button configuration
   * Uses <a href="https://openseadragon.github.io/examples/ui-viewport-navigator/">Viewport Navigator</a>
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get navigatorbutton() {
    return {
      id: "navigatorbutton",
      icon: "picture-in-picture",
      toggleProp: "navigatorToggled",
      shownProp: "showNavigator",
      enabledProp: "showNavigator",
      text: "toggle nav window"
    };
  }
  /**
   * default toggle info button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get infobutton() {
    return {
      id: "infobutton",
      icon: "info-outline",
      toggleProp: "infoToggled",
      hiddenProp: "noSources",
      text: "toggle information"
    };
  }
  /**
   * default toggle keyboard shorcuts help button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get kbdbutton() {
    return {
      id: "kbdbutton",
      icon: "help-outline",
      toggleProp: "kbdToggled",
      text: "toggle keyboard shorcuts help",
      details: html`
        <table>
          <caption>
            Keyboard Shortcuts (when image has focus)
          </caption>
          <tbody>
            <tr>
              <th scope="row">pan up</th>
              <td><kbd>w</kbd> or <kbd>&uarr;</kbd></td>
            </tr>
            <tr>
              <th scope="row">pan down</th>
              <td><kbd>s</kbd> or <kbd>&darr;</kbd></td>
            </tr>
            <tr>
              <th scope="row">pan left</th>
              <td><kbd>a</kbd> or <kbd>&larr;</kbd></td>
            </tr>
            <tr>
              <th scope="row">pan right</th>
              <td><kbd>d</kbd> or <kbd>&rarr;</kbd></td>
            </tr>
            <tr>
              <th scope="row">home</th>
              <td><kbd>0</kbd></td>
            </tr>
            <tr>
              <th scope="row">zoom out</th>
              <td><kbd>-</kbd> or <kbd>_</kbd></td>
            </tr>
            <tr>
              <th scope="row">zoom in</th>
              <td><kbd>+</kbd> or <kbd>=</kbd></td>
            </tr>
            <tr>
              <th scope="row">rotate clockwise</th>
              <td><kbd>r</kbd></td>
            </tr>
            <tr>
              <th scope="row">rotate counterclockwise</th>
              <td><kbd>shift+r</kbd></td>
            </tr>
          </tbody>
        </table>
      `
    };
  }
  /**
   * default flip horizontal button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get flipbutton() {
    return {
      id: "flipbutton",
      icon: "image:flip",
      text: "flip horizontal",
      toggleProp: "flipToggled"
    };
  }
  /**
   * default rotate button group configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get rotategroup() {
    return {
      id: "rotategroup",
      type: "toolbar-group",
      contents: [this.rotateccwbutton, this.rotatecwbutton]
    };
  }
  /**
   * default rotate counterclockwise button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get rotateccwbutton() {
    return {
      id: "rotateccwbutton",
      icon: "image:rotate-left",
      text: "rotate counterclockwise"
    };
  }
  /**
   * default rotate counter button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get rotatecwbutton() {
    return {
      id: "rotatecwbutton",
      icon: "image:rotate-right",
      text: "rotate clockwise"
    };
  }
  /**
   * default pan button group configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get pangroup() {
    return {
      id: "pangroup",
      type: "toolbar-group",
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
   * @memberof imgViewViewer
   */
  get panleftbutton() {
    return {
      id: "panleftbutton",
      icon: "arrow-back",
      text: "pan left"
    };
  }
  /**
   * default pan up button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get panupbutton() {
    return {
      id: "panupbutton",
      icon: "arrow-upward",
      text: "pan up"
    };
  }
  /**
   * default pan down button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get pandownbutton() {
    return {
      id: "pandownbutton",
      icon: "arrow-downward",
      text: "pan down"
    };
  }
  /**
   * default pan right button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get panrightbutton() {
    return {
      id: "panrightbutton",
      icon: "arrow-forward",
      text: "pan right"
    };
  }
  /**
   * default zoom button group configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get zoomgroup() {
    return {
      id: "zoomgroup",
      type: "toolbar-group",
      contents: [this.zoominbutton, this.zoomoutbutton]
    };
  }
  /**
   * default zoom in button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get zoominbutton() {
    return {
      id: "zoominbutton",
      icon: "zoom-in",
      text: "zoom in"
    };
  }
  /**
   * default zoom out button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get zoomoutbutton() {
    return {
      id: "zoomoutbutton",
      icon: "zoom-out",
      text: "zoom out"
    };
  }
  /**
   * default prev button configuration
   * @return {object}
   * @readonly
   * @memberof imgViewViewer
   */
  get prevbutton() {
    return {
      id: "prevbutton",
      showText: true,
      icon: "chevron-left",
      text: "prev",
      disabledProp: "prevDisabled",
      flexGrow: true
    };
  }
  /**
   * default next button configuration
   * @return {object} as { id, icon, iconRight, text, and showText }
   * @readonly
   * @memberof imgViewViewer
   */
  get nextbutton() {
    return {
      id: "nextbutton",
      icon: "chevron-right",
      iconRight: true,
      disabledProp: "nextDisabled",
      text: "next",
      showText: true,
      flexGrow: true
    };
  }
  get pages() {
    return this.figures || [];
  }
  get noSources() {
    this.pages.length === 0;
  }
  get prevDisabled() {
    return this.page <= 0;
  }
  get nextDisabled() {
    return this.page + 1 >= this.pages.length;
  }
  get info() {
    return this.kbdToggled && this.kbdbutton.details
      ? this.kbdbutton.details
      : this.infoToggled &&
        this.figures &&
        this.figures[this.page] &&
        this.figures[this.page].info
      ? this.figures[this.page].info
      : undefined;
  }
  /**
   * default x of y text for toolbar
   * @returns {string} 'x of y'
   * @readonly
   * @memberof imgViewViewer
   */
  get pageXofY() {
    return `${(this.page || 0) + 1} of ${this.pages.length}`;
  }
  get navXofY() {
    return {
      id: "navXofY",
      type: "misc-item",
      contents: html`
        <p>
          <label for="pageX" class="sr-only">Page</label>
          <input
            id="pageX"
            type="number"
            min="1"
            max="${this.pages.length}"
            value="${this.page + 1}"
            @change="${this.goToPageXofY}"
          />
          of ${this.pages.length}
        </p>
      `
    };
  }
  /**
   * default toolbar config object,
   * where "top" contains config for toolbar above image(s),
   * and "bottom" contains config for toolbar above image(s)
   * @return {object} as { top: { id="top", contents:[]},  id="bottom", contents:[]}, }
   *
   * @readonly
   * @memberof imgViewViewer
   */
  get defaultToolbars() {
    return {
      bottom: {
        id: "bottom",
        type: "toolbar-group",
        contents: [
          "prevbutton",
          "homebutton",
          "rotategroup",
          "zoomgroup",
          "pageXofY",
          "pangroup",
          "fullscreenbutton",
          "nextbutton"
        ]
      }
    };
  }
  /**
   * makes a toolbar item from config
   *  TOOLBAR CONFIG SCHEMA: {
   *    id : {{itemid / certain ids have default configs and bindings that can be used or overridden}},
   *    config: {{if item is a button, button config}},
   *    contents: {{if item is a group, string of text or array of items}},
   *  }
   * @param {*} [config={}]
   * @param {boolean} [top=false] on top toolbar?
   * @memberof imgViewViewer
   */
  _item(config = {}, top = false) {
    if (typeof config === "string" && this[config]) config = this[config];
    if (typeof config !== "object") {
      return html`
        <div class="misc-item">${config}</div>
      `;
    } else if (config && typeof config.contents === typeof undefined) {
      return this._button(config, top);
    } else {
      return this._group(config, top);
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
   * @param {boolean} [top=false] on top toolbar?
   * @returns toolbar group html template
   * @memberof imgViewViewer
   */
  _group(config = {}, top = false) {
    if (typeof config === "string" && this[config]) config = this[config];
    return !config
      ? ""
      : html`
          <div
            .id="${config.id || undefined}"
            class="button-group ${config.type || ""}"
          >
            ${!Array.isArray(config.contents)
              ? config.contents
              : (config.contents || []).map(item => this._item(item, top))}
          </div>
        `;
  }
  /**
   * makes a toolbar button from config
   *  BUTTON CONFIG SCHEMA: {
   *    toggleProp : {{optional: if button toggles, property button toggles}},
   *    enabledProp : {{optional: disable button if prop is false}},
   *    disabledProp : {{optional: prop to make button disabled}},
   *    shownProp : {{optional: hide button if prop is false}},
   *    hiddenProp : {{optional: prop to make button hidden}},
   *    icon: {{button icon}},
   *    iconRight: {{show icon to the right of text intead of left}},
   *    text: {{button text / default tooltip}},
   *    showText: {{show button text even if button has an icon}},
   *    tooltip: {{override button text as tooltip}}
   *  }
   * @param {object} [config={}]
   * @param {boolean} [top=false] on top toolbar?
   * @returns button html template
   * @memberof imgViewViewer
   */
  _button(config = {}, top = false) {
    if (typeof config === "string" && this[config]) config = this[config];
    //if (config) this._bindButton(config.id, config.tooltip || config.text);
    return !config
      ? ""
      : !config.toggleProp || !this[config.toggleProp]
      ? html`
          <button
            .id="${config.id || undefined}"
            class="${this._buttonClass(config)}"
            @click="${e => this._toolbarButtonClick(config.id, e)}"
            controls="container"
            ?disabled="${this._buttonDisabled(config)}"
            ?hidden="${this._buttonHidden(config)}"
          >
            ${this._buttonInner(config)}
          </button>
          ${this._buttonTooltip(config, top)}
        `
      : html`
          <button
            .id="${config.id || undefined}"
            aria-pressed="${this[config.toggleProp] ? "true" : "false"}"
            class="${this._buttonClass(config)}"
            @click="${e => this._toolbarButtonClick(config.id, e)}"
            controls="container"
            ?disabled="${this._buttonDisabled(config)}"
            ?hidden="${this._buttonHidden(config)}"
          >
            ${this._buttonInner(config)} ${this._buttonTooltip(config)}
          </button>
        `;
  }
  _buttonDisabled(config) {
    return (
      (config.disabledProp && this[config.disabledProp]) ||
      (config.enabledProp && !this[config.enabledProp])
    );
  }
  _buttonHidden(config) {
    return (
      (config.hiddenProp && this[config.hiddenProp]) ||
      (config.shownProp && !this[config.shownProp])
    );
  }
  _buttonClass(config) {
    return `${config.iconRight ? "icon-right" : ""}${
      config.flexGrow ? " flex-grow" : ""
    }`;
  }
  _buttonInner(config) {
    return !config
      ? ""
      : html`
          <p>
            <iron-icon aria-hidden="true" icon="${config.icon}"></iron-icon>
            <span class="${config.icon && !config.showText ? "sr-only" : ""}"
              >${config.text}</span
            >
          </p>
        `;
  }
  _buttonTooltip(config, top = false) {
    return !config || !config.id
      ? ""
      : html`
          <simple-tooltip
            for="${config.id}"
            position="${top ? "bottom" : "top"}"
            >${config.text}</simple-tooltip
          >
        `;
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "figures") this._updateSources();
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
    this._updateSources();
    this._loadPageSrc();
  }
  _loadPageSrc() {
    let src =
      this.figures && this.figures[this.page]
        ? this.figures[this.page].src
        : false;
    if (this.__imageLoader) this.__imageLoader.remove();
    if (src) {
      this.__imageLoader = new Image();
      this.__imageLoader.onload = () => {
        this.loading = false;
        this.loaded = true;
        if (this.__imageLoader) this.__imageLoader.remove();
      };
      this.__imageLoader.onerror = () => {
        this.loading = false;
        this.loaded = false;
        if (this.__imageLoader) this.__imageLoader.remove();
      };
      this.__imageLoader.src = src;
    }
    this.loading = !!src;
    this.loaded = false;
  }

  _updateSources() {
    if (this.figures.length > 0) {
      let figs = (this.figures || []).map(fig => fig.src);
      this.src = figs[this.page];
      this.sources = figs.slice(1);
    }
  }
  /**
   * overrides fullscreen API
   *
   * @param {boolean} toggle on or off, default is opposite current state
   */
  _setFullscreen(mode) {
    return;
  }

  _toolbarButtonClick(buttonId, eventType) {
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
    if (buttonId === "homebutton") this.resetZoom();
    if (buttonId === "panupbutton") this.pan(0, 0.2);
    if (buttonId === "pandownbutton") this.pan(0, -0.2);
    if (buttonId === "panleftbutton") this.pan(0.2, 0);
    if (buttonId === "panrightbutton") this.pan(-0.2, 0);
    if (buttonId === "zoominbutton") this.zoomIn(0.2);
    if (buttonId === "zoomoutbutton") this.zoomOut(0.2);
    if (buttonId === "rotateccwbutton") this.rotate(-90);
    if (buttonId === "rotatecwbutton") this.rotate(90);
    if (buttonId === "navigatorbutton")
      this.navigatorToggled = !this.navigatorToggled;
    if (buttonId === "fullscreenbutton") this.toggleFullscreen();
    if (buttonId === "flipbutton") this.flipToggled = !this.flipToggled;
    if (buttonId === "infobutton") {
      this.kbdToggled = false;
      this.infoToggled = !this.infoToggled;
    }
    if (buttonId === "kbdbutton") {
      this.infoToggled = false;
      this.kbdToggled = !this.kbdToggled;
    }
    if (buttonId === "nextbutton") {
      this.page = Math.min(this.page + 1, this.pages.length - 1);
    }
    if (buttonId === "prevbutton") {
      this.page = Math.max(0, this.page - 1);
    }
  }
  goToPageXofY(e) {
    this._toolbarButtonClick("navXofY", e);
    this.page = e.path[0].value - 1;
  }
}
window.customElements.define(ImgViewViewer.tag, ImgViewViewer);
export { ImgViewViewer };
