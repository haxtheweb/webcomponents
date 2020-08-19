/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPickerBehaviors } from "./rich-text-editor-picker.js";
/**
 * `rich-text-editor-symbol-picker`
 * a symbol picker for the rich-text-editor
 *
 * @element rich-text-editor-symbol-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorSymbolPicker extends RichTextEditorPickerBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   *
   */
  static get tag() {
    return "rich-text-editor-symbol-picker";
  }

  static get styles() {
    return [
      ...super.styles
    ];
  }

  // render function for template
  render() {
    return super.render();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Symbol types to include
       */
      symbolTypes: {
        name: "symbolTypes",
        type: Array
      }
    };
  }

  constructor() {
    super();
    this.icon = "editor:functions";
    this.label = "Insert symbol";
    this.symbolTypes = ["symbols", "math", "characters", "greek", "misc"];
    this.titleAsHtml = true;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._setOptions();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "titleAsHtml" && !this.titleAsHtml)
        this.titleAsHtml = true;
      if (propName === "symbolTypes") this._setOptions();
    });
  }

  /**
   * gets a list of icons and load them in a format
   * that the simple-picker can take;
   * if no icons are provided, loads a list from iron-meta
   *
   * @param {array} a list of custom icons for the picker
   * @param {array} default list of icons for the picker
   * @param {boolean} allow a null value for the picker
   */
  _getPickerOptions(options = [], allowNull = false, icon = null) {
    let temp = super._getPickerOptions(options, allowNull, icon);
    temp[0].unshift({ alt: null, icon: this.icon, value: null });
    return temp;
  }

  /**
   * Handles default options loaded from an external js file
   */
  _setOptions() {
    let optData = [];
    this.symbolTypes.forEach(type => {
      optData = [...optData, ...this.symbols[type]].flat();
    });
    this.options = this._getPickerOptions(optData, this.allowNull, this.icon);
  }

  /**
   * Converts option data to picker option data;
   * can be overridden in extended elements
   *
   * @param {object} data about the option
   * @returns {object} picker dato for the option
   */
  _getOptionData(option) {
    return {
      value: option,
      alt: option,
      icon: null,
      style: null
    };
  }
  get symbols(){
    return {
      symbols: [
        "&iexcl;",
        "&cent;",
        "&pound;",
        "&curren;",
        "&yen;",
        "&brvbar;",
        "&sect;",
        "&uml;",
        "&copy;",
        "&ordf;",
        "&laquo;",
        "&not;",
        "&shy;",
        "&reg;",
        "&macr;",
        "&deg;",
        "&plusmn;",
        "&sup2;",
        "&sup3;",
        "&acute;",
        "&micro;",
        "&para;",
        "&cedil;",
        "&sup1;",
        "&ordm;",
        "&raquo;",
        "&frac14;",
        "&frac12;",
        "&frac34;",
        "&iquest;",
        "&times;",
        "&divide;"
      ],
      math: [
        "&forall;",
        "&part;",
        "&exist;",
        "&empty;",
        "&nabla;",
        "&isin;",
        "&notin;",
        "&ni;",
        "&prod;",
        "&sum;",
        "&minus;",
        "&lowast;",
        "&radic;",
        "&prop;",
        "&infin;",
        "&ang;",
        "&and;",
        "&or;",
        "&cap;",
        "&cup;",
        "&int;",
        "&there4;",
        "&sim;",
        "&cong;",
        "&asymp;",
        "&ne;",
        "&equiv;",
        "&le;",
        "&ge;",
        "&sub;",
        "&sup;",
        "&nsub;",
        "&sube;",
        "&supe;",
        "&oplus;",
        "&otimes;",
        "&perp;",
        "&sdot;"
      ],
      characters: [
        "&Agrave;",
        "&Aacute;",
        "&Acirc;",
        "&Atilde;",
        "&Auml;",
        "&Aring;",
        "&AElig;",
        "&Ccedil;",
        "&Egrave;",
        "&Eacute;",
        "&Ecirc;",
        "&Euml;",
        "&Igrave;",
        "&Iacute;",
        "&Icirc;",
        "&Iuml;",
        "&ETH;",
        "&Ntilde;",
        "&Ograve;",
        "&Oacute;",
        "&Ocirc;",
        "&Otilde;",
        "&Ouml;",
        "&Oslash;",
        "&Ugrave;",
        "&Uacute;",
        "&Ucirc;",
        "&Uuml;",
        "&Yacute;",
        "&THORN;",
        "&szlig;",
        "&agrave;",
        "&aacute;",
        "&acirc;",
        "&atilde;",
        "&auml;",
        "&aring;",
        "&aelig;",
        "&ccedil;",
        "&egrave;",
        "&eacute;",
        "&ecirc;",
        "&euml;",
        "&igrave;",
        "&iacute;",
        "&icirc;",
        "&iuml;",
        "&eth;",
        "&ntilde;",
        "&ograve;",
        "&oacute;",
        "&ocirc;",
        "&otilde;",
        "&ouml;",
        "&oslash;",
        "&ugrave;",
        "&uacute;",
        "&ucirc;",
        "&uuml;",
        "&yacute;",
        "&thorn;",
        "&yuml;"
      ],
      greek: [
        "&Alpha;",
        "&Beta;",
        "&Gamma;",
        "&Delta;",
        "&Epsilon;",
        "&Zeta;",
        "&Eta;",
        "&Theta;",
        "&Iota;",
        "&Kappa;",
        "&Lambda;",
        "&Mu;",
        "&Nu;",
        "&Xi;",
        "&Omicron;",
        "&Pi;",
        "&Rho;",
        "&Sigma;",
        "&Tau;",
        "&Upsilon;",
        "&Phi;",
        "&Chi;",
        "&Psi;",
        "&Omega;",
        "&alpha;",
        "&beta;",
        "&gamma;",
        "&delta;",
        "&epsilon;",
        "&zeta;",
        "&eta;",
        "&theta;",
        "&iota;",
        "&kappa;",
        "&lambda;",
        "&mu;",
        "&nu;",
        "&xi;",
        "&omicron;",
        "&pi;",
        "&rho;",
        "&sigmaf;",
        "&sigma;",
        "&tau;",
        "&upsilon;",
        "&phi;",
        "&chi;",
        "&psi;",
        "&omega;",
        "&thetasym;",
        "&upsih;",
        "&piv;",
        "&otilde;",
        "&ouml;",
        "&oslash;",
        "&ugrave;",
        "&uacute;",
        "&ucirc;",
        "&uuml;",
        "&yacute;",
        "&thorn;",
        "&yuml;"
      ],
      misc: [
        "&OElig;",
        "&oelig;",
        "&Scaron;",
        "&scaron;",
        "&Yuml;",
        "&fnof;",
        "&circ;",
        "&tilde;",
        "&ensp;",
        "&emsp;",
        "&thinsp;",
        "&zwnj;",
        "&zwj;",
        "&lrm;",
        "&rlm;",
        "&ndash;",
        "&mdash;",
        "&lsquo;",
        "&rsquo;",
        "&sbquo;",
        "&ldquo;",
        "&rdquo;",
        "&bdquo;",
        "&dagger;",
        "&Dagger;",
        "&bull;",
        "&hellip;",
        "&permil;",
        "&prime;",
        "&Prime;",
        "&lsaquo;",
        "&rsaquo;",
        "&oline;",
        "&euro;",
        "&trade;",
        "&larr;",
        "&uarr;",
        "&rarr;",
        "&darr;",
        "&harr;",
        "&crarr;",
        "&lceil;",
        "&rceil;",
        "&lfloor;",
        "&rfloor;",
        "&loz;",
        "&spades;",
        "&clubs;",
        "&hearts;",
        "&diams;",
        "&upsih;",
        "&piv;",
        "&otilde;",
        "&ouml;",
        "&oslash;",
        "&ugrave;",
        "&uacute;",
        "&ucirc;",
        "&uuml;",
        "&yacute;",
        "&thorn;",
        "&yuml;"
      ]
    };
  }
}
window.customElements.define(
  RichTextEditorSymbolPicker.tag,
  RichTextEditorSymbolPicker
);
export { RichTextEditorSymbolPicker };
