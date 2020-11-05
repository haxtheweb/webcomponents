/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

/**
 * `magazine-cover`
 * `A Magazine cover element`
 *  Example:
 *  ```html
 *  <magazine-cover image="demo/picture2.jpg" header="Sunset" action="Click, Breath, Relax" link="https://www.elmsln.org/">
 *    A simple time, a simple life. America may be fast paced and brutal on health but in Canada, people enjoy sitting and watching the sunset. Learn how Canadians manage stress.
 *  </magazine-cover>
 *  ```
 * @demo demo/index.html
 * @element magazine-cover
 */
class MagazineCover extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: #222222;
          overflow: hidden;
          --magazine-cover-text-color: #eeeeee;
        }
        .overlay {
          left: 0;
          right: 0;
          min-height: 30vh;
          margin: -38vh 0 0 0;
          background-color: rgba(0, 0, 0, 0.8);
          padding: 32px;
          position: relative;
        }
        #image {
          opacity: 0.5;
          filter: alpha(opacity=50);
          transition: opacity 0.3s linear;
          width: 100%;
          height: 80vh;
          background-color: #222222;
        }
        #image:hover {
          opacity: 0.9;
          filter: alpha(opacity=90);
        }
        #header {
          color: var(--magazine-cover-text-color);
          font-size: 48px;
          padding: 0;
          margin: 0;
          font-weight: bold;
        }
        #subheader {
          color: var(--magazine-cover-text-color);
          font-size: 22.4px;
          padding: 0;
          margin: 3.2px 0 16px 0;
          font-style: italic;
          font-weight: normal;
        }
        #body {
          color: var(--magazine-cover-text-color);
          padding: 0;
          margin: 0;
          font-size: 19.2px;
          padding: 0 0 0 3.2px;
          margin: 0 0 32px 0;
        }
        #body p {
          color: var(--magazine-cover-text-color);
        }
        #action {
          color: var(--magazine-cover-text-color);
          text-transform: none;
          font-size: 24px;
          font-style: italic;
          font-weight: bold;
          background-color: #000000;
          border: 1px solid var(--magazine-cover-text-color);
          border-radius: 8px;
          transition: background 0.3s linear;
          width: 100%;
          margin: 0;
        }
        #action:hover,
        #action:focus {
          border-color: #ffffff;
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.2);
        }
        #actionlink {
          color: var(--magazine-cover-text-color);
          display: flex;
          text-decoration: none;
          border-radius: 8px;
        }
        #icon {
          display: inline-block;
          width: 19.2px;
          height: 19.2px;
          font-size: 19.2px;
          margin-left: 8px;
        }
        #label {
          text-shadow: -1px 1px 2px #000000;
        }
        @media screen and (max-width: 900px) {
          #header {
            font-size: 32px;
          }
          #subheader {
            font-size: 16px;
          }
          #body {
            font-size: 16px;
          }
          #action {
            font-size: 19.2px;
          }
        }
        @media screen and (max-width: 650px) {
          #body {
            font-size: 12.8px;
          }
          #action {
            font-size: 16px;
          }
          .overlay {
            margin: -50vh 0 0 0;
            padding: 16px;
          }
        }
      `,
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.action = "Touch to learn more";
    this.icon = "trending-flat";
    this.link = "";
    this.eventName = "";
    this.eventData = {};
    import("@polymer/iron-image/iron-image.js");
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <iron-image
        src="${this.image}"
        preload=""
        fade=""
        sizing="cover"
        id="image"
        aria-describedby="${this.describedBy || ""}"
      ></iron-image>
      <div class="overlay">
        <h2 id="header" ?hidden="${!this.header}">${this.header}</h2>
        <div id="subheader" ?hidden="${!this.subheader}">${this.subheader}</div>
        <div id="body">
          <p ?hidden="${!this.text}">${this.text}</p>
          <slot></slot>
        </div>
        <a
          tabindex="-1"
          href="${this.link}"
          id="actionlink"
          @click="${this._linkTapped}"
        >
          <button raised="" id="action">
            <span id="label"
              >${this.action}<simple-icon
                accent-color="grey"
                dark
                id="icon"
                icon="${this.icon}"
                ?hidden="${!this.icon}"
              ></simple-icon
            ></span>
          </button>
        </a>
      </div>
    `;
  }
  /**
   * convention
   */
  static get tag() {
    return "magazine-cover";
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      /**
       * Title / heading
       */
      header: {
        type: String,
      },
      /**
       * A secondary title
       */
      subheader: {
        type: String,
      },
      /**
       * Internal text.
       */
      text: {
        type: String,
      },
      /**
       * Title / heading
       */
      image: {
        type: String,
      },
      /**
       * Call to action
       */
      action: {
        type: String,
      },
      /**
       * aria-describedby attribute
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
      /**
       * Call to action icon
       */
      icon: {
        type: String,
      },
      /**
       * Link to go to on click.
       */
      link: {
        type: String,
      },
      /**
       * Optional event binding for the button press.
       */
      eventName: {
        type: String,
        attribute: "event-name",
      },
      /**
       * Optional event data to send along
       */
      eventData: {
        type: Object,
        attribute: "event-data",
      },
    };
  }
  /**
   * Link tap, fire event if we have one
   */
  _linkTapped(e) {
    if (this.eventName !== "") {
      e.preventDefault();
      e.stopPropagation();
      this.dispatchEvent(
        new CustomEvent(this.eventName, {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this.eventData,
        })
      );
    }
  }
  /**
   * HAX
   */
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Cover image",
        description:
          "Present a full screen cover image with a call to action. Good for starting off a series of content",
        icon: "flip-to-front",
        color: "teal",
        groups: ["Image", "Presentation"],
        handles: [
          {
            type: "image",
            source: "image",
            title: "header",
            caption: "subheader",
            citation: "subheader",
            description: "text",
            ariaDescribedby: "describedBy",
          },
        ],
        meta: {
          author: "ELMS:LN",
        },
      },
      settings: {
        quick: [
          {
            property: "image",
            title: "Image",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url",
          },
          {
            property: "link",
            title: "Link",
            description: "The URL for the action.",
            inputMethod: "textfield",
            icon: "send",
            required: true,
            validationType: "url",
          },
          {
            property: "header",
            title: "Header",
            description: "Primary header",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true,
          },
          {
            property: "subheader",
            title: "Sub-header",
            description: "Secondary header",
            inputMethod: "textfield",
            icon: "editor:text-fields",
          },
        ],
        configure: [
          {
            property: "image",
            title: "Image",
            description: "The URL for the image.",
            inputMethod: "haxupload",
            icon: "link",
            required: true,
            validationType: "url",
          },
          {
            property: "header",
            title: "Header",
            description: "Primary header",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true,
          },
          {
            property: "subheader",
            title: "Sub-header",
            description: "Secondary header",
            inputMethod: "textfield",
            icon: "editor:text-fields",
          },
          {
            property: "text",
            title: "Text",
            description: "Secondary header",
            inputMethod: "textfield",
            icon: "editor:text-fields",
          },
          {
            property: "action",
            title: "Call to action",
            description: "Text that lives on the button",
            inputMethod: "textfield",
            icon: "trending-flat",
          },
          {
            property: "link",
            title: "URL",
            description: "Enter URL for your action link",
            inputMethod: "haxupload",
            icon: "send",
          },
          {
            property: "icon",
            title: "Action icon",
            description: "Icon used for the call to action",
            inputMethod: "iconpicker",
            options: [
              "icons:trending-flat",
              "icons:launch",
              "icons:pan-tool",
              "icons:link",
              "icons:check",
              "icons:favorite",
              "icons:thumb-up",
              "icons:send",
            ],
          },
        ],
        advanced: [
          {
            property: "describedBy",
            title: "aria-describedby",
            description:
              "Space-separated list of IDs for elements that describe the image.",
            inputMethod: "textfield",
          },
          {
            property: "event-name",
            title: "Event name",
            description: "Name of the event to fire",
            inputMethod: "textfield",
          },
          {
            property: "event-data",
            title: "Event data (JSON)",
            description: "JSON blob of data to send along",
            inputMethod: "code-editor",
          },
        ],
      },
    };
  }
}
window.customElements.define(MagazineCover.tag, MagazineCover);
export { MagazineCover };
