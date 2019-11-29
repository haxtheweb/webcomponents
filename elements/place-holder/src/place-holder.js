import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { html, css } from "lit-element/lit-element.js";
/**
 * `place-holder`
 * Placeholder for a piece of media in the future
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - placeholder is a grey block on the page which can respond to drag and drop
 */
class PlaceHolder extends SimpleColors {
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          border: none;
          transition: 0.2s all linear;
        }
        :host([drag-over]) {
          border: var(--place-holder-drag-over-border, 4px dashed #2196f3);
        }
        .wrapper {
          text-align: center;
          padding: 16px;
          color: var(--simple-colors-default-theme-grey-11, #222222);
          background-color: var(--simple-colors-default-theme-grey-2, #eeeeee);
        }
        iron-icon {
          margin: 0 auto;
          width: 50%;
          height: 50%;
          display: block;
        }
        .text {
          line-height: 24px;
          font-size: 24px;
        }
        .directions {
          line-height: 16px;
          font-size: 16px;
          font-style: italic;
        }
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <div class="wrapper">
        <iron-icon icon="${this.iconFromType}"></iron-icon>
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
      /**
       * calculate an icon based on the type that was used
       */
      iconFromType: {
        type: String
      },
      /**
       * Text place holder for describing this place holder element.
       */
      text: {
        type: String
      },
      directions: {
        type: String
      },
      /**
       * Calculate text based on the type in the event we have no default.
       */
      calcText: {
        type: String
      },
      /**
       * A media type to visualize and also bubble events off of.
       */
      type: {
        type: String
      },
      /**
       * Bind dragging state to a variable so we can apply CSS.
       */
      dragOver: {
        type: Boolean,
        reflect: true,
        attribute: "drag-over"
      }
    };
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
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
        detail: this.type
      })
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
   * for the place holder.
   */
  _getIconFromType(type, dragOver) {
    if (!dragOver) {
      switch (type) {
        case "document":
          import("@polymer/iron-icons/editor-icons.js");
          return "editor:insert-drive-file";
          break;
        case "audio":
          import("@polymer/iron-icons/av-icons.js");
          return "av:music-video";
          break;
        case "video":
          import("@polymer/iron-icons/notification-icons.js");
          return "notification:ondemand-video";
          break;
        case "image":
          import("@polymer/iron-icons/image-icons.js");
          return "image:crop-original";
          break;
        case "math":
          import("@polymer/iron-icons/editor-icons.js");
          return "editor:functions";
          break;
        case "text":
        default:
          import("@polymer/iron-icons/editor-icons.js");
          return "editor:format-align-left";
          break;
      }
    } else {
      import("@polymer/iron-icons/iron-icons.js");
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
    this.type = "text";
    this.dragOver = false;
    this.directions = "Double click or drag and drop file to replace";
    this.addEventListener("dragover", function(e) {
      this.dragOver = true;
      e.preventDefault();
      e.stopPropagation();
      this.classList.add("dragover");
    });
    this.addEventListener("dragleave", function(e) {
      this.dragOver = false;
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove("dragover");
    });
    // self bind a drop event enough though something else
    // will need to step in and do something with this.
    // We are just making sure that this doesn't redirect the browser.
    this.addEventListener("drop", function(e) {
      this.dragOver = false;
      e.preventDefault();
      e.stopPropagation();
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
              detail: e
            })
          );
        }
      } catch (e) {}
    });
    this.addEventListener("dblclick", this.fireReplaceEvent.bind(this));
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    this.removeEventListener("dragover", function(e) {
      this.dragOver = true;
      e.preventDefault();
      e.stopPropagation();
      this.classList.add("dragover");
    });

    this.removeEventListener("dragleave", function(e) {
      this.dragOver = false;
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove("dragover");
    });
    // self bind a drop event enough though something else
    // will need to step in and do something with this.
    // We are just making sure that this doesn't redirect the browser.
    this.removeEventListener("drop", function(e) {
      this.dragOver = false;
      e.preventDefault();
      e.stopPropagation();
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
              detail: e
            })
          );
        }
      } catch (e) {}
    });
    this.removeEventListener("dblclick", this.fireReplaceEvent.bind(this));
    super.disconnectedCallback();
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
        title: "Placeholder",
        description:
          "A place holder that can be converted into the media type that's been selected",
        icon: "image:transform",
        color: "grey",
        groups: ["Placeholder"],
        handles: [],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [],
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
              math: "Math"
            }
          },
          {
            property: "text",
            title: "Text",
            description: "Identify the place holder desired in greater detail",
            inputMethod: "textfield",
            required: false
          }
        ],
        advanced: []
      },
      saveOptions: {
        unsetAttributes: ["icon-from-type", "calc-text", "colors"],
        wipeSlot: true
      }
    };
  }
}
window.customElements.define(PlaceHolder.tag, PlaceHolder);
export { PlaceHolder };
