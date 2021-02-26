import { LitElement, html, css } from "lit-element/lit-element.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

/**
 * `word-count`
 * `Count the words on whatever this wraps`
 *
 * @demo demo/index.html
 * @element word-count
 */
class WordCount extends I18NMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host:after {
          content: attr(words-text);
          position: var(--word-count-position, relative);
          display: var(--word-count-display, flex);
          flex-direction: var(--word-count-flex-direction, row-reverse);
          margin: var(--word-count-margin, 12px);
          font-size: var(--word-count-font-size, 10px);
          transition: var(--word-count-transition, 0.3s font-size, color ease);
          line-height: var(--word-count-line-height, 16px);
          color: var(--word-count-color, #888888);
        }
        :host(:hover):after,
        :host(:focus):after,
        :host(:active):after {
          font-size: var(--word-count-font-size-hover, 12px);
          font-weight: var(--word-count-font-weight-hover, bold);
          color: var(--word-count-color-hover, #000000);
        }
        .screen-reader-text {
          border: 0;
          clip: rect(1px, 1px, 1px, 1px);
          clip-path: inset(50%);
          height: 1px;
          margin: -1px;
          width: 1px;
          overflow: hidden;
          position: absolute !important;
          word-wrap: normal !important;
        }
      `,
    ];
  }
  render() {
    return html`
      <slot></slot>
      <div class="screen-reader-text">${this.wordsPrefix}: ${this.words}</div>
    `;
  }
  static get tag() {
    return "word-count";
  }
  constructor() {
    super();
    this.wordsPrefix = "Word count";
    this.t = {
      wordsPrefix: this.wordsPrefix,
    };
    this.registerTranslation({
      context: this,
      basePath: import.meta.url,
      locales: ["es", "fr", "ja"],
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.__observer = new MutationObserver(this._updateWords.bind(this));
    this.__observer.observe(this, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  }
  disconnectedCallback() {
    this.__observer.disconnect();
    super.disconnectedCallback();
  }
  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has("t")) {
      this.wordsPrefix = this.t.wordsPrefix;
    }
    if (changedProperties.has("wordsPrefix")) {
      this.t = {
        wordsPrefix: this.wordsPrefix,
      };
      [];
      this.setAttribute("words-text", `${this.wordsPrefix}: ${this.words}`);
    }
    if (changedProperties.has("words")) {
      this.setAttribute("words-text", `${this.wordsPrefix}: ${this.words}`);
    }
  }
  static get properties() {
    return {
      ...super.properties,
      words: { type: Number },
      wordsPrefix: { type: String, attribute: "words-prefix" },
    };
  }
  /**
   * Update words based on data in the slot.
   */
  _updateWords(mutations) {
    if (this.textContent !== "") {
      this.words = parseInt(this.textContent.split(/\s+/g).length - 1);
    } else {
      this.words = 0;
    }
  }
}
window.customElements.define(WordCount.tag, WordCount);
export { WordCount };
