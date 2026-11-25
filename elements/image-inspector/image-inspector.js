/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/img-pan-zoom/img-pan-zoom.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminControls } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
/**
 * `image-inspector`
 * `Zoom, Rotate, Mirror, Download, and View image`
 * @demo demo/index.html
 * @element image-inspector
 */
class ImageInspector extends I18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...HaxUiAdminTokens,
      ...HaxUiAdminScheme,
      ...HaxUiAdminControls,
      css`
        :host {
          display: block;
          overflow: hidden;
        }
        /* the toolbar uses the shared HAX UI button (.hax-ui-btn): a
           visible word beside its icon, a 3:1 edge, hover, a focus ring
           and the held-down overlay. The older --image-inspector-* hooks
           still recolor it from outside. */
        .internal-btn-wrap .hax-ui-btn {
          color: var(--image-inspector-color, var(--hax-ui-text));
          background-color: var(
            --image-inspector-background-color,
            var(--hax-ui-surface)
          );
          text-decoration: none;
        }
        .internal-btn-wrap .hax-ui-btn:hover {
          background-color: var(
            --image-inspector-background-color-active,
            var(--hax-ui-control-hover)
          );
        }
        /* mirror is a toggle: when on it wears the accent and an underline
           bar, so on reads differently from off without relying on color */
        .internal-btn-wrap .hax-ui-btn[aria-pressed="true"] {
          font-weight: var(--ddd-font-weight-bold, 700);
          /* words in the accent (beaver / sky light) keep 4.5:1 on the
             wash in both schemes; the strong accent is for the edge */
          color: var(--hax-ui-accent);
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
          box-shadow: inset 0 -3px 0 var(--hax-ui-accent-strong);
        }
        .internal-btn-wrap .hax-ui-btn[aria-pressed="true"]:active {
          box-shadow:
            inset 0 -3px 0 var(--hax-ui-accent-strong),
            inset 0 0 0 999px var(--hax-ui-pressed);
        }
        @media (prefers-reduced-motion: reduce) {
          .internal-btn-wrap .hax-ui-btn {
            transition: none;
          }
        }
        img-pan-zoom.top-rotated {
          top: var(--ddd-spacing-30, 150px);
          pointer-events: none; /** disable pointer events when rotated bc of HTML canvas issue */
          height: var(--image-inspector-height-rotated, 600px);
        }
        img-pan-zoom {
          --img-pan-zoom-height: var(--image-inspector-height, 600px);
        }
        .wrap {
          justify-content: center;
          display: flex;
          margin-bottom: var(--ddd-spacing-3, 12px);
        }
        /* one toolbar group; wraps on narrow screens so every label stays */
        .internal-btn-wrap {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: var(--hax-ui-gap);
          padding: var(--hax-ui-gap);
          border: 1px solid
            var(--image-inspector-border-color, var(--hax-ui-line));
          border-radius: var(--ddd-radius-sm, 8px);
          background-color: var(
            --image-inspector-background-color,
            var(--hax-ui-surface)
          );
        }
      `,
    ];
  }
  constructor() {
    super();
    this.noLeft = false;
    this.degrees = 0;
    this.mirrored = false;
    this.src = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      rotateRight: "Rotate right",
      mirrorImage: "Mirror image",
      openInNewWindow: "Open in new window",
      imageTools: "Image tools",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/image-inspector.en.json", import.meta.url).href +
        "/../",
    });
  }
  render() {
    return html`
      <div class="wrap">
        <div
          class="internal-btn-wrap"
          role="toolbar"
          aria-label="${this.t.imageTools}"
        >
          <button
            type="button"
            class="hax-ui-btn"
            data-action="zoom-in"
            @click="${this.zoomIn}"
          >
            <simple-icon-lite
              icon="zoom-in"
              aria-hidden="true"
            ></simple-icon-lite>
            <span>${this.t.zoomIn}</span>
          </button>
          <button
            type="button"
            class="hax-ui-btn"
            data-action="zoom-out"
            @click="${this.zoomOut}"
          >
            <simple-icon-lite
              icon="zoom-out"
              aria-hidden="true"
            ></simple-icon-lite>
            <span>${this.t.zoomOut}</span>
          </button>
          <button
            type="button"
            class="hax-ui-btn"
            data-action="rotate-right"
            @click="${this.rotateRight}"
          >
            <simple-icon-lite
              icon="image:rotate-right"
              aria-hidden="true"
            ></simple-icon-lite>
            <span>${this.t.rotateRight}</span>
          </button>
          <button
            type="button"
            class="hax-ui-btn"
            data-action="mirror"
            aria-pressed="${this.mirrored ? "true" : "false"}"
            @click="${this.mirrorImage}"
          >
            <simple-icon-lite
              icon="image:flip"
              aria-hidden="true"
            ></simple-icon-lite>
            <span>${this.t.mirrorImage}</span>
          </button>
          <a
            class="hax-ui-btn"
            data-action="open"
            href="${this.src}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite
              icon="launch"
              aria-hidden="true"
            ></simple-icon-lite>
            <span>${this.t.openInNewWindow}</span>
          </a>
          <slot name="toolbar"></slot>
        </div>
      </div>
      <img-pan-zoom id="img" src="${this.src}"></img-pan-zoom>
      <slot></slot>
    `;
  }

  static get tag() {
    return "image-inspector";
  }

  static get properties() {
    return {
      noLeft: {
        type: Boolean,
        attribute: "no-left",
      },
      /**
       * Rotation of the image in degrees, changed by the rotate buttons.
       */
      degrees: {
        type: Number,
        reflect: true,
      },
      /**
       * Whether the image is mirrored, toggled by the mirror button.
       */
      mirrored: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Address of the image to inspect.
       */
      src: {
        type: String,
      },
      /**
       * Hover class for button styling
       */
      hoverClass: {
        type: String,
        attribute: "hover-class",
      },
    };
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__img = this.shadowRoot.querySelector("#img");
  }
  /**
   * Rotation and mirroring share one transform, so turning one never
   * undoes the other.
   */
  _applyTransform() {
    if (!this.__img) return;
    const parts = [];
    if (this.degrees % 360 !== 0) {
      parts.push("rotate(" + this.degrees + "deg)");
    }
    if (this.mirrored) {
      parts.push("scaleX(-1)");
    }
    this.__img.style.transform = parts.join(" ");
  }
  /**
   * Rotate the image to the right.
   */
  rotateRight() {
    // spin 90
    this.degrees += 90;
    this._applyTransform();
    if (this.__img.classList.contains("top-rotated")) {
      this.__img.classList.remove("top-rotated");
    } else {
      this.__img.classList.add("top-rotated");
    }
  }

  /**
   * Flip the image; a toggle, so the button reports it with aria-pressed.
   */
  mirrorImage() {
    this.mirrored = !this.mirrored;
    this._applyTransform();
  }

  /**
   * Zoom in by calling  downstream function.
   */
  zoomIn() {
    this.__img.zoomIn();
  }

  /**
   * Zoom out by calling downstream function.
   */
  zoomOut() {
    this.__img.zoomOut();
  }
}
globalThis.customElements.define(ImageInspector.tag, ImageInspector);
export { ImageInspector };
