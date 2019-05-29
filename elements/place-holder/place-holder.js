import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `place-holder`
 * Placeholder for a piece of media in the future
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - placeholder is a grey block on the page which can respond to drag and drop
 */
class PlaceHolder extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/editor-icons.js");
    import("@polymer/iron-icons/notification-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    import("@polymer/iron-icons/device-icons.js");
    import("@polymer/iron-icons/image-icons.js");
    afterNextRender(this, function() {
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(PlaceHolder.haxProperties, PlaceHolder.tag, this);
    });
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          border: none;
          transition: 0.2s all linear;
        }
        :host([drag-over]) {
          border: 4px dashed #2196f3;
        }
        .placeholder-inner {
          text-align: center;
          padding: 16px;
          color: var(--simple-colors-default-theme-grey-11, #222222);
          background-color: var(--simple-colors-default-theme-grey-2, #eeeeee);
        }
        iron-icon.placeholder-icon {
          margin: 0 auto;
          width: 50%;
          height: 50%;
          display: block;
        }
        .placeholder-text {
          line-height: 24px;
          font-size: 24px;
          font-style: italic;
        }
      </style>
      <div class="placeholder-inner">
        <iron-icon icon="[[iconFromType]]" class="placeholder-icon"></iron-icon>
        <span class="placeholder-text">[[calcText]]</span>
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
        type: String,
        computed: "_getIconFromType(type, dragOver)"
      },
      /**
       * Text place holder for describing this place holder element.
       */
      text: {
        type: String,
        value: ""
      },
      /**
       * Calculate text based on the type in the event we have no default.
       */
      calcText: {
        type: String,
        computed: "_getCalcText(text, type, dragOver)"
      },
      /**
       * A media type to visualize and also bubble events off of.
       */
      type: {
        type: String,
        value: "text"
      },
      /**
       * Bind dragging state to a variable so we can apply CSS.
       */
      dragOver: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
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
      return "Upload file";
    } else if (text === "") {
      return "Place holder for " + type + ".";
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
   * Attached to the DOM, now fire.
   */
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
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
    });
  }
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
          author: "LRNWebComponents"
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
          }
        ],
        advanced: []
      },
      saveOptions: {
        wipeSlot: true
      }
    };
  }
}
window.customElements.define(PlaceHolder.tag, PlaceHolder);
export { PlaceHolder };
