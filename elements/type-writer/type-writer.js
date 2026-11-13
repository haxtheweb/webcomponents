/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
/**
 * `type-writer`
 * `typewritter effect`
 * based off of https://github.com/PolymerEl/type-writer
 *
 * @demo demo/index.html
 * @element type-writer
 */
class TypeWriter extends IntersectionObserverMixin(LitElement) {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          margin: 0px 0.1em;
        }

        @keyframes flickerAnimation {
          0% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }
        @-o-keyframes flickerAnimation {
          0% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }
        @-moz-keyframes flickerAnimation {
          0% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }
        @-webkit-keyframes flickerAnimation {
          0% {
            opacity: 1;
          }

          50% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        #cursor {
          display: none;
          opacity: 0;
        }

        :host([typing]) #cursor {
          display: inline;
          -webkit-animation: flickerAnimation 1s infinite;
          -moz-animation: flickerAnimation 1s infinite;
          -o-animation: flickerAnimation 1s infinite;
          animation: flickerAnimation 1s infinite;
        }

        /* nothing moves with prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          :host,
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
          }
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <span id="text"></span><span id="cursor">|</span>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,

      canEditSource: true,
      gizmo: {
        title: "Type writer",
        description: "typewritter effect",
        icon: "hardware:keyboard",
        color: "green",
        tags: ["Other", "interactive", "fancy", "Writer", "type"],
        handles: [],
        meta: {
          author: "HAXTheWeb",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "delay",
            title: "Delay",
            description: "Milliseconds to wait before typing starts.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "cursorDuration",
            title: "Cursor duration",
            description:
              "Milliseconds the cursor keeps blinking after the text is typed.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "text",
            title: "Text",
            description:
              "The text to type out once the element scrolls into view.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "speed",
            title: "Speed",
            description:
              "Milliseconds per character; lower numbers type faster.",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "typing",
            title: "Typing",
            description:
              "Show the blinking cursor; the element sets this while it types.",
            inputMethod: "boolean",
            required: false,
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["element-visible"],
      },
      demoSchema: [
        {
          tag: "type-writer",
          properties: {},
          content: "",
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      delay: {
        type: Number,
      },
      cursorDuration: {
        type: Number,
        attribute: "cursor-duration",
      },
      text: {
        type: String,
      },
      speed: {
        type: Number,
      },
      // elementVisible is provided by IntersectionObserverMixin with
      // reflect: true and attribute: "element-visible". Redeclaring it here
      // without those options would clobber the mixin's reflection config.
      eraseSpeed: {
        type: Number,
        attribute: "erase-speed",
      },
      typing: {
        type: Boolean,
        reflect: true,
      },
      _length: {
        type: Number,
      },
      _oldText: {
        type: String,
      },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "type-writer";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.delay = 100;
    this.cursorDuration = 0;
    this.speed = 150;
    this.eraseSpeed = 80;
    this.typing = false;
  }

  _observeText(text, delay, elementVisible) {
    if (text && delay !== undefined && elementVisible) {
      if (this.shadowRoot.querySelector("#text").textContent) {
        this._oldText = this.shadowRoot.querySelector("#text").textContent;
        if (this.typing && this._cancel) {
          clearTimeout(this._cancel);
          this._cancel = null;
        }
        return this.erase();
      }
      this._length = 0;
      setTimeout(() => {
        this.type();
      }, this.delay);
    }
  }

  type() {
    this.typing = true;
    this.shadowRoot.querySelector("#text").textContent = this.text.substr(
      0,
      this._length++,
    );
    if (this._length < this.text.length + 1) {
      this._cancel = setTimeout(
        () => {
          this.type();
        },
        this.speed + ((Math.random() - 0.5) * this.speed) / 2,
      );
      return;
    }
    setTimeout(() => {
      this.typing = false;
      this.dispatchEvent(
        new CustomEvent("type-writer-end", {
          detail: this.text,
          bubbles: true,
          composed: true,
        }),
      );
    }, this.cursorDuration);
  }

  erase() {
    this.typing = true;
    this.shadowRoot.querySelector("#text").textContent = this._oldText.substr(
      0,
      this._length--,
    );
    if (this._length >= 0) {
      this._cancel = setTimeout(() => {
        this.erase();
      }, this.eraseSpeed || this.speed);
      return;
    }
    this.type();
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["text", "delay", "elementVisible"].includes(propName)) {
        this._observeText(this.text, this.delay, this.elementVisible);
      }
    });
  }
}
globalThis.customElements.define(TypeWriter.tag, TypeWriter);
export { TypeWriter };
