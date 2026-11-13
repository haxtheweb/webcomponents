/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
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
class PlaceHolder extends I18NMixin(DDD) {
  /**
   * LitElement render styles
   */
  static get styles() {
    return [
      super.styles,
      css`
        /* editorial-only block: a short dashed row so it never reads as
           content (icon tile, bold text, muted directions) */
        :host {
          display: block;
          border: none;
        }
        .wrapper {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4);
          text-align: start;
          font-family: var(--ddd-font-primary);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          background-color: transparent;
          border: var(--ddd-border-sm);
          border-style: dashed;
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          transition:
            background-color var(--ddd-duration-normal, 0.3s) linear,
            border-color var(--ddd-duration-normal, 0.3s) linear;
        }
        /* drop target: navy dashed border and a light blue fill */
        :host([drag-over]) .wrapper {
          border: var(
            --place-holder-drag-over-border,
            var(--ddd-border-size-sm) dashed
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
          );
          background-color: light-dark(
            var(--ddd-theme-default-skyMaxLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-skyBlue) 24%,
              transparent
            )
          );
        }
        .icon-tile {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: 48px;
          height: 48px;
          border-radius: var(--ddd-radius-md);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-limestoneGray) 20%,
              transparent
            )
          );
        }
        :host([drag-over]) .icon-tile {
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        simple-icon {
          display: block;
          margin: 0;
          --simple-icon-width: var(--ddd-icon-xxs);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .copy {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1 1 auto;
          min-width: 0;
        }
        .text {
          line-height: var(--ddd-lh-120);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          margin: 0;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          overflow-wrap: anywhere;
        }
        .directions {
          line-height: var(--ddd-lh-140);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          overflow-wrap: anywhere;
        }
        .directions:empty {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .wrapper {
            transition: none;
          }
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
        <span class="icon-tile"
          ><simple-icon icon="${this.iconFromType}"></simple-icon
        ></span>
        <div class="copy">
          <div class="text" aria-live="polite">${this.calcText}</div>
          <div class="directions">${this.directions}</div>
        </div>
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
  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive iconFromType + calcText in willUpdate so reactive sets batch
    // into the current update cycle. Setting them in updated() scheduled
    // a redundant second update (Lit change-in-update warning).
    if (changedProperties.has("type") || changedProperties.has("dragOver")) {
      this.iconFromType = this._getIconFromType(this.type, this.dragOver);
    }
    if (
      changedProperties.has("text") ||
      changedProperties.has("type") ||
      changedProperties.has("dragOver") ||
      changedProperties.has("t")
    ) {
      this.calcText = this._getCalcText(this.text, this.type, this.dragOver);
    }
  }

  /**
   * Fire an event for things to react to above us
   */
  fireReplaceEvent(_e) {
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
      return this.t.dropFileToUpload;
    } else if (text === "") {
      return this.t.placeholderFor.replace("{type}", () => type);
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
        case "audio":
          return "av:music-video";
        case "video":
          return "notification:ondemand-video";
        case "image":
          return "image:crop-original";
        case "math":
          return "editor:functions";
        case "text":
        default:
          return "editor:format-align-left";
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
    this.t = {
      ...this.t,
      dragAndDropToReplace: "Drag and drop file to replace",
      dropFileToUpload: "Drop file to upload",
      placeholderFor: "Placeholder for {type}",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/place-holder.en.json", import.meta.url).href +
        "/../",
    });
    // translated default; an authored directions value is left alone
    this.i18nDefault("directions", "dragAndDropToReplace");
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
      } catch {
        // intentionally empty
      }
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
          "Other",
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
