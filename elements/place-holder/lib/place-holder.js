import "@polymer/polymer/polymer.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/notification-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "materializecss-styles/materializecss-styles.js";
import "hax-body-behaviors/hax-body-behaviors.js";
/**
`place-holder`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: `
    <style include="materializecss-styles-colors">
      :host {
        display: block;
        border: none;
        transition: .6s border ease-in-out;
      }
      :host[drag-over] {
        border: 4px dashed #2196F3;
      }
      .placeholder-inner {
        text-align: center;
        padding: 16px;
      }
      iron-icon.placeholder-icon {
        margin: 0 auto;
        width: 50%;
        height: 50%;
        display: block;
      }
      .placeholder-text {
        line-height: 16px;
        font-size: 12px;
        font-style: italic;
      }
    </style>
    <div class="placeholder-inner grey lighten-3 grey-text text-darken-3">
      <iron-icon icon="[[iconFromType]]" class="placeholder-icon"></iron-icon>
      <span class="placeholder-text">[[calcText]]</span>
    </div>
`,

  is: "place-holder",

  behaviors: [HAXBehaviors.PropertiesBehaviors],

  listeners: {
    dblclick: "fireReplaceEvent"
  },

  properties: {
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
  },

  /**
   * Fire an event for things to react to above us
   */
  fireReplaceEvent: function(e) {
    this.fire("place-holder-replace", this.type);
  },

  /**
   * Get the calculated text based on text being empty and type being set.
   */
  _getCalcText: function(text, type, dragOver) {
    if (dragOver) {
      return "Upload file";
    } else if (text === "") {
      return "Place holder for future " + type + ".";
    } else {
      return text;
    }
  },

  /**
   * Generate an icon based on the media type selected
   * for the place holder.
   */
  _getIconFromType: function(type, dragOver) {
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
  },

  /**
   * Attached event handlers for drag and drop.
   */
  ready: function() {
    if (typeof this.__dropAdded === typeof undefined) {
      this.__dropAdded = true;
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
            this.fire("place-holder-file-drop", e);
          }
        } catch (e) {}
      });
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Placeholder content",
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
    this.setHaxProperties(props);
  }
});
