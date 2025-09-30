import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `place-holder`
 * @element place-holder
 * Placeholder for a piece of media in the future
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - placeholder is a grey block on the page which can respond to drag and drop
 */
class PlaceHolder extends DDD {
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          border: none;
          transition: 0.3s all linear;
        }
        :host([drag-over]) {
          border: var(--place-holder-drag-over-border, var(--ddd-border-lg) dashed var(--ddd-theme-default-info));
        }
        .wrapper {
          text-align: center;
          padding: var(--ddd-spacing-4);
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
          border-radius: var(--ddd-radius-xs);
        }
        simple-icon {
          margin: 0 auto var(--ddd-spacing-2) auto;
          --simple-icon-width: 50%;
          --simple-icon-height: 50%;
          display: block;
        }
        .text {
          line-height: var(--ddd-lh-120);
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-medium);
          margin-bottom: var(--ddd-spacing-2);
        }
        .directions {
          line-height: var(--ddd-lh-120);
          font-size: var(--ddd-font-size-s);
          font-style: italic;
          color: var(--ddd-theme-default-coalyGray);
        }
      `,
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <div class="wrapper">
        <simple-icon
          icon="${this.iconFromType}"
        ></simple-icon>
        <div class="text">${this.calcText}</div>
        <div class="directions">${this.directions}</div>
      </div>
    `;
  }

  static get tag() {
    return "place-holder";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * calculate an icon based on the type that was used
       */
      iconFromType: {
        type: String,
      },
      /**
       * Text place holder for describing this place holder element.
       */
      text: {
        type: String,
      },
      directions: {
        type: String,
      },
      /**
       * Calculate text based on the type in the event we have no default.
       */
      calcText: {
        type: String,
      },
      /**
       * A media type to visualize and also bubble events off of.
       */
      type: {
        type: String,
      },
      /**
       * Bind dragging state to a variable so we can apply CSS.
       */
      dragOver: {
        type: Boolean,
        reflect: true,
        attribute: "drag-over",
      },
    };
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (["type", "dragOver"].includes(propName)) {
        this.iconFromType = this._getIconFromType(this.type, this.dragOver);
      }
      if (["text", "type", "dragOver"].includes(propName)) {
        this.calcText = this._getCalcText(this.text, this.type, this.dragOver);
      }
    });
  }

  /**
   * Fire an event for things to react to above us
   */
  fireReplaceEvent(e) {
    this.dispatchEvent(
      new CustomEvent("place-holder-replace", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this.type,
      }),
    );
  }

  /**
   * Get the calculated text based on text being empty and type being set.
   */
  _getCalcText(text, type, dragOver) {
    if (dragOver) {
      return "Drop file to upload";
    } else if (text === "") {
      return "Placeholder for " + type;
    } else {
      return text;
    }
  }
  /**
   * Generate an icon based on the media type selected
   */
  _getIconFromType(type, dragOver) {
    if (!dragOver) {
      switch (type) {
        case "document":
          return "editor:insert-drive-file";
          break;
        case "audio":
          return "av:music-video";
          break;
        case "video":
          return "notification:ondemand-video";
          break;
        case "image":
          return "image:crop-original";
          break;
        case "math":
          return "editor:functions";
          break;
        case "text":
        default:
          return "editor:format-align-left";
          break;
      }
    } else {
      // we are dragging, ignore icon
      return "icons:file-upload";
    }
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.text = "";
    this.iconFromType = "editor:format-align-left";
    this.type = "text";
    this.dragOver = false;
    this.directions = "Drag and drop file to replace";
    this.addEventListener("dragover", function (e) {
      this.dragOver = true;
      e.preventDefault();
      e.stopPropagation();
      this.classList.add("dragover");
    });
    this.addEventListener("dragleave", function (e) {
      this.dragOver = false;
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove("dragover");
    });
    // self bind a drop event enough though something else
    // will need to step in and do something with this.
    // We are just making sure that this doesn't redirect the browser.
    this.addEventListener("drop", function (e) {
      this.dragOver = false;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.classList.remove("dragover");
      // this helps ensure that what gets drag and dropped is a file
      // this prevents issues with selecting and dragging text (which triggers drag/drop)
      // as well as compatibility with things that are legit in a draggable state
      try {
        if (e.dataTransfer.items[0].kind === "file") {
          e.placeHolderElement = this;
          // fire this specialized event up so things like HAX can intercept
          this.dispatchEvent(
            new CustomEvent("place-holder-file-drop", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: e,
            }),
          );
        }
      } catch (e) {}
    });
  }
  /**
   * HAX
   */
  static get haxProperties() {
    return {
      canScale: false,
      canEditSource: false,
      gizmo: {
        title: "Placeholder",
        description:
          "A place holder that can be converted into the media type that's been selected",
        icon: "hax:placeholder-image",
        color: "grey",
        tags: [
          "Writing",
          "development",
          "authoring",
          "media",
          "image",
          "video",
          "audio",
          "document",
          "math",
          "text",
        ],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "type",
            title: "Type",
            description: "Type of gizmo that this accepts for replacement.",
            inputMethod: "select",
            options: {
              text: "Text / content",
              document: "Document / file",
              audio: "Audio",
              video: "Video",
              image: "Image",
              math: "Math",
            },
          },
          {
            property: "text",
            title: "Text",
            description: "Identify the place holder desired in greater detail",
            inputMethod: "textfield",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["icon-from-type", "calc-text", "colors"],
        wipeSlot: true,
      },
      demoSchema: [
        {
          tag: "place-holder",
          properties: {
            type: "image",
          },
          content: "",
        },
      ],
    };
  }
}
globalThis.customElements.define(PlaceHolder.tag, PlaceHolder);
export { PlaceHolder };
