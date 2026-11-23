/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { AbsolutePositionBehavior } from "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
/**
  * `simple-popover`
  * a popover that is positioned next to a target element
  *
 ### Accessibility

 The popover's content is a non-modal `role="dialog"` named by, in order:
 the host's `aria-label`, its `title`, or the first heading slotted into it.
 When none of those exist it falls back to `role="group"`, so an unnamed
 dialog is never exposed. Set `content-role` when the popover only wraps
 another widget (`none` for a listbox) or needs a specific role.
  *
 ### Styling
 
 `<simple-popover>` provides the following custom properties
 for styling:
 
 Custom property | Description | Default
 ----------------|-------------|----------
 `--simple-popover-border-radius` | popover border-radius | 3px
 `--simple-popover-color` | popover text color| #222
 `--simple-popover-padding` | popover padding | 10px
 `--simple-popover-background-color` | popover background-color | white
 `--simple-popover-border-color` | popover border-color | #bbb
 `--simple-popover-box-shadow` | popover box-shadow | rgba(60, 64, 67, 0.3) 0px 4px 8px 3px;
  *
  * @element simple-popover
  * @demo demo/index.html
  * @demo ./demo/tour.html Tour
  */
class SimplePopover extends AbsolutePositionBehavior {
  static get properties() {
    return {
      ...super.properties,
      /**
       * Accessible name for the popover's content. Consumers wire this by
       * setting aria-label on the simple-popover host (the host title
       * attribute, then the first slotted heading, are fallbacks). A name
       * set only on the host never reaches shadow DOM nodes, so the value
       * is forwarded to the inner #content div.
       */
      title: {
        type: String,
        reflect: true,
      },
      ariaLabel: {
        type: String,
        reflect: true,
        attribute: "aria-label",
      },
      /**
       * Role of the content wrapper. Defaults to a non-modal "dialog"
       * when a name is available, "group" otherwise. Use "none" when the
       * popover only wraps another named widget, such as a listbox.
       */
      contentRole: {
        type: String,
        attribute: "content-role",
      },
      __slottedName: {
        type: String,
      },
    };
  }

  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host([hidden]) {
          display: none;
        }

        :host > div {
          display: flex;
          flex-direction: column-reverse;
          justify-content: stretch;
          z-index: 1;
        }

        :host([position="left"]) > div {
          justify-content: flex-start;
          flex-direction: row;
        }

        :host([position="right"]) > div {
          justify-content: flex-end;
          flex-direction: row-reverse;
        }

        :host([position="top"]) > div {
          flex-direction: column;
        }

        :host > div > * {
          width: 100%;
        }

        :host([position="left"]) > div > *,
        :host([position="right"]) > div > * {
          width: unset;
        }

        :host {
          pointer-events: none;
        }

        #content {
          margin: 0;
          pointer-events: all;
          min-height: var(--simple-popover-min-height, 20px);
          max-height: var(--simple-popover-max-height, auto);
          scroll-behavior: smooth;
          border-radius: var(
            --simple-popover-border-radius,
            var(--ddd-radius-xs, 4px)
          );
          border: var(
            --simple-popover-border,
            1px solid
              var(--simple-popover-border-color, light-dark(black, white))
          );
          color: var(
            --simple-popover-color,
            var(--simple-popover-border-color, light-dark(black, white))
          );
          background-color: var(
            --simple-popover-background-color,
            light-dark(white, black)
          );
          padding: var(--simple-popover-padding, 10px);
          box-shadow: var(
            --simple-popover-box-shadow,
            rgba(60, 64, 67, 0.3) 0px 4px 8px 3px
          );
        }

        #pointer-outer {
          margin: -1px;
        }

        #pointer {
          width: 20px;
          height: 20px;
          position: relative;
          overflow: hidden;
          flex: 0 0 20px;
        }

        #pointer:after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: var(
            --simple-popover-background-color,
            light-dark(white, black)
          );
          border: 1px solid
            var(--simple-popover-border-color, light-dark(black, white));
          transform: rotate(45deg);
          top: 15px;
          left: 5px;
        }

        :host([position="top"]) #pointer:after {
          top: -5px;
          left: 5px;
        }

        :host([position="right"]) #pointer:after {
          top: 5px;
          left: 15px;
        }

        :host([position="left"]) #pointer:after {
          top: 5px;
          left: -5px;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div>
      <div
        id="content"
        role="${this._contentRole()}"
        aria-label=${ifDefined(
          this._contentRole() === "none" ? undefined : this._contentName(),
        )}
        part="simple-popover-content"
      >
        <slot @slotchange="${this._findSlottedName}"></slot>
      </div>
      <div id="pointer-outer">
        <div id="pointer" .style=${this._getMargins(this.__positions)}></div>
      </div>
    </div>`;
  }

  constructor() {
    super();
    this.offset = -10;
    this.fitToVisibleBounds = true;
    // Reposition whenever the popover's content box changes size.
    // The popover is positioned absolutely and its vertical centering
    // (setAlign in absolute-position-state-manager) depends on its own
    // height. Content (e.g. hax-element-demo previews) is injected
    // asynchronously after the popover opens, so the height measured at
    // open time is stale and the popover is placed too low, then grows
    // downward instead of re-centering on the target. ResizeObserver
    // fires after layout but before paint, so repositioning here keeps
    // the popover aligned with its target without a visible flash.
    // Setting top/left does not change border-box size, so there is no
    // feedback loop.
    this.__popoverResizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (!this.hidden) {
              this.updatePosition();
            }
          })
        : null;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.__popoverResizeObserver) {
      this.__popoverResizeObserver.observe(this);
    }
  }
  disconnectedCallback() {
    if (this.__popoverResizeObserver) {
      this.__popoverResizeObserver.disconnect();
    }
    super.disconnectedCallback();
  }

  /**
   * name for the content wrapper: author label, title, then slotted heading
   * @returns {string|undefined}
   */
  _contentName() {
    return this.ariaLabel || this.title || this.__slottedName || undefined;
  }
  /**
   * role for the content wrapper; an unnamed dialog is never exposed
   * @returns {string}
   */
  _contentRole() {
    if (this.contentRole) {
      if (
        (this.contentRole === "dialog" || this.contentRole === "alertdialog") &&
        !this._contentName()
      ) {
        return "group";
      }
      return this.contentRole;
    }
    return this._contentName() ? "dialog" : "group";
  }
  /**
   * use the first slotted heading as a fallback name
   * @param {Event} e slotchange event
   */
  _findSlottedName(e) {
    const slot = e && e.target ? e.target : null;
    let name;
    if (slot && slot.assignedElements) {
      const sel = "h1,h2,h3,h4,h5,h6,[role='heading']";
      slot.assignedElements({ flatten: true }).forEach((el) => {
        if (name) return;
        const h = el.matches(sel) ? el : el.querySelector(sel);
        if (h && h.textContent.trim() !== "") {
          name = h.textContent.trim().replace(/\s+/g, " ");
        }
      });
    }
    this.__slottedName = name;
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-popover";
  }
  /**
   * sets pointer position based on popover and target middles
   *
   * @param {object} positions object that contains postions for popover and target
   * @returns {string} a string with margin styles to offset pointer
   */
  _getMargins(positions) {
    if (positions && positions.target) {
      let self = this.getBoundingClientRect(),
        h = this.position === "bottom" || this.position === "top",
        max = h ? self.width : self.height,
        sStart = h ? self.left : self.top,
        tStart = h ? positions.target.left : positions.target.top,
        tHalf = h ? positions.target.width / 2 : positions.target.height / 2,
        center = tStart + tHalf - 10,
        margin = Math.min(max - 20, Math.max(0, center - sStart)),
        style = h ? `margin: 0 0 0 ${margin}px;` : `margin: ${margin}px 0 0 0;`;
      return style;
    }
    return ``;
  }
}
globalThis.customElements.define(SimplePopover.tag, SimplePopover);
export { SimplePopover };
